"use client"

import { useState } from "react"
import { BarChart3, PieChart, TrendingUp, DollarSign, Calendar, Download, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Layout from "@/components/layout"

export default function FinancialReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedReport, setSelectedReport] = useState("balance")

  // Helper: consistent number formatting (Arabic, currency D.L)
  const fmt = (value: number) =>
    new Intl.NumberFormat("ar-LY", { maximumFractionDigits: 2 }).format(value)

  const financialData = {
    balance: {
      assets: [
        { name: "النقدية وما في حكمها", amount: "561,050.00", currency: "د.ل" },
        { name: "حسابات العملاء", amount: "114,350.00", currency: "د.ل" },
        { name: "المخزون", amount: "45,000.00", currency: "د.ل" },
        { name: "الأصول الثابتة", amount: "840,800.00", currency: "د.ل" },
      ],
      liabilities: [
        { name: "حسابات الموردين", amount: "57,500.00", currency: "د.ل" },
        { name: "المصروفات المستحقة", amount: "20,500.00", currency: "د.ل" },
        { name: "القروض طويلة الأجل", amount: "100,000.00", currency: "د.ل" },
      ],
      equity: [
        { name: "رأس المال", amount: "500,000.00", currency: "د.ل" },
        { name: "الأرباح المحتجزة", amount: "235,400.00", currency: "د.ل" },
      ]
    },
    income: {
      revenue: [
        { name: "إيرادات الشحن", amount: "847,200.00", currency: "د.ل" },
        { name: "إيرادات التخليص الجمركي", amount: "156,800.00", currency: "د.ل" },
        { name: "إيرادات أخرى", amount: "45,600.00", currency: "د.ل" },
      ],
      expenses: [
        { name: "مصاريف الرواتب", amount: "180,000.00", currency: "د.ل" },
        { name: "مصاريف الإيجار", amount: "72,000.00", currency: "د.ل" },
        { name: "مصاريف النقل والشحن", amount: "102,400.00", currency: "د.ل" },
        { name: "مصاريف التخليص الجمركي", amount: "89,600.00", currency: "د.ل" },
        { name: "مصاريف أخرى", amount: "156,800.00", currency: "د.ل" },
      ]
    },
    cashflow: {
      operating: [
        { name: "صافي الربح قبل الضريبة", amount: "600,000.00", currency: "د.ل" },
        { name: "الإهلاك", amount: "50,000.00", currency: "د.ل" },
        { name: "التغير في الذمم المدينة", amount: "-35,000.00", currency: "د.ل" },
        { name: "التغير في المخزون", amount: "-20,000.00", currency: "د.ل" },
        { name: "التغير في الذمم الدائنة", amount: "18,000.00", currency: "د.ل" },
      ],
      investing: [
        { name: "شراء أصول ثابتة", amount: "-120,000.00", currency: "د.ل" },
        { name: "بيع أصول", amount: "15,000.00", currency: "د.ل" },
      ],
      financing: [
        { name: "قروض جديدة", amount: "100,000.00", currency: "د.ل" },
        { name: "سداد قروض", amount: "-40,000.00", currency: "د.ل" },
        { name: "توزيعات أرباح", amount: "-25,000.00", currency: "د.ل" },
      ],
      cashAtBeginning: "820,000.00",
    }
  }

  const toNum = (s: string) => parseFloat(s.replace(/,/g, ""))
  const totalAssets = financialData.balance.assets.reduce((sum, item) => sum + toNum(item.amount), 0)
  const totalLiabilities = financialData.balance.liabilities.reduce((sum, item) => sum + toNum(item.amount), 0)
  const totalEquity = financialData.balance.equity.reduce((sum, item) => sum + toNum(item.amount), 0)
  const totalRevenue = financialData.income.revenue.reduce((sum, item) => sum + toNum(item.amount), 0)
  const totalExpenses = financialData.income.expenses.reduce((sum, item) => sum + toNum(item.amount), 0)
  const netIncome = totalRevenue - totalExpenses

  // Cash flow derived totals
  const cfOperating = financialData.cashflow.operating.reduce((sum, item) => sum + toNum(item.amount), 0)
  const cfInvesting = financialData.cashflow.investing.reduce((sum, item) => sum + toNum(item.amount), 0)
  const cfFinancing = financialData.cashflow.financing.reduce((sum, item) => sum + toNum(item.amount), 0)
  const cashAtBeginning = toNum(financialData.cashflow.cashAtBeginning)
  const netChangeInCash = cfOperating + cfInvesting + cfFinancing
  const cashAtEnd = cashAtBeginning + netChangeInCash

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <PieChart className="h-6 w-6 sm:h-8 sm:w-8 text-gold-500" />
              <h1 className="text-2xl sm:text-4xl font-bold gold-text">التقارير المالية</h1>
            </div>
            <p className="text-base sm:text-lg text-slate-600">تحليل شامل للأداء المالي للشركة</p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32 sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">أسبوعي</SelectItem>
                <SelectItem value="month">شهري</SelectItem>
                <SelectItem value="quarter">ربع سنوي</SelectItem>
                <SelectItem value="year">سنوي</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gold-200 hover:bg-gold-50">
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="flex gap-2">
          <Button
            variant={selectedReport === "balance" ? "default" : "outline"}
            onClick={() => setSelectedReport("balance")}
            className={selectedReport === "balance" ? "btn-gold" : "border-gold-300 hover:bg-gold-50"}
          >
            الميزانية العمومية
          </Button>
          <Button
            variant={selectedReport === "income" ? "default" : "outline"}
            onClick={() => setSelectedReport("income")}
            className={selectedReport === "income" ? "btn-gold" : "border-gold-300 hover:bg-gold-50"}
          >
            قائمة الدخل
          </Button>
          <Button
            variant={selectedReport === "cashflow" ? "default" : "outline"}
            onClick={() => setSelectedReport("cashflow")}
            className={selectedReport === "cashflow" ? "btn-gold" : "border-gold-300 hover:bg-gold-50"}
          >
            التدفق النقدي
          </Button>
        </div>

        {/* Balance Sheet Report */}
        {selectedReport === "balance" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
              <Card className="card-premium hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-700">إجمالي الأصول</CardTitle>
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1">
                    {totalAssets.toLocaleString()} د.ل
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-700">+8.2% من الشهر الماضي</p>
                </CardContent>
              </Card>

              <Card className="card-premium hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-700">إجمالي الخصوم</CardTitle>
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center shadow-lg">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1">
                    {totalLiabilities.toLocaleString()} د.ل
                  </div>
                  <p className="text-xs sm:text-sm text-red-700">-2.1% من الشهر الماضي</p>
                </CardContent>
              </Card>

              <Card className="card-premium hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-700">حقوق الملكية</CardTitle>
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                    {totalEquity.toLocaleString()} د.ل
                  </div>
                  <p className="text-xs sm:text-sm text-blue-700">+12.5% من الشهر الماضي</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Balance Sheet */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Assets */}
              <Card className="card-premium hover-lift">
                <CardHeader className="border-b border-gold-100">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <span className="gold-text">الأصول</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gold-100">
                        <TableHead className="text-slate-700 font-semibold text-right">البند</TableHead>
                        <TableHead className="text-slate-700 font-semibold text-right">المبلغ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financialData.balance.assets.map((item, index) => (
                        <TableRow key={index} className="border-gold-50 hover:bg-gold-50/30 transition-colors">
                          <TableCell className="text-slate-700 text-right">{item.name}</TableCell>
                          <TableCell className="font-mono font-bold text-slate-800 text-right">
                            {item.amount} {item.currency}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t-2 border-emerald-200 bg-emerald-50/30">
                        <TableCell className="font-bold text-emerald-800 text-right">إجمالي الأصول</TableCell>
                        <TableCell className="font-mono font-bold text-emerald-800 text-right">
                          {totalAssets.toLocaleString()} د.ل
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Liabilities & Equity */}
              <Card className="card-premium hover-lift">
                <CardHeader className="border-b border-gold-100">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center">
                      <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <span className="gold-text">الخصوم وحقوق الملكية</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gold-100">
                        <TableHead className="text-slate-700 font-semibold text-right">البند</TableHead>
                        <TableHead className="text-slate-700 font-semibold text-right">المبلغ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Liabilities */}
                      <TableRow className="bg-red-50/30">
                        <TableCell className="font-semibold text-red-800 text-right" colSpan={2}>الخصوم</TableCell>
                      </TableRow>
                      {financialData.balance.liabilities.map((item, index) => (
                        <TableRow key={index} className="border-gold-50 hover:bg-gold-50/30 transition-colors">
                          <TableCell className="text-slate-700 text-right pr-6">{item.name}</TableCell>
                          <TableCell className="font-mono font-bold text-slate-800 text-right">
                            {item.amount} {item.currency}
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Equity */}
                      <TableRow className="bg-blue-50/30">
                        <TableCell className="font-semibold text-blue-800 text-right" colSpan={2}>حقوق الملكية</TableCell>
                      </TableRow>
                      {financialData.balance.equity.map((item, index) => (
                        <TableRow key={index} className="border-gold-50 hover:bg-gold-50/30 transition-colors">
                          <TableCell className="text-slate-700 text-right pr-6">{item.name}</TableCell>
                          <TableCell className="font-mono font-bold text-slate-800 text-right">
                            {item.amount} {item.currency}
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      <TableRow className="border-t-2 border-blue-200 bg-blue-50/30">
                        <TableCell className="font-bold text-blue-800 text-right">إجمالي الخصوم وحقوق الملكية</TableCell>
                        <TableCell className="font-mono font-bold text-blue-800 text-right">
                          {(totalLiabilities + totalEquity).toLocaleString()} د.ل
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Income Statement Report */}
        {selectedReport === "income" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
              <Card className="card-premium hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-700">إجمالي الإيرادات</CardTitle>
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1">
                    {totalRevenue.toLocaleString()} د.ل
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-700">+15.2% من الشهر الماضي</p>
                </CardContent>
              </Card>

              <Card className="card-premium hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-700">إجمالي المصروفات</CardTitle>
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center shadow-lg">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1">
                    {totalExpenses.toLocaleString()} د.ل
                  </div>
                  <p className="text-xs sm:text-sm text-red-700">+8.7% من الشهر الماضي</p>
                </CardContent>
              </Card>

              <Card className="card-premium hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-700">صافي الربح</CardTitle>
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                    {netIncome.toLocaleString()} د.ل
                  </div>
                  <p className="text-xs sm:text-sm text-blue-700">+22.1% من الشهر الماضي</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Income Statement */}
            <Card className="card-premium hover-lift">
              <CardHeader className="border-b border-gold-100">
                <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                    <PieChart className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <span className="gold-text">قائمة الدخل</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gold-100">
                      <TableHead className="text-slate-700 font-semibold text-right">البند</TableHead>
                      <TableHead className="text-slate-700 font-semibold text-right">المبلغ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Revenue */}
                    <TableRow className="bg-emerald-50/30">
                      <TableCell className="font-semibold text-emerald-800 text-right" colSpan={2}>الإيرادات</TableCell>
                    </TableRow>
                    {financialData.income.revenue.map((item, index) => (
                      <TableRow key={index} className="border-gold-50 hover:bg-gold-50/30 transition-colors">
                        <TableCell className="text-slate-700 text-right pr-6">{item.name}</TableCell>
                        <TableCell className="font-mono font-bold text-emerald-600 text-right">
                          {item.amount} {item.currency}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t border-emerald-200 bg-emerald-50/30">
                      <TableCell className="font-bold text-emerald-800 text-right">إجمالي الإيرادات</TableCell>
                      <TableCell className="font-mono font-bold text-emerald-800 text-right">
                        {totalRevenue.toLocaleString()} د.ل
                      </TableCell>
                    </TableRow>

                    {/* Expenses */}
                    <TableRow className="bg-red-50/30">
                      <TableCell className="font-semibold text-red-800 text-right" colSpan={2}>المصروفات</TableCell>
                    </TableRow>
                    {financialData.income.expenses.map((item, index) => (
                      <TableRow key={index} className="border-gold-50 hover:bg-gold-50/30 transition-colors">
                        <TableCell className="text-slate-700 text-right pr-6">{item.name}</TableCell>
                        <TableCell className="font-mono font-bold text-red-600 text-right">
                          {item.amount} {item.currency}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t border-red-200 bg-red-50/30">
                      <TableCell className="font-bold text-red-800 text-right">إجمالي المصروفات</TableCell>
                      <TableCell className="font-mono font-bold text-red-800 text-right">
                        {totalExpenses.toLocaleString()} د.ل
                      </TableCell>
                    </TableRow>

                    {/* Net Income */}
                    <TableRow className="border-t-2 border-blue-200 bg-blue-50/30">
                      <TableCell className="font-bold text-blue-800 text-right">صافي الربح</TableCell>
                      <TableCell className="font-mono font-bold text-blue-800 text-right">
                        {netIncome.toLocaleString()} د.ل
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cash Flow Report */}
        {selectedReport === "cashflow" && (
          <div className="space-y-6">
            {/* Cash Flow Summary */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-4">
              <Card className="card-premium hover-lift">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-700">التدفق من الأنشطة التشغيلية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl sm:text-3xl font-bold ${cfOperating >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {fmt(cfOperating)} د.ل
                  </div>
                </CardContent>
              </Card>
              <Card className="card-premium hover-lift">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-700">التدفق من الأنشطة الاستثمارية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl sm:text-3xl font-bold ${cfInvesting >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {fmt(cfInvesting)} د.ل
                  </div>
                </CardContent>
              </Card>
              <Card className="card-premium hover-lift">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-700">التدفق من الأنشطة التمويلية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl sm:text-3xl font-bold ${cfFinancing >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {fmt(cfFinancing)} د.ل
                  </div>
                </CardContent>
              </Card>
              <Card className="card-premium hover-lift">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-700">صافي التغير في النقدية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl sm:text-3xl font-bold ${netChangeInCash >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {fmt(netChangeInCash)} د.ل
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Cash Flow */}
            <Card className="card-premium hover-lift">
              <CardHeader className="border-b border-gold-100">
                <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <span className="gold-text">قائمة التدفق النقدي</span>
                </CardTitle>
                <CardDescription className="text-slate-600">تشغيلي / استثماري / تمويلي</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gold-100">
                      <TableHead className="text-slate-700 font-semibold text-right">البند</TableHead>
                      <TableHead className="text-slate-700 font-semibold text-right">المبلغ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Operating */}
                    <TableRow className="bg-emerald-50/30">
                      <TableCell className="font-semibold text-emerald-800 text-right" colSpan={2}>التدفقات من الأنشطة التشغيلية</TableCell>
                    </TableRow>
                    {financialData.cashflow.operating.map((item, index) => (
                      <TableRow key={`op-${index}`} className="border-gold-50 hover:bg-gold-50/30 transition-colors">
                        <TableCell className="text-slate-700 text-right pr-6">{item.name}</TableCell>
                        <TableCell className={`font-mono font-bold text-right ${toNum(item.amount) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {item.amount} {item.currency}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t border-emerald-200 bg-emerald-50/30">
                      <TableCell className="font-bold text-emerald-800 text-right">صافي التدفق التشغيلي</TableCell>
                      <TableCell className="font-mono font-bold text-emerald-800 text-right">
                        {fmt(cfOperating)} د.ل
                      </TableCell>
                    </TableRow>

                    {/* Investing */}
                    <TableRow className="bg-purple-50/30">
                      <TableCell className="font-semibold text-purple-800 text-right" colSpan={2}>التدفقات من الأنشطة الاستثمارية</TableCell>
                    </TableRow>
                    {financialData.cashflow.investing.map((item, index) => (
                      <TableRow key={`inv-${index}`} className="border-gold-50 hover:bg-gold-50/30 transition-colors">
                        <TableCell className="text-slate-700 text-right pr-6">{item.name}</TableCell>
                        <TableCell className={`font-mono font-bold text-right ${toNum(item.amount) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {item.amount} {item.currency}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t border-purple-200 bg-purple-50/30">
                      <TableCell className="font-bold text-purple-800 text-right">صافي التدفق الاستثماري</TableCell>
                      <TableCell className="font-mono font-bold text-purple-800 text-right">
                        {fmt(cfInvesting)} د.ل
                      </TableCell>
                    </TableRow>

                    {/* Financing */}
                    <TableRow className="bg-blue-50/30">
                      <TableCell className="font-semibold text-blue-800 text-right" colSpan={2}>التدفقات من الأنشطة التمويلية</TableCell>
                    </TableRow>
                    {financialData.cashflow.financing.map((item, index) => (
                      <TableRow key={`fin-${index}`} className="border-gold-50 hover:bg-gold-50/30 transition-colors">
                        <TableCell className="text-slate-700 text-right pr-6">{item.name}</TableCell>
                        <TableCell className={`font-mono font-bold text-right ${toNum(item.amount) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {item.amount} {item.currency}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t border-blue-200 bg-blue-50/30">
                      <TableCell className="font-bold text-blue-800 text-right">صافي التدفق التمويلي</TableCell>
                      <TableCell className="font-mono font-bold text-blue-800 text-right">
                        {fmt(cfFinancing)} د.ل
                      </TableCell>
                    </TableRow>

                    {/* Totals */}
                    <TableRow className="border-t-2 border-gold-200 bg-gold-50/30">
                      <TableCell className="font-bold text-gold-800 text-right">صافي التغير في النقدية</TableCell>
                      <TableCell className="font-mono font-bold text-gold-800 text-right">
                        {fmt(netChangeInCash)} د.ل
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-amber-50/50">
                      <TableCell className="font-bold text-amber-800 text-right">النقدية أول الفترة</TableCell>
                      <TableCell className="font-mono font-bold text-amber-800 text-right">
                        {fmt(cashAtBeginning)} د.ل
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-t-2 border-amber-200 bg-amber-50/50">
                      <TableCell className="font-bold text-amber-800 text-right">النقدية آخر الفترة</TableCell>
                      <TableCell className="font-mono font-bold text-amber-800 text-right">
                        {fmt(cashAtEnd)} د.ل
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  )
}
