import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { trackingSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const shipmentId = searchParams.get('shipmentId')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { trackingNumber: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (status) where.status = status
    if (shipmentId) where.shipmentId = shipmentId

    const [tracking, total] = await Promise.all([
      prisma.tracking.findMany({
        where,
        include: {
          shipment: {
            select: { id: true, trackingNumber: true, origin: true, destination: true }
          },
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.tracking.count({ where })
    ])

    return ApiResponseHandler.success({
      tracking,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching tracking:', error)
    return ApiResponseHandler.serverError('فشل في جلب بيانات التتبع')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = trackingSchema.parse(body)

    const tracking = await prisma.tracking.create({
      data: {
        ...validatedData,
        createdBy: 'user-id', // سيتم استبداله بـ user ID الفعلي
      },
      include: {
        shipment: {
          select: { id: true, trackingNumber: true, origin: true, destination: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return ApiResponseHandler.success(tracking, 'تم إنشاء بيانات التتبع بنجاح')
  } catch (error) {
    console.error('Error creating tracking:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 