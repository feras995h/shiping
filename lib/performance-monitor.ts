import { PrismaClient } from '@prisma/client'

export interface PerformanceMetric {
  id: string
  name: string
  value: number
  unit: string
  timestamp: Date
  category: 'api' | 'database' | 'ui' | 'system'
  metadata?: Record<string, any>
}

export interface PerformanceAlert {
  id: string
  metric: string
  threshold: number
  currentValue: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: Date
  resolved: boolean
}

class PerformanceMonitor {
  private prisma: PrismaClient
  private metrics: Map<string, PerformanceMetric[]> = new Map()
  private alerts: PerformanceAlert[] = []
  private thresholds = {
    apiResponseTime: 1000, // 1 ثانية
    databaseQueryTime: 500, // 0.5 ثانية
    pageLoadTime: 3000, // 3 ثواني
    memoryUsage: 80, // 80%
    cpuUsage: 70 // 70%
  }

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  /**
   * تسجيل مقياس أداء جديد
   */
  recordMetric(
    name: string,
    value: number,
    unit: string,
    category: 'api' | 'database' | 'ui' | 'system',
    metadata?: Record<string, any>
  ): void {
    const metric: PerformanceMetric = {
      id: `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      value,
      unit,
      timestamp: new Date(),
      category,
      metadata
    }

    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }

    const metricArray = this.metrics.get(name)!
    metricArray.push(metric)

    // الاحتفاظ بآخر 1000 قياس لكل مقياس
    if (metricArray.length > 1000) {
      this.metrics.set(name, metricArray.slice(-1000))
    }

    // فحص التنبيهات
    this.checkPerformanceAlerts(metric)
  }

  /**
   * قياس وقت تنفيذ دالة
   */
  async measureAsync<T>(
    name: string,
    category: 'api' | 'database' | 'ui' | 'system',
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = Date.now()
    
    try {
      const result = await fn()
      const duration = Date.now() - startTime
      
      this.recordMetric(name, duration, 'ms', category, {
        ...metadata,
        success: true
      })
      
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      
      this.recordMetric(name, duration, 'ms', category, {
        ...metadata,
        success: false,
        error: (error as Error).message
      })
      
      throw error
    }
  }

  /**
   * قياس وقت تنفيذ دالة متزامنة
   */
  measureSync<T>(
    name: string,
    category: 'api' | 'database' | 'ui' | 'system',
    fn: () => T,
    metadata?: Record<string, any>
  ): T {
    const startTime = Date.now()
    
    try {
      const result = fn()
      const duration = Date.now() - startTime
      
      this.recordMetric(name, duration, 'ms', category, {
        ...metadata,
        success: true
      })
      
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      
      this.recordMetric(name, duration, 'ms', category, {
        ...metadata,
        success: false,
        error: (error as Error).message
      })
      
      throw error
    }
  }

  /**
   * فحص تنبيهات الأداء
   */
  private checkPerformanceAlerts(metric: PerformanceMetric): void {
    let threshold: number | null = null
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'

    // تحديد العتبة المناسبة
    if (metric.name.includes('api') && metric.unit === 'ms') {
      threshold = this.thresholds.apiResponseTime
    } else if (metric.name.includes('database') && metric.unit === 'ms') {
      threshold = this.thresholds.databaseQueryTime
    } else if (metric.name.includes('page') && metric.unit === 'ms') {
      threshold = this.thresholds.pageLoadTime
    } else if (metric.name.includes('memory') && metric.unit === '%') {
      threshold = this.thresholds.memoryUsage
    } else if (metric.name.includes('cpu') && metric.unit === '%') {
      threshold = this.thresholds.cpuUsage
    }

    if (threshold && metric.value > threshold) {
      // تحديد مستوى الخطورة
      if (metric.value > threshold * 2) {
        severity = 'critical'
      } else if (metric.value > threshold * 1.5) {
        severity = 'high'
      } else if (metric.value > threshold * 1.2) {
        severity = 'medium'
      } else {
        severity = 'low'
      }

      const alert: PerformanceAlert = {
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metric: metric.name,
        threshold,
        currentValue: metric.value,
        severity,
        message: `${metric.name} تجاوز العتبة المحددة: ${metric.value}${metric.unit} > ${threshold}${metric.unit}`,
        timestamp: new Date(),
        resolved: false
      }

      this.alerts.push(alert)

      // الاحتفاظ بآخر 100 تنبيه فقط
      if (this.alerts.length > 100) {
        this.alerts = this.alerts.slice(-100)
      }
    }
  }

  /**
   * الحصول على إحصائيات مقياس معين
   */
  getMetricStats(name: string, period: 'hour' | 'day' | 'week' = 'hour'): {
    count: number
    average: number
    min: number
    max: number
    median: number
    p95: number
    p99: number
  } | null {
    const metrics = this.metrics.get(name)
    if (!metrics || metrics.length === 0) {
      return null
    }

    // تصفية المقاييس حسب الفترة الزمنية
    const now = new Date()
    let cutoffTime: Date

    switch (period) {
      case 'hour':
        cutoffTime = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case 'day':
        cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case 'week':
        cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
    }

    const filteredMetrics = metrics.filter(m => m.timestamp >= cutoffTime)
    if (filteredMetrics.length === 0) {
      return null
    }

    const values = filteredMetrics.map(m => m.value).sort((a, b) => a - b)
    const count = values.length
    const sum = values.reduce((a, b) => a + b, 0)
    const average = sum / count
    const min = values[0]
    const max = values[count - 1]
    const median = values[Math.floor(count / 2)]
    const p95 = values[Math.floor(count * 0.95)]
    const p99 = values[Math.floor(count * 0.99)]

    return {
      count,
      average,
      min,
      max,
      median,
      p95,
      p99
    }
  }

  /**
   * الحصول على أبطأ العمليات
   */
  getSlowestOperations(category?: 'api' | 'database' | 'ui' | 'system', limit = 10): PerformanceMetric[] {
    let allMetrics: PerformanceMetric[] = []
    
    for (const metricArray of this.metrics.values()) {
      allMetrics = allMetrics.concat(metricArray)
    }

    if (category) {
      allMetrics = allMetrics.filter(m => m.category === category)
    }

    return allMetrics
      .sort((a, b) => b.value - a.value)
      .slice(0, limit)
  }

  /**
   * الحصول على التنبيهات النشطة
   */
  getActiveAlerts(): PerformanceAlert[] {
    return this.alerts.filter(alert => !alert.resolved)
  }

  /**
   * حل تنبيه
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.resolved = true
      return true
    }
    return false
  }

  /**
   * تحديث العتبات
   */
  updateThresholds(newThresholds: Partial<typeof this.thresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds }
  }

  /**
   * تنظيف البيانات القديمة
   */
  cleanup(olderThanDays = 7): void {
    const cutoffTime = new Date()
    cutoffTime.setDate(cutoffTime.getDate() - olderThanDays)

    // تنظيف المقاييس
    for (const [name, metrics] of this.metrics.entries()) {
      const filteredMetrics = metrics.filter(m => m.timestamp > cutoffTime)
      this.metrics.set(name, filteredMetrics)
    }

    // تنظيف التنبيهات
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoffTime)
  }

  /**
   * تصدير تقرير الأداء
   */
  generatePerformanceReport(period: 'hour' | 'day' | 'week' = 'day'): {
    summary: {
      totalMetrics: number
      activeAlerts: number
      averageResponseTime: number
      slowestOperations: PerformanceMetric[]
    }
    categories: {
      api: any
      database: any
      ui: any
      system: any
    }
    alerts: PerformanceAlert[]
  } {
    const activeAlerts = this.getActiveAlerts()
    const slowestOperations = this.getSlowestOperations(undefined, 5)
    
    // حساب متوسط وقت الاستجابة العام
    let totalResponseTime = 0
    let responseTimeCount = 0
    
    for (const [name, metrics] of this.metrics.entries()) {
      if (name.includes('response') || name.includes('time')) {
        const recentMetrics = metrics.filter(m => {
          const now = new Date()
          const cutoff = period === 'hour' ? 60 * 60 * 1000 :
                        period === 'day' ? 24 * 60 * 60 * 1000 :
                        7 * 24 * 60 * 60 * 1000
          return m.timestamp.getTime() > now.getTime() - cutoff
        })
        
        recentMetrics.forEach(m => {
          totalResponseTime += m.value
          responseTimeCount++
        })
      }
    }
    
    const averageResponseTime = responseTimeCount > 0 ? totalResponseTime / responseTimeCount : 0

    return {
      summary: {
        totalMetrics: Array.from(this.metrics.values()).reduce((sum, arr) => sum + arr.length, 0),
        activeAlerts: activeAlerts.length,
        averageResponseTime,
        slowestOperations
      },
      categories: {
        api: this.getCategoryStats('api', period),
        database: this.getCategoryStats('database', period),
        ui: this.getCategoryStats('ui', period),
        system: this.getCategoryStats('system', period)
      },
      alerts: activeAlerts
    }
  }

  private getCategoryStats(category: 'api' | 'database' | 'ui' | 'system', period: 'hour' | 'day' | 'week') {
    const categoryMetrics: PerformanceMetric[] = []
    
    for (const metricArray of this.metrics.values()) {
      categoryMetrics.push(...metricArray.filter(m => m.category === category))
    }

    const now = new Date()
    const cutoff = period === 'hour' ? 60 * 60 * 1000 :
                  period === 'day' ? 24 * 60 * 60 * 1000 :
                  7 * 24 * 60 * 60 * 1000

    const recentMetrics = categoryMetrics.filter(m => 
      m.timestamp.getTime() > now.getTime() - cutoff
    )

    if (recentMetrics.length === 0) {
      return {
        count: 0,
        averageValue: 0,
        slowestOperations: []
      }
    }

    const totalValue = recentMetrics.reduce((sum, m) => sum + m.value, 0)
    const averageValue = totalValue / recentMetrics.length
    const slowestOperations = recentMetrics
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)

    return {
      count: recentMetrics.length,
      averageValue,
      slowestOperations
    }
  }
}

// إنشاء مثيل واحد للخدمة
let performanceMonitorInstance: PerformanceMonitor | null = null

export const getPerformanceMonitor = (prisma: PrismaClient): PerformanceMonitor => {
  if (!performanceMonitorInstance) {
    performanceMonitorInstance = new PerformanceMonitor(prisma)
  }
  return performanceMonitorInstance
}

export default PerformanceMonitor


