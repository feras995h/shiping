import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { withRole } from '@/lib/auth-middleware'

export const GET = withRole(['ADMIN'])(async (request: NextRequest) => {
  try {
    if (process.env.DEMO_MODE !== 'true') {
      return ApiResponseHandler.success({ current: {}, historical: [], alerts: [] }, 'الوضع التجريبي معطل')
    }
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '24h'

    // محاكاة بيانات الأداء
    const performanceData = {
      system: {
        cpu: {
          current: Math.random() * 100,
          average: Math.random() * 60 + 20,
          peak: Math.random() * 20 + 80
        },
        memory: {
          current: Math.random() * 100,
          average: Math.random() * 50 + 30,
          peak: Math.random() * 20 + 70
        },
        disk: {
          current: Math.random() * 100,
          average: Math.random() * 40 + 20,
          peak: Math.random() * 30 + 60
        },
        network: {
          current: Math.random() * 100,
          average: Math.random() * 30 + 10,
          peak: Math.random() * 40 + 50
        }
      },
      application: {
        responseTime: {
          average: Math.random() * 500 + 100,
          p95: Math.random() * 1000 + 200,
          p99: Math.random() * 2000 + 500
        },
        throughput: {
          requestsPerSecond: Math.random() * 100 + 50,
          concurrentUsers: Math.floor(Math.random() * 100) + 20
        },
        errors: {
          rate: Math.random() * 5,
          count: Math.floor(Math.random() * 100)
        }
      },
      database: {
        connections: {
          active: Math.floor(Math.random() * 50) + 10,
          max: 100,
          idle: Math.floor(Math.random() * 20) + 5
        },
        queries: {
          perSecond: Math.random() * 100 + 50,
          averageTime: Math.random() * 100 + 10
        },
        cache: {
          hitRate: Math.random() * 30 + 70,
          size: Math.random() * 1000 + 500
        }
      }
    }

    // بيانات الأداء التاريخية
    const historicalData = generateHistoricalData(period)

    return ApiResponseHandler.success({
      current: performanceData,
      historical: historicalData,
      alerts: [
        {
          id: '1',
          type: 'WARNING',
          message: 'استخدام الذاكرة مرتفع',
          timestamp: new Date()
        },
        {
          id: '2',
          type: 'INFO',
          message: 'تم تحسين الأداء بنجاح',
          timestamp: new Date(Date.now() - 3600000)
        }
      ]
    })
  } catch (error) {
    console.error('Error fetching performance data:', error)
    return ApiResponseHandler.serverError('فشل في جلب بيانات الأداء')
  }
})

function generateHistoricalData(period: string) {
  const hours = period === '24h' ? 24 : period === '7d' ? 168 : 1
  const data = []

  for (let i = hours; i >= 0; i--) {
    const time = new Date(Date.now() - i * 60 * 60 * 1000)
    data.push({
      timestamp: time,
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      network: Math.random() * 100,
      responseTime: Math.random() * 1000 + 100,
      requestsPerSecond: Math.random() * 100 + 50
    })
  }

  return data
} 