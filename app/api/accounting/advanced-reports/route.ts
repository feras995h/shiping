import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { getAdvancedAccountingService } from '@/lib/advanced-accounting'
import { withRole } from '@/lib/auth-middleware'

export const GET = withRole(['ADMIN', 'MANAGER'])(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type') || 'ratios'
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')
    const asOfDateParam = searchParams.get('asOfDate')

    const advancedAccounting = getAdvancedAccountingService(prisma)

    // تحديد التواريخ الافتراضية
    const today = new Date()
    const startOfYear = new Date(today.getFullYear(), 0, 1)
    const startDate = startDateParam ? new Date(startDateParam) : startOfYear
    const endDate = endDateParam ? new Date(endDateParam) : today
    const asOfDate = asOfDateParam ? new Date(asOfDateParam) : today

    switch (reportType) {
      case 'ratios':
        const financialRatios = await advancedAccounting.calculateFinancialRatios(asOfDate)
        
        // تجميع النسب حسب الفئة
        const ratiosByCategory = financialRatios.reduce((acc, ratio) => {
          if (!acc[ratio.category]) {
            acc[ratio.category] = []
          }
          acc[ratio.category].push(ratio)
          return acc
        }, {} as Record<string, typeof financialRatios>)

        // حساب النقاط الإجمالية
        const totalScore = financialRatios.reduce((sum, ratio) => {
          const score = ratio.status === 'excellent' ? 4 : 
                       ratio.status === 'good' ? 3 : 
                       ratio.status === 'fair' ? 2 : 1
          return sum + score
        }, 0)

        const maxScore = financialRatios.length * 4
        const overallRating = (totalScore / maxScore) * 100

        return ApiResponseHandler.success({
          ratios: financialRatios,
          ratiosByCategory,
          summary: {
            totalRatios: financialRatios.length,
            overallRating: Math.round(overallRating),
            ratingText: overallRating >= 80 ? 'ممتاز' : 
                       overallRating >= 70 ? 'جيد جداً' : 
                       overallRating >= 60 ? 'جيد' : 
                       overallRating >= 50 ? 'مقبول' : 'ضعيف',
            excellent: financialRatios.filter(r => r.status === 'excellent').length,
            good: financialRatios.filter(r => r.status === 'good').length,
            fair: financialRatios.filter(r => r.status === 'fair').length,
            poor: financialRatios.filter(r => r.status === 'poor').length
          },
          asOfDate: asOfDate.toISOString()
        })

      case 'cashflow':
        const cashFlowStatement = await advancedAccounting.generateCashFlowStatement(startDate, endDate)
        
        // تحليل التدفق النقدي
        const cashFlowAnalysis = {
          operatingHealthy: cashFlowStatement.operatingActivities.netOperatingCashFlow > 0,
          investingHealthy: cashFlowStatement.investingActivities.netInvestingCashFlow < 0, // الاستثمار في الأصول إيجابي
          financingBalance: Math.abs(cashFlowStatement.financingActivities.netFinancingCashFlow),
          overallHealth: cashFlowStatement.netCashFlow > 0 ? 'positive' : 'negative',
          liquidity: cashFlowStatement.endingCash > cashFlowStatement.beginningCash ? 'improving' : 'declining'
        }

        return ApiResponseHandler.success({
          cashFlowStatement,
          analysis: cashFlowAnalysis,
          period: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          }
        })

      case 'budget-variance':
        // موازنة تقديرية (في التطبيق الحقيقي ستأتي من قاعدة البيانات)
        const sampleBudget = {
          '5.1.1': 500000, // إيرادات الشحن
          '5.1.2': 200000, // إيرادات إضافية
          '2.1.1': 150000, // مصروفات إدارية
          '2.1.2': 100000, // مصروفات تشغيلية
          '2.2.1': 80000,  // رواتب وأجور
        }

        const budgetVariances = await advancedAccounting.analyzeBudgetVariances(
          sampleBudget, 
          startDate, 
          endDate
        )

        // حساب الانحرافات الإجمالية
        const totalBudgeted = Object.values(sampleBudget).reduce((sum, val) => sum + Math.abs(val), 0)
        const totalActual = budgetVariances.reduce((sum, item) => sum + Math.abs(item.actual), 0)
        const totalVariance = budgetVariances.reduce((sum, item) => sum + item.variance, 0)
        const favorableVariances = budgetVariances.filter(v => v.status === 'favorable').length
        const unfavorableVariances = budgetVariances.filter(v => v.status === 'unfavorable').length

        return ApiResponseHandler.success({
          variances: budgetVariances,
          summary: {
            totalBudgeted,
            totalActual,
            totalVariance,
            variancePercent: totalBudgeted !== 0 ? (totalVariance / totalBudgeted) * 100 : 0,
            favorableCount: favorableVariances,
            unfavorableCount: unfavorableVariances,
            accuracy: totalBudgeted !== 0 ? (1 - Math.abs(totalVariance) / totalBudgeted) * 100 : 0
          },
          period: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          }
        })

      case 'profit-centers':
        const profitCenters = await advancedAccounting.analyzeProfitCenters(startDate, endDate)
        
        // إحصائيات مراكز الربح
        const totalRevenue = profitCenters.reduce((sum, center) => sum + center.revenue, 0)
        const totalProfit = profitCenters.reduce((sum, center) => sum + center.profit, 0)
        const averageMargin = profitCenters.length > 0 ? 
          profitCenters.reduce((sum, center) => sum + center.profitMargin, 0) / profitCenters.length : 0

        return ApiResponseHandler.success({
          profitCenters,
          summary: {
            totalCenters: profitCenters.length,
            totalRevenue,
            totalProfit,
            overallMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
            averageMargin,
            excellentPerformers: profitCenters.filter(c => c.performance === 'excellent').length,
            goodPerformers: profitCenters.filter(c => c.performance === 'good').length,
            fairPerformers: profitCenters.filter(c => c.performance === 'fair').length,
            poorPerformers: profitCenters.filter(c => c.performance === 'poor').length
          },
          period: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          }
        })

      case 'trends':
        const periodsParam = searchParams.get('periods')
        const periods = periodsParam ? parseInt(periodsParam) : 12

        const trendsAnalysis = await advancedAccounting.analyzeTrends(periods)
        
        // حساب معدلات النمو
        const revenueGrowth = this.calculateGrowthRate(trendsAnalysis.revenue || [])
        const expenseGrowth = this.calculateGrowthRate(trendsAnalysis.expenses || [])
        const profitGrowth = this.calculateGrowthRate(trendsAnalysis.profit || [])

        return ApiResponseHandler.success({
          trends: trendsAnalysis,
          growthRates: {
            revenue: revenueGrowth,
            expenses: expenseGrowth,
            profit: profitGrowth
          },
          insights: {
            revenueInsight: this.getTrendInsight('revenue', trendsAnalysis.trends?.revenue || 'stable', revenueGrowth),
            expenseInsight: this.getTrendInsight('expenses', trendsAnalysis.trends?.expenses || 'stable', expenseGrowth),
            profitInsight: this.getTrendInsight('profit', trendsAnalysis.trends?.profit || 'stable', profitGrowth)
          },
          periods
        })

      case 'comprehensive':
        // تقرير شامل يجمع كل التحليلات
        const [ratios, cashFlow, profitCentersData, trends] = await Promise.all([
          advancedAccounting.calculateFinancialRatios(asOfDate),
          advancedAccounting.generateCashFlowStatement(startDate, endDate),
          advancedAccounting.analyzeProfitCenters(startDate, endDate),
          advancedAccounting.analyzeTrends(6) // آخر 6 أشهر
        ])

        const comprehensiveAnalysis = {
          financialHealth: this.assessFinancialHealth(ratios, cashFlow),
          businessPerformance: this.assessBusinessPerformance(profitCentersData, trends),
          recommendations: this.generateRecommendations(ratios, cashFlow, profitCentersData, trends)
        }

        return ApiResponseHandler.success({
          ratios: ratios.slice(0, 6), // أهم 6 نسب
          cashFlowSummary: {
            netOperatingCashFlow: cashFlow.operatingActivities?.netOperatingCashFlow || 0,
            netCashFlow: cashFlow.netCashFlow || 0,
            cashPosition: cashFlow.endingCash || 0
          },
          topProfitCenters: profitCentersData.slice(0, 5),
          recentTrends: trends.trends || [],
          analysis: comprehensiveAnalysis,
          generatedAt: new Date().toISOString()
        })

      default:
        return ApiResponseHandler.validationError(['نوع التقرير غير صحيح'])
    }
  } catch (error) {
    console.error('خطأ في إنشاء التقرير المحاسبي المتقدم:', error)
    return ApiResponseHandler.serverError('فشل في إنشاء التقرير')
  }
})

