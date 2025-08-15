"use client"

import { useState } from "react"
import { 
  Percent, 
  Tag, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Star,
  Gift,
  TrendingUp,
  Download,
  Search,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface Discount {
  id: string
  code: string
  name: string
  description: string
  type: 'percentage' | 'fixed' | 'free_shipping'
  value: number
  currency?: string
  minAmount?: number
  maxDiscount?: number
  validFrom: string
  validTo: string
  status: 'active' | 'expired' | 'used' | 'inactive'
  usageLimit: number
  usedCount: number
  category: 'loyalty' | 'seasonal' | 'promotional' | 'referral'
  icon: any
  color: string
}

const mockDiscounts: Discount[] = [
  {
    id: "1",
    code: "WELCOME10",
    name: "خصم الترحيب",
    description: "خصم 10% على أول شحنة",
    type: "percentage",
    value: 10,
    minAmount: 500,
    maxDiscount: 200,
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    status: "active",
    usageLimit: 1,
    usedCount: 0,
    category: "loyalty",
    icon: Gift,
    color: "text-green-600"
  },
  {
    id: "2",
    code: "FREESHIP",
    name: "شحن مجاني",
    description: "شحن مجاني للطلبات فوق 1000 دينار",
    type: "free_shipping",
    value: 0,
    minAmount: 1000,
    validFrom: "2024-01-01",
    validTo: "2024-06-30",
    status: "active",
    usageLimit: 5,
    usedCount: 2,
    category: "promotional",
    icon: Tag,
    color: "text-blue-600"
  },
  {
    id: "3",
    code: "LOYALTY20",
    name: "خصم العميل المخلص",
    description: "خصم 20% للعملاء المخلصين",
    type: "percentage",
    value: 20,
    minAmount: 1000,
    maxDiscount: 500,
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    status: "active",
    usageLimit: 10,
    usedCount: 3,
    category: "loyalty",
    icon: Star,
    color: "text-purple-600"
  },
  {
    id: "4",
    code: "SUMMER50",
    name: "خصم الصيف",
    description: "خصم 50 دينار على الشحنات الصيفية",
    type: "fixed",
    value: 50,
    currency: "دينار ليبي",
    minAmount: 300,
    validFrom: "2024-06-01",
    validTo: "2024-08-31",
    status: "expired",
    usageLimit: 3,
    usedCount: 1,
    category: "seasonal",
    icon: TrendingUp,
    color: "text-orange-600"
  },
  {
    id: "5",
    code: "REFERRAL15",
    name: "خصم الإحالة",
    description: "خصم 15% عند إحالة عميل جديد",
    type: "percentage",
    value: 15,
    minAmount: 200,
    maxDiscount: 300,
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    status: "active",
    usageLimit: 5,
    usedCount: 0,
    category: "referral",
    icon: Gift,
    color: "text-green-600"
  }
]

export default function ClientDiscountsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filteredDiscounts = mockDiscounts.filter(discount => {
    const matchesSearch = discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discount.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || discount.status === statusFilter
    const matchesCategory = categoryFilter === "all" || discount.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getDiscountStats = () => {
    const total = mockDiscounts.length
    const active = mockDiscounts.filter(d => d.status === 'active').length
    const expired = mockDiscounts.filter(d => d.status === 'expired').length
    const used = mockDiscounts.filter(d => d.status === 'used').length
    const totalSavings = mockDiscounts
      .filter(d => d.status === 'used')
      .reduce((sum, discount) => {
        if (discount.type === 'percentage') {
          return sum + (discount.maxDiscount || 0)
        } else if (discount.type === 'fixed') {
          return sum + discount.value
        }
        return sum
      }, 0)

    return { total, active, expired, used, totalSavings }
  }

  const stats = getDiscountStats()

  const getStatusColor = (status: Discount['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'used': return 'bg-gray-100 text-gray-800'
      case 'inactive': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Discount['status']) => {
    switch (status) {
      case 'active': return 'نشط'
      case 'expired': return 'منتهي الصلاحية'
      case 'used': return 'مستخدم'
      case 'inactive': return 'غير نشط'
      default: return 'غير محدد'
    }
  }

  const getCategoryColor = (category: Discount['category']) => {
    switch (category) {
      case 'loyalty': return 'bg-purple-100 text-purple-800'
      case 'seasonal': return 'bg-orange-100 text-orange-800'
      case 'promotional': return 'bg-blue-100 text-blue-800'
      case 'referral': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryText = (category: Discount['category']) => {
    switch (category) {
      case 'loyalty': return 'ولاء'
      case 'seasonal': return 'موسمي'
      case 'promotional': return 'ترويجي'
      case 'referral': return 'إحالة'
      default: return 'غير محدد'
    }
  }

  const getUsagePercentage = (discount: Discount) => {
    return (discount.usedCount / discount.usageLimit) * 100
  }

  const isExpired = (validTo: string) => {
    return new Date(validTo) < new Date()
  }

  const isExpiringSoon = (validTo: string) => {
    const daysUntilExpiry = Math.ceil((new Date(validTo).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الخصومات</h1>
          <p className="text-gray-600">استكشف الخصومات المتاحة واحفظ المال</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="ml-2 h-4 w-4" />
          تصدير الخصومات
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الخصومات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Percent className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">نشط</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">منتهي الصلاحية</p>
                <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مستخدم</p>
                <p className="text-2xl font-bold text-purple-600">{stats.used}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التوفير</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalSavings.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
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
              placeholder="البحث في الخصومات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">جميع الحالات</option>
          <option value="active">نشط</option>
          <option value="expired">منتهي الصلاحية</option>
          <option value="used">مستخدم</option>
          <option value="inactive">غير نشط</option>
        </select>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">جميع الفئات</option>
          <option value="loyalty">ولاء</option>
          <option value="seasonal">موسمي</option>
          <option value="promotional">ترويجي</option>
          <option value="referral">إحالة</option>
        </select>
      </div>

      {/* Discounts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">الخصومات المتاحة</h2>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="active">نشط</TabsTrigger>
            <TabsTrigger value="expired">منتهي الصلاحية</TabsTrigger>
            <TabsTrigger value="used">مستخدم</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDiscounts.map((discount) => (
                <Card key={discount.id} className="relative hover:shadow-lg transition-shadow">
                  {isExpired(discount.validTo) && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500">
                      منتهي الصلاحية
                    </Badge>
                  )}
                  {isExpiringSoon(discount.validTo) && !isExpired(discount.validTo) && (
                    <Badge className="absolute -top-2 -right-2 bg-yellow-500">
                      ينتهي قريباً
                    </Badge>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <discount.icon className={`h-6 w-6 ${discount.color}`} />
                        <div>
                          <CardTitle className="text-lg">{discount.name}</CardTitle>
                          <CardDescription>{discount.code}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{discount.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">نوع الخصم:</span>
                        <Badge className={discount.type === 'percentage' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                          {discount.type === 'percentage' ? `${discount.value}%` : 
                           discount.type === 'fixed' ? `${discount.value} ${discount.currency}` : 'شحن مجاني'}
                        </Badge>
                      </div>
                      
                      {discount.minAmount && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">الحد الأدنى:</span>
                          <span className="text-sm font-medium">{discount.minAmount.toLocaleString()} دينار</span>
                        </div>
                      )}
                      
                      {discount.maxDiscount && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">الحد الأقصى:</span>
                          <span className="text-sm font-medium">{discount.maxDiscount.toLocaleString()} دينار</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">تاريخ الانتهاء:</span>
                        <span className="text-sm font-medium">{discount.validTo}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">الاستخدام:</span>
                          <span className="text-sm font-medium">{discount.usedCount} / {discount.usageLimit}</span>
                        </div>
                        <Progress value={getUsagePercentage(discount)} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(discount.status)}>
                        {getStatusText(discount.status)}
                      </Badge>
                      <Badge className={getCategoryColor(discount.category)}>
                        {getCategoryText(discount.category)}
                      </Badge>
                    </div>
                    
                    {discount.status === 'active' && !isExpired(discount.validTo) && (
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        استخدام الخصم
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDiscounts.filter(d => d.status === 'active' && !isExpired(d.validTo)).map((discount) => (
                <Card key={discount.id} className="relative hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <discount.icon className={`h-6 w-6 ${discount.color}`} />
                        <div>
                          <CardTitle className="text-lg">{discount.name}</CardTitle>
                          <CardDescription>{discount.code}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{discount.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">نوع الخصم:</span>
                        <Badge className={discount.type === 'percentage' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                          {discount.type === 'percentage' ? `${discount.value}%` : 
                           discount.type === 'fixed' ? `${discount.value} ${discount.currency}` : 'شحن مجاني'}
                        </Badge>
                      </div>
                      
                      {discount.minAmount && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">الحد الأدنى:</span>
                          <span className="text-sm font-medium">{discount.minAmount.toLocaleString()} دينار</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">تاريخ الانتهاء:</span>
                        <span className="text-sm font-medium">{discount.validTo}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      استخدام الخصم
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="expired" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDiscounts.filter(d => d.status === 'expired' || isExpired(d.validTo)).map((discount) => (
                <Card key={discount.id} className="relative hover:shadow-lg transition-shadow opacity-75">
                  <Badge className="absolute -top-2 -right-2 bg-red-500">
                    منتهي الصلاحية
                  </Badge>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <discount.icon className={`h-6 w-6 ${discount.color}`} />
                        <div>
                          <CardTitle className="text-lg">{discount.name}</CardTitle>
                          <CardDescription>{discount.code}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{discount.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">نوع الخصم:</span>
                        <Badge className={discount.type === 'percentage' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                          {discount.type === 'percentage' ? `${discount.value}%` : 
                           discount.type === 'fixed' ? `${discount.value} ${discount.currency}` : 'شحن مجاني'}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">تاريخ الانتهاء:</span>
                        <span className="text-sm font-medium">{discount.validTo}</span>
                      </div>
                    </div>
                    
                    <Badge className="w-full justify-center bg-red-100 text-red-800">
                      منتهي الصلاحية
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="used" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDiscounts.filter(d => d.status === 'used' || d.usedCount > 0).map((discount) => (
                <Card key={discount.id} className="relative hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <discount.icon className={`h-6 w-6 ${discount.color}`} />
                        <div>
                          <CardTitle className="text-lg">{discount.name}</CardTitle>
                          <CardDescription>{discount.code}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{discount.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">نوع الخصم:</span>
                        <Badge className={discount.type === 'percentage' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                          {discount.type === 'percentage' ? `${discount.value}%` : 
                           discount.type === 'fixed' ? `${discount.value} ${discount.currency}` : 'شحن مجاني'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">الاستخدام:</span>
                          <span className="text-sm font-medium">{discount.usedCount} / {discount.usageLimit}</span>
                        </div>
                        <Progress value={getUsagePercentage(discount)} className="h-2" />
                      </div>
                    </div>
                    
                    <Badge className="w-full justify-center bg-gray-100 text-gray-800">
                      تم الاستخدام
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 