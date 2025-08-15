"use client"

import { useState } from "react"
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Plus,
  Edit,
  Trash2,
  Star,
  Award,
  BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface Goal {
  id: string
  title: string
  description: string
  category: 'personal' | 'professional' | 'team' | 'company'
  type: 'performance' | 'learning' | 'sales' | 'efficiency' | 'quality'
  target: number
  current: number
  unit: string
  startDate: string
  deadline: string
  status: 'not_started' | 'in_progress' | 'on_track' | 'behind' | 'completed' | 'overdue'
  priority: 'low' | 'medium' | 'high' | 'critical'
  progress: number
  milestones: Milestone[]
  notes: string[]
}

interface Milestone {
  id: string
  title: string
  target: number
  current: number
  dueDate: string
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
}

const mockGoals: Goal[] = [
  {
    id: "1",
    title: "تحسين كفاءة معالجة الشحنات",
    description: "زيادة سرعة معالجة الشحنات بنسبة 20% مع الحفاظ على الجودة",
    category: "professional",
    type: "efficiency",
    target: 20,
    current: 15,
    unit: "%",
    startDate: "2024-01-01",
    deadline: "2024-03-31",
    status: "on_track",
    priority: "high",
    progress: 75,
    milestones: [
      {
        id: "m1",
        title: "تحليل العملية الحالية",
        target: 100,
        current: 100,
        dueDate: "2024-01-15",
        status: "completed"
      },
      {
        id: "m2",
        title: "تطبيق التحسينات",
        target: 100,
        current: 60,
        dueDate: "2024-02-15",
        status: "in_progress"
      },
      {
        id: "m3",
        title: "قياس النتائج",
        target: 100,
        current: 0,
        dueDate: "2024-03-31",
        status: "pending"
      }
    ],
    notes: [
      "تم تحديد 3 نقاط تحسين رئيسية",
      "تم تدريب الفريق على الإجراءات الجديدة"
    ]
  },
  {
    id: "2",
    title: "إكمال دورة في إدارة سلسلة التوريد",
    description: "الحصول على شهادة في إدارة سلسلة التوريد من معهد معتمد",
    category: "personal",
    type: "learning",
    target: 100,
    current: 70,
    unit: "%",
    startDate: "2024-01-01",
    deadline: "2024-02-29",
    status: "in_progress",
    priority: "medium",
    progress: 70,
    milestones: [
      {
        id: "m1",
        title: "تسجيل الدورة",
        target: 100,
        current: 100,
        dueDate: "2024-01-05",
        status: "completed"
      },
      {
        id: "m2",
        title: "إكمال الوحدات النظرية",
        target: 100,
        current: 100,
        dueDate: "2024-01-31",
        status: "completed"
      },
      {
        id: "m3",
        title: "إكمال المشروع العملي",
        target: 100,
        current: 40,
        dueDate: "2024-02-15",
        status: "in_progress"
      },
      {
        id: "m4",
        title: "الامتحان النهائي",
        target: 100,
        current: 0,
        dueDate: "2024-02-29",
        status: "pending"
      }
    ],
    notes: [
      "الدورة تتضمن 12 وحدة تعليمية",
      "المشروع العملي يتعلق بتحسين سلسلة التوريد"
    ]
  },
  {
    id: "3",
    title: "زيادة رضا العملاء",
    description: "رفع معدل رضا العملاء إلى 95% أو أعلى",
    category: "professional",
    type: "quality",
    target: 95,
    current: 92,
    unit: "%",
    startDate: "2024-01-01",
    deadline: "2024-06-30",
    status: "on_track",
    priority: "high",
    progress: 97,
    milestones: [
      {
        id: "m1",
        title: "تحليل استطلاعات الرأي",
        target: 100,
        current: 100,
        dueDate: "2024-01-31",
        status: "completed"
      },
      {
        id: "m2",
        title: "تطبيق التحسينات",
        target: 100,
        current: 80,
        dueDate: "2024-03-31",
        status: "in_progress"
      },
      {
        id: "m3",
        title: "قياس التحسن",
        target: 100,
        current: 0,
        dueDate: "2024-06-30",
        status: "pending"
      }
    ],
    notes: [
      "تم تحديد 5 مجالات للتحسين",
      "تم إطلاق برنامج تدريب للفريق"
    ]
  },
  {
    id: "4",
    title: "زيادة الإيرادات الشهرية",
    description: "زيادة الإيرادات الشهرية بنسبة 15% مقارنة بالشهر السابق",
    category: "professional",
    type: "sales",
    target: 15,
    current: 8,
    unit: "%",
    startDate: "2024-01-01",
    deadline: "2024-01-31",
    status: "behind",
    priority: "critical",
    progress: 53,
    milestones: [
      {
        id: "m1",
        title: "تحليل السوق",
        target: 100,
        current: 100,
        dueDate: "2024-01-10",
        status: "completed"
      },
      {
        id: "m2",
        title: "تنفيذ استراتيجية المبيعات",
        target: 100,
        current: 50,
        dueDate: "2024-01-20",
        status: "in_progress"
      },
      {
        id: "m3",
        title: "قياس النتائج",
        target: 100,
        current: 0,
        dueDate: "2024-01-31",
        status: "pending"
      }
    ],
    notes: [
      "الهدف يتطلب جهد إضافي في الأسبوعين القادمين",
      "تم تحديد 3 عملاء محتملين جدد"
    ]
  }
]

