"use client"

import React, { useState, useEffect } from "react"
import { 
  TrendingUp, TrendingDown, DollarSign, AlertCircle, 
  BarChart3, PieChart, Activity, RefreshCw, Eye,
  Calculator, Target, Zap, Shield, CheckCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SimpleAnimatedCounter } from "@/components/ui/simple-animated-counter"
import { SimpleProgressRing, SimpleAnimatedProgressBar } from "@/components/ui/simple-progress-ring"
import { SimpleAnimatedCard, SimpleStaggeredCards } from "@/components/ui/simple-animated-card"
import { GoldenSpinner } from "@/components/ui/simple-loading-spinner"

interface FinancialMetrics {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  cashFlow: number
  accountsReceivable: number
  accountsPayable: number
  workingCapital: number
}

interface FinancialRatio {
  name: string
  value: number
  benchmark: number
  status: 'excellent' | 'good' | 'fair' | 'poor'
  trend: 'up' | 'down' | 'stable'
  category: 'liquidity' | 'profitability' | 'leverage' | 'efficiency'
}

interface CashFlowData {
  operatingCashFlow: number
  investingCashFlow: number
  financingCashFlow: number
  netCashFlow: number
  beginningCash: number
  endingCash: number
}

export default function SimpleAdvancedFinancialDashboard() {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null)
  const [ratios, setRatios] = useState<FinancialRatio[]>([])
  const [cashFlow, setCashFlow] = useState<CashFlowData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const fetchFinancialData = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true)
      else setLoading(true)

      // محاكاة البيانات المالية
      const mockMetrics: FinancialMetrics = {
        totalRevenue: 450000,
        totalExpenses: 320000,
        netProfit: 130000,
        profitMargin: 28.9,
        cashFlow: 85000,
        accountsReceivable: 125000,
        accountsPayable: 75000,
        workingCapital: 50000
      }

      const mockRatios: FinancialRatio[] = [
        { name: 'النسبة المتداولة', value: 2.1, benchmark: 2.0, status: 'excellent', trend: 'up', category: 'liquidity' },
        { name: 'النسبة السريعة', value: 1.8, benchmark: 1.0, status: 'excellent', trend: 'up', category: 'liquidity' },
        { name: 'هامش الربح الصافي', value: 28.9, benchmark: 15.0, status: 'excellent', trend: 'up', category: 'profitability' },
        { name: 'العائد على الأصول', value: 12.5, benchmark: 8.0, status: 'excellent', trend: 'stable', category: 'profitability' },
        { name: 'العائد على حقوق الملكية', value: 18.2, benchmark: 15.0, status: 'good', trend: 'up', category: 'profitability' },
        { name: 'نسبة الدين إلى حقوق الملكية', value: 0.4, benchmark: 0.5, status: 'excellent', trend: 'down', category: 'leverage' }
      ]

      const mockCashFlow: CashFlowData = {
        operatingCashFlow: 95000,
        investingCashFlow: -25000,
        financingCashFlow: -15000,
        netCashFlow: 55000,
        beginningCash: 80000,
        endingCash: 135000
      }

      // محاكاة تأخير التحميل
      await new Promise(resolve => setTimeout(resolve, 1000))

      setMetrics(mockMetrics)
      setRatios(mockRatios)
      setCashFlow(mockCashFlow)

    } catch (error) {
      console.error('خطأ في جلب البيانات المالية:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchFinancialData()
    
    // تحديث البيانات كل 10 دقائق
    const interval = setInterval(() => fetchFinancialData(true), 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'fair': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'liquidity': return <DollarSign className="h-4 w-4" />
      case 'profitability': return <TrendingUp className="h-4 w-4" />
      case 'leverage': return <BarChart3 className="h-4 w-4" />
      case 'efficiency': return <Target className="h-4 w-4" />
      default: return <Calculator className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <GoldenSpinner size="lg" text="جاري تحميل البيانات المالية..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient-gold">لوحة التحكم المالية المتقدمة</h2>
          <p className="text-muted-foreground">تحليل شامل للوضع المالي والأداء</p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchFinancialData(true)}
          disabled={refreshing}
          className="hover-glow"
        >
          <RefreshCw className={`h-4 w-4 ml-2 ${refreshing ? 'animate-spin' : ''}`} />
          تحديث البيانات
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass-gold">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="ratios" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            النسب المالية
          </TabsTrigger>
          <TabsTrigger value="cashflow" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            التدفق النقدي
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            التحليل المتقدم
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SimpleAnimatedCard variant="gold" animation="slideUp" className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                    <SimpleAnimatedCounter
                      to={metrics.totalRevenue}
                      className="text-2xl font-bold text-green-600"
                      suffix=" د.ل"
                    />
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <SimpleAnimatedProgressBar
                    progress={75}
                    color="bg-green-500"
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">+12% من الشهر الماضي</p>
                </div>
              </SimpleAnimatedCard>

              <SimpleAnimatedCard variant="gold" animation="slideUp" delay={0.1} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي المصروفات</p>
                    <SimpleAnimatedCounter
                      to={metrics.totalExpenses}
                      className="text-2xl font-bold text-red-600"
                      suffix=" د.ل"
                    />
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <SimpleAnimatedProgressBar
                    progress={60}
                    color="bg-red-500"
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">-5% من الشهر الماضي</p>
                </div>
              </SimpleAnimatedCard>

              <SimpleAnimatedCard variant="gold" animation="slideUp" delay={0.2} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">صافي الربح</p>
                    <SimpleAnimatedCounter
                      to={metrics.netProfit}
                      className="text-2xl font-bold text-blue-600"
                      suffix=" د.ل"
                    />
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <SimpleAnimatedProgressBar
                    progress={metrics.profitMargin}
                    color="bg-blue-500"
                    className="h-2"
                    showText={true}
                  />
                  <p className="text-xs text-muted-foreground mt-1">هامش الربح: {metrics.profitMargin.toFixed(1)}%</p>
                </div>
              </SimpleAnimatedCard>

              <SimpleAnimatedCard variant="gold" animation="slideUp" delay={0.3} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">التدفق النقدي</p>
                    <SimpleAnimatedCounter
                      to={metrics.cashFlow}
                      className={`text-2xl font-bold ${metrics.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      suffix=" د.ل"
                    />
                  </div>
                  <div className={`p-3 rounded-full ${metrics.cashFlow >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Activity className={`h-6 w-6 ${metrics.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                </div>
                <div className="mt-4">
                  <Badge variant={metrics.cashFlow >= 0 ? "default" : "destructive"} className="text-xs">
                    {metrics.cashFlow >= 0 ? 'تدفق إيجابي' : 'تدفق سالب'}
                  </Badge>
                </div>
              </SimpleAnimatedCard>
            </div>
          )}

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleAnimatedCard variant="hover" className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-amber-500" />
                  توزيع الأداء المالي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <SimpleProgressRing
                    progress={metrics?.profitMargin || 0}
                    size={150}
                    text="هامش الربح"
                    color="rgb(245 158 11)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {((metrics?.totalRevenue || 0) / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-muted-foreground">إيرادات (ألف د.ل)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      {((metrics?.totalExpenses || 0) / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-muted-foreground">مصروفات (ألف د.ل)</div>
                  </div>
                </div>
              </CardContent>
            </SimpleAnimatedCard>

            <SimpleAnimatedCard variant="hover" className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-500" />
                  مؤشرات الصحة المالية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">السيولة</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700">ممتاز</Badge>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">الربحية</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-700">جيد</Badge>
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">الاستقرار</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-700">مقبول</Badge>
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">النمو</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700">ممتاز</Badge>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </SimpleAnimatedCard>
          </div>
        </TabsContent>

        {/* Financial Ratios Tab */}
        <TabsContent value="ratios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ratios.map((ratio, index) => (
              <SimpleAnimatedCard
                key={ratio.name}
                variant="hover"
                animation="fadeIn"
                delay={index * 0.1}
                className="p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(ratio.category)}
                    <h3 className="font-semibold">{ratio.name}</h3>
                  </div>
                  {getTrendIcon(ratio.trend)}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {ratio.value.toFixed(2)}
                    </span>
                    <Badge className={getStatusColor(ratio.status)}>
                      {ratio.status === 'excellent' ? 'ممتاز' :
                       ratio.status === 'good' ? 'جيد' :
                       ratio.status === 'fair' ? 'مقبول' : 'ضعيف'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>المعيار</span>
                      <span>{ratio.benchmark}</span>
                    </div>
                    <SimpleAnimatedProgressBar
                      progress={Math.min(100, (ratio.value / ratio.benchmark) * 100)}
                      color={
                        ratio.status === 'excellent' ? 'bg-green-500' :
                        ratio.status === 'good' ? 'bg-blue-500' :
                        ratio.status === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </SimpleAnimatedCard>
            ))}
          </div>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cashflow" className="space-y-6">
          {cashFlow && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SimpleAnimatedCard variant="gold" className="p-6">
                <CardHeader>
                  <CardTitle>التدفقات النقدية</CardTitle>
                  <CardDescription>تحليل مصادر واستخدامات النقدية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span>الأنشطة التشغيلية</span>
                    <span className="font-bold text-green-600">
                      {cashFlow.operatingCashFlow.toLocaleString()} د.ل
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span>الأنشطة الاستثمارية</span>
                    <span className="font-bold text-blue-600">
                      {cashFlow.investingCashFlow.toLocaleString()} د.ل
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span>الأنشطة التمويلية</span>
                    <span className="font-bold text-purple-600">
                      {cashFlow.financingCashFlow.toLocaleString()} د.ل
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <span className="font-semibold">صافي التدفق النقدي</span>
                      <span className={`font-bold ${cashFlow.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {cashFlow.netCashFlow.toLocaleString()} د.ل
                      </span>
                    </div>
                  </div>
                </CardContent>
              </SimpleAnimatedCard>

              <SimpleAnimatedCard variant="hover" className="p-6">
                <CardHeader>
                  <CardTitle>رصيد النقدية</CardTitle>
                  <CardDescription>تطور رصيد النقدية خلال الفترة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <SimpleProgressRing
                        progress={Math.min(100, (cashFlow.endingCash / (cashFlow.beginningCash || 1)) * 100)}
                        size={120}
                        text="نمو النقدية"
                        color="rgb(59 130 246)"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-lg font-bold text-slate-600">
                          {cashFlow.beginningCash.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">رصيد بداية الفترة</div>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <div className="text-lg font-bold text-amber-600">
                          {cashFlow.endingCash.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">رصيد نهاية الفترة</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </SimpleAnimatedCard>
            </div>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleAnimatedCard variant="gold" className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  التوصيات الذكية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-semibold text-green-700">نقطة قوة</span>
                    </div>
                    <p className="text-sm text-green-600">
                      التدفق النقدي التشغيلي إيجابي ومستقر، مما يدل على قوة العمليات الأساسية.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold text-yellow-700">توصية</span>
                    </div>
                    <p className="text-sm text-yellow-600">
                      يُنصح بتحسين إدارة المخزون لتحرير رأس المال العامل.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold text-blue-700">فرصة</span>
                    </div>
                    <p className="text-sm text-blue-600">
                      هناك إمكانية لزيادة الربحية من خلال تحسين هوامش الربح في الخدمات الجديدة.
                    </p>
                  </div>
                </div>
              </CardContent>
            </SimpleAnimatedCard>

            <SimpleAnimatedCard variant="hover" className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-amber-500" />
                  مؤشرات الأداء الرئيسية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">معدل نمو الإيرادات</span>
                      <span className="text-sm font-bold text-green-600">+12%</span>
                    </div>
                    <SimpleAnimatedProgressBar progress={75} color="bg-green-500" className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">كفاءة التكلفة</span>
                      <span className="text-sm font-bold text-blue-600">85%</span>
                    </div>
                    <SimpleAnimatedProgressBar progress={85} color="bg-blue-500" className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">رضا العملاء المالي</span>
                      <span className="text-sm font-bold text-purple-600">92%</span>
                    </div>
                    <SimpleAnimatedProgressBar progress={92} color="bg-purple-500" className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">الاستقرار المالي</span>
                      <span className="text-sm font-bold text-amber-600">88%</span>
                    </div>
                    <SimpleAnimatedProgressBar progress={88} color="bg-amber-500" className="h-2" />
                  </div>
                </div>
              </CardContent>
            </SimpleAnimatedCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


