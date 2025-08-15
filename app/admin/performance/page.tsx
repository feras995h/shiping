"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Activity, TrendingUp, TrendingDown, Clock, Users, Server, 
  Database, Globe, Shield, AlertTriangle, CheckCircle, Zap,
  BarChart3, PieChart, Target, Gauge, Cpu, HardDrive, Wifi
} from "lucide-react"

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  change: number
  status: 'good' | 'warning' | 'critical'
  icon: any
}

interface SystemPerformance {
  cpu: number
  memory: number
  disk: number
  network: number
  database: number
  uptime: string
}

const performanceMetrics: PerformanceMetric[] = [
  { name: "استجابة الخادم", value: 45, unit: "ms", change: -12, status: 'good', icon: Server },
  { name: "معدل الطلبات", value: 1250, unit: "req/min", change: 8, status: 'good', icon: Activity },
  { name: "استخدام الذاكرة", value: 68, unit: "%", change: 5, status: 'warning', icon: Database },
  { name: "استخدام المعالج", value: 45, unit: "%", change: -3, status: 'good', icon: Cpu },
  { name: "مساحة التخزين", value: 72, unit: "%", change: 2, status: 'warning', icon: HardDrive },
  { name: "سرعة الشبكة", value: 95, unit: "Mbps", change: 15, status: 'good', icon: Wifi },
]

const systemPerformance: SystemPerformance = {
  cpu: 45,
  memory: 68,
  disk: 72,
  network: 85,
  database: 92,
  uptime: "15 يوم، 8 ساعات، 32 دقيقة"
}

const recentAlerts = [
  { id: 1, type: 'warning', message: 'ارتفاع في استخدام الذاكرة', time: 'منذ 5 دقائق', icon: AlertTriangle },
  { id: 2, type: 'info', message: 'تم تحديث قاعدة البيانات', time: 'منذ 15 دقيقة', icon: CheckCircle },
  { id: 3, type: 'success', message: 'تحسن في أداء الشبكة', time: 'منذ 30 دقيقة', icon: TrendingUp },
]

export default function PerformancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('24h')

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة الأداء</h1>
          <p className="text-gray-600">مراقبة أداء النظام والمؤشرات الرئيسية</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">تصدير التقرير</Button>
          <Button size="sm">تحديث البيانات</Button>
        </div>
      </div>

      {/* ملخص سريع */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">وقت التشغيل</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemPerformance.uptime}</div>
            <p className="text-xs text-muted-foreground">متواصل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12% من الأمس</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلبات/الدقيقة</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">+8% من الأمس</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل النجاح</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.8%</div>
            <p className="text-xs text-muted-foreground">+0.2% من الأمس</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="system">أداء النظام</TabsTrigger>
          <TabsTrigger value="alerts">التنبيهات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* مؤشرات الأداء */}
            <Card>
              <CardHeader>
                <CardTitle>مؤشرات الأداء الرئيسية</CardTitle>
                <CardDescription>أحدث قياسات أداء النظام</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getStatusBgColor(metric.status)}`}>
                        <metric.icon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
                      </div>
                      <div>
                        <p className="font-medium">{metric.name}</p>
                        <p className="text-sm text-gray-500">{metric.value} {metric.unit}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={metric.change >= 0 ? 'default' : 'secondary'}>
                        {metric.change >= 0 ? '+' : ''}{metric.change}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* استخدام الموارد */}
            <Card>
              <CardHeader>
                <CardTitle>استخدام الموارد</CardTitle>
                <CardDescription>معدل استخدام موارد النظام</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>المعالج (CPU)</span>
                    <span>{systemPerformance.cpu}%</span>
                  </div>
                  <Progress value={systemPerformance.cpu} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>الذاكرة (RAM)</span>
                    <span>{systemPerformance.memory}%</span>
                  </div>
                  <Progress value={systemPerformance.memory} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>التخزين (Disk)</span>
                    <span>{systemPerformance.disk}%</span>
                  </div>
                  <Progress value={systemPerformance.disk} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>الشبكة (Network)</span>
                    <span>{systemPerformance.network}%</span>
                  </div>
                  <Progress value={systemPerformance.network} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>قاعدة البيانات</span>
                    <span>{systemPerformance.database}%</span>
                  </div>
                  <Progress value={systemPerformance.database} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل أداء النظام</CardTitle>
              <CardDescription>معلومات مفصلة عن أداء مكونات النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Server className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">الخادم الرئيسي</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">ممتاز</p>
                  <p className="text-sm text-gray-500">استجابة سريعة ومستقرة</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">قاعدة البيانات</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">جيد</p>
                  <p className="text-sm text-gray-500">أداء مستقر مع تحسينات</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium">الشبكة</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">ممتاز</p>
                  <p className="text-sm text-gray-500">سرعة عالية واستقرار</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>التنبيهات الأخيرة</CardTitle>
              <CardDescription>آخر التنبيهات والإشعارات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className={`p-2 rounded-full ${
                      alert.type === 'warning' ? 'bg-yellow-100' :
                      alert.type === 'info' ? 'bg-blue-100' :
                      'bg-green-100'
                    }`}>
                      <alert.icon className={`h-4 w-4 ${
                        alert.type === 'warning' ? 'text-yellow-600' :
                        alert.type === 'info' ? 'text-blue-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-gray-500">{alert.time}</p>
                    </div>
                    <Button variant="outline" size="sm">عرض التفاصيل</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 