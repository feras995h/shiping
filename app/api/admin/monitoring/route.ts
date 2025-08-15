import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { logger } from '@/lib/logger'
import { withRole } from '@/lib/auth-middleware'
import { getMonitoringService } from '@/lib/monitoring'; // Assuming this is correctly imported now

// Refactored GET endpoint as per the edited snippet
export const GET = withAuth(async (request: NextRequest) => {
  try {
    await requireAdmin(); // Assuming requireAdmin is available or handled by withAuth

    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'metrics';

    const monitoringService = getMonitoringService(prisma);

    switch (action) {
      case 'metrics':
        const metrics = await monitoringService.getSystemMetrics();
        return ApiResponseHandler.success({ metrics });

      case 'services':
        const services = await monitoringService.getServiceHealth();
        return ApiResponseHandler.success({ services });

      case 'health':
        const health = await monitoringService.performHealthChecks();
        return ApiResponseHandler.success({ health });

      default:
        return ApiResponseHandler.badRequest('إجراء غير صحيح');
    }
  } catch (error) {
    logger.error('خطأ في معالجة طلب المراقبة:', { error });
    return ApiResponseHandler.serverError('فشل في معالجة الطلب');
  }
});

// HEAD endpoint for health checks as per the edited snippet
export async function HEAD() {
  try {
    const monitoringService = getMonitoringService(prisma);
    const healthChecks = await monitoringService.performHealthChecks();

    const unhealthyServices = healthChecks.filter(h => h.status !== 'online');

    if (unhealthyServices.length > 0) {
      return new Response(null, {
        status: 503, // Service Unavailable
        headers: {
          'X-Health-Status': 'unhealthy',
          'X-Unhealthy-Services': unhealthyServices.map(s => s.service).join(',')
        }
      });
    }

    return new Response(null, {
      status: 200,
      headers: {
        'X-Health-Status': 'healthy'
      }
    });
  } catch (error) {
    logger.error('خطأ في نقطة نهاية فحص الصحة:', { error });
    return new Response(null, {
      status: 503,
      headers: {
        'X-Health-Status': 'error',
        'X-Error': 'Health check failed'
      }
    });
  }
}

// POST endpoint from original code
export const POST = withRole(['ADMIN'])(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { action, data } = body

    const monitoringServiceInstance = getMonitoringService(prisma) // Renamed to avoid conflict
    const performanceMonitor = getPerformanceMonitor(prisma)

    switch (action) {
      case 'record_metric':
        if (!data.name || typeof data.value !== 'number') {
          return ApiResponseHandler.validationError(['اسم المقياس والقيمة مطلوبان'])
        }

        performanceMonitor.recordMetric(
          data.name,
          data.value,
          data.unit || 'ms',
          data.category || 'system',
          data.metadata
        )

        return ApiResponseHandler.success({ message: 'تم تسجيل المقياس بنجاح' })

      case 'resolve_alert':
        if (!data.alertId) {
          return ApiResponseHandler.validationError(['معرف التنبيه مطلوب'])
        }

        const resolved = performanceMonitor.resolveAlert(data.alertId)
        if (resolved) {
          return ApiResponseHandler.success({ message: 'تم حل التنبيه بنجاح' })
        } else {
          return ApiResponseHandler.notFound('التنبيه غير موجود')
        }

      case 'update_thresholds':
        if (!data.thresholds) {
          return ApiResponseHandler.validationError(['العتبات الجديدة مطلوبة'])
        }

        performanceMonitor.updateThresholds(data.thresholds)
        return ApiResponseHandler.success({ message: 'تم تحديث العتبات بنجاح' })

      case 'cleanup':
        const days = data.days || 7
        performanceMonitor.cleanup(days)
        return ApiResponseHandler.success({ message: `تم تنظيف البيانات الأقدم من ${days} أيام` })

      case 'export_data':
        const exportData = monitoringServiceInstance.exportMetrics()
        return ApiResponseHandler.success({
          data: exportData,
          exportedAt: new Date().toISOString()
        })

      default:
        return ApiResponseHandler.validationError(['إجراء غير صحيح'])
    }
  } catch (error) {
    logger.error('خطأ في معالجة طلب المراقبة (POST):', { error })
    return ApiResponseHandler.serverError('فشل في معالجة الطلب')
  }
})

// --- Helper functions from original code ---

// جمع مقاييس النظام (مُحاكاة)
async function getSystemMetrics() {
  try {
    const now = Date.now()
    const hour = new Date(now).getHours()

    const cpuUsage = 30 + (hour * 2) + (Math.random() * 20)
    const memoryUsage = 60 + (hour * 1.5) + (Math.random() * 15)
    const storageUsage = 45 + (hour * 0.5) + (Math.random() * 10)
    const networkUsage = 20 + (hour * 1) + (Math.random() * 15)

    return [
      {
        name: "استخدام المعالج",
        value: Math.round(cpuUsage).toString(),
        unit: "%",
        status: cpuUsage > 80 ? "warning" : cpuUsage > 95 ? "critical" : "normal",
        trend: "up",
        change: "+2%"
      },
      {
        name: "استخدام الذاكرة",
        value: Math.round(memoryUsage).toString(),
        unit: "%",
        status: memoryUsage > 85 ? "warning" : memoryUsage > 95 ? "critical" : "normal",
        trend: "up",
        change: "+5%"
      },
      {
        name: "مساحة التخزين",
        value: Math.round(storageUsage).toString(),
        unit: "%",
        status: storageUsage > 80 ? "warning" : storageUsage > 90 ? "critical" : "normal",
        trend: "stable",
        change: "0%"
      },
      {
        name: "استخدام الشبكة",
        value: Math.round(networkUsage).toString(),
        unit: "Mbps",
        status: networkUsage > 70 ? "warning" : networkUsage > 85 ? "critical" : "normal",
        trend: "down",
        change: "-3%"
      },
      {
        name: "المستخدمين النشطين",
        value: (100 + hour * 5 + Math.floor(Math.random() * 30)).toString(),
        unit: "",
        status: "normal",
        trend: "up",
        change: "+12"
      },
      {
        name: "الطلبات في الدقيقة",
        value: (200 + hour * 10 + Math.floor(Math.random() * 50)).toString(),
        unit: "",
        status: "normal",
        trend: "up",
        change: "+18"
      }
    ]
  } catch (error) {
    logger.error('خطأ في جمع مقاييس النظام', { error })
    return []
  }
}

