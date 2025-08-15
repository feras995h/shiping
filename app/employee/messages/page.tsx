"use client"

import { useState } from "react"
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  MoreHorizontal,
  Reply,
  Forward,
  Trash2,
  Archive,
  Star,
  User,
  Clock,
  Paperclip,
  Smile
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  sender: string
  senderId: string
  recipient: string
  recipientId: string
  subject: string
  content: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
  isArchived: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'work' | 'personal' | 'system' | 'notification'
  attachments: Attachment[]
  replies: Message[]
}

interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "فاطمة حسن",
    senderId: "mgr001",
    recipient: "أحمد محمد",
    recipientId: "emp001",
    subject: "تحديث مهم بشأن مشروع الشحن",
    content: "مرحباً أحمد، أود إعلامك بتحديث مهم بشأن مشروع تطوير نظام الشحن. يرجى مراجعة المستندات المرفقة والرد في أقرب وقت ممكن.",
    timestamp: "2024-03-31T10:30:00Z",
    isRead: false,
    isStarred: true,
    isArchived: false,
    priority: "high",
    category: "work",
    attachments: [
      {
        id: "att1",
        name: "مستندات_المشروع.pdf",
        size: 2048576,
        type: "pdf",
        url: "#"
      }
    ],
    replies: []
  },
  {
    id: "2",
    sender: "نظام الشركة",
    senderId: "system",
    recipient: "أحمد محمد",
    recipientId: "emp001",
    subject: "تذكير: تقييم الأداء الشهري",
    content: "تذكير: موعد تقييم الأداء الشهري غداً في الساعة 10:00 صباحاً. يرجى التأكد من إعداد التقارير المطلوبة.",
    timestamp: "2024-03-30T15:45:00Z",
    isRead: true,
    isStarred: false,
    isArchived: false,
    priority: "medium",
    category: "notification",
    attachments: [],
    replies: []
  },
  {
    id: "3",
    sender: "محمد علي",
    senderId: "emp003",
    recipient: "أحمد محمد",
    recipientId: "emp001",
    subject: "استفسار حول التخليص الجمركي",
    content: "أهلاً أحمد، لدي استفسار حول إجراءات التخليص الجمركي للشحنة الجديدة. هل يمكنك مساعدتي؟",
    timestamp: "2024-03-30T09:15:00Z",
    isRead: true,
    isStarred: false,
    isArchived: false,
    priority: "low",
    category: "work",
    attachments: [],
    replies: [
      {
        id: "reply1",
        sender: "أحمد محمد",
        senderId: "emp001",
        recipient: "محمد علي",
        recipientId: "emp003",
        subject: "رد: استفسار حول التخليص الجمركي",
        content: "بالطبع محمد، سأقوم بمساعدتك. دعني أرسل لك المستندات المطلوبة.",
        timestamp: "2024-03-30T11:30:00Z",
        isRead: true,
        isStarred: false,
        isArchived: false,
        priority: "low",
        category: "work",
        attachments: [],
        replies: []
      }
    ]
  },
  {
    id: "4",
    sender: "سارة أحمد",
    senderId: "emp002",
    recipient: "أحمد محمد",
    recipientId: "emp001",
    subject: "اجتماع فريق العمل",
    content: "أهلاً أحمد، نود دعوتك لحضور اجتماع فريق العمل غداً في الساعة 2:00 مساءً لمناقشة التقدم في المشاريع الحالية.",
    timestamp: "2024-03-29T16:20:00Z",
    isRead: true,
    isStarred: false,
    isArchived: true,
    priority: "medium",
    category: "work",
    attachments: [],
    replies: []
  }
]

const getPriorityColor = (priority: Message['priority']) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-800'
    case 'high': return 'bg-orange-100 text-orange-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityText = (priority: Message['priority']) => {
  switch (priority) {
    case 'urgent': return 'عاجل'
    case 'high': return 'عالي'
    case 'medium': return 'متوسط'
    case 'low': return 'منخفض'
    default: return priority
  }
}

