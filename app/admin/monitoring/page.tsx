'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  Server, 
  Database, 
  Mail, 
  Cloud, 
  CreditCard, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface SystemMetric {
  name: string
  value: string
  unit: string
  status: 'normal' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
  change: string
}

interface ServiceStatus {
  name: string
  status: 'online' | 'offline' | 'warning'
  uptime: string
  responseTime: string
  lastCheck: string
}

interface MonitoringData {
  systemMetrics: SystemMetric[]
  serviceStatuses: ServiceStatus[]
  activeUsers: number
  recentErrors: Array<{
    id: string
    message: string
    level: string
    timestamp: string
    service: string
  }>
  lastUpdated: string
}

export default function AdminMonitoringPage() {
  const [data, setData] = useState<MonitoringData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // جلب بيانات المراقبة
  const fetchMonitoringData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/monitoring')
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        toast({
          title: "خطأ",
          description: result.message || "فشل في جلب بيانات المراقبة",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // تحديث البيانات
  const refreshData = async () => {
    setIsRefreshing(true)
    await fetchMonitoringData()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  useEffect(() => {
    fetchMonitoringData()
    
    // تحديث تلقائي كل دقيقة
    const interval = setInterval(fetchMonitoringData, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'offline': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'offline': return <XCircle className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'stable': return <Minus className="h-4 w-4 text-gray-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getMetricIcon = (name: string) => {
    if (name.includes('المعالج')) return <Activity className="h-4 w-4" />
    if (name.includes('الذاكرة')) return <Database className="h-4 w-4" />
    if (name.includes('التخزين')) return <Server className="h-4 w-4" />
    if (name.includes('الشبكة')) return <Activity className="h-4 w-4" />
    if (name.includes('المستخدمين')) return <Users className="h-4 w-4" />
    if (name.includes('الطلبات')) return <Activity className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">مراقبة النظام</h1>
            <p className="text-sm text-muted-foreground">
              مراقبة حالة النظام والخدمات والأداء
            </p>
          </div>
        </div>
        
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">جاري تحميل بيانات المراقبة...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">مراقبة النظام</h1>
            <p className="text-sm text-muted-foreground">
              مراقبة حالة النظام والخدمات والأداء
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="text-center py-20">
            <p className="text-lg text-gray-600 mb-4">فشل في تحميل بيانات المراقبة</p>
            <Button onClick={fetchMonitoringData}>إعادة المحاولة</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // حساب الحالة العامة للنظام
  const overallStatus = data.serviceStatuses.every(service => service.status === 'online') ? 'online' :
                       data.serviceStatuses.some(service => service.status === 'offline') ? 'offline' : 'warning'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مراقبة النظام</h1>
          <p className="text-sm text-muted-foreground">
            مراقبة حالة النظام والخدمات والأداء
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">آخر تحديث:</span>
            <span className="text-sm font-medium">
              {new Date(data.lastUpdated).toLocaleTimeString('ar-LY')}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ml-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>
      </div>

      {/* الحالة العامة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            الحالة العامة للنظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge 
              className={getServiceStatusColor(overallStatus)}
              variant="outline"
            >
              {overallStatus === 'online' && 'جميع الخدمات تعمل بشكل طبيعي'}
              {overallStatus === 'warning' && 'بعض الخدمات تحتاج انتباه'}
              {overallStatus === 'offline' && 'بعض الخدمات غير متاحة'}
            </Badge>
            <div className="text-sm text-muted-foreground">
              {data.serviceStatuses.filter(s => s.status === 'online').length} من {data.serviceStatuses.length} خدمة تعمل
            </div>
          </div>
        </CardContent>
      </Card>

      {/* مقاييس النظام */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            مقاييس النظام
          </CardTitle>
          <CardDescription>
            مؤشرات أداء النظام الحالية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.systemMetrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getMetricIcon(metric.name)}
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status === 'normal' && 'طبيعي'}
                    {metric.status === 'warning' && 'تحذير'}
                    {metric.status === 'critical' && 'حرج'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {getTrendIcon(metric.trend)}
                  <span>{metric.change}</span>
                </div>
                {metric.unit === '%' && (
                  <Progress 
                    value={parseInt(metric.value)} 
                    className="h-2"
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* حالة الخدمات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            حالة الخدمات
          </CardTitle>
          <CardDescription>
            حالة جميع الخدمات في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.serviceStatuses.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getServiceStatusIcon(service.status)}
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground">
                      وقت التشغيل: {service.uptime} | الاستجابة: {service.responseTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getServiceStatusColor(service.status)}>
                    {service.status === 'online' && 'متصل'}
                    {service.status === 'warning' && 'تحذير'}
                    {service.status === 'offline' && 'غير متصل'}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    آخر فحص: {new Date(service.lastCheck).toLocaleTimeString('ar-LY')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* معلومات إضافية */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* المستخدمين النشطين */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              المستخدمين النشطين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold-600">{data.activeUsers}</div>
              <p className="text-sm text-muted-foreground">مستخدم نشط في آخر 15 دقيقة</p>
            </div>
          </CardContent>
        </Card>

        {/* الأخطاء الأخيرة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              الأخطاء الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentErrors.length > 0 ? (
              <div className="space-y-2">
                {data.recentErrors.slice(0, 3).map((error) => (
                  <div key={error.id} className="text-sm">
                    <div className="font-medium">{error.message}</div>
                    <div className="text-muted-foreground">
                      {error.service} • {new Date(error.timestamp).toLocaleTimeString('ar-LY')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground">
                لا توجد أخطاء حديثة
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 