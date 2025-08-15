"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface SimpleAnimatedCardProps {
  children: React.ReactNode
  variant?: 'default' | 'hover' | 'press' | 'gold'
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale'
  delay?: number
  className?: string
  onClick?: () => void
}

export function SimpleAnimatedCard({
  children,
  variant = 'default',
  animation = 'fadeIn',
  delay = 0,
  className,
  onClick,
  ...props
}: SimpleAnimatedCardProps) {
  const animationClass = {
    fadeIn: 'animate-fade-in-up',
    slideUp: 'animate-slide-in-left',
    slideDown: 'animate-slide-in-right',
    slideLeft: 'animate-slide-in-left',
    slideRight: 'animate-slide-in-right',
    scale: 'animate-scale-in'
  }[animation]

  const variantClass = {
    default: 'hover-lift',
    hover: 'hover-lift hover-glow',
    press: 'hover:scale-95 active:scale-90',
    gold: 'hover-lift hover-glow border-amber-200 bg-gradient-to-br from-amber-50 to-white'
  }[variant]

  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-lg border shadow-sm transition-all duration-300",
        animationClass,
        variantClass,
        className
      )}
      style={{ animationDelay: `${delay}s` }}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export function SimpleStaggeredCards({ 
  children, 
  className,
  staggerDelay = 0.1 
}: { 
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
}) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * staggerDelay}s` }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export function SimpleGlowCard({
  children,
  glowColor = "rgb(245 158 11)", // amber-500
  className
}: {
  children: React.ReactNode
  glowColor?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative bg-card rounded-lg border overflow-hidden hover-glow transition-all duration-300",
        className
      )}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default SimpleAnimatedCard


