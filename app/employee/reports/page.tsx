"use client"

import { useState } from "react"
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Clock,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Share2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Report {
  id: string
  title: string
  description: string
  type: 'performance' | 'operations' | 'financial' | 'analytics' | 'custom'
  category: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom'
  status: 'draft' | 'pending' | 'completed' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdBy: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  completedAt?: string
  fileSize: number
  fileType: 'pdf' | 'excel' | 'word' | 'csv'
  downloadCount: number
  tags: string[]
  data: ReportData
}

interface ReportData {
  totalRecords: number
  processedRecords: number
  errors: number
  warnings: number
  metrics: Metric[]
  charts: Chart[]
}

interface Metric {
  name: string
  value: number
  unit: string
  change: number
  trend: 'up' | 'down' | 'stable'
}

interface Chart {
  id: string
  type: 'bar' | 'line' | 'pie' | 'doughnut'
  title: string
  data: any
}

const mockReports: Report[] = [
  {
    id: "1",
    title: "تقرير الأداء الشهري - مارس 2024",
    description: "تقرير شامل عن أداء الموظفين والإنتاجية خلال شهر مارس",
    type: "performance",
    category: "monthly",
    status: "completed",
    priority: "high",
    createdBy: "أحمد محمد",
    createdAt: "2024-03-31T10:00:00Z",
    updatedAt: "2024-03-31T15:30:00Z",
    completedAt: "2024-03-31T15:30:00Z",
    fileSize: 2048576,
    fileType: "pdf",
    downloadCount: 15,
    tags: ["أداء", "شهري", "موظفين"],
    data: {
      totalRecords: 150,
      processedRecords: 150,
      errors: 0,
      warnings: 2,
      metrics: [
        {
          name: "متوسط الإنتاجية",
          value: 85.5,
          unit: "%",
          change: 5.2,
          trend: "up"
        },
        {
          name: "عدد المهام المنجزة",
          value: 45,
          unit: "مهمة",
          change: -2,
          trend: "down"
        },
        {
          name: "وقت الاستجابة",
          value: 2.3,
          unit: "ساعات",
          change: -0.5,
          trend: "up"
        }
      ],
      charts: []
    }
  },
  {
    id: "2",
    title: "تقرير عمليات الشحن - الأسبوع 12",
    description: "تقرير أسبوعي عن عمليات الشحن والتخليص الجمركي",
    type: "operations",
    category: "weekly",
    status: "completed",
    priority: "medium",
    createdBy: "فاطمة حسن",
    createdAt: "2024-03-28T09:00:00Z",
    updatedAt: "2024-03-28T14:00:00Z",
    completedAt: "2024-03-28T14:00:00Z",
    fileSize: 1536000,
    fileType: "excel",
    downloadCount: 8,
    tags: ["شحن", "أسبوعي", "عمليات"],
    data: {
      totalRecords: 75,
      processedRecords: 75,
      errors: 1,
      warnings: 0,
      metrics: [
        {
          name: "عدد الشحنات",
          value: 25,
          unit: "شحنة",
          change: 3,
          trend: "up"
        },
        {
          name: "معدل التخليص",
          value: 92.5,
          unit: "%",
          change: 1.5,
          trend: "up"
        },
        {
          name: "متوسط وقت التوصيل",
          value: 4.2,
          unit: "أيام",
          change: -0.3,
          trend: "up"
        }
      ],
      charts: []
    }
  },
  {
    id: "3",
    title: "التقرير المالي - الربع الأول 2024",
    description: "تقرير مالي شامل للربع الأول من عام 2024",
    type: "financial",
    category: "quarterly",
    status: "pending",
    priority: "critical",
    createdBy: "محمد علي",
    createdAt: "2024-03-25T08:00:00Z",
    updatedAt: "2024-03-30T16:00:00Z",
    dueDate: "2024-04-05T17:00:00Z",
    fileSize: 0,
    fileType: "pdf",
    downloadCount: 0,
    tags: ["مالي", "ربعي", "2024"],
    data: {
      totalRecords: 0,
      processedRecords: 0,
      errors: 0,
      warnings: 0,
      metrics: [],
      charts: []
    }
  },
  {
    id: "4",
    title: "تحليل بيانات العملاء",
    description: "تحليل شامل لبيانات العملاء وتفضيلاتهم",
    type: "analytics",
    category: "custom",
    status: "draft",
    priority: "low",
    createdBy: "سارة أحمد",
    createdAt: "2024-03-29T11:00:00Z",
    updatedAt: "2024-03-29T11:00:00Z",
    fileSize: 0,
    fileType: "excel",
    downloadCount: 0,
    tags: ["تحليل", "عملاء", "بيانات"],
    data: {
      totalRecords: 0,
      processedRecords: 0,
      errors: 0,
      warnings: 0,
      metrics: [],
      charts: []
    }
  }
]

