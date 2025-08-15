"use client"

import { useState } from "react"
import { 
  Briefcase, 
  Package, 
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
  Building,
  Wrench
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Asset {
  id: string
  name: string
  type: 'equipment' | 'vehicle' | 'furniture' | 'electronics' | 'tools' | 'machinery'
  category: string
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
  warrantyExpiry: string
  lastMaintenance: string
  nextMaintenance: string
  description: string
  tags: string[]
  images: string[]
  documents: string[]
}

const mockAssets: Asset[] = [
  {
    id: "1",
    name: "شاحنة نقل كبيرة",
    type: "vehicle",
    category: "مركبات",
    serialNumber: "VH-001",
    model: "Mercedes-Benz Actros",
    brand: "Mercedes-Benz",
    purchaseDate: "2023-01-15",
    purchasePrice: 250000,
    currentValue: 220000,
    location: "مستودع طرابلس الرئيسي",
    assignedTo: "أحمد الشريف",
    status: "in_use",
    condition: "good",
    warrantyExpiry: "2026-01-15",
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-04-10",
    description: "شاحنة نقل كبيرة للمسافات الطويلة، سعة تحميل 20 طن",
    tags: ["نقل", "مسافات طويلة", "شحن"],
    images: ["truck1.jpg", "truck2.jpg"],
    documents: ["manual.pdf", "warranty.pdf"]
  },
  {
    id: "2",
    name: "رافعة شوكية",
    type: "machinery",
    category: "معدات رفع",
    serialNumber: "FL-001",
    model: "Toyota 8FGCU25",
    brand: "Toyota",
    purchaseDate: "2023-03-20",
    purchasePrice: 45000,
    currentValue: 40000,
    location: "مستودع بنغازي",
    assignedTo: "محمد علي",
    status: "in_use",
    condition: "excellent",
    warrantyExpiry: "2025-03-20",
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15",
    description: "رافعة شوكية كهربائية، سعة رفع 2.5 طن",
    tags: ["رفع", "مستودع", "كهربائي"],
    images: ["forklift1.jpg"],
    documents: ["manual.pdf", "maintenance.pdf"]
  },
  {
    id: "3",
    name: "حاسوب محمول",
    type: "electronics",
    category: "أجهزة حاسوب",
    serialNumber: "PC-001",
    model: "ThinkPad X1 Carbon",
    brand: "Lenovo",
    purchaseDate: "2023-06-10",
    purchasePrice: 3500,
    currentValue: 2800,
    location: "مكتب طرابلس",
    assignedTo: "سارة أحمد",
    status: "in_use",
    condition: "excellent",
    warrantyExpiry: "2025-06-10",
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-07-05",
    description: "حاسوب محمول للموظفين، معالج i7، ذاكرة 16GB",
    tags: ["حاسوب", "مكتب", "محمول"],
    images: ["laptop1.jpg"],
    documents: ["warranty.pdf"]
  },
  {
    id: "4",
    name: "طابعة ليزر",
    type: "electronics",
    category: "طابعات",
    serialNumber: "PR-001",
    model: "HP LaserJet Pro",
    brand: "HP",
    purchaseDate: "2023-08-05",
    purchasePrice: 800,
    currentValue: 600,
    location: "مكتب طرابلس",
    assignedTo: "فاطمة حسن",
    status: "maintenance",
    condition: "fair",
    warrantyExpiry: "2025-08-05",
    lastMaintenance: "2024-01-20",
    nextMaintenance: "2024-02-20",
    description: "طابعة ليزر ملونة، سرعة طباعة 25 صفحة/دقيقة",
    tags: ["طابعة", "ليزر", "ملونة"],
    images: ["printer1.jpg"],
    documents: ["manual.pdf"]
  },
  {
    id: "5",
    name: "مكتب خشبي",
    type: "furniture",
    category: "أثاث مكتبي",
    serialNumber: "FR-001",
    model: "Executive Desk",
    brand: "OfficeMax",
    purchaseDate: "2023-09-12",
    purchasePrice: 1200,
    currentValue: 1000,
    location: "مكتب طرابلس",
    assignedTo: "أحمد الشريف",
    status: "in_use",
    condition: "good",
    warrantyExpiry: "2024-09-12",
    lastMaintenance: "2024-01-01",
    nextMaintenance: "2024-07-01",
    description: "مكتب خشبي فاخر للمدير، مع درجين وخزانة",
    tags: ["مكتب", "خشبي", "فاخر"],
    images: ["desk1.jpg"],
    documents: ["warranty.pdf"]
  }
]

const getStatusColor = (status: Asset['status']) => {
  switch (status) {
    case 'available': return 'bg-green-100 text-green-800'
    case 'in_use': return 'bg-blue-100 text-blue-800'
    case 'maintenance': return 'bg-yellow-100 text-yellow-800'
    case 'retired': return 'bg-gray-100 text-gray-800'
    case 'lost': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: Asset['status']) => {
  switch (status) {
    case 'available': return 'متاح'
    case 'in_use': return 'قيد الاستخدام'
    case 'maintenance': return 'صيانة'
    case 'retired': return 'متقاعد'
    case 'lost': return 'مفقود'
    default: return 'غير محدد'
  }
}

const getConditionColor = (condition: Asset['condition']) => {
  switch (condition) {
    case 'excellent': return 'bg-green-100 text-green-800'
    case 'good': return 'bg-blue-100 text-blue-800'
    case 'fair': return 'bg-yellow-100 text-yellow-800'
    case 'poor': return 'bg-orange-100 text-orange-800'
    case 'broken': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getConditionText = (condition: Asset['condition']) => {
  switch (condition) {
    case 'excellent': return 'ممتاز'
    case 'good': return 'جيد'
    case 'fair': return 'مقبول'
    case 'poor': return 'ضعيف'
    case 'broken': return 'معطل'
    default: return 'غير محدد'
  }
}

const getTypeText = (type: Asset['type']) => {
  switch (type) {
    case 'equipment': return 'معدات'
    case 'vehicle': return 'مركبات'
    case 'furniture': return 'أثاث'
    case 'electronics': return 'إلكترونيات'
    case 'tools': return 'أدوات'
    case 'machinery': return 'آلات'
    default: return 'غير محدد'
  }
}

export default function EmployeeAssetsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [conditionFilter, setConditionFilter] = useState<string>("all")
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || asset.status === statusFilter
    const matchesType = typeFilter === "all" || asset.type === typeFilter
    const matchesCondition = conditionFilter === "all" || asset.condition === conditionFilter
    return matchesSearch && matchesStatus && matchesType && matchesCondition
  })

  const getAssetStats = () => {
    const total = mockAssets.length
    const available = mockAssets.filter(a => a.status === 'available').length
    const inUse = mockAssets.filter(a => a.status === 'in_use').length
    const maintenance = mockAssets.filter(a => a.status === 'maintenance').length
    const totalValue = mockAssets.reduce((sum, asset) => sum + asset.currentValue, 0)

    return { total, available, inUse, maintenance, totalValue }
  }

  const stats = getAssetStats()

  const getDepreciationPercentage = (asset: Asset) => {
    return ((asset.purchasePrice - asset.currentValue) / asset.purchasePrice) * 100
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الأصول</h1>
          <p className="text-gray-600">إدارة أصول الشركة والمعدات والممتلكات</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="ml-2 h-4 w-4" />
          إضافة أصل جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الأصول</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
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
              placeholder="البحث في الأصول..."
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="ml-2 h-4 w-4" />
              النوع
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTypeFilter("all")}>الكل</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("equipment")}>معدات</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("vehicle")}>مركبات</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("furniture")}>أثاث</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("electronics")}>إلكترونيات</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("tools")}>أدوات</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("machinery")}>آلات</DropdownMenuItem>
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

      {/* Assets Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedAsset(asset)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{asset.name}</CardTitle>
                  <CardDescription>{asset.brand} {asset.model}</CardDescription>
                </div>
                <Badge className={getStatusColor(asset.status)}>
                  {getStatusText(asset.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag className="h-4 w-4" />
                {asset.serialNumber}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {asset.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                {asset.assignedTo}
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline">{getTypeText(asset.type)}</Badge>
                <Badge className={getConditionColor(asset.condition)}>
                  {getConditionText(asset.condition)}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>القيمة الحالية:</span>
                  <span className="font-medium">${asset.currentValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>سعر الشراء:</span>
                  <span className="font-medium">${asset.purchasePrice.toLocaleString()}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>الاستهلاك</span>
                    <span>{getDepreciationPercentage(asset).toFixed(1)}%</span>
                  </div>
                  <Progress value={getDepreciationPercentage(asset)} className="h-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Asset Details Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedAsset.name}</CardTitle>
                  <CardDescription>{selectedAsset.brand} {selectedAsset.model}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedAsset(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">الرقم التسلسلي</label>
                  <p className="text-sm text-gray-600">{selectedAsset.serialNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">النوع</label>
                  <p className="text-sm text-gray-600">{getTypeText(selectedAsset.type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">الفئة</label>
                  <p className="text-sm text-gray-600">{selectedAsset.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">الموقع</label>
                  <p className="text-sm text-gray-600">{selectedAsset.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">المسؤول</label>
                  <p className="text-sm text-gray-600">{selectedAsset.assignedTo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">الحالة</label>
                  <Badge className={getStatusColor(selectedAsset.status)}>
                    {getStatusText(selectedAsset.status)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">الحالة الفنية</label>
                  <Badge className={getConditionColor(selectedAsset.condition)}>
                    {getConditionText(selectedAsset.condition)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">تاريخ الشراء</label>
                  <p className="text-sm text-gray-600">{selectedAsset.purchaseDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">سعر الشراء</label>
                  <p className="text-sm text-gray-600">${selectedAsset.purchasePrice.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">القيمة الحالية</label>
                  <p className="text-sm text-gray-600">${selectedAsset.currentValue.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">انتهاء الضمان</label>
                  <p className="text-sm text-gray-600">{selectedAsset.warrantyExpiry}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">آخر صيانة</label>
                  <p className="text-sm text-gray-600">{selectedAsset.lastMaintenance}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">الصيانة القادمة</label>
                  <p className="text-sm text-gray-600">{selectedAsset.nextMaintenance}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">الوصف</label>
                <p className="text-sm text-gray-600 mt-1">{selectedAsset.description}</p>
              </div>
              <div className="flex gap-2">
                {selectedAsset.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              {selectedAsset.documents.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">المستندات</label>
                  <div className="flex gap-2 mt-2">
                    {selectedAsset.documents.map((document, index) => (
                      <Button key={index} variant="outline" size="sm">
                        <Download className="ml-2 h-4 w-4" />
                        {document}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
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