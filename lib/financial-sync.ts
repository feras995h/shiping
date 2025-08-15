import { PrismaClient } from '@prisma/client'
import { useGlStore } from './gl-store'
import { useGlTransactions } from './gl-transactions'
import { getAccountingService } from './accounting-service'

/**
 * خدمة مزامنة البيانات المالية بين المخزن المحلي وقاعدة البيانات
 */
class FinancialSyncService {
  private prisma: PrismaClient
  private syncInProgress = false
  private lastSyncTime: Date | null = null

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  /**
   * مزامنة دليل الحسابات من قاعدة البيانات
   */
  async syncChartOfAccounts(): Promise<void> {
    try {
      const accounts = await this.prisma.glAccount.findMany({
        include: {
          currency: { select: { code: true } }
        },
        orderBy: { code: 'asc' }
      })

      const gl = useGlStore.getState()
      
      // تحويل إلى تنسيق المخزن المحلي
      const formattedAccounts = accounts.map(acc => ({
        id: acc.id,
        name: acc.name,
        code: acc.code,
        level: acc.level,
        parentId: acc.parentId,
        rootType: acc.rootType as any,
        nature: acc.nature as any,
        currencyCode: acc.currency.code,
        isSystem: acc.isSystem,
        isActive: acc.isActive,
        movementsCount: 0 // سيتم حسابها لاحقاً
      }))

      // تحديث المخزن المحلي
      gl.accounts = formattedAccounts
      
    } catch (error) {
      console.error('خطأ في مزامنة دليل الحسابات:', error)
    }
  }

  /**
   * مزامنة القيود المحاسبية من قاعدة البيانات
   */
  async syncJournalEntries(fromDate?: string, toDate?: string): Promise<void> {
    try {
      const accountingService = getAccountingService(this.prisma)
      
      // تحديد الفترة الزمنية
      const startDate = fromDate || '2024-01-01'
      const endDate = toDate || new Date().toISOString().split('T')[0]

      // جلب القيود من قاعدة البيانات
      const entries = await accountingService.getJournalEntriesForPeriod(startDate, endDate)
      
      const tx = useGlTransactions.getState()
      
      // مسح القيود المحلية الحالية
      tx.entries = []
      
      // إضافة القيود من قاعدة البيانات
      entries.forEach(entry => {
        const result = tx.addEntry(entry)
        if (!result.ok) {
          console.warn('فشل في إضافة القيد:', result.error)
        }
      })

    } catch (error) {
      console.error('خطأ في مزامنة القيود المحاسبية:', error)
    }
  }

  /**
   * مزامنة البيانات المالية بالكامل
   */
  async fullSync(): Promise<{ success: boolean; message: string }> {
    if (this.syncInProgress) {
      return { success: false, message: 'المزامنة قيد التشغيل بالفعل' }
    }

    try {
      this.syncInProgress = true
      
      // 1. مزامنة دليل الحسابات
      await this.syncChartOfAccounts()
      
      // 2. مزامنة القيود المحاسبية
      await this.syncJournalEntries()
      
      // 3. تحديث وقت آخر مزامنة
      this.lastSyncTime = new Date()
      
      return { success: true, message: 'تمت المزامنة بنجاح' }

    } catch (error) {
      console.error('خطأ في المزامنة الكاملة:', error)
      return { success: false, message: 'فشل في المزامنة: ' + (error as Error).message }
    } finally {
      this.syncInProgress = false
    }
  }

  /**
   * مزامنة تلقائية في الخلفية
   */
  async autoSync(): Promise<void> {
    try {
      // تحقق من آخر مزامنة
      const now = new Date()
      if (this.lastSyncTime) {
        const diffMinutes = (now.getTime() - this.lastSyncTime.getTime()) / (1000 * 60)
        if (diffMinutes < 5) {
          // لا تزامن إذا كانت آخر مزامنة قبل أقل من 5 دقائق
          return
        }
      }

      await this.fullSync()
    } catch (error) {
      console.error('خطأ في المزامنة التلقائية:', error)
    }
  }

  /**
   * التحقق من حالة المزامنة
   */
  getSyncStatus(): {
    inProgress: boolean
    lastSync: Date | null
    minutesSinceLastSync: number | null
  } {
    const minutesSinceLastSync = this.lastSyncTime 
      ? Math.floor((new Date().getTime() - this.lastSyncTime.getTime()) / (1000 * 60))
      : null

    return {
      inProgress: this.syncInProgress,
      lastSync: this.lastSyncTime,
      minutesSinceLastSync
    }
  }

  /**
   * إنشاء نسخة احتياطية محلية من البيانات
   */
  async createLocalBackup(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const gl = useGlStore.getState()
      const tx = useGlTransactions.getState()

      const backup = {
        timestamp: new Date().toISOString(),
        accounts: gl.accounts,
        transactions: tx.entries,
        version: '1.0'
      }

      // حفظ في localStorage
      localStorage.setItem('financial_backup', JSON.stringify(backup))

      return { success: true, data: backup }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  /**
   * استعادة البيانات من النسخة الاحتياطية
   */
  async restoreFromBackup(): Promise<{ success: boolean; message: string }> {
    try {
      const backupData = localStorage.getItem('financial_backup')
      if (!backupData) {
        return { success: false, message: 'لا توجد نسخة احتياطية متاحة' }
      }

      const backup = JSON.parse(backupData)
      
      const gl = useGlStore.getState()
      const tx = useGlTransactions.getState()

      // استعادة البيانات
      gl.accounts = backup.accounts || []
      tx.entries = backup.transactions || []

      return { success: true, message: 'تم استعادة البيانات بنجاح' }
    } catch (error) {
      return { success: false, message: 'فشل في استعادة البيانات: ' + (error as Error).message }
    }
  }

  /**
   * تشغيل المزامنة التلقائية بشكل دوري
   */
  startAutoSync(intervalMinutes = 10): NodeJS.Timeout | null {
    if (typeof window === 'undefined') {
      // لا تشغل في بيئة الخادم
      return null
    }

    return setInterval(() => {
      this.autoSync()
    }, intervalMinutes * 60 * 1000)
  }

  /**
   * إيقاف المزامنة التلقائية
   */
  stopAutoSync(interval: NodeJS.Timeout): void {
    clearInterval(interval)
  }
}

// إنشاء مثيل واحد للخدمة
let financialSyncInstance: FinancialSyncService | null = null

export const getFinancialSyncService = (prisma: PrismaClient): FinancialSyncService => {
  if (!financialSyncInstance) {
    financialSyncInstance = new FinancialSyncService(prisma)
  }
  return financialSyncInstance
}

export default FinancialSyncService


