import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { discountSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const clientId = searchParams.get('clientId')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (type) where.type = type
    if (clientId) where.clientId = clientId

    const [discounts, total] = await Promise.all([
      prisma.discount.findMany({
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
      prisma.discount.count({ where })
    ])

    return ApiResponseHandler.success({
      discounts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching discounts:', error)
    return ApiResponseHandler.serverError('فشل في جلب الخصومات')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = discountSchema.parse(body)

    const discount = await prisma.discount.create({
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

    return ApiResponseHandler.success(discount, 'تم إنشاء الخصم بنجاح')
  } catch (error) {
    console.error('Error creating discount:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 