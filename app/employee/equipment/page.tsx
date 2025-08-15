"use client"

import { useState } from "react"
import { 
  Wrench, 
  Tag, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  User,
  Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

interface Equipment {
  id: string
  name: string
  type: 'hand_tools' | 'power_tools' | 'measuring' | 'safety' | 'office' | 'specialized'
  serialNumber: string
  model: string
  brand: string
  purchaseDate: string
  purchasePrice: number
  currentValue: number
  location: string
  assignedTo: string
  status: 'available' | 'in_use' | 'maintenance' | 'retired' | 'lost'
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'broken'
  usageHours: number
  maxUsageHours: number
  description: string
}

const mockEquipment: Equipment[] = [
  {
    id: "1",
    name: "مثقاب كهربائي",
    type: "power_tools",
    serialNumber: "PT-001",
    model: "DEWALT D25133K",
    brand: "DEWALT",
    purchaseDate: "2023-02-15",
    purchasePrice: 800,
    currentValue: 650,
    location: "مستودع طرابلس الرئيسي",
    assignedTo: "أحمد الشريف",
    status: "in_use",
    condition: "good",
    usageHours: 120,
    maxUsageHours: 1000,
    description: "مثقاب كهربائي قوي للاستخدام المهني"
  },
  {
    id: "2",
    name: "مقياس ليزر",
    type: "measuring",
    serialNumber: "MS-001",
    model: "Leica DISTO D2",
    brand: "Leica",
    purchaseDate: "2023-05-20",
    purchasePrice: 300,
    currentValue: 280,
    location: "مكتب طرابلس",
    assignedTo: "سارة أحمد",
    status: "available",
    condition: "excellent",
    usageHours: 45,
    maxUsageHours: 500,
    description: "مقياس ليزر دقيق للمسافات"
  },
  {
    id: "3",
    name: "خوذة أمان",
    type: "safety",
    serialNumber: "SF-001",
    model: "Safety Helmet",
    brand: "3M",
    purchaseDate: "2023-08-10",
    purchasePrice: 50,
    currentValue: 45,
    location: "مستودع بنغازي",
    assignedTo: "محمد علي",
    status: "in_use",
    condition: "good",
    usageHours: 200,
    maxUsageHours: 1000,
    description: "خوذة أمان عالية الجودة"
  }
]

const getStatusColor = (status: Equipment['status']) => {
  switch (status) {
    case 'available': return 'bg-green-100 text-green-800'
    case 'in_use': return 'bg-blue-100 text-blue-800'
    case 'maintenance': return 'bg-yellow-100 text-yellow-800'
    case 'retired': return 'bg-gray-100 text-gray-800'
    case 'lost': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: Equipment['status']) => {
  switch (status) {
    case 'available': return 'متاح'
    case 'in_use': return 'قيد الاستخدام'
    case 'maintenance': return 'صيانة'
    case 'retired': return 'متقاعد'
    case 'lost': return 'مفقود'
    default: return 'غير محدد'
  }
}

const getConditionColor = (condition: Equipment['condition']) => {
  switch (condition) {
    case 'excellent': return 'bg-green-100 text-green-800'
    case 'good': return 'bg-blue-100 text-blue-800'
    case 'fair': return 'bg-yellow-100 text-yellow-800'
    case 'poor': return 'bg-orange-100 text-orange-800'
    case 'broken': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getConditionText = (condition: Equipment['condition']) => {
  switch (condition) {
    case 'excellent': return 'ممتاز'
    case 'good': return 'جيد'
    case 'fair': return 'مقبول'
    case 'poor': return 'ضعيف'
    case 'broken': return 'معطل'
    default: return 'غير محدد'
  }
}

const getTypeText = (type: Equipment['type']) => {
  switch (type) {
    case 'hand_tools': return 'أدوات يدوية'
    case 'power_tools': return 'أدوات كهربائية'
    case 'measuring': return 'أدوات قياس'
    case 'safety': return 'معدات الحماية'
    case 'office': return 'أجهزة مكتبية'
    case 'specialized': return 'معدات متخصصة'
    default: return 'غير محدد'
  }
}

export default function EmployeeEquipmentPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)

  const filteredEquipment = mockEquipment.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || equipment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getEquipmentStats = () => {
    const total = mockEquipment.length
    const available = mockEquipment.filter(e => e.status === 'available').length
    const inUse = mockEquipment.filter(e => e.status === 'in_use').length
    const maintenance = mockEquipment.filter(e => e.status === 'maintenance').length
    const totalValue = mockEquipment.reduce((sum, equipment) => sum + equipment.currentValue, 0)

    return { total, available, inUse, maintenance, totalValue }
  }

  const stats = getEquipmentStats()

  const getUsagePercentage = (equipment: Equipment) => {
    return (equipment.usageHours / equipment.maxUsageHours) * 100
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المعدات</h1>
          <p className="text-gray-600">إدارة معدات وأدوات الشركة</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="ml-2 h-4 w-4" />
          إضافة معدات جديدة
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المعدات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متاح</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">قيد الاستخدام</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inUse}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">صيانة</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
              </div>
              <Settings className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">القيمة الإجمالية</p>
                <p className="text-2xl font-bold text-purple-600">${stats.totalValue.toLocaleString()}</p>
              </div>
              <Tag className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في المعدات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="ml-2 h-4 w-4" />
              الحالة
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>الكل</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("available")}>متاح</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("in_use")}>قيد الاستخدام</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("maintenance")}>صيانة</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("retired")}>متقاعد</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("lost")}>مفقود</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Equipment Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEquipment.map((equipment) => (
          <Card key={equipment.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedEquipment(equipment)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{equipment.name}</CardTitle>
                  <CardDescription>{equipment.brand} {equipment.model}</CardDescription>
                </div>
                <Badge className={getStatusColor(equipment.status)}>
                  {getStatusText(equipment.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag className="h-4 w-4" />
                {equipment.serialNumber}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {equipment.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                {equipment.assignedTo}
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline">{getTypeText(equipment.type)}</Badge>
                <Badge className={getConditionColor(equipment.condition)}>
                  {getConditionText(equipment.condition)}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ساعات الاستخدام:</span>
                  <span className="font-medium">{equipment.usageHours} / {equipment.maxUsageHours}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>نسبة الاستخدام</span>
                    <span>{getUsagePercentage(equipment).toFixed(1)}%</span>
                  </div>
                  <Progress value={getUsagePercentage(equipment)} className="h-1" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>القيمة الحالية:</span>
                  <span className="font-medium">${equipment.currentValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>سعر الشراء:</span>
                  <span className="font-medium">${equipment.purchasePrice.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Equipment Details Modal */}
      {selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedEquipment.name}</CardTitle>
                  <CardDescription>{selectedEquipment.brand} {selectedEquipment.model}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedEquipment(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">الرقم التسلسلي</label>
                  <p className="text-sm text-gray-600">{selectedEquipment.serialNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">النوع</label>
                  <p className="text-sm text-gray-600">{getTypeText(selectedEquipment.type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">الموقع</label>
                  <p className="text-sm text-gray-600">{selectedEquipment.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">المسؤول</label>
                  <p className="text-sm text-gray-600">{selectedEquipment.assignedTo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">الحالة</label>
                  <Badge className={getStatusColor(selectedEquipment.status)}>
                    {getStatusText(selectedEquipment.status)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">الحالة الفنية</label>
                  <Badge className={getConditionColor(selectedEquipment.condition)}>
                    {getConditionText(selectedEquipment.condition)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">تاريخ الشراء</label>
                  <p className="text-sm text-gray-600">{selectedEquipment.purchaseDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">سعر الشراء</label>
                  <p className="text-sm text-gray-600">${selectedEquipment.purchasePrice.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">القيمة الحالية</label>
                  <p className="text-sm text-gray-600">${selectedEquipment.currentValue.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">ساعات الاستخدام</label>
                  <p className="text-sm text-gray-600">{selectedEquipment.usageHours} / {selectedEquipment.maxUsageHours}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">الوصف</label>
                <p className="text-sm text-gray-600 mt-1">{selectedEquipment.description}</p>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Edit className="ml-2 h-4 w-4" />
                  تعديل
                </Button>
                <Button variant="outline" className="flex-1">
                  <Settings className="ml-2 h-4 w-4" />
                  طلب صيانة
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 