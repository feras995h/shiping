"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Database, Download, Upload, RefreshCw, Plus, Edit, Trash2, 
  CheckCircle, AlertTriangle, Clock, HardDrive, Cloud, Settings
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Backup {
  id: string
  name: string
  type: 'full' | 'incremental' | 'differential'
  status: 'completed' | 'in_progress' | 'failed' | 'scheduled'
  size: string
  createdAt: string
  completedAt?: string
  location: 'local' | 'cloud' | 'both'
  description: string
  retention: string
}

const mockBackups: Backup[] = [
  {
    id: "1",
    name: "نسخة احتياطية كاملة - اليومية",
    type: "full",
    status: "completed",
    size: "2.5 GB",
    createdAt: "2024-01-15T02:00:00Z",
    completedAt: "2024-01-15T02:15:00Z",
    location: "both",
    description: "نسخة احتياطية كاملة لقاعدة البيانات والملفات",
    retention: "30 يوم"
  },
  {
    id: "2",
    name: "نسخة احتياطية تفاضلية - الأسبوعية",
    type: "differential",
    status: "completed",
    size: "850 MB",
    createdAt: "2024-01-14T02:00:00Z",
    completedAt: "2024-01-14T02:08:00Z",
    location: "cloud",
    description: "نسخة احتياطية تفاضلية للتغييرات الأسبوعية",
    retention: "90 يوم"
  },
  {
    id: "3",
    name: "نسخة احتياطية تدريجية - الساعة",
    type: "incremental",
    status: "in_progress",
    size: "45 MB",
    createdAt: "2024-01-15T10:00:00Z",
    location: "local",
    description: "نسخة احتياطية تدريجية للتغييرات الساعية",
    retention: "7 أيام"
  },
  {
    id: "4",
    name: "نسخة احتياطية كاملة - الشهرية",
    type: "full",
    status: "scheduled",
    size: "0 MB",
    createdAt: "2024-01-16T02:00:00Z",
    location: "both",
    description: "نسخة احتياطية كاملة شهرية",
    retention: "1 سنة"
  },
  {
    id: "5",
    name: "نسخة احتياطية تفاضلية - فاشلة",
    type: "differential",
    status: "failed",
    size: "0 MB",
    createdAt: "2024-01-13T02:00:00Z",
    location: "local",
    description: "نسخة احتياطية فشلت في الإكمال",
    retention: "7 أيام"
  }
]

const getTypeColor = (type: string) => {
  switch (type) {
    case 'full': return 'bg-blue-100 text-blue-800'
    case 'incremental': return 'bg-green-100 text-green-800'
    case 'differential': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'in_progress': return 'bg-yellow-100 text-yellow-800'
    case 'failed': return 'bg-red-100 text-red-800'
    case 'scheduled': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle className="h-4 w-4" />
    case 'in_progress': return <RefreshCw className="h-4 w-4 animate-spin" />
    case 'failed': return <AlertTriangle className="h-4 w-4" />
    case 'scheduled': return <Clock className="h-4 w-4" />
    default: return <AlertTriangle className="h-4 w-4" />
  }
}

const getLocationIcon = (location: string) => {
  switch (location) {
    case 'local': return <HardDrive className="h-4 w-4" />
    case 'cloud': return <Cloud className="h-4 w-4" />
    case 'both': return <Database className="h-4 w-4" />
    default: return <HardDrive className="h-4 w-4" />
  }
}

