import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status && status !== 'all') {
      where.status = status
    }

    if (category && category !== 'all') {
      where.category = category
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          company: true,
          creditLimit: true,
          createdAt: true,
          updatedAt: true,
          // _count سيتم إضافته لاحقاً
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.supplier.count({ where })
    ])

    // تنسيق البيانات
    const formattedSuppliers = suppliers.map(supplier => ({
      ...supplier,
      purchaseOrderCount: 0, // سيتم حسابه لاحقاً
      invoiceCount: 0 // سيتم حسابه لاحقاً
    }))

    return ApiResponseHandler.success({
      suppliers: formattedSuppliers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    logger.error('خطأ في جلب الموردين', { error })
    return ApiResponseHandler.serverError('خطأ في جلب الموردين')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      email, 
      phone, 
      address, 
      company, 
      category, 
      creditLimit, 
      paymentTerms,
      status = 'active'
    } = body

    // التحقق من البيانات المطلوبة
    if (!name || !email) {
      return ApiResponseHandler.validationError(['الاسم والبريد الإلكتروني مطلوبان'])
    }

    // التحقق من وجود المورد
    const existingSupplier = await prisma.supplier.findFirst({
      where: {
        OR: [
          { email },
          { phone: phone || '' }
        ]
      }
    })

    if (existingSupplier) {
      return ApiResponseHandler.validationError(['البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل'])
    }

    // إنشاء المورد الجديد
    const supplier = await prisma.supplier.create({
             data: {
         name,
         email,
         phone,
         address,
         company,
         // category سيتم إضافته لاحقاً
         creditLimit: creditLimit ? parseFloat(creditLimit) : 0,
         // paymentTerms سيتم إضافته لاحقاً
         // status سيتم إضافته لاحقاً
         createdBy: 'system' // سيتم تحديثه لاحقاً
       }
    })

    logger.logSystemEvent('إنشاء مورد جديد', { 
      supplierId: supplier.id, 
      name, 
      email,
      category 
    })

    return ApiResponseHandler.success(supplier, 'تم إنشاء المورد بنجاح')
  } catch (error) {
    logger.error('خطأ في إنشاء المورد', { error })
    return ApiResponseHandler.serverError('خطأ في إنشاء المورد')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return ApiResponseHandler.validationError(['معرف المورد مطلوب'])
    }

    // التحقق من وجود المورد
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id }
    })

    if (!existingSupplier) {
      return ApiResponseHandler.notFound('المورد غير موجود')
    }

    // التحقق من عدم تكرار البريد الإلكتروني أو الهاتف
    if (updateData.email || updateData.phone) {
      const duplicateCheck = await prisma.supplier.findFirst({
        where: {
          OR: [
            { email: updateData.email },
            { phone: updateData.phone }
          ],
          NOT: { id }
        }
      })

      if (duplicateCheck) {
        return ApiResponseHandler.validationError(['البريد الإلكتروني أو رقم الهاتف مستخدم من قبل مورد آخر'])
      }
    }

    const supplier = await prisma.supplier.update({
      where: { id },
      data: updateData
    })

    logger.logSystemEvent('تحديث مورد', { 
      supplierId: id, 
      updates: updateData 
    })

    return ApiResponseHandler.success(supplier, 'تم تحديث المورد بنجاح')
  } catch (error) {
    logger.error('خطأ في تحديث المورد', { error })
    return ApiResponseHandler.serverError('خطأ في تحديث المورد')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return ApiResponseHandler.validationError(['معرف المورد مطلوب'])
    }

    // التحقق من عدم وجود طلبات شراء مرتبطة
    const purchaseOrdersCount = await prisma.purchaseOrder.count({
      where: { supplierId: id }
    })

    if (purchaseOrdersCount > 0) {
      return ApiResponseHandler.validationError([
        `لا يمكن حذف المورد لأنه مرتبط بـ ${purchaseOrdersCount} طلب شراء`
      ])
    }

    // التحقق من عدم وجود فواتير مرتبطة
    const invoicesCount = 0 // سيتم حسابه لاحقاً

    if (invoicesCount > 0) {
      return ApiResponseHandler.validationError([
        `لا يمكن حذف المورد لأنه مرتبط بـ ${invoicesCount} فاتورة`
      ])
    }

    await prisma.supplier.delete({
      where: { id }
    })

    logger.logSystemEvent('حذف مورد', { supplierId: id })
    return ApiResponseHandler.success(null, 'تم حذف المورد بنجاح')
  } catch (error) {
    logger.error('خطأ في حذف المورد', { error })
    return ApiResponseHandler.serverError('خطأ في حذف المورد')
  }
}

// الحصول على فئات الموردين
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'getCategories') {
      // سيتم إضافة الفئات لاحقاً
      const categories: any[] = []
      return ApiResponseHandler.success(categories)
    }

    return ApiResponseHandler.validationError(['إجراء غير مدعوم'])
  } catch (error) {
    logger.error('خطأ في الحصول على فئات الموردين', { error })
    return ApiResponseHandler.serverError('خطأ في الحصول على فئات الموردين')
  }
} 