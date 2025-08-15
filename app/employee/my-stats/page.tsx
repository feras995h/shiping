"use client"

import { useState } from "react"
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  User,
  Package,
  DollarSign,
  Star,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface EmployeeStats {
  id: string
  name: string
  position: string
  department: string
  joinDate: string
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
  totalShipments: number
  completedShipments: number
  totalRevenue: number
  monthlyRevenue: number
  performanceRating: number
  attendanceRate: number
  efficiencyScore: number
  customerSatisfaction: number
  monthlyGoals: Goal[]
  recentAchievements: Achievement[]
  performanceHistory: PerformanceRecord[]
}

interface Goal {
  id: string
  title: string
  target: number
  current: number
  unit: string
  deadline: string
  status: 'on_track' | 'behind' | 'completed' | 'at_risk'
}

interface Achievement {
  id: string
  title: string
  description: string
  date: string
  type: 'task' | 'shipment' | 'customer' | 'efficiency' | 'award'
  points: number
}

interface PerformanceRecord {
  month: string
  tasksCompleted: number
  shipmentsHandled: number
  revenue: number
  rating: number
}

const mockEmployeeStats: EmployeeStats = {
  id: "1",
  name: "سارة أحمد",
  position: "مدير العمليات",
  department: "إدارة الشحن",
  joinDate: "2022-03-15",
  totalTasks: 156,
  completedTasks: 142,
  pendingTasks: 8,
  overdueTasks: 2,
  totalShipments: 89,
  completedShipments: 87,
  totalRevenue: 1250000,
  monthlyRevenue: 85000,
  performanceRating: 4.8,
  attendanceRate: 98,
  efficiencyScore: 92,
  customerSatisfaction: 96,
  monthlyGoals: [
    {
      id: "g1",
      title: "إكمال المهام",
      target: 50,
      current: 42,
      unit: "مهمة",
      deadline: "2024-01-31",
      status: "on_track"
    },
    {
      id: "g2",
      title: "معالجة الشحنات",
      target: 30,
      current: 28,
      unit: "شحنة",
      deadline: "2024-01-31",
      status: "on_track"
    },
    {
      id: "g3",
      title: "الإيرادات الشهرية",
      target: 100000,
      current: 85000,
      unit: "دولار",
      deadline: "2024-01-31",
      status: "behind"
    },
    {
      id: "g4",
      title: "رضا العملاء",
      target: 95,
      current: 96,
      unit: "%",
      deadline: "2024-01-31",
      status: "completed"
    }
  ],
  recentAchievements: [
    {
      id: "a1",
      title: "إكمال 50 مهمة متتالية",
      description: "تم إكمال 50 مهمة بدون تأخير",
      date: "2024-01-20",
      type: "task",
      points: 100
    },
    {
      id: "a2",
      title: "شحنة معقدة",
      description: "معالجة شحنة معقدة من الصين إلى ليبيا",
      date: "2024-01-18",
      type: "shipment",
      points: 150
    },
    {
      id: "a3",
      title: "رضا العميل المثالي",
      description: "حصلت على تقييم 5 نجوم من عميل",
      date: "2024-01-15",
      type: "customer",
      points: 75
    },
    {
      id: "a4",
      title: "كفاءة عالية",
      description: "تحسين الكفاءة بنسبة 15%",
      date: "2024-01-12",
      type: "efficiency",
      points: 200
    }
  ],
  performanceHistory: [
    { month: "أكتوبر 2023", tasksCompleted: 45, shipmentsHandled: 25, revenue: 75000, rating: 4.5 },
    { month: "نوفمبر 2023", tasksCompleted: 48, shipmentsHandled: 28, revenue: 82000, rating: 4.6 },
    { month: "ديسمبر 2023", tasksCompleted: 52, shipmentsHandled: 30, revenue: 88000, rating: 4.7 },
    { month: "يناير 2024", tasksCompleted: 42, shipmentsHandled: 28, revenue: 85000, rating: 4.8 }
  ]
}

