"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, TrendingUp, TrendingDown, Activity, Clock, 
  Users, Server, Database, Globe, Shield, Download, 
  Calendar, Filter, Eye, FileText, PieChart, Target,
  CheckCircle, XCircle, AlertTriangle, Zap, Cpu, HardDrive, Search
} from "lucide-react"

interface PerformanceReport {
  id: string
  title: string
  type: 'system' | 'user' | 'financial' | 'shipping' | 'security'
  period: string
  status: 'completed' | 'processing' | 'failed'
  generatedAt: string
  size: string
  metrics: {
    name: string
    value: number
    unit: string
    change: number
    status: 'good' | 'warning' | 'critical'
  }[]
}

const performanceReports: PerformanceReport[] = [
  {
    id: "1",
    title: "تقرير أداء النظام الشهري",
    type: "system",
    period: "يناير 2024",
    status: "completed",
    generatedAt: "2024-01-15 10:30:00",
    size: "2.5 MB",
    metrics: [
      { name: "متوسط استجابة الخادم", value: 45, unit: "ms", change: -12, status: 'good' },
      { name: "استخدام المعالج", value: 68, unit: "%", change: 5, status: 'warning' },
      { name: "استخدام الذاكرة", value: 72, unit: "%", change: 8, status: 'warning' },
      { name: "معدل الطلبات", value: 1250, unit: "req/min", change: 15, status: 'good' }
    ]
  },
  {
    id: "2",
    title: "تقرير نشاط المستخدمين الأسبوعي",
    type: "user",
    period: "الأسبوع 2",
    status: "completed",
    generatedAt: "2024-01-14 09:15:00",
    size: "1.8 MB",
    metrics: [
      { name: "المستخدمون النشطون", value: 47, unit: "مستخدم", change: 12, status: 'good' },
      { name: "جلسات العمل", value: 156, unit: "جلسة", change: 8, status: 'good' },
      { name: "معدل الاستخدام", value: 78, unit: "%", change: -3, status: 'good' },
      { name: "وقت الاستجابة", value: 2.3, unit: "ثانية", change: -15, status: 'good' }
    ]
  },
  {
    id: "3",
    title: "تقرير الأداء المالي الشهري",
    type: "financial",
    period: "يناير 2024",
    status: "processing",
    generatedAt: "2024-01-15 11:00:00",
    size: "3.2 MB",
    metrics: [
      { name: "إجمالي الإيرادات", value: 125000, unit: "دينار", change: 18, status: 'good' },
      { name: "صافي الربح", value: 45000, unit: "دينار", change: 22, status: 'good' },
      { name: "معدل النمو", value: 15, unit: "%", change: 5, status: 'good' },
      { name: "تكلفة العمليات", value: 80000, unit: "دينار", change: 8, status: 'warning' }
    ]
  },
  {
    id: "4",
    title: "تقرير أداء الشحن الأسبوعي",
    type: "shipping",
    period: "الأسبوع 2",
    status: "completed",
    generatedAt: "2024-01-13 16:45:00",
    size: "2.1 MB",
    metrics: [
      { name: "الشحنات المكتملة", value: 89, unit: "شحنة", change: 15, status: 'good' },
      { name: "معدل التسليم في الوقت", value: 94, unit: "%", change: 3, status: 'good' },
      { name: "متوسط وقت التوصيل", value: 5.2, unit: "أيام", change: -8, status: 'good' },
      { name: "الشحنات المتأخرة", value: 6, unit: "شحنة", change: -25, status: 'good' }
    ]
  },
  {
    id: "5",
    title: "تقرير الأمان اليومي",
    type: "security",
    period: "15 يناير 2024",
    status: "completed",
    generatedAt: "2024-01-15 23:59:00",
    size: "0.8 MB",
    metrics: [
      { name: "محاولات الدخول الفاشلة", value: 12, unit: "محاولة", change: -20, status: 'good' },
      { name: "التنبيهات الأمنية", value: 3, unit: "تنبيه", change: 0, status: 'good' },
      { name: "معدل الأمان", value: 98, unit: "%", change: 2, status: 'good' },
      { name: "الأنشطة المشبوهة", value: 1, unit: "نشاط", change: -50, status: 'good' }
    ]
  }
]

const systemMetrics = {
  cpu: 68,
  memory: 72,
  disk: 45,
  network: 85,
  database: 92,
  uptime: "15 يوم، 8 ساعات، 32 دقيقة"
}

