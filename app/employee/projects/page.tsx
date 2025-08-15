"use client"

import { useState } from "react"
import { 
  Folder, 
  Calendar, 
  Users, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Project {
  id: string
  name: string
  description: string
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent'
  progress: number
  startDate: string
  endDate: string
  budget: number
  spent: number
  manager: string
  team: string[]
  client: string
  category: string
  tags: string[]
  milestones: Milestone[]
  risks: Risk[]
}

interface Milestone {
  id: string
  title: string
  dueDate: string
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  progress: number
}

interface Risk {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  probability: 'low' | 'medium' | 'high'
  impact: string
  mitigation: string
  status: 'open' | 'mitigated' | 'closed'
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "تطوير نظام الشحن الذكي",
    description: "تطوير نظام متكامل لإدارة الشحنات من الصين إلى ليبيا",
    status: "active",
    priority: "high",
    progress: 65,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    budget: 50000,
    spent: 32500,
    manager: "أحمد محمد",
    team: ["سارة أحمد", "محمد علي", "فاطمة حسن"],
    client: "شركة الشحن العالمية",
    category: "تطوير البرمجيات",
    tags: ["تطوير", "شحن", "ذكي"],
    milestones: [
      {
        id: "m1",
        title: "تحليل المتطلبات",
        dueDate: "2024-02-15",
        status: "completed",
        progress: 100
      },
      {
        id: "m2",
        title: "تصميم النظام",
        dueDate: "2024-03-15",
        status: "completed",
        progress: 100
      },
      {
        id: "m3",
        title: "تطوير الواجهة الأمامية",
        dueDate: "2024-04-30",
        status: "in_progress",
        progress: 75
      },
      {
        id: "m4",
        title: "تطوير الخلفية",
        dueDate: "2024-05-15",
        status: "pending",
        progress: 0
      }
    ],
    risks: [
      {
        id: "r1",
        title: "تأخير في تسليم المكونات",
        severity: "medium",
        probability: "medium",
        impact: "تأخير المشروع أسبوعين",
        mitigation: "العمل مع موردين بديلين",
        status: "open"
      }
    ]
  },
  {
    id: "2",
    name: "تحسين عمليات التخليص الجمركي",
    description: "تحسين وتطوير إجراءات التخليص الجمركي لزيادة الكفاءة",
    status: "planning",
    priority: "medium",
    progress: 25,
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    budget: 30000,
    spent: 7500,
    manager: "فاطمة حسن",
    team: ["علي محمد", "نور الدين"],
    client: "إدارة الجمارك",
    category: "تحسين العمليات",
    tags: ["جمارك", "تحسين", "عمليات"],
    milestones: [
      {
        id: "m1",
        title: "دراسة الوضع الحالي",
        dueDate: "2024-03-31",
        status: "completed",
        progress: 100
      },
      {
        id: "m2",
        title: "تحديد نقاط التحسين",
        dueDate: "2024-04-30",
        status: "in_progress",
        progress: 50
      }
    ],
    risks: []
  },
  {
    id: "3",
    name: "توسيع شبكة الموردين في الصين",
    description: "توسيع شبكة الموردين والشركاء في الصين لتحسين الخدمات",
    status: "active",
    priority: "high",
    progress: 40,
    startDate: "2024-02-01",
    endDate: "2024-12-31",
    budget: 75000,
    spent: 30000,
    manager: "محمد علي",
    team: ["أحمد محمد", "سارة أحمد", "علي محمد"],
    client: "الشركة",
    category: "توسيع الأعمال",
    tags: ["موردين", "صين", "توسيع"],
    milestones: [
      {
        id: "m1",
        title: "تحديد الموردين المحتملين",
        dueDate: "2024-03-31",
        status: "completed",
        progress: 100
      },
      {
        id: "m2",
        title: "زيارة الموردين",
        dueDate: "2024-06-30",
        status: "in_progress",
        progress: 60
      }
    ],
    risks: [
      {
        id: "r1",
        title: "تغيرات في السياسات التجارية",
        severity: "high",
        probability: "low",
        impact: "تأخير في الاتفاقيات",
        mitigation: "متابعة التطورات السياسية",
        status: "open"
      }
    ]
  }
]

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'planning': return 'bg-blue-100 text-blue-800'
    case 'on_hold': return 'bg-yellow-100 text-yellow-800'
    case 'completed': return 'bg-gray-100 text-gray-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: Project['status']) => {
  switch (status) {
    case 'active': return 'نشط'
    case 'planning': return 'تخطيط'
    case 'on_hold': return 'معلق'
    case 'completed': return 'مكتمل'
    case 'cancelled': return 'ملغي'
    default: return status
  }
}

