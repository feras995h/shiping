"use client"

import { useState } from "react"
import { Database, Download, Eye, Calendar, TrendingUp, ArrowUpDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import Layout from "@/components/layout"

export default function LedgerPage() {
  const [selectedAccount, setSelectedAccount] = useState("1102")
  const [fromDate, setFromDate] = useState("2024-01-01")
  const [toDate, setToDate] = useState("2024-01-31")
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)

  const accounts = [
    { code: "1101", name: "النقدية في الصندوق" },
    { code: "1102", name: "النقدية في البنك - الحساب الجاري" },
    { code: "1201", name: "حسابات العملاء" },
    { code: "2101", name: "حسابات الموردين" },
    { code: "4101", name: "إيرادات خدمات الشحن" },
    { code: "5101", name: "مصاريف الرواتب والأجور" },
  ]

  const ledgerEntries = [
    {
      date: "2024-01-01",
      reference: "رصيد افتتاحي",
      description: "الرصيد الافتتاحي للحساب",
      debit: "250,000.00",
      credit: "",
      balance: "250,000.00",
      journalId: "OB-001",
    },
    {
      date: "2024-01-05",
      reference: "حوالة-001",
      description: "استلام حوالة من شركة التجارة الليبية",
      debit: "5,200.00",
      credit: "",
      balance: "255,200.00",
      journalId: "JE-001",
    },
    {
      date: "2024-01-08",
      reference: "تحويل-001",
      description: "تحويل مبلغ إلى مورد في الصين",
      debit: "",
      credit: "5,000.00",
      balance: "250,200.00",
      journalId: "JE-002",
    },
    {
      date: "2024-01-12",
      reference: "مصروف-001",
      description: "دفع مصاريف شحن",
      debit: "",
      credit: "800.00",
      balance: "249,400.00",
      journalId: "JE-004",
    },
    {
      date: "2024-01-15",
      reference: "إيداع-001",
      description: "إيداع نقدي من العميل",
      debit: "15,000.00",
      credit: "",
      balance: "264,400.00",
      journalId: "JE-005",
    },
    {
      date: "2024-01-20",
      reference: "سحب-001",
      description: "سحب نقدي لمصاريف تشغيلية",
      debit: "",
      credit: "3,500.00",
      balance: "260,900.00",
      journalId: "JE-006",
    },
    {
      date: "2024-01-25",
      reference: "حوالة-002",
      description: "استلام حوالة من عميل آخر",
      debit: "8,750.00",
      credit: "",
      balance: "269,650.00",
      journalId: "JE-007",
    },
    {
      date: "2024-01-30",
      reference: "رسوم-001",
      description: "دفع رسوم بنكية",
      debit: "",
      credit: "150.00",
      balance: "269,500.00",
      journalId: "JE-008",
    },
  ]

  const selectedAccountName = accounts.find((acc) => acc.code === selectedAccount)?.name || ""
  const totalDebit = ledgerEntries.reduce(
    (sum, entry) => sum + (Number.parseFloat(entry.debit.replace(/,/g, "")) || 0),
    0,
  )
  const totalCredit = ledgerEntries.reduce(
    (sum, entry) => sum + (Number.parseFloat(entry.credit.replace(/,/g, "")) || 0),
    0,
  )
  const finalBalance = totalDebit - totalCredit

  const handleViewJournal = (journalId: string) => {
    // عرض القيد
    // هنا يمكن إضافة منطق عرض القيد المحاسبي
  }

  const handleExportPDF = () => {
    // تصدير PDF لكشف الحساب
    // هنا يمكن إضافة منطق تصدير PDF
  }

  const handleExportExcel = () => {
    // تصدير Excel لكشف الحساب
    // هنا يمكن إضافة منطق تصدير Excel
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-gold-500" />
              <h1 className="text-4xl font-bold gold-text">دفتر الأستاذ العام</h1>
            </div>
            <p className="text-lg text-slate-600">عرض تفصيلي لحركة الحسابات المحاسبية</p>
          </div>
          <div className="flex gap-3">
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
              <span className="gold-text">إعدادات كشف الحساب</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">الحساب</Label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger className="border-gold-200 focus:border-gold-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.code} value={account.code}>
                        {account.code} - {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <div className="flex items-end">
                <Button className="btn-gold w-full">
                  <TrendingUp className="h-4 w-4 ml-2" />
                  تحديث الكشف
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Summary */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">إجمالي المدين</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">${totalDebit.toLocaleString()}</div>
              <p className="text-sm text-green-700 mt-1">إجمالي الحركة المدينة</p>
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
              <p className="text-sm text-red-700 mt-1">إجمالي الحركة الدائنة</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">الرصيد النهائي</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <Database className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${finalBalance >= 0 ? "text-blue-600" : "text-red-600"}`}>
                ${Math.abs(finalBalance).toLocaleString()}
              </div>
              <p className="text-sm text-slate-600 mt-1">{finalBalance >= 0 ? "رصيد مدين" : "رصيد دائن"}</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">عدد الحركات</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                <ArrowUpDown className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{ledgerEntries.length}</div>
              <p className="text-sm text-purple-700 mt-1">حركة محاسبية</p>
            </CardContent>
          </Card>
        </div>

        {/* Ledger Table */}
        <Card className="card-premium">
          <CardHeader className="border-b border-gold-100">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center shadow-gold">
                <Database className="h-5 w-5 text-white" />
              </div>
              <span className="gold-text">
                كشف حساب: {selectedAccount} - {selectedAccountName}
              </span>
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              للفترة من {fromDate} إلى {toDate}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="rounded-lg border border-gold-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-gold-50 to-amber-50">
                  <TableRow className="border-gold-200">
                    <TableHead className="text-slate-700 font-semibold">التاريخ</TableHead>
                    <TableHead className="text-slate-700 font-semibold">المرجع</TableHead>
                    <TableHead className="text-slate-700 font-semibold">البيان</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-center">مدين</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-center">دائن</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-center">الرصيد</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgerEntries.map((entry, index) => (
                    <TableRow key={index} className="border-gold-100 hover:bg-gold-50/30 transition-colors">
                      <TableCell className="font-medium text-slate-800">{entry.date}</TableCell>
                      <TableCell className="text-slate-700">{entry.reference}</TableCell>
                      <TableCell className="text-slate-700">{entry.description}</TableCell>
                      <TableCell className="text-center font-bold text-green-600">
                        {entry.debit && `$${entry.debit}`}
                      </TableCell>
                      <TableCell className="text-center font-bold text-red-600">
                        {entry.credit && `$${entry.credit}`}
                      </TableCell>
                      <TableCell className="text-center font-bold text-blue-600">${entry.balance}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-gold-100"
                          onClick={() => handleViewJournal(entry.journalId)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
                    <TableCell className="text-center font-bold text-blue-600 text-lg">
                      ${Math.abs(finalBalance).toLocaleString()} {finalBalance >= 0 ? "(مدين)" : "(دائن)"}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
