import { PrismaClient } from '@prisma/client'

export interface SystemMetrics {
  timestamp: Date
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  activeConnections: number
  responseTime: number
  errorRate: number
  throughput: number
}

export interface HealthCheck {
  service: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime: number
  lastCheck: Date
  message?: string
}

class MonitoringService {
  private prisma: PrismaClient
  private metrics: SystemMetrics[] = []
  private healthChecks: Map<string, HealthCheck> = new Map()
  private alertThresholds = {
    cpuUsage: 80,
    memoryUsage: 85,
    diskUsage: 90,
    responseTime: 2000,
    errorRate: 5
  }

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.startMonitoring()
  }

  /**
   * جمع مقاييس النظام
   */
  async collectMetrics(): Promise<SystemMetrics> {
    const startTime = Date.now()
    
    try {
      // فحص الاتصال بقاعدة البيانات
      await this.prisma.$queryRaw`SELECT 1`
      const dbResponseTime = Date.now() - startTime

      // حساب المقاييس (محاكاة - في الواقع ستأتي من مصادر حقيقية)
      const metrics: SystemMetrics = {
        timestamp: new Date(),
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        diskUsage: Math.random() * 100,
        activeConnections: Math.floor(Math.random() * 100),
        responseTime: dbResponseTime,
        errorRate: Math.random() * 10,
        throughput: Math.floor(Math.random() * 1000)
      }

      // حفظ المقاييس
      this.metrics.push(metrics)
      
      // الاحتفاظ بآخر 1000 قراءة فقط
      if (this.metrics.length > 1000) {
        this.metrics = this.metrics.slice(-1000)
      }

      return metrics
    } catch (error) {
      console.error('خطأ في جمع المقاييس:', error)
      throw error
    }
  }

  /**
   * فحص صحة الخدمات
   */
  async performHealthChecks(): Promise<HealthCheck[]> {
    const checks: HealthCheck[] = []

    // فحص قاعدة البيانات
    const dbCheck = await this.checkDatabaseHealth()
    checks.push(dbCheck)
    this.healthChecks.set('database', dbCheck)

    // فحص نظام الملفات
    const fsCheck = await this.checkFileSystemHealth()
    checks.push(fsCheck)
    this.healthChecks.set('filesystem', fsCheck)

    // فحص الذاكرة
    const memoryCheck = await this.checkMemoryHealth()
    checks.push(memoryCheck)
    this.healthChecks.set('memory', memoryCheck)

    // فحص الشبكة
    const networkCheck = await this.checkNetworkHealth()
    checks.push(networkCheck)
    this.healthChecks.set('network', networkCheck)

    return checks
  }

  private async checkDatabaseHealth(): Promise<HealthCheck> {
    const startTime = Date.now()
    
    try {
      await this.prisma.$queryRaw`SELECT 1`
      const responseTime = Date.now() - startTime
      
      return {
        service: 'database',
        status: responseTime < 1000 ? 'healthy' : responseTime < 3000 ? 'degraded' : 'unhealthy',
        responseTime,
        lastCheck: new Date(),
        message: responseTime < 1000 ? 'قاعدة البيانات تعمل بشكل طبيعي' : 'استجابة بطيئة من قاعدة البيانات'
      }
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        message: 'فشل في الاتصال بقاعدة البيانات: ' + (error as Error).message
      }
    }
  }

  private async checkFileSystemHealth(): Promise<HealthCheck> {
    const startTime = Date.now()
    
    try {
      // محاكاة فحص نظام الملفات
      const diskUsage = Math.random() * 100
      const responseTime = Date.now() - startTime
      
      return {
        service: 'filesystem',
        status: diskUsage < 80 ? 'healthy' : diskUsage < 95 ? 'degraded' : 'unhealthy',
        responseTime,
        lastCheck: new Date(),
        message: `استخدام القرص الصلب: ${diskUsage.toFixed(1)}%`
      }
    } catch (error) {
      return {
        service: 'filesystem',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        message: 'خطأ في فحص نظام الملفات'
      }
    }
  }

  private async checkMemoryHealth(): Promise<HealthCheck> {
    const startTime = Date.now()
    
    try {
      // محاكاة فحص الذاكرة
      const memoryUsage = Math.random() * 100
      const responseTime = Date.now() - startTime
      
      return {
        service: 'memory',
        status: memoryUsage < 80 ? 'healthy' : memoryUsage < 90 ? 'degraded' : 'unhealthy',
        responseTime,
        lastCheck: new Date(),
        message: `استخدام الذاكرة: ${memoryUsage.toFixed(1)}%`
      }
    } catch (error) {
      return {
        service: 'memory',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        message: 'خطأ في فحص الذاكرة'
      }
    }
  }

  private async checkNetworkHealth(): Promise<HealthCheck> {
    const startTime = Date.now()
    
    try {
      // محاكاة فحص الشبكة
      const responseTime = Date.now() - startTime
      
      return {
        service: 'network',
        status: responseTime < 100 ? 'healthy' : responseTime < 500 ? 'degraded' : 'unhealthy',
        responseTime,
        lastCheck: new Date(),
        message: 'الشبكة تعمل بشكل طبيعي'
      }
    } catch (error) {
      return {
        service: 'network',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        message: 'خطأ في فحص الشبكة'
      }
    }
  }

  /**
   * تحليل الاتجاهات
   */
  analyzeTrends(period: 'hour' | 'day' | 'week' = 'hour'): {
    avgResponseTime: number
    avgCpuUsage: number
    avgMemoryUsage: number
    errorRate: number
    trend: 'improving' | 'stable' | 'degrading'
  } {
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

    const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoffTime)
    
    if (recentMetrics.length === 0) {
      return {
        avgResponseTime: 0,
        avgCpuUsage: 0,
        avgMemoryUsage: 0,
        errorRate: 0,
        trend: 'stable'
      }
    }

    const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length
    const avgCpuUsage = recentMetrics.reduce((sum, m) => sum + m.cpuUsage, 0) / recentMetrics.length
    const avgMemoryUsage = recentMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / recentMetrics.length
    const errorRate = recentMetrics.reduce((sum, m) => sum + m.errorRate, 0) / recentMetrics.length

    // تحديد الاتجاه
    const firstHalf = recentMetrics.slice(0, Math.floor(recentMetrics.length / 2))
    const secondHalf = recentMetrics.slice(Math.floor(recentMetrics.length / 2))
    
    const firstAvgResponse = firstHalf.reduce((sum, m) => sum + m.responseTime, 0) / firstHalf.length
    const secondAvgResponse = secondHalf.reduce((sum, m) => sum + m.responseTime, 0) / secondHalf.length
    
    let trend: 'improving' | 'stable' | 'degrading' = 'stable'
    if (secondAvgResponse < firstAvgResponse * 0.9) {
      trend = 'improving'
    } else if (secondAvgResponse > firstAvgResponse * 1.1) {
      trend = 'degrading'
    }

    return {
      avgResponseTime,
      avgCpuUsage,
      avgMemoryUsage,
      errorRate,
      trend
    }
  }

  /**
   * إنشاء تنبيهات للمقاييس المتجاوزة
   */
  checkAlerts(): Array<{
    type: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    message: string
    value: number
    threshold: number
  }> {
    const alerts = []
    const latestMetrics = this.metrics[this.metrics.length - 1]
    
    if (!latestMetrics) return alerts

    if (latestMetrics.cpuUsage > this.alertThresholds.cpuUsage) {
      alerts.push({
        type: 'cpu_usage',
        severity: latestMetrics.cpuUsage > 95 ? 'critical' : 'high',
        message: 'استخدام المعالج مرتفع',
        value: latestMetrics.cpuUsage,
        threshold: this.alertThresholds.cpuUsage
      })
    }

    if (latestMetrics.memoryUsage > this.alertThresholds.memoryUsage) {
      alerts.push({
        type: 'memory_usage',
        severity: latestMetrics.memoryUsage > 95 ? 'critical' : 'high',
        message: 'استخدام الذاكرة مرتفع',
        value: latestMetrics.memoryUsage,
        threshold: this.alertThresholds.memoryUsage
      })
    }

    if (latestMetrics.responseTime > this.alertThresholds.responseTime) {
      alerts.push({
        type: 'response_time',
        severity: latestMetrics.responseTime > 5000 ? 'critical' : 'medium',
        message: 'وقت الاستجابة بطيء',
        value: latestMetrics.responseTime,
        threshold: this.alertThresholds.responseTime
      })
    }

    if (latestMetrics.errorRate > this.alertThresholds.errorRate) {
      alerts.push({
        type: 'error_rate',
        severity: latestMetrics.errorRate > 10 ? 'critical' : 'high',
        message: 'معدل الأخطاء مرتفع',
        value: latestMetrics.errorRate,
        threshold: this.alertThresholds.errorRate
      })
    }

    return alerts
  }

  /**
   * الحصول على أحدث المقاييس
   */
  getLatestMetrics(): SystemMetrics | null {
    return this.metrics[this.metrics.length - 1] || null
  }

  /**
   * الحصول على جميع فحوصات الصحة
   */
  getAllHealthChecks(): HealthCheck[] {
    return Array.from(this.healthChecks.values())
  }

  /**
   * تشغيل المراقبة المستمرة
   */
  private startMonitoring(): void {
    // جمع المقاييس كل دقيقة
    setInterval(async () => {
      try {
        await this.collectMetrics()
      } catch (error) {
        console.error('خطأ في جمع المقاييس:', error)
      }
    }, 60000)

    // فحص صحة الخدمات كل 5 دقائق
    setInterval(async () => {
      try {
        await this.performHealthChecks()
      } catch (error) {
        console.error('خطأ في فحص الصحة:', error)
      }
    }, 300000)
  }

  /**
   * إيقاف المراقبة
   */
  stopMonitoring(): void {
    // في التطبيق الحقيقي، ستحتاج إلى إدارة معرفات الفترات الزمنية
    console.log('تم إيقاف المراقبة')
  }

  /**
   * تصدير المقاييس للمراقبة الخارجية
   */
  exportMetrics(): {
    metrics: SystemMetrics[]
    healthChecks: HealthCheck[]
    alerts: any[]
    summary: any
  } {
    return {
      metrics: this.metrics,
      healthChecks: this.getAllHealthChecks(),
      alerts: this.checkAlerts(),
      summary: this.analyzeTrends()
    }
  }
}

// إنشاء مثيل واحد للخدمة
let monitoringInstance: MonitoringService | null = null

export const getMonitoringService = (prisma: PrismaClient): MonitoringService => {
  if (!monitoringInstance) {
    monitoringInstance = new MonitoringService(prisma)
  }
  return monitoringInstance
}

export default MonitoringService


