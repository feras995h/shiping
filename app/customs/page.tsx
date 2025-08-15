"use client"

import { useState } from "react"
import {
  Shield,
  Package,
  FileText,
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
  Building2,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Scale,
  Truck,
  Ship,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import Layout from "@/components/layout"

export default function Customs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const customsDeclarations = [
    {
      id: "CD-001",
      shipmentId: "SH-001",
      client: "شركة التجارة الليبية",
      port: "ميناء طرابلس",
      status: "قيد المراجعة",
      progress: 30,
      arrivalDate: "2024-01-15",
      expectedClearance: "2024-01-20",
      customsValue: "45,200 د.ل",
      duties: "4,520 د.ل",
      taxes: "2,260 د.ل",
      totalFees: "6,780 د.ل",
      description: "إلكترونيات متنوعة",
      weight: "2,500 كجم",
      volume: "15 متر مكعب",
      documents: ["فاتورة تجارية", "قائمة تعبئة", "شهادة منشأ"],
      inspector: "أحمد محمد",
      lastUpdate: "2024-01-16 10:30",
    },
    {
      id: "CD-002",
      shipmentId: "SH-002",
      client: "مؤسسة الاستيراد الحديثة",
      port: "ميناء بنغازي",
      status: "تم التخليص",
      progress: 100,
      arrivalDate: "2024-01-10",
      expectedClearance: "2024-01-15",
      customsValue: "32,400 د.ل",
      duties: "3,240 د.ل",
      taxes: "1,620 د.ل",
      totalFees: "4,860 د.ل",
      description: "أقمشة وملابس جاهزة",
      weight: "1,800 كجم",
      volume: "12 متر مكعب",
      documents: ["فاتورة تجارية", "قائمة تعبئة", "شهادة منشأ", "شهادة صحية"],
      inspector: "محمد علي",
      lastUpdate: "2024-01-15 14:20",
    },
    {
      id: "CD-003",
      shipmentId: "SH-003",
      client: "شركة النقل السريع",
      port: "ميناء مصراتة",
      status: "معلق",
      progress: 60,
      arrivalDate: "2024-01-12",
      expectedClearance: "2024-01-18",
      customsValue: "28,500 د.ل",
      duties: "2,850 د.ل",
      taxes: "1,425 د.ل",
      totalFees: "4,275 د.ل",
      description: "هواتف ذكية وأجهزة لوحية",
      weight: "3,200 كجم",
      volume: "18 متر مكعب",
      documents: ["فاتورة تجارية", "قائمة تعبئة"],
      inspector: "فاطمة أحمد",
      lastUpdate: "2024-01-16 09:15",
    },
  ]

  const stats = [
    {
      title: "إجمالي التصاريح",
      value: "3",
      change: "+50%",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "from-blue-400 to-blue-600",
    },
    {
      title: "تم التخليص",
      value: "1",
      change: "+100%",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "from-emerald-400 to-emerald-600",
    },
    {
      title: "قيد المراجعة",
      value: "1",
      change: "0%",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "from-amber-400 to-amber-600",
    },
    {
      title: "معلق",
      value: "1",
      change: "+100%",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "from-red-400 to-red-600",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "تم التخليص":
        return <Badge className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">تم التخليص</Badge>
      case "قيد المراجعة":
        return <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">قيد المراجعة</Badge>
      case "معلق":
        return <Badge className="bg-gradient-to-r from-red-400 to-red-600 text-white">معلق</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredDeclarations = customsDeclarations.filter((declaration) => {
    const matchesSearch = declaration.client.includes(searchQuery) || 
                         declaration.id.includes(searchQuery) ||
                         declaration.description.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || declaration.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">التخليص الجمركي</h1>
            </div>
            <p className="text-slate-600">إدارة إجراءات التخليص الجمركي في ليبيا</p>
          </div>
          <div className="flex gap-2">
            <Button className="btn-gold">
              <Plus className="h-4 w-4 ml-2" />
              تصريح جديد
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
                  placeholder="البحث في التصاريح الجمركية..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 border-gold-200 focus:border-gold-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 border-gold-200 focus:border-gold-400">
                  <SelectValue placeholder="حالة التصريح" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="تم التخليص">تم التخليص</SelectItem>
                  <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                  <SelectItem value="معلق">معلق</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-gold-300 hover:bg-gold-50">
                <Filter className="h-4 w-4 ml-2" />
                فلترة متقدمة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Declarations Table */}
        <Card className="card-premium hover-lift">
          <CardHeader className="border-b border-gold-100">
            <CardTitle className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-red-600" />
              التصاريح الجمركية
            </CardTitle>
            <CardDescription>قائمة بجميع التصاريح الجمركية</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold-100">
                    <TableHead className="text-slate-700 font-semibold">رقم التصريح</TableHead>
                    <TableHead className="text-slate-700 font-semibold">العميل</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الميناء</TableHead>
                    <TableHead className="text-slate-700 font-semibold">القيمة الجمركية</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الرسوم</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الحالة</TableHead>
                    <TableHead className="text-slate-700 font-semibold">التاريخ المتوقع</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeclarations.map((declaration) => (
                    <TableRow key={declaration.id} className="border-gold-50 hover:bg-gold-50/30 transition-colors">
                      <TableCell className="font-medium text-slate-800">
                        <div>
                          <div className="font-bold">{declaration.id}</div>
                          <div className="text-xs text-slate-500">{declaration.shipmentId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-500" />
                          {declaration.client}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        <div className="flex items-center gap-2">
                          <Ship className="h-4 w-4 text-green-500" />
                          {declaration.port}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-blue-600">{declaration.customsValue}</TableCell>
                      <TableCell className="font-bold text-red-600">{declaration.totalFees}</TableCell>
                      <TableCell>{getStatusBadge(declaration.status)}</TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {declaration.expectedClearance}
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

        {/* Customs Process */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-red-600" />
              مراحل التخليص الجمركي
            </CardTitle>
            <CardDescription>الخطوات المطلوبة لإتمام التخليص الجمركي</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">تقديم المستندات</h3>
                    <p className="text-sm text-slate-600">إرسال الوثائق المطلوبة</p>
                  </div>
                </div>
                <Progress value={100} className="h-2 bg-blue-100" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">الفحص الجمركي</h3>
                    <p className="text-sm text-slate-600">فحص البضائع والوثائق</p>
                  </div>
                </div>
                <Progress value={75} className="h-2 bg-amber-100" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">حساب الرسوم</h3>
                    <p className="text-sm text-slate-600">تحديد الرسوم والضرائب</p>
                  </div>
                </div>
                <Progress value={50} className="h-2 bg-green-100" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">الإفراج</h3>
                    <p className="text-sm text-slate-600">إصدار إذن الإفراج</p>
                  </div>
                </div>
                <Progress value={25} className="h-2 bg-purple-100" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                ملخص الرسوم الجمركية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                  <p className="text-sm font-semibold text-emerald-800">إجمالي القيم الجمركية</p>
                  <p className="text-2xl font-bold text-emerald-600">106,100 د.ل</p>
                </div>
                <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                  <p className="text-sm font-semibold text-red-800">إجمالي الرسوم</p>
                  <p className="text-2xl font-bold text-red-600">15,915 د.ل</p>
                </div>
                <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <p className="text-sm font-semibold text-blue-800">متوسط وقت التخليص</p>
                  <p className="text-2xl font-bold text-blue-600">5 أيام</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-purple-600" />
                جهات الاتصال
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                <Phone className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-800">مكتب الجمارك</p>
                  <p className="text-sm text-emerald-700">+218 21 123 4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-800">البريد الإلكتروني</p>
                  <p className="text-sm text-blue-700">customs@libya.gov.ly</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                <MapPin className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-purple-800">العنوان</p>
                  <p className="text-sm text-purple-700">طرابلس، ليبيا</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
} 