// Helper methods (في التطبيق الحقيقي ستكون في كلاس منفصل)
function calculateGrowthRate(data: Array<{ period: string; value: number }>): number {
  if (data.length < 2) return 0
  
  const latest = data[data.length - 1].value
  const earliest = data[0].value
  
  if (earliest === 0) return latest > 0 ? 100 : 0
  
  return ((latest - earliest) / Math.abs(earliest)) * 100
}

function getTrendInsight(
  type: string, 
  trend: 'increasing' | 'decreasing' | 'stable', 
  growthRate: number
): string {
  const typeArabic = type === 'revenue' ? 'الإيرادات' : 
                    type === 'expenses' ? 'المصروفات' : 'الأرباح'
  
  if (trend === 'increasing') {
    return `${typeArabic} في نمو بمعدل ${Math.abs(growthRate).toFixed(1)}%`
  } else if (trend === 'decreasing') {
    return `${typeArabic} في انخفاض بمعدل ${Math.abs(growthRate).toFixed(1)}%`
  } else {
    return `${typeArabic} مستقرة مع تذبذب طفيف`
  }
}

function assessFinancialHealth(ratios: any[], cashFlow: any): {
  score: number
  status: string
  strengths: string[]
  concerns: string[]
} {
  const excellentRatios = ratios.filter(r => r.status === 'excellent').length
  const totalRatios = ratios.length
  const ratioScore = totalRatios > 0 ? (excellentRatios / totalRatios) * 100 : 0
  
  const cashFlowScore = cashFlow.operatingActivities?.netOperatingCashFlow > 0 ? 100 : 0
  
  const overallScore = (ratioScore + cashFlowScore) / 2
  
  const strengths: string[] = []
  const concerns: string[] = []
  
  if (cashFlow.operatingActivities?.netOperatingCashFlow > 0) {
    strengths.push('التدفق النقدي التشغيلي إيجابي')
  } else {
    concerns.push('التدفق النقدي التشغيلي سالب')
  }
  
  if (excellentRatios >= totalRatios * 0.7) {
    strengths.push('معظم النسب المالية في المستوى الممتاز')
  } else if (excellentRatios < totalRatios * 0.3) {
    concerns.push('عدد قليل من النسب المالية في المستوى الممتاز')
  }
  
  return {
    score: Math.round(overallScore),
    status: overallScore >= 80 ? 'ممتاز' : 
           overallScore >= 70 ? 'جيد' : 
           overallScore >= 60 ? 'مقبول' : 'يحتاج تحسين',
    strengths,
    concerns
  }
}

