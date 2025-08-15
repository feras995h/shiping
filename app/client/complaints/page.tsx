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
  AlertTriangle,
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
  Tag,
  MessageSquare
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'service' | 'delivery' | 'billing' | 'quality' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'investigating' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    name: string;
    email: string;
  };
  attachments: string[];
  responses: ComplaintResponse[];
  resolution?: string;
  compensation?: {
    type: 'refund' | 'discount' | 'credit' | 'none';
    amount?: number;
    description?: string;
  };
}

interface ComplaintResponse {
  id: string;
  content: string;
  author: {
    name: string;
    role: 'client' | 'support' | 'manager';
  };
  timestamp: string;
}

const mockComplaints: Complaint[] = [
  {
    id: "1",
    title: "تأخير في تسليم الشحنة",
    description: "شحنتي متأخرة لمدة أسبوع عن الموعد المحدد. هذا يؤثر على أعمالي بشكل كبير.",
    category: "delivery",
    priority: "high",
    status: "investigating",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    assignedTo: {
      name: "محمد أحمد",
      email: "mohamed.ahmed@company.com"
    },
    attachments: ["مستند_الشحنة.pdf", "إيصال_الدفع.pdf"],
    responses: [
      {
        id: "1",
        content: "نعتذر بشدة عن التأخير. نحن نتحقق من سبب التأخير وسنوافيكم بالنتيجة في أقرب وقت ممكن.",
        author: {
          name: "محمد أحمد",
          role: "support"
        },
        timestamp: "2024-01-15T11:00:00Z"
      }
    ]
  },
  {
    id: "2",
    title: "خطأ في الفاتورة",
    description: "تم إضافة رسوم إضافية غير مبررة في الفاتورة الأخيرة. أطلب مراجعة فورية.",
    category: "billing",
    priority: "urgent",
    status: "resolved",
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T16:30:00Z",
    assignedTo: {
      name: "فاطمة علي",
      email: "fatima.ali@company.com"
    },
    attachments: ["الفاتورة_المشكوك_فيها.pdf"],
    responses: [
      {
        id: "2",
        content: "تم مراجعة الفاتورة وإزالة الرسوم الإضافية. سيتم إصدار فاتورة مصححة.",
        author: {
          name: "فاطمة علي",
          role: "support"
        },
        timestamp: "2024-01-14T10:00:00Z"
      }
    ],
    resolution: "تم تصحيح الفاتورة وإزالة الرسوم الإضافية",
    compensation: {
      type: "discount",
      amount: 50,
      description: "خصم 50 دينار على الشحنة القادمة"
    }
  },
  {
    id: "3",
    title: "تلف في البضاعة",
    description: "وصلت البضاعة متضررة. أطلب تعويض فوري واستبدال البضاعة.",
    category: "quality",
    priority: "urgent",
    status: "pending",
    createdAt: "2024-01-15T08:45:00Z",
    updatedAt: "2024-01-15T08:45:00Z",
    attachments: ["صور_التلف.jpg", "تقرير_التلف.pdf"],
    responses: []
  }
];

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    title: "",
    description: "",
    category: "other" as const,
    priority: "medium" as const
  });

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case "all":
        return matchesSearch;
      case "pending":
        return complaint.status === "pending" && matchesSearch;
      case "investigating":
        return complaint.status === "investigating" && matchesSearch;
      case "resolved":
        return complaint.status === "resolved" && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const handleCreateComplaint = () => {
    const complaint: Complaint = {
      id: Date.now().toString(),
      title: newComplaint.title,
      description: newComplaint.description,
      category: newComplaint.category,
      priority: newComplaint.priority,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: [],
      responses: []
    };
    
    setComplaints([complaint, ...complaints]);
    setNewComplaint({ title: "", description: "", category: "other", priority: "medium" });
    setShowNewComplaint(false);
  };

  const handleDeleteComplaint = (id: string) => {
    setComplaints(complaints.filter(complaint => complaint.id !== id));
    if (selectedComplaint?.id === id) {
      setSelectedComplaint(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
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
      case 'service': return 'bg-blue-100 text-blue-800';
      case 'delivery': return 'bg-purple-100 text-purple-800';
      case 'billing': return 'bg-green-100 text-green-800';
      case 'quality': return 'bg-red-100 text-red-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const pendingCount = complaints.filter(c => c.status === 'pending').length;
  const investigatingCount = complaints.filter(c => c.status === 'investigating').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الشكاوى</h1>
          <p className="text-gray-600">إدارة الشكاوى والمتابعة</p>
        </div>
        <Button onClick={() => setShowNewComplaint(true)}>
          <Plus className="h-4 w-4 mr-2" />
          شكوى جديدة
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الشكاوى</p>
                <p className="text-2xl font-bold">{complaints.length}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
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
                <p className="text-sm text-gray-600">قيد التحقيق</p>
                <p className="text-2xl font-bold">{investigatingCount}</p>
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
        {/* Complaints List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>الشكاوى</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في الشكاوى..."
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
                  <TabsTrigger value="investigating">قيد التحقيق</TabsTrigger>
                  <TabsTrigger value="resolved">تم الحل</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-0">
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    {filteredComplaints.map((complaint) => (
                      <div
                        key={complaint.id}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedComplaint?.id === complaint.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => setSelectedComplaint(complaint)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">{complaint.title}</h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {complaint.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={`text-xs ${getStatusColor(complaint.status)}`}>
                                {complaint.status === 'pending' ? 'في الانتظار' :
                                 complaint.status === 'investigating' ? 'قيد التحقيق' :
                                 complaint.status === 'resolved' ? 'تم الحل' : 'مغلق'}
                              </Badge>
                              <Badge className={`text-xs ${getPriorityColor(complaint.priority)}`}>
                                {complaint.priority}
                              </Badge>
                              <Badge className={`text-xs ${getCategoryColor(complaint.category)}`}>
                                {complaint.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(complaint.createdAt)}
                            </p>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedComplaint(complaint)}>
                                <Eye className="h-4 w-4 mr-2" />
                                عرض
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteComplaint(complaint.id)}>
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

        {/* Complaint Detail */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الشكوى</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedComplaint ? (
                <div className="space-y-4">
                  {/* Complaint Header */}
                  <div className="border-b pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{selectedComplaint.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedComplaint.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusColor(selectedComplaint.status)}>
                            {selectedComplaint.status === 'pending' ? 'في الانتظار' :
                             selectedComplaint.status === 'investigating' ? 'قيد التحقيق' :
                             selectedComplaint.status === 'resolved' ? 'تم الحل' : 'مغلق'}
                          </Badge>
                          <Badge className={getPriorityColor(selectedComplaint.priority)}>
                            {selectedComplaint.priority}
                          </Badge>
                          <Badge className={getCategoryColor(selectedComplaint.category)}>
                            {selectedComplaint.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          تم الإنشاء: {formatDate(selectedComplaint.createdAt)}
                        </p>
                        {selectedComplaint.assignedTo && (
                          <p className="text-sm text-gray-500">
                            المكلف: {selectedComplaint.assignedTo.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resolution */}
                  {selectedComplaint.resolution && (
                    <div className="border-b pb-4">
                      <h4 className="font-medium mb-2">الحل</h4>
                      <p className="text-sm text-gray-700">{selectedComplaint.resolution}</p>
                    </div>
                  )}

                  {/* Compensation */}
                  {selectedComplaint.compensation && selectedComplaint.compensation.type !== 'none' && (
                    <div className="border-b pb-4">
                      <h4 className="font-medium mb-2">التعويض</h4>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          نوع التعويض: {
                            selectedComplaint.compensation.type === 'refund' ? 'استرداد' :
                            selectedComplaint.compensation.type === 'discount' ? 'خصم' :
                            selectedComplaint.compensation.type === 'credit' ? 'رصيد' : 'لا يوجد'
                          }
                        </p>
                        {selectedComplaint.compensation.amount && (
                          <p className="text-sm text-green-800">
                            المبلغ: {selectedComplaint.compensation.amount} دينار
                          </p>
                        )}
                        {selectedComplaint.compensation.description && (
                          <p className="text-sm text-green-800">
                            التفاصيل: {selectedComplaint.compensation.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  {selectedComplaint.attachments.length > 0 && (
                    <div className="border-b pb-4">
                      <h4 className="font-medium mb-2">المرفقات</h4>
                      <div className="space-y-2">
                        {selectedComplaint.attachments.map((attachment, index) => (
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
                      {selectedComplaint.responses.map((response) => (
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
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>اختر شكوى لعرض تفاصيلها</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Complaint Modal */}
      {showNewComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">شكوى جديدة</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">العنوان</Label>
                <Input
                  id="title"
                  value={newComplaint.title}
                  onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">الفئة</Label>
                  <Select
                    value={newComplaint.category}
                    onValueChange={(value: any) => setNewComplaint({...newComplaint, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">الخدمة</SelectItem>
                      <SelectItem value="delivery">التسليم</SelectItem>
                      <SelectItem value="billing">الفوترة</SelectItem>
                      <SelectItem value="quality">الجودة</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">الأولوية</Label>
                  <Select
                    value={newComplaint.priority}
                    onValueChange={(value: any) => setNewComplaint({...newComplaint, priority: value})}
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
                <Button onClick={handleCreateComplaint}>
                  <Send className="h-4 w-4 mr-2" />
                  إرسال الشكوى
                </Button>
                <Button variant="outline" onClick={() => setShowNewComplaint(false)}>
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