const getStatusColor = (status: Goal['status']) => {
  switch (status) {
    case 'not_started': return 'bg-gray-100 text-gray-800'
    case 'in_progress': return 'bg-blue-100 text-blue-800'
    case 'on_track': return 'bg-green-100 text-green-800'
    case 'behind': return 'bg-yellow-100 text-yellow-800'
    case 'completed': return 'bg-purple-100 text-purple-800'
    case 'overdue': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: Goal['status']) => {
  switch (status) {
    case 'not_started': return 'لم يبدأ'
    case 'in_progress': return 'قيد التنفيذ'
    case 'on_track': return 'في المسار الصحيح'
    case 'behind': return 'متأخر'
    case 'completed': return 'مكتمل'
    case 'overdue': return 'متأخر عن الموعد'
    default: return 'غير محدد'
  }
}

const getPriorityColor = (priority: Goal['priority']) => {
  switch (priority) {
    case 'low': return 'bg-green-100 text-green-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'high': return 'bg-orange-100 text-orange-800'
    case 'critical': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityText = (priority: Goal['priority']) => {
  switch (priority) {
    case 'low': return 'منخفضة'
    case 'medium': return 'متوسطة'
    case 'high': return 'عالية'
    case 'critical': return 'حرجة'
    default: return 'غير محدد'
  }
}

const getCategoryText = (category: Goal['category']) => {
  switch (category) {
    case 'personal': return 'شخصي'
    case 'professional': return 'مهني'
    case 'team': return 'فريق'
    case 'company': return 'شركة'
    default: return 'غير محدد'
  }
}

const getTypeText = (type: Goal['type']) => {
  switch (type) {
    case 'performance': return 'أداء'
    case 'learning': return 'تعلم'
    case 'sales': return 'مبيعات'
    case 'efficiency': return 'كفاءة'
    case 'quality': return 'جودة'
    default: return 'غير محدد'
  }
}

export default function EmployeeGoalsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredGoals = mockGoals.filter(goal => {
    const matchesCategory = selectedCategory === "all" || goal.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || goal.status === selectedStatus
    return matchesCategory && matchesStatus
  })

  const getGoalStats = () => {
    const total = mockGoals.length
    const completed = mockGoals.filter(g => g.status === 'completed').length
    const inProgress = mockGoals.filter(g => g.status === 'in_progress' || g.status === 'on_track').length
    const behind = mockGoals.filter(g => g.status === 'behind' || g.status === 'overdue').length
    const averageProgress = mockGoals.reduce((sum, goal) => sum + goal.progress, 0) / mockGoals.length

    return { total, completed, inProgress, behind, averageProgress }
  }

  const stats = getGoalStats()

  const getDaysRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الأهداف</h1>
          <p className="text-gray-600">إدارة وتتبع الأهداف الشخصية والمهنية</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="ml-2 h-4 w-4" />
          إضافة هدف جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الأهداف</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">قيد التنفيذ</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متأخرة</p>
                <p className="text-2xl font-bold text-red-600">{stats.behind}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط التقدم</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averageProgress.toFixed(1)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select 
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">جميع الفئات</option>
          <option value="personal">شخصي</option>
          <option value="professional">مهني</option>
          <option value="team">فريق</option>
          <option value="company">شركة</option>
        </select>
        <select 
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">جميع الحالات</option>
          <option value="not_started">لم يبدأ</option>
          <option value="in_progress">قيد التنفيذ</option>
          <option value="on_track">في المسار الصحيح</option>
          <option value="behind">متأخر</option>
          <option value="completed">مكتمل</option>
          <option value="overdue">متأخر عن الموعد</option>
        </select>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredGoals.map((goal) => {
          const daysRemaining = getDaysRemaining(goal.deadline)
          return (
            <Card key={goal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <CardDescription>{goal.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(goal.status)}>
                      {getStatusText(goal.status)}
                    </Badge>
                    <Badge className={getPriorityColor(goal.priority)}>
                      {getPriorityText(goal.priority)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>التقدم:</span>
                  <span className="font-medium">{goal.current} / {goal.target} {goal.unit}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>نسبة الإنجاز</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">الفئة:</span>
                    <p className="font-medium">{getCategoryText(goal.category)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">النوع:</span>
                    <p className="font-medium">{getTypeText(goal.type)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">تاريخ البداية:</span>
                    <p className="font-medium">{goal.startDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">تاريخ الاستحقاق:</span>
                    <p className="font-medium">{goal.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className={daysRemaining < 0 ? "text-red-600" : daysRemaining < 7 ? "text-yellow-600" : "text-gray-600"}>
                    {daysRemaining < 0 ? `${Math.abs(daysRemaining)} يوم متأخر` : `${daysRemaining} يوم متبقي`}
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">المراحل:</h4>
                  <div className="space-y-1">
                    {goal.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex justify-between items-center text-xs">
                        <span className="truncate">{milestone.title}</span>
                        <Badge 
                          variant="outline" 
                          className={milestone.status === 'completed' ? 'text-green-600' : 
                                   milestone.status === 'overdue' ? 'text-red-600' : 'text-gray-600'}
                        >
                          {milestone.status === 'completed' ? 'مكتمل' :
                           milestone.status === 'in_progress' ? 'قيد التنفيذ' :
                           milestone.status === 'overdue' ? 'متأخر' : 'في الانتظار'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                {goal.notes.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">ملاحظات:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {goal.notes.map((note, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Edit className="ml-2 h-4 w-4" />
                    تعديل
                  </Button>
                  <Button size="sm" variant="outline">
                    <Star className="ml-2 h-4 w-4" />
                    تحديث التقدم
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredGoals.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أهداف</h3>
            <p className="text-gray-600 mb-4">لا توجد أهداف تطابق المعايير المحددة</p>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة هدف جديد
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 