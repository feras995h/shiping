import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export interface SecurityEvent {
  id: string
  type: 'login_attempt' | 'login_success' | 'login_failure' | 'permission_denied' | 'suspicious_activity' | 'data_access' | 'admin_action'
  userId?: string
  ipAddress: string
  userAgent: string
  details: Record<string, any>
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
  location?: {
    country?: string
    city?: string
    coordinates?: [number, number]
  }
}

export interface SecurityAlert {
  id: string
  type: 'brute_force' | 'suspicious_location' | 'privilege_escalation' | 'data_breach' | 'malicious_request'
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  userId?: string
  ipAddress: string
  events: string[] // IDs of related events
  timestamp: Date
  resolved: boolean
  resolvedBy?: string
  resolvedAt?: Date
  actions: string[]
}

export interface SecurityRule {
  id: string
  name: string
  type: 'rate_limit' | 'geo_block' | 'pattern_detection' | 'behavior_analysis'
  enabled: boolean
  parameters: Record<string, any>
  actions: ('log' | 'alert' | 'block' | 'notify')[]
}

class SecurityMonitor {
  private prisma: PrismaClient
  private events: SecurityEvent[] = []
  private alerts: SecurityAlert[] = []
  private rules: SecurityRule[] = []
  private rateLimits: Map<string, { count: number; resetTime: number }> = new Map()
  private blockedIPs: Set<string> = new Set()
  private suspiciousIPs: Map<string, number> = new Map()

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.initializeDefaultRules()
    this.startSecurityMonitoring()
  }

  /**
   * تهيئة القواعد الأمنية الافتراضية
   */
  private initializeDefaultRules(): void {
    this.rules = [
      {
        id: 'brute_force_protection',
        name: 'حماية من الهجمات العنيفة',
        type: 'rate_limit',
        enabled: true,
        parameters: {
          maxAttempts: 5,
          windowMinutes: 15,
          blockDurationMinutes: 30
        },
        actions: ['log', 'alert', 'block']
      },
      {
        id: 'suspicious_location',
        name: 'كشف المواقع المشبوهة',
        type: 'geo_block',
        enabled: true,
        parameters: {
          allowedCountries: ['LY', 'CN', 'US', 'GB'], // ليبيا، الصين، أمريكا، بريطانيا
          alertOnNewLocation: true
        },
        actions: ['log', 'alert']
      },
      {
        id: 'admin_action_monitoring',
        name: 'مراقبة إجراءات المدراء',
        type: 'behavior_analysis',
        enabled: true,
        parameters: {
          sensitiveActions: ['user_delete', 'role_change', 'system_settings', 'data_export'],
          requireApproval: true
        },
        actions: ['log', 'alert', 'notify']
      },
      {
        id: 'sql_injection_detection',
        name: 'كشف محاولات حقن SQL',
        type: 'pattern_detection',
        enabled: true,
        parameters: {
          patterns: ['SELECT.*FROM', 'UNION.*SELECT', 'DROP.*TABLE', 'INSERT.*INTO', '--', ';--'],
          caseSensitive: false
        },
        actions: ['log', 'alert', 'block']
      },
      {
        id: 'xss_detection',
        name: 'كشف محاولات XSS',
        type: 'pattern_detection',
        enabled: true,
        parameters: {
          patterns: ['<script', 'javascript:', 'onload=', 'onerror=', 'onclick='],
          caseSensitive: false
        },
        actions: ['log', 'alert', 'block']
      }
    ]
  }

  /**
   * تسجيل حدث أمني
   */
  logSecurityEvent(
    type: SecurityEvent['type'],
    userId: string | undefined,
    ipAddress: string,
    userAgent: string,
    details: Record<string, any>,
    severity: SecurityEvent['severity'] = 'low'
  ): string {
    const event: SecurityEvent = {
      id: `sec_event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      userId,
      ipAddress,
      userAgent,
      details,
      severity,
      timestamp: new Date(),
      location: this.getLocationFromIP(ipAddress)
    }

    this.events.push(event)

    // الاحتفاظ بآخر 10000 حدث فقط
    if (this.events.length > 10000) {
      this.events = this.events.slice(-10000)
    }

    // تحليل الحدث للكشف عن التهديدات
    this.analyzeSecurityEvent(event)

    // حفظ في قاعدة البيانات
    this.saveSecurityEventToDB(event)

    return event.id
  }

  /**
   * تحليل الأحداث الأمنية للكشف عن التهديدات
   */
  private analyzeSecurityEvent(event: SecurityEvent): void {
    // فحص الهجمات العنيفة
    this.checkBruteForceAttack(event)

    // فحص المواقع المشبوهة
    this.checkSuspiciousLocation(event)

    // فحص الأنماط الخبيثة
    this.checkMaliciousPatterns(event)

    // فحص السلوك المشبوه
    this.checkSuspiciousBehavior(event)
  }

  /**
   * فحص الهجمات العنيفة
   */
  private checkBruteForceAttack(event: SecurityEvent): void {
    if (event.type !== 'login_failure') return

    const rule = this.rules.find(r => r.id === 'brute_force_protection' && r.enabled)
    if (!rule) return

    const key = `${event.ipAddress}_${event.userId || 'anonymous'}`
    const now = Date.now()
    const windowMs = rule.parameters.windowMinutes * 60 * 1000

    if (!this.rateLimits.has(key)) {
      this.rateLimits.set(key, { count: 1, resetTime: now + windowMs })
      return
    }

    const rateLimit = this.rateLimits.get(key)!
    
    if (now > rateLimit.resetTime) {
      // إعادة تعيين النافذة الزمنية
      rateLimit.count = 1
      rateLimit.resetTime = now + windowMs
    } else {
      rateLimit.count++
    }

    if (rateLimit.count >= rule.parameters.maxAttempts) {
      // إنشاء تنبيه أمني
      this.createSecurityAlert({
        type: 'brute_force',
        description: `محاولة هجوم عنيف من ${event.ipAddress} - ${rateLimit.count} محاولات فاشلة`,
        severity: 'high',
        userId: event.userId,
        ipAddress: event.ipAddress,
        events: [event.id],
        actions: rule.actions
      })

      // حظر IP إذا كان مطلوباً
      if (rule.actions.includes('block')) {
        this.blockIP(event.ipAddress, rule.parameters.blockDurationMinutes * 60 * 1000)
      }
    }
  }

  /**
   * فحص المواقع المشبوهة
   */
  private checkSuspiciousLocation(event: SecurityEvent): void {
    if (event.type !== 'login_success' || !event.location) return

    const rule = this.rules.find(r => r.id === 'suspicious_location' && r.enabled)
    if (!rule) return

    // فحص البلدان المسموحة
    if (event.location.country && !rule.parameters.allowedCountries.includes(event.location.country)) {
      this.createSecurityAlert({
        type: 'suspicious_location',
        description: `تسجيل دخول من موقع غير مألوف: ${event.location.country}`,
        severity: 'medium',
        userId: event.userId,
        ipAddress: event.ipAddress,
        events: [event.id],
        actions: rule.actions
      })
    }
  }

  /**
   * فحص الأنماط الخبيثة
   */
  private checkMaliciousPatterns(event: SecurityEvent): void {
    const patterns = [
      ...this.rules.find(r => r.id === 'sql_injection_detection')?.parameters.patterns || [],
      ...this.rules.find(r => r.id === 'xss_detection')?.parameters.patterns || []
    ]

    const content = JSON.stringify(event.details).toLowerCase()
    
    for (const pattern of patterns) {
      if (content.includes(pattern.toLowerCase())) {
        this.createSecurityAlert({
          type: 'malicious_request',
          description: `كشف نمط خبيث في الطلب: ${pattern}`,
          severity: 'high',
          userId: event.userId,
          ipAddress: event.ipAddress,
          events: [event.id],
          actions: ['log', 'alert', 'block']
        })

        // حظر IP فوراً
        this.blockIP(event.ipAddress, 60 * 60 * 1000) // ساعة واحدة
        break
      }
    }
  }

  /**
   * فحص السلوك المشبوه
   */
  private checkSuspiciousBehavior(event: SecurityEvent): void {
    // فحص التصاعد في الصلاحيات
    if (event.type === 'admin_action' && event.details.action === 'role_change') {
      this.createSecurityAlert({
        type: 'privilege_escalation',
        description: `محاولة تغيير صلاحيات المستخدم`,
        severity: 'high',
        userId: event.userId,
        ipAddress: event.ipAddress,
        events: [event.id],
        actions: ['log', 'alert', 'notify']
      })
    }

    // فحص الوصول المتكرر للبيانات الحساسة
    if (event.type === 'data_access' && event.details.sensitive) {
      const recentAccess = this.events.filter(e => 
        e.type === 'data_access' &&
        e.userId === event.userId &&
        e.timestamp.getTime() > Date.now() - 60 * 60 * 1000 // آخر ساعة
      ).length

      if (recentAccess > 10) {
        this.createSecurityAlert({
          type: 'data_breach',
          description: `وصول مفرط للبيانات الحساسة - ${recentAccess} محاولة في الساعة الماضية`,
          severity: 'critical',
          userId: event.userId,
          ipAddress: event.ipAddress,
          events: [event.id],
          actions: ['log', 'alert', 'notify']
        })
      }
    }
  }

  /**
   * إنشاء تنبيه أمني
   */
  private createSecurityAlert(alertData: Omit<SecurityAlert, 'id' | 'timestamp' | 'resolved'>): void {
    const alert: SecurityAlert = {
      id: `sec_alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      resolved: false,
      ...alertData
    }

    this.alerts.push(alert)

    // الاحتفاظ بآخر 1000 تنبيه فقط
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000)
    }

    // تنفيذ الإجراءات المطلوبة
    this.executeSecurityActions(alert)
  }

  /**
   * تنفيذ الإجراءات الأمنية
   */
  private executeSecurityActions(alert: SecurityAlert): void {
    if (alert.actions.includes('log')) {
      console.log(`[SECURITY ALERT] ${alert.description}`, {
        id: alert.id,
        type: alert.type,
        severity: alert.severity,
        ipAddress: alert.ipAddress,
        userId: alert.userId
      })
    }

    if (alert.actions.includes('notify')) {
      // إرسال إشعار للمدراء
      this.notifyAdministrators(alert)
    }
  }

  /**
   * إشعار المدراء
   */
  private async notifyAdministrators(alert: SecurityAlert): Promise<void> {
    try {
      // إنشاء تنبيه في النظام
      await this.prisma.alert.create({
        data: {
          title: `تنبيه أمني: ${alert.type}`,
          message: alert.description,
          type: 'ERROR',
          isRead: false
        }
      })
    } catch (error) {
      console.error('خطأ في إرسال التنبيه للمدراء:', error)
    }
  }

  /**
   * حظر عنوان IP
   */
  blockIP(ipAddress: string, durationMs: number): void {
    this.blockedIPs.add(ipAddress)
    
    // إلغاء الحظر بعد المدة المحددة
    setTimeout(() => {
      this.blockedIPs.delete(ipAddress)
    }, durationMs)
  }

  /**
   * فحص ما إذا كان IP محظور
   */
  isIPBlocked(ipAddress: string): boolean {
    return this.blockedIPs.has(ipAddress)
  }

  /**
   * التحقق من صحة كلمة المرور
   */
  validatePasswordStrength(password: string): {
    isValid: boolean
    score: number
    issues: string[]
    suggestions: string[]
  } {
    const issues: string[] = []
    const suggestions: string[] = []
    let score = 0

    // طول كلمة المرور
    if (password.length < 8) {
      issues.push('كلمة المرور قصيرة جداً')
      suggestions.push('استخدم على الأقل 8 أحرف')
    } else if (password.length >= 12) {
      score += 2
    } else {
      score += 1
    }

    // الأحرف الكبيرة
    if (!/[A-Z]/.test(password)) {
      issues.push('لا تحتوي على أحرف كبيرة')
      suggestions.push('أضف أحرف كبيرة (A-Z)')
    } else {
      score += 1
    }

    // الأحرف الصغيرة
    if (!/[a-z]/.test(password)) {
      issues.push('لا تحتوي على أحرف صغيرة')
      suggestions.push('أضف أحرف صغيرة (a-z)')
    } else {
      score += 1
    }

    // الأرقام
    if (!/[0-9]/.test(password)) {
      issues.push('لا تحتوي على أرقام')
      suggestions.push('أضف أرقام (0-9)')
    } else {
      score += 1
    }

    // الرموز الخاصة
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      issues.push('لا تحتوي على رموز خاصة')
      suggestions.push('أضف رموز خاصة (!@#$%^&*)')
    } else {
      score += 1
    }

    // كلمات مرور شائعة
    const commonPasswords = ['password', '123456', 'admin', 'user', 'qwerty']
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      issues.push('تحتوي على كلمات شائعة')
      suggestions.push('تجنب الكلمات الشائعة')
      score -= 2
    }

    return {
      isValid: issues.length === 0 && score >= 4,
      score: Math.max(0, Math.min(5, score)),
      issues,
      suggestions
    }
  }

  /**
   * إنشاء token JWT آمن
   */
  generateSecureToken(payload: any, expiresIn: string = '1h'): string {
    return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn,
      issuer: 'golden-horse-shipping',
      audience: 'golden-horse-users'
    })
  }

  /**
   * التحقق من صحة token
   */
  verifyToken(token: string): { valid: boolean; payload?: any; error?: string } {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', {
        issuer: 'golden-horse-shipping',
        audience: 'golden-horse-users'
      })
      return { valid: true, payload }
    } catch (error) {
      return { valid: false, error: (error as Error).message }
    }
  }

  /**
   * تشفير البيانات الحساسة
   */
  async encryptSensitiveData(data: string): Promise<string> {
    const saltRounds = 12
    return await bcrypt.hash(data, saltRounds)
  }

  /**
   * مقارنة البيانات المشفرة
   */
  async compareSensitiveData(data: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(data, hash)
  }

  /**
   * الحصول على الموقع الجغرافي من IP (محاكاة)
   */
  private getLocationFromIP(ipAddress: string): { country?: string; city?: string } | undefined {
    // في التطبيق الحقيقي، ستستخدم خدمة GeoIP
    const mockLocations: Record<string, any> = {
      '127.0.0.1': { country: 'LY', city: 'Tripoli' },
      '192.168.1.1': { country: 'LY', city: 'Benghazi' }
    }
    
    return mockLocations[ipAddress] || { country: 'Unknown', city: 'Unknown' }
  }

  /**
   * حفظ الحدث الأمني في قاعدة البيانات
   */
  private async saveSecurityEventToDB(event: SecurityEvent): Promise<void> {
    try {
      await this.prisma.securityLog.create({
        data: {
          userId: event.userId,
          action: event.type,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          details: JSON.stringify({
            ...event.details,
            severity: event.severity,
            location: event.location
          })
        }
      })
    } catch (error) {
      console.error('خطأ في حفظ الحدث الأمني:', error)
    }
  }

  /**
   * بدء مراقبة الأمان
   */
  private startSecurityMonitoring(): void {
    // تنظيف البيانات القديمة كل ساعة
    setInterval(() => {
      this.cleanupOldData()
    }, 60 * 60 * 1000)

    // تحديث قائمة IPs المشبوهة كل 10 دقائق
    setInterval(() => {
      this.updateSuspiciousIPs()
    }, 10 * 60 * 1000)
  }

  /**
   * تنظيف البيانات القديمة
   */
  private cleanupOldData(): void {
    const cutoffTime = Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 أيام

    // تنظيف الأحداث القديمة
    this.events = this.events.filter(event => event.timestamp.getTime() > cutoffTime)

    // تنظيف التنبيهات المحلولة القديمة
    this.alerts = this.alerts.filter(alert => 
      !alert.resolved || alert.timestamp.getTime() > cutoffTime
    )

    // تنظيف rate limits المنتهية الصلاحية
    const now = Date.now()
    for (const [key, limit] of this.rateLimits.entries()) {
      if (now > limit.resetTime) {
        this.rateLimits.delete(key)
      }
    }
  }

  /**
   * تحديث قائمة IPs المشبوهة
   */
  private updateSuspiciousIPs(): void {
    // تحليل الأحداث الأخيرة لكشف IPs المشبوهة
    const recentEvents = this.events.filter(event => 
      event.timestamp.getTime() > Date.now() - 60 * 60 * 1000 // آخر ساعة
    )

    const ipCounts: Map<string, number> = new Map()
    
    for (const event of recentEvents) {
      if (event.severity === 'high' || event.severity === 'critical') {
        const count = ipCounts.get(event.ipAddress) || 0
        ipCounts.set(event.ipAddress, count + 1)
      }
    }

    // تحديث قائمة IPs المشبوهة
    for (const [ip, count] of ipCounts.entries()) {
      if (count >= 3) {
        this.suspiciousIPs.set(ip, count)
      }
    }
  }

  /**
   * الحصول على التنبيهات النشطة
   */
  getActiveAlerts(): SecurityAlert[] {
    return this.alerts.filter(alert => !alert.resolved)
  }

  /**
   * حل تنبيه أمني
   */
  resolveAlert(alertId: string, resolvedBy: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert && !alert.resolved) {
      alert.resolved = true
      alert.resolvedBy = resolvedBy
      alert.resolvedAt = new Date()
      return true
    }
    return false
  }

  /**
   * الحصول على إحصائيات الأمان
   */
  getSecurityStats(period: 'hour' | 'day' | 'week' = 'day'): {
    totalEvents: number
    activeAlerts: number
    blockedIPs: number
    suspiciousIPs: number
    eventsByType: Record<string, number>
    alertsBySeverity: Record<string, number>
    topThreats: Array<{ ip: string; events: number }>
  } {
    const now = Date.now()
    const cutoff = period === 'hour' ? 60 * 60 * 1000 :
                  period === 'day' ? 24 * 60 * 60 * 1000 :
                  7 * 24 * 60 * 60 * 1000

    const recentEvents = this.events.filter(event => 
      event.timestamp.getTime() > now - cutoff
    )

    const recentAlerts = this.alerts.filter(alert => 
      alert.timestamp.getTime() > now - cutoff
    )

    // تجميع الأحداث حسب النوع
    const eventsByType: Record<string, number> = {}
    for (const event of recentEvents) {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1
    }

    // تجميع التنبيهات حسب الخطورة
    const alertsBySeverity: Record<string, number> = {}
    for (const alert of recentAlerts) {
      alertsBySeverity[alert.severity] = (alertsBySeverity[alert.severity] || 0) + 1
    }

    // أكثر التهديدات
    const ipCounts: Map<string, number> = new Map()
    for (const event of recentEvents) {
      if (event.severity === 'high' || event.severity === 'critical') {
        const count = ipCounts.get(event.ipAddress) || 0
        ipCounts.set(event.ipAddress, count + 1)
      }
    }

    const topThreats = Array.from(ipCounts.entries())
      .map(([ip, events]) => ({ ip, events }))
      .sort((a, b) => b.events - a.events)
      .slice(0, 10)

    return {
      totalEvents: recentEvents.length,
      activeAlerts: this.getActiveAlerts().length,
      blockedIPs: this.blockedIPs.size,
      suspiciousIPs: this.suspiciousIPs.size,
      eventsByType,
      alertsBySeverity,
      topThreats
    }
  }
}

// إنشاء مثيل واحد للخدمة
let securityMonitorInstance: SecurityMonitor | null = null

export const getSecurityMonitor = (prisma: PrismaClient): SecurityMonitor => {
  if (!securityMonitorInstance) {
    securityMonitorInstance = new SecurityMonitor(prisma)
  }
  return securityMonitorInstance
}

export default SecurityMonitor



