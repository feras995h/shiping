import { PrismaClient } from '@prisma/client'

export interface NotificationTemplate {
  id: string
  name: string
  type: 'email' | 'sms' | 'push' | 'in_app'
  subject: string
  content: string
  variables: string[]
  isActive: boolean
}

export interface NotificationRule {
  id: string
  name: string
  event: string
  conditions: Array<{
    field: string
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains'
    value: any
  }>
  recipients: Array<{
    type: 'user' | 'role' | 'email'
    value: string
  }>
  templateId: string
  isActive: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface NotificationDelivery {
  id: string
  notificationId: string
  recipientId: string
  recipientType: 'user' | 'email'
  channel: 'email' | 'sms' | 'push' | 'in_app'
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read'
  attempts: number
  lastAttempt?: Date
  deliveredAt?: Date
  readAt?: Date
  errorMessage?: string
}

export interface SmartNotification {
  id: string
  title: string
  content: string
  type: 'info' | 'success' | 'warning' | 'error'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  recipientId: string
  channels: ('email' | 'sms' | 'push' | 'in_app')[]
  scheduledFor?: Date
  expiresAt?: Date
  data?: Record<string, any>
  createdAt: Date
  isRead: boolean
  readAt?: Date
}

class AdvancedNotificationService {
  private prisma: PrismaClient
  private templates: Map<string, NotificationTemplate> = new Map()
  private rules: Map<string, NotificationRule> = new Map()
  private deliveryQueue: NotificationDelivery[] = []
  private retryAttempts = 3
  private retryDelay = 5000 // 5 seconds

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.initializeDefaultTemplates()
    this.initializeDefaultRules()
    this.startDeliveryProcessor()
  }

  /**
   * تهيئة القوالب الافتراضية
   */
  private initializeDefaultTemplates(): void {
    const templates: NotificationTemplate[] = [
      {
        id: 'shipment_created',
        name: 'إنشاء شحنة جديدة',
        type: 'email',
        subject: 'شحنة جديدة - {{trackingNumber}}',
        content: `
          مرحباً {{clientName}},
          
          تم إنشاء شحنة جديدة برقم التتبع: {{trackingNumber}}
          
          تفاصيل الشحنة:
          - المنشأ: {{origin}}
          - الوجهة: {{destination}}
          - الوزن: {{weight}} كيلو
          - التكلفة: {{cost}} د.ل
          
          يمكنك تتبع شحنتك من خلال الرابط التالي:
          {{trackingUrl}}
          
          شكراً لاختياركم الحصان الذهبي للشحن
        `,
        variables: ['clientName', 'trackingNumber', 'origin', 'destination', 'weight', 'cost', 'trackingUrl'],
        isActive: true
      },
      {
        id: 'shipment_delivered',
        name: 'تسليم الشحنة',
        type: 'email',
        subject: 'تم تسليم شحنتك - {{trackingNumber}}',
        content: `
          مرحباً {{clientName}},
          
          نسعد بإعلامك أنه تم تسليم شحنتك بنجاح.
          
          رقم التتبع: {{trackingNumber}}
          تاريخ التسليم: {{deliveryDate}}
          المستلم: {{recipient}}
          
          نشكرك لثقتك في خدماتنا
          
          الحصان الذهبي للشحن
        `,
        variables: ['clientName', 'trackingNumber', 'deliveryDate', 'recipient'],
        isActive: true
      },
      {
        id: 'invoice_overdue',
        name: 'فاتورة متأخرة السداد',
        type: 'email',
        subject: 'تذكير: فاتورة متأخرة السداد - {{invoiceNumber}}',
        content: `
          عزيزي {{clientName}},
          
          نود تذكيركم بأن الفاتورة رقم {{invoiceNumber}} متأخرة عن موعد السداد.
          
          تفاصيل الفاتورة:
          - رقم الفاتورة: {{invoiceNumber}}
          - المبلغ: {{amount}} د.ل
          - تاريخ الاستحقاق: {{dueDate}}
          - الأيام المتأخرة: {{daysPastDue}}
          
          يرجى سداد المبلغ في أقرب وقت ممكن.
          
          للاستفسار: {{contactInfo}}
        `,
        variables: ['clientName', 'invoiceNumber', 'amount', 'dueDate', 'daysPastDue', 'contactInfo'],
        isActive: true
      },
      {
        id: 'system_alert',
        name: 'تنبيه النظام',
        type: 'in_app',
        subject: 'تنبيه: {{alertType}}',
        content: `
          {{alertMessage}}
          
          التفاصيل: {{details}}
          الوقت: {{timestamp}}
          
          {{actionRequired}}
        `,
        variables: ['alertType', 'alertMessage', 'details', 'timestamp', 'actionRequired'],
        isActive: true
      },
      {
        id: 'payment_received',
        name: 'استلام دفعة',
        type: 'email',
        subject: 'تأكيد استلام الدفعة - {{paymentReference}}',
        content: `
          مرحباً {{clientName}},
          
          تم استلام دفعتكم بنجاح.
          
          تفاصيل الدفعة:
          - مرجع الدفعة: {{paymentReference}}
          - المبلغ: {{amount}} د.ل
          - طريقة الدفع: {{paymentMethod}}
          - تاريخ الاستلام: {{receivedDate}}
          
          شكراً لكم
          
          الحصان الذهبي للشحن
        `,
        variables: ['clientName', 'paymentReference', 'amount', 'paymentMethod', 'receivedDate'],
        isActive: true
      }
    ]

    templates.forEach(template => {
      this.templates.set(template.id, template)
    })
  }

