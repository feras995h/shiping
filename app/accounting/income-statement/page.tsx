"use client"

import { useEffect, useMemo, useState } from "react"
import { TrendingUp, Download, Calendar, DollarSign, Target, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Layout from "@/components/layout"
import { useGlStore } from "@/lib/gl-store"
import { useGlTransactions } from "@/lib/gl-transactions"

export default function IncomeStatementPage() {
  const gl = useGlStore()
  const tx = useGlTransactions()
  const [fromDate, setFromDate] = useState("2024-01-01")
  const [toDate, setToDate] = useState("2024-01-31")
  const [currency, setCurrency] = useState("USD")
  const [comparison, setComparison] = useState("none")

  useEffect(() => {
    gl.initializeChartIfEmpty()
  }, [])

  const balances = useMemo(() => tx.computeBalances(), [tx.entries])

  const totalRevenue = useMemo(() => {
    let sum = 0
    for (const acc of gl.accounts) {
      if (acc.rootType === 'REVENUE') {
        const bal = balances[acc.id] || 0
        sum += -bal // الإيرادات دائن
      }
    }
    return Math.max(0, sum)
  }, [gl.accounts, balances])

  const totalOperatingExpenses = useMemo(() => {
    let sum = 0
    for (const acc of gl.accounts) {
      if (acc.rootType === 'EXPENSE') {
        const bal = balances[acc.id] || 0
        sum += bal // المصروفات مدينة
      }
    }
    return Math.max(0, sum)
  }, [gl.accounts, balances])

  const totalNonOperatingExpenses = 0 // لاحقًا: فصل مصروفات غير تشغيلية إن وُجدت
  const totalExpenses = totalOperatingExpenses + totalNonOperatingExpenses

  const grossProfit = totalRevenue
  const operatingProfit = grossProfit - totalOperatingExpenses
  const netProfit = operatingProfit - totalNonOperatingExpenses

  const grossProfitMargin = totalRevenue ? (grossProfit / totalRevenue) * 100 : 0
  const operatingProfitMargin = totalRevenue ? (operatingProfit / totalRevenue) * 100 : 0
  const netProfitMargin = totalRevenue ? (netProfit / totalRevenue) * 100 : 0

  const handleExportPDF = () => {
    // تصدير قائمة الدخل PDF
    // يمكن إضافة منطق التصدير هنا
  }

  const handleExportExcel = () => {
    // تصدير قائمة الدخل Excel
    // يمكن إضافة منطق التصدير هنا
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-gold-500" />
              <h1 className="text-4xl font-bold gold-text">قائمة الدخل</h1>
            </div>
            <p className="text-lg text-slate-600">قائمة الأرباح والخسائر للشركة</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-gold-300 hover:bg-gold-50 bg-transparent" onClick={handlePrint}>
              <Download className="h-4 w-4 ml-2" />
              طباعة
            </Button>
            <Button
              variant="outline"
              className="border-gold-300 hover:bg-gold-50 bg-transparent"
              onClick={handleExportPDF}
            >
              <Download className="h-4 w-4 ml-2" />
              تصدير PDF
            </Button>
            <Button
              variant="outline"
              className="border-gold-300 hover:bg-gold-50 bg-transparent"
              onClick={handleExportExcel}
            >
              <Download className="h-4 w-4 ml-2" />
              تصدير Excel
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-gold-500" />
              <span className="gold-text">فترة التقرير</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">من تاريخ</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border-gold-200 focus:border-gold-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">إلى تاريخ</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border-gold-200 focus:border-gold-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">العملة</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="border-gold-200 focus:border-gold-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">دولار أمريكي</SelectItem>
                    <SelectItem value="LYD">دينار ليبي</SelectItem>
                    <SelectItem value="EUR">يورو</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="btn-gold w-full">
                  <TrendingUp className="h-4 w-4 ml-2" />
                  تحديث التقرير
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">إجمالي الإيرادات</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={100} className="flex-1 h-2" />
                <span className="text-sm text-green-700">100%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">الربح التشغيلي</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">${operatingProfit.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={operatingProfitMargin} className="flex-1 h-2" />
                <span className="text-sm text-blue-700">{operatingProfitMargin.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">صافي الربح</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">${netProfit.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={netProfitMargin} className="flex-1 h-2" />
                <span className="text-sm text-purple-700">{netProfitMargin.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">هامش الربح</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{netProfitMargin.toFixed(1)}%</div>
              <p className="text-sm text-amber-700 mt-1">من إجمالي الإيرادات</p>
            </CardContent>
          </Card>
        </div>

        {/* Income Statement */}
        <Card className="card-premium">
          <CardHeader className="border-b border-gold-100">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center shadow-gold">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="gold-text">قائمة الدخل</span>
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              للفترة من {fromDate} إلى {toDate} - العملة: {currency}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Revenue Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-green-700 border-b-2 border-green-200 pb-2 flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                الإيرادات
              </h3>
              <div className="space-y-3">
                {gl.accounts
                  .filter(a => a.rootType === 'REVENUE')
                  .sort((a,b) => a.code.localeCompare(b.code))
                  .map(acc => {
                    const bal = -(balances[acc.id] || 0)
                    if (bal <= 0) return null
                    return (
                      <div key={acc.id} className="flex justify-between items-center py-3 px-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-green-300 text-green-700 text-xs">{acc.code}</Badge>
                          <span className="text-slate-700 font-medium">{acc.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">${bal.toLocaleString()}</div>
                        </div>
                      </div>
                    )
                  })}
                <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-green-200 to-green-300 rounded-lg border-2 border-green-400">
                  <span className="font-bold text-green-800 text-lg">إجمالي الإيرادات</span>
                  <span className="font-bold text-green-800 text-xl">${totalRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Operating Expenses Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-red-700 border-b-2 border-red-200 pb-2 flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                المصروفات التشغيلية
              </h3>
              <div className="space-y-3">
                {gl.accounts
                  .filter(a => a.rootType === 'EXPENSE')
                  .sort((a,b) => a.code.localeCompare(b.code))
                  .map(acc => {
                    const bal = balances[acc.id] || 0
                    if (bal <= 0) return null
                    return (
                      <div key={acc.id} className="flex justify-between items-center py-3 px-4 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-red-300 text-red-700 text-xs">{acc.code}</Badge>
                          <span className="text-slate-700 font-medium">{acc.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-600">${bal.toLocaleString()}</div>
                        </div>
                      </div>
                    )
                  })}
                <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-red-200 to-red-300 rounded-lg border-2 border-red-400">
                  <span className="font-bold text-red-800 text-lg">إجمالي المصروفات التشغيلية</span>
                  <span className="font-bold text-red-800 text-xl">${totalOperatingExpenses.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Operating Profit */}
            <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg border-2 border-blue-400">
              <span className="font-bold text-blue-800 text-xl">الربح التشغيلي</span>
              <div className="text-right">
                <div className="font-bold text-blue-800 text-2xl">${operatingProfit.toLocaleString()}</div>
                <div className="text-sm text-blue-700">هامش {operatingProfitMargin.toFixed(1)}%</div>
              </div>
            </div>

            {/* Non-Operating Expenses */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-orange-700 border-b-2 border-orange-200 pb-2 flex items-center gap-2">
                <Target className="h-6 w-6" />
                المصروفات غير التشغيلية
              </h3>
              <div className="space-y-3">
                {/* لاحقًا: عرض تفاصيل حسب تصنيف غير تشغيلي إن تم تعريفه */}
                <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg border-2 border-orange-400">
                  <span className="font-bold text-orange-800 text-lg">إجمالي المصروفات غير التشغيلية</span>
                  <span className="font-bold text-orange-800 text-xl">
                    ${totalNonOperatingExpenses.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Net Profit */}
            <div className="space-y-4">
              <div className="flex justify-between items-center py-6 px-6 bg-gradient-to-r from-purple-300 to-purple-400 rounded-xl border-3 border-purple-500 shadow-lg">
                <span className="font-bold text-purple-900 text-2xl">صافي الربح</span>
                <div className="text-right">
                  <div className="font-bold text-purple-900 text-3xl">${netProfit.toLocaleString()}</div>
                  <div className="text-lg text-purple-800">هامش الربح {netProfitMargin.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* Summary Analysis */}
            <div className="grid gap-6 md:grid-cols-3 mt-8">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700 text-lg">تحليل الإيرادات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">أعلى مصدر إيراد:</span>
                      <span className="text-sm font-bold text-green-700">خدمات الشحن</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">النسبة:</span>
                      <span className="text-sm font-bold text-green-700">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">النمو المتوقع:</span>
                      <span className="text-sm font-bold text-green-700">+12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700 text-lg">تحليل المصروفات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-red-600">أعلى مصروف:</span>
                      <span className="text-sm font-bold text-red-700">الرواتب</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-red-600">النسبة:</span>
                      <span className="text-sm font-bold text-red-700">32.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-red-600">إمكانية التوفير:</span>
                      <span className="text-sm font-bold text-red-700">5-8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-700 text-lg">الأداء المالي</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-600">هامش الربح:</span>
                      <span className="text-sm font-bold text-purple-700">{netProfitMargin.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-600">التقييم:</span>
                      <span className="text-sm font-bold text-purple-700">
                        {netProfitMargin > 15 ? "ممتاز" : netProfitMargin > 10 ? "جيد" : "يحتاج تحسين"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-purple-600">الاتجاه:</span>
                      <span className="text-sm font-bold text-purple-700">صاعد ↗</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
