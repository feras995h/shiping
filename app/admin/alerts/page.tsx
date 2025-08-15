"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell, AlertTriangle, CheckCircle, Info, X, Settings, 
  Filter, Search, Clock, User, Server, Database, Globe
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface Alert {
  id: string
  title: string
  description: string
  type: 'info' | 'warning' | 'error' | 'success'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'acknowledged' | 'resolved'
  source: string
  timestamp: string
  assignedTo?: string
  category: string
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    title: "استخدام الذاكرة مرتفع",
    description: "استخدام الذاكرة وصل إلى 85% مما قد يؤثر على أداء النظام",
    type: "warning",
    priority: "medium",
    status: "active",
    source: "Server-01",
    timestamp: "2024-01-15T10:30:00Z",
    category: "النظام"
  },
  {
    id: "2",
    title: "فشل في الاتصال بخدمة البنك",
    description: "فشل في الاتصال بخدمة التكامل مع البنك المركزي",
    type: "error",
    priority: "high",
    status: "active",
    source: "Bank-Integration",
    timestamp: "2024-01-15T10:25:00Z",
    assignedTo: "أحمد محمد",
    category: "التكاملات"
  },
  {
    id: "3",
    title: "تم إضافة مستخدم جديد",
    description: "تم إضافة المستخدم محمد عبدالله بنجاح",
    type: "success",
    priority: "low",
    status: "resolved",
    source: "User-Management",
    timestamp: "2024-01-15T10:20:00Z",
    category: "المستخدمين"
  },
  {
    id: "4",
    title: "نسخة احتياطية مكتملة",
    description: "تم إكمال النسخة الاحتياطية اليومية بنجاح",
    type: "info",
    priority: "low",
    status: "resolved",
    source: "Backup-System",
    timestamp: "2024-01-15T10:15:00Z",
    category: "النسخ الاحتياطية"
  },
  {
    id: "5",
    title: "محاولة دخول فاشلة",
    description: "محاولة دخول فاشلة من عنوان IP غير معروف",
    type: "warning",
    priority: "medium",
    status: "acknowledged",
    source: "Security-System",
    timestamp: "2024-01-15T10:10:00Z",
    assignedTo: "فاطمة أحمد",
    category: "الأمان"
  },
  {
    id: "6",
    title: "خطأ في قاعدة البيانات",
    description: "خطأ في الاتصال بقاعدة البيانات الرئيسية",
    type: "error",
    priority: "critical",
    status: "active",
    source: "Database-01",
    timestamp: "2024-01-15T10:05:00Z",
    category: "قاعدة البيانات"
  }
]

const getAlertTypeColor = (type: string) => {
  switch (type) {
    case 'info': return 'bg-blue-100 text-blue-800'
    case 'warning': return 'bg-yellow-100 text-yellow-800'
    case 'error': return 'bg-red-100 text-red-800'
    case 'success': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low': return 'bg-gray-100 text-gray-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'high': return 'bg-orange-100 text-orange-800'
    case 'critical': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-red-100 text-red-800'
    case 'acknowledged': return 'bg-yellow-100 text-yellow-800'
    case 'resolved': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'info': return <Info className="h-4 w-4" />
    case 'warning': return <AlertTriangle className="h-4 w-4" />
    case 'error': return <AlertTriangle className="h-4 w-4" />
    case 'success': return <CheckCircle className="h-4 w-4" />
    default: return <Bell className="h-4 w-4" />
  }
}

export default function AdminAlertsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || alert.type === selectedType
    const matchesPriority = selectedPriority === "all" || alert.priority === selectedPriority
    const matchesStatus = selectedStatus === "all" || alert.status === selectedStatus
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus
  })

  const activeAlerts = mockAlerts.filter(alert => alert.status === 'active')
  const criticalAlerts = mockAlerts.filter(alert => alert.priority === 'critical')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة التنبيهات</h1>
          <p className="text-sm text-muted-foreground">
            مراقبة وإدارة التنبيهات والإشعارات في النظام
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 ml-2" />
            إعدادات التنبيهات
          </Button>
          <Button className="btn-gold">
            <Bell className="h-4 w-4 ml-2" />
            إنشاء تنبيه جديد
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي التنبيهات</p>
                <p className="text-2xl font-bold">{mockAlerts.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">تنبيهات نشطة</p>
                <p className="text-2xl font-bold text-red-600">{activeAlerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">تنبيهات حرجة</p>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">تم حلها</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockAlerts.filter(a => a.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">جميع التنبيهات</TabsTrigger>
          <TabsTrigger value="active">نشطة</TabsTrigger>
          <TabsTrigger value="critical">حرجة</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث في التنبيهات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="info">معلومات</option>
                  <option value="warning">تحذير</option>
                  <option value="error">خطأ</option>
                  <option value="success">نجح</option>
                </select>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">جميع الأولويات</option>
                  <option value="low">منخفضة</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية</option>
                  <option value="critical">حرجة</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">نشطة</option>
                  <option value="acknowledged">معترف بها</option>
                  <option value="resolved">تم حلها</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getAlertTypeColor(alert.type).replace('text-', 'bg-').replace('800', '100')}`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{alert.title}</h3>
                          <Badge className={getAlertTypeColor(alert.type)}>
                            {alert.type === 'info' ? 'معلومات' :
                             alert.type === 'warning' ? 'تحذير' :
                             alert.type === 'error' ? 'خطأ' : 'نجح'}
                          </Badge>
                          <Badge className={getPriorityColor(alert.priority)}>
                            {alert.priority === 'low' ? 'منخفضة' :
                             alert.priority === 'medium' ? 'متوسطة' :
                             alert.priority === 'high' ? 'عالية' : 'حرجة'}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status === 'active' ? 'نشطة' :
                             alert.status === 'acknowledged' ? 'معترف بها' : 'تم حلها'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Server className="h-3 w-3" />
                            {alert.source}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(alert.timestamp).toLocaleString('ar-SA')}
                          </div>
                          {alert.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {alert.assignedTo}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <span className="sr-only">إجراءات</span>
                            <span>...</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <User className="h-4 w-4 ml-2" />
                            تعيين للمستخدم
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 ml-2" />
                            تم الحل
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <X className="h-4 w-4 ml-2" />
                            حذف التنبيه
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            عرض التنبيهات النشطة فقط
          </div>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            عرض التنبيهات الحرجة فقط
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات التنبيهات
              </CardTitle>
              <CardDescription>
                تخصيص إعدادات التنبيهات والإشعارات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                سيتم إضافة إعدادات التنبيهات المتقدمة قريباً
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 