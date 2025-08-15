"use client"

import { useMemo, useState } from "react"
import { Users, Plus, Search, Filter, Phone, Mail, MapPin, TrendingUp } from "lucide-react"
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
import { useGlStore } from "@/lib/gl-store"

export default function ClientsPage() {
  const gl = useGlStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [clientForm, setClientForm] = useState({ companyName: '', contactPerson: '', phone: '', email: '', address: '', status: 'نشط' })

  const clients = [
    {
      id: "CL-001",
      name: "شركة التجارة الليبية",
      contact: "أحمد محمد",
      phone: "+218-91-234-5678",
      email: "ahmed@libya-trade.ly",
      address: "طرابلس، ليبيا",
      status: "نشط",
      totalShipments: 45,
      totalRevenue: "$485,200",
      lastShipment: "2024-01-15",
      creditLimit: "$100,000",
      outstandingBalance: "$12,500",
    },
    {
      id: "CL-002",
      name: "مؤسسة الاستيراد الحديثة",
      contact: "فاطمة علي",
      phone: "+218-92-345-6789",
      email: "fatima@modern-import.ly",
      address: "بنغازي، ليبيا",
      status: "نشط",
      totalShipments: 38,
      totalRevenue: "$398,500",
      lastShipment: "2024-01-14",
      creditLimit: "$80,000",
      outstandingBalance: "$8,200",
    },
    {
      id: "CL-003",
      name: "التجارة الدولية المحدودة",
      contact: "محمد الصادق",
      phone: "+218-93-456-7890",
      email: "mohamed@international-trade.ly",
      address: "مصراتة، ليبيا",
      status: "نشط",
      totalShipments: 32,
      totalRevenue: "$342,800",
      lastShipment: "2024-01-13",
      creditLimit: "$75,000",
      outstandingBalance: "$15,600",
    },
    {
      id: "CL-004",
      name: "شركة النقل السريع",
      contact: "عائشة حسن",
      phone: "+218-94-567-8901",
      email: "aisha@fast-transport.ly",
      address: "طرابلس، ليبيا",
      status: "معلق",
      totalShipments: 28,
      totalRevenue: "$289,600",
      lastShipment: "2024-01-10",
      creditLimit: "$60,000",
      outstandingBalance: "$22,400",
    },
    {
      id: "CL-005",
      name: "شركة الاستيراد الذهبي",
      contact: "يوسف أحمد",
      phone: "+218-95-678-9012",
      email: "youssef@golden-import.ly",
      address: "بنغازي، ليبيا",
      status: "نشط",
      totalShipments: 25,
      totalRevenue: "$256,400",
      lastShipment: "2024-01-12",
      creditLimit: "$50,000",
      outstandingBalance: "$5,800",
    },
  ]

  const filteredClients = useMemo(() => clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || client.status === statusFilter
    return matchesSearch && matchesStatus
  }), [clients, searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط":
        return "default"
      case "معلق":
        return "secondary"
      case "غير نشط":
        return "destructive"
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
            <h1 className="text-3xl font-bold">إدارة العملاء</h1>
            <p className="text-muted-foreground">إدارة معلومات العملاء وتتبع أنشطتهم التجارية</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                عميل جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إضافة عميل جديد</DialogTitle>
                <DialogDescription>أدخل معلومات العميل الجديد</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">اسم الشركة</Label>
                   <Input id="companyName" placeholder="اسم الشركة" value={clientForm.companyName} onChange={(e) => setClientForm(s => ({ ...s, companyName: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">الشخص المسؤول</Label>
                   <Input id="contactPerson" placeholder="اسم الشخص المسؤول" value={clientForm.contactPerson} onChange={(e) => setClientForm(s => ({ ...s, contactPerson: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                     <Input id="phone" placeholder="+218-XX-XXX-XXXX" value={clientForm.phone} onChange={(e) => setClientForm(s => ({ ...s, phone: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                     <Input id="email" type="email" placeholder="email@example.com" value={clientForm.email} onChange={(e) => setClientForm(s => ({ ...s, email: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                   <Input id="address" placeholder="العنوان الكامل" value={clientForm.address} onChange={(e) => setClientForm(s => ({ ...s, address: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="creditLimit">حد الائتمان</Label>
                    <Input id="creditLimit" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">شروط الدفع</Label>
                     <Select onValueChange={(v) => setClientForm(s => ({ ...s, status: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر شروط الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">نقداً</SelectItem>
                        <SelectItem value="15days">15 يوم</SelectItem>
                        <SelectItem value="30days">30 يوم</SelectItem>
                        <SelectItem value="60days">60 يوم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea id="notes" placeholder="ملاحظات إضافية" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                   <Button onClick={() => {
                     // إنشاء حساب مدين للعميل في الدليل المحلي تحت 1.1.2.3
                     const parent = gl.accounts.find(a => a.code === '1.1.2.3')
                     if (parent && clientForm.companyName) {
                       gl.addAccount({ name: `عميل: ${clientForm.companyName}`, parentId: parent.id })
                     }
                     setIsCreateDialogOpen(false)
                     setClientForm({ companyName: '', contactPerson: '', phone: '', email: '', address: '', status: 'نشط' })
                   }}>إضافة العميل</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+5.4% من الشهر الماضي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العملاء النشطون</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76</div>
              <p className="text-xs text-muted-foreground">85.4% من الإجمالي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوسط الإيرادات</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$31,985</div>
              <p className="text-xs text-muted-foreground">لكل عميل شهرياً</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الأرصدة المستحقة</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$64,500</div>
              <p className="text-xs text-muted-foreground">إجمالي المستحقات</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة العملاء</CardTitle>
            <CardDescription>إدارة معلومات العملاء وأنشطتهم</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في العملاء..."
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
                  <SelectItem value="نشط">نشط</SelectItem>
                  <SelectItem value="معلق">معلق</SelectItem>
                  <SelectItem value="غير نشط">غير نشط</SelectItem>
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
                  <TableHead>معرف العميل</TableHead>
                  <TableHead>اسم الشركة</TableHead>
                  <TableHead>الشخص المسؤول</TableHead>
                  <TableHead>معلومات الاتصال</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>عدد الشحنات</TableHead>
                  <TableHead>إجمالي الإيرادات</TableHead>
                  <TableHead>الرصيد المستحق</TableHead>
                  <TableHead>آخر شحنة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.id}</TableCell>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.contact}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {client.phone}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {client.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(client.status)}>{client.status}</Badge>
                    </TableCell>
                    <TableCell>{client.totalShipments}</TableCell>
                    <TableCell className="font-medium text-green-600">{client.totalRevenue}</TableCell>
                    <TableCell className="font-medium text-orange-600">{client.outstandingBalance}</TableCell>
                    <TableCell>{client.lastShipment}</TableCell>
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
