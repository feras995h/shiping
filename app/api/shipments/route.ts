import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { logger } from '@/lib/logger'
import { withAuth } from '@/lib/auth-middleware'

export const GET = withAuth(async (request: NextRequest, user: any) => {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const status = url.searchParams.get('status')
    const query = url.searchParams.get('query')
    const clientId = url.searchParams.get('clientId')
    const employeeId = url.searchParams.get('employeeId')

    const where: any = {}
    if (status && status !== 'all') where.status = status
    if (query) {
      where.OR = [
        { trackingNumber: { contains: query, mode: 'insensitive' } },
        { origin: { contains: query, mode: 'insensitive' } },
        { destination: { contains: query, mode: 'insensitive' } }
      ]
    }
    if (clientId) where.clientId = clientId
    if (employeeId) where.employeeId = employeeId

    const shipments = await prisma.shipment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        client: {
          select: { id: true, name: true, company: true }
        },
        employee: {
          select: { id: true, name: true }
        },
        currency: {
          select: { code: true, symbol: true }
        }
      }
    })

    const total = await prisma.shipment.count({ where })

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
    return ApiResponseHandler.serverError('فشل في جلب الشحنات')
  }
})

export const POST = withAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json()
    const { 
      clientId, 
      employeeId, 
      origin, 
      destination, 
      weight, 
      dimensions, 
      description, 
      cost, 
      price, 
      currencyId 
    } = body

    // توليد رقم تتبع فريد
    const trackingNumber = `SHP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const shipment = await prisma.shipment.create({
      data: {
        trackingNumber,
        clientId,
        employeeId,
        origin,
        destination,
        weight: parseFloat(weight),
        dimensions,
        description,
        cost: parseFloat(cost),
        price: parseFloat(price),
        profit: parseFloat(price) - parseFloat(cost),
        currencyId,
        createdBy: user.id,
        status: 'PENDING'
      }
    })

    logger.logSystemEvent('إنشاء شحنة جديدة', {
      shipmentId: shipment.id,
      trackingNumber,
      clientId,
      employeeId
    })

    return ApiResponseHandler.created(shipment)

  } catch (error) {
    logger.error('خطأ في إنشاء الشحنة', { error })
    return ApiResponseHandler.serverError('فشل في إنشاء الشحنة')
  }
})

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