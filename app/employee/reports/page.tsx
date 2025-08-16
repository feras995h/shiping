
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp
} from "lucide-react"

interface Report {
  id: string
  title: string
  description: string
  type: 'shipment' | 'financial' | 'client' | 'performance' | 'inventory'
  status: 'draft' | 'pending' | 'completed' | 'rejected'
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdBy: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  fileUrl?: string
  fileType?: 'pdf' | 'excel' | 'word' | 'csv'
  fileSize?: number
  progress: number
  assignedTo?: string
}

const reportTypes = {
  shipment: 'تقارير الشحن',
  financial: 'تقارير مالية',
  client: 'تقارير العملاء',
  performance: 'تقارير الأداء',
  inventory: 'تقارير المخزون'
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700'
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700'
}

export default function EmployeeReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  // جلب التقارير من API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports')
        if (!response.ok) {
          throw new Error('فشل في جلب التقارير')
        }
        const data = await response.json()
        setReports(data.data || [])
      } catch (error) {
        console.error('خطأ في جلب التقارير:', error)
        // بيانات وهمية للعرض
        setReports([
          {
            id: "1",
            title: "تقرير شحنات شهر يناير",
            description: "تقرير شامل عن جميع الشحنات المنجزة خلال شهر يناير 2024",
            type: "shipment",
            status: "completed",
            priority: "high",
            createdBy: "أحمد محمد",
            createdAt: "2024-01-15T08:00:00Z",
            updatedAt: "2024-01-20T14:30:00Z",
            dueDate: "2024-01-25T23:59:59Z",
            fileUrl: "/reports/shipments-january-2024.pdf",
            fileType: "pdf",
            fileSize: 2048576,
            progress: 100,
            assignedTo: "سارة أحمد"
          },
          {
            id: "2",
            title: "تحليل أداء العملاء",
            description: "تقرير تحليلي لأداء العملاء وسلوك الشراء",
            type: "client",
            status: "pending",
            priority: "medium",
            createdBy: "محمد علي",
            createdAt: "2024-01-18T10:15:00Z",
            updatedAt: "2024-01-19T16:45:00Z",
            dueDate: "2024-01-30T23:59:59Z",
            progress: 75,
            assignedTo: "ليلى حسن"
          },
          {
            id: "3",
            title: "تقرير الأداء المالي",
            description: "تقرير مالي شامل للربع الأول من العام",
            type: "financial",
            status: "draft",
            priority: "critical",
            createdBy: "فاطمة الزهراء",
            createdAt: "2024-01-20T12:00:00Z",
            updatedAt: "2024-01-20T12:00:00Z",
            dueDate: "2024-02-05T23:59:59Z",
            progress: 30,
            assignedTo: "عمر خالد"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || report.type === typeFilter
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'draft': return 'مسودة'
      case 'pending': return 'قيد المراجعة'
      case 'completed': return 'مكتمل'
      case 'rejected': return 'مرفوض'
      default: return status
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

  const getFileTypeIcon = (fileType?: Report['fileType']) => {
    switch (fileType) {
      case 'pdf': return '📄'
      case 'excel': return '📊'
      case 'word': return '📝'
      case 'csv': return '📋'
      default: return '📄'
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleCreateReport = () => {
    // إنشاء تقرير جديد
    console.log('إنشاء تقرير جديد')
  }

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
  }

  const handleDownloadReport = (report: Report) => {
    if (report.fileUrl) {
      window.open(report.fileUrl, '_blank')
    }
  }

  const handleEditReport = (report: Report) => {
    console.log('تعديل التقرير:', report.id)
  }

  const handleDeleteReport = (report: Report) => {
    if (confirm('هل أنت متأكد من حذف هذا التقرير؟')) {
      setReports(prev => prev.filter(r => r.id !== report.id))
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">التقارير</h1>
          <p className="text-gray-600 mt-2">إدارة وتصفح التقارير</p>
        </div>
        <Button onClick={handleCreateReport} className="bg-blue-600 hover:bg-blue-700">
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
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
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
                  {reports.filter(r => r.status === 'completed').length}
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
                <p className="text-sm font-medium text-gray-600">قيد المراجعة</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reports.filter(r => r.status === 'pending').length}
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
                <p className="text-sm font-medium text-gray-600">عالية الأولوية</p>
                <p className="text-2xl font-bold text-red-600">
                  {reports.filter(r => r.priority === 'critical' || r.priority === 'high').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
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
              <Label htmlFor="search">البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="البحث في التقارير..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Label>نوع التقرير</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الأنواع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  {Object.entries(reportTypes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-48">
              <Label>الحالة</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="pending">قيد المراجعة</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="rejected">مرفوض</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{report.title}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {report.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {getStatusIcon(report.status)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className={statusColors[report.status]}>
                  {getStatusText(report.status)}
                </Badge>
                <Badge className={priorityColors[report.priority]}>
                  {getPriorityText(report.priority)}
                </Badge>
                <Badge variant="outline">
                  {reportTypes[report.type]}
                </Badge>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>التقدم</span>
                  <span>{report.progress}%</span>
                </div>
                <Progress value={report.progress} className="h-2" />
              </div>

              {/* Metadata */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>تاريخ الإنشاء: {new Date(report.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
                
                {report.dueDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      موعد التسليم: {new Date(report.dueDate).toLocaleDateString('ar-SA')}
                      {getDaysUntilDue(report.dueDate) < 0 && (
                        <span className="text-red-600 mr-1">(متأخر)</span>
                      )}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span>بواسطة: {report.createdBy}</span>
                </div>

                {report.assignedTo && (
                  <div className="flex items-center gap-2">
                    <span>مُعيَّن إلى: {report.assignedTo}</span>
                  </div>
                )}

                {report.fileUrl && (
                  <div className="flex items-center gap-2">
                    <span>{getFileTypeIcon(report.fileType)}</span>
                    <span>{formatFileSize(report.fileSize || 0)}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewReport(report)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 ml-1" />
                  عرض
                </Button>
                
                {report.fileUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReport(report)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditReport(report)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteReport(report)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تقارير</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || typeFilter !== "all" || statusFilter !== "all" 
                ? "لم يتم العثور على تقارير تطابق معايير البحث" 
                : "لم يتم إنشاء أي تقارير بعد"
              }
            </p>
            <Button onClick={handleCreateReport}>
              <Plus className="h-4 w-4 ml-2" />
              إنشاء تقرير جديد
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Report Details Dialog */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedReport.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-700">{selectedReport.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">النوع:</span>
                  <span className="mr-2">{reportTypes[selectedReport.type]}</span>
                </div>
                <div>
                  <span className="font-medium">الحالة:</span>
                  <span className="mr-2">{getStatusText(selectedReport.status)}</span>
                </div>
                <div>
                  <span className="font-medium">الأولوية:</span>
                  <span className="mr-2">{getPriorityText(selectedReport.priority)}</span>
                </div>
                <div>
                  <span className="font-medium">التقدم:</span>
                  <span className="mr-2">{selectedReport.progress}%</span>
                </div>
                <div>
                  <span className="font-medium">تاريخ الإنشاء:</span>
                  <span className="mr-2">{new Date(selectedReport.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
                {selectedReport.dueDate && (
                  <div>
                    <span className="font-medium">موعد التسليم:</span>
                    <span className="mr-2">{new Date(selectedReport.dueDate).toLocaleDateString('ar-SA')}</span>
                  </div>
                )}
              </div>

              {selectedReport.fileUrl && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{getFileTypeIcon(selectedReport.fileType)}</span>
                  <div>
                    <p className="font-medium">ملف التقرير</p>
                    <p className="text-sm text-gray-600">{formatFileSize(selectedReport.fileSize || 0)}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReport(selectedReport)}
                    className="mr-auto"
                  >
                    <Download className="h-4 w-4 ml-1" />
                    تحميل
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
