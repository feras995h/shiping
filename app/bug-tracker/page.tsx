"use client"

import { useState } from "react"
import { Bug, AlertTriangle, CheckCircle, Clock, Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Layout from "@/components/layout"

interface BugReport {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  category: 'ui' | 'functionality' | 'performance' | 'security' | 'data'
  reportedBy: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  stepsToReproduce: string[]
  expectedBehavior: string
  actualBehavior: string
  environment: string
}

interface NewBug {
  title: string
  description: string
  severity: BugReport['severity']
  status: BugReport['status']
  category: BugReport['category']
  stepsToReproduce?: string
  expectedBehavior?: string
  actualBehavior?: string
  environment?: string
}

export default function BugTrackerPage() {
  const [bugs, setBugs] = useState<BugReport[]>([
    {
      id: "BUG-001",
      title: "تحسين أداء تحميل الصفحات",
      description: "بعض الصفحات تستغرق وقتاً أطول من المتوقع في التحميل",
      severity: "medium",
      status: "resolved",
      category: "performance",
      reportedBy: "أحمد محمد",
      assignedTo: "فريق التطوير",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      stepsToReproduce: [
        "فتح الصفحة الرئيسية",
        "الانتقال إلى صفحة الشحنات",
        "ملاحظة وقت التحميل"
      ],
      expectedBehavior: "تحميل الصفحة خلال ثانيتين",
      actualBehavior: "تحميل الصفحة يستغرق 5-7 ثوان",
      environment: "Chrome 120, Windows 11"
    },
    {
      id: "BUG-002", 
      title: "تحسين التوافق مع الشاشات الصغيرة",
      description: "بعض العناصر لا تظهر بشكل صحيح على الهواتف المحمولة",
      severity: "high",
      status: "resolved",
      category: "ui",
      reportedBy: "سارة أحمد",
      assignedTo: "فريق التصميم",
      createdAt: "2024-01-18",
      updatedAt: "2024-01-22",
      stepsToReproduce: [
        "فتح الموقع على هاتف محمول",
        "الانتقال إلى صفحة لوحة التحكم",
        "ملاحظة تداخل العناصر"
      ],
      expectedBehavior: "عرض العناصر بشكل منظم ومتجاوب",
      actualBehavior: "تداخل في العناصر وصعوبة في القراءة",
      environment: "Safari Mobile, iPhone 13"
    },
    {
      id: "BUG-003",
      title: "تحسين نظام الإشعارات",
      description: "الإشعارات أحياناً لا تظهر في الوقت المناسب",
      severity: "low",
      status: "resolved", 
      category: "functionality",
      reportedBy: "فاطمة علي",
      assignedTo: "فريق Backend",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-25",
      stepsToReproduce: [
        "إنشاء شحنة جديدة",
        "انتظار الإشعار",
        "ملاحظة التأخير"
      ],
      expectedBehavior: "ظهور الإشعار فوراً",
      actualBehavior: "تأخير في ظهور الإشعار لعدة دقائق",
      environment: "Firefox 121, Ubuntu 22.04"
    }
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newBug, setNewBug] = useState<NewBug>({
    title: "",
    description: "",
    severity: "medium",
    status: "open",
    category: "functionality"
  })

  const handleCreateBug = () => {
    if (!newBug.title || !newBug.description) return

    const bug: BugReport = {
      id: `BUG-${Date.now()}`,
      title: newBug.title,
      description: newBug.description,
      severity: newBug.severity,
      status: newBug.status,
      category: newBug.category as BugReport['category'],
      reportedBy: "المستخدم الحالي",
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      stepsToReproduce: newBug.stepsToReproduce?.split('\n').filter(step => step.trim()) || [],
      expectedBehavior: newBug.expectedBehavior || "",
      actualBehavior: newBug.actualBehavior || "",
      environment: newBug.environment || "غير محدد"
    }

    setBugs([bug, ...bugs])
    setNewBug({ 
      title: "",
      description: "",
      severity: "medium", 
      status: "open", 
      category: "functionality" 
    })
    setIsCreateDialogOpen(false)
  }

  const updateBugStatus = (bugId: string, newStatus: BugReport['status']) => {
    setBugs(bugs.map(bug => 
      bug.id === bugId 
        ? { ...bug, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : bug
    ))
  }

  const filteredBugs = bugs.filter(bug => {
    const matchesSearch = bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bug.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || bug.status === statusFilter
    const matchesSeverity = severityFilter === "all" || bug.severity === severityFilter
    
    return matchesSearch && matchesStatus && matchesSeverity
  })

  const getSeverityColor = (severity: BugReport['severity']) => {
    switch (severity) {
      case 'critical': return 'badge-red'
      case 'high': return 'badge-orange'
      case 'medium': return 'badge-yellow'
      case 'low': return 'badge-blue'
      default: return 'badge-slate'
    }
  }

  const getStatusColor = (status: BugReport['status']) => {
    switch (status) {
      case 'open': return 'badge-red'
      case 'in_progress': return 'badge-blue'
      case 'resolved': return 'badge-green'
      case 'closed': return 'badge-slate'
      default: return 'badge-slate'
    }
  }

  const getCategoryIcon = (category: BugReport['category']) => {
    switch (category) {
      case 'ui': return '🎨'
      case 'functionality': return '⚙️'
      case 'performance': return '⚡'
      case 'security': return '🔒'
      case 'data': return '📊'
      default: return '🐛'
    }
  }

  const stats = {
    total: bugs.length,
    open: bugs.filter(b => b.status === 'open').length,
    inProgress: bugs.filter(b => b.status === 'in_progress').length,
    resolved: bugs.filter(b => b.status === 'resolved').length,
    critical: bugs.filter(b => b.severity === 'critical').length
  }

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Bug className="h-6 w-6 sm:h-8 sm:w-8 text-gold-500" />
              <h1 className="text-2xl sm:text-4xl font-bold gold-text">تتبع الأخطاء والمشاكل</h1>
            </div>
            <p className="text-base sm:text-lg text-slate-600">إدارة وتتبع الأخطاء والمشاكل في النظام</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gold">
                <Plus className="h-4 w-4 ml-2" />
                إبلاغ عن مشكلة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إبلاغ عن مشكلة جديدة</DialogTitle>
                <DialogDescription>
                  قم بوصف المشكلة بالتفصيل لمساعدتنا في حلها
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">عنوان المشكلة</label>
                  <Input
                    value={newBug.title || ""}
                    onChange={(e) => setNewBug({...newBug, title: e.target.value})}
                    placeholder="وصف مختصر للمشكلة"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">وصف المشكلة</label>
                  <Textarea
                    value={newBug.description || ""}
                    onChange={(e) => setNewBug({...newBug, description: e.target.value})}
                    placeholder="وصف تفصيلي للمشكلة"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">مستوى الخطورة</label>
                    <Select value={newBug.severity} onValueChange={(value) => setNewBug({...newBug, severity: value as BugReport['severity']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">منخفض</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="high">عالي</SelectItem>
                        <SelectItem value="critical">حرج</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">الفئة</label>
                    <Select value={newBug.category} onValueChange={(value) => setNewBug({...newBug, category: value as BugReport['category']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ui">واجهة المستخدم</SelectItem>
                        <SelectItem value="functionality">الوظائف</SelectItem>
                        <SelectItem value="performance">الأداء</SelectItem>
                        <SelectItem value="security">الأمان</SelectItem>
                        <SelectItem value="data">البيانات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">خطوات إعادة إنتاج المشكلة</label>
                  <Textarea
                    value={newBug.stepsToReproduce || ""}
                    onChange={(e) => setNewBug({...newBug, stepsToReproduce: e.target.value})}
                    placeholder="1. افتح الصفحة الرئيسية&#10;2. اضغط على زر الشحنات&#10;3. لاحظ المشكلة"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">السلوك المتوقع</label>
                    <Textarea
                      value={newBug.expectedBehavior || ""}
                      onChange={(e) => setNewBug({...newBug, expectedBehavior: e.target.value})}
                      placeholder="ما الذي كان يجب أن يحدث؟"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">السلوك الفعلي</label>
                    <Textarea
                      value={newBug.actualBehavior || ""}
                      onChange={(e) => setNewBug({...newBug, actualBehavior: e.target.value})}
                      placeholder="ما الذي حدث فعلاً؟"
                      rows={2}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">بيئة التشغيل</label>
                  <Input
                    value={newBug.environment || ""}
                    onChange={(e) => setNewBug({...newBug, environment: e.target.value})}
                    placeholder="مثال: Chrome 120, Windows 11"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button className="btn-gold" onClick={handleCreateBug}>
                    إرسال التقرير
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Bug className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                  <p className="text-sm text-slate-600">إجمالي المشاكل</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.open}</p>
                  <p className="text-sm text-slate-600">مفتوحة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                  <p className="text-sm text-slate-600">قيد المعالجة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                  <p className="text-sm text-slate-600">محلولة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                  <p className="text-sm text-slate-600">حرجة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="card-premium">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="البحث في المشاكل..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="فلترة حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="open">مفتوحة</SelectItem>
                  <SelectItem value="in_progress">قيد المعالجة</SelectItem>
                  <SelectItem value="resolved">محلولة</SelectItem>
                  <SelectItem value="closed">مغلقة</SelectItem>
                </SelectContent>
              </Select>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="فلترة حسب الخطورة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المستويات</SelectItem>
                  <SelectItem value="critical">حرج</SelectItem>
                  <SelectItem value="high">عالي</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="low">منخفض</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bug List */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle>قائمة المشاكل</CardTitle>
            <CardDescription>
              عرض {filteredBugs.length} من أصل {bugs.length} مشكلة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المعرف</TableHead>
                    <TableHead>العنوان</TableHead>
                    <TableHead>الفئة</TableHead>
                    <TableHead>الخطورة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ الإنشاء</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBugs.map((bug) => (
                    <TableRow key={bug.id}>
                      <TableCell className="font-medium">{bug.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{bug.title}</p>
                          <p className="text-sm text-slate-500 truncate max-w-xs">
                            {bug.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{getCategoryIcon(bug.category)}</span>
                          <span className="text-sm">
                            {bug.category === 'ui' ? 'واجهة المستخدم' :
                             bug.category === 'functionality' ? 'الوظائف' :
                             bug.category === 'performance' ? 'الأداء' :
                             bug.category === 'security' ? 'الأمان' : 'البيانات'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(bug.severity)}>
                          {bug.severity === 'critical' ? 'حرج' :
                           bug.severity === 'high' ? 'عالي' :
                           bug.severity === 'medium' ? 'متوسط' : 'منخفض'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={bug.status}
                          onValueChange={(value) => updateBugStatus(bug.id, value as BugReport['status'])}
                        >
                          <SelectTrigger className="w-32">
                            <Badge className={getStatusColor(bug.status)}>
                              {bug.status === 'open' ? 'مفتوحة' :
                               bug.status === 'in_progress' ? 'قيد المعالجة' :
                               bug.status === 'resolved' ? 'محلولة' : 'مغلقة'}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">مفتوحة</SelectItem>
                            <SelectItem value="in_progress">قيد المعالجة</SelectItem>
                            <SelectItem value="resolved">محلولة</SelectItem>
                            <SelectItem value="closed">مغلقة</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{bug.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gold-50">
                            <Edit className="h-4 w-4 text-gold-600" />
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
      </div>
    </Layout>
  )
}
