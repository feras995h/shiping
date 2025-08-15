import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const warehouseId = searchParams.get('warehouseId')
    const lowStock = searchParams.get('lowStock')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (category && category !== 'all') {
      where.category = category
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (warehouseId && warehouseId !== 'all') {
      where.warehouseId = warehouseId
    }

    if (lowStock === 'true') {
      where.quantity = {
        lte: where.minQuantity || 10
      }
    }

    const [items, total] = await Promise.all([
      prisma.inventoryItem.findMany({
        where,
        include: {
          warehouse: {
            select: {
              id: true,
              name: true,
              location: true
            }
          },
          supplier: {
            select: {
              id: true,
              name: true,
              company: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.inventoryItem.count({ where })
    ])

    return ApiResponseHandler.success({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    logger.error('خطأ في جلب المخزون', { error })
    return ApiResponseHandler.serverError('خطأ في جلب المخزون')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      sku, 
      description, 
      categoryId, 
      supplierId, 
      warehouseId, 
      quantity, 
      minQuantity = 10,
      maxQuantity = 1000,
      unitPrice,
      currency = 'LYD',
      brand,
      model,
      dimensions,
      weight,
      status = 'active'
    } = body

    // التحقق من البيانات المطلوبة
    if (!name || !sku || !categoryId || !warehouseId || quantity === undefined) {
      return ApiResponseHandler.validationError([
        'اسم المنتج والرمز والفئة والمستودع والكمية مطلوبة'
      ])
    }

    // التحقق من عدم تكرار SKU
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { sku }
    })

    if (existingItem) {
      return ApiResponseHandler.validationError(['رمز المنتج (SKU) مستخدم بالفعل'])
    }

    // التحقق من وجود الفئة
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return ApiResponseHandler.validationError(['الفئة غير موجودة'])
    }

    // التحقق من وجود المستودع
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: warehouseId }
    })

    if (!warehouse) {
      return ApiResponseHandler.validationError(['المستودع غير موجود'])
    }

    // التحقق من وجود المورد إذا تم تحديده
    if (supplierId) {
      const supplier = await prisma.supplier.findUnique({
        where: { id: supplierId }
      })

      if (!supplier) {
        return ApiResponseHandler.validationError(['المورد غير موجود'])
      }
    }

    // إنشاء المنتج الجديد
    const item = await prisma.inventoryItem.create({
      data: {
        name,
        sku,
        description,
        categoryId,
        supplierId,
        warehouseId,
        quantity: parseFloat(quantity),
        minQuantity: parseFloat(minQuantity),
        maxQuantity: parseFloat(maxQuantity),
        unitPrice: unitPrice ? parseFloat(unitPrice) : 0,
        currency,
        brand,
        model,
        dimensions,
        weight: weight ? parseFloat(weight) : 0,
        status
      },
      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
            location: true
          }
        },
        supplier: {
          select: {
            id: true,
            name: true,
            company: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    })

    logger.logSystemEvent('إنشاء منتج جديد في المخزون', { 
      itemId: item.id, 
      name, 
      sku,
      quantity,
      warehouseId
    })

    return ApiResponseHandler.success(item, 'تم إنشاء المنتج بنجاح')
  } catch (error) {
    logger.error('خطأ في إنشاء المنتج', { error })
    return ApiResponseHandler.serverError('خطأ في إنشاء المنتج')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return ApiResponseHandler.validationError(['معرف المنتج مطلوب'])
    }

    // التحقق من وجود المنتج
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id }
    })

    if (!existingItem) {
      return ApiResponseHandler.notFound('المنتج غير موجود')
    }

    // التحقق من عدم تكرار SKU إذا تم تغييره
    if (updateData.sku && updateData.sku !== existingItem.sku) {
      const duplicateSKU = await prisma.inventoryItem.findUnique({
        where: { sku: updateData.sku }
      })

      if (duplicateSKU) {
        return ApiResponseHandler.validationError(['رمز المنتج (SKU) مستخدم من قبل منتج آخر'])
      }
    }

    // التحقق من وجود الفئة إذا تم تغييرها
    if (updateData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: updateData.categoryId }
      })

      if (!category) {
        return ApiResponseHandler.validationError(['الفئة غير موجودة'])
      }
    }

    // التحقق من وجود المستودع إذا تم تغييره
    if (updateData.warehouseId) {
      const warehouse = await prisma.warehouse.findUnique({
        where: { id: updateData.warehouseId }
      })

      if (!warehouse) {
        return ApiResponseHandler.validationError(['المستودع غير موجود'])
      }
    }

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: updateData,
      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
            location: true
          }
        },
        supplier: {
          select: {
            id: true,
            name: true,
            company: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    })

    logger.logSystemEvent('تحديث منتج في المخزون', { 
      itemId: id, 
      updates: updateData 
    })

    return ApiResponseHandler.success(item, 'تم تحديث المنتج بنجاح')
  } catch (error) {
    logger.error('خطأ في تحديث المنتج', { error })
    return ApiResponseHandler.serverError('خطأ في تحديث المنتج')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return ApiResponseHandler.validationError(['معرف المنتج مطلوب'])
    }

    // التحقق من عدم وجود حركات مخزون مرتبطة
    const movementsCount = await prisma.inventoryMovement.count({
      where: { itemId: id }
    })

    if (movementsCount > 0) {
      return ApiResponseHandler.validationError([
        `لا يمكن حذف المنتج لأنه مرتبط بـ ${movementsCount} حركة مخزون`
      ])
    }

    await prisma.inventoryItem.delete({
      where: { id }
    })

    logger.logSystemEvent('حذف منتج من المخزون', { itemId: id })
    return ApiResponseHandler.success(null, 'تم حذف المنتج بنجاح')
  } catch (error) {
    logger.error('خطأ في حذف المنتج', { error })
    return ApiResponseHandler.serverError('خطأ في حذف المنتج')
  }
}

