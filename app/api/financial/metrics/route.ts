import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { withRole } from '@/lib/auth-middleware'

export const GET = withRole(['ADMIN', 'MANAGER'])(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || new Date(new Date().getFullYear(), 0, 1).toISOString()
    const endDate = searchParams.get('endDate') || new Date().toISOString()

    // حساب الإيرادات
    const revenueResult = await prisma.invoice.aggregate({
      where: {
        status: 'PAID',
        paidDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      _sum: {
        total: true
      }
    })

    // حساب المصروفات
    const expensesResult = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
        paymentDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      _sum: {
        amount: true
      }
    })

    // حساب المدينين
    const accountsReceivableResult = await prisma.invoice.aggregate({
      where: {
        status: {
          in: ['PENDING', 'OVERDUE']
        }
      },
      _sum: {
        total: true
      }
    })

    // حساب الدائنين (تقدير - يمكن تحسينه)
    const accountsPayableResult = await prisma.payment.aggregate({
      where: {
        status: 'PENDING'
      },
      _sum: {
        amount: true
      }
    })

    // حساب عدد الشحنات النشطة
    const activeShipmentsCount = await prisma.shipment.count({
      where: {
        status: {
          in: ['PENDING', 'IN_TRANSIT']
        }
      }
    })

    // حساب متوسط قيمة الشحنة
    const avgShipmentValue = await prisma.shipment.aggregate({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      _avg: {
        price: true
      }
    })

    const totalRevenue = parseFloat(revenueResult._sum.total?.toString() || '0')
    const totalExpenses = parseFloat(expensesResult._sum.amount?.toString() || '0')
    const netProfit = totalRevenue - totalExpenses
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
    const accountsReceivable = parseFloat(accountsReceivableResult._sum.total?.toString() || '0')
    const accountsPayable = parseFloat(accountsPayableResult._sum.amount?.toString() || '0')
    const workingCapital = accountsReceivable - accountsPayable

    // حساب التدفق النقدي (مبسط)
    const cashFlow = netProfit // في الواقع يحتاج حسابات أكثر تعقيداً

    // إحصائيات إضافية
    const clientsCount = await prisma.client.count({
      where: { isActive: true }
    })

    const suppliersCount = await prisma.supplier.count({
      where: { isActive: true }
    })

    // حساب معدل النمو (مقارنة بالفترة السابقة)
    const previousPeriodStart = new Date(startDate)
    previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1)
    const previousPeriodEnd = new Date(endDate)
    previousPeriodEnd.setMonth(previousPeriodEnd.getMonth() - 1)

    const previousRevenueResult = await prisma.invoice.aggregate({
      where: {
        status: 'PAID',
        paidDate: {
          gte: previousPeriodStart,
          lte: previousPeriodEnd
        }
      },
      _sum: {
        total: true
      }
    })

    const previousRevenue = parseFloat(previousRevenueResult._sum.total?.toString() || '0')
    const revenueGrowthRate = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0

    // مؤشرات أداء إضافية
    const totalShipments = await prisma.shipment.count({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }
    })

    const deliveredShipments = await prisma.shipment.count({
      where: {
        status: 'DELIVERED',
        deliveryDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }
    })

    const deliveryRate = totalShipments > 0 ? (deliveredShipments / totalShipments) * 100 : 0

    // حساب متوسط وقت التسليم
    const deliveryTimes = await prisma.shipment.findMany({
      where: {
        status: 'DELIVERED',
        deliveryDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        },
        shippingDate: {
          not: null
        }
      },
      select: {
        shippingDate: true,
        deliveryDate: true
      }
    })

    const avgDeliveryTime = deliveryTimes.length > 0 
      ? deliveryTimes.reduce((sum, shipment) => {
          if (shipment.shippingDate && shipment.deliveryDate) {
            const days = Math.ceil((shipment.deliveryDate.getTime() - shipment.shippingDate.getTime()) / (1000 * 60 * 60 * 24))
            return sum + days
          }
          return sum
        }, 0) / deliveryTimes.length
      : 0

    const metrics = {
      // المقاييس الأساسية
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      cashFlow,
      accountsReceivable,
      accountsPayable,
      workingCapital,

      // مؤشرات النمو
      revenueGrowthRate,
      
      // مؤشرات التشغيل
      activeShipmentsCount,
      totalShipments,
      deliveredShipments,
      deliveryRate,
      avgDeliveryTime,
      avgShipmentValue: parseFloat(avgShipmentValue._avg.price?.toString() || '0'),
      
      // إحصائيات عامة
      clientsCount,
      suppliersCount,
      
      // الفترة الزمنية
      period: {
        startDate,
        endDate
      },

      // مؤشرات إضافية
      revenuePerClient: clientsCount > 0 ? totalRevenue / clientsCount : 0,
      profitPerShipment: totalShipments > 0 ? netProfit / totalShipments : 0,
      
      // مؤشرات الكفاءة
      operationalEfficiency: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
      assetUtilization: workingCapital > 0 ? (totalRevenue / workingCapital) * 100 : 0,
      
      // مؤشرات السيولة
      currentRatio: accountsPayable > 0 ? accountsReceivable / accountsPayable : 0,
      quickRatio: accountsPayable > 0 ? (accountsReceivable * 0.8) / accountsPayable : 0,
      
      // تقييم عام للأداء
      performanceScore: Math.min(100, Math.max(0, 
        (profitMargin * 0.3) + 
        (deliveryRate * 0.2) + 
        (revenueGrowthRate * 0.2) + 
        (Math.min(100, (netProfit / 10000) * 10) * 0.3)
      )),
      
      // حالة الأعمال
      businessHealth: {
        revenue: totalRevenue > 100000 ? 'excellent' : totalRevenue > 50000 ? 'good' : 'fair',
        profitability: profitMargin > 20 ? 'excellent' : profitMargin > 10 ? 'good' : profitMargin > 5 ? 'fair' : 'poor',
        growth: revenueGrowthRate > 15 ? 'excellent' : revenueGrowthRate > 5 ? 'good' : revenueGrowthRate > 0 ? 'fair' : 'poor',
        efficiency: deliveryRate > 95 ? 'excellent' : deliveryRate > 85 ? 'good' : deliveryRate > 75 ? 'fair' : 'poor'
      }
    }

    return ApiResponseHandler.success(metrics)

  } catch (error) {
    console.error('خطأ في جلب المقاييس المالية:', error)
    return ApiResponseHandler.serverError('فشل في جلب المقاييس المالية')
  }
})

export const POST = withRole(['ADMIN'])(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'calculate_custom_metrics':
        // حساب مقاييس مخصصة
        const customMetrics = await calculateCustomMetrics(data)
        return ApiResponseHandler.success(customMetrics)

      case 'export_metrics':
        // تصدير المقاييس
        const exportData = await exportMetrics(data)
        return ApiResponseHandler.success(exportData)

      case 'compare_periods':
        // مقارنة الفترات
        const comparison = await comparePeriods(data)
        return ApiResponseHandler.success(comparison)

      default:
        return ApiResponseHandler.validationError(['إجراء غير صحيح'])
    }
  } catch (error) {
    console.error('خطأ في معالجة طلب المقاييس المالية:', error)
    return ApiResponseHandler.serverError('فشل في معالجة الطلب')
  }
})

// Helper functions
async function calculateCustomMetrics(params: any) {
  // تنفيذ حساب المقاييس المخصصة
  return {
    customMetrics: [],
    calculatedAt: new Date().toISOString()
  }
}

async function exportMetrics(params: any) {
  // تنفيذ تصدير المقاييس
  return {
    exportUrl: '/exports/metrics.xlsx',
    exportedAt: new Date().toISOString()
  }
}

async function comparePeriods(params: any) {
  // تنفيذ مقارنة الفترات
  return {
    comparison: {},
    comparedAt: new Date().toISOString()
  }
}



