'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Users, Globe, Activity, TrendingUp, Database, RefreshCw } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface StatMetric {
  name: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  icon: string
  color: string
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string | string[]
    borderColor: string | string[]
  }[]
}

interface StatisticsData {
  stats: StatMetric[]
  charts: {
    userGrowth: ChartData
    revenue: ChartData
    systemUsage: ChartData
  }
  period: string
  lastUpdated: string
}

// مكون بسيط للرسم البياني
const SimpleChart = ({ data, type, height }: { data: ChartData, type: string, height: number }) => {
  if (type === 'line') {
    const maxValue = Math.max(...data.datasets[0].data)
    return (
      <div className="h-64 flex items-end justify-between gap-2">
        {data.datasets[0].data.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-xs text-muted-foreground mb-1">
              {data.labels[index]}
            </div>
            <div
              className="w-8 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
              style={{ height: `${(value / maxValue) * 200}px` }}
            />
            <div className="text-xs mt-1">{value}</div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'doughnut') {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gold-600 mb-2">78%</div>
          <div className="text-sm text-muted-foreground">متوسط الاستخدام</div>
        </div>
      </div>
    )
  }

  return null
}

export default function AdminStatisticsPage() {
  const [data, setData] = useState<StatisticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // جلب الإحصائيات
  const fetchStatistics = async (period = selectedPeriod) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/statistics?period=${period}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        toast({
          title: "خطأ",
          description: result.message || "فشل في جلب الإحصائيات",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // تحديث الإحصائيات
  const refreshData = async () => {
    setIsRefreshing(true)
    await fetchStatistics()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  // تغيير الفترة الزمنية
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    fetchStatistics(period)
  }

  useEffect(() => {
    fetchStatistics()
  }, [])

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Users': return <Users className="h-4 w-4" />
      case 'Globe': return <Globe className="h-4 w-4" />
      case 'Activity': return <Activity className="h-4 w-4" />
      case 'TrendingUp': return <TrendingUp className="h-4 w-4" />
      case 'Database': return <Database className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">الإحصائيات</h1>
            <p className="text-sm text-muted-foreground">
              نظرة عامة على أداء النظام والإحصائيات
            </p>
          </div>
        </div>
        
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">جاري تحميل الإحصائيات...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">الإحصائيات</h1>
            <p className="text-sm text-muted-foreground">
              نظرة عامة على أداء النظام والإحصائيات
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="text-center py-20">
            <p className="text-lg text-gray-600 mb-4">فشل في تحميل الإحصائيات</p>
            <Button onClick={() => fetchStatistics()}>إعادة المحاولة</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الإحصائيات</h1>
          <p className="text-sm text-muted-foreground">
            نظرة عامة على أداء النظام والإحصائيات
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">أسبوع</SelectItem>
              <SelectItem value="month">شهر</SelectItem>
              <SelectItem value="quarter">ربع سنة</SelectItem>
              <SelectItem value="year">سنة</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ml-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                {getIconComponent(stat.icon)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Badge 
                  variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                  className="ml-2"
                >
                  {stat.change}
                </Badge>
                <span className="mr-2">من الفترة السابقة</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* الرسوم البيانية */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* نمو المستخدمين */}
        <Card>
          <CardHeader>
            <CardTitle>نمو المستخدمين</CardTitle>
            <CardDescription>عدد المستخدمين الجدد خلال الفترة المحددة</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleChart
              data={data.charts.userGrowth}
              type="line"
              height={300}
            />
          </CardContent>
        </Card>

        {/* الإيرادات */}
        <Card>
          <CardHeader>
            <CardTitle>الإيرادات</CardTitle>
            <CardDescription>الإيرادات خلال الفترة المحددة</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleChart
              data={data.charts.revenue}
              type="line"
              height={300}
            />
          </CardContent>
        </Card>

        {/* استخدام النظام */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>استخدام النظام</CardTitle>
            <CardDescription>نسبة استخدام موارد النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleChart
              data={data.charts.systemUsage}
              type="doughnut"
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* معلومات إضافية */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات إضافية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">آخر تحديث:</span>
              <p className="font-medium">
                {new Date(data.lastUpdated).toLocaleString('ar-LY')}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">الفترة المحددة:</span>
              <p className="font-medium">
                {selectedPeriod === 'week' && 'أسبوع'}
                {selectedPeriod === 'month' && 'شهر'}
                {selectedPeriod === 'quarter' && 'ربع سنة'}
                {selectedPeriod === 'year' && 'سنة'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">إجمالي المقاييس:</span>
              <p className="font-medium">{data.stats.length}</p>
            </div>
            <div>
              <span className="text-muted-foreground">حالة البيانات:</span>
              <Badge variant="default">محدث</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 