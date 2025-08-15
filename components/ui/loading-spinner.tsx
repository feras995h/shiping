"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
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

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default', 
  className,
  text 
}: LoadingSpinnerProps) {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className={cn(
          "border-2 border-t-transparent rounded-full",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      
      {text && (
        <motion.p
          variants={pulseVariants}
          animate="animate"
          className="text-sm text-muted-foreground font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

export function GoldenSpinner({ 
  size = 'md', 
  className,
  text = "جاري التحميل..." 
}: Omit<LoadingSpinnerProps, 'variant'>) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={cn(
            "border-3 border-gradient-to-r from-amber-400 via-amber-500 to-amber-600 border-t-transparent rounded-full",
            sizeClasses[size]
          )}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className={cn(
            "absolute inset-1 border-2 border-amber-300 border-b-transparent rounded-full",
            size === 'sm' && 'inset-0.5',
            size === 'xl' && 'inset-2'
          )}
        />
      </div>
      
      {text && (
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
            y: [0, -2, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-center"
        >
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
            {text}
          </p>
          <div className="flex justify-center gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                className="w-1.5 h-1.5 bg-amber-500 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export function PulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-2", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut"
          }}
          className="w-2 h-2 bg-amber-500 rounded-full"
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
        <motion.div
          key={i}
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          className={cn(
            "h-4 bg-gradient-to-r from-amber-100 to-amber-200 rounded",
            i === lines - 1 && "w-3/4" // Last line shorter
          )}
        />
      ))}
    </div>
  )
}

export default LoadingSpinner


