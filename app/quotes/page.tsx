"use client"

import { useState } from "react"
import { Receipt, Plus, Search, Filter, Send, Eye, Edit, Trash2, Clock, CheckCircle } from "lucide-react"
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

export default function QuotesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const quotes = [
    {
      id: "QT-001",
      client: "شركة التجارة الليبية",
      date: "2024-01-15",
      validUntil: "2024-02-15",
      amount: "$45,200",
      status: "مرسل",
      items: [
        { description: "شحن من شنغهاي إلى طرابلس", quantity: 1, rate: "40,000", amount: "40,000" },
        { description: "تأمين الشحنة", quantity: 1, rate: "2,000", amount: "2,000" },
        { description: "رسوم التخليص الجمركي", quantity: 1, rate: "3,200", amount: "3,200" },
      ],
    },
    {
      id: "QT-002",
      client: "مؤسسة الاستيراد الحديثة",
      date: "2024-01-14",
      validUntil: "2024-02-14",
      amount: "$32,800",
      status: "مقبول",
      items: [
        { description: "شحن من قوانغتشو إلى بنغازي", quantity: 1, rate: "28,000", amount: "28,000" },
        { description: "رسوم إضافية", quantity: 1, rate: "4,800", amount: "4,800" },
      ],
    },
    {
      id: "QT-003",
      client: "شركة النقل السريع",
      date: "2024-01-13",
      validUntil: "2024-02-13",
      amount: "$28,500",
      status: "مسودة",
      items: [
        { description: "شحن من شنتشن إلى مصراتة", quantity: 1, rate: "25,000", amount: "25,000" },
        { description: "خدمات إضافية", quantity: 1, rate: "3,500", amount: "3,500" },
      ],
    },
    {
      id: "QT-004",
      client: "التجارة الدولية المحدودة",
      date: "2024-01-12",
      validUntil: "2024-02-12",
      amount: "$67,300",
      status: "مرفوض",
      items: [
        { description: "شحن من بكين إلى طرابلس", quantity: 1, rate: "60,000", amount: "60,000" },
        { description: "خدمات خاصة", quantity: 1, rate: "7,300", amount: "7,300" },
      ],
    },
  ]

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مقبول":
        return "bg-gradient-to-r from-green-400 to-green-600 text-white"
      case "مرسل":
        return "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
      case "مسودة":
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
      case "مرفوض":
        return "bg-gradient-to-r from-red-400 to-red-600 text-white"
      case "منتهي الصلاحية":
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "مقبول":
        return CheckCircle
      case "مرسل":
        return Send
      case "مسودة":
        return Edit
      case "مرفوض":
        return Trash2
      case "منتهي الصلاحية":
        return Clock
      default:
        return Receipt
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Receipt className="h-8 w-8 text-gold-500" />
              <h1 className="text-4xl font-bold gold-text">عروض الأسعار</h1>
            </div>
            <p className="text-lg text-slate-600">إدارة عروض الأسعار المقدمة للعملاء</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gold">
                <Plus className="h-4 w-4 ml-2" />
                عرض سعر جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إنشاء عرض سعر جديد</DialogTitle>
                <DialogDescription>أدخل تفاصيل عرض السعر</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">العميل</Label>
                    <Select>
                      <SelectTrigger className="border-gold-200 focus:border-gold-400">
                        <SelectValue placeholder="اختر العميل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client1">شركة التجارة الليبية</SelectItem>
                        <SelectItem value="client2">مؤسسة الاستيراد الحديثة</SelectItem>
                        <SelectItem value="client3">شركة النقل السريع</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validUntil">صالح حتى</Label>
                    <Input id="validUntil" type="date" className="border-gold-200 focus:border-gold-400" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold gold-text">بنود عرض السعر</h3>
                  <div className="border border-gold-200 rounded-lg p-4 space-y-4 bg-gradient-to-r from-gold-50/30 to-amber-50/30">
                    <div className="grid grid-cols-5 gap-4 font-medium text-sm text-slate-700 bg-gold-100 p-3 rounded-lg">
                      <div>الوصف</div>
                      <div>الكمية</div>
                      <div>السعر</div>
                      <div>المجموع</div>
                      <div>إجراءات</div>
                    </div>

                    <div className="grid grid-cols-5 gap-4">
                      <Input placeholder="وصف الخدمة" className="border-gold-200 focus:border-gold-400" />
                      <Input type="number" placeholder="1" className="border-gold-200 focus:border-gold-400" />
                      <Input type="number" placeholder="0.00" className="border-gold-200 focus:border-gold-400" />
                      <Input placeholder="0.00" disabled className="bg-gray-50 border-gold-200" />
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                      >
                        حذف
                      </Button>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent border-gold-300 hover:bg-gold-50">
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة بند جديد
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea
                    id="notes"
                    placeholder="ملاحظات إضافية أو شروط خاصة"
                    className="border-gold-200 focus:border-gold-400"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
                  >
                    حفظ كمسودة
                  </Button>
                  <Button className="btn-gold" onClick={() => setIsCreateDialogOpen(false)}>
                    إنشاء وإرسال
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">إجمالي العروض</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <Receipt className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{quotes.length}</div>
              <p className="text-sm text-blue-700 mt-1">عرض سعر</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">العروض المقبولة</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {quotes.filter((q) => q.status === "مقبول").length}
              </div>
              <p className="text-sm text-green-700 mt-1">عرض مقبول</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">قيمة العروض</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                <Receipt className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                ${quotes.reduce((sum, q) => sum + Number.parseFloat(q.amount.replace(/[$,]/g, "")), 0).toLocaleString()}
              </div>
              <p className="text-sm text-purple-700 mt-1">إجمالي القيمة</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">معدل القبول</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                <Receipt className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {Math.round((quotes.filter((q) => q.status === "مقبول").length / quotes.length) * 100)}%
              </div>
              <p className="text-sm text-amber-700 mt-1">معدل النجاح</p>
            </CardContent>
          </Card>
        </div>

        {/* Quotes List */}
        <Card className="card-premium">
          <CardHeader className="border-b border-gold-100">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center shadow-gold">
                <Receipt className="h-5 w-5 text-white" />
              </div>
              <span className="gold-text">عروض الأسعار</span>
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">جميع عروض الأسعار المقدمة للعملاء</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في عروض الأسعار..."
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
                  <SelectItem value="مسودة">مسودة</SelectItem>
                  <SelectItem value="مرسل">مرسل</SelectItem>
                  <SelectItem value="مقبول">مقبول</SelectItem>
                  <SelectItem value="مرفوض">مرفوض</SelectItem>
                  <SelectItem value="منتهي الصلاحية">منتهي الصلاحية</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-gold-300 hover:bg-gold-50 bg-transparent">
                <Filter className="h-4 w-4 ml-2" />
                تصفية متقدمة
              </Button>
            </div>

            <div className="rounded-lg border border-gold-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-gold-50 to-amber-50">
                  <TableRow className="border-gold-200">
                    <TableHead className="text-slate-700 font-semibold">رقم العرض</TableHead>
                    <TableHead className="text-slate-700 font-semibold">العميل</TableHead>
                    <TableHead className="text-slate-700 font-semibold">التاريخ</TableHead>
                    <TableHead className="text-slate-700 font-semibold">صالح حتى</TableHead>
                    <TableHead className="text-slate-700 font-semibold">المبلغ</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الحالة</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.map((quote) => {
                    const StatusIcon = getStatusIcon(quote.status)
                    return (
                      <TableRow key={quote.id} className="border-gold-100 hover:bg-gold-50/30 transition-colors">
                        <TableCell className="font-bold text-slate-800">{quote.id}</TableCell>
                        <TableCell className="font-medium text-slate-700">{quote.client}</TableCell>
                        <TableCell className="text-slate-600">{quote.date}</TableCell>
                        <TableCell className="text-slate-600">{quote.validUntil}</TableCell>
                        <TableCell className="font-bold text-emerald-600">{quote.amount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="hover:bg-gold-100">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="hover:bg-gold-100">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="hover:bg-blue-100 text-blue-600">
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
