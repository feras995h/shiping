"use client"

import { useMemo, useState } from "react"
import { Plus, Search, Filter, Edit, Trash2, Eye, FileText, Calculator, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Layout from "@/components/layout"
import { useGlStore } from "@/lib/gl-store"
import { useGlTransactions } from "@/lib/gl-transactions"

export default function JournalEntriesPage() {
  const gl = useGlStore()
  const tx = useGlTransactions()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [journalLines, setJournalLines] = useState([
    { accountId: "", debit: "", credit: "" },
    { accountId: "", debit: "", credit: "" },
  ])

  const journalEntries = [
    {
      id: "JE-001",
      date: "2024-01-15",
      reference: "حوالة-001",
      description: "استلام حوالة من شركة التجارة الليبية",
      entries: [
        { account: "1102", accountName: "النقدية في البنك", debit: "5,200.00", credit: "" },
        { account: "4103", accountName: "إيرادات التحويلات المالية", debit: "", credit: "200.00" },
        { account: "1201", accountName: "حسابات العملاء", debit: "", credit: "5,000.00" },
      ],
      totalDebit: "5,200.00",
      totalCredit: "5,200.00",
      status: "مرحل",
      currency: "USD",
    },
    {
      id: "JE-002",
      date: "2024-01-14",
      reference: "تحويل-001",
      description: "تحويل مبلغ إلى مورد في الصين",
      entries: [
        { account: "1201", accountName: "حسابات العملاء", debit: "5,000.00", credit: "" },
        { account: "1102", accountName: "النقدية في البنك", debit: "", credit: "5,000.00" },
      ],
      totalDebit: "5,000.00",
      totalCredit: "5,000.00",
      status: "مرحل",
      currency: "USD",
    },
    {
      id: "JE-003",
      date: "2024-01-13",
      reference: "شحن-001",
      description: "إيراد خدمة شحن لعميل",
      entries: [
        { account: "1201", accountName: "حسابات العملاء", debit: "1,500.00", credit: "" },
        { account: "4101", accountName: "إيرادات خدمات الشحن", debit: "", credit: "1,500.00" },
      ],
      totalDebit: "1,500.00",
      totalCredit: "1,500.00",
      status: "مسودة",
      currency: "USD",
    },
    {
      id: "JE-004",
      date: "2024-01-12",
      reference: "مصروف-001",
      description: "دفع مصاريف شحن",
      entries: [
        { account: "5201", accountName: "مصاريف الشحن والنقل", debit: "800.00", credit: "" },
        { account: "1102", accountName: "النقدية في البنك", debit: "", credit: "800.00" },
      ],
      totalDebit: "800.00",
      totalCredit: "800.00",
      status: "مرحل",
      currency: "USD",
    },
  ]

  const chartOfAccounts = useMemo(() => gl.accounts.map(a => ({ id: a.id, code: a.code, name: a.name })), [gl.accounts])

  const filteredEntries = journalEntries.filter((entry) => {
    const matchesSearch =
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مرحل":
        return "bg-gradient-to-r from-green-400 to-green-600 text-white"
      case "مسودة":
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
      case "ملغي":
        return "bg-gradient-to-r from-red-400 to-red-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
    }
  }

  const addJournalLine = () => {
    setJournalLines([...journalLines, { accountId: "", debit: "", credit: "" }])
  }

  const removeJournalLine = (index: number) => {
    if (journalLines.length > 2) {
      setJournalLines(journalLines.filter((_, i) => i !== index))
    }
  }

  const calculateTotals = () => {
    const totalDebit = journalLines.reduce((sum, line) => sum + (Number.parseFloat(line.debit) || 0), 0)
    const totalCredit = journalLines.reduce((sum, line) => sum + (Number.parseFloat(line.credit) || 0), 0)
    return { totalDebit, totalCredit, difference: totalDebit - totalCredit }
  }

  const { totalDebit, totalCredit, difference } = calculateTotals()

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-gold-500" />
              <h1 className="text-4xl font-bold gold-text">القيود اليومية</h1>
            </div>
            <p className="text-lg text-slate-600">تسجيل وإدارة القيود المحاسبية اليومية</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gold">
                <Plus className="h-4 w-4 ml-2" />
                قيد محاسبي جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إنشاء قيد محاسبي جديد</DialogTitle>
                <DialogDescription>أدخل تفاصيل القيد المحاسبي</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">التاريخ</Label>
                    <Input id="date" type="date" className="border-gold-200 focus:border-gold-400" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference">المرجع</Label>
                    <Input id="reference" placeholder="رقم المرجع" className="border-gold-200 focus:border-gold-400" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">العملة</Label>
                    <Select>
                      <SelectTrigger className="border-gold-200 focus:border-gold-400">
                        <SelectValue placeholder="اختر العملة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">دولار أمريكي</SelectItem>
                        <SelectItem value="LYD">دينار ليبي</SelectItem>
                        <SelectItem value="CNY">يوان صيني</SelectItem>
                        <SelectItem value="EUR">يورو</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">البيان</Label>
                  <Textarea
                    id="description"
                    placeholder="وصف القيد المحاسبي"
                    className="border-gold-200 focus:border-gold-400"
                  />
                </div>

                {/* Journal Entry Lines */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold gold-text">تفاصيل القيد</h3>
                  <div className="border border-gold-200 rounded-lg p-4 space-y-4 bg-gradient-to-r from-gold-50/30 to-amber-50/30">
                     <div className="grid grid-cols-5 gap-4 font-medium text-sm text-slate-700 bg-gold-100 p-3 rounded-lg">
                      <div>الحساب</div>
                      <div>رقم الحساب</div>
                      <div>مدين</div>
                      <div>دائن</div>
                      <div>إجراءات</div>
                    </div>

                    {journalLines.map((line, index) => (
                      <div key={index} className="grid grid-cols-5 gap-4">
                        <Select value={line.accountId} onValueChange={(v) => {
                          const newLines = [...journalLines]
                          newLines[index].accountId = v
                          setJournalLines(newLines)
                        }}>
                          <SelectTrigger className="border-gold-200 focus:border-gold-400">
                            <SelectValue placeholder="اختر الحساب" />
                          </SelectTrigger>
                          <SelectContent>
                            {chartOfAccounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input placeholder="رقم الحساب" value={chartOfAccounts.find(a => a.id === line.accountId)?.code || ''} disabled className="bg-gray-50 border-gold-200" />
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={line.debit}
                          onChange={(e) => {
                            const newLines = [...journalLines]
                            newLines[index].debit = e.target.value
                            setJournalLines(newLines)
                          }}
                          className="border-gold-200 focus:border-gold-400"
                        />
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={line.credit}
                          onChange={(e) => {
                            const newLines = [...journalLines]
                            newLines[index].credit = e.target.value
                            setJournalLines(newLines)
                          }}
                          className="border-gold-200 focus:border-gold-400"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeJournalLine(index)}
                          disabled={journalLines.length <= 2}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          حذف
                        </Button>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-gold-300 hover:bg-gold-50"
                      onClick={addJournalLine}
                    >
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة سطر جديد
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-6 bg-gradient-to-r from-slate-50 to-gold-50 rounded-lg border border-gold-200">
                    <div className="text-sm space-y-1">
                      <span className="font-medium text-slate-700">إجمالي المدين: </span>
                      <span className="text-green-600 font-bold text-lg">${totalDebit.toFixed(2)}</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <span className="font-medium text-slate-700">إجمالي الدائن: </span>
                      <span className="text-red-600 font-bold text-lg">${totalCredit.toFixed(2)}</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <span className="font-medium text-slate-700">الفرق: </span>
                      <span className={`font-bold text-lg ${difference === 0 ? "text-green-600" : "text-red-600"}`}>
                        ${Math.abs(difference).toFixed(2)}
                      </span>
                      {difference === 0 && <CheckCircle className="h-5 w-5 text-green-600 inline ml-2" />}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
                    disabled={difference !== 0}
                  >
                    حفظ كمسودة
                  </Button>
                  <Button className="btn-gold" onClick={() => {
                    if (difference !== 0) return
                    const payload = {
                      date: new Date().toISOString().slice(0,10),
                      description: 'قيد محاسبي',
                      currency: 'LYD',
                      lines: journalLines.map(l => ({ accountId: l.accountId, debit: Number(l.debit) || 0, credit: Number(l.credit) || 0 }))
                    }
                    const res = tx.addEntry(payload)
                    if (res.ok) setIsCreateDialogOpen(false)
                  }} disabled={difference !== 0}>
                    حفظ وترحيل
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">إجمالي القيود</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{journalEntries.length}</div>
              <p className="text-sm text-blue-700 mt-1">قيد محاسبي</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">القيود المرحلة</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {journalEntries.filter((entry) => entry.status === "مرحل").length}
              </div>
              <p className="text-sm text-green-700 mt-1">قيد مرحل</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">المسودات</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                <Edit className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {journalEntries.filter((entry) => entry.status === "مسودة").length}
              </div>
              <p className="text-sm text-amber-700 mt-1">قيد مسودة</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">إجمالي المبالغ</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                <Calculator className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                ${journalEntries.reduce((sum, entry) => sum + Number.parseFloat(entry.totalDebit), 0).toLocaleString()}
              </div>
              <p className="text-sm text-purple-700 mt-1">إجمالي القيود</p>
            </CardContent>
          </Card>
        </div>

        {/* Journal Entries List */}
        <Card className="card-premium">
          <CardHeader className="border-b border-gold-100">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center shadow-gold">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="gold-text">القيود اليومية</span>
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">جميع القيود المحاسبية المسجلة</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في القيود..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 border-gold-200 focus:border-gold-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 border-gold-200 focus:border-gold-400">
                  <SelectValue placeholder="تصفية حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="مرحل">مرحل</SelectItem>
                  <SelectItem value="مسودة">مسودة</SelectItem>
                  <SelectItem value="ملغي">ملغي</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-gold-300 hover:bg-gold-50 bg-transparent">
                <Filter className="h-4 w-4 ml-2" />
                تصفية متقدمة
              </Button>
            </div>

            <div className="space-y-6">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="border border-gold-200 rounded-xl p-6 space-y-4 bg-gradient-to-r from-white to-gold-50/30 hover:shadow-gold transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="font-bold text-xl text-slate-800">{entry.id}</div>
                      <div className="text-sm text-slate-600">{entry.date}</div>
                      <div className="text-sm text-slate-600">المرجع: {entry.reference}</div>
                      <Badge className={getStatusColor(entry.status)}>{entry.status}</Badge>
                      <Badge variant="outline" className="border-gold-300 text-gold-700">
                        {entry.currency}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-slate-600">إجمالي المدين</div>
                        <div className="font-bold text-green-600">${entry.totalDebit}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-600">إجمالي الدائن</div>
                        <div className="font-bold text-red-600">${entry.totalCredit}</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {entry.description}
                  </div>

                  <div className="rounded-lg border border-gold-200 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gradient-to-r from-gold-50 to-amber-50">
                        <TableRow className="border-gold-200">
                          <TableHead className="text-slate-700 font-semibold">رقم الحساب</TableHead>
                          <TableHead className="text-slate-700 font-semibold">اسم الحساب</TableHead>
                          <TableHead className="text-slate-700 font-semibold">مدين</TableHead>
                          <TableHead className="text-slate-700 font-semibold">دائن</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entry.entries.map((line, index) => (
                          <TableRow key={index} className="border-gold-100">
                            <TableCell className="font-bold text-slate-800">{line.account}</TableCell>
                            <TableCell className="text-slate-700">{line.accountName}</TableCell>
                            <TableCell className="text-green-600 font-bold">{line.debit && `$${line.debit}`}</TableCell>
                            <TableCell className="text-red-600 font-bold">{line.credit && `$${line.credit}`}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gold-200">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="hover:bg-gold-100">
                        <Eye className="h-4 w-4 ml-2" />
                        عرض
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-gold-100">
                        <Edit className="h-4 w-4 ml-2" />
                        تعديل
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 ml-2" />
                        حذف
                      </Button>
                    </div>
                    <div className="text-xs text-slate-500">آخر تعديل: {entry.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
