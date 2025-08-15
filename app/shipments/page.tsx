"use client"

import { useState } from "react"
import { Package, Plus, Search, Filter, MapPin, Clock, Truck, Ship } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
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

export default function ShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [shipmentPrice, setShipmentPrice] = useState<number>(0)
  const [amountPaid, setAmountPaid] = useState<number>(0)
  const [currency, setCurrency] = useState<string>('LYD')
  const remainingAmount = Math.max(0, (shipmentPrice || 0) - (amountPaid || 0))

  const shipments = [
    {
      id: "SH-001",
      client: "شركة التجارة الليبية",
      origin: "شنغهاي، الصين",
      destination: "طرابلس، ليبيا",
      status: "في الطريق",
      progress: 65,
      departureDate: "2024-01-05",
      estimatedArrival: "2024-01-20",
      actualArrival: "-",
      containerType: "20ft",
      weight: "18.5 طن",
      value: "$45,200",
      trackingNumber: "LYSH001234567",
    },
    {
      id: "SH-002",
      client: "مؤسسة الاستيراد الحديثة",
      origin: "قوانغتشو، الصين",
      destination: "بنغازي، ليبيا",
      status: "التخليص الجمركي",
      progress: 85,
      departureDate: "2024-01-03",
      estimatedArrival: "2024-01-18",
      actualArrival: "-",
      containerType: "40ft",
      weight: "22.3 طن",
      value: "$32,800",
      trackingNumber: "LYSH001234568",
    },
    {
      id: "SH-003",
      client: "شركة النقل السريع",
      origin: "شنتشن، الصين",
      destination: "مصراتة، ليبيا",
      status: "تم التسليم",
      progress: 100,
      departureDate: "2024-01-01",
      estimatedArrival: "2024-01-16",
      actualArrival: "2024-01-16",
      containerType: "20ft",
      weight: "15.8 طن",
      value: "$28,500",
      trackingNumber: "LYSH001234569",
    },
    {
      id: "SH-004",
      client: "التجارة الدولية المحدودة",
      origin: "بكين، الصين",
      destination: "طرابلس، ليبيا",
      status: "قيد التحضير",
      progress: 15,
      departureDate: "2024-01-25",
      estimatedArrival: "2024-02-10",
      actualArrival: "-",
      containerType: "40ft HC",
      weight: "25.2 طن",
      value: "$67,300",
      trackingNumber: "LYSH001234570",
    },
    {
      id: "SH-005",
      client: "شركة الاستيراد الذهبي",
      origin: "تيانجين، الصين",
      destination: "بنغازي، ليبيا",
      status: "في الطريق",
      progress: 45,
      departureDate: "2024-01-08",
      estimatedArrival: "2024-01-23",
      actualArrival: "-",
      containerType: "20ft",
      weight: "19.7 طن",
      value: "$54,900",
      trackingNumber: "LYSH001234571",
    },
  ]

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "تم التسليم":
        return "default"
      case "في الطريق":
        return "secondary"
      case "التخليص الجمركي":
        return "outline"
      case "قيد التحضير":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "تم التسليم":
        return Package
      case "في الطريق":
        return Ship
      case "التخليص الجمركي":
        return Truck
      case "قيد التحضير":
        return Clock
      default:
        return Package
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">إدارة الشحنات</h1>
            <p className="text-muted-foreground">تتبع وإدارة جميع الشحنات من الصين إلى ليبيا</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                شحنة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>إنشاء شحنة جديدة</DialogTitle>
                <DialogDescription>أدخل تفاصيل الشحنة الجديدة</DialogDescription>
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
                    <Label htmlFor="containerType">نوع الحاوية</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الحاوية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20ft">20ft Standard</SelectItem>
                        <SelectItem value="40ft">40ft Standard</SelectItem>
                        <SelectItem value="40ft-hc">40ft High Cube</SelectItem>
                        <SelectItem value="45ft">45ft High Cube</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">نقطة الانطلاق</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shanghai">شنغهاي</SelectItem>
                        <SelectItem value="guangzhou">قوانغتشو</SelectItem>
                        <SelectItem value="shenzhen">شنتشن</SelectItem>
                        <SelectItem value="beijing">بكين</SelectItem>
                        <SelectItem value="tianjin">تيانجين</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">الوجهة</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tripoli">طرابلس</SelectItem>
                        <SelectItem value="benghazi">بنغازي</SelectItem>
                        <SelectItem value="misrata">مصراتة</SelectItem>
                        <SelectItem value="zawiya">الزاوية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">الوزن (طن)</Label>
                    <Input id="weight" type="number" placeholder="0.0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">العملة</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="اختر العملة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LYD">LYD - الدينار الليبي</SelectItem>
                        <SelectItem value="USD">USD - الدولار الأمريكي</SelectItem>
                        <SelectItem value="EUR">EUR - اليورو</SelectItem>
                        <SelectItem value="CNY">CNY - اليوان الصيني</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departureDate">تاريخ المغادرة</Label>
                    <Input id="departureDate" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">سعر الشحنة</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={shipmentPrice}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value || '0')
                        setShipmentPrice(isNaN(v) ? 0 : v)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paid">المبلغ المدفوع</Label>
                    <Input
                      id="paid"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={amountPaid}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value || '0')
                        setAmountPaid(isNaN(v) ? 0 : v)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remaining">المبلغ المتبقي</Label>
                    <Input id="remaining" type="number" value={remainingAmount} readOnly disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">وصف البضاعة</Label>
                  <Textarea id="description" placeholder="وصف تفصيلي للبضاعة المشحونة" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات خاصة</Label>
                  <Textarea id="notes" placeholder="ملاحظات أو تعليمات خاصة" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>إنشاء الشحنة</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الشحنات</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+23.1% من الشهر الماضي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">في الطريق</CardTitle>
              <Ship className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">14.7% من الإجمالي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تم التسليم</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">118</div>
              <p className="text-xs text-muted-foreground">75.6% من الإجمالي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوسط وقت التسليم</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">19 يوم</div>
              <p className="text-xs text-muted-foreground">-2 أيام من الشهر الماضي</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الشحنات</CardTitle>
            <CardDescription>تتبع وإدارة جميع الشحنات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في الشحنات..."
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
                  <SelectItem value="قيد التحضير">قيد التحضير</SelectItem>
                  <SelectItem value="في الطريق">في الطريق</SelectItem>
                  <SelectItem value="التخليص الجمركي">التخليص الجمركي</SelectItem>
                  <SelectItem value="تم التسليم">تم التسليم</SelectItem>
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
                  <TableHead>رقم الشحنة</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>المسار</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التقدم</TableHead>
                  <TableHead>تاريخ المغادرة</TableHead>
                  <TableHead>الوصول المتوقع</TableHead>
                  <TableHead>نوع الحاوية</TableHead>
                  <TableHead>الوزن</TableHead>
                  <TableHead>القيمة</TableHead>
                  <TableHead>رقم التتبع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => {
                  const StatusIcon = getStatusIcon(shipment.status)
                  return (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.id}</TableCell>
                      <TableCell>{shipment.client}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            <div>{shipment.origin}</div>
                            <div className="text-muted-foreground">إلى {shipment.destination}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-4 w-4" />
                          <Badge variant={getStatusColor(shipment.status)}>{shipment.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{shipment.progress}%</span>
                          </div>
                          <Progress value={shipment.progress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{shipment.departureDate}</TableCell>
                      <TableCell>{shipment.estimatedArrival}</TableCell>
                      <TableCell>{shipment.containerType}</TableCell>
                      <TableCell>{shipment.weight}</TableCell>
                      <TableCell className="font-medium text-green-600">{shipment.value}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{shipment.trackingNumber}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
