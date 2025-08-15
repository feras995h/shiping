"use client"

import React, { useEffect, useState } from 'react'

interface SimpleAnimatedCounterProps {
  from?: number
  to: number
  duration?: number
  formatter?: (value: number) => string
  className?: string
  prefix?: string
  suffix?: string
}

export function SimpleAnimatedCounter({
  from = 0,
  to,
  duration = 2,
  formatter = (value) => value.toLocaleString(),
  className = '',
  prefix = '',
  suffix = ''
}: SimpleAnimatedCounterProps) {
  const [current, setCurrent] = useState(from)

  useEffect(() => {
    let animationFrame: number
    const startTime = Date.now()
    const change = to - from

    const updateCount = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      
      // Easing function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      
      const newValue = from + (change * easedProgress)
      setCurrent(Math.round(newValue))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount)
      }
    }

    animationFrame = requestAnimationFrame(updateCount)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [from, to, duration])

  return (
    <span className={`inline-block transition-transform duration-300 hover:scale-105 ${className}`}>
      {prefix}{formatter(current)}{suffix}
    </span>
  )
}

export default SimpleAnimatedCounter



