"use client"

import { useState } from "react"
import { 
  Truck, 
  Car, 
  Tag, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Fuel,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  User,
  Wrench,
  Gauge
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Vehicle {
  id: string
  name: string
  type: 'truck' | 'car' | 'van' | 'trailer' | 'forklift'
  category: string
  licensePlate: string
  model: string
  brand: string
  year: number
  color: string
  purchaseDate: string
  purchasePrice: number
  currentValue: number
  location: string
  assignedTo: string
  status: 'available' | 'in_use' | 'maintenance' | 'retired' | 'out_of_service'
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'broken'
  fuelType: 'diesel' | 'gasoline' | 'electric' | 'hybrid' | 'none'
  fuelCapacity: number
  currentFuel: number
  mileage: number
  lastService: string
  nextService: string
  insuranceExpiry: string
  registrationExpiry: string
  description: string
  features: string[]
  documents: string[]
  maintenanceHistory: MaintenanceRecord[]
}

interface MaintenanceRecord {
  id: string
  date: string
  type: 'routine' | 'repair' | 'emergency'
  description: string
  cost: number
  mileage: number
  performedBy: string
  nextService: string
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "شاحنة نقل كبيرة",
    type: "truck",
    category: "شاحنات نقل",
    licensePlate: "TR-12345",
    model: "Actros 1845",
    brand: "Mercedes-Benz",
    year: 2022,
    color: "أبيض",
    purchaseDate: "2022-03-15",
    purchasePrice: 280000,
    currentValue: 240000,
    location: "مستودع طرابلس الرئيسي",
    assignedTo: "أحمد الشريف",
    status: "in_use",
    condition: "good",
    fuelType: "diesel",
    fuelCapacity: 400,
    currentFuel: 320,
    mileage: 45000,
    lastService: "2024-01-10",
    nextService: "2024-04-10",
    insuranceExpiry: "2024-12-31",
    registrationExpiry: "2024-12-31",
    description: "شاحنة نقل كبيرة للمسافات الطويلة، سعة تحميل 20 طن، محرك قوي",
    features: ["مكيف هواء", "GPS", "كاميرا خلفية", "نظام تبريد"],
    documents: ["registration.pdf", "insurance.pdf", "manual.pdf"],
    maintenanceHistory: [
      {
        id: "m1",
        date: "2024-01-10",
        type: "routine",
        description: "صيانة دورية، تغيير الزيت والفلتر",
        cost: 500,
        mileage: 45000,
        performedBy: "مركز الصيانة المعتمد",
        nextService: "2024-04-10"
      }
    ]
  },
  {
    id: "2",
    name: "سيارة نقل صغيرة",
    type: "van",
    category: "سيارات نقل",
    licensePlate: "TR-67890",
    model: "Sprinter",
    brand: "Mercedes-Benz",
    year: 2021,
    color: "أزرق",
    purchaseDate: "2021-08-20",
    purchasePrice: 85000,
    currentValue: 70000,
    location: "مستودع بنغازي",
    assignedTo: "محمد علي",
    status: "available",
    condition: "excellent",
    fuelType: "diesel",
    fuelCapacity: 80,
    currentFuel: 65,
    mileage: 28000,
    lastService: "2024-01-15",
    nextService: "2024-04-15",
    insuranceExpiry: "2024-12-31",
    registrationExpiry: "2024-12-31",
    description: "سيارة نقل صغيرة للمسافات القصيرة، سعة تحميل 1.5 طن",
    features: ["مكيف هواء", "GPS", "نظام صوت"],
    documents: ["registration.pdf", "insurance.pdf"],
    maintenanceHistory: [
      {
        id: "m1",
        date: "2024-01-15",
        type: "routine",
        description: "صيانة دورية، فحص شامل",
        cost: 300,
        mileage: 28000,
        performedBy: "مركز الصيانة المعتمد",
        nextService: "2024-04-15"
      }
    ]
  },
  {
    id: "3",
    name: "سيارة إدارية",
    type: "car",
    category: "سيارات إدارية",
    licensePlate: "TR-11111",
    model: "Camry",
    brand: "Toyota",
    year: 2023,
    color: "أسود",
    purchaseDate: "2023-06-10",
    purchasePrice: 45000,
    currentValue: 42000,
    location: "مكتب طرابلس",
    assignedTo: "سارة أحمد",
    status: "in_use",
    condition: "excellent",
    fuelType: "gasoline",
    fuelCapacity: 60,
    currentFuel: 45,
    mileage: 15000,
    lastService: "2024-01-05",
    nextService: "2024-04-05",
    insuranceExpiry: "2024-12-31",
    registrationExpiry: "2024-12-31",
    description: "سيارة إدارية فاخرة للمديرين والزيارات المهمة",
    features: ["مكيف هواء", "GPS", "نظام صوت فاخر", "جلد طبيعي"],
    documents: ["registration.pdf", "insurance.pdf", "manual.pdf"],
    maintenanceHistory: [
      {
        id: "m1",
        date: "2024-01-05",
        type: "routine",
        description: "صيانة دورية، تغيير الزيت",
        cost: 200,
        mileage: 15000,
        performedBy: "مركز الصيانة المعتمد",
        nextService: "2024-04-05"
      }
    ]
  },
  {
    id: "4",
    name: "مقطورة نقل",
    type: "trailer",
    category: "مقطورات",
    licensePlate: "TR-22222",
    model: "Heavy Duty Trailer",
    brand: "Custom Built",
    year: 2020,
    color: "أحمر",
    purchaseDate: "2020-11-05",
    purchasePrice: 35000,
    currentValue: 25000,
    location: "مستودع طرابلس الرئيسي",
    assignedTo: "فاطمة حسن",
    status: "maintenance",
    condition: "fair",
    fuelType: "none",
    fuelCapacity: 0,
    currentFuel: 0,
    mileage: 0,
    lastService: "2024-01-20",
    nextService: "2024-02-20",
    insuranceExpiry: "2024-12-31",
    registrationExpiry: "2024-12-31",
    description: "مقطورة نقل ثقيلة، سعة تحميل 25 طن",
    features: ["إضاءة LED", "فرامل هوائية", "نظام تعليق متطور"],
    documents: ["registration.pdf", "manual.pdf"],
    maintenanceHistory: [
      {
        id: "m1",
        date: "2024-01-20",
        type: "repair",
        description: "إصلاح نظام الفرامل",
        cost: 800,
        mileage: 0,
        performedBy: "ورشة المقطورات",
        nextService: "2024-02-20"
      }
    ]
  }
]

