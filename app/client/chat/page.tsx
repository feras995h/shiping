"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  Search,
  User,
  MessageCircle,
  Clock,
  Check,
  CheckCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
  type: 'text' | 'file' | 'image'
  fileName?: string
  fileSize?: string
}

interface Agent {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'busy'
  department: string
  lastSeen: string
}

const mockAgent: Agent = {
  id: "1",
  name: "أحمد محمد",
  avatar: "/avatars/agent1.jpg",
  status: "online",
  department: "خدمة العملاء",
  lastSeen: "الآن"
}

const mockMessages: Message[] = [
  {
    id: "1",
    text: "مرحباً! كيف يمكنني مساعدتك اليوم؟",
    sender: "agent",
    timestamp: "10:30",
    status: "read",
    type: "text"
  },
  {
    id: "2",
    text: "مرحباً، أريد الاستفسار عن شحنتي رقم GH-2024-001",
    sender: "user",
    timestamp: "10:32",
    status: "read",
    type: "text"
  },
  {
    id: "3",
    text: "بالطبع! دعني أتحقق من حالة شحنتك. رقم الشحنة GH-2024-001 في طريقها حالياً وستصل خلال يومين.",
    sender: "agent",
    timestamp: "10:33",
    status: "read",
    type: "text"
  },
  {
    id: "4",
    text: "ممتاز! هل يمكنني الحصول على رابط التتبع؟",
    sender: "user",
    timestamp: "10:35",
    status: "read",
    type: "text"
  },
  {
    id: "5",
    text: "بالتأكيد! يمكنك تتبع شحنتك من خلال هذا الرابط: https://tracking.example.com/GH-2024-001",
    sender: "agent",
    timestamp: "10:36",
    status: "read",
    type: "text"
  },
  {
    id: "6",
    text: "شكراً لك!",
    sender: "user",
    timestamp: "10:37",
    status: "delivered",
    type: "text"
  }
]

export default function ClientChatPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        status: "sent",
        type: "text"
      }
      setMessages([...messages, message])
      setNewMessage("")
      
      // Simulate agent response
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          const agentResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: "شكراً لك على رسالتك! سأقوم بالرد عليك قريباً.",
            sender: "agent",
            timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            status: "read",
            type: "text"
          }
          setMessages(prev => [...prev, agentResponse])
          setIsTyping(false)
        }, 2000)
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-blue-400" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-green-400" />
      default:
        return null
    }
  }

  const getAgentStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'offline': return 'bg-gray-500'
      case 'busy': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getAgentStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'online': return 'متصل'
      case 'offline': return 'غير متصل'
      case 'busy': return 'مشغول'
      default: return 'غير متصل'
    }
  }

  return (
    <div className="container mx-auto p-6 h-screen">
      <div className="h-full flex flex-col">
        {/* Header */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={mockAgent.avatar} />
                  <AvatarFallback>{mockAgent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{mockAgent.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getAgentStatusColor(mockAgent.status)}`}></div>
                    <span className="text-sm text-gray-600">{getAgentStatusText(mockAgent.status)}</span>
                    <span className="text-sm text-gray-500">• {mockAgent.department}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>حفظ المحادثة</DropdownMenuItem>
                    <DropdownMenuItem>إرسال تقرير</DropdownMenuItem>
                    <DropdownMenuItem>إنهاء المحادثة</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Messages */}
        <Card className="flex-1 mb-4">
          <CardContent className="p-0 h-full">
            <div className="h-full flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      {message.sender === 'agent' && (
                        <Avatar className="h-6 w-6 mb-1">
                          <AvatarImage src={mockAgent.avatar} />
                          <AvatarFallback>{mockAgent.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div className={`flex items-center gap-1 mt-1 ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}>
                          <span className="text-xs opacity-70">{message.timestamp}</span>
                          {message.sender === 'user' && getStatusIcon(message.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md">
                      <Avatar className="h-6 w-6 mb-1">
                        <AvatarImage src={mockAgent.avatar} />
                        <AvatarFallback>{mockAgent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg px-4 py-2">
                        <div className="flex items-center gap-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-gray-500">يكتب...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <Input
                      placeholder="اكتب رسالتك هنا..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="border-0 focus-visible:ring-0"
                    />
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">استفسار عام</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Search className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">تتبع شحنة</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <p className="text-sm font-medium">مواعيد التسليم</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <User className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">معلومات الحساب</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 