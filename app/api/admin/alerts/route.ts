import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { getFinancialAlertsService } from '@/lib/financial-alerts'
import { withRole } from '@/lib/auth-middleware'

export const GET = withRole(['ADMIN','MANAGER'])(async (request: NextRequest) => {
  try {
    // جلب التنبيهات من قاعدة البيانات
    const dbAlerts = await prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    // جلب التنبيهات المالية الذكية
    const financialAlertsService = getFinancialAlertsService(prisma)
    const financialAlerts = await financialAlertsService.runAllChecks()

    // دمج التنبيهات
    const allAlerts = [
      ...financialAlerts.map(fAlert => ({
        id: fAlert.id,
        title: fAlert.title,
        message: fAlert.message,
        type: fAlert.severity === 'CRITICAL' ? 'ERROR' : 
              fAlert.severity === 'HIGH' ? 'WARNING' : 
              fAlert.severity === 'MEDIUM' ? 'WARNING' : 'INFO',
        isRead: fAlert.isRead,
        createdAt: fAlert.createdAt,
        category: 'FINANCIAL',
        actions: fAlert.actions
      })),
      ...dbAlerts.map(dbAlert => ({
        ...dbAlert,
        category: 'SYSTEM'
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const alertStats = {
      total: allAlerts.length,
      active: allAlerts.filter((a: any) => !a.isRead).length,
      critical: allAlerts.filter((a: any) => a.type === 'ERROR').length,
      warning: allAlerts.filter((a: any) => a.type === 'WARNING').length,
      financial: financialAlerts.length,
      system: dbAlerts.length
    }

    return ApiResponseHandler.success({ alerts: allAlerts, stats: alertStats })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return ApiResponseHandler.serverError('فشل في جلب التنبيهات')
  }
})

export const POST = withRole(['ADMIN','MANAGER'])(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { title, message, type, userId } = body

    // دعم قديم: إذا أُرسل description بدل message
    const finalMessage = message ?? body?.description ?? ''

    const alert = await prisma.alert.create({
      data: {
        title,
        message: finalMessage,
        type,
        userId: userId ?? null,
      },
    })

    return ApiResponseHandler.success(alert, 'تم إنشاء التنبيه بنجاح')
  } catch (error) {
    console.error('Error creating alert:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
})

export const PUT = withRole(['ADMIN','MANAGER'])(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { id, isRead, title, message, type } = body as {
      id: string
      isRead?: boolean
      title?: string
      message?: string
      type?: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'
    }

    const data: any = {}
    if (typeof isRead === 'boolean') data.isRead = isRead
    if (typeof title === 'string' && title.length) data.title = title
    if (typeof message === 'string') data.message = message
    if (typeof type === 'string') data.type = type

    const alert = await prisma.alert.update({
      where: { id },
      data,
    })

    return ApiResponseHandler.success(alert, 'تم تحديث التنبيه بنجاح')
  } catch (error) {
    console.error('Error updating alert:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
})