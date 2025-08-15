"use client"

import { useState } from "react"
import { FileText, Plus, Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react"
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

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const invoices = [
    {
      id: "INV-001",
      client: "شركة التجارة الليبية",
      amount: "$45,200",
      status: "مدفوعة",
      date: "2024-01-15",
      dueDate: "2024-01-30",
      shipment: "SH-001",
      description: "شحنة إلكترونيات من شنغهاي إلى طرابلس",
    },
    {
      id: "INV-002",
      client: "مؤسسة الاستيراد الحديثة",
      amount: "$32,800",
      status: "معلقة",
      date: "2024-01-14",
      dueDate: "2024-01-29",
      shipment: "SH-002",
      description: "شحنة منسوجات من قوانغتشو إلى بنغازي",
    },
    {
      id: "INV-003",
      client: "شركة النقل السريع",
      amount: "$28,500",
      status: "مدفوعة",
      date: "2024-01-13",
      dueDate: "2024-01-28",
      shipment: "SH-003",
      description: "شحنة قطع غيار من شنتشن إلى مصراتة",
    },
    {
      id: "INV-004",
      client: "التجارة الدولية المحدودة",
      amount: "$67,300",
      status: "متأخرة",
      date: "2024-01-12",
      dueDate: "2024-01-27",
      shipment: "SH-004",
      description: "شحنة أجهزة طبية من بكين إلى طرابلس",
    },
    {
      id: "INV-005",
      client: "شركة الاستيراد الذهبي",
      amount: "$54,900",
      status: "مسودة",
      date: "2024-01-11",
      dueDate: "2024-01-26",
      shipment: "SH-005",
      description: "شحنة مواد بناء من تيانجين إلى بنغازي",
    },
  ]

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مدفوعة":
        return "default"
      case "معلقة":
        return "secondary"
      case "متأخرة":
        return "destructive"
      case "مسودة":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">إدارة الفواتير</h1>
            <p className="text-muted-foreground">إدارة وتتبع جميع الفواتير والمدفوعات</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                فاتورة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إنشاء فاتورة جديدة</DialogTitle>
                <DialogDescription>أدخل تفاصيل الفاتورة الجديدة</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">العميل</Label>
                    <Select>
                      <SelectTrigger>
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
                    <Label htmlFor="shipment">الشحنة</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الشحنة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sh1">SH-001 - شنغهاي إلى طرابلس</SelectItem>
                        <SelectItem value="sh2">SH-002 - قوانغتشو إلى بنغازي</SelectItem>
                        <SelectItem value="sh3">SH-003 - شنتشن إلى مصراتة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">المبلغ</Label>
                    <Input id="amount" placeholder="0.00" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                    <Input id="dueDate" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea id="description" placeholder="وصف الخدمة أو البضاعة" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>إنشاء الفاتورة</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الفواتير</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">+12% من الشهر الماضي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الفواتير المدفوعة</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">189</div>
              <p className="text-xs text-muted-foreground">76.5% من الإجمالي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الفواتير المعلقة</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">43</div>
              <p className="text-xs text-muted-foreground">17.4% من الإجمالي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الفواتير المتأخرة</CardTitle>
              <FileText className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">6.1% من الإجمالي</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الفواتير</CardTitle>
            <CardDescription>إدارة وتتبع جميع الفواتير</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في الفواتير..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="تصفية حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="مدفوعة">مدفوعة</SelectItem>
                  <SelectItem value="معلقة">معلقة</SelectItem>
                  <SelectItem value="متأخرة">متأخرة</SelectItem>
                  <SelectItem value="مسودة">مسودة</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 ml-2" />
                تصفية متقدمة
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الفاتورة</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الإصدار</TableHead>
                  <TableHead>تاريخ الاستحقاق</TableHead>
                  <TableHead>الشحنة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell className="font-medium">{invoice.amount}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>{invoice.shipment}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
