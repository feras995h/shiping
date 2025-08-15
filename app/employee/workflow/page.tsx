"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp, Clock, User, CheckCircle, AlertCircle, 
  Filter, Search, Plus, Edit, Eye, ArrowRight, Calendar,
  FileText, Package, Ship, Target, Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { AdvancedWorkflow, type WorkflowStep } from "@/components/shared/advanced-workflow"

interface Workflow {
  id: string
  title: string
  description: string
  type: 'shipment' | 'customs' | 'documentation' | 'quality_check' | 'delivery' | 'billing'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee: string
  createdBy: string
  createdAt: string
  dueDate: string
  completedAt?: string
  progress: number
  steps: WorkflowStep[]
  tags: string[]
  attachments: string[]
  notes: string[]
  estimatedDuration: number
  actualDuration?: number
  dependencies: string[]
  relatedShipments: string[]
}

export default function EmployeeWorkflowPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [filteredWorkflows, setFilteredWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  // محاكاة جلب البيانات من API
  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockWorkflows: Workflow[] = [
          {
            id: "WF-001",
            title: "معالجة الشحنة GH-2025-010",
            description: "معالجة شاملة للشحنة من الصين إلى ليبيا",
            type: "shipment",
            status: "in_progress",
            priority: "high",
            assignee: "أحمد محمد",
            createdBy: "مدير العمليات",
            createdAt: "2024-01-10T09:00:00Z",
            dueDate: "2024-01-25T17:00:00Z",
            progress: 65,
            estimatedDuration: 120,
            actualDuration: 78,
            dependencies: [],
            relatedShipments: ["GH-2025-010"],
            tags: ["حاويات", "شنغهاي", "طرابلس"],
            attachments: ["shipping_docs.pdf", "customs_declaration.pdf"],
            notes: [
              "الشحنة وصلت إلى ميناء طرابلس",
              "في انتظار إتمام إجراءات الجمارك"
            ],
            steps: [
              {
                id: "step-1",
                title: "استلام الشحنة",
                description: "استلام الشحنة من الميناء",
                status: "completed",
                completedAt: "2024-01-12T10:30:00Z",
                estimatedDuration: 60,
                actualDuration: 45,
                assignee: "أحمد محمد",
                priority: "high"
              },
              {
                id: "step-2",
                title: "فحص المستندات",
                description: "فحص ومراجعة جميع المستندات المطلوبة",
                status: "completed",
                completedAt: "2024-01-13T14:20:00Z",
                estimatedDuration: 120,
                actualDuration: 90,
                assignee: "أحمد محمد",
                priority: "high"
              },
              {
                id: "step-3",
                title: "التخليص الجمركي",
                description: "إتمام إجراءات التخليص الجمركي",
                status: "in_progress",
                startedAt: "2024-01-15T09:00:00Z",
                estimatedDuration: 240,
                assignee: "أحمد محمد",
                priority: "urgent",
                dependencies: ["step-1", "step-2"]
              },
              {
                id: "step-4",
                title: "فحص الجودة",
                description: "فحص جودة البضائع المستلمة",
                status: "pending",
                estimatedDuration: 180,
                assignee: "أحمد محمد",
                priority: "medium",
                dependencies: ["step-3"]
              },
              {
                id: "step-5",
                title: "التسليم للعميل",
                description: "تسليم البضائع للعميل النهائي",
                status: "pending",
                estimatedDuration: 120,
                assignee: "أحمد محمد",
                priority: "high",
                dependencies: ["step-4"]
              }
            ]
          },
          {
            id: "WF-002",
            title: "معالجة الشحنة GH-2025-011",
            description: "معالجة شحنة الإلكترونيات من قوانغتشو",
            type: "shipment",
            status: "pending",
            priority: "medium",
            assignee: "أحمد محمد",
            createdBy: "مدير الشحن",
            createdAt: "2024-01-14T08:00:00Z",
            dueDate: "2024-01-30T17:00:00Z",
            progress: 0,
            estimatedDuration: 96,
            dependencies: ["WF-001"],
            relatedShipments: ["GH-2025-011"],
            tags: ["إلكترونيات", "قوانغتشو", "طرابلس"],
            attachments: ["electronics_specs.pdf"],
            notes: ["في انتظار وصول الشحنة إلى الميناء"],
            steps: [
              {
                id: "step-1",
                title: "تتبع الشحنة",
                description: "تتبع موقع الشحنة أثناء النقل",
                status: "in_progress",
                startedAt: "2024-01-14T08:00:00Z",
                estimatedDuration: 1440,
                assignee: "أحمد محمد",
                priority: "medium"
              },
              {
                id: "step-2",
                title: "استلام الشحنة",
                description: "استلام الشحنة من الميناء",
                status: "pending",
                estimatedDuration: 60,
                assignee: "أحمد محمد",
                priority: "high",
                dependencies: ["step-1"]
              },
              {
                id: "step-3",
                title: "التخليص الجمركي",
                description: "إتمام إجراءات التخليص الجمركي",
                status: "pending",
                estimatedDuration: 240,
                assignee: "أحمد محمد",
                priority: "high",
                dependencies: ["step-2"]
              },
              {
                id: "step-4",
                title: "فحص الجودة",
                description: "فحص جودة الأجهزة الإلكترونية",
                status: "pending",
                estimatedDuration: 180,
                assignee: "أحمد محمد",
                priority: "high",
                dependencies: ["step-3"]
              },
              {
                id: "step-5",
                title: "التسليم للعميل",
                description: "تسليم الأجهزة للعميل",
                status: "pending",
                estimatedDuration: 120,
                assignee: "أحمد محمد",
                priority: "medium",
                dependencies: ["step-4"]
              }
            ]
          },
          {
            id: "WF-003",
            title: "معالجة الشحنة GH-2025-009",
            description: "معالجة شحنة الملابس من شنغهاي",
            type: "shipment",
            status: "completed",
            priority: "low",
            assignee: "أحمد محمد",
            createdBy: "مدير العمليات",
            createdAt: "2024-01-05T09:00:00Z",
            dueDate: "2024-01-15T17:00:00Z",
            completedAt: "2024-01-14T16:30:00Z",
            progress: 100,
            estimatedDuration: 168,
            actualDuration: 144,
            dependencies: [],
            relatedShipments: ["GH-2025-009"],
            tags: ["ملابس", "شنغهاي", "طرابلس"],
            attachments: ["clothing_invoice.pdf", "delivery_receipt.pdf"],
            notes: [
              "تم تسليم الشحنة بنجاح",
              "العميل راضٍ عن الخدمة"
            ],
            steps: [
              {
                id: "step-1",
                title: "استلام الشحنة",
                description: "استلام الشحنة من الميناء",
                status: "completed",
                completedAt: "2024-01-08T11:00:00Z",
                estimatedDuration: 60,
                actualDuration: 45,
                assignee: "أحمد محمد",
                priority: "medium"
              },
              {
                id: "step-2",
                title: "فحص المستندات",
                description: "فحص ومراجعة جميع المستندات",
                status: "completed",
                completedAt: "2024-01-09T15:30:00Z",
                estimatedDuration: 120,
                actualDuration: 90,
                assignee: "أحمد محمد",
                priority: "medium"
              },
              {
                id: "step-3",
                title: "التخليص الجمركي",
                description: "إتمام إجراءات التخليص الجمركي",
                status: "completed",
                completedAt: "2024-01-11T12:00:00Z",
                estimatedDuration: 240,
                actualDuration: 180,
                assignee: "أحمد محمد",
                priority: "medium"
              },
              {
                id: "step-4",
                title: "فحص الجودة",
                description: "فحص جودة الملابس",
                status: "completed",
                completedAt: "2024-01-12T16:00:00Z",
                estimatedDuration: 180,
                actualDuration: 150,
                assignee: "أحمد محمد",
                priority: "medium"
              },
              {
                id: "step-5",
                title: "التسليم للعميل",
                description: "تسليم الملابس للعميل",
                status: "completed",
                completedAt: "2024-01-14T14:30:00Z",
                estimatedDuration: 120,
                actualDuration: 90,
                assignee: "أحمد محمد",
                priority: "medium"
              }
            ]
          }
        ]
        
        setWorkflows(mockWorkflows)
        setFilteredWorkflows(mockWorkflows)
      } catch (error) {
        console.error("خطأ في جلب سير العمل:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkflows()
  }, [])

  // تصفية سير العمل
  useEffect(() => {
    let filtered = workflows

    if (searchTerm) {
      filtered = filtered.filter(workflow =>
        workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(workflow => workflow.type === typeFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(workflow => workflow.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(workflow => workflow.priority === priorityFilter)
    }

    setFilteredWorkflows(filtered)
  }, [workflows, searchTerm, typeFilter, statusFilter, priorityFilter])

  const getStatusColor = (status: Workflow['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'on_hold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Workflow['status']) => {
    switch (status) {
      case 'completed': return 'مكتمل'
      case 'in_progress': return 'قيد التنفيذ'
      case 'pending': return 'في الانتظار'
      case 'cancelled': return 'ملغي'
      case 'on_hold': return 'معلق'
      default: return 'غير محدد'
    }
  }

  const getTypeColor = (type: Workflow['type']) => {
    switch (type) {
      case 'shipment': return 'bg-blue-100 text-blue-800'
      case 'customs': return 'bg-orange-100 text-orange-800'
      case 'documentation': return 'bg-purple-100 text-purple-800'
      case 'quality_check': return 'bg-green-100 text-green-800'
      case 'delivery': return 'bg-cyan-100 text-cyan-800'
      case 'billing': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: Workflow['type']) => {
    switch (type) {
      case 'shipment': return 'شحنة'
      case 'customs': return 'جمارك'
      case 'documentation': return 'مستندات'
      case 'quality_check': return 'فحص الجودة'
      case 'delivery': return 'تسليم'
      case 'billing': return 'فوترة'
      default: return 'سير عمل'
    }
  }

  const getPriorityColor = (priority: Workflow['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: Workflow['priority']) => {
    switch (priority) {
      case 'urgent': return 'عاجل'
      case 'high': return 'عالية'
      case 'medium': return 'متوسطة'
      case 'low': return 'منخفضة'
      default: return 'غير محدد'
    }
  }

  const handleWorkflowClick = (workflow: Workflow) => {
    setSelectedWorkflow(workflow)
  }

  const handleStepStatusChange = async (workflowId: string, stepId: string, status: WorkflowStep['status']) => {
    try {
      // محاكاة تحديث API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setWorkflows(prev => prev.map(workflow =>
        workflow.id === workflowId
          ? {
              ...workflow,
              steps: workflow.steps.map(step =>
                step.id === stepId
                  ? { 
                      ...step, 
                      status,
                      completedAt: status === 'completed' ? new Date().toISOString() : undefined,
                      startedAt: status === 'in_progress' && !step.startedAt ? new Date().toISOString() : step.startedAt
                    }
                  : step
              ),
              progress: workflow.steps.length > 0 
                ? Math.round((workflow.steps.filter(s => s.status === 'completed').length / workflow.steps.length) * 100)
                : 0
            }
          : workflow
      ))
    } catch (error) {
      console.error("خطأ في تحديث حالة الخطوة:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-950 dark:to-amber-900/10" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري تحميل سير العمل...</p>
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
            سير العمل
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة وتتبع سير العمل والمهام المعقدة
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
                    placeholder="ابحث في سير العمل..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  النوع
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="جميع الأنواع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="shipment">شحنة</SelectItem>
                    <SelectItem value="customs">جمارك</SelectItem>
                    <SelectItem value="documentation">مستندات</SelectItem>
                    <SelectItem value="quality_check">فحص الجودة</SelectItem>
                    <SelectItem value="delivery">تسليم</SelectItem>
                    <SelectItem value="billing">فوترة</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="cancelled">ملغي</SelectItem>
                    <SelectItem value="on_hold">معلق</SelectItem>
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

              <div className="flex items-end">
                <Button className="w-full">
                  <Plus className="h-4 w-4 ml-2" />
                  سير عمل جديد
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي سير العمل</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{workflows.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">قيد التنفيذ</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {workflows.filter(w => w.status === 'in_progress').length}
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
                    {workflows.filter(w => w.status === 'completed').length}
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">متوسط التقدم</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(workflows.reduce((acc, w) => acc + w.progress, 0) / workflows.length)}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflows List and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflows List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>قائمة سير العمل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredWorkflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedWorkflow?.id === workflow.id 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => handleWorkflowClick(workflow)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {workflow.title}
                        </h3>
                        <Badge className={getStatusColor(workflow.status)}>
                          {getStatusText(workflow.status)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {workflow.description}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getTypeColor(workflow.type)}>
                          {getTypeText(workflow.type)}
                        </Badge>
                        <Badge className={getPriorityColor(workflow.priority)}>
                          {getPriorityText(workflow.priority)}
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">التقدم</span>
                          <span className="text-xs text-gray-500">{workflow.progress}%</span>
                        </div>
                        <Progress value={workflow.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>الموعد النهائي: {new Date(workflow.dueDate).toLocaleDateString('ar-SA')}</span>
                        <span>{workflow.assignee}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Details */}
          <div className="lg:col-span-2">
            {selectedWorkflow ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedWorkflow.title}</CardTitle>
                      <CardDescription>{selectedWorkflow.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(selectedWorkflow.status)}>
                        {getStatusText(selectedWorkflow.status)}
                      </Badge>
                      <Badge className={getPriorityColor(selectedWorkflow.priority)}>
                        {getPriorityText(selectedWorkflow.priority)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="workflow" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="workflow">سير العمل</TabsTrigger>
                      <TabsTrigger value="details">التفاصيل</TabsTrigger>
                      <TabsTrigger value="notes">الملاحظات</TabsTrigger>
                    </TabsList>

                    <TabsContent value="workflow" className="space-y-6">
                      <AdvancedWorkflow
                        steps={selectedWorkflow.steps}
                        currentStep={selectedWorkflow.steps.find(s => s.status === 'in_progress')?.id || selectedWorkflow.steps[0]?.id}
                        showProgress={true}
                        showTimeline={true}
                        showActions={true}
                        onStepClick={(stepId) => {
                  // معالجة النقر على الخطوة
                  setCurrentStep(stepId)
                }}
                        onStatusChange={(stepId, status) => handleStepStatusChange(selectedWorkflow.id, stepId, status)}
                      />
                    </TabsContent>

                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">معلومات عامة</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">المسؤول:</span>
                              <span>{selectedWorkflow.assignee}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">أنشئ بواسطة:</span>
                              <span>{selectedWorkflow.createdBy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">تاريخ الإنشاء:</span>
                              <span>{new Date(selectedWorkflow.createdAt).toLocaleDateString('ar-SA')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">الموعد النهائي:</span>
                              <span>{new Date(selectedWorkflow.dueDate).toLocaleDateString('ar-SA')}</span>
                            </div>
                            {selectedWorkflow.completedAt && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">تاريخ الإكمال:</span>
                                <span>{new Date(selectedWorkflow.completedAt).toLocaleDateString('ar-SA')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">الإحصائيات</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">الوقت المتوقع:</span>
                              <span>{selectedWorkflow.estimatedDuration} ساعة</span>
                            </div>
                            {selectedWorkflow.actualDuration && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">الوقت الفعلي:</span>
                                <span>{selectedWorkflow.actualDuration} ساعة</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-500">عدد الخطوات:</span>
                              <span>{selectedWorkflow.steps.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">الخطوات المكتملة:</span>
                              <span>{selectedWorkflow.steps.filter(s => s.status === 'completed').length}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">العلامات</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedWorkflow.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">المرفقات</h4>
                        <div className="space-y-2">
                          {selectedWorkflow.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{attachment}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="notes" className="space-y-4">
                      <div className="space-y-3">
                        {selectedWorkflow.notes.map((note, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm">{note}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12">
                  <div className="text-center text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>اختر سير عمل لعرض التفاصيل</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 