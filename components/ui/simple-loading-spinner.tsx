"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface SimpleLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'gold' | 'minimal'
  className?: string
  text?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const variantClasses = {
  default: 'border-primary',
  gold: 'border-amber-500',
  minimal: 'border-gray-300'
}

export function SimpleLoadingSpinner({ 
  size = 'md', 
  variant = 'default', 
  className,
  text 
}: SimpleLoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-t-transparent",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      
      {text && (
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

export function GoldenSpinner({ 
  size = 'md', 
  className,
  text = "جاري التحميل..." 
}: Omit<SimpleLoadingSpinnerProps, 'variant'>) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative">
        <div
          className={cn(
            "animate-spin rounded-full border-3 border-amber-400 border-t-transparent",
            sizeClasses[size]
          )}
        />
        <div
          className={cn(
            "absolute inset-1 animate-spin rounded-full border-2 border-amber-300 border-b-transparent",
            size === 'sm' && 'inset-0.5',
            size === 'xl' && 'inset-2'
          )}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
      
      {text && (
        <div className="text-center">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300 animate-pulse">
            {text}
          </p>
          <div className="flex justify-center gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function PulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-2", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

export function SkeletonLoader({ 
  lines = 3, 
  className 
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-gradient-to-r from-amber-100 to-amber-200 rounded animate-pulse",
            i === lines - 1 && "w-3/4" // Last line shorter
          )}
        />
      ))}
    </div>
  )
}

export default SimpleLoadingSpinner