  /**
   * تهيئة القواعد الافتراضية
   */
  private initializeDefaultRules(): void {
    const rules: NotificationRule[] = [
      {
        id: 'new_shipment_rule',
        name: 'إشعار إنشاء شحنة جديدة',
        event: 'shipment.created',
        conditions: [],
        recipients: [
          { type: 'user', value: 'client' }
        ],
        templateId: 'shipment_created',
        isActive: true,
        priority: 'medium'
      },
      {
        id: 'shipment_delivered_rule',
        name: 'إشعار تسليم الشحنة',
        event: 'shipment.delivered',
        conditions: [],
        recipients: [
          { type: 'user', value: 'client' }
        ],
        templateId: 'shipment_delivered',
        isActive: true,
        priority: 'high'
      },
      {
        id: 'overdue_invoice_rule',
        name: 'تنبيه الفواتير المتأخرة',
        event: 'invoice.overdue',
        conditions: [
          { field: 'daysPastDue', operator: 'greater_than', value: 7 }
        ],
        recipients: [
          { type: 'user', value: 'client' },
          { type: 'role', value: 'MANAGER' }
        ],
        templateId: 'invoice_overdue',
        isActive: true,
        priority: 'high'
      },
      {
        id: 'system_alert_rule',
        name: 'تنبيهات النظام',
        event: 'system.alert',
        conditions: [
          { field: 'severity', operator: 'equals', value: 'high' }
        ],
        recipients: [
          { type: 'role', value: 'ADMIN' }
        ],
        templateId: 'system_alert',
        isActive: true,
        priority: 'urgent'
      },
      {
        id: 'payment_received_rule',
        name: 'إشعار استلام الدفعة',
        event: 'payment.received',
        conditions: [],
        recipients: [
          { type: 'user', value: 'client' }
        ],
        templateId: 'payment_received',
        isActive: true,
        priority: 'medium'
      }
    ]

    rules.forEach(rule => {
      this.rules.set(rule.id, rule)
    })
  }

