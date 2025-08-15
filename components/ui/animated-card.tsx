"use client"

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  variant?: 'default' | 'hover' | 'press' | 'gold'
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'flip'
  delay?: number
  duration?: number
  className?: string
}

const variants = {
  default: {
    hover: { y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
    tap: { scale: 0.98 }
  },
  hover: {
    hover: { 
      y: -4, 
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  },
  press: {
    tap: { scale: 0.95, y: 1 }
  },
  gold: {
    hover: { 
      y: -3,
      boxShadow: "0 8px 25px rgba(245,158,11,0.25)",
      borderColor: "rgb(245 158 11)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  }
}

const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 }
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 }
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 }
  },
  flip: {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 }
  }
}

export function AnimatedCard({
  children,
  variant = 'default',
  animation = 'fadeIn',
  delay = 0,
  duration = 0.3,
  className,
  ...props
}: AnimatedCardProps) {
  const cardVariants = variants[variant]
  const animationVariants = animations[animation]

  return (
    <motion.div
      initial={animationVariants.initial}
      animate={animationVariants.animate}
      whileHover={cardVariants.hover}
      whileTap={cardVariants.tap}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
      className={cn(
        "bg-card text-card-foreground rounded-lg border shadow-sm transition-colors",
        variant === 'gold' && "border-amber-200 bg-gradient-to-br from-amber-50 to-white",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggeredCards({ 
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
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * staggerDelay,
            ease: "easeOut"
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

export function FlipCard({
  frontContent,
  backContent,
  className
}: {
  frontContent: React.ReactNode
  backContent: React.ReactNode
  className?: string
}) {
  const [isFlipped, setIsFlipped] = React.useState(false)

  return (
    <div className={cn("relative perspective-1000", className)}>
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative w-full h-full preserve-3d cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          {frontContent}
        </div>
        
        {/* Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          {backContent}
        </div>
      </motion.div>
    </div>
  )
}

export function GlowCard({
  children,
  glowColor = "rgb(245 158 11)", // amber-500
  className
}: {
  children: React.ReactNode
  glowColor?: string
  className?: string
}) {
  return (
    <motion.div
      whileHover={{
        boxShadow: `0 0 20px ${glowColor}40, 0 0 40px ${glowColor}20`,
        scale: 1.02
      }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative bg-card rounded-lg border overflow-hidden",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(circle at center, ${glowColor}10 0%, transparent 70%)`
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

export function PulseCard({
  children,
  className,
  pulseColor = "rgb(245 158 11)"
}: {
  children: React.ReactNode
  className?: string
  pulseColor?: string
}) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 0 0 ${pulseColor}40`,
          `0 0 0 10px ${pulseColor}00`,
          `0 0 0 0 ${pulseColor}40`
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={cn("bg-card rounded-lg border", className)}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedCard



