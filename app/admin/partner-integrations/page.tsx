"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, Handshake, CheckCircle, XCircle, AlertTriangle, 
  Clock, RefreshCw, Settings, Eye, Download, Plus, Search,
  Globe, Activity, TrendingUp, TrendingDown, Users, DollarSign,
  Package, Truck, Ship, Plane, FileText
} from "lucide-react"

interface PartnerIntegration {
  id: string
  name: string
  type: 'shipping' | 'logistics' | 'supplier' | 'customer' | 'financial'
  country: string
  status: 'active' | 'inactive' | 'error' | 'pending'
  lastSync: string
  transactions: number
  revenue: number
  currency: string
  apiVersion: string
  connectionType: 'api' | 'file' | 'manual'
  partnershipLevel: 'gold' | 'silver' | 'bronze' | 'standard'
}

const partnerIntegrations: PartnerIntegration[] = [
  {
    id: "1",
    name: "شركة الشحن الصينية العالمية",
    type: "shipping",
    country: "الصين",
    status: "active",
    lastSync: "2024-01-15 14:30:25",
    transactions: 156,
    revenue: 450000,
    currency: "CNY",
    apiVersion: "v3.0",
    connectionType: "api",
    partnershipLevel: "gold"
  },
  {
    id: "2",
    name: "شركة النقل البحري الليبية",
    type: "logistics",
    country: "ليبيا",
    status: "active",
    lastSync: "2024-01-15 13:45:10",
    transactions: 89,
    revenue: 125000,
    currency: "LYD",
    apiVersion: "v2.1",
    connectionType: "api",
    partnershipLevel: "silver"
  },
  {
    id: "3",
    name: "مورد الأجهزة الإلكترونية",
    type: "supplier",
    country: "الصين",
    status: "active",
    lastSync: "2024-01-15 12:15:30",
    transactions: 234,
    revenue: 780000,
    currency: "CNY",
    apiVersion: "v2.5",
    connectionType: "api",
    partnershipLevel: "gold"
  },
  {
    id: "4",
    name: "شركة التخليص الجمركي المتحدة",
    type: "logistics",
    country: "ليبيا",
    status: "error",
    lastSync: "2024-01-15 11:20:15",
    transactions: 0,
    revenue: 0,
    currency: "LYD",
    apiVersion: "v1.8",
    connectionType: "file",
    partnershipLevel: "bronze"
  },
  {
    id: "5",
    name: "شركة النقل الجوي السريع",
    type: "shipping",
    country: "الإمارات",
    status: "pending",
    lastSync: "2024-01-15 10:30:45",
    transactions: 45,
    revenue: 89000,
    currency: "AED",
    apiVersion: "v2.9",
    connectionType: "api",
    partnershipLevel: "silver"
  },
  {
    id: "6",
          name: "شركة التمويل التجاري",
    type: "financial",
    country: "ليبيا",
    status: "active",
    lastSync: "2024-01-15 09:15:20",
    transactions: 67,
    revenue: 320000,
    currency: "LYD",
    apiVersion: "v2.3",
    connectionType: "api",
    partnershipLevel: "gold"
  }
]

const integrationStats = {
  totalPartners: 6,
  activeConnections: 4,
  totalTransactions: 591,
  totalRevenue: 1764000,
  avgPartnershipLevel: "silver",
  lastUpdate: "2024-01-15 14:30:25"
}