function assessBusinessPerformance(profitCenters: any[], trends: any): {
  score: number
  status: string
  insights: string[]
} {
  const excellentCenters = profitCenters.filter(c => c.performance === 'excellent').length
  const totalCenters = profitCenters.length
  const centerScore = totalCenters > 0 ? (excellentCenters / totalCenters) * 100 : 0
  
  const trendScore = trends.profit === 'increasing' ? 100 : 
                    trends.profit === 'stable' ? 70 : 40
  
  const overallScore = (centerScore + trendScore) / 2
  
  const insights: string[] = []
  
  if (trends.revenue === 'increasing') {
    insights.push('الإيرادات في نمو مستمر')
  }
  
  if (trends.profit === 'increasing') {
    insights.push('الأرباح في تحسن مستمر')
  } else if (trends.profit === 'decreasing') {
    insights.push('الأرباح في انخفاض - يتطلب انتباه')
  }
  
  if (excellentCenters > 0) {
    insights.push(`${excellentCenters} من مراكز الربح تحقق أداءً ممتازاً`)
  }
  
  return {
    score: Math.round(overallScore),
    status: overallScore >= 80 ? 'أداء ممتاز' : 
           overallScore >= 70 ? 'أداء جيد' : 
           overallScore >= 60 ? 'أداء مقبول' : 'يحتاج تحسين',
    insights
  }
}

function generateRecommendations(ratios: any[], cashFlow: any, profitCenters: any[], trends: any): string[] {
  const recommendations: string[] = []
  
  // توصيات بناءً على النسب المالية
  const poorRatios = ratios.filter(r => r.status === 'poor')
  if (poorRatios.length > 0) {
    recommendations.push(`تحسين ${poorRatios.length} من النسب المالية الضعيفة`)
  }
  
  // توصيات بناءً على التدفق النقدي
  if (cashFlow.operatingActivities.netOperatingCashFlow < 0) {
    recommendations.push('تحسين التدفق النقدي التشغيلي من خلال تسريع التحصيل')
  }
  
  // توصيات بناءً على مراكز الربح
  const poorCenters = profitCenters.filter(c => c.performance === 'poor')
  if (poorCenters.length > 0) {
    recommendations.push(`مراجعة استراتيجية ${poorCenters.length} من مراكز الربح ضعيفة الأداء`)
  }
  
  // توصيات بناءً على الاتجاهات
  if (trends.profit === 'decreasing') {
    recommendations.push('وضع خطة لعكس اتجاه انخفاض الأرباح')
  }
  
  if (trends.expenses === 'increasing' && trends.revenue !== 'increasing') {
    recommendations.push('مراقبة وتحكم في نمو المصروفات')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('الأداء المالي جيد - الحفاظ على الاستراتيجية الحالية')
  }
  
  return recommendations
}


