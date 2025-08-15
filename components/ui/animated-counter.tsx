"use client"

import React, { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface AnimatedCounterProps {
  from?: number
  to: number
  duration?: number
  formatter?: (value: number) => string
  className?: string
  prefix?: string
  suffix?: string
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  formatter = (value) => value.toLocaleString(),
  className = '',
  prefix = '',
  suffix = ''
}: AnimatedCounterProps) {
  const [current, setCurrent] = useState(from)
  const controls = useAnimation()

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

    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.3, ease: "easeInOut" }
    })

    animationFrame = requestAnimationFrame(updateCount)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [from, to, duration, controls])

  return (
    <motion.span 
      animate={controls}
      className={`inline-block ${className}`}
    >
      {prefix}{formatter(current)}{suffix}
    </motion.span>
  )
}

export default AnimatedCounter


