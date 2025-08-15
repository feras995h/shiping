"use client"

import { useState } from "react"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  Filter,
  Search,
  Calendar,
  Receipt,
  CreditCard,
  Banknote,
  Wallet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Settlement {
  id: string
  date: string
  type: 'payment' | 'refund' | 'adjustment' | 'credit'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  description: string
  reference: string
  method: string
  icon: any
}

const mockSettlements: Settlement[] = [
  {
    id: "1",
    date: "2024-01-15",
    type: "payment",
    amount: 2500,
    currency: "دينار ليبي",
    status: "completed",
    description: "دفع فاتورة الشحنة GH-2024-001",
    reference: "INV-2024-001",
    method: "بطاقة فيزا",
    icon: CreditCard
  },
  {
    id: "2",
    date: "2024-01-10",
    type: "refund",
    amount: -500,
    currency: "دينار ليبي",
    status: "completed",
    description: "استرداد رسوم التأمين الإضافية",
    reference: "REF-2024-001",
    method: "نقدي",
    icon: Banknote
  },
  {
    id: "3",
    date: "2024-01-08",
    type: "adjustment",
    amount: -150,
    currency: "دينار ليبي",
    status: "completed",
    description: "خصم خصم العميل المخلص",
    reference: "ADJ-2024-001",
    method: "تعديل تلقائي",
    icon: DollarSign
  },
  {
    id: "4",
    date: "2024-01-05",
    type: "credit",
    amount: 300,
    currency: "دينار ليبي",
    status: "pending",
    description: "رصيد إضافي لحساب العميل",
    reference: "CRD-2024-001",
    method: "شيك",
    icon: Wallet
  },
  {
    id: "5",
    date: "2024-01-03",
    type: "payment",
    amount: 1800,
    currency: "دينار ليبي",
    status: "completed",
    description: "دفع فاتورة الشحنة GH-2024-002",
    reference: "INV-2024-002",
    method: "نقدي",
    icon: CreditCard
  }
]

