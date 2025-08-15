import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month'

    // حساب الفترة الزمنية
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // جلب الإحصائيات من قاعدة البيانات
    const [
      totalUsers,
      activeShipments,
      totalTransactions,
      performanceRate,
      storageUsage,
      responseTime
    ] = await Promise.all([
      // إجمالي المستخدمين
      prisma.user.count(),
      
      // الشحنات النشطة
      prisma.shipment.count({
        where: {
          status: { in: ['PENDING', 'IN_TRANSIT'] }
        }
      }),
      
      // المعاملات المالية
      prisma.payment.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),
      
      // معدل الأداء (محسوب من الشحنات المكتملة)
      prisma.shipment.count({
        where: {
          status: 'DELIVERED',
          createdAt: { gte: startDate }
        }
      }).then(delivered => 
        prisma.shipment.count({
          where: { createdAt: { gte: startDate } }
        }).then(total => total > 0 ? Math.round((delivered / total) * 100) : 0)
      ),
      
      // استخدام التخزين (محاكاة)
      Promise.resolve(78),
      
      // وقت الاستجابة (محاكاة)
      Promise.resolve(245)
    ])

    // حساب النمو
    const previousPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()))
    
    const [
      currentUsers,
      previousUsers
    ] = await Promise.all([
      prisma.user.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.user.count({
        where: { 
          createdAt: { 
            gte: previousPeriodStart,
            lt: startDate
          } 
        }
      })
    ])

    const userGrowth = previousUsers > 0 ? 
      Math.round(((currentUsers - previousUsers) / previousUsers) * 100) : 
      currentUsers > 0 ? 100 : 0

    // بيانات الرسم البياني للنمو
    const userGrowthData = await generateUserGrowthData(period)
    
    // بيانات الرسم البياني للإيرادات
    const revenueData = await generateRevenueData(period)
    
    // بيانات الرسم البياني لاستخدام النظام
    const systemUsageData = await generateSystemUsageData()

    const stats = [
      {
        name: "إجمالي المستخدمين",
        value: totalUsers.toLocaleString('ar-LY'),
        change: `${userGrowth > 0 ? '+' : ''}${userGrowth}%`,
        changeType: userGrowth >= 0 ? "positive" : "negative",
        icon: "Users",
        color: "text-blue-600"
      },
      {
        name: "الشحنات النشطة",
        value: activeShipments.toLocaleString('ar-LY'),
        change: "+8%",
        changeType: "positive",
        icon: "Globe",
        color: "text-green-600"
      },
      {
        name: "المعاملات المالية",
        value: totalTransactions.toLocaleString('ar-LY'),
        change: "+15%",
        changeType: "positive",
        icon: "Activity",
        color: "text-gold-600"
      },
      {
        name: "معدل الأداء",
        value: `${performanceRate}%`,
        change: "+2.1%",
        changeType: "positive",
        icon: "TrendingUp",
        color: "text-purple-600"
      },
      {
        name: "استخدام التخزين",
        value: `${storageUsage}%`,
        change: "+5%",
        changeType: "negative",
        icon: "Database",
        color: "text-orange-600"
      },
      {
        name: "وقت الاستجابة",
        value: `${responseTime}ms`,
        change: "-12ms",
        changeType: "positive",
        icon: "Activity",
        color: "text-cyan-600"
      }
    ]

    return ApiResponseHandler.success({
      stats,
      charts: {
        userGrowth: userGrowthData,
        revenue: revenueData,
        systemUsage: systemUsageData
      },
      period,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return ApiResponseHandler.serverError('خطأ في جلب الإحصائيات')
  }
}

async function generateUserGrowthData(period: string) {
  const now = new Date()
  let labels: string[] = []
  let data: number[] = []
  
  switch (period) {
    case 'week':
      labels = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
      data = [12, 19, 15, 25, 22, 30, 28]
      break
    case 'month':
      labels = ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4']
      data = [65, 78, 92, 85]
      break
    case 'quarter':
      labels = ['يناير', 'فبراير', 'مارس']
      data = [65, 78, 92]
      break
    case 'year':
      labels = ['Q1', 'Q2', 'Q3', 'Q4']
      data = [65, 78, 92, 85]
      break
  }

  return {
    labels,
    datasets: [{
      label: 'المستخدمين الجدد',
      data,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 1)'
    }]
  }
}

async function generateRevenueData(period: string) {
  const now = new Date()
  let labels: string[] = []
  let data: number[] = []
  
  switch (period) {
    case 'week':
      labels = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
      data = [12500, 15800, 19200, 18500, 22300, 26700, 28900]
      break
    case 'month':
      labels = ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4']
      data = [12500, 15800, 19200, 18500]
      break
    case 'quarter':
      labels = ['يناير', 'فبراير', 'مارس']
      data = [12500, 15800, 19200]
      break
    case 'year':
      labels = ['Q1', 'Q2', 'Q3', 'Q4']
      data = [12500, 15800, 19200, 18500]
      break
  }

  return {
    labels,
    datasets: [{
      label: 'الإيرادات',
      data,
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderColor: 'rgba(34, 197, 94, 1)'
    }]
  }
}

async function generateSystemUsageData() {
  return {
    labels: ['المعالج', 'الذاكرة', 'التخزين', 'الشبكة'],
    datasets: [{
      label: 'نسبة الاستخدام',
      data: [45, 78, 62, 23],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(34, 197, 94, 0.8)'
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(34, 197, 94, 1)'
      ]
    }]
  }
}