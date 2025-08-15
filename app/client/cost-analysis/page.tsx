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
  DollarSign,
  Package,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  Eye,
  Download
} from "lucide-react";

interface CostAnalysis {
  totalCost: number;
  averageCostPerShipment: number;
  costBreakdown: {
    shipping: number;
    customs: number;
    insurance: number;
    handling: number;
    other: number;
  };
  costTrends: Array<{
    month: string;
    totalCost: number;
    shipmentCount: number;
    averageCost: number;
    change: number;
  }>;
  costComparison: {
    current: number;
    previous: number;
    change: number;
    percentage: number;
  };
  costOptimization: Array<{
    category: string;
    currentCost: number;
    potentialSavings: number;
    recommendations: string[];
  }>;
  costByDestination: Array<{
    destination: string;
    totalCost: number;
    shipmentCount: number;
    averageCost: number;
  }>;
}

const mockCostAnalysis: CostAnalysis = {
  totalCost: 18500,
  averageCostPerShipment: 411,
  costBreakdown: {
    shipping: 12000,
    customs: 3500,
    insurance: 1800,
    handling: 800,
    other: 400
  },
  costTrends: [
    { month: "يناير", totalCost: 3200, shipmentCount: 8, averageCost: 400, change: 0 },
    { month: "فبراير", totalCost: 4100, shipmentCount: 10, averageCost: 410, change: 2.5 },
    { month: "مارس", totalCost: 4800, shipmentCount: 12, averageCost: 400, change: -2.4 },
    { month: "أبريل", totalCost: 6400, shipmentCount: 15, averageCost: 427, change: 6.8 }
  ],
  costComparison: {
    current: 6400,
    previous: 4800,
    change: 1600,
    percentage: 33.3
  },
  costOptimization: [
    {
      category: "الشحن",
      currentCost: 12000,
      potentialSavings: 1800,
      recommendations: [
        "استخدام الشحن الجماعي لتقليل التكلفة",
        "اختيار شركات شحن أكثر تنافسية",
        "تحسين التغليف لتقليل الوزن"
      ]
    },
    {
      category: "الجمارك",
      currentCost: 3500,
      potentialSavings: 700,
      recommendations: [
        "تحسين تصنيف البضائع",
        "استخدام وكيل جمركي موثوق",
        "إعداد الوثائق بشكل صحيح"
      ]
    },
    {
      category: "التأمين",
      currentCost: 1800,
      potentialSavings: 300,
      recommendations: [
        "مقارنة أسعار التأمين",
        "اختيار تغطية مناسبة",
        "التفاوض على أسعار أفضل"
      ]
    }
  ],
  costByDestination: [
    { destination: "طرابلس", totalCost: 7200, shipmentCount: 18, averageCost: 400 },
    { destination: "بنغازي", totalCost: 4800, shipmentCount: 12, averageCost: 400 },
    { destination: "مصراتة", totalCost: 3200, shipmentCount: 8, averageCost: 400 },
    { destination: "سرت", totalCost: 1600, shipmentCount: 4, averageCost: 400 },
    { destination: "أخرى", totalCost: 1700, shipmentCount: 3, averageCost: 567 }
  ]
};

