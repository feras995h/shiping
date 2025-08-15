"use client"

import { useMemo, useState } from "react"
import { Target, Download, Calendar, TrendingUp, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Layout from "@/components/layout"
import { useGlStore } from "@/lib/gl-store"
import { useGlTransactions } from "@/lib/gl-transactions"

export default function TrialBalancePage() {
  const gl = useGlStore()
  const tx = useGlTransactions()
  const [fromDate, setFromDate] = useState("2024-01-01")
  const [toDate, setToDate] = useState("2024-01-31")
  const [currency, setCurrency] = useState("USD")

  const balances = useMemo(() => tx.computeBalances(), [tx.entries])
  const trialBalanceData = useMemo(() => {
    return gl.accounts.map(acc => {
      const bal = balances[acc.id] || 0
      const type = acc.rootType === 'ASSET' ? 'أصول'
        : acc.rootType === 'LIABILITY' ? 'خصوم'
        : acc.rootType === 'EQUITY' ? 'حقوق الملكية'
        : acc.rootType === 'REVENUE' ? 'إيرادات'
        : 'مصروفات'
      const debit = bal > 0 ? bal.toFixed(2) : ''
      const credit = bal < 0 ? Math.abs(bal).toFixed(2) : ''
      const balance = bal.toFixed(2)
      return { code: acc.code, name: acc.name, type, debit, credit, balance }
    })
  }, [gl.accounts, balances])

  const totalDebit = trialBalanceData.reduce(
    (sum, item) => sum + (Number.parseFloat(item.debit.replace(/,/g, "")) || 0),
    0,
  )
  const totalCredit = trialBalanceData.reduce(
    (sum, item) => sum + (Number.parseFloat(item.credit.replace(/,/g, "")) || 0),
    0,
  )
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01

  const getTypeColor = (type: string) => {
    switch (type) {
      case "أصول":
        return "bg-gradient-to-r from-gold-400 to-gold-600 text-white"
      case "خصوم":
        return "bg-gradient-to-r from-red-400 to-red-600 text-white"
      case "حقوق الملكية":
        return "bg-gradient-to-r from-gold-500 to-gold-700 text-white"
      case "إيرادات":
        return "bg-gradient-to-r from-gold-600 to-gold-800 text-white"
      case "مصروفات":
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
      default:
        return "bg-gradient-to-r from-gold-300 to-gold-500 text-white"
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-gold-500" />
              <h1 className="text-4xl font-bold gold-text">ميزان المراجعة</h1>
            </div>
            <p className="text-lg text-slate-600">عرض أرصدة جميع الحسابات للتأكد من التوازن المحاسبي</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-gold-300 hover:bg-gold-50 bg-transparent">
              <Download className="h-4 w-4 ml-2" />
              تصدير PDF
            </Button>
            <Button variant="outline" className="border-gold-300 hover:bg-gold-50 bg-transparent">
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
                <label className="text-sm font-medium text-slate-700">من تاريخ</label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border-gold-200 focus:border-gold-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">إلى تاريخ</label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border-gold-200 focus:border-gold-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">العملة</label>
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

        {/* Balance Status */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">إجمالي المدين</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">${totalDebit.toLocaleString()}</div>
              <p className="text-sm text-green-700 mt-1">جانب المدين</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">إجمالي الدائن</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">${totalCredit.toLocaleString()}</div>
              <p className="text-sm text-red-700 mt-1">جانب الدائن</p>
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
                {isBalanced ? (
                  <Target className="h-5 w-5 text-white" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-white" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                {isBalanced ? "✓ متوازن" : "✗ غير متوازن"}
              </div>
              <p className={`text-sm mt-1 ${isBalanced ? "text-green-700" : "text-red-700"}`}>
                الفرق: ${Math.abs(totalDebit - totalCredit).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trial Balance Table */}
        <Card className="card-premium">
          <CardHeader className="border-b border-gold-100">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center shadow-gold">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="gold-text">ميزان المراجعة</span>
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              للفترة من {fromDate} إلى {toDate} - العملة: {currency}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="rounded-lg border border-gold-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-gold-50 to-amber-50">
                  <TableRow className="border-gold-200">
                    <TableHead className="text-slate-700 font-semibold">رقم الحساب</TableHead>
                    <TableHead className="text-slate-700 font-semibold">اسم الحساب</TableHead>
                    <TableHead className="text-slate-700 font-semibold">النوع</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-center">مدين</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-center">دائن</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-center">الرصيد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trialBalanceData.map((account) => (
                    <TableRow key={account.code} className="border-gold-100 hover:bg-gold-50/30 transition-colors">
                      <TableCell className="font-bold text-slate-800">{account.code}</TableCell>
                      <TableCell className="font-medium text-slate-700">{account.name}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(account.type)}>{account.type}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold text-green-600">
                        {account.debit && `$${account.debit}`}
                      </TableCell>
                      <TableCell className="text-center font-bold text-red-600">
                        {account.credit && `$${account.credit}`}
                      </TableCell>
                      <TableCell
                        className={`text-center font-bold ${
                          Number.parseFloat(account.balance.replace(/,/g, "")) >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        ${Math.abs(Number.parseFloat(account.balance.replace(/,/g, ""))).toLocaleString()}
                        {Number.parseFloat(account.balance.replace(/,/g, "")) < 0 && " (دائن)"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total Row */}
                  <TableRow className="border-t-2 border-gold-300 bg-gradient-to-r from-gold-100 to-amber-100 font-bold">
                    <TableCell colSpan={3} className="text-slate-800 font-bold text-lg">
                      الإجمالي
                    </TableCell>
                    <TableCell className="text-center font-bold text-green-600 text-lg">
                      ${totalDebit.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center font-bold text-red-600 text-lg">
                      ${totalCredit.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={`text-center font-bold text-lg ${isBalanced ? "text-green-600" : "text-red-600"}`}
                    >
                      {isBalanced ? "✓ متوازن" : `فرق: $${Math.abs(totalDebit - totalCredit).toLocaleString()}`}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Balance Verification */}
        {!isBalanced && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-6 w-6" />
                تحذير: عدم توازن الميزان
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-red-700">
                  يوجد فرق في الميزان بقيمة ${Math.abs(totalDebit - totalCredit).toLocaleString()}
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent">
                    مراجعة القيود
                  </Button>
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent">
                    تقرير الأخطاء
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
