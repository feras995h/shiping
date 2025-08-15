"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, FileText, CheckCircle, XCircle, AlertTriangle, 
  Clock, RefreshCw, Settings, Eye, Download, Plus, Search,
  Globe, Building2, Activity, TrendingUp, TrendingDown,
  Package, Truck, Ship, Plane
} from "lucide-react"

interface CustomsIntegration {
  id: string
  name: string
  country: string
  port: string
  status: 'active' | 'inactive' | 'error' | 'pending'
  lastSync: string
  declarations: number
  clearanceRate: number
  avgProcessingTime: string
  apiVersion: string
  connectionType: 'api' | 'file' | 'manual'
}

const customsIntegrations: CustomsIntegration[] = [
  {
    id: "1",
    name: "جمارك طرابلس البحرية",
    country: "ليبيا",
    port: "ميناء طرابلس",
    status: "active",
    lastSync: "2024-01-15 14:30:25",
    declarations: 45,
    clearanceRate: 92,
    avgProcessingTime: "2.5 أيام",
    apiVersion: "v2.1",
    connectionType: "api"
  },
  {
    id: "2",
    name: "جمارك بنغازي",
    country: "ليبيا",
    port: "ميناء بنغازي",
    status: "active",
    lastSync: "2024-01-15 13:45:10",
    declarations: 32,
    clearanceRate: 88,
    avgProcessingTime: "3.2 أيام",
    apiVersion: "v2.0",
    connectionType: "api"
  },
  {
    id: "3",
    name: "جمارك مصراتة",
    country: "ليبيا",
    port: "ميناء مصراتة",
    status: "error",
    lastSync: "2024-01-15 12:15:30",
    declarations: 0,
    clearanceRate: 0,
    avgProcessingTime: "N/A",
    apiVersion: "v1.8",
    connectionType: "file"
  },
  {
    id: "4",
    name: "جمارك شنغهاي",
    country: "الصين",
    port: "ميناء شنغهاي",
    status: "active",
    lastSync: "2024-01-15 11:20:15",
    declarations: 78,
    clearanceRate: 95,
    avgProcessingTime: "1.8 أيام",
    apiVersion: "v3.0",
    connectionType: "api"
  },
  {
    id: "5",
    name: "جمارك قوانغتشو",
    country: "الصين",
    port: "ميناء قوانغتشو",
    status: "pending",
    lastSync: "2024-01-15 10:30:45",
    declarations: 56,
    clearanceRate: 90,
    avgProcessingTime: "2.1 أيام",
    apiVersion: "v2.9",
    connectionType: "api"
  }
]

const integrationStats = {
  totalPorts: 5,
  activeConnections: 3,
  totalDeclarations: 211,
  avgClearanceRate: 91,
  totalProcessingTime: "2.3 أيام",
  lastUpdate: "2024-01-15 14:30:25"
}

