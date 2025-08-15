"use client"

import { useState } from "react"
import {
  User,
  Users,
  Phone,
  Mail,
  MapPin,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Building2,
  Calendar,
  Clock,
  TrendingUp,
  MessageSquare,
  Star,
  Globe,
  Briefcase,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Layout from "@/components/layout"

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const contacts = [
    {
      id: "CT-001",
      name: "أحمد محمد علي",
      company: "شركة التجارة الليبية",
      position: "مدير المشتريات",
      email: "ahmed@libya-trade.ly",
      phone: "+218 91 234 5678",
      address: "طرابلس، ليبيا",
      category: "عميل",
      status: "نشط",
      lastContact: "2024-01-15",
      notes: "مهتم بالشحنات الإلكترونية",
      priority: "عالية",
      tags: ["إلكترونيات", "شحن بحري"],
    },
    {
      id: "CT-002",
      name: "فاطمة أحمد حسن",
      company: "مؤسسة الاستيراد الحديثة",
      position: "مدير العمليات",
      email: "fatima@modern-import.ly",
      phone: "+218 92 345 6789",
      address: "بنغازي، ليبيا",
      category: "عميل",
      status: "نشط",
      lastContact: "2024-01-14",
      notes: "تتعامل مع الأقمشة والملابس",
      priority: "متوسطة",
      tags: ["منسوجات", "ملابس"],
    },
    {
      id: "CT-003",
      name: "محمد علي الصغير",
      company: "شركة شنغهاي للتجارة",
      position: "مدير المبيعات",
      email: "mohamed@shanghai-trade.cn",
      phone: "+86 138 1234 5678",
      address: "شنغهاي، الصين",
      category: "مورد",
      status: "نشط",
      lastContact: "2024-01-16",
      notes: "مورد رئيسي للإلكترونيات",
      priority: "عالية",
      tags: ["إلكترونيات", "مورد رئيسي"],
    },
    {
      id: "CT-004",
      name: "لي تشن",
      company: "مصنع قوانغتشو للمنسوجات",
      position: "مدير الإنتاج",
      email: "li.chen@guangzhou-textiles.cn",
      phone: "+86 139 8765 4321",
      address: "قوانغتشو، الصين",
      category: "مورد",
      status: "نشط",
      lastContact: "2024-01-13",
      notes: "مورد للمنسوجات والأقمشة",
      priority: "متوسطة",
      tags: ["منسوجات", "أقمشة"],
    },
    {
      id: "CT-005",
      name: "علي حسن محمد",
      company: "شركة النقل السريع",
      position: "مدير الشحن",
      email: "ali@fast-shipping.ly",
      phone: "+218 93 456 7890",
      address: "مصراتة، ليبيا",
      category: "شريك",
      status: "نشط",
      lastContact: "2024-01-12",
      notes: "شريك في النقل المحلي",
      priority: "عالية",
      tags: ["نقل", "شريك"],
    },
  ]

  const stats = [
    {
      title: "إجمالي جهات الاتصال",
      value: "5",
      change: "+25%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "from-blue-400 to-blue-600",
    },
    {
      title: "العملاء",
      value: "2",
      change: "+50%",
      icon: User,
      color: "text-emerald-600",
      bgColor: "from-emerald-400 to-emerald-600",
    },
    {
      title: "الموردين",
      value: "2",
      change: "+100%",
      icon: Building2,
      color: "text-amber-600",
      bgColor: "from-amber-400 to-amber-600",
    },
    {
      title: "الشركاء",
      value: "1",
      change: "0%",
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "from-purple-400 to-purple-600",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "نشط":
        return <Badge className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">نشط</Badge>
      case "غير نشط":
        return <Badge className="bg-gradient-to-r from-red-400 to-red-600 text-white">غير نشط</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "عالية":
        return <Badge className="bg-gradient-to-r from-red-400 to-red-600 text-white">عالية</Badge>
      case "متوسطة":
        return <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">متوسطة</Badge>
      case "منخفضة":
        return <Badge className="bg-gradient-to-r from-green-400 to-green-600 text-white">منخفضة</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.includes(searchQuery) || 
                         contact.company.includes(searchQuery) ||
                         contact.email.includes(searchQuery)
    const matchesCategory = categoryFilter === "all" || contact.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">جهات الاتصال</h1>
            </div>
            <p className="text-slate-600">إدارة جهات الاتصال والعملاء والموردين</p>
          </div>
          <div className="flex gap-2">
            <Button className="btn-gold">
              <Plus className="h-4 w-4 ml-2" />
              جهة اتصال جديدة
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
                  placeholder="البحث في جهات الاتصال..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 border-gold-200 focus:border-gold-400"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48 border-gold-200 focus:border-gold-400">
                  <SelectValue placeholder="الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفئات</SelectItem>
                  <SelectItem value="عميل">العملاء</SelectItem>
                  <SelectItem value="مورد">الموردين</SelectItem>
                  <SelectItem value="شريك">الشركاء</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-gold-300 hover:bg-gold-50">
                <Filter className="h-4 w-4 ml-2" />
                فلترة متقدمة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card className="card-premium hover-lift">
          <CardHeader className="border-b border-gold-100">
            <CardTitle className="flex items-center gap-3">
              <Users className="h-5 w-5 text-purple-600" />
              جهات الاتصال
            </CardTitle>
            <CardDescription>قائمة بجميع جهات الاتصال</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold-100">
                    <TableHead className="text-slate-700 font-semibold">الاسم</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الشركة</TableHead>
                    <TableHead className="text-slate-700 font-semibold">المنصب</TableHead>
                    <TableHead className="text-slate-700 font-semibold">البريد الإلكتروني</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الهاتف</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الفئة</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الأولوية</TableHead>
                    <TableHead className="text-slate-700 font-semibold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id} className="border-gold-50 hover:bg-gold-50/30 transition-colors">
                      <TableCell className="font-medium text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold">{contact.name}</div>
                            <div className="text-xs text-slate-500">{contact.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-500" />
                          {contact.company}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{contact.position}</TableCell>
                      <TableCell className="text-slate-700">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-green-500" />
                          {contact.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-blue-500" />
                          {contact.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            contact.category === "عميل"
                              ? "default"
                              : contact.category === "مورد"
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            contact.category === "عميل"
                              ? "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white"
                              : contact.category === "مورد"
                                ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
                                : "bg-gradient-to-r from-purple-400 to-purple-600 text-white"
                          }
                        >
                          {contact.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{getPriorityBadge(contact.priority)}</TableCell>
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

        {/* Contact Categories */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="h-5 w-5 text-emerald-600" />
                العملاء
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contacts.filter(c => c.category === "عميل").map((contact) => (
                <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-emerald-800">{contact.name}</p>
                    <p className="text-sm text-emerald-700">{contact.company}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-emerald-50">
                    <MessageSquare className="h-4 w-4 text-emerald-600" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-amber-600" />
                الموردين
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contacts.filter(c => c.category === "مورد").map((contact) => (
                <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-amber-800">{contact.name}</p>
                    <p className="text-sm text-amber-700">{contact.company}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-amber-50">
                    <MessageSquare className="h-4 w-4 text-amber-600" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-purple-600" />
                الشركاء
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contacts.filter(c => c.category === "شريك").map((contact) => (
                <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-purple-800">{contact.name}</p>
                    <p className="text-sm text-purple-700">{contact.company}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-purple-50">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="h-5 w-5 text-gold-600" />
              إجراءات سريعة
            </CardTitle>
            <CardDescription>الوصول السريع للمهام الأساسية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
              <Button className="h-20 sm:h-24 flex-col gap-2 sm:gap-3 btn-gold hover-lift">
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-sm sm:text-base font-semibold">إرسال رسالة</span>
              </Button>
              <Button className="h-20 sm:h-24 flex-col gap-2 sm:gap-3 btn-gold hover-lift">
                <Phone className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-sm sm:text-base font-semibold">اتصال سريع</span>
              </Button>
              <Button className="h-20 sm:h-24 flex-col gap-2 sm:gap-3 btn-gold hover-lift">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-sm sm:text-base font-semibold">موعد جديد</span>
              </Button>
              <Button className="h-20 sm:h-24 flex-col gap-2 sm:gap-3 btn-gold hover-lift">
                <Globe className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-sm sm:text-base font-semibold">موقع الشركة</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
} 