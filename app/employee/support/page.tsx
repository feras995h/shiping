"use client"

import { useState } from "react"
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Clock4,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  FileText,
  User,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface SupportTicket {
  id: string
  title: string
  description: string
  category: 'technical' | 'billing' | 'shipping' | 'customs' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed'
  customerName: string
  customerEmail: string
  customerPhone: string
  assignedTo: string
  createdAt: string
  updatedAt: string
  dueDate: string
  attachments: string[]
  messages: SupportMessage[]
  tags: string[]
}

interface SupportMessage {
  id: string
  sender: string
  senderType: 'customer' | 'agent' | 'system'
  content: string
  timestamp: string
  attachments: string[]
}

const mockTickets: SupportTicket[] = [
  {
    id: "1",
    title: "مشكلة في تتبع الشحنة",
    description: "لا يمكنني تتبع شحنتي عبر الرابط المرفق، يظهر خطأ في النظام",
    category: "technical",
    priority: "high",
    status: "in_progress",
    customerName: "علي محمد",
    customerEmail: "ali.mohamed@email.com",
    customerPhone: "+218 91 234 5678",
    assignedTo: "سارة أحمد",
    createdAt: "2024-01-22",
    updatedAt: "2024-01-23",
    dueDate: "2024-01-25",
    attachments: ["screenshot.png"],
    messages: [
      {
        id: "m1",
        sender: "علي محمد",
        senderType: "customer",
        content: "مرحباً، لدي مشكلة في تتبع شحنتي رقم TRK123456",
        timestamp: "2024-01-22 10:30",
        attachments: []
      },
      {
        id: "m2",
        sender: "سارة أحمد",
        senderType: "agent",
        content: "مرحباً علي، شكراً لتواصلك معنا. سنقوم بفحص المشكلة وإعلامك بالنتيجة",
        timestamp: "2024-01-22 11:15",
        attachments: []
      }
    ],
    tags: ["تتبع", "خطأ تقني"]
  },
  {
    id: "2",
    title: "استفسار عن رسوم التخليص الجمركي",
    description: "أريد معرفة الرسوم المفروضة على شحنتي والوثائق المطلوبة",
    category: "customs",
    priority: "medium",
    status: "open",
    customerName: "فاطمة حسن",
    customerEmail: "fatima.hassan@email.com",
    customerPhone: "+218 92 345 6789",
    assignedTo: "محمد علي",
    createdAt: "2024-01-23",
    updatedAt: "2024-01-23",
    dueDate: "2024-01-26",
    attachments: ["invoice.pdf"],
    messages: [
      {
        id: "m1",
        sender: "فاطمة حسن",
        senderType: "customer",
        content: "مرحباً، أريد معرفة رسوم التخليص الجمركي لشحنتي",
        timestamp: "2024-01-23 09:45",
        attachments: ["invoice.pdf"]
      }
    ],
    tags: ["جمرك", "رسوم"]
  },
  {
    id: "3",
    title: "تأخير في وصول الشحنة",
    description: "شحنتي متأخرة عن الموعد المحدد، أريد معرفة السبب والموعد الجديد",
    category: "shipping",
    priority: "urgent",
    status: "waiting_customer",
    customerName: "أحمد الشريف",
    customerEmail: "ahmed.sharif@email.com",
    customerPhone: "+218 93 456 7890",
    assignedTo: "سارة أحمد",
    createdAt: "2024-01-21",
    updatedAt: "2024-01-23",
    dueDate: "2024-01-24",
    attachments: ["tracking_info.pdf"],
    messages: [
      {
        id: "m1",
        sender: "أحمد الشريف",
        senderType: "customer",
        content: "شحنتي متأخرة، أريد معرفة السبب",
        timestamp: "2024-01-21 14:20",
        attachments: []
      },
      {
        id: "m2",
        sender: "سارة أحمد",
        senderType: "agent",
        content: "مرحباً أحمد، نعتذر عن التأخير. الشحنة تأخرت بسبب ظروف جوية في الميناء",
        timestamp: "2024-01-22 10:15",
        attachments: []
      },
      {
        id: "m3",
        sender: "سارة أحمد",
        senderType: "agent",
        content: "الموعد الجديد للوصول هو 25 يناير. هل هذا مناسب لك؟",
        timestamp: "2024-01-23 09:30",
        attachments: []
      }
    ],
    tags: ["تأخير", "شحن"]
  }
]