// إدارة المخزون
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'adjustStock':
        const { itemId, quantity, type, reason, userId } = data
        
        if (!itemId || quantity === undefined || !type || !reason) {
          return ApiResponseHandler.validationError([
            'معرف المنتج والكمية والنوع والسبب مطلوبة'
          ])
        }

        const item = await prisma.inventoryItem.findUnique({
          where: { id: itemId }
        })

        if (!item) {
          return ApiResponseHandler.notFound('المنتج غير موجود')
        }

        let newQuantity = item.quantity
        if (type === 'add') {
          newQuantity += parseFloat(quantity)
        } else if (type === 'subtract') {
          newQuantity -= parseFloat(quantity)
          if (newQuantity < 0) {
            return ApiResponseHandler.validationError([
              'الكمية المتوفرة غير كافية'
            ])
          }
        } else {
          return ApiResponseHandler.validationError(['نوع الحركة غير صحيح'])
        }

        // تحديث الكمية
        const updatedItem = await prisma.inventoryItem.update({
          where: { id: itemId },
          data: { quantity: newQuantity }
        })

        // تسجيل الحركة
        const movement = await prisma.inventoryMovement.create({
          data: {
            itemId,
            type,
            quantity: parseFloat(quantity),
            reason,
            previousQuantity: item.quantity,
            newQuantity,
            userId: userId || 'system'
          }
        })

        logger.logSystemEvent('تعديل مخزون', { 
          itemId, 
          type, 
          quantity, 
          reason,
          previousQuantity: item.quantity,
          newQuantity
        })

        return ApiResponseHandler.success({
          item: updatedItem,
          movement
        }, 'تم تعديل المخزون بنجاح')

      case 'getLowStockItems':
        const lowStockItems = await prisma.inventoryItem.findMany({
          where: {
            quantity: {
              lte: prisma.inventoryItem.fields.minQuantity
            }
          },
          include: {
            warehouse: {
              select: {
                id: true,
                name: true,
                location: true
              }
            },
            supplier: {
              select: {
                id: true,
                name: true,
                company: true
              }
            }
          }
        })

        return ApiResponseHandler.success(lowStockItems)

      case 'getStockMovements':
        const { itemId: movementItemId, startDate, endDate } = data
        
        if (!movementItemId) {
          return ApiResponseHandler.validationError(['معرف المنتج مطلوب'])
        }

        const where: any = { itemId: movementItemId }
        
        if (startDate && endDate) {
          where.createdAt = {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        }

        const movements = await prisma.inventoryMovement.findMany({
          where,
          orderBy: { createdAt: 'desc' }
        })

        return ApiResponseHandler.success(movements)

      default:
        return ApiResponseHandler.validationError(['إجراء غير مدعوم'])
    }
  } catch (error) {
    logger.error('خطأ في إدارة المخزون', { error })
    return ApiResponseHandler.serverError('خطأ في إدارة المخزون')
  }
}