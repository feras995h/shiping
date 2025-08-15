"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, TrendingUp, TrendingDown, Activity, Users, 
  Globe, DollarSign, Shield, Clock, Calendar, Target,
  PieChart, LineChart, BarChart, AreaChart, Download,
  Filter, Eye, FileText, CheckCircle, XCircle, AlertTriangle
} from "lucide-react"

interface AnalyticsData {
  period: string
  users: number
  sessions: number
  revenue: number
  shipments: number
  security: number
}

const analyticsData: AnalyticsData[] = [
  { period: "يناير", users: 45, sessions: 1200, revenue: 125000, shipments: 89, security: 98 },
  { period: "فبراير", users: 52, sessions: 1350, revenue: 138000, shipments: 95, security: 97 },
  { period: "مارس", users: 48, sessions: 1280, revenue: 132000, shipments: 92, security: 99 },
  { period: "أبريل", users: 55, sessions: 1420, revenue: 145000, shipments: 98, security: 96 },
  { period: "مايو", users: 58, sessions: 1500, revenue: 152000, shipments: 105, security: 98 },
  { period: "يونيو", users: 62, sessions: 1580, revenue: 158000, shipments: 112, security: 97 }
]

const userMetrics = {
  totalUsers: 1250,
  activeUsers: 847,
  newUsers: 45,
  returningUsers: 802,
  avgSessionDuration: "12:34",
  bounceRate: 23
}

const systemMetrics = {
  uptime: 99.8,
  responseTime: 245,
  throughput: 1250,
  errorRate: 0.2,
  cpuUsage: 68,
  memoryUsage: 72
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6m')

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? TrendingUp : TrendingDown
  }

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">التحليلات</h1>
          <p className="text-gray-600">تحليل شامل لبيانات النظام والأداء</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير البيانات
          </Button>
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            تحديث البيانات
          </Button>
        </div>
      </div>

      {/* مؤشرات الأداء الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userMetrics.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +12% من الشهر الماضي
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userMetrics.activeUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +8% من الأمس
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(158000).toLocaleString()} د.ل</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +15% من الشهر الماضي
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الشحنات المكتملة</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">112</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +7% من الأسبوع الماضي
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="users">تحليل المستخدمين</TabsTrigger>
          <TabsTrigger value="system">أداء النظام</TabsTrigger>
          <TabsTrigger value="reports">التقارير التفصيلية</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* رسم بياني للمؤشرات الرئيسية */}
            <Card>
              <CardHeader>
                <CardTitle>المؤشرات الرئيسية</CardTitle>
                <CardDescription>تطور المؤشرات الرئيسية خلال 6 أشهر</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.slice(-6).map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{data.period}</span>
                        <span className="font-medium">{data.users} مستخدم</span>
                      </div>
                      <Progress value={(data.users / 70) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* تحليل الإيرادات */}
            <Card>
              <CardHeader>
                <CardTitle>تحليل الإيرادات</CardTitle>
                <CardDescription>تطور الإيرادات والربحية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>إجمالي الإيرادات</span>
                    <span className="font-medium text-green-600">+18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>صافي الربح</span>
                    <span className="font-medium text-green-600">+22%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>معدل النمو</span>
                    <span className="font-medium text-green-600">+15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>تكلفة العمليات</span>
                    <span className="font-medium text-yellow-600">+8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* إحصائيات المستخدمين */}
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات المستخدمين</CardTitle>
                <CardDescription>تحليل سلوك المستخدمين والتفاعل</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>المستخدمون الجدد</span>
                    <span className="font-medium">{userMetrics.newUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>المستخدمون العائدون</span>
                    <span className="font-medium">{userMetrics.returningUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>متوسط مدة الجلسة</span>
                    <span className="font-medium">{userMetrics.avgSessionDuration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>معدل الارتداد</span>
                    <span className="font-medium">{userMetrics.bounceRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* تحليل النشاط */}
            <Card>
              <CardHeader>
                <CardTitle>تحليل النشاط</CardTitle>
                <CardDescription>أنماط استخدام النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>استخدام النظام</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>تفاعل المستخدمين</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>رضا المستخدمين</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* أداء النظام */}
            <Card>
              <CardHeader>
                <CardTitle>أداء النظام</CardTitle>
                <CardDescription>مؤشرات أداء النظام والموارد</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>وقت التشغيل</span>
                      <span>{systemMetrics.uptime}%</span>
                    </div>
                    <Progress value={systemMetrics.uptime} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>وقت الاستجابة</span>
                      <span>{systemMetrics.responseTime}ms</span>
                    </div>
                    <Progress value={100 - (systemMetrics.responseTime / 500) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>معدل الأخطاء</span>
                      <span>{systemMetrics.errorRate}%</span>
                    </div>
                    <Progress value={100 - systemMetrics.errorRate} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* استخدام الموارد */}
            <Card>
              <CardHeader>
                <CardTitle>استخدام الموارد</CardTitle>
                <CardDescription>معدل استخدام موارد النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>استخدام المعالج</span>
                      <span>{systemMetrics.cpuUsage}%</span>
                    </div>
                    <Progress value={systemMetrics.cpuUsage} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>استخدام الذاكرة</span>
                      <span>{systemMetrics.memoryUsage}%</span>
                    </div>
                    <Progress value={systemMetrics.memoryUsage} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>معدل الإنتاجية</span>
                      <span>{systemMetrics.throughput} req/min</span>
                    </div>
                    <Progress value={(systemMetrics.throughput / 2000) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>التقارير التفصيلية</CardTitle>
              <CardDescription>إنشاء وتخصيص تقارير التحليل</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">تقرير المستخدمين</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">تحليل سلوك المستخدمين والتفاعل</p>
                  <Button size="sm" className="w-full">إنشاء التقرير</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">تقرير الأداء</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">تحليل أداء النظام والموارد</p>
                  <Button size="sm" className="w-full">إنشاء التقرير</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium">التقرير المالي</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">تحليل الإيرادات والربحية</p>
                  <Button size="sm" className="w-full">إنشاء التقرير</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="h-5 w-5 text-orange-600" />
                    <h3 className="font-medium">تقرير الشحن</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">تحليل أداء الشحن والتوصيل</p>
                  <Button size="sm" className="w-full">إنشاء التقرير</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    <h3 className="font-medium">تقرير الأمان</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">تحليل الأمان والتهديدات</p>
                  <Button size="sm" className="w-full">إنشاء التقرير</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="h-5 w-5 text-teal-600" />
                    <h3 className="font-medium">تقرير النشاط</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">تحليل النشاط العام للنظام</p>
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