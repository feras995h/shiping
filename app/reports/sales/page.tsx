"use client"

import { useState } from "react"
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Calendar,
  Search,
  Download,
  Filter,
  Users,
  Package,
  Globe,
  Target,
  CheckCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Layout from "@/components/layout"

export default function SalesReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const stats = [
    {
      title: "إجمالي المبيعات",
      value: "2,847,500 د.ل",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "from-emerald-400 to-emerald-600",
    },
    {
      title: "عدد العملاء",
      value: "89",
      change: "+5.4%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "from-blue-400 to-blue-600",
    },
    {
      title: "الشحنات المباعة",
      value: "156",
      change: "+23.1%",
      icon: Package,
      color: "text-purple-600",
      bgColor: "from-purple-400 to-purple-600",
    },
    {
      title: "معدل التحويل",
      value: "78%",
      change: "+8.2%",
      icon: Target,
      color: "text-amber-600",
      bgColor: "from-amber-400 to-amber-600",
    },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">تقارير المبيعات</h1>
            </div>
            <p className="text-slate-600">تحليل شامل لأداء المبيعات والإيرادات</p>
          </div>
          <div className="flex gap-2">
            <Button className="btn-gold">
              <Download className="h-4 w-4 ml-2" />
              تصدير التقرير
            </Button>
            <Button variant="outline" className="border-gold-300 hover:bg-gold-50">
              <Filter className="h-4 w-4 ml-2" />
              فلترة
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="card-premium hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">{stat.title}</CardTitle>
                <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r ${stat.bgColor} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                  <p className={`text-xs sm:text-sm font-medium ${stat.change.startsWith("+") ? "text-emerald-600" : "text-red-600"}`}>
                    {stat.change} من الشهر الماضي
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reports Tabs */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              تحليل المبيعات
            </CardTitle>
            <CardDescription>تقارير مفصلة عن أداء المبيعات</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gold-50 border border-gold-200">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-400 data-[state=active]:to-gold-600 data-[state=active]:text-white">
                  نظرة عامة
                </TabsTrigger>
                <TabsTrigger value="customers" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-400 data-[state=active]:to-gold-600 data-[state=active]:text-white">
                  العملاء
                </TabsTrigger>
                <TabsTrigger value="products" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-400 data-[state=active]:to-gold-600 data-[state=active]:text-white">
                  المنتجات
                </TabsTrigger>
                <TabsTrigger value="regions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-400 data-[state=active]:to-gold-600 data-[state=active]:text-white">
                  المناطق
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="card-premium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                        الإيرادات الشهرية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <BarChart3 className="h-12 w-12 text-emerald-500 mx-auto" />
                          <p className="text-emerald-700 font-medium">رسم بياني للإيرادات</p>
                          <p className="text-emerald-600 text-sm">عرض الإيرادات الشهرية</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-premium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-blue-600" />
                        نمو العملاء
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <TrendingUp className="h-12 w-12 text-blue-500 mx-auto" />
                          <p className="text-blue-700 font-medium">رسم بياني للعملاء</p>
                          <p className="text-blue-600 text-sm">نمو قاعدة العملاء</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="customers" className="space-y-6 mt-6">
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      أفضل العملاء
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "شركة التجارة الليبية", sales: "450,200 د.ل", orders: 15 },
                        { name: "مؤسسة الاستيراد الحديثة", sales: "320,800 د.ل", orders: 12 },
                        { name: "شركة النقل السريع", sales: "285,500 د.ل", orders: 8 },
                      ].map((customer, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                              <span className="text-sm font-bold text-white">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-blue-800">{customer.name}</p>
                              <p className="text-sm text-blue-700">{customer.orders} طلب</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">{customer.sales}</p>
                            <p className="text-sm text-blue-600">إجمالي المبيعات</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products" className="space-y-6 mt-6">
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-purple-600" />
                      المنتجات الأكثر مبيعاً
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "إلكترونيات متنوعة", sales: "125,000 د.ل", units: 45 },
                        { name: "أقمشة وملابس", sales: "89,500 د.ل", units: 32 },
                        { name: "هواتف ذكية", sales: "156,800 د.ل", units: 28 },
                      ].map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                              <Package className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-purple-800">{product.name}</p>
                              <p className="text-sm text-purple-700">{product.units} وحدة</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-purple-600">{product.sales}</p>
                            <p className="text-sm text-purple-600">إجمالي المبيعات</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="regions" className="space-y-6 mt-6">
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-green-600" />
                      المبيعات حسب المنطقة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { region: "طرابلس", sales: "1,250,000 د.ل", percentage: "44%" },
                        { region: "بنغازي", sales: "850,000 د.ل", percentage: "30%" },
                        { region: "مصراتة", sales: "747,500 د.ل", percentage: "26%" },
                      ].map((region, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                              <Globe className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-green-800">{region.region}</p>
                              <p className="text-sm text-green-700">{region.percentage} من إجمالي المبيعات</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{region.sales}</p>
                            <p className="text-sm text-green-600">إجمالي المبيعات</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              ملخص الأداء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">المؤشرات الرئيسية</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                    <span className="text-emerald-800">معدل النمو</span>
                    <span className="font-bold text-emerald-600">+12.5%</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <span className="text-blue-800">متوسط قيمة الطلب</span>
                    <span className="font-bold text-blue-600">18,250 د.ل</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                    <span className="text-purple-800">معدل الاحتفاظ</span>
                    <span className="font-bold text-purple-600">85%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">الأهداف</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-gold-50 to-gold-100 border border-gold-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-gold-800">هدف المبيعات الشهري</span>
                      <span className="font-bold text-gold-600">3,000,000 د.ل</span>
                    </div>
                    <div className="w-full bg-gold-200 rounded-full h-2">
                      <div className="bg-gold-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-sm text-gold-700 mt-1">85% مكتمل</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">التوقعات</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                    <p className="text-amber-800 font-medium">التوقعات للشهر القادم</p>
                    <p className="text-2xl font-bold text-amber-600">3,200,000 د.ل</p>
                    <p className="text-sm text-amber-700">+12% من الشهر الحالي</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
} 