import { PrismaClient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export interface FinancialRatio {
  name: string
  value: number
  category: 'liquidity' | 'profitability' | 'leverage' | 'efficiency'
  interpretation: string
  benchmark: number
  status: 'excellent' | 'good' | 'fair' | 'poor'
}

export interface CashFlowStatement {
  operatingActivities: {
    netIncome: number
    adjustments: {
      depreciation: number
      accountsReceivableChange: number
      accountsPayableChange: number
      inventoryChange: number
      otherChanges: number
    }
    netOperatingCashFlow: number
  }
  investingActivities: {
    assetPurchases: number
    assetSales: number
    netInvestingCashFlow: number
  }
  financingActivities: {
    loanProceeds: number
    loanRepayments: number
    equityChanges: number
    netFinancingCashFlow: number
  }
  netCashFlow: number
  beginningCash: number
  endingCash: number
}

export interface BudgetVarianceAnalysis {
  account: string
  budgeted: number
  actual: number
  variance: number
  variancePercent: number
  status: 'favorable' | 'unfavorable' | 'neutral'
  explanation: string
}

export interface ProfitCenter {
  id: string
  name: string
  revenue: number
  expenses: number
  profit: number
  profitMargin: number
  performance: 'excellent' | 'good' | 'fair' | 'poor'
}

class AdvancedAccountingService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  /**
   * حساب النسب المالية المتقدمة
   */
  async calculateFinancialRatios(asOfDate?: Date): Promise<FinancialRatio[]> {
    const endDate = asOfDate || new Date()
    const startOfYear = new Date(endDate.getFullYear(), 0, 1)

    // الحصول على البيانات المالية
    const balanceSheet = await this.generateBalanceSheet(endDate)
    const incomeStatement = await this.generateIncomeStatement(startOfYear, endDate)

    const ratios: FinancialRatio[] = []

    // نسب السيولة
    const currentAssets = balanceSheet.assets.current.total
    const currentLiabilities = balanceSheet.liabilities.current.total
    const inventory = balanceSheet.assets.current.inventory

    // النسبة المتداولة
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0
    ratios.push({
      name: 'النسبة المتداولة',
      value: currentRatio,
      category: 'liquidity',
      interpretation: currentRatio >= 2 ? 'سيولة ممتازة' : currentRatio >= 1.5 ? 'سيولة جيدة' : currentRatio >= 1 ? 'سيولة مقبولة' : 'سيولة ضعيفة',
      benchmark: 2,
      status: currentRatio >= 2 ? 'excellent' : currentRatio >= 1.5 ? 'good' : currentRatio >= 1 ? 'fair' : 'poor'
    })

    // النسبة السريعة
    const quickRatio = currentLiabilities > 0 ? (currentAssets - inventory) / currentLiabilities : 0
    ratios.push({
      name: 'النسبة السريعة',
      value: quickRatio,
      category: 'liquidity',
      interpretation: quickRatio >= 1.5 ? 'سيولة سريعة ممتازة' : quickRatio >= 1 ? 'سيولة سريعة جيدة' : 'سيولة سريعة ضعيفة',
      benchmark: 1,
      status: quickRatio >= 1.5 ? 'excellent' : quickRatio >= 1 ? 'good' : quickRatio >= 0.8 ? 'fair' : 'poor'
    })

    // نسب الربحية
    const revenue = incomeStatement.revenue.total
    const netIncome = incomeStatement.netIncome
    const totalAssets = balanceSheet.assets.total
    const equity = balanceSheet.equity.total

    // هامش الربح الصافي
    const netProfitMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0
    ratios.push({
      name: 'هامش الربح الصافي',
      value: netProfitMargin,
      category: 'profitability',
      interpretation: `${netProfitMargin.toFixed(1)}% من المبيعات تحويل لربح صافي`,
      benchmark: 10,
      status: netProfitMargin >= 15 ? 'excellent' : netProfitMargin >= 10 ? 'good' : netProfitMargin >= 5 ? 'fair' : 'poor'
    })

    // العائد على الأصول
    const roa = totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0
    ratios.push({
      name: 'العائد على الأصول',
      value: roa,
      category: 'profitability',
      interpretation: `${roa.toFixed(1)}% عائد من استخدام الأصول`,
      benchmark: 8,
      status: roa >= 12 ? 'excellent' : roa >= 8 ? 'good' : roa >= 4 ? 'fair' : 'poor'
    })

    // العائد على حقوق الملكية
    const roe = equity > 0 ? (netIncome / equity) * 100 : 0
    ratios.push({
      name: 'العائد على حقوق الملكية',
      value: roe,
      category: 'profitability',
      interpretation: `${roe.toFixed(1)}% عائد للمساهمين`,
      benchmark: 15,
      status: roe >= 20 ? 'excellent' : roe >= 15 ? 'good' : roe >= 10 ? 'fair' : 'poor'
    })

    // نسب الرافعة المالية
    const totalLiabilities = balanceSheet.liabilities.total
    
    // نسبة الدين إلى حقوق الملكية
    const debtToEquity = equity > 0 ? totalLiabilities / equity : 0
    ratios.push({
      name: 'نسبة الدين إلى حقوق الملكية',
      value: debtToEquity,
      category: 'leverage',
      interpretation: debtToEquity <= 0.5 ? 'رافعة مالية منخفضة' : debtToEquity <= 1 ? 'رافعة مالية معتدلة' : 'رافعة مالية عالية',
      benchmark: 0.5,
      status: debtToEquity <= 0.3 ? 'excellent' : debtToEquity <= 0.5 ? 'good' : debtToEquity <= 1 ? 'fair' : 'poor'
    })

    // نسب الكفاءة
    const totalExpenses = incomeStatement.expenses.total
    
    // معدل دوران الأصول
    const assetTurnover = totalAssets > 0 ? revenue / totalAssets : 0
    ratios.push({
      name: 'معدل دوران الأصول',
      value: assetTurnover,
      category: 'efficiency',
      interpretation: `${assetTurnover.toFixed(2)} مرة دوران الأصول سنوياً`,
      benchmark: 1.5,
      status: assetTurnover >= 2 ? 'excellent' : assetTurnover >= 1.5 ? 'good' : assetTurnover >= 1 ? 'fair' : 'poor'
    })

    return ratios
  }

  /**
   * إنشاء قائمة التدفقات النقدية
   */
  async generateCashFlowStatement(startDate: Date, endDate: Date): Promise<CashFlowStatement> {
    // الأنشطة التشغيلية
    const netIncome = await this.calculateNetIncome(startDate, endDate)
    const depreciation = await this.calculateDepreciation(startDate, endDate)
    const arChange = await this.calculateAccountsReceivableChange(startDate, endDate)
    const apChange = await this.calculateAccountsPayableChange(startDate, endDate)
    const inventoryChange = await this.calculateInventoryChange(startDate, endDate)

    const netOperatingCashFlow = netIncome + depreciation - arChange + apChange - inventoryChange

    // الأنشطة الاستثمارية
    const assetPurchases = await this.calculateAssetPurchases(startDate, endDate)
    const assetSales = await this.calculateAssetSales(startDate, endDate)
    const netInvestingCashFlow = assetSales - assetPurchases

    // الأنشطة التمويلية
    const loanProceeds = await this.calculateLoanProceeds(startDate, endDate)
    const loanRepayments = await this.calculateLoanRepayments(startDate, endDate)
    const equityChanges = await this.calculateEquityChanges(startDate, endDate)
    const netFinancingCashFlow = loanProceeds - loanRepayments + equityChanges

    // صافي التدفق النقدي
    const netCashFlow = netOperatingCashFlow + netInvestingCashFlow + netFinancingCashFlow
    const beginningCash = await this.getCashBalance(startDate)
    const endingCash = beginningCash + netCashFlow

    return {
      operatingActivities: {
        netIncome,
        adjustments: {
          depreciation,
          accountsReceivableChange: arChange,
          accountsPayableChange: apChange,
          inventoryChange,
          otherChanges: 0
        },
        netOperatingCashFlow
      },
      investingActivities: {
        assetPurchases,
        assetSales,
        netInvestingCashFlow
      },
      financingActivities: {
        loanProceeds,
        loanRepayments,
        equityChanges,
        netFinancingCashFlow
      },
      netCashFlow,
      beginningCash,
      endingCash
    }
  }

  /**
   * تحليل انحرافات الموازنة
   */
  async analyzeBudgetVariances(
    budgetData: Record<string, number>,
    startDate: Date,
    endDate: Date
  ): Promise<BudgetVarianceAnalysis[]> {
    const analysis: BudgetVarianceAnalysis[] = []

    // الحصول على البيانات الفعلية
    const actualData = await this.getActualAccountBalances(startDate, endDate)

    for (const [accountCode, budgetedAmount] of Object.entries(budgetData)) {
      const actualAmount = actualData[accountCode] || 0
      const variance = actualAmount - budgetedAmount
      const variancePercent = budgetedAmount !== 0 ? (variance / Math.abs(budgetedAmount)) * 100 : 0

      let status: 'favorable' | 'unfavorable' | 'neutral' = 'neutral'
      let explanation = ''

      // تحديد ما إذا كان الانحراف مفضل أم لا
      if (accountCode.startsWith('5')) { // حسابات الإيرادات
        status = variance > 0 ? 'favorable' : variance < 0 ? 'unfavorable' : 'neutral'
        explanation = variance > 0 ? 'إيرادات أعلى من المخطط' : 'إيرادات أقل من المخطط'
      } else if (accountCode.startsWith('2') || accountCode.startsWith('3')) { // حسابات المصروفات
        status = variance < 0 ? 'favorable' : variance > 0 ? 'unfavorable' : 'neutral'
        explanation = variance < 0 ? 'مصروفات أقل من المخطط' : 'مصروفات أعلى من المخطط'
      }

      analysis.push({
        account: accountCode,
        budgeted: budgetedAmount,
        actual: actualAmount,
        variance,
        variancePercent,
        status,
        explanation
      })
    }

    return analysis.sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
  }

  /**
   * تحليل مراكز الربح
   */
  async analyzeProfitCenters(startDate: Date, endDate: Date): Promise<ProfitCenter[]> {
    // في هذا المثال، سنحلل حسب العملاء كمراكز ربح
    const clients = await this.prisma.client.findMany({
      include: {
        shipments: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        },
        invoices: {
          where: {
            issuedDate: {
              gte: startDate,
              lte: endDate
            }
          }
        }
      }
    })

    const profitCenters: ProfitCenter[] = []

    for (const client of clients) {
      const revenue = client.invoices.reduce((sum, invoice) => 
        sum + parseFloat(invoice.total.toString()), 0
      )
      
      const expenses = client.shipments.reduce((sum, shipment) => 
        sum + parseFloat(shipment.cost.toString()), 0
      )
      
      const profit = revenue - expenses
      const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0

      let performance: 'excellent' | 'good' | 'fair' | 'poor' = 'poor'
      if (profitMargin >= 30) performance = 'excellent'
      else if (profitMargin >= 20) performance = 'good'
      else if (profitMargin >= 10) performance = 'fair'

      profitCenters.push({
        id: client.id,
        name: client.name,
        revenue,
        expenses,
        profit,
        profitMargin,
        performance
      })
    }

    return profitCenters.sort((a, b) => b.profit - a.profit)
  }

  /**
   * تحليل الاتجاهات المالية
   */
  async analyzeTrends(periods: number = 12): Promise<{
    revenue: Array<{ period: string; value: number }>
    expenses: Array<{ period: string; value: number }>
    profit: Array<{ period: string; value: number }>
    trends: {
      revenue: 'increasing' | 'decreasing' | 'stable'
      expenses: 'increasing' | 'decreasing' | 'stable'
      profit: 'increasing' | 'decreasing' | 'stable'
    }
  }> {
    const trends = {
      revenue: [] as Array<{ period: string; value: number }>,
      expenses: [] as Array<{ period: string; value: number }>,
      profit: [] as Array<{ period: string; value: number }>
    }

    const now = new Date()
    
    for (let i = periods - 1; i >= 0; i--) {
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      
      const periodRevenue = await this.calculatePeriodRevenue(startDate, endDate)
      const periodExpenses = await this.calculatePeriodExpenses(startDate, endDate)
      const periodProfit = periodRevenue - periodExpenses
      
      const periodName = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`
      
      trends.revenue.push({ period: periodName, value: periodRevenue })
      trends.expenses.push({ period: periodName, value: periodExpenses })
      trends.profit.push({ period: periodName, value: periodProfit })
    }

    // تحليل الاتجاهات
    const analyzeTrend = (data: Array<{ value: number }>): 'increasing' | 'decreasing' | 'stable' => {
      if (data.length < 3) return 'stable'
      
      const recent = data.slice(-3).map(d => d.value)
      const earlier = data.slice(-6, -3).map(d => d.value)
      
      const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length
      const earlierAvg = earlier.reduce((sum, val) => sum + val, 0) / earlier.length
      
      const changePercent = earlierAvg !== 0 ? ((recentAvg - earlierAvg) / earlierAvg) * 100 : 0
      
      if (changePercent > 5) return 'increasing'
      if (changePercent < -5) return 'decreasing'
      return 'stable'
    }

    return {
      revenue: trends.revenue,
      expenses: trends.expenses,
      profit: trends.profit,
      trends: {
        revenue: analyzeTrend(trends.revenue),
        expenses: analyzeTrend(trends.expenses),
        profit: analyzeTrend(trends.profit)
      }
    }
  }

  // Helper methods for calculations
  private async calculateNetIncome(startDate: Date, endDate: Date): Promise<number> {
    // حساب صافي الدخل من قاعدة البيانات
    const revenue = await this.calculatePeriodRevenue(startDate, endDate)
    const expenses = await this.calculatePeriodExpenses(startDate, endDate)
    return revenue - expenses
  }

  private async calculatePeriodRevenue(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.prisma.invoice.aggregate({
      where: {
        issuedDate: {
          gte: startDate,
          lte: endDate
        },
        status: 'PAID'
      },
      _sum: {
        total: true
      }
    })
    return parseFloat(result._sum.total?.toString() || '0')
  }

  private async calculatePeriodExpenses(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      where: {
        paymentDate: {
          gte: startDate,
          lte: endDate
        },
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    })
    return parseFloat(result._sum.amount?.toString() || '0')
  }

  private async calculateDepreciation(startDate: Date, endDate: Date): Promise<number> {
    // حساب الإهلاك للفترة
    const assets = await this.prisma.fixedAsset.findMany({
      where: {
        status: 'ACTIVE',
        purchaseDate: {
          lt: endDate
        }
      }
    })

    let totalDepreciation = 0
    const months = this.getMonthsDifference(startDate, endDate)

    for (const asset of assets) {
      const monthlyDepreciation = parseFloat(asset.cost.toString()) * 
        (parseFloat(asset.depreciationRate.toString()) / 100) / 12
      totalDepreciation += monthlyDepreciation * months
    }

    return totalDepreciation
  }

  private async calculateAccountsReceivableChange(startDate: Date, endDate: Date): Promise<number> {
    // تغير في المدينين
    const startAR = await this.getAccountsReceivableBalance(startDate)
    const endAR = await this.getAccountsReceivableBalance(endDate)
    return endAR - startAR
  }

  private async calculateAccountsPayableChange(startDate: Date, endDate: Date): Promise<number> {
    // تغير في الدائنين
    const startAP = await this.getAccountsPayableBalance(startDate)
    const endAP = await this.getAccountsPayableBalance(endDate)
    return endAP - startAP
  }

  private async calculateInventoryChange(startDate: Date, endDate: Date): Promise<number> {
    // تغير في المخزون
    return 0 // سيتم تطبيقه عند إضافة نظام المخزون المفصل
  }

  private async calculateAssetPurchases(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.prisma.fixedAsset.aggregate({
      where: {
        purchaseDate: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        cost: true
      }
    })
    return parseFloat(result._sum.cost?.toString() || '0')
  }

  private async calculateAssetSales(startDate: Date, endDate: Date): Promise<number> {
    // حساب مبيعات الأصول (سيتم تطبيقه لاحقاً)
    return 0
  }

  private async calculateLoanProceeds(startDate: Date, endDate: Date): Promise<number> {
    // حساب متحصلات القروض (سيتم تطبيقه لاحقاً)
    return 0
  }

  private async calculateLoanRepayments(startDate: Date, endDate: Date): Promise<number> {
    // حساب سداد القروض (سيتم تطبيقه لاحقاً)
    return 0
  }

  private async calculateEquityChanges(startDate: Date, endDate: Date): Promise<number> {
    // حساب تغيرات حقوق الملكية (سيتم تطبيقه لاحقاً)
    return 0
  }

  private async getCashBalance(date: Date): Promise<number> {
    // حساب رصيد النقدية في تاريخ معين
    // سيتم تطبيقه من خلال نظام المحاسبة العامة
    return 0
  }

  private async getAccountsReceivableBalance(date: Date): Promise<number> {
    const result = await this.prisma.invoice.aggregate({
      where: {
        issuedDate: {
          lte: date
        },
        status: {
          in: ['PENDING', 'OVERDUE']
        }
      },
      _sum: {
        total: true
      }
    })
    return parseFloat(result._sum.total?.toString() || '0')
  }

  private async getAccountsPayableBalance(date: Date): Promise<number> {
    // حساب رصيد الدائنين (سيتم تطبيقه لاحقاً)
    return 0
  }

  private async getActualAccountBalances(startDate: Date, endDate: Date): Promise<Record<string, number>> {
    // الحصول على أرصدة الحسابات الفعلية
    return {}
  }

  private async generateBalanceSheet(asOfDate: Date): Promise<any> {
    // إنشاء الميزانية العمومية (مبسطة)
    return {
      assets: {
        current: {
          cash: 0,
          accountsReceivable: await this.getAccountsReceivableBalance(asOfDate),
          inventory: 0,
          total: 0
        },
        fixed: {
          total: 0
        },
        total: 0
      },
      liabilities: {
        current: {
          accountsPayable: await this.getAccountsPayableBalance(asOfDate),
          total: 0
        },
        longTerm: {
          total: 0
        },
        total: 0
      },
      equity: {
        total: 0
      }
    }
  }

  private async generateIncomeStatement(startDate: Date, endDate: Date): Promise<any> {
    // إنشاء قائمة الدخل (مبسطة)
    const revenue = await this.calculatePeriodRevenue(startDate, endDate)
    const expenses = await this.calculatePeriodExpenses(startDate, endDate)
    
    return {
      revenue: {
        total: revenue
      },
      expenses: {
        total: expenses
      },
      netIncome: revenue - expenses
    }
  }

  private getMonthsDifference(startDate: Date, endDate: Date): number {
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12
    return months - startDate.getMonth() + endDate.getMonth()
  }
}

// إنشاء مثيل واحد للخدمة
let advancedAccountingInstance: AdvancedAccountingService | null = null

export const getAdvancedAccountingService = (prisma: PrismaClient): AdvancedAccountingService => {
  if (!advancedAccountingInstance) {
    advancedAccountingInstance = new AdvancedAccountingService(prisma)
  }
  return advancedAccountingInstance
}

export default AdvancedAccountingService



