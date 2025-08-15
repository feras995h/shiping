"use client"

import React, { useState, useEffect } from "react"
import { 
  Bell, AlertTriangle, CheckCircle, Info, X, 
  Eye, EyeOff, Filter, Search, Calendar,
  TrendingUp, TrendingDown, DollarSign, Clock
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SimpleAnimatedCard } from "@/components/ui/simple-animated-card"
import { SimpleAnimatedCounter } from "@/components/ui/simple-animated-counter"

interface FinancialNotification {
  id: string
  type: 'revenue_alert' | 'expense_warning' | 'cash_flow' | 'invoice_due' | 'payment_received' | 'budget_exceeded'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  title: string
  message: string
  amount?: number
  percentage?: number
  dueDate?: string
  isRead: boolean
  createdAt: string
  actions?: Array<{
    label: string
    action: string
    url?: string
  }>
  metadata?: Record<string, any>
}

interface NotificationStats {
  total: number
  unread: number
  urgent: number
  today: number
  revenue: number
  expenses: number
  alerts: number
}

export default function FinancialNotifications() {
  const [notifications, setNotifications] = useState<FinancialNotification[]>([])
  const [stats, setStats] = useState<NotificationStats>({
    total: 0, unread: 0, urgent: 0, today: 0,
    revenue: 0, expenses: 0, alerts: 0
  })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent' | 'today'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')

  useEffect(() => {
    fetchNotifications()
    
    // تحديث الإشعارات كل دقيقة
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      
      // محاكاة البيانات - في التطبيق الحقيقي ستأتي من API
      const mockNotifications: FinancialNotification[] = [
        {
          id: '1',
          type: 'revenue_alert',
          priority: 'high',
          title: 'تحقيق هدف الإيرادات الشهري',
          message: 'تم تجاوز هدف الإيرادات المحدد بنسبة 15% هذا الشهر',
          amount: 125000,
          percentage: 115,
          isRead: false,
          createdAt: new Date().toISOString(),
          actions: [
            { label: 'عرض التفاصيل', action: 'view', url: '/financial/reports/revenue' },
            { label: 'تحديث الهدف', action: 'update', url: '/financial/settings/targets' }
          ]
        },
        {
          id: '2',
          type: 'expense_warning',
          priority: 'medium',
          title: 'تحذير من زيادة المصروفات',
          message: 'المصروفات التشغيلية زادت بنسبة 8% عن الشهر الماضي',
          amount: 45000,
          percentage: 108,
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          actions: [
            { label: 'مراجعة المصروفات', action: 'review', url: '/financial/expenses' }
          ]
        },
        {
          id: '3',
          type: 'invoice_due',
          priority: 'urgent',
          title: 'فواتير متأخرة السداد',
          message: 'يوجد 5 فواتير متأخرة عن موعد السداد بقيمة إجمالية 75,000 د.ل',
          amount: 75000,
          dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          actions: [
            { label: 'عرض الفواتير', action: 'view', url: '/invoices?status=overdue' },
            { label: 'إرسال تذكير', action: 'remind' }
          ]
        },
        {
          id: '4',
          type: 'payment_received',
          priority: 'low',
          title: 'دفعة جديدة مستلمة',
          message: 'تم استلام دفعة بقيمة 25,000 د.ل من العميل أحمد محمد',
          amount: 25000,
          isRead: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          actions: [
            { label: 'عرض الدفعة', action: 'view', url: '/payments' }
          ]
        },
        {
          id: '5',
          type: 'cash_flow',
          priority: 'high',
          title: 'تحسن في التدفق النقدي',
          message: 'التدفق النقدي الإيجابي زاد بنسبة 22% هذا الأسبوع',
          amount: 95000,
          percentage: 122,
          isRead: false,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          actions: [
            { label: 'تحليل التدفق النقدي', action: 'analyze', url: '/financial/cashflow' }
          ]
        }
      ]

      setNotifications(mockNotifications)
      
      // حساب الإحصائيات
      const newStats: NotificationStats = {
        total: mockNotifications.length,
        unread: mockNotifications.filter(n => !n.isRead).length,
        urgent: mockNotifications.filter(n => n.priority === 'urgent').length,
        today: mockNotifications.filter(n => 
          new Date(n.createdAt).toDateString() === new Date().toDateString()
        ).length,
        revenue: mockNotifications.filter(n => n.type === 'revenue_alert' || n.type === 'payment_received').length,
        expenses: mockNotifications.filter(n => n.type === 'expense_warning').length,
        alerts: mockNotifications.filter(n => n.type === 'invoice_due' || n.type === 'budget_exceeded').length
      }
      
      setStats(newStats)
      
    } catch (error) {
      console.error('خطأ في جلب الإشعارات:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ))
    setStats(prev => ({ ...prev, unread: prev.unread - 1 }))
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })))
    setStats(prev => ({ ...prev, unread: 0 }))
  }

  const getFilteredNotifications = () => {
    let filtered = notifications

    // تطبيق فلتر النوع
    if (selectedType !== 'all') {
      filtered = filtered.filter(n => n.type === selectedType)
    }

    // تطبيق فلتر البحث
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // تطبيق فلتر الحالة
    switch (filter) {
      case 'unread':
        return filtered.filter(n => !n.isRead)
      case 'urgent':
        return filtered.filter(n => n.priority === 'urgent')
      case 'today':
        return filtered.filter(n => 
          new Date(n.createdAt).toDateString() === new Date().toDateString()
        )
      default:
        return filtered
    }
  }

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === 'urgent' ? 'text-red-500' : 
                     priority === 'high' ? 'text-orange-500' :
                     priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'

    switch (type) {
      case 'revenue_alert':
        return <TrendingUp className={`h-4 w-4 ${iconClass}`} />
      case 'expense_warning':
        return <TrendingDown className={`h-4 w-4 ${iconClass}`} />
      case 'payment_received':
        return <DollarSign className={`h-4 w-4 ${iconClass}`} />
      case 'invoice_due':
        return <AlertTriangle className={`h-4 w-4 ${iconClass}`} />
      case 'cash_flow':
        return <TrendingUp className={`h-4 w-4 ${iconClass}`} />
      default:
        return <Bell className={`h-4 w-4 ${iconClass}`} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-200 bg-red-50'
      case 'high': return 'border-orange-200 bg-orange-50'
      case 'medium': return 'border-yellow-200 bg-yellow-50'
      default: return 'border-blue-200 bg-blue-50'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'revenue_alert': return 'إيرادات'
      case 'expense_warning': return 'مصروفات'
      case 'payment_received': return 'دفعة'
      case 'invoice_due': return 'فاتورة'
      case 'cash_flow': return 'تدفق نقدي'
      case 'budget_exceeded': return 'ميزانية'
      default: return 'عام'
    }
  }

  const filteredNotifications = getFilteredNotifications()

  return (
    <SimpleAnimatedCard variant="gold" className="card-premium">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-6 w-6 text-amber-600" />
              {stats.unread > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  {stats.unread}
                </Badge>
              )}
            </div>
            <div>
              <CardTitle className="text-xl text-gradient-gold">الإشعارات المالية الذكية</CardTitle>
              <CardDescription>متابعة فورية للأحداث المالية المهمة</CardDescription>
            </div>
          </div>
          
          {stats.unread > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="hover-glow"
            >
              <CheckCircle className="h-4 w-4 ml-2" />
              قراءة الكل
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
            <SimpleAnimatedCounter to={stats.unread} className="text-2xl font-bold text-amber-600" />
            <div className="text-xs text-amber-700">غير مقروءة</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
            <SimpleAnimatedCounter to={stats.urgent} className="text-2xl font-bold text-red-600" />
            <div className="text-xs text-red-700">عاجلة</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <SimpleAnimatedCounter to={stats.revenue} className="text-2xl font-bold text-green-600" />
            <div className="text-xs text-green-700">إيرادات</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <SimpleAnimatedCounter to={stats.today} className="text-2xl font-bold text-blue-600" />
            <div className="text-xs text-blue-700">اليوم</div>
          </div>
        </div>

        {/* أدوات التصفية */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في الإشعارات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="نوع الإشعار" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              <SelectItem value="revenue_alert">إيرادات</SelectItem>
              <SelectItem value="expense_warning">مصروفات</SelectItem>
              <SelectItem value="payment_received">دفعات</SelectItem>
              <SelectItem value="invoice_due">فواتير</SelectItem>
              <SelectItem value="cash_flow">تدفق نقدي</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* تبويبات التصفية */}
        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">الكل ({stats.total})</TabsTrigger>
            <TabsTrigger value="unread">غير مقروءة ({stats.unread})</TabsTrigger>
            <TabsTrigger value="urgent">عاجلة ({stats.urgent})</TabsTrigger>
            <TabsTrigger value="today">اليوم ({stats.today})</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            <ScrollArea className="h-96">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                  <span className="ml-2">جاري التحميل...</span>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">لا توجد إشعارات</p>
                  <p className="text-sm">لا توجد إشعارات تطابق المعايير المحددة</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                        getPriorityColor(notification.priority)
                      } ${notification.isRead ? 'opacity-70' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getNotificationIcon(notification.type, notification.priority)}
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-slate-800">
                                {notification.title}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(notification.type)}
                              </Badge>
                              <Badge 
                                variant={notification.priority === 'urgent' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {notification.priority === 'urgent' ? 'عاجل' :
                                 notification.priority === 'high' ? 'مهم' :
                                 notification.priority === 'medium' ? 'متوسط' : 'عادي'}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-slate-600 mb-2">
                              {notification.message}
                            </p>
                            
                            {notification.amount && (
                              <div className="text-sm font-medium text-amber-600 mb-2">
                                {notification.amount.toLocaleString()} د.ل
                                {notification.percentage && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    ({notification.percentage}%)
                                  </span>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(notification.createdAt).toLocaleString('ar-EG')}
                              </div>
                              {notification.dueDate && (
                                <div className="flex items-center gap-1 text-red-600">
                                  <Calendar className="h-3 w-3" />
                                  استحقاق: {new Date(notification.dueDate).toLocaleDateString('ar-EG')}
                                </div>
                              )}
                            </div>
                            
                            {notification.actions && notification.actions.length > 0 && (
                              <div className="flex gap-2 mt-3">
                                {notification.actions.map((action, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-7"
                                  >
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </SimpleAnimatedCard>
  )
}