  /**
   * إرسال إشعار ذكي
   */
  async sendSmartNotification(
    event: string,
    data: Record<string, any>,
    recipientOverride?: Array<{ type: 'user' | 'role' | 'email'; value: string }>
  ): Promise<string[]> {
    const sentNotifications: string[] = []

    // البحث عن القواعد المطبقة
    const applicableRules = Array.from(this.rules.values()).filter(rule => {
      if (!rule.isActive || rule.event !== event) return false

      // فحص الشروط
      return rule.conditions.every(condition => {
        const fieldValue = data[condition.field]
        switch (condition.operator) {
          case 'equals':
            return fieldValue === condition.value
          case 'not_equals':
            return fieldValue !== condition.value
          case 'greater_than':
            return fieldValue > condition.value
          case 'less_than':
            return fieldValue < condition.value
          case 'contains':
            return String(fieldValue).includes(condition.value)
          default:
            return true
        }
      })
    })

    for (const rule of applicableRules) {
      const template = this.templates.get(rule.templateId)
      if (!template) continue

      // تحديد المستلمين
      const recipients = recipientOverride || rule.recipients
      
      for (const recipient of recipients) {
        const recipientIds = await this.resolveRecipients(recipient, data)
        
        for (const recipientId of recipientIds) {
          const notification: SmartNotification = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: this.processTemplate(template.subject, data),
            content: this.processTemplate(template.content, data),
            type: this.mapPriorityToType(rule.priority),
            priority: rule.priority,
            category: event.split('.')[0],
            recipientId,
            channels: this.determineChannels(template.type, rule.priority),
            data,
            createdAt: new Date(),
            isRead: false
          }

          // حفظ الإشعار
          await this.saveNotification(notification)
          
          // إضافة للطابور للإرسال
          await this.queueForDelivery(notification)
          
          sentNotifications.push(notification.id)
        }
      }
    }