const getStatusColor = (status: Report['status']) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'draft': return 'bg-gray-100 text-gray-800'
    case 'archived': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: Report['status']) => {
  switch (status) {
    case 'completed': return 'مكتمل'
    case 'pending': return 'قيد التنفيذ'
    case 'draft': return 'مسودة'
    case 'archived': return 'مؤرشف'
    default: return status
  }
}

const getTypeColor = (type: Report['type']) => {
  switch (type) {
    case 'performance': return 'bg-blue-100 text-blue-800'
    case 'operations': return 'bg-green-100 text-green-800'
    case 'financial': return 'bg-purple-100 text-purple-800'
    case 'analytics': return 'bg-orange-100 text-orange-800'
    case 'custom': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getTypeText = (type: Report['type']) => {
  switch (type) {
    case 'performance': return 'أداء'
    case 'operations': return 'عمليات'
    case 'financial': return 'مالي'
    case 'analytics': return 'تحليلات'
    case 'custom': return 'مخصص'
    default: return type
  }
}

const getPriorityColor = (priority: Report['priority']) => {
  switch (priority) {
    case 'critical': return 'bg-red-100 text-red-800'
    case 'high': return 'bg-orange-100 text-orange-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityText = (priority: Report['priority']) => {
  switch (priority) {
    case 'critical': return 'حرج'
    case 'high': return 'عالي'
    case 'medium': return 'متوسط'
    case 'low': return 'منخفض'
    default: return priority
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileTypeIcon = (fileType: Report['fileType']) => {
  switch (fileType) {
    case 'pdf': return '📄'
    case 'excel': return '📊'
    case 'word': return '📝'
    case 'csv': return '📋'
    default: return '📄'
  }
}

export default function EmployeeReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || report.type === typeFilter
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getProgressPercentage = (report: Report) => {
    if (report.status === 'completed') return 100
    if (report.status === 'pending') return 60
    if (report.status === 'draft') return 30
    return 0
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">التقارير</h1>
          <p className="text-gray-600 mt-2">إدارة وتصفح التقارير</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="ml-2 h-4 w-4" />
          تقرير جديد
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التقارير</p>
                <p className="text-2xl font-bold text-gray-900">{mockReports.length}</p>
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
                  {mockReports.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">قيد التنفيذ</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {mockReports.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التحميلات</p>
                <p className="text-2xl font-bold text-purple-600">
                  {mockReports.reduce((acc, r) => acc + r.downloadCount, 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في التقارير..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الأنواع</option>
                <option value="performance">أداء</option>
                <option value="operations">عمليات</option>
                <option value="financial">مالي</option>
                <option value="analytics">تحليلات</option>
                <option value="custom">مخصص</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="draft">مسودة</option>
                <option value="pending">قيد التنفيذ</option>
                <option value="completed">مكتمل</option>
                <option value="archived">مؤرشف</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {report.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-gray-600">
                    {report.description}
                  </CardDescription>
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
                      <Download className="ml-2 h-4 w-4" />
                      تحميل
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="ml-2 h-4 w-4" />
                      مشاركة
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="ml-2 h-4 w-4" />
                      تعديل
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="ml-2 h-4 w-4" />
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className={getStatusColor(report.status)}>
                  {getStatusText(report.status)}
                </Badge>
                <Badge className={getTypeColor(report.type)}>
                  {getTypeText(report.type)}
                </Badge>
                <Badge className={getPriorityColor(report.priority)}>
                  {getPriorityText(report.priority)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>التقدم</span>
                  <span>{getProgressPercentage(report)}%</span>
                </div>
                <Progress value={getProgressPercentage(report)} className="h-2" />
              </div>

              {/* Report Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">المنشئ:</span>
                  <div className="font-medium">{report.createdBy}</div>
                </div>
                <div>
                  <span className="text-gray-500">تاريخ الإنشاء:</span>
                  <div className="font-medium">
                    {new Date(report.createdAt).toLocaleDateString('ar-SA')}
                  </div>
                </div>
                {report.dueDate && (
                  <div>
                    <span className="text-gray-500">تاريخ الاستحقاق:</span>
                    <div className="font-medium">
                      {new Date(report.dueDate).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">التحميلات:</span>
                  <div className="font-medium">{report.downloadCount}</div>
                </div>
              </div>

              {/* File Info */}
              {report.fileSize > 0 && (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getFileTypeIcon(report.fileType)}</span>
                    <div>
                      <div className="text-sm font-medium">{report.fileType.toUpperCase()}</div>
                      <div className="text-xs text-gray-500">{formatFileSize(report.fileSize)}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="ml-1 h-4 w-4" />
                    تحميل
                  </Button>
                </div>
              )}

              {/* Tags */}
              <div>
                <span className="text-gray-500 text-sm">العلامات:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {report.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedReport(report)}
                >
                  <Eye className="ml-1 h-4 w-4" />
                  التفاصيل
                </Button>
                {report.status === 'completed' && (
                  <Button variant="outline" size="sm">
                    <Download className="ml-1 h-4 w-4" />
                    تحميل
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedReport.title}</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedReport(null)}
                >
                  ✕
                </Button>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                  <TabsTrigger value="metrics">المقاييس</TabsTrigger>
                  <TabsTrigger value="details">التفاصيل</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">معلومات التقرير</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <span className="text-gray-500">الوصف:</span>
                          <p className="mt-1">{selectedReport.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-500">النوع:</span>
                            <Badge className={cn("mt-1", getTypeColor(selectedReport.type))}>
                              {getTypeText(selectedReport.type)}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-gray-500">الحالة:</span>
                            <Badge className={cn("mt-1", getStatusColor(selectedReport.status))}>
                              {getStatusText(selectedReport.status)}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-500">المنشئ:</span>
                            <div className="font-medium">{selectedReport.createdBy}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">تاريخ الإنشاء:</span>
                            <div className="font-medium">
                              {new Date(selectedReport.createdAt).toLocaleDateString('ar-SA')}
                            </div>
                          </div>
                        </div>
                        {selectedReport.dueDate && (
                          <div>
                            <span className="text-gray-500">الأيام المتبقية:</span>
                            <div className="font-medium text-lg">
                              {getDaysUntilDue(selectedReport.dueDate)} يوم
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">إحصائيات التقرير</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>التقدم</span>
                            <span>{getProgressPercentage(selectedReport)}%</span>
                          </div>
                          <Progress value={getProgressPercentage(selectedReport)} className="h-3" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-500">التحميلات:</span>
                            <div className="font-medium text-lg">{selectedReport.downloadCount}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">حجم الملف:</span>
                            <div className="font-medium">{formatFileSize(selectedReport.fileSize)}</div>
                          </div>
                        </div>
                        {selectedReport.data.totalRecords > 0 && (
                          <div>
                            <span className="text-gray-500">السجلات المعالجة:</span>
                            <div className="font-medium">
                              {selectedReport.data.processedRecords} / {selectedReport.data.totalRecords}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="metrics" className="space-y-4">
                  {selectedReport.data.metrics.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedReport.data.metrics.map((metric, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium">{metric.name}</div>
                                <div className="text-2xl font-bold">
                                  {metric.value} {metric.unit}
                                </div>
                              </div>
                              <div className={cn(
                                "flex items-center gap-1 text-sm",
                                metric.trend === 'up' ? 'text-green-600' :
                                metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                              )}>
                                <TrendingUp className={cn(
                                  "h-4 w-4",
                                  metric.trend === 'down' && "rotate-180"
                                )} />
                                {metric.change > 0 ? '+' : ''}{metric.change}%
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center text-gray-500">
                        لا توجد مقاييس متاحة لهذا التقرير
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">تفاصيل إضافية</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-500">آخر تحديث:</span>
                          <div className="font-medium">
                            {new Date(selectedReport.updatedAt).toLocaleString('ar-SA')}
                          </div>
                        </div>
                        {selectedReport.completedAt && (
                          <div>
                            <span className="text-gray-500">تاريخ الإكمال:</span>
                            <div className="font-medium">
                              {new Date(selectedReport.completedAt).toLocaleString('ar-SA')}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <span className="text-gray-500">العلامات:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedReport.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {selectedReport.data.errors > 0 || selectedReport.data.warnings > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-500">الأخطاء:</span>
                            <div className="font-medium text-red-600">{selectedReport.data.errors}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">التحذيرات:</span>
                            <div className="font-medium text-yellow-600">{selectedReport.data.warnings}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 