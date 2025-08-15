"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, RefreshCw, SlidersHorizontal, Upload, Image as ImageIcon, Palette, Download } from "lucide-react"

type Setting = { id: string; key: string; value: string; category: string; description?: string | null }

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, Setting[]>>({})
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState<string>("all")
  const [usingDefaults, setUsingDefaults] = useState(false)

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category && category !== 'all') params.set('category', category)
      const res = await fetch(`/api/admin/settings?${params.toString()}`)
      const json = await res.json()
      if (json.success) {
        setSettings(json.data.settings)
        setUsingDefaults(json.data.usingDefaults || false)
      }
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (id: string, value: string, description?: string) => {
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, value, description })
    })
  }

  // دوال إدارة الشعار
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'simple') => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('logo', file)
      formData.append('type', type)

      const response = await fetch('/api/admin/logo-upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        alert(`تم رفع الشعار ${type === 'main' ? 'الرئيسي' : 'البسيط'} بنجاح`)
        // إعادة تحميل الصفحة لتحديث الشعارات
        window.location.reload()
      } else {
        alert('حدث خطأ أثناء رفع الشعار')
      }
    } catch (error) {
      console.error('خطأ في رفع الشعار:', error)
      alert('حدث خطأ أثناء رفع الشعار')
    }
  }

  const handleResetToDefault = async () => {
    if (confirm('هل أنت متأكد من إعادة تعيين الشعارات للافتراضي؟')) {
      try {
        const response = await fetch('/api/admin/logo-reset', {
          method: 'POST'
        })

        if (response.ok) {
          alert('تم إعادة تعيين الشعارات للافتراضي بنجاح')
          window.location.reload()
        } else {
          alert('حدث خطأ أثناء إعادة التعيين')
        }
      } catch (error) {
        console.error('خطأ في إعادة التعيين:', error)
        alert('حدث خطأ أثناء إعادة التعيين')
      }
    }
  }

  const handlePreviewLogos = () => {
    // فتح نافذة معاينة الشعارات
    const previewWindow = window.open('/admin/logo-preview', '_blank', 'width=800,height=600')
    if (previewWindow) {
      previewWindow.focus()
    }
  }

  const handleDownloadLogos = async () => {
    try {
      const response = await fetch('/api/admin/logo-download')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'golden-horse-logos.zip'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('خطأ في تحميل الشعارات:', error)
      alert('حدث خطأ أثناء تحميل الشعارات')
    }
  }

  useEffect(() => { fetchSettings() }, [category])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إعدادات النظام</h1>
          <p className="text-gray-600">تحكم في حدود الموافقات والتنبيهات والضرائب والعملات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSettings} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} /> تحديث
          </Button>
        </div>
      </div>

      {/* إشعار استخدام الإعدادات الافتراضية */}
      {usingDefaults && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-amber-400 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">!</span>
            </div>
            <div>
              <h3 className="font-medium text-amber-800">ملاحظة مهمة</h3>
              <p className="text-sm text-amber-700">
                النظام يستخدم الإعدادات الافتراضية حالياً. للوصول الكامل، تأكد من تشغيل قاعدة البيانات PostgreSQL.
              </p>
            </div>
          </div>
        </div>
      )}

              {/* قسم إدارة الشعار */}
        <Card className="border-gold-200 bg-gradient-to-r from-gold-50/50 to-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gold-800">
              <Palette className="h-5 w-5 text-gold-600" /> إدارة الشعار
            </CardTitle>
            <CardDescription>تحديث شعار النظام والعلامة التجارية</CardDescription>
            {!usingDefaults && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                <p className="text-sm text-green-700">
                  ✅ إدارة الشعارات تعمل بشكل طبيعي مع قاعدة البيانات
                </p>
              </div>
            )}
          </CardHeader>
        <CardContent className="space-y-6">
          {/* عرض الشعار الحالي */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gold-700">الشعار الحالي</h3>
            <div className="flex items-center gap-6 p-4 bg-white rounded-lg border border-gold-200">
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-20 w-20 bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl flex items-center justify-center border border-gold-200">
                  <img src="/golden-horse-logo.svg" alt="الشعار الرئيسي" className="h-16 w-16" />
                </div>
                <span className="text-sm font-medium text-gold-700">الشعار الرئيسي</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-16 w-16 bg-gradient-to-br from-gold-50 to-gold-100 rounded-lg flex items-center justify-center border border-gold-200">
                  <img src="/golden-horse-logo-simple.svg" alt="الشعار البسيط" className="h-12 w-12" />
                </div>
                <span className="text-sm font-medium text-gold-700">الشعار البسيط</span>
              </div>
            </div>
          </div>

          {/* رفع شعار جديد */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gold-700">رفع شعار جديد</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* رفع الشعار الرئيسي */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-gold-600" />
                  <span className="font-medium text-gold-700">الشعار الرئيسي</span>
                </div>
                <div className="border-2 border-dashed border-gold-300 rounded-lg p-6 text-center hover:border-gold-400 transition-colors">
                  <Upload className="h-8 w-8 text-gold-400 mx-auto mb-2" />
                  <p className="text-sm text-gold-600 mb-2">اسحب وأفلت ملف SVG هنا</p>
                  <p className="text-xs text-gold-500">أو انقر لاختيار الملف</p>
                  <input
                    type="file"
                    accept=".svg,.png,.jpg,.jpeg"
                    className="hidden"
                    id="main-logo-upload"
                    onChange={(e) => handleLogoUpload(e, 'main')}
                  />
                  <Button
                    variant="outline"
                    className="mt-3 border-gold-300 text-gold-700 hover:bg-gold-50"
                    onClick={() => document.getElementById('main-logo-upload')?.click()}
                  >
                    اختيار ملف
                  </Button>
                </div>
                <p className="text-xs text-gold-600">الأبعاد الموصى بها: 120x120 بكسل</p>
              </div>

              {/* رفع الشعار البسيط */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-gold-600" />
                  <span className="font-medium text-gold-700">الشعار البسيط</span>
                </div>
                <div className="border-2 border-dashed border-gold-300 rounded-lg p-6 text-center hover:border-gold-400 transition-colors">
                  <Upload className="h-8 w-8 text-gold-400 mx-auto mb-2" />
                  <p className="text-sm text-gold-600 mb-2">اسحب وأفلت ملف SVG هنا</p>
                  <p className="text-xs text-gold-500">أو انقر لاختيار الملف</p>
                  <input
                    type="file"
                    accept=".svg,.png,.jpg,.jpeg"
                    className="hidden"
                    id="simple-logo-upload"
                    onChange={(e) => handleLogoUpload(e, 'simple')}
                  />
                  <Button
                    variant="outline"
                    className="mt-3 border-gold-300 text-gold-700 hover:bg-gold-50"
                    onClick={() => document.getElementById('simple-logo-upload')?.click()}
                  >
                    اختيار ملف
                  </Button>
                </div>
                <p className="text-xs text-gold-600">الأبعاد الموصى بها: 80x80 بكسل</p>
              </div>
            </div>
          </div>

          {/* خيارات إضافية */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gold-700">خيارات إضافية</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="border-gold-300 text-gold-700 hover:bg-gold-50"
                onClick={handleResetToDefault}
              >
                <RefreshCw className="h-4 w-4 ml-2" />
                إعادة تعيين للافتراضي
              </Button>
              <Button
                variant="outline"
                className="border-gold-300 text-gold-700 hover:bg-gold-50"
                onClick={handlePreviewLogos}
              >
                <ImageIcon className="h-4 w-4 ml-2" />
                معاينة الشعارات
              </Button>
              <Button
                variant="outline"
                className="border-gold-300 text-gold-700 hover:bg-gold-50"
                onClick={handleDownloadLogos}
              >
                <Download className="h-4 w-4 ml-2" />
                تحميل الشعارات
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><SlidersHorizontal className="h-5 w-5" /> فلاتر</CardTitle>
          <CardDescription>تصفية الإعدادات بحسب الفئة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-64"><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                <SelectItem value="APPROVALS">الموافقات</SelectItem>
                <SelectItem value="ALERTS">التنبيهات</SelectItem>
                <SelectItem value="TAX">الضرائب</SelectItem>
                <SelectItem value="CURRENCY">العملات</SelectItem>
                <SelectItem value="SYSTEM">النظام</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {Object.entries(settings).map(([cat, items]) => (
        <Card key={cat}>
          <CardHeader>
            <CardTitle>{cat}</CardTitle>
            <CardDescription>إعدادات فئة {cat}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((s) => (
              <div key={s.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div className="text-sm">
                  <div className="font-medium">{s.key}</div>
                  <div className="text-gray-500 text-xs">{s.description || '—'}</div>
                </div>
                <Input defaultValue={s.value} onBlur={(e) => updateSetting(s.id, e.target.value)} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateSetting(s.id, (document.querySelector(`input[value='${s.value}']`) as HTMLInputElement)?.value || s.value)}>
                    <Save className="h-4 w-4 ml-2" /> حفظ
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

