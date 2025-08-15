"use client"

import { useState } from "react"
import { 
  DollarSign, 
  Package, 
  Ship, 
  Truck, 
  Plane, 
  Train, 
  Calculator,
  CheckCircle,
  AlertCircle,
  Info,
  Download,
  Star,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PricingTier {
  id: string
  name: string
  description: string
  price: number
  currency: string
  features: string[]
  popular?: boolean
  icon: any
}

interface ServiceType {
  id: string
  name: string
  description: string
  basePrice: number
  currency: string
  unit: string
  icon: any
  features: string[]
}

const pricingTiers: PricingTier[] = [
  {
    id: "basic",
    name: "الباقة الأساسية",
    description: "مناسبة للشحنات الصغيرة والمتوسطة",
    price: 500,
    currency: "دينار ليبي",
    icon: Package,
    features: [
      "شحنات حتى 100 كجم",
      "تتبع أساسي",
      "وثائق أساسية",
      "دعم عبر البريد الإلكتروني",
      "تسليم خلال 7-10 أيام"
    ]
  },
  {
    id: "premium",
    name: "الباقة المميزة",
    description: "مناسبة للشحنات الكبيرة والمهمة",
    price: 1200,
    currency: "دينار ليبي",
    popular: true,
    icon: Ship,
    features: [
      "شحنات حتى 500 كجم",
      "تتبع متقدم",
      "وثائق شاملة",
      "دعم هاتفي",
      "تسليم خلال 5-7 أيام",
      "تأمين شامل",
      "تخليص جمركي سريع"
    ]
  },
  {
    id: "enterprise",
    name: "الباقة المؤسسية",
    description: "للشركات والمؤسسات الكبيرة",
    price: 2500,
    currency: "دينار ليبي",
    icon: Truck,
    features: [
      "شحنات غير محدودة",
      "تتبع فوري",
      "وثائق مخصصة",
      "مدير حساب مخصص",
      "تسليم خلال 3-5 أيام",
      "تأمين شامل",
      "تخليص جمركي سريع",
      "تقارير مخصصة",
      "دعم 24/7"
    ]
  }
]

const serviceTypes: ServiceType[] = [
  {
    id: "sea-freight",
    name: "الشحن البحري",
    description: "شحن بحري من الصين إلى ليبيا",
    basePrice: 800,
    currency: "دينار ليبي",
    unit: "متر مكعب",
    icon: Ship,
    features: [
      "وقت النقل: 25-35 يوم",
      "مناسب للبضائع الثقيلة",
      "تكلفة منخفضة",
      "تأمين شامل"
    ]
  },
  {
    id: "air-freight",
    name: "الشحن الجوي",
    description: "شحن جوي سريع من الصين",
    basePrice: 2500,
    currency: "دينار ليبي",
    unit: "كجم",
    icon: Plane,
    features: [
      "وقت النقل: 3-7 أيام",
      "مناسب للبضائع الخفيفة",
      "سرعة عالية",
      "تتبع فوري"
    ]
  },
  {
    id: "land-freight",
    name: "الشحن البري",
    description: "شحن بري عبر الدول المجاورة",
    basePrice: 1200,
    currency: "دينار ليبي",
    unit: "طن",
    icon: Truck,
    features: [
      "وقت النقل: 15-25 يوم",
      "مناسب للمسافات المتوسطة",
      "تكلفة معقولة",
      "مرونة في المسارات"
    ]
  },
  {
    id: "rail-freight",
    name: "الشحن بالسكك الحديدية",
    description: "شحن بالسكك الحديدية من الصين",
    basePrice: 600,
    currency: "دينار ليبي",
    unit: "طن",
    icon: Train,
    features: [
      "وقت النقل: 20-30 يوم",
      "مناسب للبضائع الكبيرة",
      "تكلفة منخفضة",
      "صديق للبيئة"
    ]
  }
]

export default function ClientPricingPage() {
  const [selectedTier, setSelectedTier] = useState<string>("premium")
  const [selectedService, setSelectedService] = useState<string>("sea-freight")

  const calculatePrice = (basePrice: number, weight: number, serviceType: string) => {
    let multiplier = 1
    switch (serviceType) {
      case "sea-freight":
        multiplier = weight * 0.8
        break
      case "air-freight":
        multiplier = weight * 2.5
        break
      case "land-freight":
        multiplier = weight * 1.2
        break
      case "rail-freight":
        multiplier = weight * 0.6
        break
      default:
        multiplier = weight
    }
    return basePrice * multiplier
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">أسعار الخدمات</h1>
        <p className="text-xl text-gray-600">اختر الباقة المناسبة لاحتياجاتك</p>
      </div>

      {/* Pricing Tiers */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">الباقات المتاحة</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.id} 
              className={`relative ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  الأكثر شعبية
                </Badge>
              )}
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <tier.icon className="h-12 w-12 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                  <span className="text-gray-600"> {tier.currency}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${tier.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={tier.popular ? 'default' : 'outline'}
                >
                  اختر هذه الباقة
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Service Types */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">أنواع الخدمات</h2>
        <Tabs value={selectedService} onValueChange={setSelectedService}>
          <TabsList className="grid w-full grid-cols-4">
            {serviceTypes.map((service) => (
              <TabsTrigger key={service.id} value={service.id} className="flex items-center gap-2">
                <service.icon className="h-4 w-4" />
                {service.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {serviceTypes.map((service) => (
            <TabsContent key={service.id} value={service.id} className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <service.icon className="h-8 w-8 text-blue-600" />
                    <div>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-2">السعر الأساسي</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {service.basePrice} {service.currency} / {service.unit}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">المميزات</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-4">حاسبة السعر</h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">الوزن/الحجم</label>
                        <input 
                          type="number" 
                          className="w-full p-2 border rounded-md"
                          placeholder="أدخل الوزن"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">الخدمات الإضافية</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>بدون خدمات إضافية</option>
                          <option>تأمين إضافي</option>
                          <option>تخليص جمركي سريع</option>
                          <option>تسليم من الباب للباب</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">السعر التقديري</label>
                        <p className="text-xl font-bold text-green-600">
                          {service.basePrice * 2} {service.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Additional Services */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">الخدمات الإضافية</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">التأمين الشامل</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">تأمين شامل ضد جميع المخاطر</p>
              <p className="text-lg font-bold text-blue-600">2% من قيمة الشحنة</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">التخليص الجمركي</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">خدمة التخليص الجمركي السريع</p>
              <p className="text-lg font-bold text-green-600">150 دينار ليبي</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">التسليم المنزلي</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">تسليم من الباب للباب</p>
              <p className="text-lg font-bold text-purple-600">50 دينار ليبي</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            الأسعار المذكورة هي أسعار تقديرية وقد تتغير حسب حجم الشحنة والمسافة والخدمات الإضافية المطلوبة.
          </AlertDescription>
        </Alert>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            للاستفسار عن الأسعار الدقيقة أو طلب عرض سعر مخصص، يرجى التواصل مع فريق المبيعات.
          </AlertDescription>
        </Alert>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="ml-2 h-4 w-4" />
          تحميل كتالوج الأسعار
        </Button>
        <Button variant="outline">
          طلب عرض سعر مخصص
        </Button>
      </div>
    </div>
  )
} 