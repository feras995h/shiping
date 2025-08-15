"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Cloud, Database, Server, Shield, CheckCircle, XCircle, 
  AlertTriangle, Clock, RefreshCw, Settings, Eye, Download,
  Plus, Search, Activity, TrendingUp, TrendingDown, Users,
  HardDrive, Cpu, Wifi, Zap, Globe, FileText, DollarSign
} from "lucide-react"

interface CloudService {
  id: string
  name: string
  type: 'storage' | 'compute' | 'database' | 'network' | 'security' | 'analytics'
  provider: string
  status: 'active' | 'inactive' | 'error' | 'maintenance'
  lastSync: string
  usage: number
  limit: number
  unit: string
  cost: number
  currency: string
  region: string
  apiVersion: string
}

const cloudServices: CloudService[] = [
  {
    id: "1",
    name: "Amazon S3 Storage",
    type: "storage",
    provider: "AWS",
    status: "active",
    lastSync: "2024-01-15 14:30:25",
    usage: 850,
    limit: 1000,
    unit: "GB",
    cost: 25.50,
    currency: "USD",
    region: "eu-west-1",
    apiVersion: "v2.0"
  },
  {
    id: "2",
    name: "Google Cloud Compute",
    type: "compute",
    provider: "Google Cloud",
    status: "active",
    lastSync: "2024-01-15 13:45:10",
    usage: 68,
    limit: 100,
    unit: "%",
    cost: 180.75,
    currency: "USD",
    region: "europe-west1",
    apiVersion: "v1.0"
  },
  {
    id: "3",
    name: "Azure Database",
    type: "database",
    provider: "Microsoft Azure",
    status: "active",
    lastSync: "2024-01-15 12:15:30",
    usage: 45,
    limit: 100,
    unit: "%",
    cost: 95.20,
    currency: "USD",
    region: "westeurope",
    apiVersion: "v3.0"
  },
  {
    id: "4",
    name: "CloudFlare CDN",
    type: "network",
    provider: "CloudFlare",
    status: "maintenance",
    lastSync: "2024-01-15 11:20:15",
    usage: 0,
    limit: 100,
    unit: "%",
    cost: 15.00,
    currency: "USD",
    region: "global",
    apiVersion: "v4.0"
  },
  {
    id: "5",
    name: "AWS Lambda",
    type: "compute",
    provider: "AWS",
    status: "active",
    lastSync: "2024-01-15 10:30:45",
    usage: 1250000,
    limit: 2000000,
    unit: "requests",
    cost: 45.80,
    currency: "USD",
    region: "eu-west-1",
    apiVersion: "v1.0"
  },
  {
    id: "6",
    name: "Google Analytics",
    type: "analytics",
    provider: "Google",
    status: "active",
    lastSync: "2024-01-15 09:15:20",
    usage: 1000000,
    limit: 1000000,
    unit: "events",
    cost: 0,
    currency: "USD",
    region: "global",
    apiVersion: "v4.0"
  }
]

const cloudStats = {
  totalServices: 6,
  activeServices: 5,
  totalCost: 361.25,
  totalUsage: 72,
  avgUptime: 99.8,
  lastUpdate: "2024-01-15 14:30:25"
}

