import { PrismaClient } from '@prisma/client'
import { useGlTransactions } from './gl-transactions'
import { useGlStore } from './gl-store'

export interface FinancialAlert {
  id: string
  type: 'BALANCE_MISMATCH' | 'OVERDUE_INVOICE' | 'LOW_CASH' | 'NEGATIVE_BALANCE' | 'LARGE_TRANSACTION' | 'SYSTEM_ERROR'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  title: string
  message: string
  data?: any
  createdAt: Date
  isRead: boolean
  actions?: FinancialAlertAction[]
}

export interface FinancialAlertAction {
  label: string
  action: string
  url?: string
}

export interface AlertThresholds {
  lowCashAmount: number
  largeTransactionAmount: number
  overdueInvoiceDays: number
  balanceMismatchTolerance: number
}

class FinancialAlertsService {
  private prisma: PrismaClient
  private alerts: FinancialAlert[] = []
  private thresholds: AlertThresholds

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.thresholds = {
      lowCashAmount: 10000, // تحت 10,000 د.ل
      largeTransactionAmount: 50000, // أكثر من 50,000 د.ل
      overdueInvoiceDays: 30, // 30 يوم
      balanceMismatchTolerance: 0.01 // 0.01 د.ل
    }
  }

  /**
   * فحص التوازن المحاسبي وإنشاء تنبيه إذا لزم الأمر
   */
  checkAccountingBalance(): FinancialAlert[] {
    const alerts: FinancialAlert[] = []
    const tx = useGlTransactions.getState()
    const gl = useGlStore.getState()
    
    try {
      const balances = tx.computeBalances()
      let totalDebit = 0
      let totalCredit = 0

      // حساب إجمالي المدين والدائن
      for (const acc of gl.accounts) {
        const balance = balances[acc.id] || 0
        if (balance > 0) totalDebit += balance
        if (balance < 0) totalCredit += Math.abs(balance)
      }

      const difference = Math.abs(totalDebit - totalCredit)
      
      if (difference > this.thresholds.balanceMismatchTolerance) {
        alerts.push({
          id: `balance_mismatch_${Date.now()}`,
          type: 'BALANCE_MISMATCH',
          severity: difference > 1000 ? 'CRITICAL' : 'HIGH',
          title: 'عدم توازن في الميزان المحاسبي',
          message: `يوجد فرق في الميزان المحاسبي بقيمة ${difference.toLocaleString()} د.ل. المدين: ${totalDebit.toLocaleString()} د.ل، الدائن: ${totalCredit.toLocaleString()} د.ل`,
          data: { totalDebit, totalCredit, difference },
          createdAt: new Date(),
          isRead: false,
          actions: [
            { label: 'مراجعة ميزان المراجعة', action: 'navigate', url: '/accounting/trial-balance' },
            { label: 'مراجعة القيود اليومية', action: 'navigate', url: '/accounting/journal' }
          ]
        })
      }
    } catch (error) {
      console.error('خطأ في فحص التوازن المحاسبي:', error)
    }

    return alerts
  }

  /**
   * فحص مستوى السيولة النقدية
   */
  async checkCashFlow(): Promise<FinancialAlert[]> {
    const alerts: FinancialAlert[] = []
    
    try {
      const gl = useGlStore.getState()
      const tx = useGlTransactions.getState()
      const balances = tx.computeBalances()

      let totalCash = 0
      const cashAccounts = gl.accounts.filter(acc => acc.code.startsWith('1.1.1'))
      
      for (const acc of cashAccounts) {
        const balance = balances[acc.id] || 0
        totalCash += balance
      }

      if (totalCash < this.thresholds.lowCashAmount) {
        alerts.push({
          id: `low_cash_${Date.now()}`,
          type: 'LOW_CASH',
          severity: totalCash < this.thresholds.lowCashAmount / 2 ? 'CRITICAL' : 'HIGH',
          title: 'مستوى السيولة النقدية منخفض',
          message: `السيولة النقدية المتاحة ${totalCash.toLocaleString()} د.ل أقل من الحد الأدنى المطلوب ${this.thresholds.lowCashAmount.toLocaleString()} د.ل`,
          data: { totalCash, threshold: this.thresholds.lowCashAmount },
          createdAt: new Date(),
          isRead: false,
          actions: [
            { label: 'مراجعة التدفق النقدي', action: 'navigate', url: '/reports/financial' },
            { label: 'متابعة المدينين', action: 'navigate', url: '/financial/dashboard' }
          ]
        })
      }
    } catch (error) {
      console.error('خطأ في فحص السيولة النقدية:', error)
    }

    return alerts
  }

  /**
   * فحص الفواتير المتأخرة
   */
  async checkOverdueInvoices(): Promise<FinancialAlert[]> {
    const alerts: FinancialAlert[] = []
    
    try {
      const overdueDate = new Date()
      overdueDate.setDate(overdueDate.getDate() - this.thresholds.overdueInvoiceDays)

      const overdueInvoices = await this.prisma.invoice.findMany({
        where: {
          status: 'PENDING',
          dueDate: {
            lt: overdueDate
          }
        },
        include: {
          client: { select: { name: true } }
        }
      })

      if (overdueInvoices.length > 0) {
        const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + parseFloat(inv.total.toString()), 0)
        
        alerts.push({
          id: `overdue_invoices_${Date.now()}`,
          type: 'OVERDUE_INVOICE',
          severity: overdueInvoices.length > 10 ? 'HIGH' : 'MEDIUM',
          title: `${overdueInvoices.length} فاتورة متأخرة السداد`,
          message: `يوجد ${overdueInvoices.length} فاتورة متأخرة عن موعد السداد بإجمالي ${totalOverdue.toLocaleString()} د.ل`,
          data: { count: overdueInvoices.length, totalAmount: totalOverdue, invoices: overdueInvoices },
          createdAt: new Date(),
          isRead: false,
          actions: [
            { label: 'مراجعة الفواتير المتأخرة', action: 'navigate', url: '/invoices?status=overdue' },
            { label: 'متابعة التحصيل', action: 'navigate', url: '/financial/dashboard' }
          ]
        })
      }
    } catch (error) {
      console.error('خطأ في فحص الفواتير المتأخرة:', error)
    }

    return alerts
  }

  /**
   * فحص المعاملات الكبيرة
   */
  async checkLargeTransactions(): Promise<FinancialAlert[]> {
    const alerts: FinancialAlert[] = []
    
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const largeTransactions = await this.prisma.journalEntry.findMany({
        where: {
          amount: {
            gte: this.thresholds.largeTransactionAmount
          },
          createdAt: {
            gte: today
          }
        }
      })

      if (largeTransactions.length > 0) {
        for (const transaction of largeTransactions) {
          alerts.push({
            id: `large_transaction_${transaction.id}`,
            type: 'LARGE_TRANSACTION',
            severity: parseFloat(transaction.amount.toString()) > this.thresholds.largeTransactionAmount * 2 ? 'HIGH' : 'MEDIUM',
            title: 'معاملة مالية كبيرة',
            message: `تم تسجيل معاملة مالية بقيمة ${parseFloat(transaction.amount.toString()).toLocaleString()} د.ل - ${transaction.description || 'بدون وصف'}`,
            data: { transaction },
            createdAt: new Date(),
            isRead: false,
            actions: [
              { label: 'مراجعة القيد', action: 'navigate', url: '/accounting/journal' }
            ]
          })
        }
      }
    } catch (error) {
      console.error('خطأ في فحص المعاملات الكبيرة:', error)
    }

    return alerts
  }

  /**
   * فحص الحسابات ذات الأرصدة السالبة
   */
  checkNegativeBalances(): FinancialAlert[] {
    const alerts: FinancialAlert[] = []
    
    try {
      const gl = useGlStore.getState()
      const tx = useGlTransactions.getState()
      const balances = tx.computeBalances()

      const problematicAccounts = []
      
      for (const acc of gl.accounts) {
        const balance = balances[acc.id] || 0
        
        // فحص الحسابات التي يجب أن تكون موجبة (أصول)
        if (acc.rootType === 'ASSET' && balance < 0) {
          problematicAccounts.push({ account: acc, balance })
        }
        
        // فحص الحسابات التي يجب أن تكون سالبة (خصوم)
        if ((acc.rootType === 'LIABILITY' || acc.rootType === 'EQUITY' || acc.rootType === 'REVENUE') && balance > 0) {
          problematicAccounts.push({ account: acc, balance })
        }
      }

      if (problematicAccounts.length > 0) {
        alerts.push({
          id: `negative_balances_${Date.now()}`,
          type: 'NEGATIVE_BALANCE',
          severity: 'MEDIUM',
          title: `${problematicAccounts.length} حساب بأرصدة غير طبيعية`,
          message: `يوجد ${problematicAccounts.length} حساب بأرصدة غير طبيعية تحتاج مراجعة`,
          data: { accounts: problematicAccounts },
          createdAt: new Date(),
          isRead: false,
          actions: [
            { label: 'مراجعة ميزان المراجعة', action: 'navigate', url: '/accounting/trial-balance' }
          ]
        })
      }
    } catch (error) {
      console.error('خطأ في فحص الأرصدة السالبة:', error)
    }

    return alerts
  }

  /**
   * تشغيل جميع فحوصات التنبيهات
   */
  async runAllChecks(): Promise<FinancialAlert[]> {
    const allAlerts: FinancialAlert[] = []
    
    try {
      // فحص التوازن المحاسبي
      const balanceAlerts = this.checkAccountingBalance()
      allAlerts.push(...balanceAlerts)

      // فحص السيولة النقدية
      const cashAlerts = await this.checkCashFlow()
      allAlerts.push(...cashAlerts)

      // فحص الفواتير المتأخرة
      const overdueAlerts = await this.checkOverdueInvoices()
      allAlerts.push(...overdueAlerts)

      // فحص المعاملات الكبيرة
      const largeTransactionAlerts = await this.checkLargeTransactions()
      allAlerts.push(...largeTransactionAlerts)

      // فحص الأرصدة السالبة
      const negativeBalanceAlerts = this.checkNegativeBalances()
      allAlerts.push(...negativeBalanceAlerts)

      // حفظ التنبيهات في الذاكرة
      this.alerts = allAlerts

    } catch (error) {
      console.error('خطأ في تشغيل فحوصات التنبيهات:', error)
    }

    return allAlerts
  }

  /**
   * الحصول على التنبيهات الحالية
   */
  getAlerts(): FinancialAlert[] {
    return this.alerts
  }

  /**
   * وضع علامة قراءة على تنبيه
   */
  markAsRead(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.isRead = true
      return true
    }
    return false
  }

  /**
   * تحديث إعدادات العتبات
   */
  updateThresholds(newThresholds: Partial<AlertThresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds }
  }

  /**
   * حذف التنبيهات القديمة (أكبر من 7 أيام)
   */
  cleanupOldAlerts(): void {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    this.alerts = this.alerts.filter(alert => alert.createdAt > weekAgo)
  }
}

// إنشاء مثيل واحد للخدمة
let financialAlertsInstance: FinancialAlertsService | null = null

export const getFinancialAlertsService = (prisma: PrismaClient): FinancialAlertsService => {
  if (!financialAlertsInstance) {
    financialAlertsInstance = new FinancialAlertsService(prisma)
  }
  return financialAlertsInstance
}

export default FinancialAlertsService


