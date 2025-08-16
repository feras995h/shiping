"use client"

import { useState, useEffect, useCallback } from "react"
import { Shield, Users, Building, ArrowRight, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdvertisementSlider } from "@/components/shared/advertisement-slider"


// تحسين الأداء باستخدام التحميل الكسلي للصور
const OptimizedImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setLoaded(true)
    img.onerror = () => setError(true)
    img.src = src
  }, [src])

  if (error) return <div className={`bg-gray-200 ${className}`}></div>

  return (
    <div className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
      {loaded && <img src={src} alt={alt} className={className} />}
    </div>
  )
}

import { useMemo } from 'react'

export default function HomePage() {
  // استخدام useMemo لتجنب إعادة إنشاء المصفوفة في كل مرة
  const userTypes = useMemo(() => [
    {
      title: "مدير النظام",
      description: "صلاحيات كاملة لإدارة النظام والمستخدمين",
      icon: Shield,
      color: "from-purple-400 to-purple-600",
      features: ["إدارة المستخدمين", "مراقبة النظام", "التقارير الشاملة", "إعدادات الأمان"],
    },
    {
      title: "المدير المالي",
      description: "إدارة الشؤون المالية والمحاسبية",
      icon: DollarSign,
      color: "from-gold-400 to-gold-600",
      features: ["إدارة الميزانية", "التقارير المالية", "المراجعة المحاسبية", "إدارة التدفقات النقدية"],
    },
    {
      title: "الموظفين",
      description: "إدارة العمليات اليومية والشحنات",
      icon: Users,
      color: "from-blue-400 to-blue-600",
      features: ["معالجة الشحنات", "إدارة الفواتير", "تتبع العمليات", "التقارير اليومية"],
    },
    {
      title: "العملاء",
      description: "متابعة الشحنات والفواتير الخاصة",
      icon: Building,
      color: "from-orange-400 to-orange-600",
      features: ["تتبع الشحنات", "عرض الفواتير", "طلب خدمات جديدة", "التواصل مع الدعم"],
    },
  ], [])

  // استخدام useCallback لتجنب إعادة إنشاء الدالة في كل مرة
  const handleLogin = useCallback(() => {
    window.location.href = "/auth/login"
  }, [])

  // استخدام useCallback لتجنب إعادة إنشاء الدالة في كل مرة
  const handleLearnMore = useCallback(() => {
    window.location.href = "/about"
  }, [])

  return (
    <div className="min-h-screen bg-gold-gradient">
      {/* Header */}
      <header className="glass-effect shadow-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-gold-50 to-gold-100 flex items-center justify-center shadow-gold border border-gold-200">
                <img src="/golden-horse-logo.svg" alt="شعار الحصان الذهبي" className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold gold-text">الحصان الذهبي للشحن</h1>
                <p className="text-sm text-slate-600">Golden Horse Shipping - الحل المتكامل لإدارة الشحن والمالية</p>
              </div>
            </div>
            <Button className="btn-gold" onClick={handleLogin}>
              تسجيل الدخول
              <ArrowRight className="h-4 w-4 mr-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            نظام إدارة الشحن والمالية
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            حلول متكاملة لإدارة عمليات الشحن والشؤون المالية مع تتبع دقيق ومراقبة شاملة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/auth/login">
                تسجيل الدخول
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/tracking">
                تتبع الشحنة
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* سلايدر الإعلانات */}
      <section className="container mx-auto px-4 py-8">
        <AdvertisementSlider 
          type="SLIDER"
          autoPlay={true}
          interval={5000}
          showControls={true}
          showIndicators={true}
        />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold gold-text mb-4">
            مرحباً بك في الحصان الذهبي للشحن
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Golden Horse Shipping - النظام المتكامل لإدارة الشحنات والمالية مع صلاحيات مختلفة للمستخدمين
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="btn-gold text-lg px-8" onClick={handleLogin}>
              ابدأ الآن
              <ArrowRight className="h-5 w-5 mr-2" />
            </Button>
          </div>
        </div>

        {/* User Types */}
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4 mb-12">
          {userTypes.map((type, index) => (
            <Card key={index} className="card-premium hover-lift">
              <CardHeader className="text-center">
                <div className={`h-16 w-16 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center mx-auto mb-4 shadow-gold`}>
                  <type.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">{type.title}</CardTitle>
                <CardDescription className="text-slate-600">{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {type.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="h-2 w-2 rounded-full bg-gold-400"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button 
                    className="w-full btn-gold-outline" 
                    onClick={handleLogin}
                  >
                    تسجيل الدخول
                    <ArrowRight className="h-4 w-4 mr-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-8">المميزات الرئيسية</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="text-center">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-4 shadow-gold">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">أمان عالي</h3>
              <p className="text-slate-600">نظام حماية متقدم لحماية البيانات والمعلومات</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-4 shadow-gold">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">إدارة مالية متكاملة</h3>
              <p className="text-slate-600">إدارة شاملة للشؤون المالية والمحاسبية</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-4 shadow-gold">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">صلاحيات مرنة</h3>
              <p className="text-slate-600">إدارة صلاحيات مختلفة لكل نوع مستخدم</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="card-premium bg-gradient-to-r from-gold-50 to-amber-50">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">ابدأ باستخدام النظام الآن</h2>
              <p className="text-lg text-slate-600 mb-8">
                انضم إلى آلاف المستخدمين الذين يثقون بنظامنا لإدارة أعمالهم
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" className="btn-gold text-lg px-8" onClick={handleLogin}>
                  تسجيل الدخول
                  <ArrowRight className="h-5 w-5 mr-2" />
                </Button>
                <Button size="lg" variant="outline" className="btn-gold-outline text-lg px-8" onClick={handleLearnMore}>
                  معرفة المزيد
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gold-200/50 bg-gradient-to-r from-slate-50 to-gold-50/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-slate-600">
              © 2024 الحصان الذهبي للشحن - Golden Horse Shipping. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}