"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: React.ReactNode
  subtitle?: React.ReactNode
  breadcrumb?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, breadcrumb, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("card-premium rounded-2xl p-6 sm:p-8", className)}>
      {breadcrumb ? <div className="mb-3 text-xs text-gold-700/80">{breadcrumb}</div> : null}
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-right">
          <h1 className="gold-text text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h1>
          {subtitle ? (
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center justify-center gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}

export default PageHeader
