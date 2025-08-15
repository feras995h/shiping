"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface KpiCard {
  title: string
  value: string
  change?: string
  icon: LucideIcon
  color: string
}

interface KpiGridProps {
  kpis: KpiCard[]
  className?: string
}

export function KpiGrid({ kpis, className = "" }: KpiGridProps) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 xl:grid-cols-4 ${className}`}>
      {kpis.map((kpi, i) => (
        <Card key={i} className="card-premium hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{kpi.title}</CardTitle>
            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{kpi.value}</div>
            {kpi.change ? <div className="text-xs text-slate-500">{kpi.change}</div> : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 