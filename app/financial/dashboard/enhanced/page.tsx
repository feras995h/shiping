"use client"

import { useEffect, useState } from "react"
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, 
  PieChart, Activity, RefreshCw, Settings, Bell,
  Calculator, Target, Eye, Filter, Calendar,
  ArrowUpRight, ArrowDownRight, Wallet, CreditCard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useGlStore } from "@/lib/gl-store"
import { useGlTransactions } from "@/lib/gl-transactions"

// المكونات المتقدمة
import SimpleAdvancedFinancialDashboard from "@/components/financial/simple-advanced-financial-dashboard"
import EnhancedFinancialStats from "@/components/financial/enhanced-financial-stats"
import FinancialNotifications from "@/components/financial/financial-notifications"
import FinancialAlertsPanel from "@/components/financial/financial-alerts-panel"
import SyncButton from "@/components/financial/sync-button"

// المكونات المتحركة
import { SimpleAnimatedCard, SimpleStaggeredCards } from "@/components/ui/simple-animated-card"
import { SimpleAnimatedCounter } from "@/components/ui/simple-animated-counter"
import { SimpleProgressRing } from "@/components/ui/simple-progress-ring"
import { GoldenSpinner } from "@/components/ui/simple-loading-spinner"

export default function EnhancedFinancialDashboard() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [refreshing, setRefreshing] = useState(false)

  const gl = useGlStore()
  const tx = useGlTransactions()

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)
        gl.initializeChartIfEmpty()
        // محاكاة تحميل البيانات
        await new Promise(resolve => setTimeout(resolve, 1500))
      } catch (error) {
        console.error('خطأ في تحميل البيانات:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  const balances = tx.computeBalances()
  
  // حساب المقاييس المالية
  const { revenueTotal, expenseTotal, cashLikeTotal, netProfit } = (() => {
    let revenue = 0
    let expense = 0
    let cashLike = 0
    
    for (const acc of gl.accounts) {
      const bal = balances[acc.id] || 0
      if (acc.rootType === 'REVENUE') revenue += -bal
      if (acc.rootType === 'EXPENSE') expense += bal
      if (acc.code.startsWith('1.1.1')) cashLike += bal
    }
    
    const netProfit = Math.max(0, revenue) - Math.max(0, expense)
    
    return { 
      revenueTotal: Math.max(0, revenue), 
      expenseTotal: Math.max(0, expense), 
      cashLikeTotal: cashLike,
      netProfit
    }
  })()

  // إعداد بيانات الإحصائيات المحسنة
  const enhancedStats = [
    {
      title: 'إجمالي الإيرادات',
      value: revenueTotal,
      currency: 'د.ل',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-green-600',
      progress: 75,
      target: revenueTotal * 1.2
    },
    {
      title: 'إجمالي المصروفات',
      value: expenseTotal,
      currency: 'د.ل',
      change: '-8.3%',
      changeType: 'negative' as const,
      icon: TrendingDown,
      color: 'text-red-600',
      progress: 65
    },
    {
      title: 'صافي الربح',
      value: netProfit,
      currency: 'د.ل',
      change: '+18.7%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-blue-600',
      progress: 80,
      target: netProfit * 1.15
    },
    {
      title: 'السيولة النقدية',
      value: cashLikeTotal,
      currency: 'د.ل',
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: Wallet,
      color: 'text-purple-600',
      progress: 60
    }
  ]

  const refreshData = async () => {
    setRefreshing(true)
    try {
      // محاكاة تحديث البيانات
      await new Promise(resolve => setTimeout(resolve, 2000))
      gl.initializeChartIfEmpty()
    } catch (error) {
      console.error('خطأ في تحديث البيانات:', error)
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-50">
        <GoldenSpinner size="xl" text="جاري تحميل لوحة التحكم المالية المتقدمة..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient-gold">
              لوحة التحكم المالية المتقدمة
            </h1>
            <p className="text-lg text-muted-foreground">
              نظام إدارة مالية ذكي مع تحليلات متقدمة ومراقبة فورية
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline" className="bg-green-100 text-green-700">
                النظام نشط
              </Badge>
              <span>آخر تحديث: {new Date().toLocaleString('ar-EG')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <SyncButton />
            <Button
              variant="outline"
              onClick={refreshData}
              disabled={refreshing}
              className="hover-glow"
            >
              <RefreshCw className={`h-4 w-4 ml-2 ${refreshing ? 'animate-spin' : ''}`} />
              تحديث شامل
            </Button>
            <Button variant="default" className="gradient-gold">
              <Settings className="h-4 w-4 ml-2" />
              الإعدادات
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <EnhancedFinancialStats stats={enhancedStats} loading={refreshing} />

                  {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SimpleAnimatedCard variant="gold" className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-500" />
                نظرة عامة على الأداء المالي
              </CardTitle>
              <CardDescription>
                مؤشرات الأداء الرئيسية والاتجاهات المالية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <SimpleProgressRing
                    progress={75}
                    size={120}
                    text="الربحية"
                    color="rgb(34 197 94)"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    معدل الربحية الإجمالية
                  </p>
                </div>
                
                <div className="text-center">
                  <SimpleProgressRing
                    progress={80}
                    size={120}
                    text="الأداء"
                    color="rgb(59 130 246)"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    مؤشرات الأداء العامة
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">العائد على الاستثمار</span>
                    <Badge className="bg-green-100 text-green-700">+15.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">معدل النمو</span>
                    <Badge className="bg-blue-100 text-blue-700">+12.8%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">الاستقرار المالي</span>
                    <Badge className="bg-amber-100 text-amber-700">ممتاز</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">التدفق النقدي</span>
                    <Badge className="bg-green-100 text-green-700">إيجابي</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </SimpleAnimatedCard>

          <SimpleAnimatedCard variant="hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                الأهداف والإنجازات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>هدف الإيرادات الشهري</span>
                  <span className="font-medium">112%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '112%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>تحكم في المصروفات</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>هدف الربح الصافي</span>
                  <span className="font-medium">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>

                              <div className="pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    <SimpleAnimatedCounter to={98} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground">إجمالي الأداء</div>
                </div>
              </div>
            </CardContent>
          </SimpleAnimatedCard>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              التحليل المتقدم
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              الإشعارات
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              التنبيهات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SimpleAnimatedCard variant="gold">
                <CardHeader>
                  <CardTitle>التحليل السريع</CardTitle>
                  <CardDescription>مؤشرات مالية مهمة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        <SimpleAnimatedCounter to={revenueTotal} formatter={(v) => `${(v/1000).toFixed(0)}K`} />
                      </div>
                      <div className="text-xs text-green-700">إيرادات (ألف)</div>
                    </div>
                    
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="text-lg font-bold text-red-600">
                        <SimpleAnimatedCounter to={expenseTotal} formatter={(v) => `${(v/1000).toFixed(0)}K`} />
                      </div>
                      <div className="text-xs text-red-700">مصروفات (ألف)</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        <SimpleAnimatedCounter to={netProfit} formatter={(v) => `${(v/1000).toFixed(0)}K`} />
                      </div>
                      <div className="text-xs text-blue-700">ربح صافي (ألف)</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-lg font-bold text-purple-600">
                        <SimpleAnimatedCounter to={cashLikeTotal} formatter={(v) => `${(v/1000).toFixed(0)}K`} />
                      </div>
                      <div className="text-xs text-purple-700">سيولة (ألف)</div>
                    </div>
                  </div>
                </CardContent>
              </SimpleAnimatedCard>

              <SimpleAnimatedCard variant="hover">
                <CardHeader>
                  <CardTitle>الاتجاهات المالية</CardTitle>
                  <CardDescription>تحليل الأداء خلال الفترة الماضية</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="font-medium">نمو الإيرادات</span>
                      </div>
                      <Badge className="bg-green-600 text-white">+12.5%</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingDown className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">تحسن المصروفات</span>
                      </div>
                      <Badge className="bg-blue-600 text-white">-8.3%</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-amber-600" />
                        <span className="font-medium">تحسن الربحية</span>
                      </div>
                      <Badge className="bg-amber-600 text-white">+18.7%</Badge>
                    </div>
                  </div>
                </CardContent>
              </SimpleAnimatedCard>
            </div>
          </TabsContent>

          <TabsContent value="advanced">
            <SimpleAdvancedFinancialDashboard />
          </TabsContent>

          <TabsContent value="notifications">
            <FinancialNotifications />
          </TabsContent>

          <TabsContent value="alerts">
            <FinancialAlertsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
