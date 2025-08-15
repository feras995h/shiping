"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

type TableToolbarProps = {
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchSubmit?: () => void
  filters?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function TableToolbar({
  searchPlaceholder = "ابحث...",
  searchValue,
  onSearchChange,
  onSearchSubmit,
  filters,
  children,
  className,
}: TableToolbarProps) {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchSubmit?.()
  }

  return (
    <div className={cn("card-premium rounded-2xl p-4 sm:p-5", className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <form onSubmit={onSubmit} className="flex w-full items-center gap-2 md:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pr-10 input-gold"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
            />
          </div>
          <Button type="submit" className="btn-gold hidden sm:inline-flex">بحث</Button>
        </form>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
          {filters ? <div className="flex items-center gap-2">{filters}</div> : null}
          {children ? <div className="flex items-center gap-2">{children}</div> : null}
        </div>
      </div>
    </div>
  )
}

export default TableToolbar
