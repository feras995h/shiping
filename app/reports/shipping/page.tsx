"use client"

import { useState } from "react"
import {
  Ship,
  Package,
  BarChart3,
  Calendar,
  Download,
  Filter,
  Globe,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Layout from "@/components/layout"

export default function ShippingReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const stats = [
    {
      title: "إجمالي الشحنات",
      value: "156",
      change: "+23.1%",
      icon: Package,
      color: "text-blue-600",
      bgColor: "from-blue-400 to-blue-600",
    },
    {
      title: "في الطريق",
      value: "45",
      change: "+15.2%",
      icon: Ship,
      color: "text-amber-600",
      bgColor: "from-amber-400 to-amber-600",
    },
    {
      title: "تم التسليم",
      value: "98",
      change: "+8.7%",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "from-emerald-400 to-emerald-600",
    },
    {
      title: "متوسط وقت الشحن",
      value: "18 يوم",
      change: "-5.2%",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "from-purple-400 to-purple-600",
    },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <Ship className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">تقارير الشحن</h1>
            </div>
            <p className="text-slate-600">تحليل شامل لأداء الشحن واللوجستيات</p>
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
              تحليل الشحن
            </CardTitle>
            <CardDescription>تقارير مفصلة عن أداء الشحن</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gold-50 border border-gold-200">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-400 data-[state=active]:to-gold-600 data-[state=active]:text-white">
                  نظرة عامة
                </TabsTrigger>
                <TabsTrigger value="routes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-400 data-[state=active]:to-gold-600 data-[state=active]:text-white">
                  المسارات
                </TabsTrigger>
                <TabsTrigger value="carriers" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-400 data-[state=active]:to-gold-600 data-[state=active]:text-white">
                  شركات النقل
                </TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-400 data-[state=active]:to-gold-600 data-[state=active]:text-white">
                  الأداء
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="card-premium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Ship className="h-5 w-5 text-blue-600" />
                        حالة الشحنات
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <BarChart3 className="h-12 w-12 text-blue-500 mx-auto" />
                          <p className="text-blue-700 font-medium">رسم بياني لحالة الشحنات</p>
                          <p className="text-blue-600 text-sm">توزيع الشحنات حسب الحالة</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-premium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-green-600" />
                        المسارات الأكثر نشاطاً
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <Globe className="h-12 w-12 text-green-500 mx-auto" />
                          <p className="text-green-700 font-medium">خريطة المسارات</p>
                          <p className="text-green-600 text-sm">المسارات الأكثر استخداماً</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="routes" className="space-y-6 mt-6">
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-green-600" />
                      المسارات الشائعة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { route: "شنغهاي - طرابلس", shipments: 45, avgTime: "18 يوم", success: "98%" },
                        { route: "قوانغتشو - بنغازي", shipments: 32, avgTime: "20 يوم", success: "95%" },
                        { route: "شنتشن - مصراتة", shipments: 28, avgTime: "16 يوم", success: "99%" },
                      ].map((route, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                              <Ship className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-green-800">{route.route}</p>
                              <p className="text-sm text-green-700">{route.shipments} شحنة</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{route.avgTime}</p>
                            <p className="text-sm text-green-600">متوسط الوقت</p>
                            <p className="text-xs text-green-600">نجاح: {route.success}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="carriers" className="space-y-6 mt-6">
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Ship className="h-5 w-5 text-blue-600" />
                      شركات النقل
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "شركة الشحن العالمية", shipments: 65, rating: "4.8", onTime: "95%" },
                        { name: "شركة النقل البحري", shipments: 45, rating: "4.6", onTime: "92%" },
                        { name: "شركة الشحن السريع", shipments: 46, rating: "4.9", onTime: "98%" },
                      ].map((carrier, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                              <span className="text-sm font-bold text-white">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-blue-800">{carrier.name}</p>
                              <p className="text-sm text-blue-700">{carrier.shipments} شحنة</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">{carrier.rating}/5</p>
                            <p className="text-sm text-blue-600">التقييم</p>
                            <p className="text-xs text-blue-600">في الوقت: {carrier.onTime}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6 mt-6">
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-purple-600" />
                      مؤشرات الأداء
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                          <span className="font-semibold text-emerald-800">معدل النجاح</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">97.5%</p>
                        <p className="text-sm text-emerald-700">شحنات ناجحة</p>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-blue-800">متوسط وقت الشحن</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">18 يوم</p>
                        <p className="text-sm text-blue-700">من الصين إلى ليبيا</p>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-5 w-5 text-purple-600" />
                          <span className="font-semibold text-purple-800">الشحنات المتأخرة</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">2.5%</p>
                        <p className="text-sm text-purple-700">من إجمالي الشحنات</p>
                      </div>
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
                    <span className="text-emerald-800">معدل النجاح</span>
                    <span className="font-bold text-emerald-600">97.5%</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <span className="text-blue-800">متوسط وقت الشحن</span>
                    <span className="font-bold text-blue-600">18 يوم</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                    <span className="text-purple-800">رضا العملاء</span>
                    <span className="font-bold text-purple-600">4.8/5</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">الأهداف</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-gold-50 to-gold-100 border border-gold-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-gold-800">هدف الشحنات الشهري</span>
                      <span className="font-bold text-gold-600">200 شحنة</span>
                    </div>
                    <div className="w-full bg-gold-200 rounded-full h-2">
                      <div className="bg-gold-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <p className="text-sm text-gold-700 mt-1">78% مكتمل</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">التوقعات</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                    <p className="text-amber-800 font-medium">التوقعات للشهر القادم</p>
                    <p className="text-2xl font-bold text-amber-600">180 شحنة</p>
                    <p className="text-sm text-amber-700">+15% من الشهر الحالي</p>
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