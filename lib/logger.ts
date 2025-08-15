export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

export interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  context?: Record<string, any>
  error?: Error
  userId?: string
  sessionId?: string
  requestId?: string
}

export interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableFile: boolean
  enableDatabase: boolean
  maxFileSize: number // بالبايت
  maxFiles: number
  logDirectory: string
}

class Logger {
  private config: LoggerConfig
  private logBuffer: LogEntry[] = []
  private bufferSize = 100
  private flushInterval: NodeJS.Timeout | null = null

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: false,
      enableDatabase: false,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      logDirectory: './logs',
      ...config
    }

    this.startFlushTimer()
  }

  private startFlushTimer() {
    if (this.config.enableFile || this.config.enableDatabase) {
      this.flushInterval = setInterval(() => {
        this.flush()
      }, 5000) // كل 5 ثواني
    }
  }

  private async flush() {
    if (this.logBuffer.length === 0) return

    const logsToFlush = [...this.logBuffer]
    this.logBuffer = []

    try {
      if (this.config.enableFile) {
        await this.writeToFile(logsToFlush)
      }

      if (this.config.enableDatabase) {
        await this.writeToDatabase(logsToFlush)
      }
    } catch (error) {
      console.error('خطأ في حفظ السجلات:', error)
    }
  }

  private async writeToFile(logs: LogEntry[]) {
    // في التطبيق الحقيقي، ستستخدم fs.writeFile أو مكتبة logging متقدمة
    const logContent = logs.map(log => this.formatLogEntry(log)).join('\n')
    
    // محاكاة الكتابة للملف
    console.log(`[FILE LOG] ${logContent}`)
  }

  private async writeToDatabase(logs: LogEntry[]) {
    // في التطبيق الحقيقي، ستستخدم Prisma لحفظ السجلات
    try {
      // محاكاة الحفظ في قاعدة البيانات
      console.log(`[DB LOG] حفظ ${logs.length} سجل في قاعدة البيانات`)
    } catch (error) {
      console.error('خطأ في حفظ السجلات في قاعدة البيانات:', error)
    }
  }

  private formatLogEntry(log: LogEntry): string {
    const timestamp = log.timestamp.toISOString()
    const level = LogLevel[log.level]
    const context = log.context ? ` | ${JSON.stringify(log.context)}` : ''
    const error = log.error ? ` | Error: ${log.error.message}` : ''
    const user = log.userId ? ` | User: ${log.userId}` : ''
    const session = log.sessionId ? ` | Session: ${log.sessionId}` : ''
    const request = log.requestId ? ` | Request: ${log.requestId}` : ''

    return `[${timestamp}] [${level}] ${log.message}${context}${error}${user}${session}${request}`
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    if (!this.shouldLog(level)) return

    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      error,
      userId: this.getCurrentUserId(),
      sessionId: this.getCurrentSessionId(),
      requestId: this.getCurrentRequestId()
    }

    // إضافة إلى المخزن المؤقت
    this.logBuffer.push(logEntry)

    // عرض في وحدة التحكم إذا كان مفعلاً
    if (this.config.enableConsole) {
      const formattedMessage = this.formatLogEntry(logEntry)
      this.writeToConsole(level, formattedMessage)
    }

    // تنظيف المخزن المؤقت إذا تجاوز الحجم
    if (this.logBuffer.length >= this.bufferSize) {
      this.flush()
    }
  }

  private writeToConsole(level: LogLevel, message: string) {
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(message)
        break
      case LogLevel.INFO:
        console.info(message)
        break
      case LogLevel.WARN:
        console.warn(message)
        break
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(message)
        break
    }
  }

  private getCurrentUserId(): string | undefined {
    // في التطبيق الحقيقي، ستجلب من context المستخدم الحالي
    return undefined
  }

  private getCurrentSessionId(): string | undefined {
    // في التطبيق الحقيقي، ستجلب من context الجلسة الحالية
    return undefined
  }

  private getCurrentRequestId(): string | undefined {
    // في التطبيق الحقيقي، ستجلب من context الطلب الحالي
    return undefined
  }

  // طرق Logging العامة
  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, context?: Record<string, any>, error?: Error) {
    this.log(LogLevel.ERROR, message, context, error)
  }

  critical(message: string, context?: Record<string, any>, error?: Error) {
    this.log(LogLevel.CRITICAL, message, context, error)
  }

  // تسجيل العمليات المالية
  logFinancialOperation(operation: string, amount: number, currency: string, userId?: string, context?: Record<string, any>) {
    this.info(`عملية مالية: ${operation}`, {
      amount,
      currency,
      userId,
      ...context
    })
  }

  // تسجيل عمليات المستخدم
  logUserAction(action: string, userId: string, context?: Record<string, any>) {
    this.info(`إجراء مستخدم: ${action}`, {
      userId,
      ...context
    })
  }

  // تسجيل عمليات النظام
  logSystemEvent(event: string, context?: Record<string, any>) {
    this.info(`حدث نظام: ${event}`, context)
  }

  // تسجيل الأخطاء الأمنية
  logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: Record<string, any>) {
    const level = severity === 'critical' ? LogLevel.CRITICAL : 
                 severity === 'high' ? LogLevel.ERROR :
                 severity === 'medium' ? LogLevel.WARN : LogLevel.INFO

    this.log(level, `حدث أمني: ${event}`, {
      severity,
      ...context
    })
  }

  // تسجيل أداء النظام
  logPerformance(operation: string, duration: number, context?: Record<string, any>) {
    const level = duration > 1000 ? LogLevel.WARN : LogLevel.DEBUG
    this.log(level, `أداء النظام: ${operation}`, {
      duration,
      unit: 'ms',
      ...context
    })
  }

  // تنظيف الموارد
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flush()
  }
}

// إنشاء instance افتراضي
export const logger = new Logger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableFile: process.env.NODE_ENV === 'production',
  enableDatabase: process.env.NODE_ENV === 'production'
})

// تصدير الأنواع
export type { Logger }
export { Logger as LoggerClass }
