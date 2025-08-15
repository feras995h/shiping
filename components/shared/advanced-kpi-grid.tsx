"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AdvancedKPICard {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: any
  color: string
  currency?: string
  trend?: {
    data: number[]
    labels: string[]
  }
  target?: string
  status?: 'on-track' | 'behind' | 'ahead'
}

interface AdvancedKPIGridProps {
  kpis: AdvancedKPICard[]
  showTrends?: boolean
  showCharts?: boolean
  refreshInterval?: number
  className?: string
  columns?: 2 | 3 | 4 | 6
}

export function AdvancedKPIGrid({ 
  kpis, 
  showTrends = true, 
  showCharts = false, 
  refreshInterval = 30000,
  className = "",
  columns = 4
}: AdvancedKPIGridProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval])

  const getGridCols = () => {
    switch (columns) {
      case 2: return "sm:grid-cols-2"
      case 3: return "sm:grid-cols-2 lg:grid-cols-3"
      case 4: return "sm:grid-cols-2 xl:grid-cols-4"
      case 6: return "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      default: return "sm:grid-cols-2 xl:grid-cols-4"
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'on-track': return 'text-green-600'
      case 'behind': return 'text-red-600'
      case 'ahead': return 'text-blue-600'
      default: return 'text-slate-600'
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'on-track': return TrendingUp
      case 'behind': return TrendingDown
      case 'ahead': return Activity
      default: return Activity
    }
  }

  const renderTrendChart = (trend?: { data: number[], labels: string[] }) => {
    if (!trend || !showCharts) return null

    const maxValue = Math.max(...trend.data)
    const minValue = Math.min(...trend.data)

    return (
      <div className="mt-2 h-8 flex items-end gap-1">
        {trend.data.map((value, index) => {
          const height = maxValue === minValue ? 50 : ((value - minValue) / (maxValue - minValue)) * 100
          return (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-slate-200 to-slate-300 rounded-sm"
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn("grid gap-6", getGridCols(), className)}>
      {kpis.map((kpi, index) => (
        <Card key={index} className="card-premium hover-lift transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
              {kpi.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              {kpi.status && (
                React.createElement(getStatusIcon(kpi.status), { className: cn("h-3 w-3", getStatusColor(kpi.status)) })
              )}
              <kpi.icon className={cn("h-4 w-4", kpi.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                {kpi.value} {kpi.currency && kpi.currency}
              </div>
              
              <div className="flex items-center justify-between">
                {kpi.change && (
                  <div className={`flex items-center text-xs ${
                    kpi.changeType === "positive" ? "text-green-600" : 
                    kpi.changeType === "negative" ? "text-red-600" : "text-slate-600"
                  }`}>
                    {kpi.changeType === "positive" ? (
                      <ArrowUpRight className="h-3 w-3 ml-1" />
                    ) : kpi.changeType === "negative" ? (
                      <ArrowDownRight className="h-3 w-3 ml-1" />
                    ) : null}
                    {kpi.change}
                  </div>
                )}
                
                {kpi.target && (
                  <div className="text-xs text-slate-500">
                    الهدف: {kpi.target}
                  </div>
                )}
              </div>

              {showTrends && renderTrendChart(kpi.trend)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 