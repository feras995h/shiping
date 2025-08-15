import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 hover:scale-105 animate-fade-in",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-gold-400 to-gold-500 text-white shadow-gold border border-gold-300/50 hover:from-gold-500 hover:to-gold-600 hover:shadow-gold-large",
        secondary: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-300/50 hover:from-slate-200 hover:to-slate-300 hover:shadow-md",
        destructive: "bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg border border-red-300/50 hover:from-red-500 hover:to-red-600 hover:shadow-xl",
        outline: "bg-white/80 backdrop-blur-md border-2 border-gold-300 text-gold-700 hover:bg-gold-50 hover:border-gold-400 hover:shadow-gold",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-gray-800 hover:bg-white/20 hover:shadow-lg",
        success: "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg border border-green-300/50 hover:from-green-500 hover:to-green-600",
        warning: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg border border-yellow-300/50 hover:from-yellow-500 hover:to-yellow-600",
        info: "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg border border-blue-300/50 hover:from-blue-500 hover:to-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
