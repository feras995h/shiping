"use client"

import { useState } from "react"
import { Package, Plus, Search, Filter, Send, Eye, Edit, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react"
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

export default function PurchaseOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [orderItems, setOrderItems] = useState([{ description: "", quantity: "", unitPrice: "", total: "" }])

  const purchaseOrders = [
    {
      id: "PO-001",
      supplier: "شركة الشحن البحري الصينية",
      date: "2024-01-15",
      deliveryDate: "2024-02-15",
      amount: "$25,000",
      status: "معتمد",
      items: [
        { description: "خدمات شحن بحري", quantity: 1, unitPrice: "20,000", total: "20,000" },
        { description: "تأمين الشحنة", quantity: 1, unitPrice: "3,000", total: "3,000" },
        { description: "رسوم إضافية", quantity: 1, unitPrice: "2,000", total: "2,000" },
      ],
    },
    {
      id: "PO-002",
      supplier: "مكتب التخليص الجمركي",
      date: "2024-01-14",
      deliveryDate: "2024-01-20",
      amount: "$8,500",
      status: "مرسل",
      items: [
        { description: "خدمات التخليص الجمركي", quantity: 1, unitPrice: "7,000", total: "7,000" },
        { description: "رسوم حكومية", quantity: 1, unitPrice: "1,500", total: "1,500" },
      ],
    },
    {
      id: "PO-003",
      supplier: "شركة النقل البري",
      date: "2024-01-13",
      deliveryDate: "2024-01-25",
      amount: "$12,300",
      status: "مسودة",
      items: [
        { description: "نقل بري داخلي", quantity: 1, unitPrice: "10,000", total: "10,000" },
        { description: "خدمات التحميل والتفريغ", quantity: 1, unitPrice: "2,300", total: "2,300" },
      ],
    },
    {
      id: "PO-004",
      supplier: "مكتب الخدمات اللوجستية",
      date: "2024-01-12",
      deliveryDate: "2024-01-30",
      amount: "$15,800",
      status: "مكتمل",
      items: [
        { description: "خدمات التخزين", quantity: 30, unitPrice: "200", total: "6,000" },
        { description: "خدمات التعبئة والتغليف", quantity: 1, unitPrice: "4,800", total: "4,800" },
        { description: "خدمات لوجستية أخرى", quantity: 1, unitPrice: "5,000", total: "5,000" },
      ],
    },
  ]

  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "معتمد":
        return "bg-gradient-to-r from-green-400 to-green-600 text-white"
      case "مرسل":
        return "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
      case "مسودة":
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
      case "مكتمل":
        return "bg-gradient-to-r from-purple-400 to-purple-600 text-white"
      case "ملغي":
        return "bg-gradient-to-r from-red-400 to-red-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "معتمد":
        return CheckCircle
      case "مرسل":
        return Send
      case "مسودة":
        return Edit
      case "مكتمل":
        return Package
      case "ملغي":
        return AlertCircle
      default:
        return Clock
    }
  }

  const addOrderItem = () => {
    setOrderItems([...orderItems, { description: "", quantity: "", unitPrice: "", total: "" }])
  }

  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index))
    }
  }

  const calculateItemTotal = (quantity: string, unitPrice: string) => {
    const qty = Number.parseFloat(quantity) || 0
    const price = Number.parseFloat(unitPrice) || 0
    return (qty * price).toFixed(2)
  }

  const calculateOrderTotal = () => {
    return orderItems
      .reduce((sum, item) => {
        const qty = Number.parseFloat(item.quantity) || 0
        const price = Number.parseFloat(item.unitPrice) || 0
        return sum + qty * price
      }, 0)
      .toFixed(2)
  }

  const handleViewOrder = (orderId: string) => {
    // عرض أمر الشراء
    setSelectedOrder(purchaseOrders.find(o => o.id === orderId))
    setIsViewDialogOpen(true)
  }

  const handleEditOrder = (orderId: string) => {
    // تعديل أمر الشراء
    setSelectedOrder(purchaseOrders.find(o => o.id === orderId))
    setIsEditDialogOpen(true)
  }

  const handleDeleteOrder = (orderId: string) => {
    // حذف أمر الشراء
    setSelectedOrder(purchaseOrders.find(o => o.id === orderId))
    setIsDeleteDialogOpen(true)
  }

  const handleSendOrder = (orderId: string) => {
    // إرسال أمر الشراء
    // يمكن إضافة منطق إرسال البريد الإلكتروني هنا
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-gold-500" />
              <h1 className="text-4xl font-bold gold-text">أوامر الشراء</h1>
            </div>
            <p className="text-lg text-slate-600">إدارة أوامر الشراء والخدمات من الموردين</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gold">
                <Plus className="h-4 w-4 ml-2" />
                أمر شراء جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إنشاء أمر شراء جديد</DialogTitle>
                <DialogDescription>أدخل تفاصيل أمر الشراء</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier">المورد</Label>
                    <Select>
                      <SelectTrigger className="border-gold-200 focus:border-gold-400">
                        <SelectValue placeholder="اختر المورد" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supplier1">شركة الشحن البحري الصينية</SelectItem>
                        <SelectItem value="supplier2">مكتب التخليص الجمركي</SelectItem>
                        <SelectItem value="supplier3">شركة النقل البري</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate">تاريخ التسليم المطلوب</Label>
                    <Input id="deliveryDate" type="date" className="border-gold-200 focus:border-gold-400" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold gold-text">بنود أمر الشراء</h3>
                  <div className="border border-gold-200 rounded-lg p-4 space-y-4 bg-gradient-to-r from-gold-50/30 to-amber-50/30">
                    <div className="grid grid-cols-5 gap-4 font-medium text-sm text-slate-700 bg-gold-100 p-3 rounded-lg">
                      <div>الوصف</div>
                      <div>الكمية</div>
                      <div>سعر الوحدة</div>
                      <div>المجموع</div>
                      <div>إجراءات</div>
                    </div>

                    {orderItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-5 gap-4">
                        <Input
                          placeholder="وصف الخدمة أو المنتج"
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...orderItems]
                            newItems[index].description = e.target.value
                            setOrderItems(newItems)
                          }}
                          className="border-gold-200 focus:border-gold-400"
                        />
                        <Input
                          type="number"
                          placeholder="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...orderItems]
                            newItems[index].quantity = e.target.value
                            newItems[index].total = calculateItemTotal(e.target.value, item.unitPrice)
                            setOrderItems(newItems)
                          }}
                          className="border-gold-200 focus:border-gold-400"
                        />
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={item.unitPrice}
                          onChange={(e) => {
                            const newItems = [...orderItems]
                            newItems[index].unitPrice = e.target.value
                            newItems[index].total = calculateItemTotal(item.quantity, e.target.value)
                            setOrderItems(newItems)
                          }}
                          className="border-gold-200 focus:border-gold-400"
                        />
                        <Input
                          placeholder="0.00"
                          value={calculateItemTotal(item.quantity, item.unitPrice)}
                          disabled
                          className="bg-gray-50 border-gold-200"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeOrderItem(index)}
                          disabled={orderItems.length <= 1}
                          className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                        >
                          حذف
                        </Button>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-gold-300 hover:bg-gold-50"
                      onClick={addOrderItem}
                    >
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة بند جديد
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-50 to-gold-50 rounded-lg border border-gold-200">
                    <span className="font-bold text-slate-800 text-lg">إجمالي أمر الشراء:</span>
                    <span className="font-bold text-gold-600 text-2xl">${calculateOrderTotal()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات وشروط خاصة</Label>
                  <Textarea
                    id="notes"
                    placeholder="ملاحظات إضافية أو شروط خاصة لأمر الشراء"
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
              <CardTitle className="text-sm font-medium text-slate-700">إجمالي الأوامر</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <Package className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{purchaseOrders.length}</div>
              <p className="text-sm text-blue-700 mt-1">أمر شراء</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">الأوامر المعتمدة</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {purchaseOrders.filter((order) => order.status === "معتمد").length}
              </div>
              <p className="text-sm text-green-700 mt-1">أمر معتمد</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">قيمة الأوامر</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                <Package className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                $
                {purchaseOrders
                  .reduce((sum, order) => sum + Number.parseFloat(order.amount.replace(/[$,]/g, "")), 0)
                  .toLocaleString()}
              </div>
              <p className="text-sm text-purple-700 mt-1">إجمالي القيمة</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">الأوامر المكتملة</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                <Package className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {purchaseOrders.filter((order) => order.status === "مكتمل").length}
              </div>
              <p className="text-sm text-amber-700 mt-1">أمر مكتمل</p>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Orders List */}
        <Card className="card-premium">
          <CardHeader className="border-b border-gold-100">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center shadow-gold">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="gold-text">أوامر الشراء</span>
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">جميع أوامر الشراء والخدمات</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في أوامر الشراء..."
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
                  <SelectItem value="معتمد">معتمد</SelectItem>
                  <SelectItem value="مكتمل">مكتمل</SelectItem>
                  <SelectItem value="ملغي">ملغي</SelectItem>
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
                    <TableHead className="text-slate-700 font-semibold">رقم الأمر</TableHead>
                    <TableHead className="text-slate-700 font-semibold">المورد</TableHead>
                    <TableHead className="text-slate-700 font-semibold">التاريخ</TableHead>
                    <TableHead className="text-slate-700 font-semibold">تاريخ التسليم</TableHead>
                    <TableHead className="text-slate-700 font-semibold">المبلغ</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الحالة</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status)
                    return (
                      <TableRow key={order.id} className="border-gold-100 hover:bg-gold-50/30 transition-colors">
                        <TableCell className="font-bold text-slate-800">{order.id}</TableCell>
                        <TableCell className="font-medium text-slate-700">{order.supplier}</TableCell>
                        <TableCell className="text-slate-600">{order.date}</TableCell>
                        <TableCell className="text-slate-600">{order.deliveryDate}</TableCell>
                        <TableCell className="font-bold text-emerald-600">{order.amount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-gold-100"
                              onClick={() => handleViewOrder(order.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-gold-100"
                              onClick={() => handleEditOrder(order.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-blue-100 text-blue-600"
                              onClick={() => handleSendOrder(order.id)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
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