export default function PartnerIntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'shipping': return Ship
      case 'logistics': return Truck
      case 'supplier': return Package
      case 'customer': return Users
      case 'financial': return DollarSign
      default: return Building2
    }
  }

  const getPartnershipLevelColor = (level: string) => {
    switch (level) {
      case 'gold': return 'bg-yellow-100 text-yellow-800'
      case 'silver': return 'bg-gray-100 text-gray-800'
      case 'bronze': return 'bg-orange-100 text-orange-800'
      case 'standard': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredIntegrations = partnerIntegrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || integration.type === selectedType
    const matchesStatus = selectedStatus === "all" || integration.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تكاملات الشركات الشريكة</h1>
          <p className="text-gray-600">إدارة التكاملات مع الشركات الشريكة والموردين</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير البيانات
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            إضافة شريك جديد
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الشركاء</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationStats.totalPartners}</div>
            <p className="text-xs text-muted-foreground">+2 من الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التوصيلات النشطة</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationStats.activeConnections}</div>
            <p className="text-xs text-muted-foreground">من أصل {integrationStats.totalPartners}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المعاملات</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationStats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">+15% من الأمس</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(integrationStats.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">+8% من الأمس</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">التكاملات</TabsTrigger>
          <TabsTrigger value="transactions">المعاملات</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تكاملات الشركاء المتاحة</CardTitle>
              <CardDescription>إدارة جميع التكاملات مع الشركات الشريكة والموردين</CardDescription>
            </CardHeader>
            <CardContent>
              {/* فلاتر البحث */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="البحث في الشركاء..."
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
                  <option value="shipping">شحن</option>
                  <option value="logistics">لوجستيات</option>
                  <option value="supplier">مورد</option>
                  <option value="customer">عميل</option>
                  <option value="financial">مالي</option>
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
                  const TypeIcon = getTypeIcon(integration.type)
                  return (
                    <div key={integration.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <TypeIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">{integration.name}</h3>
                            <p className="text-sm text-gray-500">{integration.country} - {integration.type}</p>
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
                          <Badge variant="outline" className={getPartnershipLevelColor(integration.partnershipLevel)}>
                            {integration.partnershipLevel === 'gold' ? 'ذهبي' : 
                             integration.partnershipLevel === 'silver' ? 'فضي' : 
                             integration.partnershipLevel === 'bronze' ? 'برونزي' : 'قياسي'}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm text-gray-500">المعاملات</div>
                          <div className="text-lg font-bold">{integration.transactions}</div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm text-gray-500">الإيرادات</div>
                          <div className="text-lg font-bold">
                            {integration.revenue.toLocaleString()} {integration.currency}
                          </div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm text-gray-500">إصدار API</div>
                          <div className="text-lg font-bold">{integration.apiVersion}</div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm text-gray-500">نوع الاتصال</div>
                          <div className="text-lg font-bold">
                            {integration.connectionType === 'api' ? 'API' : 
                             integration.connectionType === 'file' ? 'ملف' : 'يدوي'}
                          </div>
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
                        <Button size="sm">إدارة الشراكة</Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>آخر المعاملات</CardTitle>
                <CardDescription>المعاملات الأخيرة مع الشركاء</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">شحنة بحرية</p>
                      <p className="text-sm text-gray-500">شركة الشحن الصينية العالمية</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+45,000 ¥</p>
                      <p className="text-sm text-gray-500">منذ ساعة</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">تخليص جمركي</p>
                      <p className="text-sm text-gray-500">شركة النقل البحري الليبية</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">-12,500 د.ل</p>
                      <p className="text-sm text-gray-500">منذ 3 ساعات</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">طلب مورد</p>
                      <p className="text-sm text-gray-500">مورد الأجهزة الإلكترونية</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">-78,000 ¥</p>
                      <p className="text-sm text-gray-500">منذ 5 ساعات</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الشراكة</CardTitle>
                <CardDescription>تحليل العلاقات مع الشركاء</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>إجمالي المعاملات</span>
                    <span className="font-medium">591</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>المعاملات الناجحة</span>
                    <span className="font-medium text-green-600">567 (96%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>المعاملات الفاشلة</span>
                    <span className="font-medium text-red-600">24 (4%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>متوسط قيمة المعاملة</span>
                    <span className="font-medium">2,985</span>
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
                <CardDescription>مقارنة أداء الشركاء حسب النوع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>شركاء الشحن</span>
                    <span className="font-medium text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>شركاء اللوجستيات</span>
                    <span className="font-medium text-green-600">88%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الموردون</span>
                    <span className="font-medium text-green-600">96%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الشركاء الماليون</span>
                    <span className="font-medium text-green-600">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزيع الشركاء</CardTitle>
                <CardDescription>توزيع الشركاء حسب البلدان</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>الصين</span>
                    <span className="font-medium">50%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ليبيا</span>
                    <span className="font-medium">33%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الإمارات</span>
                    <span className="font-medium">17%</span>
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