const getStatusColor = (status: SupportTicket['status']) => {
  switch (status) {
    case 'open': return 'bg-blue-100 text-blue-800'
    case 'in_progress': return 'bg-yellow-100 text-yellow-800'
    case 'waiting_customer': return 'bg-purple-100 text-purple-800'
    case 'resolved': return 'bg-green-100 text-green-800'
    case 'closed': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: SupportTicket['status']) => {
  switch (status) {
    case 'open': return 'مفتوح'
    case 'in_progress': return 'قيد المعالجة'
    case 'waiting_customer': return 'في انتظار العميل'
    case 'resolved': return 'محلول'
    case 'closed': return 'مغلق'
    default: return 'غير محدد'
  }
}

const getPriorityColor = (priority: SupportTicket['priority']) => {
  switch (priority) {
    case 'low': return 'bg-green-100 text-green-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'high': return 'bg-orange-100 text-orange-800'
    case 'urgent': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityText = (priority: SupportTicket['priority']) => {
  switch (priority) {
    case 'low': return 'منخفضة'
    case 'medium': return 'متوسطة'
    case 'high': return 'عالية'
    case 'urgent': return 'عاجلة'
    default: return 'غير محدد'
  }
}

const getCategoryText = (category: SupportTicket['category']) => {
  switch (category) {
    case 'technical': return 'تقني'
    case 'billing': return 'فواتير'
    case 'shipping': return 'شحن'
    case 'customs': return 'جمرك'
    case 'general': return 'عام'
    default: return 'غير محدد'
  }
}

export default function EmployeeSupportPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [newMessage, setNewMessage] = useState("")

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const handleSendMessage = () => {
    if (!selectedTicket || !newMessage.trim()) return
    
    const message: SupportMessage = {
      id: `m${Date.now()}`,
      sender: "سارة أحمد",
      senderType: "agent",
      content: newMessage,
      timestamp: new Date().toLocaleString('ar-SA'),
      attachments: []
    }
    
    selectedTicket.messages.push(message)
    selectedTicket.updatedAt = new Date().toISOString().split('T')[0]
    setNewMessage("")
  }

  const getTicketStats = () => {
    const total = mockTickets.length
    const open = mockTickets.filter(t => t.status === 'open').length
    const inProgress = mockTickets.filter(t => t.status === 'in_progress').length
    const resolved = mockTickets.filter(t => t.status === 'resolved').length
    const urgent = mockTickets.filter(t => t.priority === 'urgent').length

    return { total, open, inProgress, resolved, urgent }
  }

  const stats = getTicketStats()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الدعم الفني</h1>
          <p className="text-gray-600">إدارة تذاكر الدعم الفني ومساعدة العملاء</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="ml-2 h-4 w-4" />
          تذكرة جديدة
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التذاكر</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مفتوحة</p>
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
                <p className="text-sm font-medium text-gray-600">محلولة</p>
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
                <p className="text-sm font-medium text-gray-600">عاجلة</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <Clock4 className="h-8 w-8 text-red-600" />
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="ml-2 h-4 w-4" />
              الحالة
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>الكل</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("open")}>مفتوح</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("in_progress")}>قيد المعالجة</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("waiting_customer")}>في انتظار العميل</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>محلول</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("closed")}>مغلق</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="ml-2 h-4 w-4" />
              الأولوية
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setPriorityFilter("all")}>الكل</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriorityFilter("low")}>منخفضة</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>متوسطة</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriorityFilter("high")}>عالية</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriorityFilter("urgent")}>عاجلة</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="ml-2 h-4 w-4" />
              الفئة
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setCategoryFilter("all")}>الكل</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryFilter("technical")}>تقني</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryFilter("billing")}>فواتير</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryFilter("shipping")}>شحن</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryFilter("customs")}>جمرك</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryFilter("general")}>عام</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedTicket(ticket)}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{ticket.title}</h3>
                    <Badge className={getStatusColor(ticket.status)}>
                      {getStatusText(ticket.status)}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {getPriorityText(ticket.priority)}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{ticket.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {ticket.customerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {ticket.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <HelpCircle className="h-4 w-4" />
                      {getCategoryText(ticket.category)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {ticket.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Eye className="ml-2 h-4 w-4" />
                      عرض التفاصيل
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="ml-2 h-4 w-4" />
                      تعديل
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="ml-2 h-4 w-4" />
                      الرد
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedTicket.title}</CardTitle>
                  <CardDescription>تذكرة #{selectedTicket.id}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">العميل</label>
                  <p className="text-sm text-gray-600">{selectedTicket.customerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                  <p className="text-sm text-gray-600">{selectedTicket.customerEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">الهاتف</label>
                  <p className="text-sm text-gray-600">{selectedTicket.customerPhone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">المسؤول</label>
                  <p className="text-sm text-gray-600">{selectedTicket.assignedTo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">الحالة</label>
                  <Badge className={getStatusColor(selectedTicket.status)}>
                    {getStatusText(selectedTicket.status)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">الأولوية</label>
                  <Badge className={getPriorityColor(selectedTicket.priority)}>
                    {getPriorityText(selectedTicket.priority)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">الفئة</label>
                  <p className="text-sm text-gray-600">{getCategoryText(selectedTicket.category)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">تاريخ الاستحقاق</label>
                  <p className="text-sm text-gray-600">{selectedTicket.dueDate}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">الوصف</label>
                <p className="text-sm text-gray-600 mt-1">{selectedTicket.description}</p>
              </div>
              {selectedTicket.attachments.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">المرفقات</label>
                  <div className="flex gap-2 mt-2">
                    {selectedTicket.attachments.map((attachment, index) => (
                      <Button key={index} variant="outline" size="sm">
                        <FileText className="ml-2 h-4 w-4" />
                        {attachment}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">الرسائل</label>
                <div className="space-y-4 mt-2 max-h-60 overflow-y-auto">
                  {selectedTicket.messages.map((message) => (
                    <div key={message.id} className={cn(
                      "p-3 rounded-lg",
                      message.senderType === 'customer' ? "bg-blue-50" : "bg-gray-50"
                    )}>
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">{message.sender}</span>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{message.content}</p>
                      {message.attachments.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {message.attachments.map((attachment, index) => (
                            <Button key={index} variant="outline" size="sm">
                              <FileText className="ml-2 h-4 w-4" />
                              {attachment}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">إضافة رد</label>
                <Textarea
                  placeholder="اكتب ردك هنا..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <MessageSquare className="ml-2 h-4 w-4" />
                    إرسال الرد
                  </Button>
                  <Button variant="outline">
                    <FileText className="ml-2 h-4 w-4" />
                    إرفاق ملف
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 