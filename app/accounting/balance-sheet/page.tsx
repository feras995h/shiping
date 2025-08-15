"use client"

import { useEffect, useMemo, useState } from "react"
import { PieChart, Download, Calendar, TrendingUp, Building, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Layout from "@/components/layout"
import { useGlStore } from "@/lib/gl-store"
import { useGlTransactions } from "@/lib/gl-transactions"

export default function BalanceSheetPage() {
  const gl = useGlStore()
  const tx = useGlTransactions()
  const [asOfDate, setAsOfDate] = useState("2024-01-31")
  const [currency, setCurrency] = useState("USD")
  const [comparison, setComparison] = useState("none")

  useEffect(() => {
    gl.initializeChartIfEmpty()
  }, [])

  const balances = useMemo(() => tx.computeBalances(), [tx.entries])

  const totals = useMemo(() => {
    let assets = 0
    let liabilities = 0
    let equity = 0
    for (const acc of gl.accounts) {
      const bal = balances[acc.id] || 0
      if (acc.rootType === 'ASSET') assets += bal
      if (acc.rootType === 'LIABILITY') liabilities += -bal
      if (acc.rootType === 'EQUITY') equity += -bal
    }
    return { assets: Math.max(0, assets), liabilities: Math.max(0, liabilities), equity: Math.max(0, equity) }
  }, [gl.accounts, balances])

  const totalAssets = totals.assets
  const totalLiabilities = totals.liabilities
  const totalEquity = totals.equity
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity
  const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01

  const handleExportPDF = () => {
    // تصدير الميزانية العمومية PDF
    // يمكن إضافة منطق التصدير هنا
  }

  const handleExportExcel = () => {
    // تصدير الميزانية العمومية Excel
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
              <PieChart className="h-8 w-8 text-gold-500" />
              <h1 className="text-4xl font-bold gold-text">الميزانية العمومية</h1>
            </div>
            <p className="text-lg text-slate-600">قائمة المركز المالي للشركة</p>
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
              <span className="gold-text">إعدادات التقرير</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">كما في تاريخ</Label>
                <Input
                  type="date"
                  value={asOfDate}
                  onChange={(e) => setAsOfDate(e.target.value)}
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
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">مقارنة مع</Label>
                <Select value={comparison} onValueChange={setComparison}>
                  <SelectTrigger className="border-gold-200 focus:border-gold-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون مقارنة</SelectItem>
                    <SelectItem value="previous-month">الشهر السابق</SelectItem>
                    <SelectItem value="previous-year">العام السابق</SelectItem>
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

        {/* Balance Status */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">إجمالي الأصول</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <Building className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">${totalAssets.toLocaleString()}</div>
              <p className="text-sm text-green-700 mt-1">الأصول المتداولة والثابتة</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">إجمالي الخصوم</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center shadow-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">${totalLiabilities.toLocaleString()}</div>
              <p className="text-sm text-red-700 mt-1">الالتزامات المالية</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">حقوق الملكية</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <PieChart className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">${totalEquity.toLocaleString()}</div>
              <p className="text-sm text-blue-700 mt-1">حقوق المساهمين</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">حالة التوازن</CardTitle>
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center shadow-lg ${
                  isBalanced
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : "bg-gradient-to-r from-red-400 to-red-600"
                }`}
              >
                <PieChart className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                {isBalanced ? "✓ متوازنة" : "✗ غير متوازنة"}
              </div>
              <p className="text-sm text-slate-600 mt-1">
                {isBalanced
                  ? "الميزانية متوازنة"
                  : `فرق: $${Math.abs(totalAssets - totalLiabilitiesAndEquity).toLocaleString()}`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Balance Sheet */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Assets */}
          <Card className="card-premium">
            <CardHeader className="border-b border-gold-100">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <span className="text-green-700">الأصول</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Current Assets */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-700 border-b border-green-200 pb-2">
                  الأصول المتداولة
                </h3>
                <div className="space-y-3">
                  {/* عرض مبسط: الأرصدة النقدية وما في حكمها */}
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-green-50">
                    <span className="text-slate-700">النقدية وما في حكمها (1.1.1.*)</span>
                    <span className="font-bold text-green-600">${gl.accounts.filter(a=>a.code.startsWith('1.1.1')).reduce((s,a)=>s+(balances[a.id]||0),0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Fixed Assets */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-700 border-b border-green-200 pb-2">الأصول الثابتة</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-green-50">
                    <span className="text-slate-700">الأصول الثابتة (1.2.*)</span>
                    <span className="font-bold text-green-600">${gl.accounts.filter(a=>a.code.startsWith('1.2')).reduce((s,a)=>s+(balances[a.id]||0),0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Total Assets */}
              <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-green-200 to-green-300 rounded-lg border-2 border-green-400">
                <span className="font-bold text-green-800 text-xl">إجمالي الأصول</span>
                <span className="font-bold text-green-800 text-2xl">${totalAssets.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Liabilities and Equity */}
          <Card className="card-premium">
            <CardHeader className="border-b border-gold-100">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-red-400 to-blue-600 flex items-center justify-center shadow-lg">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <span className="text-slate-700">الخصوم وحقوق الملكية</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Current Liabilities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-700 border-b border-red-200 pb-2">الخصوم المتداولة</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-red-50">
                    <span className="text-slate-700">خصوم متداولة (3.1.*)</span>
                    <span className="font-bold text-red-600">${gl.accounts.filter(a=>a.code.startsWith('3.1')).reduce((s,a)=>s+(-(balances[a.id]||0)),0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Long-term Liabilities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-700 border-b border-red-200 pb-2">الخصوم طويلة الأجل</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-red-50">
                    <span className="text-slate-700">خصوم طويلة الأجل (3.2.*)</span>
                    <span className="font-bold text-red-600">${gl.accounts.filter(a=>a.code.startsWith('3.2')).reduce((s,a)=>s+(-(balances[a.id]||0)),0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Total Liabilities */}
              <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-red-200 to-red-300 rounded-lg border-2 border-red-400">
                <span className="font-bold text-red-800 text-lg">إجمالي الخصوم</span>
                <span className="font-bold text-red-800 text-xl">${totalLiabilities.toLocaleString()}</span>
              </div>

              {/* Equity */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2">حقوق الملكية</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-blue-50">
                    <span className="text-slate-700">حقوق الملكية (4.*)</span>
                    <span className="font-bold text-blue-600">${gl.accounts.filter(a=>a.code.startsWith('4.')).reduce((s,a)=>s+(-(balances[a.id]||0)),0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Total Liabilities and Equity */}
              <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg border-2 border-slate-400">
                <span className="font-bold text-slate-800 text-xl">إجمالي الخصوم وحقوق الملكية</span>
                <span className="font-bold text-slate-800 text-2xl">${totalLiabilitiesAndEquity.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Balance Verification */}
        <Card className={`card-premium ${isBalanced ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-3 ${isBalanced ? "text-green-700" : "text-red-700"}`}>
              <PieChart className="h-6 w-6" />
              {isBalanced ? "الميزانية متوازنة ✓" : "تحذير: عدم توازن الميزانية ✗"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">${totalAssets.toLocaleString()}</div>
                <div className="text-sm text-slate-600">إجمالي الأصول</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-slate-600">=</div>
                <div className="text-sm text-slate-600">يساوي</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">${totalLiabilitiesAndEquity.toLocaleString()}</div>
                <div className="text-sm text-slate-600">الخصوم + حقوق الملكية</div>
              </div>
            </div>
            {!isBalanced && (
              <div className="mt-4 p-4 bg-red-100 rounded-lg border border-red-200">
                <p className="text-red-700 font-medium">
                  يوجد فرق في الميزانية بقيمة ${Math.abs(totalAssets - totalLiabilitiesAndEquity).toLocaleString()}
                </p>
                <p className="text-red-600 text-sm mt-2">يرجى مراجعة القيود المحاسبية والتأكد من صحة الأرصدة</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
