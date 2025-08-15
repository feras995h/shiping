"use client"

import { useState } from "react"
import { BarChart3, Download, Calendar, TrendingUp, FileText, DollarSign, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import Layout from "@/components/layout"

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedReport, setSelectedReport] = useState("financial")

  const financialData = {
    revenue: "$2,847,500",
    expenses: "$1,892,300",
    profit: "$955,200",
    profitMargin: "33.5%",
  }

  const topClients = [
    { name: "شركة التجارة الليبية", revenue: "$485,200", shipments: 23, growth: "+15.2%" },
    { name: "مؤسسة الاستيراد الحديثة", revenue: "$398,500", shipments: 18, growth: "+8.7%" },
    { name: "التجارة الدولية المحدودة", revenue: "$342,800", shipments: 15, growth: "+12.3%" },
    { name: "شركة النقل السريع", revenue: "$289,600", shipments: 12, growth: "+5.9%" },
    { name: "شركة الاستيراد الذهبي", revenue: "$256,400", shipments: 11, growth: "+18.4%" },
  ]

  const routePerformance = [
    { route: "شنغهاي - طرابلس", shipments: 45, revenue: "$892,500", avgTime: "18 يوم", efficiency: 92 },
    { route: "قوانغتشو - بنغازي", shipments: 38, revenue: "$745,200", avgTime: "20 يوم", efficiency: 88 },
    { route: "شنتشن - مصراتة", shipments: 32, revenue: "$634,800", avgTime: "19 يوم", efficiency: 90 },
    { route: "بكين - طرابلس", shipments: 28, revenue: "$567,400", avgTime: "22 يوم", efficiency: 85 },
    { route: "تيانجين - بنغازي", shipments: 25, revenue: "$498,600", avgTime: "21 يوم", efficiency: 87 },
  ]

  const monthlyTrends = [
    { month: "يناير", revenue: 2847500, expenses: 1892300, shipments: 156 },
    { month: "ديسمبر", revenue: 2654200, expenses: 1756800, shipments: 142 },
    { month: "نوفمبر", revenue: 2398500, expenses: 1634500, shipments: 138 },
    { month: "أكتوبر", revenue: 2156800, expenses: 1523400, shipments: 129 },
    { month: "سبتمبر", revenue: 2034600, expenses: 1456200, shipments: 124 },
    { month: "أغسطس", revenue: 1987400, expenses: 1398700, shipments: 118 },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">التقارير والتحليلات</h1>
            <p className="text-muted-foreground">تحليل شامل للأداء المالي والتشغيلي</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">أسبوعي</SelectItem>
                <SelectItem value="month">شهري</SelectItem>
                <SelectItem value="quarter">ربع سنوي</SelectItem>
                <SelectItem value="year">سنوي</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="h-4 w-4 ml-2" />
              تصدير التقرير
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{financialData.revenue}</div>
              <p className="text-xs text-muted-foreground">+12.5% من الفترة السابقة</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المصروفات</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{financialData.expenses}</div>
              <p className="text-xs text-muted-foreground">+8.3% من الفترة السابقة</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">صافي الربح</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{financialData.profit}</div>
              <p className="text-xs text-muted-foreground">هامش ربح {financialData.profitMargin}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">عدد الشحنات</CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+23.1% من الفترة السابقة</p>
            </CardContent>
          </Card>
        </div>

        {/* Report Tabs */}
        <Tabs value={selectedReport} onValueChange={setSelectedReport} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="financial">التقرير المالي</TabsTrigger>
            <TabsTrigger value="clients">تحليل العملاء</TabsTrigger>
            <TabsTrigger value="routes">أداء الطرق</TabsTrigger>
            <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>التحليل المالي التفصيلي</CardTitle>
                <CardDescription>نظرة شاملة على الأداء المالي للشركة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">توزيع الإيرادات</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>رسوم الشحن</span>
                        <span className="font-medium">$1,985,250 (69.7%)</span>
                      </div>
                      <Progress value={69.7} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span>رسوم التأمين</span>
                        <span className="font-medium">$426,125 (15.0%)</span>
                      </div>
                      <Progress value={15.0} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span>رسوم التخليص</span>
                        <span className="font-medium">$284,750 (10.0%)</span>
                      </div>
                      <Progress value={10.0} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span>خدمات إضافية</span>
                        <span className="font-medium">$151,375 (5.3%)</span>
                      </div>
                      <Progress value={5.3} className="h-2" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">توزيع المصروفات</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>تكاليف الشحن</span>
                        <span className="font-medium">$1,135,380 (60.0%)</span>
                      </div>
                      <Progress value={60.0} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span>الرسوم الجمركية</span>
                        <span className="font-medium">$378,460 (20.0%)</span>
                      </div>
                      <Progress value={20.0} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span>مصروفات تشغيلية</span>
                        <span className="font-medium">$283,845 (15.0%)</span>
                      </div>
                      <Progress value={15.0} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span>مصروفات إدارية</span>
                        <span className="font-medium">$94,615 (5.0%)</span>
                      </div>
                      <Progress value={5.0} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>تحليل أداء العملاء</CardTitle>
                <CardDescription>أهم العملاء وإيراداتهم</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العميل</TableHead>
                      <TableHead>الإيرادات</TableHead>
                      <TableHead>عدد الشحنات</TableHead>
                      <TableHead>النمو</TableHead>
                      <TableHead>الحصة السوقية</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topClients.map((client, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell className="font-medium text-green-600">{client.revenue}</TableCell>
                        <TableCell>{client.shipments}</TableCell>
                        <TableCell className="text-green-600">{client.growth}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={
                                (Number.parseFloat(client.revenue.replace("$", "").replace(",", "")) / 2847500) * 100
                              }
                              className="h-2 flex-1"
                            />
                            <span className="text-sm text-muted-foreground">
                              {(
                                (Number.parseFloat(client.revenue.replace("$", "").replace(",", "")) / 2847500) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>تحليل أداء الطرق</CardTitle>
                <CardDescription>كفاءة وربحية طرق الشحن المختلفة</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الطريق</TableHead>
                      <TableHead>عدد الشحنات</TableHead>
                      <TableHead>الإيرادات</TableHead>
                      <TableHead>متوسط الوقت</TableHead>
                      <TableHead>الكفاءة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routePerformance.map((route, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{route.route}</TableCell>
                        <TableCell>{route.shipments}</TableCell>
                        <TableCell className="font-medium text-green-600">{route.revenue}</TableCell>
                        <TableCell>{route.avgTime}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={route.efficiency} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{route.efficiency}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>اتجاهات الأداء الشهري</CardTitle>
                <CardDescription>تطور الإيرادات والمصروفات عبر الأشهر</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الشهر</TableHead>
                      <TableHead>الإيرادات</TableHead>
                      <TableHead>المصروفات</TableHead>
                      <TableHead>صافي الربح</TableHead>
                      <TableHead>عدد الشحنات</TableHead>
                      <TableHead>متوسط قيمة الشحنة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyTrends.map((trend, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{trend.month}</TableCell>
                        <TableCell className="text-green-600">${trend.revenue.toLocaleString()}</TableCell>
                        <TableCell className="text-red-600">${trend.expenses.toLocaleString()}</TableCell>
                        <TableCell className="font-medium text-blue-600">
                          ${(trend.revenue - trend.expenses).toLocaleString()}
                        </TableCell>
                        <TableCell>{trend.shipments}</TableCell>
                        <TableCell>${Math.round(trend.revenue / trend.shipments).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Report Generation */}
        <Card>
          <CardHeader>
            <CardTitle>إنشاء تقارير سريعة</CardTitle>
            <CardDescription>إنشاء تقارير مخصصة للفترات والمعايير المختلفة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <FileText className="h-6 w-6" />
                تقرير الإيرادات الشهري
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <BarChart3 className="h-6 w-6" />
                تحليل الربحية
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <TrendingUp className="h-6 w-6" />
                تقرير نمو العملاء
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Calendar className="h-6 w-6" />
                تقرير الأداء السنوي
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