    return sentNotifications
  }

  /**
   * معالجة القالب بالبيانات
   */
  private processTemplate(template: string, data: Record<string, any>): string {
    let processed = template
    
    // استبدال المتغيرات
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      processed = processed.replace(regex, String(data[key] || ''))
    })
    
    return processed
  }

  /**
   * تحديد المستلمين
   */
  private async resolveRecipients(
    recipient: { type: 'user' | 'role' | 'email'; value: string },
    data: Record<string, any>
  ): Promise<string[]> {
    switch (recipient.type) {
      case 'user':
        if (recipient.value === 'client' && data.clientId) {
          return [data.clientId]
        } else if (recipient.value === 'employee' && data.employeeId) {
          return [data.employeeId]
        } else {
          return [recipient.value]
        }
      
      case 'role':
        const users = await this.prisma.user.findMany({
          where: { role: recipient.value as any },
          select: { id: true }
        })
        return users.map(user => user.id)
      
      case 'email':
        return [recipient.value]
      
      default:
        return []
    }
  }

  /**
   * تحديد قنوات الإرسال
   */
  private determineChannels(
    templateType: 'email' | 'sms' | 'push' | 'in_app',
    priority: 'low' | 'medium' | 'high' | 'urgent'
  ): ('email' | 'sms' | 'push' | 'in_app')[] {
    const channels: ('email' | 'sms' | 'push' | 'in_app')[] = [templateType]
    
    // إضافة قنوات إضافية للأولويات العالية
    if (priority === 'urgent') {
      channels.push('in_app', 'push')
      if (templateType !== 'sms') channels.push('sms')
    } else if (priority === 'high') {
      channels.push('in_app')
    }
    
    return [...new Set(channels)] // إزالة المكررات
  }

  /**
   * تحويل الأولوية إلى نوع
   */
  private mapPriorityToType(priority: 'low' | 'medium' | 'high' | 'urgent'): 'info' | 'success' | 'warning' | 'error' {
    switch (priority) {
      case 'urgent':
        return 'error'
      case 'high':
        return 'warning'
      case 'medium':
        return 'info'
      case 'low':
      default:
        return 'success'
    }
  }

  /**
   * حفظ الإشعار في قاعدة البيانات
   */
  private async saveNotification(notification: SmartNotification): Promise<void> {
    try {
      await this.prisma.alert.create({
        data: {
          title: notification.title,
          message: notification.content,
          type: notification.type.toUpperCase() as any,
          isRead: false,
          userId: notification.recipientId
        }
      })
    } catch (error) {
      console.error('خطأ في حفظ الإشعار:', error)
    }
  }

  /**
   * إضافة للطابور للإرسال
   */
  private async queueForDelivery(notification: SmartNotification): Promise<void> {
    for (const channel of notification.channels) {
      const delivery: NotificationDelivery = {
        id: `delivery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        notificationId: notification.id,
        recipientId: notification.recipientId,
        recipientType: notification.recipientId.includes('@') ? 'email' : 'user',
        channel,
        status: 'pending',
        attempts: 0
      }

      this.deliveryQueue.push(delivery)
    }
  }

  /**
   * معالج إرسال الإشعارات
   */
  private startDeliveryProcessor(): void {
    setInterval(async () => {
      const pendingDeliveries = this.deliveryQueue.filter(d => d.status === 'pending')
      
      for (const delivery of pendingDeliveries) {
        if (delivery.attempts >= this.retryAttempts) {
          delivery.status = 'failed'
          delivery.errorMessage = 'تجاوز الحد الأقصى لمحاولات الإرسال'
          continue
        }

        try {
          await this.deliverNotification(delivery)
          delivery.status = 'sent'
          delivery.deliveredAt = new Date()
        } catch (error) {
          delivery.attempts++
          delivery.lastAttempt = new Date()
          delivery.errorMessage = (error as Error).message
          
          if (delivery.attempts >= this.retryAttempts) {
            delivery.status = 'failed'
          }
        }
      }

      // تنظيف الطابور من الإشعارات المكتملة والفاشلة
      this.deliveryQueue = this.deliveryQueue.filter(d => 
        d.status === 'pending' || 
        (d.status === 'sent' && (!d.deliveredAt || Date.now() - d.deliveredAt.getTime() < 24 * 60 * 60 * 1000))
      )
    }, this.retryDelay)
  }

  /**
   * إرسال الإشعار عبر القناة المحددة
   */
  private async deliverNotification(delivery: NotificationDelivery): Promise<void> {
    const notification = await this.getNotificationById(delivery.notificationId)
    if (!notification) throw new Error('الإشعار غير موجود')

    switch (delivery.channel) {
      case 'email':
        await this.sendEmail(delivery, notification)
        break
      case 'sms':
        await this.sendSMS(delivery, notification)
        break
      case 'push':
        await this.sendPushNotification(delivery, notification)
        break
      case 'in_app':
        await this.sendInAppNotification(delivery, notification)
        break
      default:
        throw new Error(`قناة غير مدعومة: ${delivery.channel}`)
    }
  }

  /**
   * إرسال بريد إلكتروني
   */
  private async sendEmail(delivery: NotificationDelivery, notification: SmartNotification): Promise<void> {
    // في التطبيق الحقيقي، ستستخدم خدمة بريد إلكتروني حقيقية
    console.log(`[EMAIL] إرسال بريد إلكتروني إلى ${delivery.recipientId}:`, {
      subject: notification.title,
      content: notification.content
    })
    
    // محاكاة تأخير الإرسال
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  /**
   * إرسال رسالة نصية
   */
  private async sendSMS(delivery: NotificationDelivery, notification: SmartNotification): Promise<void> {
    // في التطبيق الحقيقي، ستستخدم خدمة SMS حقيقية
    console.log(`[SMS] إرسال رسالة نصية إلى ${delivery.recipientId}:`, {
      message: `${notification.title}: ${notification.content.substring(0, 160)}`
    })
    
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  /**
   * إرسال إشعار push
   */
  private async sendPushNotification(delivery: NotificationDelivery, notification: SmartNotification): Promise<void> {
    // في التطبيق الحقيقي، ستستخدم خدمة push notifications
    console.log(`[PUSH] إرسال إشعار push إلى ${delivery.recipientId}:`, {
      title: notification.title,
      body: notification.content.substring(0, 100)
    })
    
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  /**
   * إرسال إشعار داخل التطبيق
   */
  private async sendInAppNotification(delivery: NotificationDelivery, notification: SmartNotification): Promise<void> {
    // تم حفظه مسبقاً في قاعدة البيانات
    console.log(`[IN-APP] إشعار داخل التطبيق للمستخدم ${delivery.recipientId}`)
  }

  /**
   * الحصول على الإشعار بالمعرف
   */
  private async getNotificationById(id: string): Promise<SmartNotification | null> {
    // في التطبيق الحقيقي، ستجلب من قاعدة البيانات
    return {
      id,
      title: 'إشعار تجريبي',
      content: 'محتوى الإشعار',
      type: 'info',
      priority: 'medium',
      category: 'system',
      recipientId: 'user123',
      channels: ['in_app'],
      createdAt: new Date(),
      isRead: false
    }
  }

  /**
   * إحصائيات الإشعارات
   */
  getNotificationStats(period: 'day' | 'week' | 'month' = 'day'): {
    total: number
    sent: number
    delivered: number
    failed: number
    byChannel: Record<string, number>
    byPriority: Record<string, number>
  } {
    const now = Date.now()
    const cutoff = period === 'day' ? 24 * 60 * 60 * 1000 :
                  period === 'week' ? 7 * 24 * 60 * 60 * 1000 :
                  30 * 24 * 60 * 60 * 1000

    const recentDeliveries = this.deliveryQueue.filter(d => 
      d.lastAttempt && (now - d.lastAttempt.getTime()) < cutoff
    )

    const byChannel: Record<string, number> = {}
    const byPriority: Record<string, number> = {}

    recentDeliveries.forEach(delivery => {
      byChannel[delivery.channel] = (byChannel[delivery.channel] || 0) + 1
    })

    return {
      total: recentDeliveries.length,
      sent: recentDeliveries.filter(d => d.status === 'sent').length,
      delivered: recentDeliveries.filter(d => d.status === 'delivered').length,
      failed: recentDeliveries.filter(d => d.status === 'failed').length,
      byChannel,
      byPriority
    }
  }

  /**
   * إضافة قالب جديد
   */
  addTemplate(template: NotificationTemplate): void {
    this.templates.set(template.id, template)
  }

  /**
   * إضافة قاعدة جديدة
   */
  addRule(rule: NotificationRule): void {
    this.rules.set(rule.id, rule)
  }

  /**
   * تحديث قالب
   */
  updateTemplate(id: string, updates: Partial<NotificationTemplate>): boolean {
    const template = this.templates.get(id)
    if (template) {
      this.templates.set(id, { ...template, ...updates })
      return true
    }
    return false
  }

  /**
   * تحديث قاعدة
   */
  updateRule(id: string, updates: Partial<NotificationRule>): boolean {
    const rule = this.rules.get(id)
    if (rule) {
      this.rules.set(id, { ...rule, ...updates })
      return true
    }
    return false
  }

  /**
   * الحصول على جميع القوالب
   */
  getTemplates(): NotificationTemplate[] {
    return Array.from(this.templates.values())
  }

  /**
   * الحصول على جميع القواعد
   */
  getRules(): NotificationRule[] {
    return Array.from(this.rules.values())
  }
}

// إنشاء مثيل واحد للخدمة
let advancedNotificationInstance: AdvancedNotificationService | null = null

export const getAdvancedNotificationService = (prisma: PrismaClient): AdvancedNotificationService => {
  if (!advancedNotificationInstance) {
    advancedNotificationInstance = new AdvancedNotificationService(prisma)
  }
  return advancedNotificationInstance
}

export default AdvancedNotificationService


