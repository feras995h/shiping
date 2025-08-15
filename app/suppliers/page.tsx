"use client"

import { useState } from "react"
import { Building2, Plus, Search, Filter, Phone, Mail, MapPin, TrendingUp, Eye, Edit, Trash2 } from "lucide-react"
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

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const suppliers = [
    {
      id: "SUP-001",
      name: "شركة الشحن البحري الصينية",
      contact: "لي وانغ",
      phone: "+86-21-1234-5678",
      email: "li.wang@china-shipping.com",
      address: "شنغهاي، الصين",
      status: "نشط",
      category: "شحن بحري",
      totalOrders: 25,
      totalAmount: "$485,200",
      lastOrder: "2024-01-15",
      paymentTerms: "نقداً",
      rating: 4.8,
    },
    {
      id: "SUP-002",
      name: "مكتب التخليص الجمركي المتقدم",
      contact: "أحمد محمد",
      phone: "+218-91-234-5678",
      email: "ahmed@customs-office.ly",
      address: "طرابلس، ليبيا",
      status: "نشط",
      category: "تخليص جمركي",
      totalOrders: 38,
      totalAmount: "$298,500",
      lastOrder: "2024-01-14",
      paymentTerms: "شيك",
      rating: 4.6,
    },
    {
      id: "SUP-003",
      name: "شركة النقل البري السريع",
      contact: "محمد علي",
      phone: "+218-92-345-6789",
      email: "mohamed@fast-transport.ly",
      address: "بنغازي، ليبيا",
      status: "نشط",
      category: "نقل بري",
      totalOrders: 32,
      totalAmount: "$242,800",
      lastOrder: "2024-01-13",
      paymentTerms: "نقداً",
      rating: 4.4,
    },
    {
      id: "SUP-004",
      name: "مكتب الخدمات اللوجستية",
      contact: "فاطمة حسن",
      phone: "+218-93-456-7890",
      email: "fatima@logistics-services.ly",
      address: "مصراتة، ليبيا",
      status: "معلق",
      category: "خدمات لوجستية",
      totalOrders: 18,
      totalAmount: "$189,600",
      lastOrder: "2024-01-10",
      paymentTerms: "شيك",
      rating: 4.2,
    },
    {
      id: "SUP-005",
      name: "شركة التأمين البحري",
      contact: "عبد الله أحمد",
      phone: "+218-94-567-8901",
      email: "abdullah@marine-insurance.ly",
      address: "طرابلس، ليبيا",
      status: "نشط",
      category: "تأمين",
      totalOrders: 45,
      totalAmount: "$156,400",
      lastOrder: "2024-01-12",
      paymentTerms: "نقداً",
      rating: 4.7,
    },
  ]

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط":
        return "bg-gradient-to-r from-green-400 to-green-600 text-white"
      case "معلق":
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
      case "غير نشط":
        return "bg-gradient-to-r from-red-400 to-red-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "شحن بحري":
        return "bg-gradient-to-r from-gold-400 to-gold-600 text-white"
      case "تخليص جمركي":
        return "bg-gradient-to-r from-gold-500 to-gold-700 text-white"
      case "نقل بري":
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
      case "خدمات لوجستية":
        return "bg-gradient-to-r from-gold-600 to-gold-800 text-white"
      case "تأمين":
        return "bg-gradient-to-r from-amber-500 to-amber-700 text-white"
      default:
        return "bg-gradient-to-r from-gold-300 to-gold-500 text-white"
    }
  }

  const getRatingStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push("★")
    }
    if (hasHalfStar) {
      stars.push("☆")
    }
    return stars.join("")
  }

  const handleViewSupplier = (supplierId: string) => {
    // عرض المورد
    setSelectedSupplier(suppliers.find(s => s.id === supplierId))
    setIsViewDialogOpen(true)
  }

  const handleEditSupplier = (supplierId: string) => {
    // تعديل المورد
    setSelectedSupplier(suppliers.find(s => s.id === supplierId))
    setIsEditDialogOpen(true)
  }

  const handleDeleteSupplier = (supplierId: string) => {
    // حذف المورد
    setSelectedSupplier(suppliers.find(s => s.id === supplierId))
    setIsDeleteDialogOpen(true)
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-gold-500" />
              <h1 className="text-4xl font-bold gold-text">إدارة الموردين</h1>
            </div>
            <p className="text-lg text-slate-600">إدارة معلومات الموردين وتتبع أداء الخدمات</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gold">
                <Plus className="h-4 w-4 ml-2" />
                مورد جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إضافة مورد جديد</DialogTitle>
                <DialogDescription>أدخل معلومات المورد الجديد</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">اسم الشركة</Label>
                    <Input
                      id="companyName"
                      placeholder="اسم الشركة"
                      className="border-gold-200 focus:border-gold-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">الشخص المسؤول</Label>
                    <Input
                      id="contactPerson"
                      placeholder="اسم الشخص المسؤول"
                      className="border-gold-200 focus:border-gold-400"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      placeholder="+218-XX-XXX-XXXX"
                      className="border-gold-200 focus:border-gold-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="border-gold-200 focus:border-gold-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Input id="address" placeholder="العنوان الكامل" className="border-gold-200 focus:border-gold-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">فئة الخدمة</Label>
                    <Select>
                      <SelectTrigger className="border-gold-200 focus:border-gold-400">
                        <SelectValue placeholder="اختر فئة الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shipping">شحن بحري</SelectItem>
                        <SelectItem value="customs">تخليص جمركي</SelectItem>
                        <SelectItem value="transport">نقل بري</SelectItem>
                        <SelectItem value="logistics">خدمات لوجستية</SelectItem>
                        <SelectItem value="insurance">تأمين</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">شروط الدفع</Label>
                    <Select>
                      <SelectTrigger className="border-gold-200 focus:border-gold-400">
                        <SelectValue placeholder="اختر شروط الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">نقداً</SelectItem>
                        <SelectItem value="check">شيك</SelectItem>
                        <SelectItem value="7days">7 أيام</SelectItem>
                        <SelectItem value="15days">15 يوم</SelectItem>
                        <SelectItem value="30days">30 يوم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea id="notes" placeholder="ملاحظات إضافية" className="border-gold-200 focus:border-gold-400" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button className="btn-gold" onClick={() => setIsCreateDialogOpen(false)}>
                    إضافة المورد
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
              <CardTitle className="text-sm font-medium text-slate-700">إجمالي الموردين</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{suppliers.length}</div>
              <p className="text-sm text-blue-700 mt-1">مورد مسجل</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">الموردين النشطون</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {suppliers.filter((s) => s.status === "نشط").length}
              </div>
              <p className="text-sm text-green-700 mt-1">مورد نشط</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">إجمالي المشتريات</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                $
                {suppliers
                  .reduce((sum, s) => sum + Number.parseFloat(s.totalAmount.replace(/[$,]/g, "")), 0)
                  .toLocaleString()}
              </div>
              <p className="text-sm text-purple-700 mt-1">إجمالي المشتريات</p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">متوسط التقييم</CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)}
              </div>
              <p className="text-sm text-amber-700 mt-1">من 5.0</p>
            </CardContent>
          </Card>
        </div>

        {/* Suppliers List */}
        <Card className="card-premium">
          <CardHeader className="border-b border-gold-100">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center shadow-gold">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="gold-text">قائمة الموردين</span>
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">إدارة معلومات الموردين وأداءهم</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في الموردين..."
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
                  <SelectItem value="نشط">نشط</SelectItem>
                  <SelectItem value="معلق">معلق</SelectItem>
                  <SelectItem value="غير نشط">غير نشط</SelectItem>
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
                    <TableHead className="text-slate-700 font-semibold">معرف المورد</TableHead>
                    <TableHead className="text-slate-700 font-semibold">اسم الشركة</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الشخص المسؤول</TableHead>
                    <TableHead className="text-slate-700 font-semibold">معلومات الاتصال</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الفئة</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الحالة</TableHead>
                    <TableHead className="text-slate-700 font-semibold">عدد الأوامر</TableHead>
                    <TableHead className="text-slate-700 font-semibold">إجمالي المبلغ</TableHead>
                    <TableHead className="text-slate-700 font-semibold">التقييم</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id} className="border-gold-100 hover:bg-gold-50/30 transition-colors">
                      <TableCell className="font-bold text-slate-800">{supplier.id}</TableCell>
                      <TableCell className="font-medium text-slate-700">{supplier.name}</TableCell>
                      <TableCell>{supplier.contact}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {supplier.phone}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {supplier.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {supplier.address}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(supplier.category)}>{supplier.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(supplier.status)}>{supplier.status}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">{supplier.totalOrders}</TableCell>
                      <TableCell className="font-bold text-green-600">{supplier.totalAmount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500 text-lg">{getRatingStars(supplier.rating)}</span>
                          <span className="text-sm text-slate-600">({supplier.rating})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-gold-100"
                            onClick={() => handleViewSupplier(supplier.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-gold-100"
                            onClick={() => handleEditSupplier(supplier.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteSupplier(supplier.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