export default function AdminBackupsPage() {
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredBackups = mockBackups.filter(backup => {
    const matchesType = selectedType === "all" || backup.type === selectedType
    const matchesStatus = selectedStatus === "all" || backup.status === selectedStatus
    return matchesType && matchesStatus
  })

  const completedBackups = mockBackups.filter(b => b.status === 'completed')
  const failedBackups = mockBackups.filter(b => b.status === 'failed')
  const totalSize = completedBackups.reduce((acc, backup) => {
    const size = parseFloat(backup.size.replace(' GB', '').replace(' MB', ''))
    return acc + (backup.size.includes('GB') ? size * 1024 : size)
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة النسخ الاحتياطية</h1>
          <p className="text-sm text-muted-foreground">
            إدارة النسخ الاحتياطية واستعادة البيانات
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 ml-2" />
            إعدادات النسخ الاحتياطية
          </Button>
          <Button className="btn-gold">
            <Plus className="h-4 w-4 ml-2" />
            إنشاء نسخة احتياطية
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي النسخ</p>
                <p className="text-2xl font-bold">{mockBackups.length}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">نسخ مكتملة</p>
                <p className="text-2xl font-bold text-green-600">{completedBackups.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">نسخ فاشلة</p>
                <p className="text-2xl font-bold text-red-600">{failedBackups.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الحجم</p>
                <p className="text-2xl font-bold text-gold-600">{(totalSize / 1024).toFixed(1)} GB</p>
              </div>
              <HardDrive className="h-8 w-8 text-gold-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="backups" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="backups">النسخ الاحتياطية</TabsTrigger>
          <TabsTrigger value="restore">الاستعادة</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="backups" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="full">كاملة</option>
                  <option value="incremental">تدريجية</option>
                  <option value="differential">تفاضلية</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="completed">مكتملة</option>
                  <option value="in_progress">قيد التنفيذ</option>
                  <option value="failed">فاشلة</option>
                  <option value="scheduled">مجدولة</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Backups List */}
          <div className="grid gap-4">
            {filteredBackups.map((backup) => (
              <Card key={backup.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        backup.status === 'completed' ? 'bg-green-100' :
                        backup.status === 'failed' ? 'bg-red-100' :
                        backup.status === 'in_progress' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        {getStatusIcon(backup.status)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{backup.name}</h3>
                          <Badge className={getTypeColor(backup.type)}>
                            {backup.type === 'full' ? 'كاملة' :
                             backup.type === 'incremental' ? 'تدريجية' : 'تفاضلية'}
                          </Badge>
                          <Badge className={getStatusColor(backup.status)}>
                            {backup.status === 'completed' ? 'مكتملة' :
                             backup.status === 'in_progress' ? 'قيد التنفيذ' :
                             backup.status === 'failed' ? 'فاشلة' : 'مجدولة'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{backup.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3" />
                            {backup.size}
                          </div>
                          <div className="flex items-center gap-1">
                            {getLocationIcon(backup.location)}
                            {backup.location === 'local' ? 'محلي' :
                             backup.location === 'cloud' ? 'سحابي' : 'محلي وسحابي'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(backup.createdAt).toLocaleString('ar-SA')}
                          </div>
                          {backup.completedAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              اكتملت: {new Date(backup.completedAt).toLocaleTimeString('ar-SA')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Upload className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <span className="sr-only">إجراءات</span>
                            <span>...</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 ml-2" />
                            تحميل النسخة
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Upload className="h-4 w-4 ml-2" />
                            استعادة النسخة
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 ml-2" />
                            تعديل الإعدادات
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 ml-2" />
                            حذف النسخة
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="restore" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                استعادة البيانات
              </CardTitle>
              <CardDescription>
                استعادة البيانات من النسخ الاحتياطية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  اختر نسخة احتياطية للاستعادة منها
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline" className="h-32 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 mb-2" />
                    <span>رفع ملف نسخة احتياطية</span>
                  </Button>
                  <Button variant="outline" className="h-32 flex flex-col items-center justify-center">
                    <Database className="h-8 w-8 mb-2" />
                    <span>استعادة من نسخة محلية</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات النسخ الاحتياطية
              </CardTitle>
              <CardDescription>
                تخصيص إعدادات النسخ الاحتياطية التلقائية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">النسخ الاحتياطية اليومية</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>نوع النسخة</span>
                        <Badge>كاملة</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>وقت النسخ</span>
                        <span>02:00 صباحاً</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>الاحتفاظ</span>
                        <span>30 يوم</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">النسخ الاحتياطية الأسبوعية</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>نوع النسخة</span>
                        <Badge>تفاضلية</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>يوم النسخ</span>
                        <span>الأحد</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>الاحتفاظ</span>
                        <span>90 يوم</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button className="btn-gold">
                    <Settings className="h-4 w-4 ml-2" />
                    تعديل الإعدادات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 