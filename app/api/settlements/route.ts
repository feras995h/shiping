import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { settlementSchema } from '@/lib/validations'
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
        { referenceNumber: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (status) where.status = status
    if (clientId) where.clientId = clientId

    const [settlements, total] = await Promise.all([
      prisma.settlement.findMany({
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
      prisma.settlement.count({ where })
    ])

    return ApiResponseHandler.success({
      settlements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching settlements:', error)
    return ApiResponseHandler.serverError('فشل في جلب المصالحات')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = settlementSchema.parse(body)

    const settlement = await prisma.settlement.create({
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

    return ApiResponseHandler.success(settlement, 'تم إنشاء المصالحة بنجاح')
  } catch (error) {
    console.error('Error creating settlement:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 