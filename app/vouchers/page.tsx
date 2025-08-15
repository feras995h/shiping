"use client"

import { useState } from "react"
import { Plus, Search, Filter, Edit, Trash2, Eye, FileText, Download, Calendar, DollarSign, Package, CheckCircle, Clock, AlertCircle, X, Truck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Layout from "@/components/layout"
import { useVouchers, useShipments, useClients, useWarehouseShipments, useReceiptVouchers, useDeliveryVouchers, useAppStore } from "@/lib/store"

export default function VouchersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedVoucherType, setSelectedVoucherType] = useState<"receipt" | "delivery" | "payment" | "expense">("receipt")

  const vouchers = useVouchers()
  const shipments = useShipments()
  const clients = useClients()
  const warehouseShipments = useWarehouseShipments()
  const receiptVouchers = useReceiptVouchers()
  const deliveryVouchers = useDeliveryVouchers()
  const { actions } = useAppStore()

  // دمج جميع أنواع السندات والإيصالات
  const allDocuments = [
    ...vouchers.map(v => ({ ...v, documentType: 'voucher' })),
    ...receiptVouchers.map(rv => ({
      id: rv.id,
      voucherNumber: rv.id,
      type: 'warehouse_receipt',
      clientName: rv.clientName,
      amount: rv.items.reduce((sum, item) => sum + (item.value || 0), 0),
      currency: 'LYD',
      description: `إيصال استلام للشحنة ${rv.shipmentId}`,
      status: 'approved',
      date: rv.receivedDate,
      shipmentId: rv.shipmentId,
      documentType: 'receipt_voucher'
    })),
    ...deliveryVouchers.map(dv => ({
      id: dv.id,
      voucherNumber: dv.id,
      type: 'warehouse_delivery',
      clientName: dv.clientName,
      amount: dv.items.reduce((sum, item) => sum + (item.value || 0), 0),
      currency: 'LYD',
      description: `إيصال تسليم للشحنة ${dv.shipmentId}`,
      status: 'approved',
      date: dv.deliveryDate,
      shipmentId: dv.shipmentId,
      documentType: 'delivery_voucher'
    }))
  ]

  const filteredVouchers = allDocuments.filter((document) => {
    const matchesSearch =
      document.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || document.type === typeFilter
    const matchesStatus = statusFilter === "all" || document.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "receipt": return "badge-green"
      case "delivery": return "badge-blue"
      case "payment": return "badge-orange"
      case "expense": return "badge-red"
      case "warehouse_receipt": return "badge-gold"
      case "warehouse_delivery": return "badge-purple"
      default: return "badge-slate"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "badge-green"
      case "paid": return "badge-blue"
      case "draft": return "badge-orange"
      case "cancelled": return "badge-red"
      default: return "badge-slate"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "receipt": return "سند قبض"
      case "delivery": return "سند تسليم"
      case "payment": return "سند صرف"
      case "expense": return "سند مصروف"
      case "warehouse_receipt": return "إيصال استلام"
      case "warehouse_delivery": return "إيصال تسليم"
      default: return type
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved": return "معتمد"
      case "paid": return "مدفوع"
      case "draft": return "مسودة"
      case "cancelled": return "ملغي"
      default: return status
    }
  }

  const handleCreateVoucher = () => {
    // This would be implemented with form data
    setIsCreateDialogOpen(false)
  }

  const handleApproveVoucher = (voucherId: string) => {
    actions.approveVoucher(voucherId, "USR-001")
  }

  // Statistics
  const totalVouchers = vouchers.length
  const totalReceiptVouchers = receiptVouchers.length
  const totalDeliveryVouchers = deliveryVouchers.length
  const totalDocuments = allDocuments.length
  const approvedVouchers = vouchers.filter(v => v.status === 'approved').length
  const draftVouchers = vouchers.filter(v => v.status === 'draft').length
  const totalAmount = vouchers
    .filter(v => v.type === 'receipt' && v.status === 'approved')
    .reduce((sum, v) => sum + v.amount, 0)

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gold-500" />
              <h1 className="text-2xl sm:text-4xl font-bold gold-text">إدارة السندات</h1>
            </div>
            <p className="text-base sm:text-lg text-slate-600">إدارة سندات القبض والتسليم والصرف</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gold">
                <Plus className="h-4 w-4 ml-2" />
                إنشاء سند جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>إنشاء سند جديد</DialogTitle>
                <DialogDescription>
                  اختر نوع السند وأدخل التفاصيل المطلوبة
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>نوع السند</Label>
                  <Select value={selectedVoucherType} onValueChange={(value: any) => setSelectedVoucherType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receipt">سند قبض</SelectItem>
                      <SelectItem value="delivery">سند تسليم</SelectItem>
                      <SelectItem value="payment">سند صرف</SelectItem>
                      <SelectItem value="expense">سند مصروف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>العميل</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر العميل" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>الشحنة (اختياري)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الشحنة" />
                      </SelectTrigger>
                      <SelectContent>
                        {shipments.map(shipment => (
                          <SelectItem key={shipment.id} value={shipment.id}>{shipment.id}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {selectedVoucherType !== 'delivery' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>المبلغ</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label>العملة</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العملة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LYD">دينار ليبي</SelectItem>
                          <SelectItem value="USD">دولار أمريكي</SelectItem>
                          <SelectItem value="EUR">يورو</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>الوصف</Label>
                  <Textarea placeholder="وصف السند..." />
                </div>
                {selectedVoucherType !== 'delivery' && (
                  <div className="space-y-2">
                    <Label>طريقة الدفع</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر طريقة الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">نقدي</SelectItem>
                        <SelectItem value="check">شيك</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button className="btn-gold" onClick={handleCreateVoucher}>
                  إنشاء السند
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">إجمالي السندات</p>
                  <p className="text-2xl font-bold text-gold-600">{totalVouchers}</p>
                </div>
                <FileText className="h-8 w-8 text-gold-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">السندات المعتمدة</p>
                  <p className="text-2xl font-bold text-green-600">{approvedVouchers}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">المسودات</p>
                  <p className="text-2xl font-bold text-amber-600">{draftVouchers}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">إجمالي المقبوضات</p>
                  <p className="text-2xl font-bold text-gold-600">{totalAmount.toLocaleString()} د.ل</p>
                </div>
                <DollarSign className="h-8 w-8 text-gold-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* إحصائيات إضافية للإيصالات */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">إيصالات الاستلام</p>
                  <p className="text-2xl font-bold text-gold-600">{totalReceiptVouchers}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">إيصالات التسليم</p>
                  <p className="text-2xl font-bold text-purple-600">{totalDeliveryVouchers}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                  <Truck className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">إجمالي الوثائق</p>
                  <p className="text-2xl font-bold text-blue-600">{totalDocuments}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vouchers Table */}
        <Card className="card-premium hover-lift">
          <CardHeader className="border-b border-gold-100">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <span className="gold-text">السندات</span>
            </CardTitle>
            <CardDescription className="text-slate-600">جميع سندات القبض والتسليم والصرف</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="البحث في السندات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 border-gold-200 focus:border-gold-400"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px] border-gold-200">
                  <SelectValue placeholder="نوع السند" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="receipt">سند قبض</SelectItem>
                  <SelectItem value="delivery">سند تسليم</SelectItem>
                  <SelectItem value="payment">سند صرف</SelectItem>
                  <SelectItem value="expense">سند مصروف</SelectItem>
                  <SelectItem value="warehouse_receipt">إيصال استلام</SelectItem>
                  <SelectItem value="warehouse_delivery">إيصال تسليم</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] border-gold-200">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="approved">معتمد</SelectItem>
                  <SelectItem value="paid">مدفوع</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <Table className="table-gold">
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم السند</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVouchers.map((voucher) => (
                    <TableRow key={voucher.id} className="border-gold-50 hover:bg-gold-50/30 transition-colors">
                      <TableCell className="font-mono font-medium text-slate-800">
                        {voucher.voucherNumber}
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(voucher.type)}>
                          {getTypeText(voucher.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        <div className="font-medium">{voucher.clientName}</div>
                        {voucher.shipmentId && (
                          <div className="text-sm text-slate-500">الشحنة: {voucher.shipmentId}</div>
                        )}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-gold-600">
                        {voucher.type !== 'delivery' ? `${voucher.amount.toLocaleString()} ${voucher.currency}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(voucher.status)}>
                          {getStatusText(voucher.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-slate-500" />
                          <span>{voucher.date}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="hover:bg-gold-50" title="عرض">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {voucher.status === 'draft' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-green-50 text-green-600"
                              onClick={() => handleApproveVoucher(voucher.id)}
                              title="اعتماد"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="hover:bg-gold-50" title="تحميل">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-gold-50" title="تعديل">
                            <Edit className="h-4 w-4" />
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
      </div>
    </Layout>
  )
}
