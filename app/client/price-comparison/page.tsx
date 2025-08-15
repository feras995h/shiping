"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Download,
  Check,
  X,
  Star,
  Clock,
  Truck,
  Plane,
  Ship
} from "lucide-react";

interface PriceComparison {
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  services: Array<{
    id: string;
    name: string;
    type: 'sea' | 'air' | 'land' | 'express';
    price: number;
    deliveryTime: number;
    features: string[];
    rating: number;
    isRecommended: boolean;
    savings?: number;
  }>;
  historicalPrices: Array<{
    month: string;
    seaPrice: number;
    airPrice: number;
    landPrice: number;
  }>;
  marketTrends: {
    seaTrend: number;
    airTrend: number;
    landTrend: number;
  };
}

const mockPriceComparison: PriceComparison = {
  origin: "شنغهاي، الصين",
  destination: "طرابلس، ليبيا",
  weight: 500,
  volume: 2.5,
  services: [
    {
      id: "1",
      name: "الشحن البحري العادي",
      type: "sea",
      price: 850,
      deliveryTime: 25,
      features: [
        "تأمين شامل",
        "تتبع الشحنة",
        "خدمة العملاء 24/7",
        "تخليص جمركي"
      ],
      rating: 4.5,
      isRecommended: true,
      savings: 200
    },
    {
      id: "2",
      name: "الشحن الجوي السريع",
      type: "air",
      price: 2200,
      deliveryTime: 5,
      features: [
        "تأمين شامل",
        "تتبع الشحنة",
        "خدمة العملاء 24/7",
        "تخليص جمركي",
        "تسليم سريع"
      ],
      rating: 4.8,
      isRecommended: false
    },
    {
      id: "3",
      name: "الشحن البري",
      type: "land",
      price: 1200,
      deliveryTime: 15,
      features: [
        "تأمين أساسي",
        "تتبع الشحنة",
        "خدمة العملاء"
      ],
      rating: 4.2,
      isRecommended: false
    },
    {
      id: "4",
      name: "الشحن السريع",
      type: "express",
      price: 2800,
      deliveryTime: 3,
      features: [
        "تأمين شامل",
        "تتبع الشحنة",
        "خدمة العملاء 24/7",
        "تخليص جمركي",
        "تسليم سريع",
        "أولوية عالية"
      ],
      rating: 4.9,
      isRecommended: false
    }
  ],
  historicalPrices: [
    { month: "يناير", seaPrice: 800, airPrice: 2100, landPrice: 1150 },
    { month: "فبراير", seaPrice: 820, airPrice: 2150, landPrice: 1180 },
    { month: "مارس", seaPrice: 830, airPrice: 2180, landPrice: 1190 },
    { month: "أبريل", seaPrice: 850, airPrice: 2200, landPrice: 1200 }
  ],
  marketTrends: {
    seaTrend: 6.25,
    airTrend: 4.76,
    landTrend: 4.35
  }
};