const getCategoryColor = (category: Message['category']) => {
  switch (category) {
    case 'work': return 'bg-blue-100 text-blue-800'
    case 'personal': return 'bg-purple-100 text-purple-800'
    case 'system': return 'bg-gray-100 text-gray-800'
    case 'notification': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getCategoryText = (category: Message['category']) => {
  switch (category) {
    case 'work': return 'عمل'
    case 'personal': return 'شخصي'
    case 'system': return 'نظام'
    case 'notification': return 'إشعار'
    default: return category
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function EmployeeMessagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [activeTab, setActiveTab] = useState("inbox")

  const filteredMessages = mockMessages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === "inbox") return matchesSearch && !message.isArchived
    if (activeTab === "starred") return matchesSearch && message.isStarred
    if (activeTab === "archived") return matchesSearch && message.isArchived
    if (activeTab === "unread") return matchesSearch && !message.isRead
    
    return matchesSearch
  })

  const handleReply = () => {
    if (replyContent.trim()) {
      // Here you would typically send the reply
              // إرسال الرد
        // يمكن إضافة منطق إرسال الرسالة هنا
      setReplyContent("")
      setSelectedMessage(null)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) return "منذ دقائق"
    if (diffInHours < 24) return `منذ ${Math.floor(diffInHours)} ساعة`
    if (diffInHours < 48) return "أمس"
    return date.toLocaleDateString('ar-SA')
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الرسائل</h1>
          <p className="text-gray-600 mt-2">إدارة الرسائل والتواصل</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Send className="ml-2 h-4 w-4" />
          رسالة جديدة
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الرسائل</p>
                <p className="text-2xl font-bold text-gray-900">{mockMessages.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">غير مقروءة</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockMessages.filter(m => !m.isRead).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مميزة</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {mockMessages.filter(m => m.isStarred).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مؤرشفة</p>
                <p className="text-2xl font-bold text-gray-600">
                  {mockMessages.filter(m => m.isArchived).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Archive className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>الرسائل</CardTitle>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="البحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 w-48"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="inbox">الوارد</TabsTrigger>
                  <TabsTrigger value="starred">مميزة</TabsTrigger>
                  <TabsTrigger value="unread">غير مقروءة</TabsTrigger>
                  <TabsTrigger value="archived">مؤرشفة</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors",
                      !message.isRead && "bg-blue-50",
                      selectedMessage?.id === message.id && "bg-blue-100"
                    )}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{message.sender}</div>
                          <div className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {message.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        {message.attachments.length > 0 && <Paperclip className="h-4 w-4 text-gray-400" />}
                        <Badge className={cn("text-xs", getPriorityColor(message.priority))}>
                          {getPriorityText(message.priority)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm font-medium mb-1">{message.subject}</div>
                    <div className="text-xs text-gray-600 line-clamp-2">{message.content}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-500">من:</span>
                      <span className="font-medium">{selectedMessage.sender}</span>
                      <span className="text-sm text-gray-500">إلى:</span>
                      <span className="font-medium">{selectedMessage.recipient}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(selectedMessage.priority)}>
                      {getPriorityText(selectedMessage.priority)}
                    </Badge>
                    <Badge className={getCategoryColor(selectedMessage.category)}>
                      {getCategoryText(selectedMessage.category)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Reply className="ml-2 h-4 w-4" />
                          رد
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Forward className="ml-2 h-4 w-4" />
                          إعادة توجيه
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star className="ml-2 h-4 w-4" />
                          {selectedMessage.isStarred ? 'إلغاء التمييز' : 'تمييز'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="ml-2 h-4 w-4" />
                          {selectedMessage.isArchived ? 'إلغاء الأرشفة' : 'أرشفة'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="ml-2 h-4 w-4" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {new Date(selectedMessage.timestamp).toLocaleString('ar-SA')}
                </div>

                {selectedMessage.attachments.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">المرفقات:</div>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{attachment.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">{formatFileSize(attachment.size)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.content}
                  </div>
                </div>

                {selectedMessage.replies.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="text-sm font-medium mb-2">الردود:</div>
                    <div className="space-y-3">
                      {selectedMessage.replies.map((reply) => (
                        <div key={reply.id} className="p-3 bg-gray-50 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{reply.sender}</span>
                            <span className="text-xs text-gray-500">{formatTimestamp(reply.timestamp)}</span>
                          </div>
                          <div className="text-sm">{reply.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="اكتب ردك هنا..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Paperclip className="ml-1 h-4 w-4" />
                          مرفق
                        </Button>
                        <Button variant="outline" size="sm">
                          <Smile className="ml-1 h-4 w-4" />
                          رمز تعبيري
                        </Button>
                      </div>
                      <Button onClick={handleReply} disabled={!replyContent.trim()}>
                        <Send className="ml-1 h-4 w-4" />
                        إرسال
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">اختر رسالة</h3>
                <p className="text-gray-500">اختر رسالة من القائمة لعرض تفاصيلها</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 