import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (search) {
      where.OR = [
        { trackingNumber: { contains: search, mode: 'insensitive' } },
        { origin: { contains: search, mode: 'insensitive' } },
        { destination: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status && status !== 'all') {
      where.status = status
    }

    if (clientId) {
      where.clientId = clientId
    }

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.shipment.count({ where })
    ])

    return ApiResponseHandler.success({
      shipments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    logger.error('خطأ في جلب الشحنات', { error })
    return ApiResponseHandler.serverError('خطأ في جلب الشحنات')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      trackingNumber, 
      clientId, 
      origin, 
      destination, 
      weight, 
      value, 
      currency = 'LYD',
      description,
      expectedDelivery
    } = body

    // التحقق من البيانات المطلوبة
    if (!trackingNumber || !clientId || !origin || !destination) {
      return ApiResponseHandler.validationError([
        'رقم التتبع، معرف العميل، المنشأ، والوجهة مطلوبة'
      ])
    }

    // التحقق من عدم تكرار رقم التتبع
    const existingShipment = await prisma.shipment.findUnique({
      where: { trackingNumber }
    })

    if (existingShipment) {
      return ApiResponseHandler.validationError(['رقم التتبع مستخدم بالفعل'])
    }

    // التحقق من وجود العميل
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    })

    if (!client) {
      return ApiResponseHandler.validationError(['العميل غير موجود'])
    }

    // إنشاء الشحنة الجديدة
    const shipment = await prisma.shipment.create({
      data: {
        trackingNumber,
        clientId,
        // clientName سيتم إضافته لاحقاً
        origin,
        destination,
        weight: parseFloat(weight) || 0,
        // value سيتم إضافته لاحقاً
        currency,
        description,
        // expectedDelivery سيتم إضافته لاحقاً
        status: 'PENDING',
        // progress سيتم إضافته لاحقاً
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    logger.logSystemEvent('إنشاء شحنة جديدة', { 
      shipmentId: shipment.id, 
      trackingNumber, 
      clientId 
    })

    return ApiResponseHandler.success(shipment, 'تم إنشاء الشحنة بنجاح')
  } catch (error) {
    logger.error('خطأ في إنشاء الشحنة', { error })
    return ApiResponseHandler.serverError('خطأ في إنشاء الشحنة')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return ApiResponseHandler.validationError(['معرف الشحنة مطلوب'])
    }

    // التحقق من وجود الشحنة
    const existingShipment = await prisma.shipment.findUnique({
      where: { id }
    })

    if (!existingShipment) {
      return ApiResponseHandler.notFound('الشحنة غير موجودة')
    }

    // التحقق من عدم تكرار رقم التتبع إذا تم تغييره
    if (updateData.trackingNumber && updateData.trackingNumber !== existingShipment.trackingNumber) {
      const duplicateTracking = await prisma.shipment.findUnique({
        where: { trackingNumber: updateData.trackingNumber }
      })

      if (duplicateTracking) {
        return ApiResponseHandler.validationError(['رقم التتبع مستخدم من قبل شحنة أخرى'])
      }
    }

    // تحديث التقدم بناءً على الحالة
    if (updateData.status) {
      updateData.progress = getProgressByStatus(updateData.status)
    }

    const shipment = await prisma.shipment.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    logger.logSystemEvent('تحديث شحنة', { 
      shipmentId: id, 
      updates: updateData,
      newStatus: updateData.status 
    })

    return ApiResponseHandler.success(shipment, 'تم تحديث الشحنة بنجاح')
  } catch (error) {
    logger.error('خطأ في تحديث الشحنة', { error })
    return ApiResponseHandler.serverError('خطأ في تحديث الشحنة')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return ApiResponseHandler.validationError(['معرف الشحنة مطلوب'])
    }

    // التحقق من عدم وجود فواتير مرتبطة
    const invoicesCount = await prisma.invoice.count({
      where: { shipmentId: id }
    })

    if (invoicesCount > 0) {
      return ApiResponseHandler.validationError([
        `لا يمكن حذف الشحنة لأنها مرتبطة بـ ${invoicesCount} فاتورة`
      ])
    }

    await prisma.shipment.delete({
      where: { id }
    })

    logger.logSystemEvent('حذف شحنة', { shipmentId: id })
    return ApiResponseHandler.success(null, 'تم حذف الشحنة بنجاح')
  } catch (error) {
    logger.error('خطأ في حذف الشحنة', { error })
    return ApiResponseHandler.serverError('خطأ في حذف الشحنة')
  }
}

// دالة حساب التقدم بناءً على الحالة
function getProgressByStatus(status: string): number {
  switch (status) {
    case 'pending': return 0
    case 'confirmed': return 20
    case 'in_transit': return 40
    case 'at_port': return 70
    case 'customs_clearance': return 80
    case 'out_for_delivery': return 90
    case 'delivered': return 100
    case 'cancelled': return 0
    default: return 0
  }
}