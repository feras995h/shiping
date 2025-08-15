import { PrismaClient } from '@prisma/client'
import { getAuditTrail } from './audit-trail'
import { useGlStore } from './gl-store'
import { useGlTransactions, JournalEntry, JournalLine } from './gl-transactions'

export interface AccountingTransaction {
  id?: string
  date: string
  reference?: string
  description?: string
  amount: number
  type: 'INVOICE' | 'PAYMENT' | 'RECEIPT' | 'TRANSFER' | 'EXPENSE' | 'MANUAL'
  relatedId?: string // ID of invoice, payment, etc.
  entries: JournalLine[]
}

export interface AutoJournalConfig {
  invoiceSale: {
    debitAccount: string // حسابات العملاء
    creditAccount: string // الإيرادات
  }
  paymentReceived: {
    debitAccount: string // النقدية/البنك
    creditAccount: string // حسابات العملاء
  }
  expense: {
    debitAccount: string // المصروفات
    creditAccount: string // النقدية/البنك
  }
  supplierInvoice: {
    debitAccount: string // المشتريات/المصروفات
    creditAccount: string // حسابات الموردين
  }
  payroll: {
    debitAccount: string // مصروفات الرواتب
    creditAccount: string // النقدية/البنك
  }
}

class AccountingService {
  private prisma: PrismaClient
  private defaultConfig: AutoJournalConfig

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.defaultConfig = {
      invoiceSale: {
        debitAccount: '1.1.2.3', // المدينون - عملاء
        creditAccount: '5.1', // خدمات الشحن
      },
      paymentReceived: {
        debitAccount: '1.1.1.1', // الخزينة الرئيسية
        creditAccount: '1.1.2.3', // المدينون - عملاء
      },
      expense: {
        debitAccount: '2.1', // إدارية وعمومية
        creditAccount: '1.1.1.1', // الخزينة الرئيسية
      },
      supplierInvoice: {
        debitAccount: '2.3', // شراء
        creditAccount: '3.1.1', // الدائنون - موظفون
      },
      payroll: {
        debitAccount: '2.1', // إدارية وعمومية
        creditAccount: '1.1.1.1', // الخزينة الرئيسية
      }
    }
  }

  /**
   * إنشاء قيد يومية جديد وحفظه في قاعدة البيانات والمخزن المحلي
   */
  async createJournalEntry(transaction: AccountingTransaction): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      // التحقق من التوازن
      const totalDebit = transaction.entries.reduce((sum, entry) => sum + (entry.debit || 0), 0)
      const totalCredit = transaction.entries.reduce((sum, entry) => sum + (entry.credit || 0), 0)
      
      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return { success: false, error: 'القيد غير متوازن: مجموع المدين يجب أن يساوي مجموع الدائن' }
      }

      // حفظ في قاعدة البيانات
      const savedEntry = await this.prisma.journalEntry.create({
        data: {
          date: new Date(transaction.date),
          reference: transaction.reference || '',
          description: transaction.description || '',
          amount: transaction.amount,
          type: transaction.type,
          relatedId: transaction.relatedId,
          entries: {
            create: transaction.entries.map(entry => ({
              accountId: entry.accountId,
              debit: entry.debit || 0,
              credit: entry.credit || 0,
            }))
          }
        },
        include: {
          entries: true
        }
      })

      // سجل التدقيق: إنشاء قيد
      try {
        const audit = getAuditTrail(this.prisma)
        await audit.logCreate('JOURNAL_ENTRY', savedEntry.id, {
          amount: savedEntry.amount,
          reference: savedEntry.reference,
          lines: transaction.entries,
        })
      } catch (_) {}

      // تحديث المخزن المحلي
      const glTx = useGlTransactions.getState()
      const journalEntry: JournalEntry = {
        id: savedEntry.id,
        date: transaction.date,
        reference: transaction.reference,
        description: transaction.description,
        currency: 'LYD', // يمكن تحسينها لاحقاً
        lines: transaction.entries
      }

      const result = glTx.addEntry(journalEntry)
      
      if (!result.ok) {
        // إذا فشل التحديث المحلي، احذف من قاعدة البيانات
        await this.prisma.journalEntry.delete({ where: { id: savedEntry.id } })
        return { success: false, error: result.error }
      }

      return { success: true, id: savedEntry.id }

    } catch (error) {
      console.error('خطأ في إنشاء القيد:', error)
      return { success: false, error: 'حدث خطأ أثناء حفظ القيد المحاسبي' }
    }
  }

  /**
   * إنشاء قيد تلقائي للفاتورة
   */
  async createInvoiceJournalEntry(invoice: {
    id: string
    amount: number
    clientId: string
    invoiceNumber: string
    description?: string
    date: string
  }): Promise<{ success: boolean; journalId?: string; error?: string }> {
    
    const gl = useGlStore.getState()
    
    // البحث عن الحسابات المطلوبة
    const debitAccount = gl.accounts.find(acc => acc.code === this.defaultConfig.invoiceSale.debitAccount)
    const creditAccount = gl.accounts.find(acc => acc.code === this.defaultConfig.invoiceSale.creditAccount)

    if (!debitAccount || !creditAccount) {
      return { 
        success: false, 
        error: 'لم يتم العثور على حسابات المدينين أو الإيرادات في دليل الحسابات' 
      }
    }

    const transaction: AccountingTransaction = {
      date: invoice.date,
      reference: `INV-${invoice.invoiceNumber}`,
      description: `فاتورة بيع رقم ${invoice.invoiceNumber} - ${invoice.description || ''}`,
      amount: invoice.amount,
      type: 'INVOICE',
      relatedId: invoice.id,
      entries: [
        {
          accountId: debitAccount.id,
          debit: invoice.amount,
          credit: 0
        },
        {
          accountId: creditAccount.id,
          debit: 0,
          credit: invoice.amount
        }
      ]
    }

    return await this.createJournalEntry(transaction)
  }

  /**
   * إنشاء قيد تلقائي للدفعة المستلمة
   */
  async createPaymentReceivedJournalEntry(payment: {
    id: string
    amount: number
    clientId: string
    method: string
    reference?: string
    description?: string
    date: string
  }): Promise<{ success: boolean; journalId?: string; error?: string }> {
    
    const gl = useGlStore.getState()
    
    const debitAccount = gl.accounts.find(acc => acc.code === this.defaultConfig.paymentReceived.debitAccount)
    const creditAccount = gl.accounts.find(acc => acc.code === this.defaultConfig.paymentReceived.creditAccount)

    if (!debitAccount || !creditAccount) {
      return { 
        success: false, 
        error: 'لم يتم العثور على حسابات النقدية أو المدينين في دليل الحسابات' 
      }
    }

    const transaction: AccountingTransaction = {
      date: payment.date,
      reference: payment.reference || `PAY-${payment.id.slice(-6)}`,
      description: `استلام دفعة - ${payment.method} - ${payment.description || ''}`,
      amount: payment.amount,
      type: 'RECEIPT',
      relatedId: payment.id,
      entries: [
        {
          accountId: debitAccount.id,
          debit: payment.amount,
          credit: 0
        },
        {
          accountId: creditAccount.id,
          debit: 0,
          credit: payment.amount
        }
      ]
    }

    return await this.createJournalEntry(transaction)
  }

  /**
   * إنشاء قيد تلقائي للمصروفات
   */
  async createExpenseJournalEntry(expense: {
    id: string
    amount: number
    category: string
    description: string
    date: string
    paymentMethod: string
  }): Promise<{ success: boolean; journalId?: string; error?: string }> {
    
    const gl = useGlStore.getState()
    
    const debitAccount = gl.accounts.find(acc => acc.code === this.defaultConfig.expense.debitAccount)
    const creditAccount = gl.accounts.find(acc => acc.code === this.defaultConfig.expense.creditAccount)

    if (!debitAccount || !creditAccount) {
      return { 
        success: false, 
        error: 'لم يتم العثور على حسابات المصروفات أو النقدية في دليل الحسابات' 
      }
    }

    const transaction: AccountingTransaction = {
      date: expense.date,
      reference: `EXP-${expense.id.slice(-6)}`,
      description: `مصروف - ${expense.category} - ${expense.description}`,
      amount: expense.amount,
      type: 'EXPENSE',
      relatedId: expense.id,
      entries: [
        {
          accountId: debitAccount.id,
          debit: expense.amount,
          credit: 0
        },
        {
          accountId: creditAccount.id,
          debit: 0,
          credit: expense.amount
        }
      ]
    }

    return await this.createJournalEntry(transaction)
  }

  /**
   * تحديث إعدادات الحسابات التلقائية
   */
  async updateAutoJournalConfig(config: Partial<AutoJournalConfig>): Promise<void> {
    this.defaultConfig = { ...this.defaultConfig, ...config }
    // يمكن حفظ الإعدادات في قاعدة البيانات لاحقاً
  }

  /**
   * جلب جميع القيود للفترة المحددة
   */
  async getJournalEntriesForPeriod(startDate: string, endDate: string): Promise<JournalEntry[]> {
    try {
      const entries = await this.prisma.journalEntry.findMany({
        where: {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        include: {
          entries: true
        },
        orderBy: { date: 'desc' }
      })

      return entries.map(entry => ({
        id: entry.id,
        date: entry.date.toISOString().split('T')[0],
        reference: entry.reference || undefined,
        description: entry.description || undefined,
        currency: 'LYD', // يمكن تحسينها
        lines: entry.entries.map(line => ({
          accountId: line.accountId,
          debit: line.debit,
          credit: line.credit
        }))
      }))

    } catch (error) {
      console.error('خطأ في جلب القيود:', error)
      return []
    }
  }

  /**
   * تحديث المخزن المحلي من قاعدة البيانات
   */
  async syncLocalStoreWithDatabase(): Promise<void> {
    try {
      const entries = await this.getJournalEntriesForPeriod('2024-01-01', '2025-12-31')
      const glTx = useGlTransactions.getState()
      
      // مسح البيانات المحلية الحالية وإعادة تحميلها
      entries.forEach(entry => {
        glTx.addEntry(entry)
      })

    } catch (error) {
      console.error('خطأ في مزامنة البيانات:', error)
    }
  }
}

// إنشاء مثيل واحد للخدمة
let accountingServiceInstance: AccountingService | null = null

export const getAccountingService = (prisma: PrismaClient): AccountingService => {
  if (!accountingServiceInstance) {
    accountingServiceInstance = new AccountingService(prisma)
  }
  return accountingServiceInstance
}

export default AccountingService