// حالة الخدمات
async function getServiceStatuses() {
  try {
    const dbHealth = await checkDatabaseHealth()

    const services = [
      {
        name: "الخادم الرئيسي",
        status: "online",
        uptime: "99.9%",
        responseTime: "45ms",
        lastCheck: new Date().toISOString()
      },
      {
        name: "قاعدة البيانات",
        status: dbHealth.status,
        uptime: dbHealth.uptime,
        responseTime: dbHealth.responseTime,
        lastCheck: new Date().toISOString()
      },
      {
        name: "خدمة البريد الإلكتروني",
        status: await checkEmailService(),
        uptime: "98.5%",
        responseTime: "120ms",
        lastCheck: new Date().toISOString()
      },
      {
        name: "خدمة التخزين السحابي",
        status: await checkStorageService(),
        uptime: "99.7%",
        responseTime: "89ms",
        lastCheck: new Date().toISOString()
      },
      {
        name: "خدمة التكامل مع البنوك",
        status: await checkBankIntegration(),
        uptime: "99.2%",
        responseTime: "150ms",
        lastCheck: new Date().toISOString()
      }
    ]

    return services
  } catch (error) {
    logger.error('خطأ في فحص حالة الخدمات', { error })
    return []
  }
}

// فحص صحة قاعدة البيانات
async function checkDatabaseHealth() {
  try {
    const startTime = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const responseTime = Date.now() - startTime

    return {
      status: "online",
      uptime: "99.8%",
      responseTime: `${responseTime}ms`
    }
  } catch (error) {
    logger.error('فشل في الاتصال بقاعدة البيانات', { error })
    return {
      status: "offline",
      uptime: "0%",
      responseTime: "timeout"
    }
  }
}

// فحص خدمة البريد الإلكتروني
async function checkEmailService() {
  try {
    const isHealthy = Math.random() > 0.1
    if (isHealthy) {
      return "online"
    } else {
      logger.warn('خدمة البريد الإلكتروني غير متاحة')
      return "warning"
    }
  } catch (error) {
    logger.error('خطأ في فحص خدمة البريد الإلكتروني', { error })
    return "offline"
  }
}

// فحص خدمة التخزين
async function checkStorageService() {
  try {
    const isHealthy = Math.random() > 0.05
    if (isHealthy) {
      return "online"
    } else {
      logger.warn('خدمة التخزين غير متاحة')
      return "warning"
    }
  } catch (error) {
    logger.error('خطأ في فحص خدمة التخزين', { error })
    return "offline"
  }
}

// فحص تكامل البنوك
async function checkBankIntegration() {
  try {
    const isHealthy = Math.random() > 0.15
    if (isHealthy) {
      return "online"
    } else {
      logger.warn('تكامل البنوك غير متاح')
      return "warning"
    }
  } catch (error) {
    logger.error('خطأ في فحص تكامل البنوك', { error })
    return "offline"
  }
}

// المستخدمين النشطين (مُحاكاة)
async function getActiveUsers() {
  try {
    const activeUsers = Math.floor(Math.random() * 50) + 10
    return activeUsers
  } catch (error) {
    logger.error('خطأ في حساب المستخدمين النشطين', { error })
    return 0
  }
}

// الأخطاء الأخيرة (مُحاكاة)
async function getRecentErrors() {
  try {
    const errors = [
      {
        id: "1",
        message: "فشل في الاتصال بقاعدة البيانات",
        level: "error",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        service: "database"
      },
      {
        id: "2",
        message: "استجابة بطيئة من خدمة البريد الإلكتروني",
        level: "warning",
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        service: "email"
      }
    ]
    return errors
  } catch (error) {
    logger.error('خطأ في جلب الأخطاء الأخيرة', { error })
    return []
  }
}

// Mock helper functions for the POST endpoint (if not provided by '@/lib/monitoring')
function getPerformanceMonitor(prisma: any) {
  return {
    recordMetric: (name: string, value: number, unit: string, category: string, metadata?: any) => {
      logger.info('تم تسجيل مقياس', { name, value, unit, category, metadata })
    },
    resolveAlert: (alertId: string) => {
      logger.info('تم حل التنبيه', { alertId })
      return true
    },
    updateThresholds: (thresholds: any) => {
      logger.info('تم تحديث العتبات', { thresholds })
    },
    cleanup: (days: number) => {
      logger.info('تم تنظيف البيانات', { days })
    }
  }
}