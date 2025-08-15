"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Bell,
  BellOff,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Settings,
  Trash2,
  Archive,
  Mail,
  Smartphone,
  Globe,
  Clock,
  Star,
  StarOff
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  category: 'shipping' | 'billing' | 'support' | 'system' | 'promotion';
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actions?: string[];
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "تم تحديث حالة الشحنة",
    message: "شحنتكم #SH-2024-001 قد وصلت إلى ميناء طرابلس وتم إكمال إجراءات الجمارك",
    type: "success",
    category: "shipping",
    timestamp: "2024-01-15T10:30:00Z",
    isRead: false,
    isStarred: true,
    isArchived: false,
    priority: "high",
    actions: ["عرض التفاصيل", "تتبع الشحنة"]
  },
  {
    id: "2",
    title: "فاتورة جديدة متاحة",
    message: "تم إصدار فاتورة جديدة لشهر يناير 2024. يرجى مراجعة التفاصيل والدفع",
    type: "info",
    category: "billing",
    timestamp: "2024-01-14T15:45:00Z",
    isRead: true,
    isStarred: false,
    isArchived: false,
    priority: "medium",
    actions: ["عرض الفاتورة", "الدفع الآن"]
  },
  {
    id: "3",
    title: "مشكلة في تتبع الشحنة",
    message: "نعتذر عن المشكلة في نظام التتبع. فريق الدعم يعمل على حلها",
    type: "warning",
    category: "support",
    timestamp: "2024-01-13T09:20:00Z",
    isRead: true,
    isStarred: false,
    isArchived: false,
    priority: "medium",
    actions: ["التواصل مع الدعم"]
  },
  {
    id: "4",
    title: "صيانة النظام",
    message: "سيتم إجراء صيانة للنظام يوم الأحد من الساعة 2:00 صباحاً إلى 4:00 صباحاً",
    type: "info",
    category: "system",
    timestamp: "2024-01-12T14:15:00Z",
    isRead: true,
    isStarred: false,
    isArchived: true,
    priority: "low"
  },
  {
    id: "5",
    title: "عرض خاص - خصم 20%",
    message: "احصل على خصم 20% على جميع خدمات الشحن من الصين لمدة أسبوع واحد",
    type: "success",
    category: "promotion",
    timestamp: "2024-01-11T11:00:00Z",
    isRead: false,
    isStarred: false,
    isArchived: false,
    priority: "high",
    actions: ["استخدام العرض", "عرض التفاصيل"]
  },
  {
    id: "6",
    title: "تأخير في الشحنة",
    message: "شحنتكم #SH-2024-002 متأخرة بسبب ظروف جوية. نعتذر عن الإزعاج",
    type: "error",
    category: "shipping",
    timestamp: "2024-01-10T16:30:00Z",
    isRead: true,
    isStarred: false,
    isArchived: false,
    priority: "urgent",
    actions: ["عرض التفاصيل", "التواصل معنا"]
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // Notification settings
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    push: true,
    browser: true,
    shipping: true,
    billing: true,
    support: true,
    system: false,
    promotion: true
  });

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case "all":
        return !notification.isArchived && matchesSearch;
      case "unread":
        return !notification.isRead && !notification.isArchived && matchesSearch;
      case "starred":
        return notification.isStarred && !notification.isArchived && matchesSearch;
      case "archived":
        return notification.isArchived && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const handleStarNotification = (notificationId: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, isStarred: !notif.isStarred } : notif
    ));
  };

  const handleArchiveNotification = (notificationId: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, isArchived: !notif.isArchived } : notif
    ));
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(notif => notif.id !== notificationId));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'urgent': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-red-200 text-red-900';
      default: return 'bg-blue-100 text-blue-800';
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
      case 'support': return 'bg-green-100 text-green-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      case 'promotion': return 'bg-pink-100 text-pink-800';
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

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;
  const starredCount = notifications.filter(n => n.isStarred && !n.isArchived).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الإشعارات</h1>
          <p className="text-gray-600">إدارة الإشعارات والإعدادات</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="h-4 w-4 mr-2" />
            الإعدادات
          </Button>
          <Button onClick={handleMarkAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            تحديد الكل كمقروء
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">جميع الإشعارات</p>
                <p className="text-2xl font-bold">{notifications.filter(n => !n.isArchived).length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">غير مقروءة</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
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
                <p className="text-sm text-gray-600">المميزة</p>
                <p className="text-2xl font-bold">{starredCount}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المحفوظات</p>
                <p className="text-2xl font-bold">{notifications.filter(n => n.isArchived).length}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Archive className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الإشعارات</CardTitle>
            <CardDescription>تخصيص كيفية استلام الإشعارات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">طرق الإرسال</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>البريد الإلكتروني</span>
                    </div>
                    <Switch
                      checked={settings.email}
                      onCheckedChange={(checked) => setSettings({...settings, email: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span>رسائل SMS</span>
                    </div>
                    <Switch
                      checked={settings.sms}
                      onCheckedChange={(checked) => setSettings({...settings, sms: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>إشعارات التطبيق</span>
                    </div>
                    <Switch
                      checked={settings.push}
                      onCheckedChange={(checked) => setSettings({...settings, push: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>إشعارات المتصفح</span>
                    </div>
                    <Switch
                      checked={settings.browser}
                      onCheckedChange={(checked) => setSettings({...settings, browser: checked})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">أنواع الإشعارات</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>إشعارات الشحن</span>
                    <Switch
                      checked={settings.shipping}
                      onCheckedChange={(checked) => setSettings({...settings, shipping: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>إشعارات الفواتير</span>
                    <Switch
                      checked={settings.billing}
                      onCheckedChange={(checked) => setSettings({...settings, billing: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>إشعارات الدعم</span>
                    <Switch
                      checked={settings.support}
                      onCheckedChange={(checked) => setSettings({...settings, support: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>إشعارات النظام</span>
                    <Switch
                      checked={settings.system}
                      onCheckedChange={(checked) => setSettings({...settings, system: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>العروض والترويج</span>
                    <Switch
                      checked={settings.promotion}
                      onCheckedChange={(checked) => setSettings({...settings, promotion: checked})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>الإشعارات</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث في الإشعارات..."
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
              <TabsTrigger value="unread">غير مقروءة</TabsTrigger>
              <TabsTrigger value="starred">المميزة</TabsTrigger>
              <TabsTrigger value="archived">المحفوظات</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`text-sm font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </h4>
                              <Badge className={`text-xs ${getTypeColor(notification.type)}`}>
                                {notification.type}
                              </Badge>
                              <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </Badge>
                              <Badge className={`text-xs ${getCategoryColor(notification.category)}`}>
                                {notification.category}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            
                            {notification.actions && notification.actions.length > 0 && (
                              <div className="flex items-center gap-2 mb-2">
                                {notification.actions.map((action, index) => (
                                  <Button key={index} variant="outline" size="sm">
                                    {action}
                                  </Button>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {formatDate(notification.timestamp)}
                              </span>
                              
                              <div className="flex items-center gap-1">
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </Button>
                                )}
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStarNotification(notification.id)}
                                >
                                  {notification.isStarred ? (
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                  ) : (
                                    <StarOff className="h-3 w-3" />
                                  )}
                                </Button>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleArchiveNotification(notification.id)}>
                                      <Archive className="h-4 w-4 mr-2" />
                                      {notification.isArchived ? 'إلغاء الأرشفة' : 'أرشفة'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeleteNotification(notification.id)}>
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      حذف
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredNotifications.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>لا توجد إشعارات</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 