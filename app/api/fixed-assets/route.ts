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
    const location = searchParams.get('location')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (category && category !== 'all') {
      where.category = category
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (location && location !== 'all') {
      where.location = location
    }

    const [assets, total] = await Promise.all([
      prisma.fixedAsset.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.fixedAsset.count({ where })
    ])

    return ApiResponseHandler.success({
      assets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    logger.error('خطأ في جلب الأصول الثابتة', { error })
    return ApiResponseHandler.serverError('خطأ في جلب الأصول الثابتة')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      description, 
      category, 
      purchaseDate, 
      cost,
      location,
      status = 'ACTIVE',
      createdBy
    } = body

    // التحقق من البيانات المطلوبة
    if (!name || !category || !cost || !createdBy) {
      return ApiResponseHandler.validationError([
        'اسم الأصل والفئة والتكلفة والمستخدم المنشئ مطلوبة'
      ])
    }

    // التحقق من وجود المستخدم
    const user = await prisma.user.findUnique({
      where: { id: createdBy }
    })

    if (!user) {
      return ApiResponseHandler.validationError(['المستخدم غير موجود'])
    }

    // إنشاء الأصل الجديد
    const asset = await prisma.fixedAsset.create({
      data: {
        name,
        description,
        category,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
        cost: parseFloat(cost),
        currentValue: parseFloat(cost),
        location,
        status,
        createdBy
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    logger.logSystemEvent('إنشاء أصل ثابت جديد', { 
      assetId: asset.id, 
      name, 
      category,
      cost
    })

    return ApiResponseHandler.success(asset, 'تم إنشاء الأصل بنجاح')
  } catch (error) {
    logger.error('خطأ في إنشاء الأصل', { error })
    return ApiResponseHandler.serverError('خطأ في إنشاء الأصل')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return ApiResponseHandler.validationError(['معرف الأصل مطلوب'])
    }

    // التحقق من وجود الأصل
    const existingAsset = await prisma.fixedAsset.findUnique({
      where: { id }
    })

    if (!existingAsset) {
      return ApiResponseHandler.notFound('الأصل غير موجود')
    }

    // التحقق من وجود المستخدم إذا تم تغييره
    if (updateData.createdBy) {
      const user = await prisma.user.findUnique({
        where: { id: updateData.createdBy }
      })

      if (!user) {
        return ApiResponseHandler.validationError(['المستخدم غير موجود'])
      }
    }

    const asset = await prisma.fixedAsset.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    logger.logSystemEvent('تحديث أصل ثابت', { 
      assetId: id, 
      updates: updateData 
    })

    return ApiResponseHandler.success(asset, 'تم تحديث الأصل بنجاح')
  } catch (error) {
    logger.error('خطأ في تحديث الأصل', { error })
    return ApiResponseHandler.serverError('خطأ في تحديث الأصل')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return ApiResponseHandler.validationError(['معرف الأصل مطلوب'])
    }

    // التحقق من عدم وجود علاقات مرتبطة (يمكن إضافة المزيد من الفحوصات هنا)
    // حالياً لا توجد نماذج مرتبطة في Prisma schema

    await prisma.fixedAsset.delete({
      where: { id }
    })

    logger.logSystemEvent('حذف أصل ثابت', { assetId: id })
    return ApiResponseHandler.success(null, 'تم حذف الأصل بنجاح')
  } catch (error) {
    logger.error('خطأ في حذف الأصل', { error })
    return ApiResponseHandler.serverError('خطأ في حذف الأصل')
  }
}

// إدارة الأصول
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'calculateDepreciation':
        const { assetId } = data
        
        if (!assetId) {
          return ApiResponseHandler.validationError(['معرف الأصل مطلوب'])
        }

        const asset = await prisma.fixedAsset.findUnique({
          where: { id: assetId }
        })

        if (!asset) {
          return ApiResponseHandler.notFound('الأصل غير موجود')
        }

        if (!asset.cost || !asset.depreciationRate) {
          return ApiResponseHandler.validationError([
            'التكلفة ومعدل الإهلاك مطلوبان لحساب الإهلاك'
          ])
        }

        const currentDate = new Date()
        const purchaseDate = asset.purchaseDate
        const yearsElapsed = (currentDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
        
        const depreciationAmount = (parseFloat(asset.cost.toString()) * parseFloat(asset.depreciationRate.toString()) / 100) * Math.min(yearsElapsed, 100)
        const currentValue = Math.max(0, parseFloat(asset.cost.toString()) - depreciationAmount)

        // تحديث القيمة الحالية
        const updatedAsset = await prisma.fixedAsset.update({
          where: { id: assetId },
          data: { currentValue }
        })

        logger.logSystemEvent('حساب إهلاك الأصل', { 
          assetId, 
          depreciationAmount,
          currentValue,
          yearsElapsed
        })

        return ApiResponseHandler.success({
          asset: updatedAsset,
          depreciation: {
            amount: depreciationAmount,
            yearsElapsed,
            currentValue
          }
        })

      case 'updateLocation':
        const { assetId: locationAssetId, newLocation } = data
        
        if (!locationAssetId || !newLocation) {
          return ApiResponseHandler.validationError([
            'معرف الأصل والموقع الجديد مطلوبان'
          ])
        }

        const locationAsset = await prisma.fixedAsset.findUnique({
          where: { id: locationAssetId }
        })

        if (!locationAsset) {
          return ApiResponseHandler.notFound('الأصل غير موجود')
        }

        const transferredAsset = await prisma.fixedAsset.update({
          where: { id: locationAssetId },
          data: { location: newLocation }
        })

        logger.logSystemEvent('تغيير موقع أصل ثابت', { 
          assetId: locationAssetId, 
          fromLocation: locationAsset.location,
          toLocation: newLocation
        })

        return ApiResponseHandler.success(transferredAsset, 'تم تغيير موقع الأصل بنجاح')

      case 'getAssetHistory':
        const { assetId: historyAssetId } = data
        
        if (!historyAssetId) {
          return ApiResponseHandler.validationError(['معرف الأصل مطلوب'])
        }

        // حالياً لا توجد نماذج للصيانة أو النقل في Prisma schema
        // يمكن إضافة هذه الوظائف لاحقاً عند إنشاء النماذج

        return ApiResponseHandler.success({
          message: 'تاريخ الأصل غير متوفر حالياً - يتطلب إنشاء نماذج إضافية'
        })

      default:
        return ApiResponseHandler.validationError(['إجراء غير مدعوم'])
    }
  } catch (error) {
    logger.error('خطأ في إدارة الأصول', { error })
    return ApiResponseHandler.serverError('خطأ في إدارة الأصول')
  }
} 