export default function PerformanceReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100'
      case 'warning': return 'bg-yellow-100'
      case 'critical': return 'bg-red-100'
      default: return 'bg-gray-100'
    }
  }

  const getReportStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return Server
      case 'user': return Users
      case 'financial': return BarChart3
      case 'shipping': return Globe
      case 'security': return Shield
      default: return FileText
    }
  }

  const filteredReports = performanceReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || report.type === selectedType
    const matchesStatus = selectedStatus === "all" || report.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تقارير الأداء</h1>
          <p className="text-gray-600">مراقبة وتحليل أداء النظام والمستخدمين</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير جميع التقارير
          </Button>
          <Button size="sm">
            <Activity className="h-4 w-4 mr-2" />
            إنشاء تقرير جديد
          </Button>
        </div>
      </div>

      {/* مؤشرات الأداء الحالية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">استخدام المعالج</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.cpu}%</div>
            <Progress value={systemMetrics.cpu} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">+5% من الأمس</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">استخدام الذاكرة</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.memory}%</div>
            <Progress value={systemMetrics.memory} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">+8% من الأمس</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">استخدام التخزين</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.disk}%</div>
            <Progress value={systemMetrics.disk} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">+2% من الأمس</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">وقت التشغيل</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.uptime}</div>
            <p className="text-xs text-muted-foreground">متواصل</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          <TabsTrigger value="templates">قوالب التقارير</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تقارير الأداء المتاحة</CardTitle>
              <CardDescription>جميع التقارير المولدة والمتاحة للتحميل</CardDescription>
            </CardHeader>
            <CardContent>
              {/* فلاتر البحث */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="البحث في التقارير..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="system">أداء النظام</option>
                  <option value="user">نشاط المستخدمين</option>
                  <option value="financial">الأداء المالي</option>
                  <option value="shipping">أداء الشحن</option>
                  <option value="security">الأمان</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="completed">مكتمل</option>
                  <option value="processing">قيد المعالجة</option>
                  <option value="failed">فشل</option>
                </select>
              </div>

              {/* قائمة التقارير */}
              <div className="space-y-4">
                {filteredReports.map((report) => {
                  const TypeIcon = getTypeIcon(report.type)
                  return (
                    <div key={report.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <TypeIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">{report.title}</h3>
                            <p className="text-sm text-gray-500">الفترة: {report.period}</p>
                            <p className="text-sm text-gray-500">تم الإنشاء: {report.generatedAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getReportStatusColor(report.status)}>
                            {report.status === 'completed' ? 'مكتمل' : 
                             report.status === 'processing' ? 'قيد المعالجة' : 'فشل'}
                          </Badge>
                          <span className="text-sm text-gray-500">{report.size}</span>
                        </div>
                      </div>

                      {/* مؤشرات الأداء */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {report.metrics.map((metric, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{metric.name}</span>
                              <span className={`text-xs ${getStatusColor(metric.status)}`}>
                                {metric.change >= 0 ? '+' : ''}{metric.change}%
                              </span>
                            </div>
                            <div className="text-lg font-bold">
                              {metric.value} {metric.unit}
                            </div>
                            <div className={`w-full h-1 rounded-full mt-2 ${getStatusBgColor(metric.status)}`}></div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            عرض
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            تحميل
                          </Button>
                        </div>
                        <Button size="sm">إعادة إنشاء</Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>تحليل الأداء</CardTitle>
                <CardDescription>مقارنة أداء النظام عبر الفترات الزمنية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>أداء النظام</span>
                    <span className="font-medium text-green-600">+15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>نشاط المستخدمين</span>
                    <span className="font-medium text-green-600">+8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الأداء المالي</span>
                    <span className="font-medium text-green-600">+22%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>أداء الشحن</span>
                    <span className="font-medium text-green-600">+12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الأمان</span>
                    <span className="font-medium text-green-600">+5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزيع التقارير</CardTitle>
                <CardDescription>عدد التقارير حسب النوع والحالة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>تقارير النظام</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>تقارير المستخدمين</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>التقارير المالية</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>تقارير الشحن</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>تقارير الأمان</span>
                    <span className="font-medium">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>قوالب التقارير</CardTitle>
              <CardDescription>إنشاء تقارير جديدة باستخدام القوالب المتاحة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Server className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">تقرير أداء النظام</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">تحليل شامل لأداء النظام والموارد</p>
                  <Button size="sm" className="w-full">إنشاء التقرير</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">تقرير نشاط المستخدمين</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">تحليل استخدام النظام من قبل المستخدمين</p>
                  <Button size="sm" className="w-full">إنشاء التقرير</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium">التقرير المالي</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">تحليل الأداء المالي والإيرادات</p>
                  <Button size="sm" className="w-full">إنشاء التقرير</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 