"use client"

import { useState } from "react"
import {
  FileText,
  Building2,
  DollarSign,
  Calendar,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Package,
  Globe,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Layout from "@/components/layout"

export default function SupplierInvoices() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const supplierInvoices = [
    {
      id: "SI-001",
      supplier: "شركة شنغهاي للتجارة",
      invoiceNumber: "INV-CHN-2024-001",
      amount: "125,000 ¥",
      amountLYD: "45,200 د.ل",
      status: "مدفوعة",
      dueDate: "2024-01-20",
      issueDate: "2024-01-05",
      description: "شحنة إلكترونيات متنوعة",
      currency: "CNY",
      exchangeRate: 0.362,
    },
    {
      id: "SI-002",
      supplier: "مصنع قوانغتشو للمنسوجات",
      invoiceNumber: "INV-GZ-2024-002",
      amount: "89,500 ¥",
      amountLYD: "32,400 د.ل",
      status: "معلقة",
      dueDate: "2024-01-25",
      issueDate: "2024-01-10",
      description: "أقمشة وملابس جاهزة",
      currency: "CNY",
      exchangeRate: 0.362,
    },
    {
      id: "SI-003",
      supplier: "شركة شنتشن للإلكترونيات",
      invoiceNumber: "INV-SZ-2024-003",
      amount: "156,800 ¥",
      amountLYD: "56,800 د.ل",
      status: "متأخرة",
      dueDate: "2024-01-15",
      issueDate: "2024-01-01",
      description: "هواتف ذكية وأجهزة لوحية",
      currency: "CNY",
      exchangeRate: 0.362,
    },
    {
      id: "SI-004",
      supplier: "مصنع نينغبو للأثاث",
      invoiceNumber: "INV-NB-2024-004",
      amount: "67,200 ¥",
      amountLYD: "24,300 د.ل",
      status: "مدفوعة",
      dueDate: "2024-01-30",
      issueDate: "2024-01-12",
      description: "أثاث مكتبي ومنزلي",
      currency: "CNY",
      exchangeRate: 0.362,
    },
  ]

  const stats = [
    {
      title: "إجمالي الفواتير",
      value: "4",
      change: "+25%",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "from-blue-400 to-blue-600",
    },
    {
      title: "المدفوعات",
      value: "2",
      change: "+50%",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "from-emerald-400 to-emerald-600",
    },
    {
      title: "المعلقة",
      value: "1",
      change: "-20%",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "from-amber-400 to-amber-600",
    },
    {
      title: "المتأخرة",
      value: "1",
      change: "+100%",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "from-red-400 to-red-600",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "مدفوعة":
        return <Badge className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">مدفوعة</Badge>
      case "معلقة":
        return <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">معلقة</Badge>
      case "متأخرة":
        return <Badge className="bg-gradient-to-r from-red-400 to-red-600 text-white">متأخرة</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredInvoices = supplierInvoices.filter((invoice) => {
    const matchesSearch = invoice.supplier.includes(searchQuery) || 
                         invoice.invoiceNumber.includes(searchQuery) ||
                         invoice.description.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">فواتير الموردين</h1>
            </div>
            <p className="text-slate-600">إدارة فواتير الموردين الصينيين والمدفوعات</p>
          </div>
          <div className="flex gap-2">
            <Button className="btn-gold">
              <Plus className="h-4 w-4 ml-2" />
              فاتورة جديدة
            </Button>
            <Button variant="outline" className="border-gold-300 hover:bg-gold-50">
              <Download className="h-4 w-4 ml-2" />
              تصدير
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

        {/* Filters and Search */}
        <Card className="card-premium">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="البحث في فواتير الموردين..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 border-gold-200 focus:border-gold-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 border-gold-200 focus:border-gold-400">
                  <SelectValue placeholder="حالة الفاتورة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="مدفوعة">مدفوعة</SelectItem>
                  <SelectItem value="معلقة">معلقة</SelectItem>
                  <SelectItem value="متأخرة">متأخرة</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-gold-300 hover:bg-gold-50">
                <Filter className="h-4 w-4 ml-2" />
                فلترة متقدمة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card className="card-premium hover-lift">
          <CardHeader className="border-b border-gold-100">
            <CardTitle className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-blue-600" />
              فواتير الموردين
            </CardTitle>
            <CardDescription>قائمة بجميع فواتير الموردين الصينيين</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold-100">
                    <TableHead className="text-slate-700 font-semibold">رقم الفاتورة</TableHead>
                    <TableHead className="text-slate-700 font-semibold">المورد</TableHead>
                    <TableHead className="text-slate-700 font-semibold">المبلغ (¥)</TableHead>
                    <TableHead className="text-slate-700 font-semibold">المبلغ (د.ل)</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الحالة</TableHead>
                    <TableHead className="text-slate-700 font-semibold">تاريخ الاستحقاق</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="border-gold-50 hover:bg-gold-50/30 transition-colors">
                      <TableCell className="font-medium text-slate-800">
                        <div>
                          <div className="font-bold">{invoice.id}</div>
                          <div className="text-xs text-slate-500">{invoice.invoiceNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-500" />
                          {invoice.supplier}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-blue-600">{invoice.amount}</TableCell>
                      <TableCell className="font-bold text-emerald-600">{invoice.amountLYD}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {invoice.dueDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-amber-50">
                            <Edit className="h-4 w-4 text-amber-600" />
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
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                ملخص المدفوعات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                  <p className="text-sm font-semibold text-emerald-800">إجمالي المدفوعات</p>
                  <p className="text-2xl font-bold text-emerald-600">69,500 د.ل</p>
                </div>
                <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                  <p className="text-sm font-semibold text-amber-800">المعلقة</p>
                  <p className="text-2xl font-bold text-amber-600">32,400 د.ل</p>
                </div>
                <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                  <p className="text-sm font-semibold text-red-800">المتأخرة</p>
                  <p className="text-2xl font-bold text-red-600">56,800 د.ل</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Package className="h-5 w-5 text-purple-600" />
                العملات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <div className="flex items-center gap-2">
                  <span className="text-lg">¥</span>
                  <span className="font-semibold text-blue-800">اليوان الصيني</span>
                </div>
                <span className="font-bold text-blue-600">0.362</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                <div className="flex items-center gap-2">
                  <span className="text-lg">$</span>
                  <span className="font-semibold text-green-800">الدولار الأمريكي</span>
                </div>
                <span className="font-bold text-green-600">1.35</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                <div className="flex items-center gap-2">
                  <span className="text-lg">€</span>
                  <span className="font-semibold text-purple-800">اليورو</span>
                </div>
                <span className="font-bold text-purple-600">1.48</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
} 