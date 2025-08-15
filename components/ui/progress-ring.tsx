"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  className?: string
  showText?: boolean
  text?: string
  color?: string
  backgroundColor?: string
  duration?: number
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  showText = true,
  text,
  color = "rgb(245 158 11)", // amber-500
  backgroundColor = "rgb(229 231 235)", // gray-200
  duration = 1
}: ProgressRingProps) {
  const normalizedRadius = (size - strokeWidth) / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        height={size}
        width={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          stroke={backgroundColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        
        {/* Progress circle */}
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{
            duration,
            ease: "easeInOut"
          }}
        />
      </svg>
      
      {showText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: duration / 2, duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: duration / 2 }}
              className="text-2xl font-bold text-foreground"
            >
              {Math.round(progress)}%
            </motion.div>
            {text && (
              <div className="text-xs text-muted-foreground mt-1">
                {text}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export function MultiProgressRing({
  data,
  size = 120,
  strokeWidth = 6,
  className
}: {
  data: Array<{
    value: number
    color: string
    label?: string
  }>
  size?: number
  strokeWidth?: number
  className?: string
}) {
  const normalizedRadius = (size - strokeWidth * data.length) / 2
  const circumference = normalizedRadius * 2 * Math.PI

  let cumulativeValue = 0

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg height={size} width={size} className="transform -rotate-90">
        {data.map((item, index) => {
          const radius = normalizedRadius - (index * strokeWidth)
          const itemCircumference = radius * 2 * Math.PI
          const strokeDasharray = `${itemCircumference} ${itemCircumference}`
          const strokeDashoffset = itemCircumference - (item.value / 100) * itemCircumference

          return (
            <motion.circle
              key={index}
              stroke={item.color}
              fill="transparent"
              strokeWidth={strokeWidth - 1}
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              r={radius}
              cx={size / 2}
              cy={size / 2}
              initial={{ strokeDashoffset: itemCircumference }}
              animate={{ strokeDashoffset }}
              transition={{
                duration: 1,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          )
        })}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold">
            {Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length)}%
          </div>
          <div className="text-xs text-muted-foreground">
            متوسط
          </div>
        </div>
      </div>
    </div>
  )
}

export function AnimatedProgressBar({
  progress,
  height = 8,
  className,
  showText = false,
  color = "bg-amber-500",
  backgroundColor = "bg-gray-200",
  duration = 1
}: {
  progress: number
  height?: number
  className?: string
  showText?: boolean
  color?: string
  backgroundColor?: string
  duration?: number
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn("w-full rounded-full", backgroundColor)}
        style={{ height }}
      >
        <motion.div
          className={cn("h-full rounded-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration, ease: "easeOut" }}
        />
      </div>
      
      {showText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: duration / 2 }}
          className="absolute inset-0 flex items-center justify-center text-xs font-medium"
        >
          {Math.round(progress)}%
        </motion.div>
      )}
    </div>
  )
}

export function SteppedProgress({
  steps,
  currentStep,
  className
}: {
  steps: string[]
  currentStep: number
  className?: string
}) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isUpcoming = index > currentStep

        return (
          <div key={index} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: isCurrent ? 1.2 : 1,
                opacity: isCompleted || isCurrent ? 1 : 0.5
              }}
              transition={{ duration: 0.3 }}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                isCompleted && "bg-green-500 text-white",
                isCurrent && "bg-amber-500 text-white ring-4 ring-amber-200",
                isUpcoming && "bg-gray-200 text-gray-500"
              )}
            >
              {isCompleted ? "✓" : index + 1}
            </motion.div>
            
            <div className="ml-2 text-sm">
              <div className={cn(
                "font-medium",
                isCompleted && "text-green-600",
                isCurrent && "text-amber-600",
                isUpcoming && "text-gray-400"
              )}>
                {step}
              </div>
            </div>

            {index < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isCompleted ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 h-0.5 bg-green-500 mx-4 origin-left"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ProgressRing


