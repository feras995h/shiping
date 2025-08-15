"use client"

import { CheckCircle, Circle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export interface WorkflowStep {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  completedAt?: string
}

interface WorkflowStepsProps {
  steps: WorkflowStep[]
  currentStep?: string
  className?: string
}

export function WorkflowSteps({ steps, currentStep, className = "" }: WorkflowStepsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => {
        const isCompleted = step.status === 'completed'
        const isCurrent = step.id === currentStep || step.status === 'in_progress'
        const isPending = step.status === 'pending'

        return (
          <div key={step.id} className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {isCompleted ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : isCurrent ? (
                <Clock className="h-6 w-6 text-blue-500" />
              ) : (
                <Circle className="h-6 w-6 text-slate-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className={cn(
                  "text-sm font-medium",
                  isCompleted ? "text-green-700" : isCurrent ? "text-blue-700" : "text-slate-500"
                )}>
                  {step.title}
                </h4>
                {isCompleted && step.completedAt && (
                  <span className="text-xs text-slate-400">
                    {new Date(step.completedAt).toLocaleDateString('ar-SA')}
                  </span>
                )}
              </div>
              {step.description && (
                <p className="text-sm text-slate-600 mt-1">{step.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
} 