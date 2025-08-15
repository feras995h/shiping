"use client"

import { useState } from "react"
import { FileText, Upload, Search, Filter, Download, Eye, Edit, Trash2, Folder, ImageIcon } from "lucide-react"
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

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  const documents = [
    {
      id: "DOC-001",
      name: "بوليصة شحن - SH-001",
      type: "بوليصة شحن",
      client: "شركة التجارة الليبية",
      shipment: "SH-001",
      uploadDate: "2024-01-15",
      size: "2.4 MB",
      format: "PDF",
      status: "مؤكد",
      description: "بوليصة شحن من شنغهاي إلى طرابلس",
    },
    {
      id: "DOC-002",
      name: "فاتورة خدمة - INV-001",
      type: "فاتورة",
      client: "شركة التجارة الليبية",
      shipment: "SH-001",
      uploadDate: "2024-01-15",
      size: "1.8 MB",
      format: "PDF",
      status: "مدفوعة",
      description: "فاتورة خدمات الشحن والتخليص",
    },
    {
      id: "DOC-003",
      name: "إيصال حوالة - PAY-001",
      type: "إيصال حوالة",
      client: "شركة التجارة الليبية",
      shipment: "-",
      uploadDate: "2024-01-15",
      size: "0.9 MB",
      format: "PDF",
      status: "مؤكد",
      description: "إيصال استلام حوالة مالية",
    },
    {
      id: "DOC-004",
      name: "أمر تحويل - TXN-001",
      type: "أمر تحويل",
      client: "شركة التجارة الليبية",
      shipment: "-",
      uploadDate: "2024-01-14",
      size: "1.2 MB",
      format: "PDF",
      status: "منفذ",
      description: "أمر تحويل مبلغ إلى مورد في الصين",
    },
    {
      id: "DOC-005",
      name: "صور البضاعة - SH-002",
      type: "صور شحنة",
      client: "مؤسسة الاستيراد الحديثة",
      shipment: "SH-002",
      uploadDate: "2024-01-13",
      size: "5.6 MB",
      format: "ZIP",
      status: "مراجعة",
      description: "صور البضاعة قبل الشحن",
    },
    {
      id: "DOC-006",
      name: "شهادة منشأ - SH-002",
      type: "شهادة منشأ",
      client: "مؤسسة الاستيراد الحديثة",
      shipment: "SH-002",
      uploadDate: "2024-01-12",
      size: "1.5 MB",
      format: "PDF",
      status: "مؤكد",
      description: "شهادة منشأ البضاعة من الصين",
    },
  ]

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || doc.type === typeFilter
    return matchesSearch && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مؤكد":
        return "default"
      case "مدفوعة":
        return "default"
      case "منفذ":
        return "default"
      case "مراجعة":
        return "secondary"
      case "معلق":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getFileIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case "pdf":
        return FileText
      case "zip":
        return Folder
      case "jpg":
      case "png":
        return ImageIcon
      default:
        return FileText
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">أرشيف المستندات</h1>
            <p className="text-muted-foreground">إدارة وأرشفة جميع المستندات والوثائق</p>
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 ml-2" />
                رفع مستند
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>رفع مستند جديد</DialogTitle>
                <DialogDescription>أدخل تفاصيل المستند الجديد</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="docType">نوع المستند</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع المستند" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bill">بوليصة شحن</SelectItem>
                        <SelectItem value="invoice">فاتورة</SelectItem>
                        <SelectItem value="receipt">إيصال حوالة</SelectItem>
                        <SelectItem value="transfer">أمر تحويل</SelectItem>
                        <SelectItem value="photos">صور شحنة</SelectItem>
                        <SelectItem value="certificate">شهادة منشأ</SelectItem>
                        <SelectItem value="customs">مستندات جمركية</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shipment">الشحنة (اختياري)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الشحنة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sh1">SH-001 - شنغهاي إلى طرابلس</SelectItem>
                        <SelectItem value="sh2">SH-002 - قوانغتشو إلى بنغازي</SelectItem>
                        <SelectItem value="sh3">SH-003 - شنتشن إلى مصراتة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="docName">اسم المستند</Label>
                    <Input id="docName" placeholder="اسم المستند" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea id="description" placeholder="وصف المستند" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">الملف</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">اسحب الملف هنا أو انقر للاختيار</p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, JPG, PNG, ZIP (حد أقصى 10MB)</p>
                    <Input type="file" className="hidden" />
                    <Button variant="outline" className="mt-2 bg-transparent">
                      اختيار ملف
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={() => setIsUploadDialogOpen(false)}>رفع المستند</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستندات</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+18 هذا الأسبوع</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">بوالص الشحن</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">12.5% من الإجمالي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الفواتير</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">289</div>
              <p className="text-xs text-muted-foreground">23.2% من الإجمالي</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">حجم التخزين</CardTitle>
              <Folder className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.8 GB</div>
              <p className="text-xs text-muted-foreground">من أصل 10 GB</p>
            </CardContent>
          </Card>
        </div>

        {/* Document Categories */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">بوالص الشحن</h3>
              <p className="text-2xl font-bold text-blue-600">156</p>
              <p className="text-sm text-muted-foreground">مستند</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">الفواتير</h3>
              <p className="text-2xl font-bold text-green-600">289</p>
              <p className="text-sm text-muted-foreground">مستند</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <h3 className="font-semibold mb-2">إيصالات الحوالات</h3>
              <p className="text-2xl font-bold text-purple-600">423</p>
              <p className="text-sm text-muted-foreground">مستند</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-orange-600 mb-4" />
              <h3 className="font-semibold mb-2">صور الشحنات</h3>
              <p className="text-2xl font-bold text-orange-600">379</p>
              <p className="text-sm text-muted-foreground">مجموعة</p>
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المستندات</CardTitle>
            <CardDescription>جميع المستندات والوثائق المرفوعة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في المستندات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="تصفية حسب النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="بوليصة شحن">بوليصة شحن</SelectItem>
                  <SelectItem value="فاتورة">فاتورة</SelectItem>
                  <SelectItem value="إيصال حوالة">إيصال حوالة</SelectItem>
                  <SelectItem value="أمر تحويل">أمر تحويل</SelectItem>
                  <SelectItem value="صور شحنة">صور شحنة</SelectItem>
                  <SelectItem value="شهادة منشأ">شهادة منشأ</SelectItem>
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
                  <TableHead>المستند</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>الشحنة</TableHead>
                  <TableHead>تاريخ الرفع</TableHead>
                  <TableHead>الحجم</TableHead>
                  <TableHead>الصيغة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => {
                  const FileIcon = getFileIcon(doc.format)
                  return (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-muted-foreground">{doc.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>{doc.client}</TableCell>
                      <TableCell>{doc.shipment}</TableCell>
                      <TableCell>{doc.uploadDate}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{doc.format}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(doc.status)}>{doc.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
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
