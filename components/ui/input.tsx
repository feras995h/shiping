import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-md border-2 border-gold-200/50 px-4 py-3 text-base font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-slate-500 placeholder:font-normal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold-100 focus-visible:border-gold-400 focus-visible:shadow-gold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 hover:border-gold-300 hover:shadow-md",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
