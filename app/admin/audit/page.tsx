"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Search, Filter, Download, RefreshCw, Eye, FileText, 
  User, Settings, Database, Globe, Shield, AlertTriangle,
  CheckCircle, XCircle, Clock, Calendar, BarChart3, PieChart,
  TrendingUp, TrendingDown, Activity, Building2, DollarSign,
  ChevronRight, ChevronLeft, Link as LinkIcon
} from "lucide-react"
import Link from "next/link"

interface AuditRecord {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  details: string
  status: 'success' | 'failed' | 'pending'
  impact: 'low' | 'medium' | 'high'
  category: 'user_management' | 'system_settings' | 'data_access' | 'financial' | 'security'
}

// أنواع استجابة API
interface ApiAuditLog {
  id: string
  entityType: 'INVOICE' | 'PAYMENT' | 'JOURNAL_ENTRY' | 'JOURNAL_ENTRY_LINE' | 'GL_ACCOUNT' | 'CLIENT' | 'SUPPLIER' | 'USER' | 'CURRENCY'
  entityId: string
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  summary?: string | null
  changes?: any
  user?: { id: string; name?: string | null; email?: string | null } | null
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: string
}

interface ApiStats {
  total: number
  today: number
  thisWeek: number
  thisMonth: number
}

export default function AuditPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedImpact, setSelectedImpact] = useState<string>("all")
  const [logs, setLogs] = useState<ApiAuditLog[]>([])
  const [stats, setStats] = useState<ApiStats>({ total: 0, today: 0, thisWeek: 0, thisMonth: 0 })
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [fromDate, setFromDate] = useState<string>("")
  const [toDate, setToDate] = useState<string>("")
  const [entityType, setEntityType] = useState<string>("all")
  const [actionType, setActionType] = useState<string>("all")
  const [userId, setUserId] = useState<string>("")
  const [totalPages, setTotalPages] = useState<number>(1)
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false)
  const [activeLogIndex, setActiveLogIndex] = useState<number | null>(null)

  const fetchAudit = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set('query', searchTerm)
      if (fromDate) params.set('from', fromDate)
      if (toDate) params.set('to', toDate)
      if (entityType !== 'all') params.set('entityType', entityType)
      if (actionType !== 'all') params.set('action', actionType)
      if (userId) params.set('userId', userId)
      params.set('page', page.toString())
      params.set('limit', limit.toString())
      const res = await fetch(`/api/admin/audit?${params.toString()}`)
      const json = await res.json()
      if (json.success) {
        setLogs(json.data.logs)
        setStats(json.data.stats)
        setTotalPages(json.data.pagination.pages)
      }
    } catch (e) {
      console.error('فشل في جلب سجلات التدقيق', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAudit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const auditStats = {
    totalRecords: stats.total,
    todayRecords: stats.today,
    successfulActions: Math.round((logs.length ? (logs.filter(l => l.action === 'CREATE').length / logs.length) * 100 : 0)),
    failedActions: 0,
    highImpactActions: 0,
  }

  const mappedRecords: AuditRecord[] = useMemo(() => {
    const toCategory = (entityType: ApiAuditLog['entityType']): AuditRecord['category'] => {
      if (entityType === 'INVOICE' || entityType === 'PAYMENT' || entityType === 'JOURNAL_ENTRY' || entityType === 'GL_ACCOUNT') return 'financial'
      if (entityType === 'USER') return 'user_management'
      return 'system_settings'
    }
    return logs.map((log) => ({
      id: log.id,
      timestamp: new Date(log.createdAt).toLocaleString('ar-EG'),
      user: log.user?.email || log.user?.name || 'system',
      action: `${log.action} ${log.entityType}`,
      resource: log.entityType,
      details: log.summary || JSON.stringify(log.changes || {}),
      status: 'success',
      impact: 'low',
      category: toCategory(log.entityType),
    }))
  }, [logs])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user_management': return User
      case 'system_settings': return Settings
      case 'data_access': return Database
      case 'financial': return DollarSign
      case 'security': return Shield
      default: return FileText
    }
  }

  const openEntityLink = (entityType: ApiAuditLog['entityType'], entityId: string) => {
    switch (entityType) {
      case 'INVOICE': return `/invoices?query=${encodeURIComponent(entityId)}`
      case 'PAYMENT': return `/reports/financial?tab=payments&query=${encodeURIComponent(entityId)}`
      case 'JOURNAL_ENTRY': return `/accounting/journal`
      case 'GL_ACCOUNT': return `/accounting/chart`
      case 'CLIENT': return `/clients?query=${encodeURIComponent(entityId)}`
      case 'SUPPLIER': return `/suppliers?query=${encodeURIComponent(entityId)}`
      default: return `#`
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المراجعة والتدقيق</h1>
          <p className="text-gray-600">تتبع ومراجعة جميع الأنشطة والتغييرات في النظام</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير التقرير
          </Button>
          <Button size="sm" onClick={fetchAudit} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي السجلات</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.totalRecords}</div>
            <p className="text-xs text-muted-foreground">سجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">سجلات اليوم</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.todayRecords}</div>
            <p className="text-xs text-muted-foreground">آخر 24 ساعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نسبة الإنشاء</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{auditStats.successfulActions}%</div>
            <p className="text-xs text-muted-foreground">من إجمالي النتائج</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجراءات فاشلة</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{auditStats.failedActions}</div>
            <p className="text-xs text-muted-foreground">اليوم</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجراءات عالية التأثير</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{auditStats.highImpactActions}</div>
            <p className="text-xs text-muted-foreground">تحتاج مراجعة</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">سجلات المراجعة</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سجلات المراجعة التفصيلية</CardTitle>
              <CardDescription>جميع الأنشطة والتغييرات المسجلة في النظام</CardDescription>
            </CardHeader>
            <CardContent>
              {/* فلاتر البحث */}
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="البحث في السجلات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                  <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <select value={entityType} onChange={(e) => setEntityType(e.target.value)} className="px-3 py-2 border rounded-md">
                    <option value="all">كل الكيانات</option>
                    <option value="INVOICE">فاتورة</option>
                    <option value="PAYMENT">مدفوع</option>
                    <option value="JOURNAL_ENTRY">قيد يومية</option>
                    <option value="GL_ACCOUNT">حساب</option>
                    <option value="CLIENT">عميل</option>
                    <option value="SUPPLIER">مورد</option>
                    <option value="USER">مستخدم</option>
                  </select>
                  <select value={actionType} onChange={(e) => setActionType(e.target.value)} className="px-3 py-2 border rounded-md">
                    <option value="all">كل الإجراءات</option>
                    <option value="CREATE">إنشاء</option>
                    <option value="UPDATE">تعديل</option>
                    <option value="DELETE">حذف</option>
                  </select>
                  <Input placeholder="معرّف المستخدم (اختياري)" value={userId} onChange={(e) => setUserId(e.target.value)} />
                  <Button variant="outline" onClick={() => { setPage(1); fetchAudit(); }} disabled={loading}>
                    <Filter className="h-4 w-4 ml-2" /> تطبيق الفلاتر
                  </Button>
                </div>
              </div>

              {/* جدول السجلات */}
              <div className="space-y-3">
                {mappedRecords.map((record, idx) => {
                  const src = logs[idx]
                  const CategoryIcon = getCategoryIcon(record.category)
                  return (
                    <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-gray-100">
                            <CategoryIcon className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium">{record.action}</h3>
                              <Badge variant="outline" className={getStatusColor(record.status)}>
                                {record.status === 'success' ? 'نجح' : 
                                 record.status === 'failed' ? 'فشل' : 'قيد الانتظار'}
                              </Badge>
                              <Badge variant="outline" className={getImpactColor(record.impact)}>
                                {record.impact === 'low' ? 'منخفض' : 
                                 record.impact === 'medium' ? 'متوسط' : 'عالي'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 break-words">{record.details}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {record.user}
                              </span>
                              <span className="flex items-center">
                                <FileText className="h-3 w-3 mr-1" />
                                {record.resource}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {record.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {src && (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={openEntityLink(src.entityType, src.entityId)}>
                                <LinkIcon className="h-4 w-4 mr-1" /> فتح السجل
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setActiveLogIndex(idx); setDetailsOpen(true) }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            تفاصيل
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* ترقيم الصفحات */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-xs text-gray-500">صفحة {page} من {totalPages}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => setPage(p => Math.max(1, p - 1))}>
                    <ChevronRight className="h-4 w-4 ml-1" /> السابق
                  </Button>
                  <Button variant="outline" size="sm" disabled={page >= totalPages || loading} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                    التالي <ChevronLeft className="h-4 w-4 mr-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>تحليل الأنشطة</CardTitle>
                <CardDescription>توزيع الأنشطة حسب الفئة والحالة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>إدارة المستخدمين</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>إعدادات النظام</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>وصول البيانات</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex justify_between items-center">
                    <span>البيانات المالية</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الأمان</span>
                    <span className="font-medium">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معدل النجاح</CardTitle>
                <CardDescription>نسبة نجاح الإجراءات حسب الفئة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>إدارة المستخدمين</span>
                    <span className="font-medium text-green-600">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>إعدادات النظام</span>
                    <span className="font-medium text-green-600">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>وصول البيانات</span>
                    <span className="font-medium text-yellow-600">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>البيانات المالية</span>
                    <span className="font-medium text-green-600">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الأمان</span>
                    <span className="font-medium text-red-600">75%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تقارير المراجعة</CardTitle>
              <CardDescription>إنشاء وتصدير تقارير المراجعة المختلفة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">تقرير الأنشطة اليومية</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">ملخص شامل لجميع الأنشطة اليومية</p>
                  <Button size="sm" className="w-full">إنشاء التقرير</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items_center space-x-2 mb-2">
                    <PieChart className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">تقرير الأمان</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">تحليل أحداث الأمان والتهديدات</p>
                  <Button size="sm" className="w-full">إنشاء التقرير</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium">تقرير الأداء</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">تحليل أداء النظام والأنشطة</p>
                  <Button size="sm" className="w-full">إنشاء التقرير</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* نافذة تفاصيل السجل */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>تفاصيل سجل التدقيق</DialogTitle>
          </DialogHeader>
          {activeLogIndex !== null && logs[activeLogIndex] && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-gray-500">الكيان</div>
                  <div className="font-medium">{logs[activeLogIndex].entityType}</div>
                </div>
                <div>
                  <div className="text-gray-500">الإجراء</div>
                  <div className="font-medium">{logs[activeLogIndex].action}</div>
                </div>
                <div>
                  <div className="text-gray-500">المعرف</div>
                  <div className="font-mono">{logs[activeLogIndex].entityId}</div>
                </div>
                <div>
                  <div className="text-gray-500">المستخدم</div>
                  <div className="font-medium">{logs[activeLogIndex].user?.email || logs[activeLogIndex].user?.name || 'system'}</div>
                </div>
                <div>
                  <div className="text-gray-500">العنوان IP</div>
                  <div className="font-mono">{logs[activeLogIndex].ipAddress || '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500">التاريخ</div>
                  <div className="font-medium">{new Date(logs[activeLogIndex].createdAt).toLocaleString('ar-EG')}</div>
                </div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">الملخص</div>
                <div className="p-3 rounded border bg-gray-50">
                  {logs[activeLogIndex].summary || '—'}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-gray-500">التغييرات (JSON)</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(JSON.stringify(logs[activeLogIndex]?.changes ?? {}, null, 2))}
                  >نسخ</Button>
                </div>
                <pre className="p-3 rounded border bg-black text-green-300 text-xs overflow-auto max-h-80">
{JSON.stringify(logs[activeLogIndex]?.changes ?? {}, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 