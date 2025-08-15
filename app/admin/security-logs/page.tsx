"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Search, Filter,
  User, Lock, Unlock, Eye, EyeOff, Download, Trash2, RefreshCw,
  Clock, MapPin, Monitor, Database, Server, Globe, Settings
} from "lucide-react"

interface SecurityLog {
  id: string
  timestamp: string
  type: 'login' | 'logout' | 'failed_login' | 'permission_denied' | 'data_access' | 'system_change'
  severity: 'low' | 'medium' | 'high' | 'critical'
  user: string
  ip: string
  location: string
  action: string
  details: string
  status: 'success' | 'warning' | 'error'
}

const securityLogs: SecurityLog[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:30:25",
    type: "login",
    severity: "low",
    user: "admin@company.com",
    ip: "192.168.1.100",
    location: "طرابلس، ليبيا",
    action: "تسجيل دخول ناجح",
    details: "تم تسجيل الدخول من متصفح Chrome على نظام Windows",
    status: "success"
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:25:10",
    type: "failed_login",
    severity: "medium",
    user: "unknown@company.com",
    ip: "203.45.67.89",
    location: "بكين، الصين",
    action: "محاولة تسجيل دخول فاشلة",
    details: "كلمة مرور خاطئة - 3 محاولات متتالية",
    status: "warning"
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:20:15",
    type: "data_access",
    severity: "medium",
    user: "finance@company.com",
    ip: "192.168.1.105",
    location: "طرابلس، ليبيا",
    action: "وصول إلى بيانات مالية",
    details: "تم الوصول إلى تقرير الميزانية السنوية",
    status: "success"
  },
  {
    id: "4",
    timestamp: "2024-01-15 14:15:30",
    type: "permission_denied",
    severity: "high",
    user: "employee@company.com",
    ip: "192.168.1.110",
    location: "طرابلس، ليبيا",
    action: "رفض صلاحية",
    details: "محاولة الوصول إلى إعدادات النظام بدون صلاحية",
    status: "error"
  },
  {
    id: "5",
    timestamp: "2024-01-15 14:10:45",
    type: "system_change",
    severity: "critical",
    user: "admin@company.com",
    ip: "192.168.1.100",
    location: "طرابلس، ليبيا",
    action: "تغيير إعدادات الأمان",
    details: "تم تعديل سياسة كلمات المرور",
    status: "success"
  },
  {
    id: "6",
    timestamp: "2024-01-15 14:05:20",
    type: "logout",
    severity: "low",
    user: "user@company.com",
    ip: "192.168.1.115",
    location: "طرابلس، ليبيا",
    action: "تسجيل خروج",
    details: "تسجيل خروج طوعي من النظام",
    status: "success"
  }
]

const securityStats = {
  totalLogs: 1247,
  todayLogs: 45,
  failedLogins: 12,
  suspiciousActivities: 3,
  criticalAlerts: 1
}

export default function SecurityLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'login': return User
      case 'logout': return User
      case 'failed_login': return Lock
      case 'permission_denied': return XCircle
      case 'data_access': return Eye
      case 'system_change': return Settings
      default: return Shield
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const filteredLogs = securityLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ip.includes(searchTerm)
    const matchesSeverity = selectedSeverity === "all" || log.severity === selectedSeverity
    const matchesType = selectedType === "all" || log.type === selectedType
    
    return matchesSearch && matchesSeverity && matchesType
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">سجلات الأمان</h1>
          <p className="text-gray-600">مراقبة وإدارة أحداث الأمان في النظام</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير السجلات
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي السجلات</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStats.totalLogs}</div>
            <p className="text-xs text-muted-foreground">+12% من الأمس</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">سجلات اليوم</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStats.todayLogs}</div>
            <p className="text-xs text-muted-foreground">آخر 24 ساعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تسجيلات فاشلة</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{securityStats.failedLogins}</div>
            <p className="text-xs text-muted-foreground">اليوم</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أنشطة مشبوهة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{securityStats.suspiciousActivities}</div>
            <p className="text-xs text-muted-foreground">تحتاج مراجعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تنبيهات حرجة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{securityStats.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">تتطلب تدخل فوري</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">سجلات الأمان</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          <TabsTrigger value="settings">إعدادات المراقبة</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سجلات الأمان التفصيلية</CardTitle>
              <CardDescription>جميع أحداث الأمان المسجلة في النظام</CardDescription>
            </CardHeader>
            <CardContent>
              {/* فلاتر البحث */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع المستويات</option>
                  <option value="low">منخفض</option>
                  <option value="medium">متوسط</option>
                  <option value="high">عالي</option>
                  <option value="critical">حرج</option>
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="login">تسجيل دخول</option>
                  <option value="logout">تسجيل خروج</option>
                  <option value="failed_login">تسجيل دخول فاشل</option>
                  <option value="permission_denied">رفض صلاحية</option>
                  <option value="data_access">وصول للبيانات</option>
                  <option value="system_change">تغيير النظام</option>
                </select>
              </div>

              {/* جدول السجلات */}
              <div className="space-y-3">
                {filteredLogs.map((log) => {
                  const TypeIcon = getTypeIcon(log.type)
                  return (
                    <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${getSeverityColor(log.severity)}`}>
                            <TypeIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium">{log.action}</h3>
                              <Badge variant="outline" className={getSeverityColor(log.severity)}>
                                {log.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {log.user}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {log.ip}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {log.timestamp}
                              </span>
                              <span className="flex items-center">
                                <Monitor className="h-3 w-3 mr-1" />
                                {log.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getStatusColor(log.status)}`}>
                            {log.status === 'success' ? 'نجح' : 
                             log.status === 'warning' ? 'تحذير' : 'خطأ'}
                          </span>
                          <Button variant="outline" size="sm">تفاصيل</Button>
                        </div>
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
                <CardTitle>تحليل الأحداث</CardTitle>
                <CardDescription>إحصائيات أحداث الأمان حسب النوع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>تسجيلات دخول ناجحة</span>
                    <span className="font-medium text-green-600">89%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>محاولات فاشلة</span>
                    <span className="font-medium text-red-600">8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>أنشطة مشبوهة</span>
                    <span className="font-medium text-yellow-600">3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المواقع الجغرافية</CardTitle>
                <CardDescription>توزيع محاولات الوصول حسب الموقع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>طرابلس، ليبيا</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>بكين، الصين</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>مواقع أخرى</span>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات مراقبة الأمان</CardTitle>
              <CardDescription>تكوين قواعد المراقبة والتنبيهات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">مراقبة تسجيلات الدخول الفاشلة</h3>
                    <p className="text-sm text-gray-500">تنبيه عند تجاوز عدد محاولات الدخول الفاشلة</p>
                  </div>
                  <Button variant="outline" size="sm">تعديل</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">مراقبة الوصول للبيانات الحساسة</h3>
                    <p className="text-sm text-gray-500">تسجيل جميع محاولات الوصول للبيانات المالية</p>
                  </div>
                  <Button variant="outline" size="sm">تعديل</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">مراقبة التغييرات في النظام</h3>
                    <p className="text-sm text-gray-500">تسجيل جميع التغييرات في إعدادات النظام</p>
                  </div>
                  <Button variant="outline" size="sm">تعديل</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 