const getStatusColor = (status: Vehicle['status']) => {
  switch (status) {
    case 'available': return 'bg-green-100 text-green-800'
    case 'in_use': return 'bg-blue-100 text-blue-800'
    case 'maintenance': return 'bg-yellow-100 text-yellow-800'
    case 'retired': return 'bg-gray-100 text-gray-800'
    case 'out_of_service': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: Vehicle['status']) => {
  switch (status) {
    case 'available': return 'متاح'
    case 'in_use': return 'قيد الاستخدام'
    case 'maintenance': return 'صيانة'
    case 'retired': return 'متقاعد'
    case 'out_of_service': return 'خارج الخدمة'
    default: return 'غير محدد'
  }
}

const getConditionColor = (condition: Vehicle['condition']) => {
  switch (condition) {
    case 'excellent': return 'bg-green-100 text-green-800'
    case 'good': return 'bg-blue-100 text-blue-800'
    case 'fair': return 'bg-yellow-100 text-yellow-800'
    case 'poor': return 'bg-orange-100 text-orange-800'
    case 'broken': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getConditionText = (condition: Vehicle['condition']) => {
  switch (condition) {
    case 'excellent': return 'ممتاز'
    case 'good': return 'جيد'
    case 'fair': return 'مقبول'
    case 'poor': return 'ضعيف'
    case 'broken': return 'معطل'
    default: return 'غير محدد'
  }
}

const getTypeText = (type: Vehicle['type']) => {
  switch (type) {
    case 'truck': return 'شاحنة'
    case 'car': return 'سيارة'
    case 'van': return 'فان'
    case 'trailer': return 'مقطورة'
    case 'forklift': return 'رافعة شوكية'
    default: return 'غير محدد'
  }
}

const getFuelTypeText = (fuelType: Vehicle['fuelType']) => {
  switch (fuelType) {
    case 'diesel': return 'ديزل'
    case 'gasoline': return 'بنزين'
    case 'electric': return 'كهربائي'
    case 'hybrid': return 'هجين'
    case 'none': return 'لا يوجد'
    default: return 'غير محدد'
  }
}

export default function EmployeeVehiclesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [conditionFilter, setConditionFilter] = useState<string>("all")
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const filteredVehicles = mockVehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter
    const matchesType = typeFilter === "all" || vehicle.type === typeFilter
    const matchesCondition = conditionFilter === "all" || vehicle.condition === conditionFilter
    return matchesSearch && matchesStatus && matchesType && matchesCondition
  })

  const getVehicleStats = () => {
    const total = mockVehicles.length
    const available = mockVehicles.filter(v => v.status === 'available').length
    const inUse = mockVehicles.filter(v => v.status === 'in_use').length
    const maintenance = mockVehicles.filter(v => v.status === 'maintenance').length
    const totalValue = mockVehicles.reduce((sum, vehicle) => sum + vehicle.currentValue, 0)

    return { total, available, inUse, maintenance, totalValue }
  }

  const stats = getVehicleStats()

  const getFuelPercentage = (vehicle: Vehicle) => {
    if (vehicle.fuelCapacity === 0) return 0
    return (vehicle.currentFuel / vehicle.fuelCapacity) * 100
  }

  const getDepreciationPercentage = (vehicle: Vehicle) => {
    return ((vehicle.purchasePrice - vehicle.currentValue) / vehicle.purchasePrice) * 100
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المركبات</h1>
          <p className="text-gray-600">إدارة أسطول المركبات والمركبات التجارية</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="ml-2 h-4 w-4" />
          إضافة مركبة جديدة
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المركبات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
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
              <Wrench className="h-8 w-8 text-yellow-600" />
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
              placeholder="البحث في المركبات..."
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
            <DropdownMenuItem onClick={() => setStatusFilter("out_of_service")}>خارج الخدمة</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="ml-2 h-4 w-4" />
              النوع
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTypeFilter("all")}>الكل</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("truck")}>شاحنة</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("car")}>سيارة</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("van")}>فان</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("trailer")}>مقطورة</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("forklift")}>رافعة شوكية</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="ml-2 h-4 w-4" />
              الحالة
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setConditionFilter("all")}>الكل</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConditionFilter("excellent")}>ممتاز</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConditionFilter("good")}>جيد</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConditionFilter("fair")}>مقبول</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConditionFilter("poor")}>ضعيف</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConditionFilter("broken")}>معطل</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Vehicles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedVehicle(vehicle)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                  <CardDescription>{vehicle.brand} {vehicle.model} - {vehicle.year}</CardDescription>
                </div>
                <Badge className={getStatusColor(vehicle.status)}>
                  {getStatusText(vehicle.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag className="h-4 w-4" />
                {vehicle.licensePlate}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {vehicle.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                {vehicle.assignedTo}
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline">{getTypeText(vehicle.type)}</Badge>
                <Badge className={getConditionColor(vehicle.condition)}>
                  {getConditionText(vehicle.condition)}
                </Badge>
              </div>
              {vehicle.fuelCapacity > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>الوقود:</span>
                    <span className="font-medium">{vehicle.currentFuel}L / {vehicle.fuelCapacity}L</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>نسبة الوقود</span>
                      <span>{getFuelPercentage(vehicle).toFixed(1)}%</span>
                    </div>
                    <Progress value={getFuelPercentage(vehicle)} className="h-1" />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>المسافة المقطوعة:</span>
                  <span className="font-medium">{vehicle.mileage.toLocaleString()} كم</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>القيمة الحالية:</span>
                  <span className="font-medium">${vehicle.currentValue.toLocaleString()}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>الاستهلاك</span>
                    <span>{getDepreciationPercentage(vehicle).toFixed(1)}%</span>
                  </div>
                  <Progress value={getDepreciationPercentage(vehicle)} className="h-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedVehicle.name}</CardTitle>
                  <CardDescription>{selectedVehicle.brand} {selectedVehicle.model} - {selectedVehicle.year}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedVehicle(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">التفاصيل</TabsTrigger>
                  <TabsTrigger value="maintenance">الصيانة</TabsTrigger>
                  <TabsTrigger value="documents">المستندات</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">رقم اللوحة</label>
                      <p className="text-sm text-gray-600">{selectedVehicle.licensePlate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">النوع</label>
                      <p className="text-sm text-gray-600">{getTypeText(selectedVehicle.type)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">الفئة</label>
                      <p className="text-sm text-gray-600">{selectedVehicle.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">اللون</label>
                      <p className="text-sm text-gray-600">{selectedVehicle.color}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">الموقع</label>
                      <p className="text-sm text-gray-600">{selectedVehicle.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">المسؤول</label>
                      <p className="text-sm text-gray-600">{selectedVehicle.assignedTo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">الحالة</label>
                      <Badge className={getStatusColor(selectedVehicle.status)}>
                        {getStatusText(selectedVehicle.status)}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">الحالة الفنية</label>
                      <Badge className={getConditionColor(selectedVehicle.condition)}>
                        {getConditionText(selectedVehicle.condition)}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">نوع الوقود</label>
                      <p className="text-sm text-gray-600">{getFuelTypeText(selectedVehicle.fuelType)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">المسافة المقطوعة</label>
                      <p className="text-sm text-gray-600">{selectedVehicle.mileage.toLocaleString()} كم</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">تاريخ الشراء</label>
                      <p className="text-sm text-gray-600">{selectedVehicle.purchaseDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">سعر الشراء</label>
                      <p className="text-sm text-gray-600">${selectedVehicle.purchasePrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">القيمة الحالية</label>
                      <p className="text-sm text-gray-600">${selectedVehicle.currentValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">انتهاء التأمين</label>
                      <p className="text-sm text-gray-600">{selectedVehicle.insuranceExpiry}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">انتهاء التسجيل</label>
                      <p className="text-sm text-gray-600">{selectedVehicle.registrationExpiry}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">الوصف</label>
                    <p className="text-sm text-gray-600 mt-1">{selectedVehicle.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">المميزات</label>
                    <div className="flex gap-2 mt-2">
                      {selectedVehicle.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="maintenance" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">سجل الصيانة</h3>
                    <Button size="sm">
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة صيانة
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {selectedVehicle.maintenanceHistory.map((record) => (
                      <Card key={record.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{record.description}</h4>
                                <Badge variant="outline">{record.type}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">المسافة: {record.mileage.toLocaleString()} كم</p>
                              <p className="text-sm text-gray-600">التكلفة: ${record.cost.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">تم بواسطة: {record.performedBy}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{record.date}</p>
                              <p className="text-xs text-gray-500">الصيانة القادمة: {record.nextService}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">المستندات</h3>
                    <Button size="sm">
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة مستند
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedVehicle.documents.map((document, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{document}</h4>
                              <p className="text-sm text-gray-600">مستند رسمي</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="ml-2 h-4 w-4" />
                              تحميل
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Edit className="ml-2 h-4 w-4" />
                  تعديل
                </Button>
                <Button variant="outline" className="flex-1">
                  <Wrench className="ml-2 h-4 w-4" />
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