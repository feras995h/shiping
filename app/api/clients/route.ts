import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status && status !== 'all') {
      where.status = status
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              shipments: true,
              invoices: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.client.count({ where })
    ])

    // تنسيق البيانات
    const formattedClients = clients.map(client => ({
      ...client,
      shipmentCount: client._count.shipments,
      invoiceCount: client._count.invoices
    }))

    return ApiResponseHandler.success({
      clients: formattedClients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    logger.error('خطأ في جلب العملاء', { error })
    return ApiResponseHandler.serverError('خطأ في جلب العملاء')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, address, status = 'active' } = body

    // التحقق من البيانات المطلوبة
    if (!name || !email) {
      return ApiResponseHandler.validationError(['الاسم والبريد الإلكتروني مطلوبان'])
    }

    // التحقق من وجود العميل
    const existingClient = await prisma.client.findFirst({
      where: {
        OR: [
          { email },
          { phone: phone || '' }
        ]
      }
    })

    if (existingClient) {
      return ApiResponseHandler.validationError(['البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل'])
    }

    // إنشاء العميل الجديد
    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address,
        status
      }
    })

    logger.logSystemEvent('إنشاء عميل جديد', { clientId: client.id, name, email })
    return ApiResponseHandler.success(client, 'تم إنشاء العميل بنجاح')
  } catch (error) {
    logger.error('خطأ في إنشاء العميل', { error })
    return ApiResponseHandler.serverError('خطأ في إنشاء العميل')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return ApiResponseHandler.validationError(['معرف العميل مطلوب'])
    }

    // التحقق من وجود العميل
    const existingClient = await prisma.client.findUnique({
      where: { id }
    })

    if (!existingClient) {
      return ApiResponseHandler.notFound('العميل غير موجود')
    }

    // التحقق من عدم تكرار البريد الإلكتروني أو الهاتف
    if (updateData.email || updateData.phone) {
      const duplicateCheck = await prisma.client.findFirst({
        where: {
          OR: [
            { email: updateData.email },
            { phone: updateData.phone }
          ],
          NOT: { id }
        }
      })

      if (duplicateCheck) {
        return ApiResponseHandler.validationError(['البريد الإلكتروني أو رقم الهاتف مستخدم من قبل عميل آخر'])
      }
    }

    const client = await prisma.client.update({
      where: { id },
      data: updateData
    })

    logger.logSystemEvent('تحديث عميل', { clientId: id, updates: updateData })
    return ApiResponseHandler.success(client, 'تم تحديث العميل بنجاح')
  } catch (error) {
    logger.error('خطأ في تحديث العميل', { error })
    return ApiResponseHandler.serverError('خطأ في تحديث العميل')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return ApiResponseHandler.validationError(['معرف العميل مطلوب'])
    }

    // التحقق من عدم وجود شحنات مرتبطة
    const shipmentsCount = await prisma.shipment.count({
      where: { clientId: id }
    })

    if (shipmentsCount > 0) {
      return ApiResponseHandler.validationError([
        `لا يمكن حذف العميل لأنه مرتبط بـ ${shipmentsCount} شحنة`
      ])
    }

    await prisma.client.delete({
      where: { id }
    })

    logger.logSystemEvent('حذف عميل', { clientId: id })
    return ApiResponseHandler.success(null, 'تم حذف العميل بنجاح')
  } catch (error) {
    logger.error('خطأ في حذف العميل', { error })
    return ApiResponseHandler.serverError('خطأ في حذف العميل')
  }
}
