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
    const method = searchParams.get('method')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (search) {
      where.OR = [
        { referenceNumber: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status && status !== 'all') {
      where.status = status
    }

    if (clientId) {
      where.clientId = clientId
    }

    if (method && method !== 'all') {
      where.method = method
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
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
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
              total: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.payment.count({ where })
    ])

    return ApiResponseHandler.success({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    logger.error('خطأ في جلب المدفوعات', { error })
    return ApiResponseHandler.serverError('خطأ في جلب المدفوعات')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      clientId, 
      invoiceId, 
      amount, 
      method, 
      referenceNumber, 
      notes,
      currency = 'LYD',
      paymentDate
    } = body

    // التحقق من البيانات المطلوبة
    if (!clientId || !amount || !method) {
      return ApiResponseHandler.validationError([
        'معرف العميل والمبلغ وطريقة الدفع مطلوبة'
      ])
    }

    // التحقق من وجود العميل
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    })

    if (!client) {
      return ApiResponseHandler.validationError(['العميل غير موجود'])
    }

    // التحقق من وجود الفاتورة إذا تم تحديدها
    let invoice = null
    if (invoiceId) {
      invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId }
      })

      if (!invoice) {
        return ApiResponseHandler.validationError(['الفاتورة غير موجودة'])
      }

      // التحقق من أن المبلغ لا يتجاوز باقي الفاتورة
      const paidAmount = await prisma.payment.aggregate({
        where: { invoiceId },
        _sum: { amount: true }
      })

      const remainingAmount = Number(invoice.total) - Number(paidAmount._sum.amount || 0)
      
      if (amount > remainingAmount) {
        return ApiResponseHandler.validationError([
          `المبلغ يتجاوز باقي الفاتورة (${remainingAmount} ${currency})`
        ])
      }
    }

    // إنشاء رقم مرجعي إذا لم يتم تحديده
    const finalReferenceNumber = referenceNumber || `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`

    // إنشاء الدفعة
    const payment = await prisma.payment.create({
                     data: {
                 clientId,
                 // clientName سيتم إضافته لاحقاً
                 invoiceId: invoiceId || null,
                 amount: parseFloat(amount),
                 method,
                 // referenceNumber سيتم إضافته لاحقاً
                 notes,
                 // currency سيتم إضافته لاحقاً
                 paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
                 status: 'COMPLETED',
                 createdBy: 'system' // سيتم تحديثه لاحقاً
               },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            total: true
          }
        }
      }
    })

    // تحديث حالة الفاتورة إذا تم دفعها بالكامل
    if (invoiceId) {
      const totalPaid = await prisma.payment.aggregate({
        where: { invoiceId },
        _sum: { amount: true }
      })

      const invoiceTotal = Number(invoice?.total || 0)
      const paidTotal = Number(totalPaid._sum.amount || 0)

      if (paidTotal >= invoiceTotal) {
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: 'PAID' }
        })

        logger.logSystemEvent('تم دفع الفاتورة بالكامل', { 
          invoiceId, 
          totalPaid: paidTotal,
          invoiceTotal 
        })
      }
    }

    logger.logFinancialOperation('دفع', amount, currency, undefined, {
      paymentId: payment.id,
      referenceNumber: finalReferenceNumber,
      clientId,
      invoiceId,
      method
    })

    return ApiResponseHandler.success(payment, 'تم إنشاء الدفعة بنجاح')
  } catch (error) {
    logger.error('خطأ في إنشاء الدفعة', { error })
    return ApiResponseHandler.serverError('خطأ في إنشاء الدفعة')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return ApiResponseHandler.validationError(['معرف الدفعة مطلوب'])
    }

    // التحقق من وجود الدفعة
    const existingPayment = await prisma.payment.findUnique({
      where: { id }
    })

    if (!existingPayment) {
      return ApiResponseHandler.notFound('الدفعة غير موجودة')
    }

    // لا يمكن تعديل الدفعات المكتملة
    if (existingPayment.status === 'COMPLETED') {
      return ApiResponseHandler.validationError(['لا يمكن تعديل الدفعات المكتملة'])
    }

    const payment = await prisma.payment.update({
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
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            total: true
          }
        }
      }
    })

    logger.logSystemEvent('تحديث دفعة', { 
      paymentId: id, 
      updates: updateData 
    })

    return ApiResponseHandler.success(payment, 'تم تحديث الدفعة بنجاح')
  } catch (error) {
    logger.error('خطأ في تحديث الدفعة', { error })
    return ApiResponseHandler.serverError('خطأ في تحديث الدفعة')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return ApiResponseHandler.validationError(['معرف الدفعة مطلوب'])
    }

    // التحقق من وجود الدفعة
    const payment = await prisma.payment.findUnique({
      where: { id }
    })

    if (!payment) {
      return ApiResponseHandler.notFound('الدفعة غير موجودة')
    }

    // لا يمكن حذف الدفعات المكتملة
    if (payment.status === 'COMPLETED') {
      return ApiResponseHandler.validationError(['لا يمكن حذف الدفعات المكتملة'])
    }

    await prisma.payment.delete({
      where: { id }
    })

    logger.logSystemEvent('حذف دفعة', { paymentId: id })
    return ApiResponseHandler.success(null, 'تم حذف الدفعة بنجاح')
  } catch (error) {
    logger.error('خطأ في حذف الدفعة', { error })
    return ApiResponseHandler.serverError('خطأ في حذف الدفعة')
  }
}

// تحديث حالة الدفعة
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, ...updateData } = body

    if (!id) {
      return ApiResponseHandler.validationError(['معرف الدفعة مطلوب'])
    }

    if (action === 'updateStatus') {
      const { status } = updateData
      
      if (!status) {
        return ApiResponseHandler.validationError(['الحالة مطلوبة'])
      }

      const payment = await prisma.payment.update({
        where: { id },
        data: { status },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
              total: true
            }
          }
        }
      })

      logger.logSystemEvent('تحديث حالة دفعة', { 
        paymentId: id, 
        newStatus: status 
      })

      return ApiResponseHandler.success(payment, 'تم تحديث حالة الدفعة بنجاح')
    }

    return ApiResponseHandler.validationError(['إجراء غير مدعوم'])
  } catch (error) {
    logger.error('خطأ في تحديث حالة الدفعة', { error })
    return ApiResponseHandler.serverError('خطأ في تحديث حالة الدفعة')
  }
} 