"use client"

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface SimpleProgressRingProps {
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

export function SimpleProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  showText = true,
  text,
  color = "rgb(245 158 11)", // amber-500
  backgroundColor = "rgb(229 231 235)", // gray-200
  duration = 1
}: SimpleProgressRingProps) {
  const [currentProgress, setCurrentProgress] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  const normalizedRadius = (size - strokeWidth) / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (currentProgress / 100) * circumference

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        height={size}
        width={size}
        className="transform -rotate-90 transition-transform duration-300"
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
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center animate-fade-in-up">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(currentProgress)}%
            </div>
            {text && (
              <div className="text-xs text-muted-foreground mt-1">
                {text}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function SimpleAnimatedProgressBar({
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
  const [currentProgress, setCurrentProgress] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn("w-full rounded-full", backgroundColor)}
        style={{ height }}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)}
          style={{ width: `${currentProgress}%` }}
        />
      </div>
      
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
          {Math.round(currentProgress)}%
        </div>
      )}
    </div>
  )
}

export function SimpleSteppedProgress({
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
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                isCompleted && "bg-green-500 text-white scale-110",
                isCurrent && "bg-amber-500 text-white ring-4 ring-amber-200 scale-110",
                isUpcoming && "bg-gray-200 text-gray-500"
              )}
            >
              {isCompleted ? "✓" : index + 1}
            </div>
            
            <div className="ml-2 text-sm">
              <div className={cn(
                "font-medium transition-colors duration-300",
                isCompleted && "text-green-600",
                isCurrent && "text-amber-600",
                isUpcoming && "text-gray-400"
              )}>
                {step}
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-all duration-500",
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SimpleProgressRing



