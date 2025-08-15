import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { quoteSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { quoteNumber: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (status) where.status = status
    if (clientId) where.clientId = clientId

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        include: {
          client: {
            select: { id: true, name: true, email: true }
          },
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.quote.count({ where })
    ])

    return ApiResponseHandler.success({
      quotes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return ApiResponseHandler.serverError('فشل في جلب العروض')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = quoteSchema.parse(body)

    const quote = await prisma.quote.create({
      data: {
        ...validatedData,
        createdBy: 'user-id', // سيتم استبداله بـ user ID الفعلي
      },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return ApiResponseHandler.success(quote, 'تم إنشاء العرض بنجاح')
  } catch (error) {
    console.error('Error creating quote:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 