const getPriorityColor = (priority: Project['priority']) => {
  switch (priority) {
    case 'critical': return 'bg-red-100 text-red-800'
    case 'urgent': return 'bg-red-100 text-red-800'
    case 'high': return 'bg-orange-100 text-orange-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityText = (priority: Project['priority']) => {
  switch (priority) {
    case 'critical': return 'حرج'
    case 'urgent': return 'عاجل'
    case 'high': return 'عالي'
    case 'medium': return 'متوسط'
    case 'low': return 'منخفض'
    default: return priority
  }
}

export default function EmployeeProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getBudgetUtilization = (project: Project) => {
    return (project.spent / project.budget) * 100
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const today = new Date()
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المشاريع</h1>
          <p className="text-gray-600 mt-2">إدارة وتتبع جميع المشاريع المخصصة لك</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="ml-2 h-4 w-4" />
          مشروع جديد
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في المشاريع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="planning">تخطيط</option>
                <option value="active">نشط</option>
                <option value="on_hold">معلق</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الأولويات</option>
                <option value="low">منخفض</option>
                <option value="medium">متوسط</option>
                <option value="high">عالي</option>
                <option value="critical">حرج</option>
                <option value="urgent">عاجل</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="mt-2 text-gray-600">
                    {project.description}
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
                      <Edit className="ml-2 h-4 w-4" />
                      تعديل
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="ml-2 h-4 w-4" />
                      تصدير
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
                <Badge className={getStatusColor(project.status)}>
                  {getStatusText(project.status)}
                </Badge>
                <Badge className={getPriorityColor(project.priority)}>
                  {getPriorityText(project.priority)}
                </Badge>
                <Badge variant="outline">
                  {project.category}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>التقدم</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Budget */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>الميزانية</span>
                  <span>{getBudgetUtilization(project).toFixed(1)}% مستخدم</span>
                </div>
                <Progress 
                  value={getBudgetUtilization(project)} 
                  className="h-2"
                  style={{
                    backgroundColor: getBudgetUtilization(project) > 80 ? '#fef2f2' : undefined
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {project.spent.toLocaleString()} / {project.budget.toLocaleString()} دينار
                </div>
              </div>

              {/* Project Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">المدير:</span>
                  <div className="font-medium">{project.manager}</div>
                </div>
                <div>
                  <span className="text-gray-500">العميل:</span>
                  <div className="font-medium">{project.client}</div>
                </div>
                <div>
                  <span className="text-gray-500">تاريخ البداية:</span>
                  <div className="font-medium">{new Date(project.startDate).toLocaleDateString('ar-SA')}</div>
                </div>
                <div>
                  <span className="text-gray-500">تاريخ الانتهاء:</span>
                  <div className="font-medium">{new Date(project.endDate).toLocaleDateString('ar-SA')}</div>
                </div>
              </div>

              {/* Team */}
              <div>
                <span className="text-gray-500 text-sm">الفريق:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.team.slice(0, 3).map((member, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {member}
                    </Badge>
                  ))}
                  {project.team.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.team.length - 3} آخرين
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedProject(project)}
                >
                  <Eye className="ml-1 h-4 w-4" />
                  التفاصيل
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="ml-1 h-4 w-4" />
                  تعديل
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedProject(null)}
                >
                  ✕
                </Button>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                  <TabsTrigger value="milestones">المراحل</TabsTrigger>
                  <TabsTrigger value="risks">المخاطر</TabsTrigger>
                  <TabsTrigger value="team">الفريق</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">معلومات المشروع</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <span className="text-gray-500">الوصف:</span>
                          <p className="mt-1">{selectedProject.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-500">الحالة:</span>
                            <Badge className={cn("mt-1", getStatusColor(selectedProject.status))}>
                              {getStatusText(selectedProject.status)}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-gray-500">الأولوية:</span>
                            <Badge className={cn("mt-1", getPriorityColor(selectedProject.priority))}>
                              {getPriorityText(selectedProject.priority)}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-500">تاريخ البداية:</span>
                            <div className="font-medium">{new Date(selectedProject.startDate).toLocaleDateString('ar-SA')}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">تاريخ الانتهاء:</span>
                            <div className="font-medium">{new Date(selectedProject.endDate).toLocaleDateString('ar-SA')}</div>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">الأيام المتبقية:</span>
                          <div className="font-medium text-lg">
                            {getDaysRemaining(selectedProject.endDate)} يوم
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">التقدم والميزانية</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>التقدم العام</span>
                            <span>{selectedProject.progress}%</span>
                          </div>
                          <Progress value={selectedProject.progress} className="h-3" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>استخدام الميزانية</span>
                            <span>{getBudgetUtilization(selectedProject).toFixed(1)}%</span>
                          </div>
                          <Progress 
                            value={getBudgetUtilization(selectedProject)} 
                            className="h-3"
                          />
                          <div className="text-sm text-gray-500 mt-1">
                            {selectedProject.spent.toLocaleString()} / {selectedProject.budget.toLocaleString()} دينار
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="milestones" className="space-y-4">
                  <div className="space-y-4">
                    {selectedProject.milestones.map((milestone) => (
                      <Card key={milestone.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{milestone.title}</h4>
                              <p className="text-sm text-gray-500">
                                تاريخ الاستحقاق: {new Date(milestone.dueDate).toLocaleDateString('ar-SA')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={cn(
                                milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                                milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                milestone.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              )}>
                                {milestone.status === 'completed' ? 'مكتمل' :
                                 milestone.status === 'in_progress' ? 'قيد التنفيذ' :
                                 milestone.status === 'overdue' ? 'متأخر' : 'في الانتظار'}
                              </Badge>
                              <span className="text-sm text-gray-500">{milestone.progress}%</span>
                            </div>
                          </div>
                          <Progress value={milestone.progress} className="mt-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="risks" className="space-y-4">
                  {selectedProject.risks.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center text-gray-500">
                        لا توجد مخاطر مسجلة لهذا المشروع
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {selectedProject.risks.map((risk) => (
                        <Card key={risk.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{risk.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{risk.impact}</p>
                                <p className="text-sm text-gray-500 mt-1">التخفيف: {risk.mitigation}</p>
                              </div>
                              <div className="flex flex-col gap-1">
                                <Badge className={cn(
                                  risk.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                  risk.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                  risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                )}>
                                  {risk.severity === 'critical' ? 'حرج' :
                                   risk.severity === 'high' ? 'عالي' :
                                   risk.severity === 'medium' ? 'متوسط' : 'منخفض'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  احتمال {risk.probability === 'high' ? 'عالي' :
                                           risk.probability === 'medium' ? 'متوسط' : 'منخفض'}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="team" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">أعضاء الفريق</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedProject.team.map((member, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">{member}</div>
                                <div className="text-sm text-gray-500">عضو فريق</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="ml-1 h-4 w-4" />
                              مراسلة
                            </Button>
                          </div>
                        ))}
                      </div>
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