"use client"

import { useState } from "react"
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, Ship, MapPin, Calendar, DollarSign, FileText, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Layout from "@/components/layout"
import { useAppStore } from "@/lib/store"

export default function ShippingOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { actions } = useAppStore()

  const shippingOrders = [
    {
      id: "SO-001",
      client: "شركة التجارة الليبية",
      origin: "شنغهاي، الصين",
      destination: "طرابلس، ليبيا",
      items: "إلكترونيات",
      weight: "2,500 كجم",
      volume: "15 م³",
      value: "45,200 د.ل",
      status: "معلق",
      orderDate: "2024-01-15",
      expectedDelivery: "2024-02-15"
    },
    {
      id: "SO-002",
      client: "مؤسسة الاستيراد الحديثة",
      origin: "قوانغتشو، الصين",
      destination: "بنغازي، ليبيا",
      items: "ملابس وأحذية",
      weight: "1,800 كجم",
      volume: "12 م³",
      value: "32,800 د.ل",
      status: "في الطريق",
      orderDate: "2024-01-14",
      expectedDelivery: "2024-02-10"
    },
    {
      id: "SO-003",
      client: "شركة النقل السريع",
      origin: "شنتشن، الصين",
      destination: "مصراتة، ليبيا",
      items: "أثاث منزلي",
      weight: "3,200 كجم",
      volume: "20 م³",
      value: "28,500 د.ل",
      status: "تم التسليم",
      orderDate: "2024-01-13",
      expectedDelivery: "2024-02-05"
    },
    {
      id: "SO-004",
      client: "التجارة الدولية المحدودة",
      origin: "نينغبو، الصين",
      destination: "الزاوية، ليبيا",
      items: "معدات صناعية",
      weight: "5,000 كجم",
      volume: "25 م³",
      value: "67,300 د.ل",
      status: "معلق",
      orderDate: "2024-01-12",
      expectedDelivery: "2024-02-20"
    },
    {
      id: "SO-005",
      client: "شركة الخدمات اللوجستية",
      origin: "تيانجين، الصين",
      destination: "سرت، ليبيا",
      items: "مواد بناء",
      weight: "4,500 كجم",
      volume: "18 م³",
      value: "38,900 د.ل",
      status: "في الطريق",
      orderDate: "2024-01-11",
      expectedDelivery: "2024-02-12"
    }
  ]

  const filteredOrders = shippingOrders.filter((order) => {
    const matchesSearch =
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "معلق":
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
      case "في الطريق":
        return "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
      case "تم التسليم":
        return "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white"
      case "ملغي":
        return "bg-gradient-to-r from-red-400 to-red-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
    }
  }

  const handleGenerateDeliveryVoucher = (orderId: string) => {
    // Sample delivery items - in real implementation, this would come from order details
    const deliveryItems = [
      {
        id: `ITM-${Date.now()}-1`,
        description: "حاويات البضائع",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0
      },
      {
        id: `ITM-${Date.now()}-2`,
        description: "مستندات الشحن",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0
      }
    ]

    actions.generateDeliveryVoucher(orderId, deliveryItems)
  }

  const stats = [
    {
      title: "إجمالي الطلبات",
      value: "156",
      change: "+12",
      icon: Package,
      color: "text-purple-600",
      bgColor: "from-purple-400 to-purple-600",
      description: "طلب هذا الشهر"
    },
    {
      title: "الطلبات المعلقة",
      value: "23",
      change: "-5",
      icon: Calendar,
      color: "text-amber-600",
      bgColor: "from-amber-400 to-amber-600",
      description: "من الشهر الماضي"
    },
    {
      title: "في الطريق",
      value: "45",
      change: "+8",
      icon: Ship,
      color: "text-blue-600",
      bgColor: "from-blue-400 to-blue-600",
      description: "من الشهر الماضي"
    },
    {
      title: "قيمة الطلبات",
      value: "2,847,500 د.ل",
      change: "+15.2%",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "from-emerald-400 to-emerald-600",
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
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gold-500" />
              <h1 className="text-2xl sm:text-4xl font-bold gold-text">أوامر الشحن</h1>
            </div>
            <p className="text-base sm:text-lg text-slate-600">إدارة أوامر الشحن من العملاء</p>
          </div>
          <Button className="btn-gold">
            <Plus className="h-4 w-4 ml-2" />
            طلب شحن جديد
          </Button>
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
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
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

        {/* Orders Table */}
        <Card className="card-premium hover-lift">
          <CardHeader className="border-b border-gold-100">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <Package className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <span className="gold-text">أوامر الشحن</span>
            </CardTitle>
            <CardDescription className="text-slate-600">جميع أوامر الشحن من العملاء</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="البحث في أوامر الشحن..."
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
                    <SelectItem value="معلق">معلق</SelectItem>
                    <SelectItem value="في الطريق">في الطريق</SelectItem>
                    <SelectItem value="تم التسليم">تم التسليم</SelectItem>
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
                    <TableHead className="text-slate-700 font-semibold text-right">رقم الطلب</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-right">العميل</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-right">المسار</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-right">البضائع</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-right">الوزن/الحجم</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-right">القيمة</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-right">الحالة</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-right">التاريخ</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-gold-50 hover:bg-gold-50/30 transition-colors">
                      <TableCell className="font-mono font-medium text-slate-800 text-right">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-slate-700 text-right">
                        <div className="font-medium">{order.client}</div>
                      </TableCell>
                      <TableCell className="text-slate-700 text-right">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs">
                            <MapPin className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-600">{order.origin}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <MapPin className="h-3 w-3 text-blue-500" />
                            <span className="text-blue-600">{order.destination}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700 text-right">
                        <div className="text-sm">{order.items}</div>
                      </TableCell>
                      <TableCell className="text-slate-700 text-right">
                        <div className="space-y-1 text-xs">
                          <div>{order.weight}</div>
                          <div className="text-slate-500">{order.volume}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono font-bold text-slate-800 text-right">
                        {order.value}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(order.status)} text-xs`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-700 text-right">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-500" />
                            <span>{order.orderDate}</span>
                          </div>
                          <div className="text-slate-500">متوقع: {order.expectedDelivery}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50" title="عرض">
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                          {order.status === "تم التسليم" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-green-50"
                              onClick={() => handleGenerateDeliveryVoucher(order.id)}
                              title="إنشاء سند تسليم"
                            >
                              <FileText className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gold-50" title="تعديل">
                            <Edit className="h-4 w-4 text-gold-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50" title="حذف">
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
              <div>عرض {filteredOrders.length} من {shippingOrders.length} طلب</div>
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