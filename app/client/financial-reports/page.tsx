"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Download,
  Filter,
  MoreVertical,
  PieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Receipt,
  Calendar,
  FileText,
  Eye,
  Printer
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FinancialReport {
  id: string;
  title: string;
  type: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  shippingCount: number;
  averageCost: number;
  status: 'generated' | 'processing' | 'failed';
  createdAt: string;
  data: {
    revenue: number[];
    expenses: number[];
    shipments: number[];
    labels: string[];
  };
}

const mockReports: FinancialReport[] = [
  {
    id: "1",
    title: "التقرير المالي - يناير 2024",
    type: "monthly",
    period: "يناير 2024",
    totalRevenue: 15000,
    totalExpenses: 8500,
    netProfit: 6500,
    shippingCount: 25,
    averageCost: 340,
    status: "generated",
    createdAt: "2024-01-31T23:59:59Z",
    data: {
      revenue: [1200, 1800, 2100, 1900, 2200, 1800, 2000, 2100],
      expenses: [800, 1200, 1400, 1300, 1500, 1200, 1300, 1400],
      shipments: [3, 5, 6, 4, 7, 5, 6, 5],
      labels: ["الأسبوع 1", "الأسبوع 2", "الأسبوع 3", "الأسبوع 4"]
    }
  },
  {
    id: "2",
    title: "التقرير المالي - الربع الرابع 2023",
    type: "quarterly",
    period: "الربع الرابع 2023",
    totalRevenue: 45000,
    totalExpenses: 28000,
    netProfit: 17000,
    shippingCount: 75,
    averageCost: 373,
    status: "generated",
    createdAt: "2023-12-31T23:59:59Z",
    data: {
      revenue: [12000, 15000, 18000],
      expenses: [8000, 10000, 10000],
      shipments: [20, 25, 30],
      labels: ["أكتوبر", "نوفمبر", "ديسمبر"]
    }
  },
  {
    id: "3",
    title: "التقرير المالي السنوي 2023",
    type: "yearly",
    period: "2023",
    totalRevenue: 180000,
    totalExpenses: 120000,
    netProfit: 60000,
    shippingCount: 300,
    averageCost: 400,
    status: "generated",
    createdAt: "2023-12-31T23:59:59Z",
    data: {
      revenue: [12000, 15000, 18000, 20000, 22000, 25000, 28000, 30000, 32000, 35000, 38000, 40000],
      expenses: [8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000, 24000, 26000, 28000, 30000],
      shipments: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
      labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
    }
  }
];

export default function FinancialReportsPage() {
  const [reports, setReports] = useState<FinancialReport[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<FinancialReport | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = selectedPeriod === "all" || report.type === selectedPeriod;
    return matchesSearch && matchesPeriod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'generated': return 'تم التوليد';
      case 'processing': return 'قيد المعالجة';
      case 'failed': return 'فشل';
      default: return 'غير معروف';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-LY', {
      style: 'currency',
      currency: 'LYD'
    }).format(amount);
  };

  // Calculate summary statistics
  const totalRevenue = reports.reduce((sum, report) => sum + report.totalRevenue, 0);
  const totalExpenses = reports.reduce((sum, report) => sum + report.totalExpenses, 0);
  const totalProfit = reports.reduce((sum, report) => sum + report.netProfit, 0);
  const totalShipments = reports.reduce((sum, report) => sum + report.shippingCount, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">التقارير المالية</h1>
          <p className="text-gray-600">متابعة الأداء المالي والإحصائيات</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تصدير
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            تقرير جديد
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المصروفات</p>
                <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">صافي الربح</p>
                <p className="text-2xl font-bold">{formatCurrency(totalProfit)}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الشحنات</p>
                <p className="text-2xl font-bold">{totalShipments}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>التقارير</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="البحث في التقارير..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفترة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفترات</SelectItem>
                    <SelectItem value="monthly">شهري</SelectItem>
                    <SelectItem value="quarterly">ربع سنوي</SelectItem>
                    <SelectItem value="yearly">سنوي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedReport?.id === report.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{report.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{report.period}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-xs ${getStatusColor(report.status)}`}>
                            {getStatusText(report.status)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatCurrency(report.netProfit)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(report.createdAt)}
                        </p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedReport(report)}>
                            <Eye className="h-4 w-4 mr-2" />
                            عرض
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            تحميل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="h-4 w-4 mr-2" />
                            طباعة
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Detail */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل التقرير</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedReport ? (
                <div className="space-y-6">
                  {/* Report Header */}
                  <div className="border-b pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{selectedReport.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{selectedReport.period}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusColor(selectedReport.status)}>
                            {getStatusText(selectedReport.status)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            تم التوليد: {formatDate(selectedReport.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          تحميل
                        </Button>
                        <Button variant="outline" size="sm">
                          <Printer className="h-4 w-4 mr-2" />
                          طباعة
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Report Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                      <TabsTrigger value="charts">الرسوم البيانية</TabsTrigger>
                      <TabsTrigger value="details">التفاصيل</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">ملخص مالي</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">الإيرادات</span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(selectedReport.totalRevenue)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">المصروفات</span>
                              <span className="font-medium text-red-600">
                                {formatCurrency(selectedReport.totalExpenses)}
                              </span>
                            </div>
                            <div className="border-t pt-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">صافي الربح</span>
                                <span className="font-bold text-blue-600">
                                  {formatCurrency(selectedReport.netProfit)}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">إحصائيات الشحن</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">عدد الشحنات</span>
                              <span className="font-medium">{selectedReport.shippingCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">متوسط التكلفة</span>
                              <span className="font-medium">
                                {formatCurrency(selectedReport.averageCost)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">معدل الربحية</span>
                              <span className="font-medium text-green-600">
                                {((selectedReport.netProfit / selectedReport.totalRevenue) * 100).toFixed(1)}%
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    {/* Charts Tab */}
                    <TabsContent value="charts" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">الإيرادات والمصروفات</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                              <div className="text-center">
                                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">رسم بياني للإيرادات والمصروفات</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">توزيع الشحنات</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                              <div className="text-center">
                                <PieChart className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">رسم بياني دائري للشحنات</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    {/* Details Tab */}
                    <TabsContent value="details" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">تفاصيل البيانات</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">الإيرادات الشهرية</h4>
                              <div className="space-y-2">
                                {selectedReport.data.revenue.map((amount, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span className="text-sm">{selectedReport.data.labels[index]}</span>
                                    <span className="font-medium">{formatCurrency(amount)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">المصروفات الشهرية</h4>
                              <div className="space-y-2">
                                {selectedReport.data.expenses.map((amount, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span className="text-sm">{selectedReport.data.labels[index]}</span>
                                    <span className="font-medium">{formatCurrency(amount)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>اختر تقريراً لعرض تفاصيله</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 