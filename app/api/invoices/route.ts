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
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status && status !== 'all') {
      where.status = status
    }

    if (clientId) {
      where.clientId = clientId
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          shipment: {
            select: {
              id: true,
              trackingNumber: true,
              origin: true,
              destination: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.invoice.count({ where })
    ])

    return ApiResponseHandler.success({
      invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    logger.error('خطأ في جلب الفواتير', { error })
    return ApiResponseHandler.serverError('خطأ في جلب الفواتير')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      clientId, 
      shipmentId, 
      items, 
      dueDate, 
      notes,
      currency = 'LYD'
    } = body

    // التحقق من البيانات المطلوبة
    if (!clientId || !items || !Array.isArray(items) || items.length === 0) {
      return ApiResponseHandler.validationError([
        'معرف العميل وقائمة العناصر مطلوبة'
      ])
    }

    // التحقق من وجود العميل
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    })

    if (!client) {
      return ApiResponseHandler.validationError(['العميل غير موجود'])
    }

    // التحقق من وجود الشحنة إذا تم تحديدها
    let shipment = null
    if (shipmentId) {
      shipment = await prisma.shipment.findUnique({
        where: { id: shipmentId }
      })

      if (!shipment) {
        return ApiResponseHandler.validationError(['الشحنة غير موجودة'])
      }
    }

    // حساب المجاميع
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const tax = subtotal * 0.15 // ضريبة 15%
    const total = subtotal + tax

    // إنشاء رقم الفاتورة
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`

    // إنشاء الفاتورة
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientId,
        clientName: client.name,
        shipmentId: shipmentId || null,
        items: items.map(item => ({
          description: item.description,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          total: parseFloat(item.quantity) * parseFloat(item.unitPrice)
        })),
        subtotal,
        tax,
        total,
        currency,
        dueDate: dueDate ? new Date(dueDate) : null,
        notes,
        status: 'pending'
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        shipment: {
          select: {
            id: true,
            trackingNumber: true
          }
        }
      }
    })

    logger.logFinancialOperation('إنشاء فاتورة', total, currency, undefined, {
      invoiceId: invoice.id,
      invoiceNumber,
      clientId,
      shipmentId
    })

    return ApiResponseHandler.success(invoice, 'تم إنشاء الفاتورة بنجاح')
  } catch (error) {
    logger.error('خطأ في إنشاء الفاتورة', { error })
    return ApiResponseHandler.serverError('خطأ في إنشاء الفاتورة')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return ApiResponseHandler.validationError(['معرف الفاتورة مطلوب'])
    }

    // التحقق من وجود الفاتورة
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id }
    })

    if (!existingInvoice) {
      return ApiResponseHandler.notFound('الفاتورة غير موجودة')
    }

    // إعادة حساب المجاميع إذا تم تحديث العناصر
    if (updateData.items && Array.isArray(updateData.items)) {
      const subtotal = updateData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
      const tax = subtotal * 0.15
      const total = subtotal + tax

      updateData.subtotal = subtotal
      updateData.tax = tax
      updateData.total = total
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        shipment: {
          select: {
            id: true,
            trackingNumber: true
          }
        }
      }
    })

    logger.logSystemEvent('تحديث فاتورة', { 
      invoiceId: id, 
      updates: updateData 
    })

    return ApiResponseHandler.success(invoice, 'تم تحديث الفاتورة بنجاح')
  } catch (error) {
    logger.error('خطأ في تحديث الفاتورة', { error })
    return ApiResponseHandler.serverError('خطأ في تحديث الفاتورة')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return ApiResponseHandler.validationError(['معرف الفاتورة مطلوب'])
    }

    // التحقق من عدم وجود مدفوعات مرتبطة
    const paymentsCount = await prisma.payment.count({
      where: { invoiceId: id }
    })

    if (paymentsCount > 0) {
      return ApiResponseHandler.validationError([
        `لا يمكن حذف الفاتورة لأنها مرتبطة بـ ${paymentsCount} دفعة`
      ])
    }

    await prisma.invoice.delete({
      where: { id }
    })

    logger.logSystemEvent('حذف فاتورة', { invoiceId: id })
    return ApiResponseHandler.success(null, 'تم حذف الفاتورة بنجاح')
  } catch (error) {
    logger.error('خطأ في حذف الفاتورة', { error })
    return ApiResponseHandler.serverError('خطأ في حذف الفاتورة')
  }
}

// تحديث حالة الفاتورة
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, ...updateData } = body

    if (!id) {
      return ApiResponseHandler.validationError(['معرف الفاتورة مطلوب'])
    }

    if (action === 'updateStatus') {
      const { status } = updateData
      
      if (!status) {
        return ApiResponseHandler.validationError(['الحالة مطلوبة'])
      }

      const invoice = await prisma.invoice.update({
        where: { id },
        data: { status },
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

      logger.logSystemEvent('تحديث حالة فاتورة', { 
        invoiceId: id, 
        newStatus: status 
      })

      return ApiResponseHandler.success(invoice, 'تم تحديث حالة الفاتورة بنجاح')
    }

    return ApiResponseHandler.validationError(['إجراء غير مدعوم'])
  } catch (error) {
    logger.error('خطأ في تحديث حالة الفاتورة', { error })
    return ApiResponseHandler.serverError('خطأ في تحديث حالة الفاتورة')
  }
}
