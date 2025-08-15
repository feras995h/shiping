"use client"

import { useState, useRef } from "react"
import { 
  Package, 
  Truck, 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Printer, 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Hash,
  Building,
  Mail
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore, useWarehouseShipments, useReceiptVouchers, useDeliveryVouchers } from "@/lib/store"

// واجهات البيانات
interface ShipmentItem {
  id: string
  shipmentCode: string
  clientName: string
  clientPhone: string
  driverName: string
  driverPhone: string
  pickupLocation: string
  deliveryLocation: string
  status: 'received' | 'ready_for_delivery' | 'delivered'
  receivedDate?: string
  deliveryDate?: string
  items: string[]
  notes?: string
  totalPrice?: number
  amountPaid?: number
  remainingAmount?: number
}

interface VoucherData {
  voucherNumber: string
  date: string
  clientName: string
  clientPhone: string
  driverName: string
  driverPhone: string
  pickupLocation: string
  deliveryLocation: string
  items: string[]
  notes?: string
  type: 'receipt' | 'delivery'
}

export default function InventoryManagementPage() {
  const [activeTab, setActiveTab] = useState("inventory")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedShipments, setSelectedShipments] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false)
  const [voucherType, setVoucherType] = useState<'receipt' | 'delivery'>('receipt')
  const [selectedShipmentForVoucher, setSelectedShipmentForVoucher] = useState<ShipmentItem | null>(null)
  
  const printRef = useRef<HTMLDivElement>(null)

  // بيانات تجريبية للشحنات
  const [shipments, setShipments] = useState<ShipmentItem[]>([
    {
      id: "1",
      shipmentCode: "SH-2024-001",
      clientName: "أحمد محمد علي",
      clientPhone: "+218 91 234 5678",
      driverName: "محمد سالم",
      driverPhone: "+218 92 345 6789",
      pickupLocation: "ميناء طرابلس - المستودع الرئيسي",
      deliveryLocation: "طرابلس - شارع الجمهورية",
      status: "received",
      receivedDate: "2024-01-20",
      items: ["أجهزة إلكترونية", "قطع غيار", "ملابس"],
      notes: "تم الاستلام بحالة ممتازة"
    },
    {
      id: "2",
      shipmentCode: "SH-2024-002",
      clientName: "فاطمة علي حسن",
      clientPhone: "+218 93 456 7890",
      driverName: "علي أحمد",
      driverPhone: "+218 94 567 8901",
      pickupLocation: "ميناء بنغازي - المستودع الفرعي",
      deliveryLocation: "بنغازي - شارع الاستقلال",
      status: "ready_for_delivery",
      receivedDate: "2024-01-18",
      deliveryDate: "2024-01-22",
      items: ["مواد غذائية", "أدوات منزلية"],
      notes: "جاهز للتسليم"
    },
    {
      id: "3",
      shipmentCode: "SH-2024-003",
      clientName: "محمد حسن سالم",
      clientPhone: "+218 95 678 9012",
      driverName: "سالم محمد",
      driverPhone: "+218 96 789 0123",
      pickupLocation: "ميناء مصراتة - المستودع المركزي",
      deliveryLocation: "مصراتة - شارع البحر",
      status: "delivered",
      receivedDate: "2024-01-15",
      deliveryDate: "2024-01-19",
      items: ["ملابس", "أحذية", "حقائب"],
      notes: "تم التسليم بنجاح"
    }
  ])

  // إضافة شحنة جديدة
  const [newShipment, setNewShipment] = useState({
    shipmentCode: "",
    clientName: "",
    clientPhone: "",
    driverName: "",
    driverPhone: "",
    pickupLocation: "",
    deliveryLocation: "",
    items: [""],
    notes: "",
    totalPrice: 0,
    amountPaid: 0,
    remainingAmount: 0
  })

  const handleAddShipment = () => {
    const shipment: ShipmentItem = {
      id: Date.now().toString(),
      ...newShipment,
      status: "received",
      receivedDate: new Date().toISOString().split('T')[0]
    }
    setShipments([...shipments, shipment])
    setNewShipment({
      shipmentCode: "",
      clientName: "",
      clientPhone: "",
      driverName: "",
      driverPhone: "",
      pickupLocation: "",
      deliveryLocation: "",
      items: [""],
      notes: "",
      totalPrice: 0,
      amountPaid: 0,
      remainingAmount: 0
    })
    setIsAddDialogOpen(false)
  }

  const handleAddItem = () => {
    setNewShipment({
      ...newShipment,
      items: [...newShipment.items, ""]
    })
  }

  const handleRemoveItem = (index: number) => {
    const newItems = newShipment.items.filter((_, i) => i !== index)
    setNewShipment({
      ...newShipment,
      items: newItems
    })
  }

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...newShipment.items]
    newItems[index] = value
    setNewShipment({
      ...newShipment,
      items: newItems
    })
  }

  // طباعة الوصل
  const printVoucher = (voucherData: VoucherData) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <title>${voucherData.type === 'receipt' ? 'وصل استلام' : 'وصل تسليم'}</title>
          <style>
            @media print {
              @page {
                size: A5;
                margin: 10mm;
              }
            }
            body {
              font-family: 'Cairo', Arial, sans-serif;
              margin: 0;
              padding: 20px;
              direction: rtl;
              font-size: 12px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #F59E0B;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .title {
              font-size: 18px;
              font-weight: bold;
              color: #F59E0B;
              margin-bottom: 5px;
            }
            .voucher-number {
              font-size: 14px;
              color: #666;
            }
            .info-section {
              margin-bottom: 15px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            .label {
              font-weight: bold;
              color: #333;
              min-width: 120px;
            }
            .value {
              color: #666;
              text-align: left;
            }
            .items-section {
              margin: 20px 0;
            }
            .item {
              padding: 8px;
              border: 1px solid #ddd;
              margin-bottom: 5px;
              border-radius: 4px;
            }
            .signatures {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
            }
            .signature-box {
              border: 1px solid #ccc;
              padding: 10px;
              width: 45%;
              text-align: center;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 10px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">الحصان الذهبي للشحن</div>
            <div class="voucher-number">${voucherData.type === 'receipt' ? 'وصل استلام' : 'وصل تسليم'} رقم: ${voucherData.voucherNumber}</div>
            <div>التاريخ: ${voucherData.date}</div>
          </div>
          
          <div class="info-section">
            <div class="info-row">
              <span class="label">اسم العميل:</span>
              <span class="value">${voucherData.clientName}</span>
            </div>
            <div class="info-row">
              <span class="label">هاتف العميل:</span>
              <span class="value">${voucherData.clientPhone}</span>
            </div>
            <div class="info-row">
              <span class="label">اسم السائق:</span>
              <span class="value">${voucherData.driverName}</span>
            </div>
            <div class="info-row">
              <span class="label">هاتف السائق:</span>
              <span class="value">${voucherData.driverPhone}</span>
            </div>
            <div class="info-row">
              <span class="label">مكان الاستلام:</span>
              <span class="value">${voucherData.pickupLocation}</span>
            </div>
            <div class="info-row">
              <span class="label">مكان التسليم:</span>
              <span class="value">${voucherData.deliveryLocation}</span>
            </div>
          </div>
          
          <div class="items-section">
            <h3>المحتويات:</h3>
            ${voucherData.items.map(item => `<div class="item">${item}</div>`).join('')}
          </div>
          
          ${voucherData.notes ? `
          <div class="info-section">
            <div class="info-row">
              <span class="label">ملاحظات:</span>
              <span class="value">${voucherData.notes}</span>
            </div>
          </div>
          ` : ''}
          
          <div class="signatures">
            <div class="signature-box">
              <div>توقيع العميل</div>
              <div style="height: 40px; border-bottom: 1px solid #ccc; margin-top: 10px;"></div>
            </div>
            <div class="signature-box">
              <div>توقيع السائق</div>
              <div style="height: 40px; border-bottom: 1px solid #ccc; margin-top: 10px;"></div>
            </div>
          </div>
          
          <div class="footer">
            <p>الحصان الذهبي للشحن - Golden Horse Shipping</p>
            <p>جميع الحقوق محفوظة © 2024</p>
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handlePrintVoucher = (shipment: ShipmentItem) => {
    setSelectedShipmentForVoucher(shipment)
    setIsVoucherDialogOpen(true)
  }

  const confirmPrintVoucher = () => {
    if (!selectedShipmentForVoucher) return
    
    const voucherData: VoucherData = {
      voucherNumber: `${voucherType === 'receipt' ? 'REC' : 'DEL'}-${new Date().getFullYear()}-${String(shipments.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      clientName: selectedShipmentForVoucher.clientName,
      clientPhone: selectedShipmentForVoucher.clientPhone,
      driverName: selectedShipmentForVoucher.driverName,
      driverPhone: selectedShipmentForVoucher.driverPhone,
      pickupLocation: selectedShipmentForVoucher.pickupLocation,
      deliveryLocation: selectedShipmentForVoucher.deliveryLocation,
      items: selectedShipmentForVoucher.items,
      notes: selectedShipmentForVoucher.notes,
      type: voucherType
    }
    printVoucher(voucherData)
    setIsVoucherDialogOpen(false)
    setSelectedShipmentForVoucher(null)
  }

  const filteredShipments = shipments.filter(shipment =>
    shipment.shipmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return <Badge className="bg-green-100 text-green-800">تم الاستلام</Badge>
      case 'ready_for_delivery':
        return <Badge className="bg-blue-100 text-blue-800">جاهز للتسليم</Badge>
      case 'delivered':
        return <Badge className="bg-purple-100 text-purple-800">تم التسليم</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">غير محدد</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">إدارة المخزون والشحنات</h1>
          <p className="text-slate-600">جرد كامل للشحنات المستلمة والتي سيتم تسليمها مع إمكانية طباعة أصول الاستلام والتسليم</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory">المخزون</TabsTrigger>
            <TabsTrigger value="receipts">أصول الاستلام</TabsTrigger>
            <TabsTrigger value="deliveries">أصول التسليم</TabsTrigger>
          </TabsList>

          {/* Tab Content - Inventory */}
          <TabsContent value="inventory" className="space-y-6">
            {/* Search and Actions */}
            <div className="flex justify-between items-center">
              <div className="flex gap-4 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="البحث في الشحنات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Button variant="outline" className="btn-gold-outline">
                  <Filter className="h-4 w-4 ml-2" />
                  فلترة
                </Button>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-gold">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة شحنة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>إضافة شحنة جديدة</DialogTitle>
                    <DialogDescription>
                      أدخل بيانات الشحنة الجديدة مع معلومات العميل والسائق
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>كود الشحنة</Label>
                        <Input
                          placeholder="مثال: SH-2024-001"
                          value={newShipment.shipmentCode}
                          onChange={(e) => setNewShipment({...newShipment, shipmentCode: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>اسم العميل</Label>
                        <Input
                          placeholder="اسم العميل"
                          value={newShipment.clientName}
                          onChange={(e) => setNewShipment({...newShipment, clientName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>هاتف العميل</Label>
                        <Input
                          placeholder="+218 XXX XXX XXXX"
                          value={newShipment.clientPhone}
                          onChange={(e) => setNewShipment({...newShipment, clientPhone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>اسم السائق</Label>
                        <Input
                          placeholder="اسم السائق"
                          value={newShipment.driverName}
                          onChange={(e) => setNewShipment({...newShipment, driverName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>هاتف السائق</Label>
                        <Input
                          placeholder="+218 XXX XXX XXXX"
                          value={newShipment.driverPhone}
                          onChange={(e) => setNewShipment({...newShipment, driverPhone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>مكان الاستلام</Label>
                        <Input
                          placeholder="مكان الاستلام"
                          value={newShipment.pickupLocation}
                          onChange={(e) => setNewShipment({...newShipment, pickupLocation: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>مكان التسليم</Label>
                      <Input
                        placeholder="مكان التسليم"
                        value={newShipment.deliveryLocation}
                        onChange={(e) => setNewShipment({...newShipment, deliveryLocation: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>سعر الشحنة</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={newShipment.totalPrice}
                          onChange={(e) => {
                            const price = parseFloat(e.target.value || '0')
                            const paid = Number(newShipment.amountPaid || 0)
                            const remaining = Math.max(0, price - paid)
                            setNewShipment({ ...newShipment, totalPrice: isNaN(price) ? 0 : price, remainingAmount: remaining })
                          }}
                        />
                      </div>
                      <div>
                        <Label>المبلغ المدفوع</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={newShipment.amountPaid}
                          onChange={(e) => {
                            const paid = parseFloat(e.target.value || '0')
                            const price = Number(newShipment.totalPrice || 0)
                            const remaining = Math.max(0, price - paid)
                            setNewShipment({ ...newShipment, amountPaid: isNaN(paid) ? 0 : paid, remainingAmount: remaining })
                          }}
                        />
                      </div>
                      <div>
                        <Label>المبلغ المتبقي</Label>
                        <Input
                          type="number"
                          value={newShipment.remainingAmount}
                          readOnly
                          disabled
                        />
                      </div>
                    </div>
                    <div>
                      <Label>المحتويات</Label>
                      <div className="space-y-2">
                        {newShipment.items.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="وصف المحتوى"
                              value={item}
                              onChange={(e) => handleItemChange(index, e.target.value)}
                            />
                            {newShipment.items.length > 1 && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={handleAddItem}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 ml-2" />
                          إضافة محتوى آخر
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>ملاحظات</Label>
                      <Textarea
                        placeholder="ملاحظات إضافية..."
                        value={newShipment.notes}
                        onChange={(e) => setNewShipment({...newShipment, notes: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        إلغاء
                      </Button>
                      <Button onClick={handleAddShipment} className="btn-gold">
                        إضافة الشحنة
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Shipments Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredShipments.map((shipment) => (
                <Card key={shipment.id} className="card-premium hover-lift">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{shipment.shipmentCode}</CardTitle>
                        <CardDescription className="mt-1">
                          {getStatusBadge(shipment.status)}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePrintVoucher(shipment)}
                          className="text-blue-600 hover:text-blue-700"
                          title="طباعة وصل استلام"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePrintVoucher(shipment)}
                          className="text-green-600 hover:text-green-700"
                          title="طباعة وصل تسليم"
                        >
                          <Truck className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">العميل:</span>
                        <span>{shipment.clientName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">هاتف العميل:</span>
                        <span>{shipment.clientPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">السائق:</span>
                        <span>{shipment.driverName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">هاتف السائق:</span>
                        <span>{shipment.driverPhone}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">مكان الاستلام:</span>
                      </div>
                      <p className="text-sm text-slate-600 pr-6">{shipment.pickupLocation}</p>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">مكان التسليم:</span>
                      </div>
                      <p className="text-sm text-slate-600 pr-6">{shipment.deliveryLocation}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">المحتويات:</span>
                      </div>
                      <div className="space-y-1">
                        {shipment.items.map((item, index) => (
                          <div key={index} className="text-sm text-slate-600 pr-6">
                            • {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {(shipment.totalPrice !== undefined || shipment.amountPaid !== undefined) && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-slate-500" />
                          <span className="font-medium">المالية:</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pr-6 text-sm text-slate-700">
                          <div>
                            <span className="font-medium">السعر:</span>
                            <span className="ml-1">{(shipment.totalPrice ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div>
                            <span className="font-medium">المدفوع:</span>
                            <span className="ml-1">{(shipment.amountPaid ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div>
                            <span className="font-medium">المتبقي:</span>
                            <span className="ml-1">{(shipment.remainingAmount ?? Math.max(0, (shipment.totalPrice ?? 0) - (shipment.amountPaid ?? 0))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {shipment.notes && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-slate-500" />
                          <span className="font-medium">ملاحظات:</span>
                        </div>
                        <p className="text-sm text-slate-600 pr-6">{shipment.notes}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="text-xs text-slate-500">
                        {shipment.receivedDate && `استلام: ${shipment.receivedDate}`}
                      </div>
                      <div className="text-xs text-slate-500">
                        {shipment.deliveryDate && `تسليم: ${shipment.deliveryDate}`}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Content - Receipts */}
          <TabsContent value="receipts" className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  أصول الاستلام
                </CardTitle>
                <CardDescription>
                  طباعة أصول استلام الشحنات للعملاء
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredShipments.filter(s => s.status === 'received').map((shipment) => (
                    <Card key={shipment.id} className="border-2 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">{shipment.shipmentCode}</h3>
                            <p className="text-sm text-slate-600">{shipment.clientName}</p>
                          </div>
                          <Button
                            onClick={() => handlePrintVoucher(shipment)}
                            className="btn-gold text-sm"
                          >
                            <Printer className="h-4 w-4 ml-2" />
                            طباعة الوصل
                          </Button>
                        </div>
                        <div className="text-sm space-y-1">
                          <p><strong>السائق:</strong> {shipment.driverName}</p>
                          <p><strong>تاريخ الاستلام:</strong> {shipment.receivedDate}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Content - Deliveries */}
          <TabsContent value="deliveries" className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-green-600" />
                  أصول التسليم
                </CardTitle>
                <CardDescription>
                  طباعة أصول تسليم الشحنات للعملاء
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredShipments.filter(s => s.status === 'ready_for_delivery' || s.status === 'delivered').map((shipment) => (
                    <Card key={shipment.id} className="border-2 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">{shipment.shipmentCode}</h3>
                            <p className="text-sm text-slate-600">{shipment.clientName}</p>
                          </div>
                          <Button
                            onClick={() => handlePrintVoucher(shipment)}
                            className="btn-gold text-sm"
                          >
                            <Printer className="h-4 w-4 ml-2" />
                            طباعة الوصل
                          </Button>
                        </div>
                        <div className="text-sm space-y-1">
                          <p><strong>السائق:</strong> {shipment.driverName}</p>
                          <p><strong>تاريخ التسليم:</strong> {shipment.deliveryDate || 'لم يتم تحديده'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* نافذة اختيار نوع الواصل */}
        <Dialog open={isVoucherDialogOpen} onOpenChange={setIsVoucherDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5 text-amber-600" />
                طباعة الوصل
              </DialogTitle>
              <DialogDescription>
                اختر نوع الواصل الذي تريد طباعته
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">نوع الوصل</Label>
                <Select value={voucherType} onValueChange={(value: 'receipt' | 'delivery') => setVoucherType(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="اختر نوع الوصل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receipt">وصل استلام</SelectItem>
                    <SelectItem value="delivery">وصل تسليم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedShipmentForVoucher && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">تفاصيل الشحنة:</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>كود الشحنة:</strong> {selectedShipmentForVoucher.shipmentCode}</p>
                    <p><strong>العميل:</strong> {selectedShipmentForVoucher.clientName}</p>
                    <p><strong>السائق:</strong> {selectedShipmentForVoucher.driverName}</p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsVoucherDialogOpen(false)
                    setSelectedShipmentForVoucher(null)
                  }}
                  className="flex-1"
                >
                  إلغاء
                </Button>
                <Button 
                  onClick={confirmPrintVoucher}
                  className="btn-gold flex-1"
                >
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة الوصل
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 