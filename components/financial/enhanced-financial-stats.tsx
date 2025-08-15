"use client"

import React from "react"
import { 
  TrendingUp, TrendingDown, PiggyBank, Building2, 
  ArrowUpRight, ArrowDownRight, Activity, DollarSign 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleAnimatedCard, SimpleStaggeredCards } from "@/components/ui/simple-animated-card"
import { SimpleAnimatedCounter } from "@/components/ui/simple-animated-counter"
import { SimpleProgressRing, SimpleAnimatedProgressBar } from "@/components/ui/simple-progress-ring"
import { Badge } from "@/components/ui/badge"

interface FinancialStat {
  title: string
  value: number
  currency?: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: any
  color: string
  progress?: number
  target?: number
}

interface EnhancedFinancialStatsProps {
  stats: FinancialStat[]
  loading?: boolean
}

export default function EnhancedFinancialStats({ 
  stats, 
  loading = false 
}: EnhancedFinancialStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="card-premium animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <SimpleStaggeredCards className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <SimpleAnimatedCard 
          key={index} 
          variant="gold" 
          animation="slideUp" 
          delay={index * 0.1} 
          className="card-premium hover-lift group"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-800 transition-colors">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300`}>
              <stat.icon className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* القيمة الرئيسية */}
              <div className="flex items-baseline gap-2">
                <SimpleAnimatedCounter 
                  to={stat.value}
                  className="text-2xl font-bold text-gradient-gold"
                  formatter={(value) => value.toLocaleString()}
                />
                {stat.currency && (
                  <span className="text-sm text-muted-foreground">{stat.currency}</span>
                )}
              </div>

              {/* مؤشر التغيير */}
              <div className="flex items-center justify-between">
                <div className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' ? 'bg-green-100 text-green-700' : 
                  stat.changeType === 'negative' ? 'bg-red-100 text-red-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  {stat.changeType === 'positive' ? <TrendingUp className="h-3 w-3" /> : 
                   stat.changeType === 'negative' ? <TrendingDown className="h-3 w-3" /> : 
                   <Activity className="h-3 w-3" />}
                  {stat.change}
                </div>
                
                {stat.changeType === 'positive' && (
                  <Badge variant="default" className="bg-green-100 text-green-700 text-xs">
                    نمو
                  </Badge>
                )}
                {stat.changeType === 'negative' && stat.change.includes('-') && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                    توفير
                  </Badge>
                )}
              </div>

              {/* شريط التقدم إذا توفر */}
              {stat.progress !== undefined && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>التقدم</span>
                    <span>{stat.progress}%</span>
                  </div>
                  <SimpleAnimatedProgressBar
                    progress={stat.progress}
                    color={
                      stat.changeType === 'positive' ? 'bg-green-500' :
                      stat.changeType === 'negative' ? 'bg-red-500' :
                      'bg-amber-500'
                    }
                    className="h-2"
                  />
                </div>
              )}

              {/* الهدف إذا توفر */}
              {stat.target && (
                <div className="text-xs text-muted-foreground">
                  الهدف: {stat.target.toLocaleString()} {stat.currency}
                </div>
              )}
            </div>
          </CardContent>
        </SimpleAnimatedCard>
      ))}
    </SimpleStaggeredCards>
  )
}

// مكون إحصائيات مالية متقدمة مع رسوم بيانية دائرية
export function AdvancedFinancialStats({ 
  stats, 
  loading = false 
}: EnhancedFinancialStatsProps) {
  if (loading) {
    return <EnhancedFinancialStats stats={[]} loading={true} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <SimpleAnimatedCard 
          key={index} 
          variant="hover" 
          animation="scale" 
          delay={index * 0.15} 
          className="card-premium group"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-slate-700 transition-colors">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <SimpleAnimatedCounter 
                    to={stat.value}
                    className="text-xl font-bold text-slate-900"
                    formatter={(value) => value.toLocaleString()}
                  />
                  {stat.currency && (
                    <span className="text-xs text-muted-foreground">{stat.currency}</span>
                  )}
                </div>
              </div>
              
              {stat.progress !== undefined ? (
                <SimpleProgressRing
                  progress={stat.progress}
                  size={60}
                  strokeWidth={4}
                  showText={false}
                  color={
                    stat.changeType === 'positive' ? 'rgb(34 197 94)' :
                    stat.changeType === 'negative' ? 'rgb(239 68 68)' :
                    'rgb(245 158 11)'
                  }
                />
              ) : (
                <div className={`p-3 rounded-full ${
                  stat.changeType === 'positive' ? 'bg-green-100' :
                  stat.changeType === 'negative' ? 'bg-red-100' :
                  'bg-amber-100'
                }`}>
                  <stat.icon className={`h-5 w-5 ${
                    stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'negative' ? 'text-red-600' :
                    'text-amber-600'
                  }`} />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className={`text-xs flex items-center gap-1 ${
                stat.changeType === 'positive' ? 'text-green-600' : 
                stat.changeType === 'negative' ? 'text-red-600' : 
                'text-slate-600'
              }`}>
                {stat.changeType === 'positive' ? <ArrowUpRight className="h-3 w-3" /> : 
                 stat.changeType === 'negative' ? <ArrowDownRight className="h-3 w-3" /> : 
                 <Activity className="h-3 w-3" />}
                {stat.change}
              </div>
              
              {stat.progress !== undefined && (
                <span className="text-xs font-medium text-slate-600">
                  {stat.progress}%
                </span>
              )}
            </div>
          </CardContent>
        </SimpleAnimatedCard>
      ))}
    </div>
  )
}
