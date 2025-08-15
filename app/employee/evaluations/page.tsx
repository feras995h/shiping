"use client"

import { useState } from "react"
import { 
  Star, 
  TrendingUp, 
  Calendar, 
  User, 
  Target, 
  Award, 
  BarChart3, 
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Download,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Evaluation {
  id: string
  employeeName: string
  evaluatorName: string
  type: 'monthly' | 'quarterly' | 'annual' | 'project'
  period: string
  evaluationDate: string
  status: 'pending' | 'in_progress' | 'completed'
  overallScore: number
  maxScore: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
}

const mockEvaluations: Evaluation[] = [
  {
    id: "1",
    employeeName: "أحمد محمد",
    evaluatorName: "فاطمة حسن",
    type: "quarterly",
    period: "الربع الأول 2024",
    evaluationDate: "2024-03-31",
    status: "completed",
    overallScore: 85,
    maxScore: 100,
    grade: "A"
  },
  {
    id: "2",
    employeeName: "سارة أحمد",
    evaluatorName: "فاطمة حسن",
    type: "monthly",
    period: "مارس 2024",
    evaluationDate: "2024-03-31",
    status: "in_progress",
    overallScore: 0,
    maxScore: 100,
    grade: "F"
  },
  {
    id: "3",
    employeeName: "محمد علي",
    evaluatorName: "علي محمد",
    type: "project",
    period: "مشروع تطوير النظام",
    evaluationDate: "2024-03-15",
    status: "completed",
    overallScore: 92,
    maxScore: 100,
    grade: "A"
  }
]

const getStatusColor = (status: Evaluation['status']) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'in_progress': return 'bg-blue-100 text-blue-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: Evaluation['status']) => {
  switch (status) {
    case 'completed': return 'مكتمل'
    case 'in_progress': return 'قيد التنفيذ'
    case 'pending': return 'في الانتظار'
    default: return status
  }
}

const getTypeText = (type: Evaluation['type']) => {
  switch (type) {
    case 'monthly': return 'شهري'
    case 'quarterly': return 'ربعي'
    case 'annual': return 'سنوي'
    case 'project': return 'مشروع'
    default: return type
  }
}

const getGradeColor = (grade: Evaluation['grade']) => {
  switch (grade) {
    case 'A': return 'bg-green-100 text-green-800'
    case 'B': return 'bg-blue-100 text-blue-800'
    case 'C': return 'bg-yellow-100 text-yellow-800'
    case 'D': return 'bg-orange-100 text-orange-800'
    case 'F': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function EmployeeEvaluationsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEvaluations = mockEvaluations.filter(evaluation => {
    return evaluation.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           evaluation.evaluatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           evaluation.period.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">التقييمات</h1>
          <p className="text-gray-600 mt-2">إدارة وتتبع تقييمات الأداء</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="ml-2 h-4 w-4" />
          تقييم جديد
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التقييمات</p>
                <p className="text-2xl font-bold text-gray-900">{mockEvaluations.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مكتملة</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockEvaluations.filter(e => e.status === 'completed').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">قيد التنفيذ</p>
                <p className="text-2xl font-bold text-blue-600">
                  {mockEvaluations.filter(e => e.status === 'in_progress').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط الدرجات</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(mockEvaluations.filter(e => e.status === 'completed').reduce((acc, e) => acc + e.overallScore, 0) / mockEvaluations.filter(e => e.status === 'completed').length || 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث في التقييمات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Evaluations List */}
      <div className="space-y-4">
        {filteredEvaluations.map((evaluation) => (
          <Card key={evaluation.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {evaluation.employeeName}
                      </h3>
                      <p className="text-gray-600">{evaluation.period}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(evaluation.status)}>
                        {getStatusText(evaluation.status)}
                      </Badge>
                      <Badge variant="outline">
                        {getTypeText(evaluation.type)}
                      </Badge>
                      {evaluation.status === 'completed' && (
                        <Badge className={getGradeColor(evaluation.grade)}>
                          {evaluation.grade}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-gray-500 text-sm">المقيّم:</span>
                      <div className="font-medium">{evaluation.evaluatorName}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">تاريخ التقييم:</span>
                      <div className="font-medium">
                        {new Date(evaluation.evaluationDate).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">الدرجة:</span>
                      <div className="font-medium">
                        {evaluation.overallScore}/{evaluation.maxScore}
                      </div>
                    </div>
                  </div>

                  {evaluation.status === 'completed' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>الدرجة الإجمالية</span>
                        <span>{evaluation.overallScore}/{evaluation.maxScore}</span>
                      </div>
                      <Progress value={(evaluation.overallScore / evaluation.maxScore) * 100} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="ml-1 h-4 w-4" />
                      عرض التفاصيل
                    </Button>
                    {evaluation.status !== 'completed' && (
                      <Button variant="outline" size="sm">
                        <Edit className="ml-1 h-4 w-4" />
                        تعديل
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Download className="ml-1 h-4 w-4" />
                      تصدير
                    </Button>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className="ml-2 h-4 w-4" />
                      عرض التفاصيل
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="ml-2 h-4 w-4" />
                      تعديل
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="ml-2 h-4 w-4" />
                      تصدير
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <AlertCircle className="ml-2 h-4 w-4" />
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 