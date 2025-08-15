import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { alertSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'
import { withAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const isRead = searchParams.get('isRead')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { message: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (type) where.type = type
    if (isRead !== null) where.isRead = isRead === 'true'

    const [alerts, total] = await Promise.all([
      prisma.alert.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.alert.count({ where })
    ])

    return ApiResponseHandler.success({
      alerts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return ApiResponseHandler.serverError('فشل في جلب التنبيهات')
  }
}

export const POST = withAuth(async (request: NextRequest, user: { id: string }) => {
  try {
    const body = await request.json()
    const validatedData = alertSchema.parse(body)

    const alert = await prisma.alert.create({
      data: {
        ...validatedData,
        userId: validatedData.userId ?? user.id,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return ApiResponseHandler.success(alert, 'تم إنشاء التنبيه بنجاح')
  } catch (error) {
    console.error('Error creating alert:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
})