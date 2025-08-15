"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  Clock,
  Star,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  Award,
  Activity,
  Users,
  MapPin,
  Truck
} from "lucide-react";

interface ClientStats {
  totalShipments: number;
  totalSpent: number;
  averageDeliveryTime: number;
  satisfactionRating: number;
  onTimeDeliveryRate: number;
  monthlyGrowth: number;
  topDestinations: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  monthlyData: Array<{
    month: string;
    shipments: number;
    spending: number;
    satisfaction: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'shipment' | 'payment' | 'complaint' | 'inquiry';
    title: string;
    description: string;
    timestamp: string;
    status: 'completed' | 'pending' | 'in_progress';
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    earnedAt: string;
    category: 'shipping' | 'payment' | 'loyalty' | 'quality';
  }>;
}

const mockStats: ClientStats = {
  totalShipments: 45,
  totalSpent: 18500,
  averageDeliveryTime: 12.5,
  satisfactionRating: 4.7,
  onTimeDeliveryRate: 92,
  monthlyGrowth: 15,
  topDestinations: [
    { name: "طرابلس", count: 18, percentage: 40 },
    { name: "بنغازي", count: 12, percentage: 27 },
    { name: "مصراتة", count: 8, percentage: 18 },
    { name: "سرت", count: 4, percentage: 9 },
    { name: "أخرى", count: 3, percentage: 6 }
  ],
  monthlyData: [
    { month: "يناير", shipments: 8, spending: 3200, satisfaction: 4.5 },
    { month: "فبراير", shipments: 10, spending: 4100, satisfaction: 4.6 },
    { month: "مارس", shipments: 12, spending: 4800, satisfaction: 4.7 },
    { month: "أبريل", shipments: 15, spending: 6400, satisfaction: 4.8 }
  ],
  recentActivity: [
    {
      id: "1",
      type: "shipment",
      title: "شحنة جديدة",
      description: "تم إنشاء شحنة جديدة إلى طرابلس",
      timestamp: "2024-01-15T10:30:00Z",
      status: "completed"
    },
    {
      id: "2",
      type: "payment",
      title: "دفع فاتورة",
      description: "تم دفع فاتورة بقيمة 850 دينار",
      timestamp: "2024-01-14T15:45:00Z",
      status: "completed"
    },
    {
      id: "3",
      type: "complaint",
      title: "شكوى جديدة",
      description: "تم تقديم شكوى حول تأخير الشحنة",
      timestamp: "2024-01-13T09:20:00Z",
      status: "in_progress"
    },
    {
      id: "4",
      type: "inquiry",
      title: "استفسار جديد",
      description: "تم إرسال استفسار حول الخدمات الجديدة",
      timestamp: "2024-01-12T14:15:00Z",
      status: "pending"
    }
  ],
  achievements: [
    {
      id: "1",
      title: "عميل مخلص",
      description: "أكملت 25 شحنة",
      icon: "🎯",
      earnedAt: "2024-01-10T12:00:00Z",
      category: "loyalty"
    },
    {
      id: "2",
      title: "مدفع سريع",
      description: "دفعت 10 فواتير في الوقت المحدد",
      icon: "💰",
      earnedAt: "2024-01-05T10:30:00Z",
      category: "payment"
    },
    {
      id: "3",
      title: "مقيم ممتاز",
      description: "حصلت على تقييم 5 نجوم",
      icon: "⭐",
      earnedAt: "2024-01-01T16:20:00Z",
      category: "quality"
    }
  ]
};

