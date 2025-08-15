"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Send,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Inquiry {
  id: string;
  title: string;
  description: string;
  category: 'shipping' | 'billing' | 'technical' | 'general' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    name: string;
    email: string;
  };
  attachments: string[];
  responses: InquiryResponse[];
}

interface InquiryResponse {
  id: string;
  content: string;
  author: {
    name: string;
    role: 'client' | 'support';
  };
  timestamp: string;
}

const mockInquiries: Inquiry[] = [
  {
    id: "1",
    title: "استفسار حول وقت التسليم المتوقع",
    description: "أود معرفة الوقت المتوقع لتسليم شحنتي رقم SH-2024-001. هل يمكن تقديم موعد التسليم؟",
    category: "shipping",
    priority: "medium",
    status: "in_progress",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    assignedTo: {
      name: "أحمد علي",
      email: "ahmed.ali@company.com"
    },
    attachments: ["مستند_الشحنة.pdf"],
    responses: [
      {
        id: "1",
        content: "مرحباً، شكراً لاستفسارك. سنقوم بمراجعة حالة شحنتك وإعلامك بالوقت المتوقع للتسليم.",
        author: {
          name: "أحمد علي",
          role: "support"
        },
        timestamp: "2024-01-15T11:00:00Z"
      }
    ]
  },
  {
    id: "2",
    title: "استفسار حول رسوم الجمارك",
    description: "هل رسوم الجمارك مشمولة في السعر المعلن أم يجب دفعها منفصلة؟",
    category: "billing",
    priority: "high",
    status: "resolved",
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T16:30:00Z",
    assignedTo: {
      name: "فاطمة محمد",
      email: "fatima@company.com"
    },
    attachments: [],
    responses: [
      {
        id: "2",
        content: "رسوم الجمارك مشمولة في السعر المعلن. لا توجد رسوم إضافية.",
        author: {
          name: "فاطمة محمد",
          role: "support"
        },
        timestamp: "2024-01-14T10:00:00Z"
      }
    ]
  },
  {
    id: "3",
    title: "مشكلة في تتبع الشحنة",
    description: "لا يمكنني الوصول لصفحة تتبع الشحنة. هل هناك مشكلة في النظام؟",
    category: "technical",
    priority: "urgent",
    status: "pending",
    createdAt: "2024-01-15T08:45:00Z",
    updatedAt: "2024-01-15T08:45:00Z",
    attachments: ["لقطة_شاشة_المشكلة.png"],
    responses: []
  }
];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showNewInquiry, setShowNewInquiry] = useState(false);
  const [newInquiry, setNewInquiry] = useState({
    title: "",
    description: "",
    category: "general" as const,
    priority: "medium" as const
  });

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case "all":
        return matchesSearch;
      case "pending":
        return inquiry.status === "pending" && matchesSearch;
      case "in_progress":
        return inquiry.status === "in_progress" && matchesSearch;
      case "resolved":
        return inquiry.status === "resolved" && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const handleCreateInquiry = () => {
    const inquiry: Inquiry = {
      id: Date.now().toString(),
      title: newInquiry.title,
      description: newInquiry.description,
      category: newInquiry.category,
      priority: newInquiry.priority,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: [],
      responses: []
    };
    
    setInquiries([inquiry, ...inquiries]);
    setNewInquiry({ title: "", description: "", category: "general", priority: "medium" });
    setShowNewInquiry(false);
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiries(inquiries.filter(inquiry => inquiry.id !== id));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      case 'shipping': return 'bg-blue-100 text-blue-800';
      case 'billing': return 'bg-purple-100 text-purple-800';
      case 'technical': return 'bg-green-100 text-green-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const pendingCount = inquiries.filter(i => i.status === 'pending').length;
  const inProgressCount = inquiries.filter(i => i.status === 'in_progress').length;
  const resolvedCount = inquiries.filter(i => i.status === 'resolved').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الاستفسارات</h1>
          <p className="text-gray-600">إدارة الاستفسارات والاستفسارات الجديدة</p>
        </div>
        <Button onClick={() => setShowNewInquiry(true)}>
          <Plus className="h-4 w-4 mr-2" />
          استفسار جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الاستفسارات</p>
                <p className="text-2xl font-bold">{inquiries.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">في الانتظار</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">قيد المعالجة</p>
                <p className="text-2xl font-bold">{inProgressCount}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">تم الحل</p>
                <p className="text-2xl font-bold">{resolvedCount}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>الاستفسارات</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في الاستفسارات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">الكل</TabsTrigger>
                  <TabsTrigger value="pending">في الانتظار</TabsTrigger>
                  <TabsTrigger value="in_progress">قيد المعالجة</TabsTrigger>
                  <TabsTrigger value="resolved">تم الحل</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-0">
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    {filteredInquiries.map((inquiry) => (
                      <div
                        key={inquiry.id}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedInquiry?.id === inquiry.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => setSelectedInquiry(inquiry)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">{inquiry.title}</h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {inquiry.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={`text-xs ${getStatusColor(inquiry.status)}`}>
                                {inquiry.status === 'pending' ? 'في الانتظار' :
                                 inquiry.status === 'in_progress' ? 'قيد المعالجة' :
                                 inquiry.status === 'resolved' ? 'تم الحل' : 'مغلق'}
                              </Badge>
                              <Badge className={`text-xs ${getPriorityColor(inquiry.priority)}`}>
                                {inquiry.priority}
                              </Badge>
                              <Badge className={`text-xs ${getCategoryColor(inquiry.category)}`}>
                                {inquiry.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(inquiry.createdAt)}
                            </p>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedInquiry(inquiry)}>
                                <Eye className="h-4 w-4 mr-2" />
                                عرض
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteInquiry(inquiry.id)}>
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

        {/* Inquiry Detail */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الاستفسار</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedInquiry ? (
                <div className="space-y-4">
                  {/* Inquiry Header */}
                  <div className="border-b pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{selectedInquiry.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedInquiry.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusColor(selectedInquiry.status)}>
                            {selectedInquiry.status === 'pending' ? 'في الانتظار' :
                             selectedInquiry.status === 'in_progress' ? 'قيد المعالجة' :
                             selectedInquiry.status === 'resolved' ? 'تم الحل' : 'مغلق'}
                          </Badge>
                          <Badge className={getPriorityColor(selectedInquiry.priority)}>
                            {selectedInquiry.priority}
                          </Badge>
                          <Badge className={getCategoryColor(selectedInquiry.category)}>
                            {selectedInquiry.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          تم الإنشاء: {formatDate(selectedInquiry.createdAt)}
                        </p>
                        {selectedInquiry.assignedTo && (
                          <p className="text-sm text-gray-500">
                            المكلف: {selectedInquiry.assignedTo.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  {selectedInquiry.attachments.length > 0 && (
                    <div className="border-b pb-4">
                      <h4 className="font-medium mb-2">المرفقات</h4>
                      <div className="space-y-2">
                        {selectedInquiry.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{attachment}</span>
                            <Button variant="outline" size="sm">
                              تحميل
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Responses */}
                  <div>
                    <h4 className="font-medium mb-2">الردود</h4>
                    <div className="space-y-3">
                      {selectedInquiry.responses.map((response) => (
                        <div key={response.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{response.author.name}</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(response.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{response.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>اختر استفساراً لعرض تفاصيله</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Inquiry Modal */}
      {showNewInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">استفسار جديد</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">العنوان</Label>
                <Input
                  id="title"
                  value={newInquiry.title}
                  onChange={(e) => setNewInquiry({...newInquiry, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={newInquiry.description}
                  onChange={(e) => setNewInquiry({...newInquiry, description: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">الفئة</Label>
                  <Select
                    value={newInquiry.category}
                    onValueChange={(value: any) => setNewInquiry({...newInquiry, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">عام</SelectItem>
                      <SelectItem value="shipping">الشحن</SelectItem>
                      <SelectItem value="billing">الفوترة</SelectItem>
                      <SelectItem value="technical">تقني</SelectItem>
                      <SelectItem value="urgent">عاجل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">الأولوية</Label>
                  <Select
                    value={newInquiry.priority}
                    onValueChange={(value: any) => setNewInquiry({...newInquiry, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">منخفضة</SelectItem>
                      <SelectItem value="medium">متوسطة</SelectItem>
                      <SelectItem value="high">عالية</SelectItem>
                      <SelectItem value="urgent">عاجلة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleCreateInquiry}>
                  <Send className="h-4 w-4 mr-2" />
                  إرسال الاستفسار
                </Button>
                <Button variant="outline" onClick={() => setShowNewInquiry(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 