export default function CloudServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'inactive': return XCircle
      case 'error': return AlertTriangle
      case 'maintenance': return Clock
      default: return XCircle
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'storage': return HardDrive
      case 'compute': return Cpu
      case 'database': return Database
      case 'network': return Wifi
      case 'security': return Shield
      case 'analytics': return TrendingUp
      default: return Cloud
    }
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'AWS': return 'bg-orange-100 text-orange-800'
      case 'Google Cloud': return 'bg-blue-100 text-blue-800'
      case 'Microsoft Azure': return 'bg-purple-100 text-purple-800'
      case 'CloudFlare': return 'bg-yellow-100 text-yellow-800'
      case 'Google': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredServices = cloudServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || service.type === selectedType
    const matchesStatus = selectedStatus === "all" || service.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الخدمات السحابية</h1>
          <p className="text-gray-600">إدارة الخدمات السحابية والموارد</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير البيانات
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            إضافة خدمة جديدة
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الخدمات</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cloudStats.totalServices}</div>
            <p className="text-xs text-muted-foreground">+1 من الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الخدمات النشطة</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cloudStats.activeServices}</div>
            <p className="text-xs text-muted-foreground">من أصل {cloudStats.totalServices}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التكلفة الشهرية</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${cloudStats.totalCost}</div>
            <p className="text-xs text-muted-foreground">+5% من الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط وقت التشغيل</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cloudStats.avgUptime}%</div>
            <p className="text-xs text-muted-foreground">+0.2% من الأمس</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">الخدمات</TabsTrigger>
          <TabsTrigger value="monitoring">المراقبة</TabsTrigger>
          <TabsTrigger value="costs">التكاليف</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الخدمات السحابية المتاحة</CardTitle>
              <CardDescription>إدارة جميع الخدمات السحابية والموارد</CardDescription>
            </CardHeader>
            <CardContent>
              {/* فلاتر البحث */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="البحث في الخدمات..."
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
                  <option value="storage">تخزين</option>
                  <option value="compute">حوسبة</option>
                  <option value="database">قاعدة بيانات</option>
                  <option value="network">شبكة</option>
                  <option value="security">أمان</option>
                  <option value="analytics">تحليلات</option>
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
                  <option value="maintenance">صيانة</option>
                </select>
              </div>

              {/* قائمة الخدمات */}
              <div className="space-y-4">
                {filteredServices.map((service) => {
                  const StatusIcon = getStatusIcon(service.status)
                  const TypeIcon = getTypeIcon(service.type)
                  const usagePercentage = (service.usage / service.limit) * 100
                  return (
                    <div key={service.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <TypeIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">{service.name}</h3>
                            <p className="text-sm text-gray-500">{service.provider} - {service.region}</p>
                            <p className="text-sm text-gray-500">آخر مزامنة: {service.lastSync}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getStatusColor(service.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {service.status === 'active' ? 'نشط' : 
                             service.status === 'inactive' ? 'غير نشط' : 
                             service.status === 'error' ? 'خطأ' : 'صيانة'}
                          </Badge>
                          <Badge variant="outline" className={getProviderColor(service.provider)}>
                            {service.provider}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm text-gray-500">الاستخدام</div>
                          <div className="text-lg font-bold">
                            {service.usage.toLocaleString()} / {service.limit.toLocaleString()} {service.unit}
                          </div>
                          <Progress value={usagePercentage} className="mt-2" />
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm text-gray-500">التكلفة الشهرية</div>
                          <div className="text-lg font-bold">
                            ${service.cost} {service.currency}
                          </div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm text-gray-500">المنطقة</div>
                          <div className="text-lg font-bold">{service.region}</div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm text-gray-500">إصدار API</div>
                          <div className="text-lg font-bold">{service.apiVersion}</div>
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
                        <Button size="sm">إدارة الخدمة</Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>مراقبة الأداء</CardTitle>
                <CardDescription>مؤشرات أداء الخدمات السحابية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>استخدام المعالج</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>استخدام الذاكرة</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>استخدام التخزين</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>عرض النطاق الترددي</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>حالة الخدمات</CardTitle>
                <CardDescription>حالة جميع الخدمات السحابية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>الخدمات النشطة</span>
                    <span className="font-medium text-green-600">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الخدمات في الصيانة</span>
                    <span className="font-medium text-yellow-600">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الخدمات المتوقفة</span>
                    <span className="font-medium text-red-600">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>متوسط وقت الاستجابة</span>
                    <span className="font-medium">245ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>تحليل التكاليف</CardTitle>
                <CardDescription>توزيع التكاليف حسب نوع الخدمة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>خدمات الحوسبة</span>
                    <span className="font-medium">$226.55 (63%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>خدمات التخزين</span>
                    <span className="font-medium">$25.50 (7%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>قواعد البيانات</span>
                    <span className="font-medium">$95.20 (26%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>خدمات الشبكة</span>
                    <span className="font-medium">$15.00 (4%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>التوقعات المالية</CardTitle>
                <CardDescription>توقعات التكاليف للشهر القادم</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>التكلفة الحالية</span>
                    <span className="font-medium">$361.25</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>التكلفة المتوقعة</span>
                    <span className="font-medium text-green-600">$385.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>نسبة الزيادة</span>
                    <span className="font-medium text-yellow-600">+6.6%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الميزانية المخصصة</span>
                    <span className="font-medium">$500.00</span>
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