export default function CustomsIntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedCountry, setSelectedCountry] = useState<string>("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'inactive': return XCircle
      case 'error': return AlertTriangle
      case 'pending': return Clock
      default: return XCircle
    }
  }

  const getTransportIcon = (port: string) => {
    if (port.includes("بحر")) return Ship
    if (port.includes("جو")) return Plane
    if (port.includes("بر")) return Truck
    return Package
  }

  const filteredIntegrations = customsIntegrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.port.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || integration.status === selectedStatus
    const matchesCountry = selectedCountry === "all" || integration.country === selectedCountry
    
    return matchesSearch && matchesStatus && matchesCountry
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تكاملات الجمارك</h1>
          <p className="text-gray-600">إدارة التكاملات مع أنظمة الجمارك في الموانئ</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير البيانات
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            إضافة ميناء جديد
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الموانئ</CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationStats.totalPorts}</div>
            <p className="text-xs text-muted-foreground">+1 من الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التوصيلات النشطة</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationStats.activeConnections}</div>
            <p className="text-xs text-muted-foreground">من أصل {integrationStats.totalPorts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل التخليص</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationStats.avgClearanceRate}%</div>
            <p className="text-xs text-muted-foreground">متوسط عام</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإعلانات اليوم</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationStats.totalDeclarations}</div>
            <p className="text-xs text-muted-foreground">+8% من الأمس</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">التكاملات</TabsTrigger>
          <TabsTrigger value="declarations">الإعلانات الجمركية</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تكاملات الجمارك المتاحة</CardTitle>
              <CardDescription>إدارة جميع التكاملات مع أنظمة الجمارك في الموانئ</CardDescription>
            </CardHeader>
            <CardContent>
              {/* فلاتر البحث */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="البحث في الموانئ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع البلدان</option>
                  <option value="ليبيا">ليبيا</option>
                  <option value="الصين">الصين</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                  <option value="error">خطأ</option>
                  <option value="pending">قيد الانتظار</option>
                </select>
              </div>

              {/* قائمة التكاملات */}
              <div className="space-y-4">
                {filteredIntegrations.map((integration) => {
                  const StatusIcon = getStatusIcon(integration.status)
                  const TransportIcon = getTransportIcon(integration.port)
                  return (
                    <div key={integration.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <TransportIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">{integration.name}</h3>
                            <p className="text-sm text-gray-500">{integration.port} - {integration.country}</p>
                            <p className="text-sm text-gray-500">آخر مزامنة: {integration.lastSync}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getStatusColor(integration.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {integration.status === 'active' ? 'نشط' : 
                             integration.status === 'inactive' ? 'غير نشط' : 
                             integration.status === 'error' ? 'خطأ' : 'قيد الانتظار'}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm text-gray-500">الإعلانات</div>
                          <div className="text-lg font-bold">{integration.declarations}</div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm text-gray-500">معدل التخليص</div>
                          <div className="text-lg font-bold">{integration.clearanceRate}%</div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm text-gray-500">متوسط المعالجة</div>
                          <div className="text-lg font-bold">{integration.avgProcessingTime}</div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm text-gray-500">إصدار API</div>
                          <div className="text-lg font-bold">{integration.apiVersion}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            عرض التفاصيل
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            مزامنة
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-1" />
                            إعدادات
                          </Button>
                        </div>
                        <Button size="sm">إدارة التكامل</Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="declarations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>آخر الإعلانات الجمركية</CardTitle>
                <CardDescription>الإعلانات الجمركية الأخيرة من جميع الموانئ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">إعلان واردات</p>
                      <p className="text-sm text-gray-500">جمارك طرابلس البحرية</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">تم التخليص</p>
                      <p className="text-sm text-gray-500">منذ ساعة</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">إعلان صادرات</p>
                      <p className="text-sm text-gray-500">جمارك بنغازي</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-yellow-600">قيد المعالجة</p>
                      <p className="text-sm text-gray-500">منذ 3 ساعات</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">إعلان ترانزيت</p>
                      <p className="text-sm text-gray-500">جمارك شنغهاي</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">تم التخليص</p>
                      <p className="text-sm text-gray-500">منذ 5 ساعات</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الإعلانات</CardTitle>
                <CardDescription>تحليل الإعلانات الجمركية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>إجمالي الإعلانات</span>
                    <span className="font-medium">211</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الإعلانات المكتملة</span>
                    <span className="font-medium text-green-600">194 (92%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الإعلانات قيد المعالجة</span>
                    <span className="font-medium text-yellow-600">17 (8%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>متوسط وقت المعالجة</span>
                    <span className="font-medium">2.3 أيام</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>تحليل الأداء</CardTitle>
                <CardDescription>مقارنة أداء الموانئ المختلفة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>جمارك طرابلس</span>
                    <span className="font-medium text-green-600">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>جمارك بنغازي</span>
                    <span className="font-medium text-green-600">88%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>جمارك شنغهاي</span>
                    <span className="font-medium text-green-600">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>جمارك قوانغتشو</span>
                    <span className="font-medium text-yellow-600">90%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزيع الإعلانات</CardTitle>
                <CardDescription>توزيع الإعلانات حسب البلدان</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>ليبيا</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الصين</span>
                    <span className="font-medium">55%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 