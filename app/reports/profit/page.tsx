"use client"

import { useState } from "react"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Download,
  Filter,
  Target,
  CheckCircle,
  AlertCircle,
  PieChart,
  LineChart,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Layout from "@/components/layout"

export default function ProfitReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const stats = [
    {
      title: "إجمالي الإيرادات",
      value: "2,847,500 د.ل",
      change: "+12.5%",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "from-emerald-400 to-emerald-600",
    },
    {
      title: "إجمالي المصروفات",
      value: "1,923,200 د.ل",
      change: "+8.2%",
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "from-red-400 to-red-600",
    },
    {
      title: "صافي الربح",
      value: "924,300 د.ل",
      change: "+18.7%",
      icon: DollarSign,
      color: "text-gold-600",
      bgColor: "from-gold-400 to-gold-600",
    },
    {
      title: "معدل الربحية",
      value: "32.5%",
      change: "+4.2%",
      icon: Target,
      color: "text-blue-600",
      bgColor: "from-blue-400 to-blue-600",
    },
  ]

  const profitBreakdown = [
    { category: "إيرادات الشحن", amount: "1,850,000 د.ل", percentage: "65%" },
    { category: "إيرادات التخليص الجمركي", amount: "650,000 د.ل", percentage: "23%" },
    { category: "إيرادات الخدمات الإضافية", amount: "347,500 د.ل", percentage: "12%" },
  ]

  const expenseBreakdown = [
    { category: "تكاليف الشحن", amount: "1,200,000 د.ل", percentage: "62%" },
    { category: "الرسوم الجمركية", amount: "400,000 د.ل", percentage: "21%" },
    { category: "المصاريف الإدارية", amount: "200,000 د.ل", percentage: "10%" },
    { category: "مصاريف أخرى", amount: "123,200 د.ل", percentage: "7%" },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">تقارير الأرباح</h1>
            </div>
            <p className="text-slate-600">تحليل شامل للأرباح والخسائر والأداء المالي</p>
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
              <BarChart3 className="h-5 w-5 text-gold-600" />
              تحليل الأرباح والخسائر
            </CardTitle>
            <CardDescription>تقارير مفصلة عن الأداء المالي</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gold-50 border border-gold-200">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-400 data-[state=active]:to-gold-600 data-[state=active]:text-white">
                  نظرة عامة
                </TabsTrigger>
                <TabsTrigger value="revenue" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-400 data-[state=active]:to-gold-600 data-[state=active]:text-white">
                  الإيرادات
                </TabsTrigger>
                <TabsTrigger value="expenses" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-400 data-[state=active]:to-gold-600 data-[state=active]:text-white">
                  المصروفات
                </TabsTrigger>
                <TabsTrigger value="trends" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-400 data-[state=active]:to-gold-600 data-[state=active]:text-white">
                  الاتجاهات
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="card-premium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <PieChart className="h-5 w-5 text-emerald-600" />
                        توزيع الإيرادات
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <PieChart className="h-12 w-12 text-emerald-500 mx-auto" />
                          <p className="text-emerald-700 font-medium">رسم بياني دائري</p>
                          <p className="text-emerald-600 text-sm">توزيع مصادر الإيرادات</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-premium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <LineChart className="h-5 w-5 text-blue-600" />
                        تطور الأرباح
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <LineChart className="h-12 w-12 text-blue-500 mx-auto" />
                          <p className="text-blue-700 font-medium">رسم بياني خطي</p>
                          <p className="text-blue-600 text-sm">تطور الأرباح عبر الزمن</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="revenue" className="space-y-6 mt-6">
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                      تفصيل الإيرادات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profitBreakdown.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                              <span className="text-sm font-bold text-white">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-emerald-800">{item.category}</p>
                              <p className="text-sm text-emerald-700">{item.percentage} من إجمالي الإيرادات</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-emerald-600">{item.amount}</p>
                            <p className="text-sm text-emerald-600">المبلغ</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="expenses" className="space-y-6 mt-6">
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      تفصيل المصروفات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {expenseBreakdown.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                              <span className="text-sm font-bold text-white">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-red-800">{item.category}</p>
                              <p className="text-sm text-red-700">{item.percentage} من إجمالي المصروفات</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600">{item.amount}</p>
                            <p className="text-sm text-red-600">المبلغ</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6 mt-6">
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <LineChart className="h-5 w-5 text-purple-600" />
                      الاتجاهات المالية
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-emerald-600" />
                          <span className="font-semibold text-emerald-800">نمو الإيرادات</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">+12.5%</p>
                        <p className="text-sm text-emerald-700">مقارنة بالشهر السابق</p>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="h-5 w-5 text-red-600" />
                          <span className="font-semibold text-red-800">نمو المصروفات</span>
                        </div>
                        <p className="text-2xl font-bold text-red-600">+8.2%</p>
                        <p className="text-sm text-red-700">مقارنة بالشهر السابق</p>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-gradient-to-br from-gold-50 to-gold-100 border border-gold-200">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-5 w-5 text-gold-600" />
                          <span className="font-semibold text-gold-800">نمو الأرباح</span>
                        </div>
                        <p className="text-2xl font-bold text-gold-600">+18.7%</p>
                        <p className="text-sm text-gold-700">مقارنة بالشهر السابق</p>
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
              ملخص الأداء المالي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">المؤشرات الرئيسية</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                    <span className="text-emerald-800">معدل الربحية</span>
                    <span className="font-bold text-emerald-600">32.5%</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <span className="text-blue-800">نسبة المصروفات</span>
                    <span className="font-bold text-blue-600">67.5%</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-gradient-to-br from-gold-50 to-gold-100 border border-gold-200">
                    <span className="text-gold-800">صافي الربح</span>
                    <span className="font-bold text-gold-600">924,300 د.ل</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">الأهداف</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-gold-50 to-gold-100 border border-gold-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-gold-800">هدف الربح الشهري</span>
                      <span className="font-bold text-gold-600">1,000,000 د.ل</span>
                    </div>
                    <div className="w-full bg-gold-200 rounded-full h-2">
                      <div className="bg-gold-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <p className="text-sm text-gold-700 mt-1">92% مكتمل</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">التوقعات</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                    <p className="text-amber-800 font-medium">التوقعات للشهر القادم</p>
                    <p className="text-2xl font-bold text-amber-600">1,050,000 د.ل</p>
                    <p className="text-sm text-amber-700">+14% من الشهر الحالي</p>
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