"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Reply, 
  Forward, 
  Archive, 
  Trash2,
  Star,
  StarOff,
  Send,
  Edit,
  Paperclip,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Inbox
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: {
    name: string;
    email: string;
    avatar?: string;
  };
  recipient: {
    name: string;
    email: string;
  };
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  isDraft: boolean;
  attachments: Attachment[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'support' | 'billing' | 'shipping' | 'general' | 'urgent';
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    subject: "تحديث حالة الشحنة #SH-2024-001",
    content: "مرحباً، نود إعلامكم بأن شحنتكم قد وصلت إلى ميناء طرابلس وتم إكمال إجراءات الجمارك. يمكنكم تتبع الشحنة من خلال الرابط المرفق.",
    sender: {
      name: "فريق الشحن",
      email: "shipping@company.com",
      avatar: "/avatars/shipping.jpg"
    },
    recipient: {
      name: "أحمد محمد",
      email: "ahmed@client.com"
    },
    timestamp: "2024-01-15T10:30:00Z",
    isRead: false,
    isStarred: true,
    isArchived: false,
    isDraft: false,
    attachments: [
      { id: "1", name: "تقرير_الشحنة.pdf", size: "2.5 MB", type: "pdf" }
    ],
    priority: "high",
    category: "shipping"
  },
  {
    id: "2",
    subject: "فاتورة جديدة - يناير 2024",
    content: "تم إصدار فاتورة جديدة لشهر يناير 2024. يرجى مراجعة التفاصيل والدفع في أقرب وقت ممكن.",
    sender: {
      name: "قسم المحاسبة",
      email: "billing@company.com"
    },
    recipient: {
      name: "أحمد محمد",
      email: "ahmed@client.com"
    },
    timestamp: "2024-01-14T15:45:00Z",
    isRead: true,
    isStarred: false,
    isArchived: false,
    isDraft: false,
    attachments: [
      { id: "2", name: "فاتورة_يناير_2024.pdf", size: "1.8 MB", type: "pdf" }
    ],
    priority: "medium",
    category: "billing"
  },
  {
    id: "3",
    subject: "استفسار حول الخدمات الجديدة",
    content: "مرحباً، أود الاستفسار عن الخدمات الجديدة التي تقدمونها للشحن من الصين. هل يمكنكم إرسال كتالوج الخدمات؟",
    sender: {
      name: "أحمد محمد",
      email: "ahmed@client.com"
    },
    recipient: {
      name: "فريق المبيعات",
      email: "sales@company.com"
    },
    timestamp: "2024-01-13T09:20:00Z",
    isRead: true,
    isStarred: false,
    isArchived: false,
    isDraft: true,
    attachments: [],
    priority: "low",
    category: "general"
  },
  {
    id: "4",
    subject: "مشكلة في تتبع الشحنة",
    content: "أواجه مشكلة في تتبع شحنتي. الرابط لا يعمل بشكل صحيح. هل يمكنكم مساعدتي؟",
    sender: {
      name: "أحمد محمد",
      email: "ahmed@client.com"
    },
    recipient: {
      name: "فريق الدعم",
      email: "support@company.com"
    },
    timestamp: "2024-01-12T14:15:00Z",
    isRead: true,
    isStarred: false,
    isArchived: true,
    isDraft: false,
    attachments: [
      { id: "3", name: "لقطة_شاشة_المشكلة.png", size: "850 KB", type: "png" }
    ],
    priority: "urgent",
    category: "support"
  }
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case "inbox":
        return !message.isArchived && !message.isDraft && matchesSearch;
      case "sent":
        return message.sender.email === "ahmed@client.com" && !message.isDraft && matchesSearch;
      case "drafts":
        return message.isDraft && matchesSearch;
      case "archived":
        return message.isArchived && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const handleStarMessage = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
  };

  const handleArchiveMessage = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isArchived: !msg.isArchived } : msg
    ));
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
  };

  const handleMarkAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'support': return 'bg-blue-100 text-blue-800';
      case 'billing': return 'bg-purple-100 text-purple-800';
      case 'shipping': return 'bg-green-100 text-green-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'أمس';
    } else {
      return date.toLocaleDateString('ar-SA');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الرسائل</h1>
          <p className="text-gray-600">إدارة الرسائل والمراسلات</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          رسالة جديدة
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الوارد</p>
                <p className="text-2xl font-bold">{messages.filter(m => !m.isArchived && !m.isDraft).length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Inbox className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">غير مقروءة</p>
                <p className="text-2xl font-bold">{messages.filter(m => !m.isRead && !m.isArchived).length}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المحفوظات</p>
                <p className="text-2xl font-bold">{messages.filter(m => m.isArchived).length}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Archive className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المسودات</p>
                <p className="text-2xl font-bold">{messages.filter(m => m.isDraft).length}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Edit className="h-6 w-6 text-gray-600" />
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
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في الرسائل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="inbox">الوارد</TabsTrigger>
                  <TabsTrigger value="sent">المرسل</TabsTrigger>
                  <TabsTrigger value="drafts">المسودات</TabsTrigger>
                  <TabsTrigger value="archived">المحفوظات</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-0">
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                        } ${!message.isRead ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          setSelectedMessage(message);
                          if (!message.isRead) {
                            handleMarkAsRead(message.id);
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender.avatar} />
                            <AvatarFallback>
                              {message.sender.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium truncate ${!message.isRead ? 'font-semibold' : ''}`}>
                                {message.sender.name}
                              </p>
                              <div className="flex items-center gap-1">
                                {message.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                                <span className="text-xs text-gray-500">
                                  {formatDate(message.timestamp)}
                                </span>
                              </div>
                            </div>
                            
                            <p className={`text-sm truncate ${!message.isRead ? 'font-medium' : ''}`}>
                              {message.subject}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-1">
                              {message.attachments.length > 0 && (
                                <Paperclip className="h-3 w-3 text-gray-400" />
                              )}
                              <Badge variant="outline" className={`text-xs ${getPriorityColor(message.priority)}`}>
                                {message.priority}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getCategoryColor(message.category)}`}>
                                {message.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStarMessage(message.id)}>
                                {message.isStarred ? <StarOff className="h-4 w-4 mr-2" /> : <Star className="h-4 w-4 mr-2" />}
                                {message.isStarred ? 'إلغاء التمييز' : 'تمييز'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleArchiveMessage(message.id)}>
                                <Archive className="h-4 w-4 mr-2" />
                                {message.isArchived ? 'إلغاء الأرشفة' : 'أرشفة'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteMessage(message.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الرسالة</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMessage ? (
                <div className="space-y-4">
                  {/* Message Header */}
                  <div className="border-b pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={selectedMessage.sender.avatar} />
                          <AvatarFallback>
                            {selectedMessage.sender.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="text-lg font-semibold">{selectedMessage.subject}</h3>
                          <p className="text-sm text-gray-600">
                            من: {selectedMessage.sender.name} &lt;{selectedMessage.sender.email}&gt;
                          </p>
                          <p className="text-sm text-gray-600">
                            إلى: {selectedMessage.recipient.name} &lt;{selectedMessage.recipient.email}&gt;
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(selectedMessage.timestamp).toLocaleString('ar-SA')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(selectedMessage.priority)}>
                          {selectedMessage.priority}
                        </Badge>
                        <Badge className={getCategoryColor(selectedMessage.category)}>
                          {selectedMessage.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.content}
                    </p>
                  </div>

                  {/* Attachments */}
                  {selectedMessage.attachments.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">المرفقات</h4>
                      <div className="space-y-2">
                        {selectedMessage.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center justify-between p-2 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <Paperclip className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{attachment.name}</span>
                              <span className="text-xs text-gray-500">({attachment.size})</span>
                            </div>
                            <Button variant="outline" size="sm">
                              تحميل
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Button>
                      <Reply className="h-4 w-4 mr-2" />
                      رد
                    </Button>
                    <Button variant="outline">
                      <Forward className="h-4 w-4 mr-2" />
                      إعادة توجيه
                    </Button>
                    <Button variant="outline" onClick={() => handleStarMessage(selectedMessage.id)}>
                      {selectedMessage.isStarred ? (
                        <>
                          <StarOff className="h-4 w-4 mr-2" />
                          إلغاء التمييز
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4 mr-2" />
                          تمييز
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => handleArchiveMessage(selectedMessage.id)}>
                      <Archive className="h-4 w-4 mr-2" />
                      {selectedMessage.isArchived ? 'إلغاء الأرشفة' : 'أرشفة'}
                    </Button>
                    <Button variant="outline" onClick={() => handleDeleteMessage(selectedMessage.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      حذف
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Inbox className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>اختر رسالة لعرض تفاصيلها</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 