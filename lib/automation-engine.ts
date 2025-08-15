import { PrismaClient } from '@prisma/client'
import { getAdvancedNotificationService } from './advanced-notifications'

export interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: {
    event: string
    conditions: Array<{
      field: string
      operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'between'
      value: any
      secondValue?: any // للشرط between
    }>
  }
  actions: Array<{
    type: 'create_record' | 'update_record' | 'send_notification' | 'execute_function' | 'schedule_task'
    config: Record<string, any>
    delay?: number // بالثواني
  }>
  isActive: boolean
  priority: number
  createdAt: Date
  lastExecuted?: Date
  executionCount: number
}

export interface AutomationExecution {
  id: string
  ruleId: string
  triggerData: Record<string, any>
  startedAt: Date
  completedAt?: Date
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  results: Array<{
    actionType: string
    status: 'success' | 'failed'
    result?: any
    error?: string
    executedAt: Date
  }>
  errorMessage?: string
}

export interface ScheduledTask {
  id: string
  name: string
  type: 'recurring' | 'one_time'
  schedule: string // cron expression or date
  action: {
    type: string
    config: Record<string, any>
  }
  isActive: boolean
  nextRun: Date
  lastRun?: Date
  runCount: number
}

class AutomationEngine {
  private prisma: PrismaClient
  private rules: Map<string, AutomationRule> = new Map()
  private executions: Map<string, AutomationExecution> = new Map()
  private scheduledTasks: Map<string, ScheduledTask> = new Map()
  private isRunning = false
  private eventListeners: Map<string, Function[]> = new Map()

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.initializeDefaultRules()
    this.initializeDefaultTasks()
    this.startEngine()
  }

  /**
   * تهيئة القواعد الافتراضية
   */
  private initializeDefaultRules(): void {
    const rules: AutomationRule[] = [
      {
        id: 'auto_invoice_on_delivery',
        name: 'إنشاء فاتورة تلقائية عند التسليم',
        description: 'إنشاء فاتورة تلقائياً عندما يتم تسليم الشحنة',
        trigger: {
          event: 'shipment.status_changed',
          conditions: [
            { field: 'status', operator: 'equals', value: 'DELIVERED' }
          ]
        },
        actions: [
          {
            type: 'create_record',
            config: {
              model: 'invoice',
              data: {
                clientId: '{{clientId}}',
                shipmentId: '{{shipmentId}}',
                amount: '{{price}}',
                total: '{{price}}',
                status: 'PENDING',
                issuedDate: '{{now}}',
                dueDate: '{{addDays(now, 30)}}'
              }
            }
          },
          {
            type: 'send_notification',
            config: {
              event: 'invoice.created',
              data: {
                clientId: '{{clientId}}',
                invoiceNumber: '{{generatedInvoiceNumber}}',
                amount: '{{price}}'
              }
            },
            delay: 60
          }
        ],
        isActive: true,
        priority: 1,
        createdAt: new Date(),
        executionCount: 0
      },
      {
        id: 'overdue_invoice_reminder',
        name: 'تذكير الفواتير المتأخرة',
        description: 'إرسال تذكير للعملاء عند تأخر سداد الفواتير',
        trigger: {
          event: 'invoice.overdue_check',
          conditions: [
            { field: 'daysPastDue', operator: 'greater_than', value: 0 },
            { field: 'status', operator: 'equals', value: 'PENDING' }
          ]
        },
        actions: [
          {
            type: 'send_notification',
            config: {
              event: 'invoice.overdue',
              data: {
                clientId: '{{clientId}}',
                invoiceNumber: '{{invoiceNumber}}',
                amount: '{{total}}',
                daysPastDue: '{{daysPastDue}}',
                dueDate: '{{dueDate}}'
              }
            }
          },
          {
            type: 'update_record',
            config: {
              model: 'invoice',
              id: '{{invoiceId}}',
              data: {
                status: 'OVERDUE'
              }
            },
            delay: 0
          }
        ],
        isActive: true,
        priority: 2,
        createdAt: new Date(),
        executionCount: 0
      },
      {
        id: 'auto_receipt_voucher',
        name: 'إنشاء سند قبض تلقائي',
        description: 'إنشاء سند قبض عند استلام دفعة',
        trigger: {
          event: 'payment.received',
          conditions: [
            { field: 'status', operator: 'equals', value: 'COMPLETED' }
          ]
        },
        actions: [
          {
            type: 'execute_function',
            config: {
              function: 'generateReceiptVoucher',
              params: {
                paymentId: '{{paymentId}}',
                clientId: '{{clientId}}',
                amount: '{{amount}}',
                method: '{{method}}'
              }
            }
          },
          {
            type: 'send_notification',
            config: {
              event: 'payment.received',
              data: {
                clientId: '{{clientId}}',
                paymentReference: '{{reference}}',
                amount: '{{amount}}',
                paymentMethod: '{{method}}',
                receivedDate: '{{now}}'
              }
            },
            delay: 30
          }
        ],
        isActive: true,
        priority: 1,
        createdAt: new Date(),
        executionCount: 0
      },
      {
        id: 'shipment_tracking_update',
        name: 'تحديث تتبع الشحنة',
        description: 'إرسال تحديثات تتبع الشحنة للعملاء',
        trigger: {
          event: 'shipment.status_changed',
          conditions: [
            { field: 'status', operator: 'not_equals', value: 'PENDING' }
          ]
        },
        actions: [
          {
            type: 'send_notification',
            config: {
              event: 'shipment.status_update',
              template: 'shipment_tracking',
              data: {
                clientId: '{{clientId}}',
                trackingNumber: '{{trackingNumber}}',
                status: '{{status}}',
                currentLocation: '{{currentLocation}}',
                estimatedDelivery: '{{estimatedDelivery}}'
              }
            }
          }
        ],
        isActive: true,
        priority: 3,
        createdAt: new Date(),
        executionCount: 0
      },
      {
        id: 'client_credit_check',
        name: 'فحص حد الائتمان للعميل',
        description: 'فحص حد الائتمان عند إنشاء شحنة جديدة',
        trigger: {
          event: 'shipment.created',
          conditions: []
        },
        actions: [
          {
            type: 'execute_function',
            config: {
              function: 'checkClientCreditLimit',
              params: {
                clientId: '{{clientId}}',
                shipmentCost: '{{price}}'
              }
            }
          }
        ],
        isActive: true,
        priority: 1,
        createdAt: new Date(),
        executionCount: 0
      }
    ]

    rules.forEach(rule => {
      this.rules.set(rule.id, rule)
    })
  }

  /**
   * تهيئة المهام المجدولة الافتراضية
   */
  private initializeDefaultTasks(): void {
    const tasks: ScheduledTask[] = [
      {
        id: 'daily_overdue_check',
        name: 'فحص الفواتير المتأخرة يومياً',
        type: 'recurring',
        schedule: '0 9 * * *', // كل يوم في الساعة 9 صباحاً
        action: {
          type: 'check_overdue_invoices',
          config: {}
        },
        isActive: true,
        nextRun: this.calculateNextRun('0 9 * * *'),
        runCount: 0
      },
      {
        id: 'weekly_performance_report',
        name: 'تقرير الأداء الأسبوعي',
        type: 'recurring',
        schedule: '0 8 * * 1', // كل يوم اثنين في الساعة 8 صباحاً
        action: {
          type: 'generate_performance_report',
          config: {
            period: 'week',
            recipients: ['ADMIN', 'MANAGER']
          }
        },
        isActive: true,
        nextRun: this.calculateNextRun('0 8 * * 1'),
        runCount: 0
      },
      {
        id: 'monthly_financial_summary',
        name: 'ملخص مالي شهري',
        type: 'recurring',
        schedule: '0 10 1 * *', // أول يوم من كل شهر في الساعة 10 صباحاً
        action: {
          type: 'generate_financial_summary',
          config: {
            period: 'month',
            includeRatios: true,
            includeCashFlow: true
          }
        },
        isActive: true,
        nextRun: this.calculateNextRun('0 10 1 * *'),
        runCount: 0
      },
      {
        id: 'backup_database',
        name: 'نسخ احتياطي يومي لقاعدة البيانات',
        type: 'recurring',
        schedule: '0 2 * * *', // كل يوم في الساعة 2 فجراً
        action: {
          type: 'backup_database',
          config: {
            includeFiles: true,
            compression: true
          }
        },
        isActive: true,
        nextRun: this.calculateNextRun('0 2 * * *'),
        runCount: 0
      },
      {
        id: 'cleanup_old_logs',
        name: 'تنظيف السجلات القديمة',
        type: 'recurring',
        schedule: '0 3 * * 0', // كل يوم أحد في الساعة 3 فجراً
        action: {
          type: 'cleanup_logs',
          config: {
            retentionDays: 90,
            tables: ['security_logs', 'audit_logs']
          }
        },
        isActive: true,
        nextRun: this.calculateNextRun('0 3 * * 0'),
        runCount: 0
      }
    ]

    tasks.forEach(task => {
      this.scheduledTasks.set(task.id, task)
    })
  }

  /**
   * بدء محرك الأتمتة
   */
  private startEngine(): void {
    if (this.isRunning) return

    this.isRunning = true

    // معالج المهام المجدولة (كل دقيقة)
    setInterval(() => {
      this.processScheduledTasks()
    }, 60000)

    // معالج التنفيذات المعلقة (كل 10 ثوانٍ)
    setInterval(() => {
      this.processDelayedActions()
    }, 10000)

    console.log('🤖 محرك الأتمتة بدأ العمل')
  }

  /**
   * تشغيل قاعدة أتمتة
   */
  async triggerEvent(event: string, data: Record<string, any>): Promise<string[]> {
    const executionIds: string[] = []

    // البحث عن القواعد المطبقة
    const applicableRules = Array.from(this.rules.values()).filter(rule => {
      if (!rule.isActive || rule.trigger.event !== event) return false

      // فحص الشروط
      return rule.trigger.conditions.every(condition => {
        return this.evaluateCondition(condition, data)
      })
    })

    // ترتيب القواعد حسب الأولوية
    applicableRules.sort((a, b) => a.priority - b.priority)

    for (const rule of applicableRules) {
      const executionId = await this.executeRule(rule, data)
      if (executionId) {
        executionIds.push(executionId)
      }
    }

    return executionIds
  }

  /**
   * تقييم شرط
   */
  private evaluateCondition(
    condition: { field: string; operator: string; value: any; secondValue?: any },
    data: Record<string, any>
  ): boolean {
    const fieldValue = this.getNestedValue(data, condition.field)

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value
      case 'not_equals':
        return fieldValue !== condition.value
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value)
      case 'less_than':
        return Number(fieldValue) < Number(condition.value)
      case 'contains':
        return String(fieldValue).includes(condition.value)
      case 'between':
        const numValue = Number(fieldValue)
        return numValue >= Number(condition.value) && numValue <= Number(condition.secondValue)
      default:
        return true
    }
  }

  /**
   * تنفيذ قاعدة أتمتة
   */
  private async executeRule(rule: AutomationRule, data: Record<string, any>): Promise<string | null> {
    const execution: AutomationExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ruleId: rule.id,
      triggerData: data,
      startedAt: new Date(),
      status: 'running',
      results: []
    }

    this.executions.set(execution.id, execution)

    try {
      for (const action of rule.actions) {
        if (action.delay && action.delay > 0) {
          // تأجيل التنفيذ
          setTimeout(async () => {
            await this.executeAction(action, data, execution)
          }, action.delay * 1000)
        } else {
          // تنفيذ فوري
          await this.executeAction(action, data, execution)
        }
      }

      execution.status = 'completed'
      execution.completedAt = new Date()

      // تحديث عداد التنفيذ
      rule.executionCount++
      rule.lastExecuted = new Date()

      console.log(`✅ تم تنفيذ قاعدة الأتمتة: ${rule.name}`)
      return execution.id

    } catch (error) {
      execution.status = 'failed'
      execution.errorMessage = (error as Error).message
      execution.completedAt = new Date()

      console.error(`❌ فشل تنفيذ قاعدة الأتمتة: ${rule.name}`, error)
      return null
    }
  }

  /**
   * تنفيذ إجراء
   */
  private async executeAction(
    action: { type: string; config: Record<string, any> },
    data: Record<string, any>,
    execution: AutomationExecution
  ): Promise<void> {
    const result = {
      actionType: action.type,
      status: 'success' as const,
      executedAt: new Date()
    }

    try {
      switch (action.type) {
        case 'create_record':
          result.result = await this.createRecord(action.config, data)
          break

        case 'update_record':
          result.result = await this.updateRecord(action.config, data)
          break

        case 'send_notification':
          result.result = await this.sendNotification(action.config, data)
          break

        case 'execute_function':
          result.result = await this.executeFunction(action.config, data)
          break

        case 'schedule_task':
          result.result = await this.scheduleTask(action.config, data)
          break

        default:
          throw new Error(`نوع الإجراء غير مدعوم: ${action.type}`)
      }

    } catch (error) {
      result.status = 'failed'
      result.error = (error as Error).message
    }

    execution.results.push(result)
  }

  /**
   * إنشاء سجل جديد
   */
  private async createRecord(config: Record<string, any>, data: Record<string, any>): Promise<any> {
    const model = config.model
    const recordData = this.processTemplateObject(config.data, data)

    // في التطبيق الحقيقي، ستستخدم Prisma
    console.log(`إنشاء سجل جديد في ${model}:`, recordData)
    
    // محاكاة إنشاء السجل
    return { id: `${model}_${Date.now()}`, ...recordData }
  }

  /**
   * تحديث سجل موجود
   */
  private async updateRecord(config: Record<string, any>, data: Record<string, any>): Promise<any> {
    const model = config.model
    const recordId = this.processTemplate(config.id, data)
    const updateData = this.processTemplateObject(config.data, data)

    console.log(`تحديث سجل ${recordId} في ${model}:`, updateData)
    
    // محاكاة تحديث السجل
    return { id: recordId, ...updateData }
  }

  /**
   * إرسال إشعار
   */
  private async sendNotification(config: Record<string, any>, data: Record<string, any>): Promise<any> {
    const notificationService = getAdvancedNotificationService(this.prisma)
    const event = config.event
    const notificationData = this.processTemplateObject(config.data, data)

    return await notificationService.sendSmartNotification(event, notificationData)
  }

  /**
   * تنفيذ دالة
   */
  private async executeFunction(config: Record<string, any>, data: Record<string, any>): Promise<any> {
    const functionName = config.function
    const params = this.processTemplateObject(config.params, data)

    console.log(`تنفيذ الدالة ${functionName} مع المعاملات:`, params)

    // تنفيذ الدوال المخصصة
    switch (functionName) {
      case 'generateReceiptVoucher':
        return await this.generateReceiptVoucher(params)
      case 'checkClientCreditLimit':
        return await this.checkClientCreditLimit(params)
      default:
        throw new Error(`الدالة غير موجودة: ${functionName}`)
    }
  }

  /**
   * جدولة مهمة
   */
  private async scheduleTask(config: Record<string, any>, data: Record<string, any>): Promise<any> {
    const task: ScheduledTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: config.name || 'مهمة مجدولة',
      type: config.type || 'one_time',
      schedule: config.schedule,
      action: config.action,
      isActive: true,
      nextRun: new Date(Date.now() + (config.delayMinutes || 0) * 60000),
      runCount: 0
    }

    this.scheduledTasks.set(task.id, task)
    return task
  }

  /**
   * معالجة المهام المجدولة
   */
  private async processScheduledTasks(): Promise<void> {
    const now = new Date()

    for (const task of this.scheduledTasks.values()) {
      if (!task.isActive || task.nextRun > now) continue

      try {
        await this.executeScheduledTask(task)
        task.runCount++
        task.lastRun = now

        if (task.type === 'recurring') {
          task.nextRun = this.calculateNextRun(task.schedule)
        } else {
          task.isActive = false
        }

      } catch (error) {
        console.error(`خطأ في تنفيذ المهمة المجدولة: ${task.name}`, error)
      }
    }
  }

  /**
   * تنفيذ مهمة مجدولة
   */
  private async executeScheduledTask(task: ScheduledTask): Promise<void> {
    console.log(`🕒 تنفيذ المهمة المجدولة: ${task.name}`)

    switch (task.action.type) {
      case 'check_overdue_invoices':
        await this.checkOverdueInvoices()
        break
      case 'generate_performance_report':
        await this.generatePerformanceReport(task.action.config)
        break
      case 'generate_financial_summary':
        await this.generateFinancialSummary(task.action.config)
        break
      case 'backup_database':
        await this.backupDatabase(task.action.config)
        break
      case 'cleanup_logs':
        await this.cleanupLogs(task.action.config)
        break
      default:
        console.log(`نوع المهمة غير مدعوم: ${task.action.type}`)
    }
  }

  /**
   * معالجة الإجراءات المؤجلة
   */
  private processDelayedActions(): void {
    // في التطبيق الحقيقي، ستعالج الإجراءات المؤجلة من قاعدة البيانات
    console.log('🔄 معالجة الإجراءات المؤجلة...')
  }

  // Helper methods
  private processTemplate(template: string, data: Record<string, any>): string {
    let result = template
    
    // استبدال المتغيرات العادية
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      result = result.replace(regex, String(data[key] || ''))
    })

    // معالجة الدوال الخاصة
    result = result.replace(/{{now}}/g, new Date().toISOString())
    result = result.replace(/{{addDays\(now,\s*(\d+)\)}}/g, (_, days) => {
      const date = new Date()
      date.setDate(date.getDate() + parseInt(days))
      return date.toISOString()
    })

    return result
  }

  private processTemplateObject(obj: any, data: Record<string, any>): any {
    if (typeof obj === 'string') {
      return this.processTemplate(obj, data)
    } else if (Array.isArray(obj)) {
      return obj.map(item => this.processTemplateObject(item, data))
    } else if (obj && typeof obj === 'object') {
      const result: any = {}
      Object.keys(obj).forEach(key => {
        result[key] = this.processTemplateObject(obj[key], data)
      })
      return result
    }
    return obj
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  private calculateNextRun(cronExpression: string): Date {
    // تحليل بسيط لتعبير cron (في التطبيق الحقيقي، استخدم مكتبة cron)
    const now = new Date()
    const [minute, hour, dayOfMonth, month, dayOfWeek] = cronExpression.split(' ')

    const nextRun = new Date(now)
    
    if (minute !== '*') nextRun.setMinutes(parseInt(minute))
    if (hour !== '*') nextRun.setHours(parseInt(hour))
    
    // إذا كان الوقت قد مر اليوم، انتقل لليوم التالي
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1)
    }

    return nextRun
  }

  // Custom functions
  private async generateReceiptVoucher(params: any): Promise<any> {
    console.log('إنشاء سند قبض:', params)
    return { voucherId: `RV_${Date.now()}`, ...params }
  }

  private async checkClientCreditLimit(params: any): Promise<any> {
    console.log('فحص حد الائتمان للعميل:', params)
    return { approved: true, remainingCredit: 50000 }
  }

  private async checkOverdueInvoices(): Promise<void> {
    console.log('🔍 فحص الفواتير المتأخرة...')
    // تشغيل قاعدة تذكير الفواتير المتأخرة
    await this.triggerEvent('invoice.overdue_check', {})
  }

  private async generatePerformanceReport(config: any): Promise<void> {
    console.log('📊 إنشاء تقرير الأداء...', config)
  }

  private async generateFinancialSummary(config: any): Promise<void> {
    console.log('💰 إنشاء الملخص المالي...', config)
  }

  private async backupDatabase(config: any): Promise<void> {
    console.log('💾 نسخ احتياطي لقاعدة البيانات...', config)
  }

  private async cleanupLogs(config: any): Promise<void> {
    console.log('🧹 تنظيف السجلات القديمة...', config)
  }

  // Public methods
  getRules(): AutomationRule[] {
    return Array.from(this.rules.values())
  }

  getExecutions(): AutomationExecution[] {
    return Array.from(this.executions.values())
  }

  getScheduledTasks(): ScheduledTask[] {
    return Array.from(this.scheduledTasks.values())
  }

  addRule(rule: AutomationRule): void {
    this.rules.set(rule.id, rule)
  }

  updateRule(id: string, updates: Partial<AutomationRule>): boolean {
    const rule = this.rules.get(id)
    if (rule) {
      this.rules.set(id, { ...rule, ...updates })
      return true
    }
    return false
  }

  deleteRule(id: string): boolean {
    return this.rules.delete(id)
  }

  addScheduledTask(task: ScheduledTask): void {
    this.scheduledTasks.set(task.id, task)
  }

  updateScheduledTask(id: string, updates: Partial<ScheduledTask>): boolean {
    const task = this.scheduledTasks.get(id)
    if (task) {
      this.scheduledTasks.set(id, { ...task, ...updates })
      return true
    }
    return false
  }

  deleteScheduledTask(id: string): boolean {
    return this.scheduledTasks.delete(id)
  }

  getStats(): {
    totalRules: number
    activeRules: number
    totalExecutions: number
    successfulExecutions: number
    failedExecutions: number
    scheduledTasks: number
    activeTasks: number
  } {
    const executions = Array.from(this.executions.values())
    
    return {
      totalRules: this.rules.size,
      activeRules: Array.from(this.rules.values()).filter(r => r.isActive).length,
      totalExecutions: executions.length,
      successfulExecutions: executions.filter(e => e.status === 'completed').length,
      failedExecutions: executions.filter(e => e.status === 'failed').length,
      scheduledTasks: this.scheduledTasks.size,
      activeTasks: Array.from(this.scheduledTasks.values()).filter(t => t.isActive).length
    }
  }
}

// إنشاء مثيل واحد للخدمة
let automationEngineInstance: AutomationEngine | null = null

export const getAutomationEngine = (prisma: PrismaClient): AutomationEngine => {
  if (!automationEngineInstance) {
    automationEngineInstance = new AutomationEngine(prisma)
  }
  return automationEngineInstance
}

export default AutomationEngine


