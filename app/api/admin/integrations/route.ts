import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (type && type !== 'all') {
      where.type = type
    }
    
    if (status && status !== 'all') {
      where.status = status
    }

    const integrations = await prisma.integration.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return ApiResponseHandler.success({
      integrations,
      total: integrations.length,
      active: integrations.filter(i => i.status === 'active').length,
      error: integrations.filter(i => i.status === 'error').length
    })
  } catch (error) {
    logger.error('خطأ في جلب التكاملات', { error })
    return ApiResponseHandler.serverError('خطأ في جلب التكاملات')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, description, endpoint, config } = body

    // التحقق من وجود التكامل
    const existingIntegration = await prisma.integration.findUnique({
      where: { name }
    })

    if (existingIntegration) {
      return ApiResponseHandler.validationError(['اسم التكامل مستخدم بالفعل'])
    }

    // إنشاء التكامل الجديد
    const integration = await prisma.integration.create({
      data: {
        name,
        type,
        description,
        endpoint,
        config: config || {},
        status: 'testing',
        lastSync: new Date().toISOString(),
        syncInterval: 'كل 15 دقيقة'
      }
    })

    logger.logSystemEvent('إنشاء تكامل جديد', { integrationId: integration.id, name, type })
    return ApiResponseHandler.success(integration, 'تم إنشاء التكامل بنجاح')
  } catch (error) {
    logger.error('خطأ في إنشاء التكامل', { error })
    return ApiResponseHandler.serverError('خطأ في إنشاء التكامل')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const integration = await prisma.integration.update({
      where: { id },
      data: updateData
    })

    logger.logSystemEvent('تحديث تكامل', { integrationId: id, updates: updateData })
    return ApiResponseHandler.success(integration, 'تم تحديث التكامل بنجاح')
  } catch (error) {
    logger.error('خطأ في تحديث التكامل', { error })
    return ApiResponseHandler.serverError('خطأ في تحديث التكامل')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return ApiResponseHandler.validationError(['معرف التكامل مطلوب'])
    }

    await prisma.integration.delete({
      where: { id }
    })

    logger.logSystemEvent('حذف تكامل', { integrationId: id })
    return ApiResponseHandler.success(null, 'تم حذف التكامل بنجاح')
  } catch (error) {
    logger.error('خطأ في حذف التكامل', { error })
    return ApiResponseHandler.serverError('خطأ في حذف التكامل')
  }
}

// اختبار التكامل
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action } = body

    if (action === 'test') {
      const integration = await prisma.integration.findUnique({
        where: { id }
      })

      if (!integration) {
        return ApiResponseHandler.validationError(['التكامل غير موجود'])
      }

      // اختبار التكامل
      const testResult = await testIntegration(integration)
      
      // تحديث حالة التكامل
      await prisma.integration.update({
        where: { id },
        data: {
          status: testResult.success ? 'active' : 'error',
          lastSync: new Date().toISOString()
        }
      })

      logger.logSystemEvent('اختبار تكامل', { 
        integrationId: id, 
        name: integration.name, 
        success: testResult.success 
      })

      return ApiResponseHandler.success(testResult, 'تم اختبار التكامل بنجاح')
    }

    return ApiResponseHandler.validationError(['إجراء غير مدعوم'])
  } catch (error) {
    logger.error('خطأ في اختبار التكامل', { error })
    return ApiResponseHandler.serverError('خطأ في اختبار التكامل')
  }
}

// دالة اختبار التكامل
async function testIntegration(integration: any) {
  try {
    // في التطبيق الحقيقي، ستقوم باختبار التكامل الفعلي
    // هنا نستخدم محاكاة بسيطة
    
    const testResults = {
      success: Math.random() > 0.2, // 80% احتمال النجاح
      responseTime: Math.floor(Math.random() * 200) + 50, // 50-250ms
      details: {
        endpoint: integration.endpoint,
        status: 'tested',
        timestamp: new Date().toISOString()
      }
    }

    if (testResults.success) {
      logger.info('اختبار التكامل نجح', { 
        integrationId: integration.id, 
        name: integration.name,
        responseTime: testResults.responseTime
      })
    } else {
      logger.warn('اختبار التكامل فشل', { 
        integrationId: integration.id, 
        name: integration.name 
      })
    }

    return testResults
  } catch (error) {
    logger.error('خطأ في اختبار التكامل', { 
      integrationId: integration.id, 
      error 
    })
    return {
      success: false,
      responseTime: 0,
      details: {
        error: error instanceof Error ? error.message : 'خطأ غير معروف',
        timestamp: new Date().toISOString()
      }
    }
  }
}