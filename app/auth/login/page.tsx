"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Building, Users, Shield, DollarSign } from "lucide-react"
import { useAuth } from "@/lib/store"

export default function LoginPage() {
  const [userType, setUserType] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const router = useRouter()
  const { login } = useAuth()

  const userTypes = [
    {
      value: "admin",
      label: "مدير النظام",
      description: "إدارة شاملة للنظام والمستخدمين",
      icon: Shield,
      color: "from-purple-400 to-purple-600",
      demoCredentials: { username: "sara@company.ly", password: "admin123" }
    },
    {
      value: "financial",
      label: "مدير مالي",
      description: "إدارة الشؤون المالية والمحاسبية",
      icon: DollarSign,
      color: "from-gold-400 to-gold-600",
      demoCredentials: { username: "ahmed@company.ly", password: "financial123" }
    },
    {
      value: "employee",
      label: "موظف",
      description: "إدارة الشحنات والعملاء",
      icon: Users,
      color: "from-blue-400 to-blue-600",
      demoCredentials: { username: "fatima@company.ly", password: "employee123" }
    },
    {
      value: "client",
      label: "عميل",
      description: "متابعة الشحنات والفواتير",
      icon: Building,
      color: "from-orange-400 to-orange-600",
      demoCredentials: { username: "ali@client.ly", password: "client123" }
    }
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await login(username, password, userType)
      
      if (success) {
        // توجيه المستخدم إلى لوحة التحكم المناسبة
        switch (userType) {
          case "admin":
            router.push("/admin/dashboard")
            break
          case "financial":
            router.push("/financial/dashboard")
            break
          case "employee":
            router.push("/employee/dashboard")
            break
          case "client":
            router.push("/client/dashboard")
            break
          default:
            router.push("/")
        }
      } else {
        setError("بيانات الدخول غير صحيحة")
      }
    } catch (error) {
      setError("حدث خطأ أثناء تسجيل الدخول")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (type: string) => {
    const userTypeData = userTypes.find(t => t.value === type)
    if (userTypeData) {
      setUserType(type)
      setUsername(userTypeData.demoCredentials.username)
      setPassword(userTypeData.demoCredentials.password)
    }
  }

  return (
    <div className="min-h-screen bg-gold-gradient flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md space-y-8">
        {/* شعار التطبيق */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl flex items-center justify-center shadow-gold mb-4 border border-gold-200">
            <img src="/golden-horse-logo.svg" alt="شعار الحصان الذهبي" className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold gold-text">الحصان الذهبي للشحن</h1>
          <p className="mt-2 text-slate-600">Golden Horse Shipping - تسجيل الدخول للوصول إلى لوحة التحكم</p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <Card className="shadow-gold-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center">
              اختر نوع المستخدم وأدخل بيانات الدخول
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* اختيار نوع المستخدم */}
              <div className="space-y-2">
                <Label htmlFor="userType">نوع المستخدم</Label>
                <Select value={userType} onValueChange={setUserType} required>
                  <SelectTrigger className="input-gold">
                    <SelectValue placeholder="اختر نوع المستخدم" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* اسم المستخدم */}
              <div className="space-y-2">
                <Label htmlFor="username">البريد الإلكتروني</Label>
                <Input
                  id="username"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-gold"
                  placeholder="أدخل البريد الإلكتروني"
                  required
                />
              </div>

              {/* كلمة المرور */}
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-gold pr-10"
                    placeholder="أدخل كلمة المرور"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-0 h-full px-3 hover:bg-gold-50"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* رسالة الخطأ */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              {/* زر تسجيل الدخول */}
              <Button
                type="submit"
                className="w-full btn-gold"
                disabled={isLoading || !userType || !username || !password}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    جاري تسجيل الدخول...
                  </div>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>

            {/* بيانات تجريبية */}
            <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
              <h3 className="font-semibold text-gold-900 mb-3">بيانات تجريبية</h3>
              <div className="space-y-2">
                {userTypes.map((type) => (
                  <div key={type.value} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${type.color}`}></div>
                      <span className="text-sm text-slate-700">{type.label}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs hover:bg-gold-100"
                      onClick={() => handleDemoLogin(type.value)}
                    >
                      استخدام
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* روابط مساعدة */}
            <div className="text-center space-y-2">
              <Button variant="link" className="text-gold-600 hover:text-gold-700">
                نسيت كلمة المرور؟
              </Button>
              <div className="text-sm text-slate-500">
                هل تحتاج مساعدة؟{" "}
                <Button variant="link" className="text-gold-600 hover:text-gold-700 p-0 h-auto">
                  اتصل بنا
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* معلومات إضافية */}
        <div className="text-center text-sm text-slate-500">
          <p>© 2024 الحصان الذهبي للشحن - Golden Horse Shipping. جميع الحقوق محفوظة.</p>
          <p className="mt-1">الإصدار 2.0 - تم التطوير باستخدام Next.js</p>
        </div>
      </div>
    </div>
  )
} 