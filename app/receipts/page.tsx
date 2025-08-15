"use client"

import { useState } from "react"
import { Plus, Search, Filter, Edit, Trash2, Eye, DollarSign, CreditCard, Calendar, TrendingUp, Users, FileText, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Layout from "@/components/layout"
import { useVouchers, useAppStore } from "@/lib/store"
import Link from "next/link"

export default function ReceiptsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const vouchers = useVouchers()
  const { actions } = useAppStore()

  // Filter only receipt vouchers
  const receipts = vouchers.filter(voucher => voucher.type === 'receipt').map(voucher => ({
    id: voucher.voucherNumber,
    client: voucher.clientName || '',
    invoiceNumber: voucher.shipmentId || '-',
    amount: `${voucher.amount.toLocaleString()} ${voucher.currency}`,
    method: voucher.paymentMethod === 'cash' ? 'نقدي' :
            voucher.paymentMethod === 'check' ? 'شيك' : 'غير محدد',
    status: voucher.status === 'approved' ? 'مكتمل' :
            voucher.status === 'paid' ? 'مكتمل' :
            voucher.status === 'draft' ? 'معلق' : 'ملغي',
    date: voucher.date,
    reference: voucher.reference || voucher.voucherNumber
  }))

  // Legacy static data for demonstration (can be removed later)
  const legacyReceipts = [
    {
      id: "REC-001",
      client: "شركة التجارة الليبية",
      invoiceNumber: "INV-001",
      amount: "45,200 د.ل",
      method: "نقدي",
      status: "مكتمل",
      date: "2024-01-15",
      reference: "CASH-2024-001"
    },
    {
      id: "REC-002",
      client: "مؤسسة الاستيراد الحديثة",
      invoiceNumber: "INV-002",
      amount: "32,800 د.ل",
      method: "نقدي",
      status: "مكتمل",
      date: "2024-01-14",
      reference: "CASH-2024-001"
    },
    {
      id: "REC-003",
      client: "شركة النقل السريع",
      invoiceNumber: "INV-003",
      amount: "28,500 د.ل",
      method: "شيك",
      status: "معلق",
      date: "2024-01-13",
      reference: "CHK-2024-001"
    },
    {
      id: "REC-004",
      client: "التجارة الدولية المحدودة",
      invoiceNumber: "INV-004",
      amount: "67,300 د.ل",
      method: "شيك",
      status: "مكتمل",
      date: "2024-01-12",
      reference: "CHK-2024-002"
    },
    {
      id: "REC-005",
      client: "شركة الخدمات اللوجستية",
      invoiceNumber: "INV-005",
      amount: "38,900 د.ل",
      method: "نقدي",
      status: "مكتمل",
      date: "2024-01-11",
      reference: "CASH-2024-002"
    }
  ]

  // Combine voucher receipts with legacy data
  const allReceipts = [...receipts, ...legacyReceipts]

  const filteredReceipts = allReceipts.filter((receipt) => {
    const matchesSearch =
      receipt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || receipt.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مكتمل":
        return "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white"
      case "معلق":
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
      case "ملغي":
        return "bg-gradient-to-r from-red-400 to-red-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "نقدي":
        return "bg-gradient-to-r from-green-400 to-green-600 text-white"
      case "شيك":
        return "bg-gradient-to-r from-purple-400 to-purple-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
    }
  }

  const stats = [
    {
      title: "إجمالي المقبوضات",
      value: "847,200 د.ل",
      change: "+15.2%",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "from-emerald-400 to-emerald-600",
      description: "من الشهر الماضي"
    },
    {
      title: "المقبوضات المكتملة",
      value: "184",
      change: "+12",
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "from-blue-400 to-blue-600",
      description: "دفعة هذا الشهر"
    },
    {
      title: "المقبوضات المعلقة",
      value: "23",
      change: "-5",
      icon: Calendar,
      color: "text-amber-600",
      bgColor: "from-amber-400 to-amber-600",
      description: "من الشهر الماضي"
    },
    {
      title: "العملاء النشطون",
      value: "89",
      change: "+8",
      icon: Users,
      color: "text-purple-600",
      bgColor: "from-purple-400 to-purple-600",
      description: "من الشهر الماضي"
    },
  ]

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-gold-500" />
              <h1 className="text-2xl sm:text-4xl font-bold gold-text">المقبوضات</h1>
            </div>
            <p className="text-base sm:text-lg text-slate-600">إدارة مقبوضات العملاء</p>
          </div>
          <div className="flex gap-2">
            <Link href="/vouchers">
              <Button variant="outline" className="border-gold-300 hover:bg-gold-50">
                <FileText className="h-4 w-4 ml-2" />
                إدارة السندات
              </Button>
            </Link>
            <Button className="btn-gold">
              <Plus className="h-4 w-4 ml-2" />
              تسجيل مقبوض جديد
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="card-premium hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">{stat.title}</CardTitle>
                <div
                  className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r ${stat.bgColor} flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                  <p
                    className={`text-xs sm:text-sm font-medium ${stat.change.startsWith("+") ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {stat.change} {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Receipts Table */}
        <Card className="card-premium hover-lift">
          <CardHeader className="border-b border-gold-100">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <span className="gold-text">المقبوضات</span>
            </CardTitle>
            <CardDescription className="text-slate-600">جميع مقبوضات العملاء</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="البحث في المقبوضات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 border-gold-200 focus:border-gold-400"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 border-gold-200 focus:border-gold-400">
                    <SelectValue placeholder="جميع الحالات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="مكتمل">مكتمل</SelectItem>
                    <SelectItem value="معلق">معلق</SelectItem>
                    <SelectItem value="ملغي">ملغي</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-gold-200 hover:bg-gold-50">
                  <Filter className="h-4 w-4 ml-2" />
                  تصفية متقدمة
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-gold-100 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gold-50 to-amber-50 border-gold-100">
                    <TableHead className="text-slate-700 font-semibold text-right">رقم المقبوض</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-right">العميل</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-right">رقم الفاتورة</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-right">المبلغ</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-right">طريقة الدفع</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-right">الحالة</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-right">التاريخ</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-right">المرجع</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceipts.map((receipt) => (
                    <TableRow key={receipt.id} className="border-gold-50 hover:bg-gold-50/30 transition-colors">
                      <TableCell className="font-mono font-medium text-slate-800 text-right">
                        {receipt.id}
                      </TableCell>
                      <TableCell className="text-slate-700 text-right">
                        <div className="font-medium">{receipt.client}</div>
                      </TableCell>
                      <TableCell className="font-mono text-slate-700 text-right">
                        {receipt.invoiceNumber}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-emerald-600 text-right">
                        {receipt.amount}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getMethodColor(receipt.method)} text-xs`}>
                          {receipt.method}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(receipt.status)} text-xs`}>
                          {receipt.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-700 text-right">
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3 text-slate-500" />
                          <span>{receipt.date}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-600 text-right">
                        {receipt.reference}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gold-50">
                            <Edit className="h-4 w-4 text-gold-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Info */}
            <div className="flex items-center justify-between mt-6 text-sm text-slate-600">
              <div>عرض {filteredReceipts.length} من {receipts.length} مقبوض</div>
              <div className="flex items-center gap-2">
                <span>الصفحة 1 من 1</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
} 