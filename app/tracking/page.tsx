"use client"

import { useState } from "react"
import {
  Target,
  Package,
  MapPin,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  Truck,
  Ship,
  Plane,
  Train,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Globe,
  Phone,
  Mail,
  Navigation,
  Timer,
  Zap,
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

export default function Tracking() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const shipments = [
    {
      id: "SH-001",
      trackingNumber: "TRK-2024-001",
      client: "شركة التجارة الليبية",
      origin: "شنغهاي، الصين",
      destination: "طرابلس، ليبيا",
      status: "في الطريق",
      progress: 65,
      eta: "2024-01-20",
      currentLocation: "البحر الأبيض المتوسط",
      carrier: "شركة الشحن العالمية",
      vessel: "MS EVER GIVEN",
      weight: "2,500 كجم",
      volume: "15 متر مكعب",
      value: "45,200 د.ل",
      insurance: "مؤمن عليها",
      lastUpdate: "2024-01-15 14:30",
      timeline: [
        { date: "2024-01-10", time: "09:00", status: "تم الشحن", location: "شنغهاي", icon: Package },
        { date: "2024-01-12", time: "16:30", status: "في الميناء", location: "ميناء شنغهاي", icon: Ship },
        { date: "2024-01-14", time: "08:15", status: "في البحر", location: "البحر الأصفر", icon: Navigation },
        { date: "2024-01-15", time: "14:30", status: "في الطريق", location: "البحر الأبيض المتوسط", icon: Ship },
      ],
    },
    {
      id: "SH-002",
      trackingNumber: "TRK-2024-002",
      client: "مؤسسة الاستيراد الحديثة",
      origin: "قوانغتشو، الصين",
      destination: "بنغازي، ليبيا",
      status: "التخليص الجمركي",
      progress: 85,
      eta: "2024-01-18",
      currentLocation: "ميناء بنغازي",
      carrier: "شركة النقل البحري",
      vessel: "MV LIBYA STAR",
      weight: "1,800 كجم",
      volume: "12 متر مكعب",
      value: "32,400 د.ل",
      insurance: "مؤمن عليها",
      lastUpdate: "2024-01-16 11:45",
      timeline: [
        { date: "2024-01-08", time: "10:30", status: "تم الشحن", location: "قوانغتشو", icon: Package },
        { date: "2024-01-10", time: "14:20", status: "في الميناء", location: "ميناء قوانغتشو", icon: Ship },
        { date: "2024-01-13", time: "09:45", status: "في البحر", location: "بحر الصين الجنوبي", icon: Navigation },
        { date: "2024-01-15", time: "16:00", status: "وصل الميناء", location: "ميناء بنغازي", icon: Ship },
        { date: "2024-01-16", time: "11:45", status: "التخليص الجمركي", location: "الجمرك", icon: Clock },
      ],
    },
    {
      id: "SH-003",
      trackingNumber: "TRK-2024-003",
      client: "شركة النقل السريع",
      origin: "شنتشن، الصين",
      destination: "مصراتة، ليبيا",
      status: "تم التسليم",
      progress: 100,
      eta: "2024-01-16",
      currentLocation: "مصراتة",
      carrier: "شركة الشحن السريع",
      vessel: "FAST SHIPPING 1",
      weight: "3,200 كجم",
      volume: "18 متر مكعب",
      value: "28,500 د.ل",
      insurance: "مؤمن عليها",
      lastUpdate: "2024-01-16 15:20",
      timeline: [
        { date: "2024-01-05", time: "08:00", status: "تم الشحن", location: "شنتشن", icon: Package },
        { date: "2024-01-07", time: "12:30", status: "في الميناء", location: "ميناء شنتشن", icon: Ship },
        { date: "2024-01-10", time: "07:15", status: "في البحر", location: "بحر الصين الجنوبي", icon: Navigation },
        { date: "2024-01-13", time: "13:45", status: "وصل الميناء", location: "ميناء مصراتة", icon: Ship },
        { date: "2024-01-14", time: "10:30", status: "التخليص الجمركي", location: "الجمرك", icon: Clock },
        { date: "2024-01-15", time: "14:20", status: "في النقل", location: "طريق مصراتة", icon: Truck },
        { date: "2024-01-16", time: "15:20", status: "تم التسليم", location: "مصراتة", icon: CheckCircle },
      ],
    },
  ]

  const stats = [
    {
      title: "إجمالي الشحنات",
      value: "3",
      change: "+25%",
      icon: Package,
      color: "text-blue-600",
      bgColor: "from-blue-400 to-blue-600",
    },
    {
      title: "في الطريق",
      value: "1",
      change: "+100%",
      icon: Ship,
      color: "text-amber-600",
      bgColor: "from-amber-400 to-amber-600",
    },
    {
      title: "التخليص الجمركي",
      value: "1",
      change: "0%",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "from-purple-400 to-purple-600",
    },
    {
      title: "تم التسليم",
      value: "1",
      change: "+50%",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "from-emerald-400 to-emerald-600",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "في الطريق":
        return <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">في الطريق</Badge>
      case "التخليص الجمركي":
        return <Badge className="bg-gradient-to-r from-purple-400 to-purple-600 text-white">التخليص الجمركي</Badge>
      case "تم التسليم":
        return <Badge className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">تم التسليم</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "في الطريق":
        return <Ship className="h-4 w-4 text-amber-600" />
      case "التخليص الجمركي":
        return <Clock className="h-4 w-4 text-purple-600" />
      case "تم التسليم":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />
      default:
        return <Package className="h-4 w-4 text-slate-600" />
    }
  }

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch = shipment.client.includes(searchQuery) || 
                         shipment.trackingNumber.includes(searchQuery) ||
                         shipment.id.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">تتبع الشحنات</h1>
            </div>
            <p className="text-slate-600">تتبع الشحنات من الصين إلى ليبيا في الوقت الفعلي</p>
          </div>
          <div className="flex gap-2">
            <Button className="btn-gold">
              <Search className="h-4 w-4 ml-2" />
              تتبع جديد
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

        {/* Search */}
        <Card className="card-premium">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="البحث برقم التتبع أو اسم العميل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 border-gold-200 focus:border-gold-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 border-gold-200 focus:border-gold-400">
                  <SelectValue placeholder="حالة الشحنة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="في الطريق">في الطريق</SelectItem>
                  <SelectItem value="التخليص الجمركي">التخليص الجمركي</SelectItem>
                  <SelectItem value="تم التسليم">تم التسليم</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-gold-300 hover:bg-gold-50">
                <Filter className="h-4 w-4 ml-2" />
                فلترة متقدمة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Shipments */}
        <div className="space-y-6">
          {filteredShipments.map((shipment) => (
            <Card key={shipment.id} className="card-premium hover-lift">
              <CardHeader className="border-b border-gold-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(shipment.status)}
                      <div>
                        <CardTitle className="text-lg sm:text-xl">{shipment.id}</CardTitle>
                        <CardDescription className="text-slate-600">
                          {shipment.trackingNumber} • {shipment.client}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(shipment.status)}
                    <Button variant="outline" size="sm" className="border-gold-300 hover:bg-gold-50">
                      <Eye className="h-4 w-4 ml-2" />
                      تفاصيل
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Shipment Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      معلومات الشحنة
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">الوزن:</span>
                        <span className="font-medium">{shipment.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">الحجم:</span>
                        <span className="font-medium">{shipment.volume}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">القيمة:</span>
                        <span className="font-bold text-emerald-600">{shipment.value}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">التأمين:</span>
                        <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                          {shipment.insurance}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Route Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <Navigation className="h-4 w-4" />
                      المسار
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="text-sm font-medium">من: {shipment.origin}</p>
                          <p className="text-xs text-slate-500">نقطة البداية</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">إلى: {shipment.destination}</p>
                          <p className="text-xs text-slate-500">الوجهة النهائية</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ship className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">{shipment.carrier}</p>
                          <p className="text-xs text-slate-500">{shipment.vessel}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      التقدم
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">التقدم:</span>
                        <span className="font-bold text-gold-600">{shipment.progress}%</span>
                      </div>
                      <Progress value={shipment.progress} className="h-3 bg-gold-100" />
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">الوصول المتوقع:</span>
                        <span className="font-medium">{shipment.eta}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">آخر تحديث:</span>
                        <span className="font-medium">{shipment.lastUpdate}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                        <p className="text-sm font-medium text-blue-800">الموقع الحالي</p>
                        <p className="text-sm text-blue-700">{shipment.currentLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-6 pt-6 border-t border-gold-100">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    الجدول الزمني
                  </h3>
                  <div className="space-y-4">
                    {shipment.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center">
                            <event.icon className="h-4 w-4 text-white" />
                          </div>
                          {index < shipment.timeline.length - 1 && (
                            <div className="w-0.5 h-8 bg-gold-200 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-slate-800">{event.status}</h4>
                            <div className="text-sm text-slate-500">
                              {event.date} • {event.time}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{event.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map Overview */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-blue-600" />
              نظرة عامة على الخريطة
            </CardTitle>
            <CardDescription>تتبع جميع الشحنات على الخريطة العالمية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center">
              <div className="text-center space-y-2">
                <Globe className="h-12 w-12 text-blue-500 mx-auto" />
                <p className="text-blue-700 font-medium">خريطة تفاعلية</p>
                <p className="text-blue-600 text-sm">عرض جميع الشحنات على الخريطة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-emerald-600" />
              دعم العملاء
            </CardTitle>
            <CardDescription>تواصل معنا للحصول على المساعدة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                <Phone className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-800">اتصل بنا</p>
                  <p className="text-sm text-emerald-700">+218 91 234 5678</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-800">راسلنا</p>
                  <p className="text-sm text-blue-700">support@libya-shipping.ly</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                <Target className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-purple-800">تتبع فوري</p>
                  <p className="text-sm text-purple-700">24/7 متاح</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
} 