export default function PriceComparisonPage() {
  const [selectedOrigin, setSelectedOrigin] = useState("شنغهاي، الصين");
  const [selectedDestination, setSelectedDestination] = useState("طرابلس، ليبيا");
  const [weight, setWeight] = useState(500);
  const [volume, setVolume] = useState(2.5);
  const [activeTab, setActiveTab] = useState("comparison");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-LY', {
      style: 'currency',
      currency: 'LYD'
    }).format(amount);
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'sea': return <Ship className="h-5 w-5" />;
      case 'air': return <Plane className="h-5 w-5" />;
      case 'land': return <Truck className="h-5 w-5" />;
      case 'express': return <Package className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'sea': return 'text-blue-600 bg-blue-100';
      case 'air': return 'text-purple-600 bg-purple-100';
      case 'land': return 'text-green-600 bg-green-100';
      case 'express': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUpRight className="h-4 w-4 text-red-600" />;
    if (trend < 0) return <ArrowDownRight className="h-4 w-4 text-green-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-red-600';
    if (trend < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getTrendText = (trend: number) => {
    if (trend > 0) return `+${trend.toFixed(1)}%`;
    if (trend < 0) return `${trend.toFixed(1)}%`;
    return '0%';
  };

  const cheapestService = mockPriceComparison.services.reduce((min, service) => 
    service.price < min.price ? service : min
  );

  const fastestService = mockPriceComparison.services.reduce((min, service) => 
    service.deliveryTime < min.deliveryTime ? service : min
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مقارنة الأسعار</h1>
          <p className="text-gray-600">مقارنة أسعار الخدمات المختلفة</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تصدير
          </Button>
          <Button>
            <Calculator className="h-4 w-4 mr-2" />
            حساب جديد
          </Button>
        </div>
      </div>

      {/* Calculator Form */}
      <Card>
        <CardHeader>
          <CardTitle>حاسبة الأسعار</CardTitle>
          <CardDescription>أدخل تفاصيل الشحنة لمقارنة الأسعار</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="origin">نقطة الأصل</Label>
              <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="شنغهاي، الصين">شنغهاي، الصين</SelectItem>
                  <SelectItem value="بكين، الصين">بكين، الصين</SelectItem>
                  <SelectItem value="قوانغتشو، الصين">قوانغتشو، الصين</SelectItem>
                  <SelectItem value="شنتشن، الصين">شنتشن، الصين</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="destination">نقطة الوجهة</Label>
              <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="طرابلس، ليبيا">طرابلس، ليبيا</SelectItem>
                  <SelectItem value="بنغازي، ليبيا">بنغازي، ليبيا</SelectItem>
                  <SelectItem value="مصراتة، ليبيا">مصراتة، ليبيا</SelectItem>
                  <SelectItem value="سرت، ليبيا">سرت، ليبيا</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="weight">الوزن (كجم)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                placeholder="500"
              />
            </div>
            <div>
              <Label htmlFor="volume">الحجم (م³)</Label>
              <Input
                id="volume"
                type="number"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                placeholder="2.5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">أرخص خدمة</p>
                <p className="text-2xl font-bold">{formatCurrency(cheapestService.price)}</p>
                <p className="text-sm text-gray-500">{cheapestService.name}</p>
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
                <p className="text-sm text-gray-600">أسرع خدمة</p>
                <p className="text-2xl font-bold">{fastestService.deliveryTime} يوم</p>
                <p className="text-sm text-gray-500">{fastestService.name}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">التوفير المحتمل</p>
                <p className="text-2xl font-bold">{formatCurrency(1350)}</p>
                <p className="text-sm text-gray-500">مقارنة بالخدمة الأسرع</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison">مقارنة الخدمات</TabsTrigger>
          <TabsTrigger value="trends">توجهات الأسعار</TabsTrigger>
          <TabsTrigger value="analysis">تحليل مفصل</TabsTrigger>
        </TabsList>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockPriceComparison.services.map((service) => (
              <Card key={service.id} className={service.isRecommended ? 'ring-2 ring-blue-500' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getServiceColor(service.type)}`}>
                        {getServiceIcon(service.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription>
                          {service.deliveryTime} يوم للتسليم
                        </CardDescription>
                      </div>
                    </div>
                    {service.isRecommended && (
                      <Badge className="bg-blue-100 text-blue-800">
                        موصى به
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{formatCurrency(service.price)}</span>
                      {service.savings && (
                        <Badge className="bg-green-100 text-green-800">
                          توفير {formatCurrency(service.savings)}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(service.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{service.rating}/5</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">المميزات:</p>
                      <ul className="space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="text-sm flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full">
                      اختيار هذه الخدمة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Trends */}
            <Card>
              <CardHeader>
                <CardTitle>توجهات السوق</CardTitle>
                <CardDescription>تغير الأسعار في آخر 3 أشهر</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Ship className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium">الشحن البحري</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(mockPriceComparison.marketTrends.seaTrend)}
                      <span className={`font-medium ${getTrendColor(mockPriceComparison.marketTrends.seaTrend)}`}>
                        {getTrendText(mockPriceComparison.marketTrends.seaTrend)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Plane className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-medium">الشحن الجوي</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(mockPriceComparison.marketTrends.airTrend)}
                      <span className={`font-medium ${getTrendColor(mockPriceComparison.marketTrends.airTrend)}`}>
                        {getTrendText(mockPriceComparison.marketTrends.airTrend)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Truck className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium">الشحن البري</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(mockPriceComparison.marketTrends.landTrend)}
                      <span className={`font-medium ${getTrendColor(mockPriceComparison.marketTrends.landTrend)}`}>
                        {getTrendText(mockPriceComparison.marketTrends.landTrend)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historical Prices */}
            <Card>
              <CardHeader>
                <CardTitle>الأسعار التاريخية</CardTitle>
                <CardDescription>تطور الأسعار عبر الأشهر</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPriceComparison.historicalPrices.map((price, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <h4 className="font-medium mb-2">{price.month}</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">بحر:</span>
                          <span className="font-medium mr-1">{formatCurrency(price.seaPrice)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">جو:</span>
                          <span className="font-medium mr-1">{formatCurrency(price.airPrice)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">بر:</span>
                          <span className="font-medium mr-1">{formatCurrency(price.landPrice)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>رسم بياني للأسعار</CardTitle>
              <CardDescription>تمثيل مرئي لتطور الأسعار</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">رسم بياني للأسعار التاريخية</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost vs Speed Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>تحليل التكلفة مقابل السرعة</CardTitle>
                <CardDescription>مقارنة الكفاءة بين الخدمات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPriceComparison.services.map((service) => (
                    <div key={service.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{service.name}</span>
                        <span className="text-sm text-gray-600">
                          {formatCurrency(service.price)} / {service.deliveryTime} يوم
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>التكلفة لكل يوم:</span>
                          <span className="font-medium">
                            {formatCurrency(service.price / service.deliveryTime)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(service.price / service.deliveryTime) / 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>التوصيات</CardTitle>
                <CardDescription>نصائح لاختيار أفضل خدمة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">للشحنات العادية</h4>
                    <p className="text-sm text-blue-700">
                      الشحن البحري هو الخيار الأفضل من حيث التكلفة مع وقت تسليم معقول
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">للشحنات العاجلة</h4>
                    <p className="text-sm text-green-700">
                      الشحن الجوي مناسب للبضائع العاجلة رغم ارتفاع التكلفة
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">للشحنات المتوسطة</h4>
                    <p className="text-sm text-purple-700">
                      الشحن البري يوفر توازناً جيداً بين التكلفة والسرعة
                    </p>
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