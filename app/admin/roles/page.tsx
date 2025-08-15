'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Shield, Search, Filter, Plus, Edit, Trash2, Eye, Users } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  isDefault: boolean
  createdAt: string
}

interface Permission {
  id: string
  name: string
  category: string
  description: string
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // جلب الأدوار والصلاحيات
  const fetchRolesAndPermissions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)

      const response = await fetch(`/api/admin/roles?${params}`)
      const result = await response.json()

      if (result.success) {
        setRoles(result.data.roles)
        setPermissions(result.data.permissions)
        setCategories(result.data.categories)
      } else {
        toast({
          title: "خطأ",
          description: result.message || "فشل في جلب الأدوار والصلاحيات",
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

  // حذف دور
  const deleteRole = async (roleId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدور؟')) return

    try {
      const response = await fetch(`/api/admin/roles?id=${roleId}`, {
        method: 'DELETE'
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: "نجح",
          description: "تم حذف الدور بنجاح"
        })
        fetchRolesAndPermissions()
      } else {
        toast({
          title: "خطأ",
          description: result.message || "فشل في حذف الدور",
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
    fetchRolesAndPermissions()
  }, [searchQuery, selectedCategory])

  const getPermissionCategoryColor = (category: string) => {
    switch (category) {
      case 'النظام': return 'bg-red-100 text-red-800'
      case 'المالية': return 'bg-gold-100 text-gold-800'
      case 'الشحن': return 'bg-blue-100 text-blue-800'
      case 'التقارير': return 'bg-green-100 text-green-800'
      case 'العملاء': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
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
            <h1 className="text-2xl font-bold">إدارة الأدوار والصلاحيات</h1>
            <p className="text-sm text-muted-foreground">
              إدارة الأدوار والصلاحيات في النظام
            </p>
          </div>
        </div>
        
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة الأدوار والصلاحيات</h1>
          <p className="text-sm text-muted-foreground">
            إدارة الأدوار والصلاحيات في النظام
          </p>
        </div>
        <Button className="btn-gold">
          <Plus className="h-4 w-4 ml-2" />
          إضافة دور جديد
        </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="البحث في الأدوار والصلاحيات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="جميع الفئات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* الأدوار */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            الأدوار ({roles.length})
          </CardTitle>
          <CardDescription>
            إدارة الأدوار والصلاحيات المخصصة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الدور</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>عدد المستخدمين</TableHead>
                <TableHead>نوع الدور</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="font-medium">{role.name}</div>
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      {role.userCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.isDefault ? "default" : "secondary"}>
                      {role.isDefault ? "افتراضي" : "مخصص"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(role.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!role.isDefault && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteRole(role.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* الصلاحيات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            الصلاحيات ({permissions.length})
          </CardTitle>
          <CardDescription>
            إدارة الصلاحيات المتاحة في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الصلاحية</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الوصف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>
                    <div className="font-medium">{permission.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPermissionCategoryColor(permission.category)}>
                      {permission.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{permission.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 