export default function MyStatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-LY', {
      style: 'currency',
      currency: 'LYD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'shipment': return <Package className="h-4 w-4" />;
      case 'payment': return <DollarSign className="h-4 w-4" />;
      case 'complaint': return <Activity className="h-4 w-4" />;
      case 'inquiry': return <Users className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'shipment': return 'text-blue-600 bg-blue-100';
      case 'payment': return 'text-green-600 bg-green-100';
      case 'complaint': return 'text-red-600 bg-red-100';
      case 'inquiry': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAchievementColor = (category: string) => {
    switch (category) {
      case 'shipping': return 'bg-blue-100 text-blue-800';
      case 'payment': return 'bg-green-100 text-green-800';
      case 'loyalty': return 'bg-purple-100 text-purple-800';
      case 'quality': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إحصائياتي</h1>
          <p className="text-gray-600">متابعة أدائي وإحصائياتي الشخصية</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="اختر الفترة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفترات</SelectItem>
            <SelectItem value="month">هذا الشهر</SelectItem>
            <SelectItem value="quarter">هذا الربع</SelectItem>
            <SelectItem value="year">هذا العام</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الشحنات</p>
                <p className="text-2xl font-bold">{mockStats.totalShipments}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+{mockStats.monthlyGrowth}%</span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الإنفاق</p>
                <p className="text-2xl font-bold">{formatCurrency(mockStats.totalSpent)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+12%</span>
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">متوسط وقت التسليم</p>
                <p className="text-2xl font-bold">{mockStats.averageDeliveryTime} يوم</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">-2 يوم</span>
                </div>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">معدل الرضا</p>
                <p className="text-2xl font-bold">{mockStats.satisfactionRating}/5</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-600">ممتاز</span>
                </div>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="activity">النشاط الأخير</TabsTrigger>
          <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Destinations */}
            <Card>
              <CardHeader>
                <CardTitle>أفضل الوجهات</CardTitle>
                <CardDescription>توزيع الشحنات حسب الوجهة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockStats.topDestinations.map((destination, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">{destination.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{destination.count} شحنة</span>
                        <Badge variant="outline">{destination.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>مؤشرات الأداء</CardTitle>
                <CardDescription>مقاييس جودة الخدمة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">نسبة التسليم في الوقت المحدد</span>
                      <span className="text-sm text-gray-600">{mockStats.onTimeDeliveryRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${mockStats.onTimeDeliveryRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">معدل الرضا العام</span>
                      <span className="text-sm text-gray-600">{mockStats.satisfactionRating}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(mockStats.satisfactionRating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">نمو الشحنات الشهري</span>
                      <span className="text-sm text-gray-600">+{mockStats.monthlyGrowth}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(mockStats.monthlyGrowth * 2, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>التوجهات الشهرية</CardTitle>
              <CardDescription>مقارنة الأداء عبر الأشهر</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockStats.monthlyData.map((data, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{data.month}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">الشحنات:</span>
                        <span className="font-medium">{data.shipments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">الإنفاق:</span>
                        <span className="font-medium">{formatCurrency(data.spending)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">الرضا:</span>
                        <span className="font-medium">{data.satisfaction}/5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>النشاط الأخير</CardTitle>
              <CardDescription>آخر الأنشطة والتفاعلات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{activity.title}</h4>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status === 'completed' ? 'مكتمل' :
                           activity.status === 'pending' ? 'في الانتظار' : 'قيد المعالجة'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-2">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الإنجازات</CardTitle>
              <CardDescription>الإنجازات والجوائز المكتسبة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockStats.achievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 border rounded-lg text-center">
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h4 className="font-medium mb-1">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <Badge className={getAchievementColor(achievement.category)}>
                      {achievement.category === 'shipping' ? 'الشحن' :
                       achievement.category === 'payment' ? 'الدفع' :
                       achievement.category === 'loyalty' ? 'الولاء' : 'الجودة'}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-2">{formatDate(achievement.earnedAt)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>تحليل الشحنات</CardTitle>
                <CardDescription>إحصائيات مفصلة للشحنات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">رسم بياني للشحنات</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزيع الإنفاق</CardTitle>
                <CardDescription>تحليل الإنفاق حسب الفئات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">رسم بياني دائري للإنفاق</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 