"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, RefreshCw } from "lucide-react"

export default function LogoPreviewPage() {
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium')

  const sizes = {
    small: { main: 'h-16 w-16', simple: 'h-12 w-12' },
    medium: { main: 'h-24 w-24', simple: 'h-20 w-20' },
    large: { main: 'h-32 w-32', simple: 'h-28 w-28' }
  }

  const handleDownload = (logoType: 'main' | 'simple') => {
    const link = document.createElement('a')
    link.href = logoType === 'main' ? '/golden-horse-logo.svg' : '/golden-horse-logo-simple.svg'
    link.download = logoType === 'main' ? 'golden-horse-logo.svg' : 'golden-horse-logo-simple.svg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gold-800">معاينة الشعارات</h1>
            <p className="text-gold-600">معاينة شعارات النظام بجميع الأحجام والاستخدامات</p>
          </div>
          <Button variant="outline" onClick={() => window.close()}>
            <ArrowLeft className="h-4 w-4 ml-2" />
            إغلاق
          </Button>
        </div>

        {/* Size Selector */}
        <Card className="border-gold-200">
          <CardHeader>
            <CardTitle className="text-gold-800">اختر الحجم</CardTitle>
            <CardDescription>اختر حجم الشعار للمعاينة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'default' : 'outline'}
                  className={selectedSize === size ? 'bg-gold-600 hover:bg-gold-700' : 'border-gold-300 text-gold-700 hover:bg-gold-50'}
                  onClick={() => setSelectedSize(size)}
                >
                  {size === 'small' && 'صغير'}
                  {size === 'medium' && 'متوسط'}
                  {size === 'large' && 'كبير'}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logo Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Logo */}
          <Card className="border-gold-200 bg-gradient-to-r from-gold-50/50 to-amber-50/50">
            <CardHeader>
              <CardTitle className="text-gold-800">الشعار الرئيسي</CardTitle>
              <CardDescription>الشعار المستخدم في العناوين واللوحات الرئيسية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className={`${sizes[selectedSize].main} bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl flex items-center justify-center border border-gold-200 shadow-lg`}>
                  <img src="/golden-horse-logo.svg" alt="الشعار الرئيسي" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-gold-600">الأبعاد الموصى بها: 120x120 بكسل</p>
                <p className="text-xs text-gold-500">صيغة SVG للجودة العالية</p>
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gold-300 text-gold-700 hover:bg-gold-50"
                  onClick={() => handleDownload('main')}
                >
                  <Download className="h-4 w-4 ml-2" />
                  تحميل
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Simple Logo */}
          <Card className="border-gold-200 bg-gradient-to-r from-gold-50/50 to-amber-50/50">
            <CardHeader>
              <CardTitle className="text-gold-800">الشعار البسيط</CardTitle>
              <CardDescription>الشعار المستخدم في الأيقونات والقوائم الجانبية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className={`${sizes[selectedSize].simple} bg-gradient-to-br from-gold-50 to-gold-100 rounded-lg flex items-center justify-center border border-gold-200 shadow-lg`}>
                  <img src="/golden-horse-logo-simple.svg" alt="الشعار البسيط" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-gold-600">الأبعاد الموصى بها: 80x80 بكسل</p>
                <p className="text-xs text-gold-500">صيغة SVG للجودة العالية</p>
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gold-300 text-gold-700 hover:bg-gold-50"
                  onClick={() => handleDownload('simple')}
                >
                  <Download className="h-4 w-4 ml-2" />
                  تحميل
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Examples */}
        <Card className="border-gold-200">
          <CardHeader>
            <CardTitle className="text-gold-800">أمثلة الاستخدام</CardTitle>
            <CardDescription>كيفية استخدام الشعارات في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border border-gold-200 rounded-lg">
                <div className="h-12 w-12 bg-gradient-to-br from-gold-50 to-gold-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <img src="/golden-horse-logo-simple.svg" alt="أيقونة" className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-gold-800 mb-2">أيقونات</h3>
                <p className="text-sm text-gold-600">استخدام الشعار البسيط في الأيقونات والقوائم</p>
              </div>
              <div className="text-center p-4 border border-gold-200 rounded-lg">
                <div className="h-16 w-16 bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <img src="/golden-horse-logo.svg" alt="شعار" className="h-12 w-12" />
                </div>
                <h3 className="font-semibold text-gold-800 mb-2">عناوين</h3>
                <p className="text-sm text-gold-600">استخدام الشعار الرئيسي في العناوين واللوحات</p>
              </div>
              <div className="text-center p-4 border border-gold-200 rounded-lg">
                <div className="h-20 w-20 bg-gradient-to-br from-gold-50 to-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <img src="/golden-horse-logo.svg" alt="شعار كبير" className="h-16 w-16" />
                </div>
                <h3 className="font-semibold text-gold-800 mb-2">عرض</h3>
                <p className="text-sm text-gold-600">استخدام الشعار الرئيسي في صفحات العرض</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Information */}
        <Card className="border-gold-200">
          <CardHeader>
            <CardTitle className="text-gold-800">معلومات الألوان</CardTitle>
            <CardDescription>الألوان المستخدمة في الشعارات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="h-12 w-12 bg-[#F4E4BC] rounded-lg mx-auto mb-2 border border-gold-200"></div>
                <p className="text-sm font-medium text-gold-800">ذهبي فاتح</p>
                <p className="text-xs text-gold-600">#F4E4BC</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 bg-[#E6D7A8] rounded-lg mx-auto mb-2 border border-gold-200"></div>
                <p className="text-sm font-medium text-gold-800">ذهبي متوسط</p>
                <p className="text-xs text-gold-600">#E6D7A8</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 bg-[#D4C095] rounded-lg mx-auto mb-2 border border-gold-200"></div>
                <p className="text-sm font-medium text-gold-800">ذهبي غامق</p>
                <p className="text-xs text-gold-600">#D4C095</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 bg-[#B8A67A] rounded-lg mx-auto mb-2 border border-gold-200"></div>
                <p className="text-sm font-medium text-gold-800">ذهبي بني</p>
                <p className="text-xs text-gold-600">#B8A67A</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