const getGoalStatusColor = (status: Goal['status']) => {
  switch (status) {
    case 'on_track': return 'bg-green-100 text-green-800'
    case 'behind': return 'bg-yellow-100 text-yellow-800'
    case 'completed': return 'bg-blue-100 text-blue-800'
    case 'at_risk': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getGoalStatusText = (status: Goal['status']) => {
  switch (status) {
    case 'on_track': return 'في المسار الصحيح'
    case 'behind': return 'متأخر'
    case 'completed': return 'مكتمل'
    case 'at_risk': return 'في خطر'
    default: return 'غير محدد'
  }
}

const getAchievementTypeColor = (type: Achievement['type']) => {
  switch (type) {
    case 'task': return 'bg-blue-100 text-blue-800'
    case 'shipment': return 'bg-green-100 text-green-800'
    case 'customer': return 'bg-purple-100 text-purple-800'
    case 'efficiency': return 'bg-orange-100 text-orange-800'
    case 'award': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getAchievementTypeText = (type: Achievement['type']) => {
  switch (type) {
    case 'task': return 'مهمة'
    case 'shipment': return 'شحنة'
    case 'customer': return 'عميل'
    case 'efficiency': return 'كفاءة'
    case 'award': return 'جائزة'
    default: return 'غير محدد'
  }
}

export default function EmployeeMyStatsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("current")

  const stats = mockEmployeeStats
  const taskCompletionRate = (stats.completedTasks / stats.totalTasks) * 100
  const shipmentCompletionRate = (stats.completedShipments / stats.totalShipments) * 100

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إحصائياتي</h1>
          <p className="text-gray-600">عرض إحصائيات الأداء والإنجازات الشخصية</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={selectedPeriod === "current" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("current")}
          >
            الشهر الحالي
          </Button>
          <Button 
            variant={selectedPeriod === "quarter" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("quarter")}
          >
            الربع الحالي
          </Button>
          <Button 
            variant={selectedPeriod === "year" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("year")}
          >
            السنة الحالية
          </Button>
        </div>
      </div>

      {/* Employee Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{stats.name}</h2>
              <p className="text-gray-600">{stats.position} - {stats.department}</p>
              <p className="text-sm text-gray-500">تاريخ الانضمام: {stats.joinDate}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-lg font-semibold">{stats.performanceRating}</span>
              </div>
              <p className="text-sm text-gray-600">تقييم الأداء</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المهام المكتملة</p>
                <p className="text-2xl font-bold text-blue-600">{stats.completedTasks}</p>
                <p className="text-xs text-gray-500">من أصل {stats.totalTasks}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <Progress value={taskCompletionRate} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{taskCompletionRate.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الشحنات المكتملة</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedShipments}</p>
                <p className="text-xs text-gray-500">من أصل {stats.totalShipments}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Progress value={shipmentCompletionRate} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{shipmentCompletionRate.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الإيرادات الشهرية</p>
                <p className="text-2xl font-bold text-purple-600">${stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">إجمالي: ${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">كفاءة العمل</p>
                <p className="text-2xl font-bold text-orange-600">{stats.efficiencyScore}%</p>
                <p className="text-xs text-gray-500">رضا العملاء: {stats.customerSatisfaction}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="goals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="goals">الأهداف الشهرية</TabsTrigger>
          <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
          <TabsTrigger value="performance">سجل الأداء</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {stats.monthlyGoals.map((goal) => {
              const progress = (goal.current / goal.target) * 100
              return (
                <Card key={goal.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <CardDescription>الهدف: {goal.target.toLocaleString()} {goal.unit}</CardDescription>
                      </div>
                      <Badge className={getGoalStatusColor(goal.status)}>
                        {getGoalStatusText(goal.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>التقدم الحالي:</span>
                      <span className="font-medium">{goal.current.toLocaleString()} {goal.unit}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>نسبة الإنجاز</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>تاريخ الاستحقاق:</span>
                      <span>{goal.deadline}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {stats.recentAchievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <Badge className={getAchievementTypeColor(achievement.type)}>
                          {getAchievementTypeText(achievement.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500">{achievement.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">{achievement.points}</span>
                      </div>
                      <p className="text-xs text-gray-500">نقطة</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.performanceHistory.map((record, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{record.month}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>المهام المكتملة:</span>
                    <span className="font-medium">{record.tasksCompleted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>الشحنات المعالجة:</span>
                    <span className="font-medium">{record.shipmentsHandled}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>الإيرادات:</span>
                    <span className="font-medium">${record.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>التقييم:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="font-medium">{record.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              معدل الحضور
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.attendanceRate}%</div>
              <p className="text-sm text-gray-600">معدل الحضور الشهري</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              المهام المتأخرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{stats.overdueTasks}</div>
              <p className="text-sm text-gray-600">مهام متأخرة</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              المهام المعلقة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{stats.pendingTasks}</div>
              <p className="text-sm text-gray-600">مهام معلقة</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 