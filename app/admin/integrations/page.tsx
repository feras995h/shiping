'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Link, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  TestTube, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Globe,
  Database,
  CreditCard,
  Cloud
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Integration {
  id: string
  name: string
  type: string
  status: string
  description: string
  endpoint: string
  lastSync: string
  syncInterval: string
  config: Record<string, any>
}

interface IntegrationsData {
  integrations: Integration[]
  total: number
  active: number
  error: number
}

export default function AdminIntegrationsPage() {
  const [data, setData] = useState<IntegrationsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // جلب التكاملات
  const fetchIntegrations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedType !== 'all') params.append('type', selectedType)
      if (selectedStatus !== 'all') params.append('status', selectedStatus)

      const response = await fetch(`/api/admin/integrations?${params}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        toast({
          title: "خطأ",
          description: result.message || "فشل في جلب التكاملات",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // اختبار التكامل
  const testIntegration = async (integrationId: string) => {
    try {
      const response = await fetch('/api/admin/integrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: integrationId, action: 'test' })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "نجح",
          description: result.data.success ? "تم اختبار التكامل بنجاح" : "فشل اختبار التكامل"
        })
        fetchIntegrations() // تحديث البيانات
      } else {
        toast({
          title: "خطأ",
          description: result.message || "فشل في اختبار التكامل",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive"
      })
    }
  }

  // حذف التكامل
  const deleteIntegration = async (integrationId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التكامل؟')) return

    try {
      const response = await fetch(`/api/admin/integrations?id=${integrationId}`, {
        method: 'DELETE'
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: "نجح",
          description: "تم حذف التكامل بنجاح"
        })
        fetchIntegrations()
      } else {
        toast({
          title: "خطأ",
          description: result.message || "فشل في حذف التكامل",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive"
      })
    }
  }

  // تحديث البحث والفلترة
  useEffect(() => {
    fetchIntegrations()
  }, [selectedType, selectedStatus])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'customs': return 'bg-green-100 text-green-800'
      case 'shipping': return 'bg-purple-100 text-purple-800'
      case 'banking': return 'bg-blue-100 text-blue-800'
      case 'storage': return 'bg-orange-100 text-orange-800'
      case 'api': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'testing': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'inactive': return <XCircle className="h-4 w-4" />
      case 'error': return <AlertTriangle className="h-4 w-4" />
      case 'testing': return <TestTube className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'customs': return <Database className="h-4 w-4" />
      case 'shipping': return <Globe className="h-4 w-4" />
      case 'banking': return <CreditCard className="h-4 w-4" />
      case 'storage': return <Cloud className="h-4 w-4" />
      case 'api': return <Link className="h-4 w-4" />
      default: return <Link className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-LY')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">إدارة التكاملات</h1>
            <p className="text-sm text-muted-foreground">
              إدارة التكاملات مع البنوك والجمارك والخدمات الخارجية
            </p>
          </div>
        </div>
        
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">جاري تحميل التكاملات...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">إدارة التكاملات</h1>
            <p className="text-sm text-muted-foreground">
              إدارة التكاملات مع البنوك والجمارك والخدمات الخارجية
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="text-center py-20">
            <p className="text-lg text-gray-600 mb-4">فشل في تحميل التكاملات</p>
            <Button onClick={fetchIntegrations}>إعادة المحاولة</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة التكاملات</h1>
          <p className="text-sm text-muted-foreground">
            إدارة التكاملات مع البنوك والجمارك والخدمات الخارجية
          </p>
        </div>
        <Button className="btn-gold">
          <Plus className="h-4 w-4 ml-2" />
          إضافة تكامل جديد
        </Button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التكاملات</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التكاملات النشطة</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التكاملات المعطلة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.error}</div>
          </CardContent>
        </Card>
      </div>

      {/* أدوات البحث والفلترة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="البحث في التكاملات..."
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="جميع الأنواع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="customs">الجمارك</SelectItem>
                <SelectItem value="shipping">الشحن</SelectItem>
                <SelectItem value="banking">البنوك</SelectItem>
                <SelectItem value="storage">التخزين</SelectItem>
                <SelectItem value="api">APIs</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="جميع الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="error">خطأ</SelectItem>
                <SelectItem value="testing">قيد الاختبار</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* جدول التكاملات */}
      <Card>
        <CardHeader>
          <CardTitle>التكاملات ({data.total})</CardTitle>
          <CardDescription>
            قائمة جميع التكاملات في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التكامل</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>آخر مزامنة</TableHead>
                <TableHead>الفاصل الزمني</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.integrations.map((integration) => (
                <TableRow key={integration.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{integration.name}</div>
                      <div className="text-sm text-muted-foreground">{integration.description}</div>
                      <div className="text-xs text-muted-foreground">{integration.endpoint}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(integration.type)}>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(integration.type)}
                        {integration.type === 'customs' && 'الجمارك'}
                        {integration.type === 'shipping' && 'الشحن'}
                        {integration.type === 'banking' && 'البنوك'}
                        {integration.type === 'storage' && 'التخزين'}
                        {integration.type === 'api' && 'APIs'}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(integration.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(integration.status)}
                        {integration.status === 'active' && 'نشط'}
                        {integration.status === 'inactive' && 'غير نشط'}
                        {integration.status === 'error' && 'خطأ'}
                        {integration.status === 'testing' && 'قيد الاختبار'}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {integration.lastSync ? formatDate(integration.lastSync) : 'لم تتم المزامنة'}
                  </TableCell>
                  <TableCell>{integration.syncInterval}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => testIntegration(integration.id)}
                        title="اختبار التكامل"
                      >
                        <TestTube className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteIntegration(integration.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 