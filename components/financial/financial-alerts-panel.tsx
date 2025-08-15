"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle, Info, AlertCircle, ExternalLink, X, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

interface FinancialAlert {
  id: string
  type: 'BALANCE_MISMATCH' | 'OVERDUE_INVOICE' | 'LOW_CASH' | 'NEGATIVE_BALANCE' | 'LARGE_TRANSACTION' | 'SYSTEM_ERROR'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  title: string
  message: string
  data?: any
  createdAt: string
  isRead: boolean
  actions?: Array<{
    label: string
    action: string
    url?: string
  }>
  category?: string
}

interface AlertStats {
  total: number
  active: number
  critical: number
  warning: number
  financial: number
  system: number
}

export default function FinancialAlertsPanel() {
  const [alerts, setAlerts] = useState<FinancialAlert[]>([])
  const [stats, setStats] = useState<AlertStats>({
    total: 0,
    active: 0,
    critical: 0,
    warning: 0,
    financial: 0,
    system: 0
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAlerts = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true)
      else setLoading(true)
      
      const response = await fetch('/api/admin/alerts')
      const data = await response.json()
      
      if (data.success) {
        setAlerts(data.data.alerts || [])
        setStats(data.data.stats || stats)
      }
    } catch (error) {
      console.error('خطأ في جلب التنبيهات:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
    
    // تحديث التنبيهات كل 5 دقائق
    const interval = setInterval(() => fetchAlerts(true), 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const markAsRead = async (alertId: string) => {
    try {
      const response = await fetch('/api/admin/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: alertId, isRead: true })
      })

      if (response.ok) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId ? { ...alert, isRead: true } : alert
        ))
        setStats(prev => ({ ...prev, active: prev.active - 1 }))
      }
    } catch (error) {
      console.error('خطأ في تحديث التنبيه:', error)
    }
  }

  const getSeverityIcon = (severity: string, category?: string) => {
    if (category === 'FINANCIAL') {
      switch (severity) {
        case 'CRITICAL': return <AlertTriangle className="h-4 w-4 text-red-500" />
        case 'HIGH': return <AlertCircle className="h-4 w-4 text-orange-500" />
        case 'MEDIUM': return <Info className="h-4 w-4 text-yellow-500" />
        default: return <CheckCircle className="h-4 w-4 text-blue-500" />
      }
    }
    
    switch (severity) {
      case 'ERROR': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'WARNING': return <AlertCircle className="h-4 w-4 text-orange-500" />
      case 'SUCCESS': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getSeverityColor = (severity: string, category?: string) => {
    if (category === 'FINANCIAL') {
      switch (severity) {
        case 'CRITICAL': return 'border-red-200 bg-red-50'
        case 'HIGH': return 'border-orange-200 bg-orange-50'
        case 'MEDIUM': return 'border-yellow-200 bg-yellow-50'
        default: return 'border-blue-200 bg-blue-50'
      }
    }
    
    switch (severity) {
      case 'ERROR': return 'border-red-200 bg-red-50'
      case 'WARNING': return 'border-orange-200 bg-orange-50'
      case 'SUCCESS': return 'border-green-200 bg-green-50'
      default: return 'border-blue-200 bg-blue-50'
    }
  }

  const getAlertTypeText = (type: string) => {
    switch (type) {
      case 'BALANCE_MISMATCH': return 'عدم توازن محاسبي'
      case 'OVERDUE_INVOICE': return 'فواتير متأخرة'
      case 'LOW_CASH': return 'سيولة منخفضة'
      case 'NEGATIVE_BALANCE': return 'أرصدة سالبة'
      case 'LARGE_TRANSACTION': return 'معاملة كبيرة'
      case 'SYSTEM_ERROR': return 'خطأ نظام'
      default: return type
    }
  }

  if (loading) {
    return (
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-gold-500" />
            التنبيهات المالية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gold-500" />
            <span className="mr-2">جاري التحميل...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-premium">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-gold-500" />
            <CardTitle className="gold-text">التنبيهات المالية الذكية</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAlerts(true)}
              disabled={refreshing}
              className="border-gold-300 hover:bg-gold-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        <CardDescription>
          نظام تنبيهات ذكي لمراقبة الوضع المالي ومتابعة المخاطر
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gradient-to-r from-gold-50 to-amber-50 rounded-lg border border-gold-200">
            <div className="text-2xl font-bold text-gold-600">{stats.active}</div>
            <div className="text-xs text-gold-700">نشطة</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            <div className="text-xs text-red-700">حرجة</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.financial}</div>
            <div className="text-xs text-blue-700">مالية</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-600">{stats.system}</div>
            <div className="text-xs text-slate-700">نظام</div>
          </div>
        </div>

        {/* قائمة التنبيهات */}
        <ScrollArea className="h-96">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium">لا توجد تنبيهات</p>
              <p className="text-sm">جميع الأنظمة تعمل بشكل طبيعي</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 10).map((alert) => (
                <Alert key={alert.id} className={`${getSeverityColor(alert.severity || alert.type, alert.category)} ${alert.isRead ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getSeverityIcon(alert.severity || alert.type, alert.category)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertDescription className="font-semibold text-slate-800">
                            {alert.title}
                          </AlertDescription>
                          <Badge variant="outline" className="text-xs">
                            {alert.category === 'FINANCIAL' ? 'مالي' : 'نظام'}
                          </Badge>
                          {alert.type && alert.category === 'FINANCIAL' && (
                            <Badge variant="secondary" className="text-xs">
                              {getAlertTypeText(alert.type)}
                            </Badge>
                          )}
                        </div>
                        <AlertDescription className="text-sm text-slate-600 mb-2">
                          {alert.message}
                        </AlertDescription>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{new Date(alert.createdAt).toLocaleString('ar-EG')}</span>
                        </div>
                        
                        {/* إجراءات التنبيه */}
                        {alert.actions && alert.actions.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {alert.actions.map((action, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-7"
                                asChild={action.url ? true : false}
                              >
                                {action.url ? (
                                  <Link href={action.url} className="flex items-center gap-1">
                                    {action.label}
                                    <ExternalLink className="h-3 w-3" />
                                  </Link>
                                ) : (
                                  <span>{action.label}</span>
                                )}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!alert.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(alert.id)}
                        className="text-slate-400 hover:text-slate-600 h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </ScrollArea>

        {alerts.length > 10 && (
          <div className="text-center mt-4">
            <Button variant="outline" size="sm" className="border-gold-300 hover:bg-gold-50">
              عرض جميع التنبيهات ({alerts.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


