"use client"

import { useState } from "react"
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Edit,
  Eye,
  Trash2,
  Download,
  Tag,
  User,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Ticket {
  id: string
  title: string
  description: string
  category: 'technical' | 'billing' | 'shipping' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  createdAt: string
  updatedAt: string
  assignedTo?: string
  messages: number
  lastMessage: string
}

const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    title: "مشكلة في تتبع الشحنة",
    description: "لا يمكنني تتبع شحنتي رقم GH-2024-001",
    category: "shipping",
    priority: "high",
    status: "in_progress",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16",
    assignedTo: "أحمد محمد",
    messages: 5,
    lastMessage: "2024-01-16 14:30"
  },
  {
    id: "TKT-002",
    title: "استفسار عن الفاتورة",
    description: "أريد توضيحاً حول رسوم إضافية في الفاتورة",
    category: "billing",
    priority: "medium",
    status: "open",
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
    messages: 2,
    lastMessage: "2024-01-16 10:15"
  },
  {
    id: "TKT-003",
    title: "مشكلة في تسجيل الدخول",
    description: "لا يمكنني تسجيل الدخول إلى حسابي",
    category: "technical",
    priority: "urgent",
    status: "resolved",
    createdAt: "2024-01-14",
    updatedAt: "2024-01-15",
    assignedTo: "سارة أحمد",
    messages: 8,
    lastMessage: "2024-01-15 16:45"
  },
  {
    id: "TKT-004",
    title: "طلب تعديل العنوان",
    description: "أريد تغيير عنوان التسليم للشحنة القادمة",
    category: "shipping",
    priority: "low",
    status: "closed",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12",
    assignedTo: "محمد علي",
    messages: 3,
    lastMessage: "2024-01-12 09:20"
  },
  {
    id: "TKT-005",
    title: "استفسار عن الخصومات",
    description: "هل يمكنني الحصول على خصم للشحنات الكبيرة؟",
    category: "general",
    priority: "medium",
    status: "open",
    createdAt: "2024-01-17",
    updatedAt: "2024-01-17",
    messages: 1,
    lastMessage: "2024-01-17 11:00"
  }
]

export default function ClientTicketsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const getTicketStats = () => {
    const total = mockTickets.length
    const open = mockTickets.filter(t => t.status === 'open').length
    const inProgress = mockTickets.filter(t => t.status === 'in_progress').length
    const resolved = mockTickets.filter(t => t.status === 'resolved').length
    const closed = mockTickets.filter(t => t.status === 'closed').length

    return { total, open, inProgress, resolved, closed }
  }

  const stats = getTicketStats()

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Ticket['status']) => {
    switch (status) {
      case 'open': return 'مفتوح'
      case 'in_progress': return 'قيد المعالجة'
      case 'resolved': return 'تم الحل'
      case 'closed': return 'مغلق'
      default: return 'غير محدد'
    }
  }

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low': return 'منخفض'
      case 'medium': return 'متوسط'
      case 'high': return 'عالي'
      case 'urgent': return 'عاجل'
      default: return 'غير محدد'
    }
  }

  const getCategoryColor = (category: Ticket['category']) => {
    switch (category) {
      case 'technical': return 'bg-purple-100 text-purple-800'
      case 'billing': return 'bg-green-100 text-green-800'
      case 'shipping': return 'bg-blue-100 text-blue-800'
      case 'general': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryText = (category: Ticket['category']) => {
    switch (category) {
      case 'technical': return 'تقني'
      case 'billing': return 'فوترة'
      case 'shipping': return 'شحن'
      case 'general': return 'عام'
      default: return 'غير محدد'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تذاكر الدعم</h1>
          <p className="text-gray-600">إدارة تذاكر الدعم والاستفسارات</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="ml-2 h-4 w-4" />
          تذكرة جديدة
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التذاكر</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Ticket className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مفتوح</p>
                <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">قيد المعالجة</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">تم الحل</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مغلق</p>
                <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
              </div>
              <XCircle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في التذاكر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">جميع الحالات</option>
          <option value="open">مفتوح</option>
          <option value="in_progress">قيد المعالجة</option>
          <option value="resolved">تم الحل</option>
          <option value="closed">مغلق</option>
        </select>
        <select 
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">جميع الأولويات</option>
          <option value="low">منخفض</option>
          <option value="medium">متوسط</option>
          <option value="high">عالي</option>
          <option value="urgent">عاجل</option>
        </select>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">جميع الفئات</option>
          <option value="technical">تقني</option>
          <option value="billing">فوترة</option>
          <option value="shipping">شحن</option>
          <option value="general">عام</option>
        </select>
      </div>

      {/* Tickets */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">التذاكر</h2>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="open">مفتوح</TabsTrigger>
            <TabsTrigger value="in_progress">قيد المعالجة</TabsTrigger>
            <TabsTrigger value="resolved">تم الحل</TabsTrigger>
            <TabsTrigger value="closed">مغلق</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{ticket.title}</h3>
                          <Badge className={getStatusColor(ticket.status)}>
                            {getStatusText(ticket.status)}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {getPriorityText(ticket.priority)}
                          </Badge>
                          <Badge className={getCategoryColor(ticket.category)}>
                            {getCategoryText(ticket.category)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{ticket.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {ticket.id}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {ticket.createdAt}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {ticket.messages} رسالة
                          </div>
                          {ticket.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {ticket.assignedTo}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="open" className="space-y-4">
            <div className="space-y-4">
              {filteredTickets.filter(t => t.status === 'open').map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{ticket.title}</h3>
                          <Badge className={getStatusColor(ticket.status)}>
                            {getStatusText(ticket.status)}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {getPriorityText(ticket.priority)}
                          </Badge>
                          <Badge className={getCategoryColor(ticket.category)}>
                            {getCategoryText(ticket.category)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{ticket.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {ticket.id}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {ticket.createdAt}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {ticket.messages} رسالة
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-4">
            <div className="space-y-4">
              {filteredTickets.filter(t => t.status === 'in_progress').map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{ticket.title}</h3>
                          <Badge className={getStatusColor(ticket.status)}>
                            {getStatusText(ticket.status)}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {getPriorityText(ticket.priority)}
                          </Badge>
                          <Badge className={getCategoryColor(ticket.category)}>
                            {getCategoryText(ticket.category)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{ticket.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {ticket.id}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {ticket.createdAt}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {ticket.messages} رسالة
                          </div>
                          {ticket.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {ticket.assignedTo}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            <div className="space-y-4">
              {filteredTickets.filter(t => t.status === 'resolved').map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{ticket.title}</h3>
                          <Badge className={getStatusColor(ticket.status)}>
                            {getStatusText(ticket.status)}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {getPriorityText(ticket.priority)}
                          </Badge>
                          <Badge className={getCategoryColor(ticket.category)}>
                            {getCategoryText(ticket.category)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{ticket.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {ticket.id}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {ticket.updatedAt}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {ticket.messages} رسالة
                          </div>
                          {ticket.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {ticket.assignedTo}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="closed" className="space-y-4">
            <div className="space-y-4">
              {filteredTickets.filter(t => t.status === 'closed').map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{ticket.title}</h3>
                          <Badge className={getStatusColor(ticket.status)}>
                            {getStatusText(ticket.status)}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {getPriorityText(ticket.priority)}
                          </Badge>
                          <Badge className={getCategoryColor(ticket.category)}>
                            {getCategoryText(ticket.category)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{ticket.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {ticket.id}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {ticket.updatedAt}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {ticket.messages} رسالة
                          </div>
                          {ticket.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {ticket.assignedTo}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 