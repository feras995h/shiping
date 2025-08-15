import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-gold hover:from-gold-600 hover:to-gold-700 hover:shadow-gold-large hover:scale-105 rounded-xl",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:scale-105 rounded-xl",
        outline:
          "border-2 border-gold-300 bg-white/80 backdrop-blur-sm text-gold-700 hover:bg-gold-50 hover:border-gold-400 hover:shadow-gold rounded-xl",
        secondary:
          "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 hover:shadow-md hover:scale-105 rounded-xl",
        ghost:
          "text-gold-700 hover:bg-gradient-to-r hover:from-gold-50 hover:to-amber-50 hover:text-gold-800 hover:shadow-md rounded-xl",
        link: "text-gold-700 underline-offset-4 hover:underline hover:text-gold-800",
        glass:
          "bg-white/50 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-100 hover:bg-white/70 dark:hover:bg-white/20 hover:shadow-lg rounded-xl",
        luxury:
          "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-white shadow-gold-large hover:shadow-glow hover:scale-105 rounded-2xl border border-gold-300/50",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 px-4 py-2 text-xs rounded-lg",
        lg: "h-12 px-8 py-3.5 text-base rounded-xl",
        xl: "h-14 px-10 py-4 text-lg rounded-2xl",
        icon: "h-11 w-11 rounded-xl",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