export default function CostAnalysisPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-LY', {
      style: 'currency',
      currency: 'LYD'
    }).format(amount);
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="h-4 w-4 text-red-600" />;
    if (change < 0) return <ArrowDownRight className="h-4 w-4 text-green-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-red-600';
    if (change < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getChangeText = (change: number) => {
    if (change > 0) return `+${change.toFixed(1)}%`;
    if (change < 0) return `${change.toFixed(1)}%`;
    return '0%';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تحليل التكلفة</h1>
          <p className="text-gray-600">مقارنة التكاليف والتحسينات المحتملة</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">أسبوعي</SelectItem>
              <SelectItem value="month">شهري</SelectItem>
              <SelectItem value="quarter">ربع سنوي</SelectItem>
              <SelectItem value="year">سنوي</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي التكلفة</p>
                <p className="text-2xl font-bold">{formatCurrency(mockCostAnalysis.totalCost)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIcon(mockCostAnalysis.costComparison.percentage)}
                  <span className={`text-xs ${getChangeColor(mockCostAnalysis.costComparison.percentage)}`}>
                    {getChangeText(mockCostAnalysis.costComparison.percentage)}
                  </span>
                </div>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">متوسط التكلفة/شحنة</p>
                <p className="text-2xl font-bold">{formatCurrency(mockCostAnalysis.averageCostPerShipment)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">-5%</span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">التوفير المحقق</p>
                <p className="text-2xl font-bold">{formatCurrency(2800)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+15%</span>
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">كفاءة التكلفة</p>
                <p className="text-2xl font-bold">85%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+8%</span>
                </div>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="breakdown">تفصيل التكاليف</TabsTrigger>
          <TabsTrigger value="optimization">التحسينات</TabsTrigger>
          <TabsTrigger value="trends">التوجهات</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع التكاليف</CardTitle>
                <CardDescription>تفصيل التكاليف حسب الفئة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm">الشحن</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(mockCostAnalysis.costBreakdown.shipping)}</p>
                      <p className="text-xs text-gray-500">64.9%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">الجمرك</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(mockCostAnalysis.costBreakdown.customs)}</p>
                      <p className="text-xs text-gray-500">18.9%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">التأمين</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(mockCostAnalysis.costBreakdown.insurance)}</p>
                      <p className="text-xs text-gray-500">9.7%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm">التداول</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(mockCostAnalysis.costBreakdown.handling)}</p>
                      <p className="text-xs text-gray-500">4.3%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                      <span className="text-sm">أخرى</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(mockCostAnalysis.costBreakdown.other)}</p>
                      <p className="text-xs text-gray-500">2.2%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>مقارنة التكاليف</CardTitle>
                <CardDescription>مقارنة مع الفترة السابقة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">الفترة الحالية</span>
                    <span className="font-bold">{formatCurrency(mockCostAnalysis.costComparison.current)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">الفترة السابقة</span>
                    <span className="font-bold">{formatCurrency(mockCostAnalysis.costComparison.previous)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">التغيير</span>
                    <div className="flex items-center gap-2">
                      {getChangeIcon(mockCostAnalysis.costComparison.percentage)}
                      <span className={`font-bold ${getChangeColor(mockCostAnalysis.costComparison.percentage)}`}>
                        {formatCurrency(mockCostAnalysis.costComparison.change)}
                      </span>
                      <Badge className={getChangeColor(mockCostAnalysis.costComparison.percentage)}>
                        {getChangeText(mockCostAnalysis.costComparison.percentage)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost by Destination */}
          <Card>
            <CardHeader>
              <CardTitle>التكاليف حسب الوجهة</CardTitle>
              <CardDescription>مقارنة التكاليف بين الوجهات المختلفة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-2">الوجهة</th>
                      <th className="text-right py-2">إجمالي التكلفة</th>
                      <th className="text-right py-2">عدد الشحنات</th>
                      <th className="text-right py-2">متوسط التكلفة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCostAnalysis.costByDestination.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 font-medium">{item.destination}</td>
                        <td className="py-2">{formatCurrency(item.totalCost)}</td>
                        <td className="py-2">{item.shipmentCount}</td>
                        <td className="py-2">{formatCurrency(item.averageCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(mockCostAnalysis.costBreakdown).map(([category, cost]) => (
              <Card key={category}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    {category === 'shipping' ? 'الشحن' :
                     category === 'customs' ? 'الجمرك' :
                     category === 'insurance' ? 'التأمين' :
                     category === 'handling' ? 'التداول' : 'أخرى'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{formatCurrency(cost)}</p>
                    <p className="text-sm text-gray-600">
                      {((cost / mockCostAnalysis.totalCost) * 100).toFixed(1)}% من إجمالي التكلفة
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(cost / mockCostAnalysis.totalCost) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>فرص التحسين</CardTitle>
              <CardDescription>التوصيات لتقليل التكاليف</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockCostAnalysis.costOptimization.map((optimization, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">
                        {optimization.category === 'shipping' ? 'الشحن' :
                         optimization.category === 'customs' ? 'الجمرك' :
                         optimization.category === 'insurance' ? 'التأمين' : optimization.category}
                      </h4>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">التوفير المحتمل</p>
                        <p className="font-bold text-green-600">{formatCurrency(optimization.potentialSavings)}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">التوصيات:</p>
                      <ul className="space-y-1">
                        {optimization.recommendations.map((recommendation, recIndex) => (
                          <li key={recIndex} className="text-sm flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>توجهات التكلفة</CardTitle>
              <CardDescription>تطور التكاليف عبر الأشهر</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCostAnalysis.costTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{trend.month}</p>
                        <p className="text-sm text-gray-600">{trend.shipmentCount} شحنة</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(trend.totalCost)}</p>
                      <p className="text-sm text-gray-600">متوسط: {formatCurrency(trend.averageCost)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {getChangeIcon(trend.change)}
                      <span className={`text-sm ${getChangeColor(trend.change)}`}>
                        {getChangeText(trend.change)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>رسم بياني للتكاليف</CardTitle>
              <CardDescription>تمثيل مرئي لتطور التكاليف</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">رسم بياني للتكاليف الشهرية</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 