export default function ClientSettlementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredSettlements = mockSettlements.filter(settlement => {
    const matchesSearch = settlement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         settlement.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || settlement.status === statusFilter
    const matchesType = typeFilter === "all" || settlement.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getSettlementStats = () => {
    const total = mockSettlements.length
    const completed = mockSettlements.filter(s => s.status === 'completed').length
    const pending = mockSettlements.filter(s => s.status === 'pending').length
    const totalAmount = mockSettlements.reduce((sum, settlement) => sum + settlement.amount, 0)
    const positiveAmount = mockSettlements
      .filter(s => s.amount > 0)
      .reduce((sum, settlement) => sum + settlement.amount, 0)
    const negativeAmount = mockSettlements
      .filter(s => s.amount < 0)
      .reduce((sum, settlement) => sum + Math.abs(settlement.amount), 0)

    return { total, completed, pending, totalAmount, positiveAmount, negativeAmount }
  }

  const stats = getSettlementStats()

  const getStatusColor = (status: Settlement['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Settlement['status']) => {
    switch (status) {
      case 'completed': return 'مكتمل'
      case 'pending': return 'قيد الانتظار'
      case 'failed': return 'فشل'
      case 'cancelled': return 'ملغي'
      default: return 'غير محدد'
    }
  }

  const getTypeColor = (type: Settlement['type']) => {
    switch (type) {
      case 'payment': return 'bg-blue-100 text-blue-800'
      case 'refund': return 'bg-green-100 text-green-800'
      case 'adjustment': return 'bg-purple-100 text-purple-800'
      case 'credit': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: Settlement['type']) => {
    switch (type) {
      case 'payment': return 'دفع'
      case 'refund': return 'استرداد'
      case 'adjustment': return 'تعديل'
      case 'credit': return 'رصيد'
      default: return 'غير محدد'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">التسويات</h1>
          <p className="text-gray-600">متابعة المعاملات المالية والتسويات</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="ml-2 h-4 w-4" />
          تصدير التقرير
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المعاملات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مكتملة</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">قيد الانتظار</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المدفوع</p>
                <p className="text-2xl font-bold text-blue-600">{stats.positiveAmount.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المسترد</p>
                <p className="text-2xl font-bold text-green-600">{stats.negativeAmount.toLocaleString()}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الرصيد الصافي</p>
                <p className={`text-2xl font-bold ${stats.totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.totalAmount.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
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
              placeholder="البحث في المعاملات..."
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
          <option value="completed">مكتمل</option>
          <option value="pending">قيد الانتظار</option>
          <option value="failed">فشل</option>
          <option value="cancelled">ملغي</option>
        </select>
        <select 
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">جميع الأنواع</option>
          <option value="payment">دفع</option>
          <option value="refund">استرداد</option>
          <option value="adjustment">تعديل</option>
          <option value="credit">رصيد</option>
        </select>
      </div>

      {/* Settlements List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">المعاملات</h2>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="payments">المدفوعات</TabsTrigger>
            <TabsTrigger value="refunds">الاستردادات</TabsTrigger>
            <TabsTrigger value="adjustments">التعديلات</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-4">
              {filteredSettlements.map((settlement) => (
                <Card key={settlement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${settlement.amount >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                          <settlement.icon className={`h-6 w-6 ${settlement.amount >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{settlement.description}</h3>
                          <p className="text-sm text-gray-600">المرجع: {settlement.reference}</p>
                          <p className="text-sm text-gray-600">الطريقة: {settlement.method}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${settlement.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {settlement.amount >= 0 ? '+' : ''}{settlement.amount.toLocaleString()} {settlement.currency}
                        </p>
                        <p className="text-sm text-gray-600">{settlement.date}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getTypeColor(settlement.type)}>
                            {getTypeText(settlement.type)}
                          </Badge>
                          <Badge className={getStatusColor(settlement.status)}>
                            {getStatusText(settlement.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <div className="space-y-4">
              {filteredSettlements.filter(s => s.type === 'payment').map((settlement) => (
                <Card key={settlement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-green-100">
                          <settlement.icon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{settlement.description}</h3>
                          <p className="text-sm text-gray-600">المرجع: {settlement.reference}</p>
                          <p className="text-sm text-gray-600">الطريقة: {settlement.method}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          +{settlement.amount.toLocaleString()} {settlement.currency}
                        </p>
                        <p className="text-sm text-gray-600">{settlement.date}</p>
                        <Badge className={getStatusColor(settlement.status)}>
                          {getStatusText(settlement.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="refunds" className="space-y-4">
            <div className="space-y-4">
              {filteredSettlements.filter(s => s.type === 'refund').map((settlement) => (
                <Card key={settlement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-red-100">
                          <settlement.icon className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{settlement.description}</h3>
                          <p className="text-sm text-gray-600">المرجع: {settlement.reference}</p>
                          <p className="text-sm text-gray-600">الطريقة: {settlement.method}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-red-600">
                          {settlement.amount.toLocaleString()} {settlement.currency}
                        </p>
                        <p className="text-sm text-gray-600">{settlement.date}</p>
                        <Badge className={getStatusColor(settlement.status)}>
                          {getStatusText(settlement.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="adjustments" className="space-y-4">
            <div className="space-y-4">
              {filteredSettlements.filter(s => s.type === 'adjustment' || s.type === 'credit').map((settlement) => (
                <Card key={settlement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${settlement.amount >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                          <settlement.icon className={`h-6 w-6 ${settlement.amount >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{settlement.description}</h3>
                          <p className="text-sm text-gray-600">المرجع: {settlement.reference}</p>
                          <p className="text-sm text-gray-600">الطريقة: {settlement.method}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${settlement.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {settlement.amount >= 0 ? '+' : ''}{settlement.amount.toLocaleString()} {settlement.currency}
                        </p>
                        <p className="text-sm text-gray-600">{settlement.date}</p>
                        <Badge className={getStatusColor(settlement.status)}>
                          {getStatusText(settlement.status)}
                        </Badge>
                      </div>
                    </div>
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