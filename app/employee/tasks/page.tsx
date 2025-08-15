"use client"

import { useState, useEffect } from "react"
import {
  ClipboardList, Calendar, Clock, User, CheckCircle, AlertCircle, 
  Filter, Search, Plus, Edit, Trash2, Eye, Star, Tag, CalendarDays
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee: string
  assignedBy: string
  dueDate: string
  createdAt: string
  completedAt?: string
  category: string
  progress: number
  tags: string[]
  estimatedHours: number
  actualHours?: number
  attachments: string[]
  comments: Comment[]
}

interface Comment {
  id: string
  user: string
  content: string
  timestamp: string
}

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // محاكاة جلب البيانات من API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // محاكاة طلب API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockTasks: Task[] = [
          {
            id: "TASK-001",
            title: "مراجعة مستندات الشحنة GH-2025-010",
            description: "مراجعة شاملة لجميع المستندات المطلوبة للتخليص الجمركي",
            status: "in_progress",
            priority: "high",
            assignee: "أحمد محمد",
            assignedBy: "مدير العمليات",
            dueDate: "2024-01-20T17:00:00Z",
            createdAt: "2024-01-15T09:00:00Z",
            category: "مستندات",
            progress: 65,
            tags: ["جمركي", "مستندات", "عاجل"],
            estimatedHours: 4,
            actualHours: 2.5,
            attachments: ["invoice.pdf", "packing_list.pdf"],
            comments: [
              {
                id: "C1",
                user: "مدير العمليات",
                content: "يرجى إكمال المراجعة قبل نهاية اليوم",
                timestamp: "2024-01-15T10:30:00Z"
              }
            ]
          },
          {
            id: "TASK-002",
            title: "تنسيق مع وكيل الشحن في شنغهاي",
            description: "التواصل مع الوكيل لتأكيد مواعيد الشحن والكميات",
            status: "pending",
            priority: "medium",
            assignee: "أحمد محمد",
            assignedBy: "مدير الشحن",
            dueDate: "2024-01-18T17:00:00Z",
            createdAt: "2024-01-15T08:00:00Z",
            category: "تنسيق",
            progress: 0,
            tags: ["وكيل", "شنغهاي", "تنسيق"],
            estimatedHours: 2,
            attachments: [],
            comments: []
          },
          {
            id: "TASK-003",
            title: "إعداد تقرير الأداء الأسبوعي",
            description: "إعداد تقرير شامل عن أداء الشحنات والأهداف المحققة",
            status: "completed",
            priority: "medium",
            assignee: "أحمد محمد",
            assignedBy: "المدير العام",
            dueDate: "2024-01-14T17:00:00Z",
            createdAt: "2024-01-10T09:00:00Z",
            completedAt: "2024-01-14T16:30:00Z",
            category: "تقارير",
            progress: 100,
            tags: ["تقرير", "أداء", "أسبوعي"],
            estimatedHours: 3,
            actualHours: 2.8,
            attachments: ["weekly_report.pdf"],
            comments: [
              {
                id: "C2",
                user: "المدير العام",
                content: "تقرير ممتاز، شكراً لك",
                timestamp: "2024-01-14T17:15:00Z"
              }
            ]
          },
          {
            id: "TASK-004",
            title: "متابعة شحنة الحاويات من قوانغتشو",
            description: "متابعة حالة الشحنة وتحديث العميل بالتقدم",
            status: "overdue",
            priority: "urgent",
            assignee: "أحمد محمد",
            assignedBy: "مدير العملاء",
            dueDate: "2024-01-13T17:00:00Z",
            createdAt: "2024-01-12T14:00:00Z",
            category: "متابعة",
            progress: 40,
            tags: ["قوانغتشو", "حاويات", "عاجل"],
            estimatedHours: 1.5,
            actualHours: 1,
            attachments: ["tracking_info.pdf"],
            comments: [
              {
                id: "C3",
                user: "مدير العملاء",
                content: "العميل ينتظر تحديث عاجل",
                timestamp: "2024-01-15T11:00:00Z"
              }
            ]
          },
          {
            id: "TASK-005",
            title: "تدريب الموظف الجديد على النظام",
            description: "تدريب الموظف الجديد على استخدام نظام إدارة الشحن",
            status: "pending",
            priority: "low",
            assignee: "أحمد محمد",
            assignedBy: "مدير الموارد البشرية",
            dueDate: "2024-01-25T17:00:00Z",
            createdAt: "2024-01-15T07:00:00Z",
            category: "تدريب",
            progress: 0,
            tags: ["تدريب", "موظف جديد", "نظام"],
            estimatedHours: 6,
            attachments: ["training_manual.pdf"],
            comments: []
          }
        ]
        
        setTasks(mockTasks)
        setFilteredTasks(mockTasks)
      } catch (error) {
        console.error("خطأ في جلب المهام:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // تصفية المهام
  useEffect(() => {
    let filtered = tasks

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(task => task.category === categoryFilter)
    }

    setFilteredTasks(filtered)
  }, [tasks, searchTerm, statusFilter, priorityFilter, categoryFilter])

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'مكتمل'
      case 'in_progress': return 'قيد التنفيذ'
      case 'pending': return 'في الانتظار'
      case 'overdue': return 'متأخر'
      default: return 'غير محدد'
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'عاجل'
      case 'high': return 'عالية'
      case 'medium': return 'متوسطة'
      case 'low': return 'منخفضة'
      default: return 'غير محدد'
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      // محاكاة تحديث API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setTasks(prev => prev.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus, completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined }
          : task
      ))
    } catch (error) {
      console.error("خطأ في تحديث حالة المهمة:", error)
    }
  }

  const handleProgressUpdate = async (taskId: string, progress: number) => {
    try {
      // محاكاة تحديث API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, progress } : task
      ))
    } catch (error) {
      console.error("خطأ في تحديث التقدم:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-950 dark:to-amber-900/10" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري تحميل المهام...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-950 dark:to-amber-900/10" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            قائمة المهام
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة وتتبع جميع المهام المطلوبة
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  البحث
                </label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="ابحث في المهام..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الحالة
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="جميع الحالات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="pending">في الانتظار</SelectItem>
                    <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="overdue">متأخر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الأولوية
                </label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="جميع الأولويات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأولويات</SelectItem>
                    <SelectItem value="urgent">عاجل</SelectItem>
                    <SelectItem value="high">عالية</SelectItem>
                    <SelectItem value="medium">متوسطة</SelectItem>
                    <SelectItem value="low">منخفضة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الفئة
                </label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="جميع الفئات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    <SelectItem value="مستندات">مستندات</SelectItem>
                    <SelectItem value="تنسيق">تنسيق</SelectItem>
                    <SelectItem value="تقارير">تقارير</SelectItem>
                    <SelectItem value="متابعة">متابعة</SelectItem>
                    <SelectItem value="تدريب">تدريب</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full">
                  <Plus className="h-4 w-4 ml-2" />
                  مهمة جديدة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي المهام</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
                </div>
                <ClipboardList className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">قيد التنفيذ</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {tasks.filter(t => t.status === 'in_progress').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">مكتمل</p>
                  <p className="text-2xl font-bold text-green-600">
                    {tasks.filter(t => t.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">متأخر</p>
                  <p className="text-2xl font-bold text-red-600">
                    {tasks.filter(t => t.status === 'overdue').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">جميع المهام ({filteredTasks.length})</TabsTrigger>
            <TabsTrigger value="my-tasks">مهامي ({filteredTasks.filter(t => t.assignee === "أحمد محمد").length})</TabsTrigger>
            <TabsTrigger value="urgent">عاجل ({filteredTasks.filter(t => t.priority === "urgent").length})</TabsTrigger>
            <TabsTrigger value="overdue">متأخر ({filteredTasks.filter(t => t.status === "overdue").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {task.title}
                        </h3>
                        <Badge className={getStatusColor(task.status)}>
                          {getStatusText(task.status)}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {getPriorityText(task.priority)}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {task.description}
                      </p>

                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {task.assignee}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(task.dueDate).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {task.category}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            التقدم
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {task.progress}%
                          </span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        {task.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(task.id, 'completed')}
                          disabled={task.status === 'completed'}
                        >
                          <CheckCircle className="h-4 w-4 ml-1" />
                          إكمال
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 ml-1" />
                          عرض
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 ml-1" />
                          تعديل
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="my-tasks" className="space-y-4">
            {filteredTasks.filter(t => t.assignee === "أحمد محمد").map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* نفس محتوى المهمة */}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="urgent" className="space-y-4">
            {filteredTasks.filter(t => t.priority === "urgent").map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow border-red-200">
                <CardContent className="p-6">
                  {/* نفس محتوى المهمة مع تمييز عاجل */}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="overdue" className="space-y-4">
            {filteredTasks.filter(t => t.status === "overdue").map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow border-red-200">
                <CardContent className="p-6">
                  {/* نفس محتوى المهمة مع تمييز متأخر */}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 