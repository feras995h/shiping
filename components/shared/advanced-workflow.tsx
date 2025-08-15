"use client"

import { useState } from "react"
import { CheckCircle, Circle, Clock, AlertTriangle, Play, Pause, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface WorkflowStep {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'paused'
  completedAt?: string
  startedAt?: string
  estimatedDuration?: number // in minutes
  actualDuration?: number // in minutes
  assignee?: string
  priority?: 'low' | 'medium' | 'high' | 'critical' | 'urgent'
  dependencies?: string[] // IDs of steps that must be completed first
  notes?: string
  attachments?: string[]
}

interface AdvancedWorkflowProps {
  steps: WorkflowStep[]
  currentStep?: string
  className?: string
  showProgress?: boolean
  showTimeline?: boolean
  showActions?: boolean
  onStepClick?: (stepId: string) => void
  onStatusChange?: (stepId: string, status: WorkflowStep['status']) => void
}

export function AdvancedWorkflow({ 
  steps, 
  currentStep, 
  className = "",
  showProgress = true,
  showTimeline = true,
  showActions = false,
  onStepClick,
  onStatusChange
}: AdvancedWorkflowProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null)

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed': return CheckCircle
      case 'in_progress': return Clock
      case 'failed': return X
      case 'paused': return Pause
      default: return Circle
    }
  }

  const getStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'in_progress': return 'text-blue-600'
      case 'failed': return 'text-red-600'
      case 'paused': return 'text-amber-600'
      default: return 'text-slate-300'
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getProgressPercentage = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length
    return (completedSteps / steps.length) * 100
  }

  const canStartStep = (step: WorkflowStep) => {
    if (step.dependencies && step.dependencies.length > 0) {
      return step.dependencies.every(depId => 
        steps.find(s => s.id === depId)?.status === 'completed'
      )
    }
    return true
  }

  const getStepDuration = (step: WorkflowStep) => {
    if (step.actualDuration) {
      return `${step.actualDuration} دقيقة`
    }
    if (step.estimatedDuration) {
      return `مقدر: ${step.estimatedDuration} دقيقة`
    }
    return null
  }

  const handleStepClick = (stepId: string) => {
    if (onStepClick) {
      onStepClick(stepId)
    }
    setExpandedStep(expandedStep === stepId ? null : stepId)
  }

  const handleStatusChange = (stepId: string, newStatus: WorkflowStep['status']) => {
    if (onStatusChange) {
      onStatusChange(stepId, newStatus)
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress Overview */}
      {showProgress && (
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>تقدم سير العمل</span>
              <Badge variant="outline" className="text-sm">
                {steps.filter(s => s.status === 'completed').length} من {steps.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={getProgressPercentage()} className="h-3" />
              <div className="flex justify-between text-sm text-slate-600">
                <span>0%</span>
                <span>{Math.round(getProgressPercentage())}%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      {showTimeline && (
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCurrent = step.id === currentStep || step.status === 'in_progress'
            const isCompleted = step.status === 'completed'
            const isFailed = step.status === 'failed'
            const isPaused = step.status === 'paused'
            const canStart = canStartStep(step)
            const StatusIcon = getStatusIcon(step.status)

            return (
              <Card 
                key={step.id} 
                className={cn(
                  "card-premium transition-all duration-300 cursor-pointer",
                  isCurrent && "ring-2 ring-gold-500",
                  isFailed && "border-red-200 bg-red-50",
                  !canStart && "opacity-50"
                )}
                onClick={() => handleStepClick(step.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Step Number and Icon */}
                    <div className="flex-shrink-0">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2",
                        isCompleted ? "bg-green-100 border-green-500" :
                        isCurrent ? "bg-blue-100 border-blue-500" :
                        isFailed ? "bg-red-100 border-red-500" :
                        isPaused ? "bg-amber-100 border-amber-500" :
                        "bg-slate-100 border-slate-300"
                      )}>
                        {isCompleted ? (
                          <span className="text-green-600 font-bold">{index + 1}</span>
                        ) : (
                          <StatusIcon className={cn("h-5 w-5", getStatusColor(step.status))} />
                        )}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className={cn(
                              "text-sm font-medium",
                              isCompleted ? "text-green-700" : 
                              isCurrent ? "text-blue-700" : 
                              isFailed ? "text-red-700" :
                              "text-slate-700"
                            )}>
                              {step.title}
                            </h4>
                            {step.priority && (
                              <Badge className={cn("text-xs", getPriorityColor(step.priority))}>
                                {step.priority}
                              </Badge>
                            )}
                          </div>
                          
                          {step.description && (
                            <p className="text-sm text-slate-600 mb-2">{step.description}</p>
                          )}

                          {/* Step Details */}
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            {step.assignee && (
                              <span>المسؤول: {step.assignee}</span>
                            )}
                            {getStepDuration(step) && (
                              <span>المدة: {getStepDuration(step)}</span>
                            )}
                            {step.completedAt && (
                              <span>تم الإنجاز: {new Date(step.completedAt).toLocaleDateString('ar-SA')}</span>
                            )}
                          </div>

                          {/* Expanded Content */}
                          {expandedStep === step.id && (
                            <div className="mt-4 space-y-3">
                              {step.notes && (
                                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                  <strong>ملاحظات:</strong> {step.notes}
                                </div>
                              )}
                              
                              {step.attachments && step.attachments.length > 0 && (
                                <div className="text-sm">
                                  <strong>المرفقات:</strong>
                                  <div className="mt-1 space-y-1">
                                    {step.attachments.map((attachment, idx) => (
                                      <div key={idx} className="text-blue-600 hover:underline cursor-pointer">
                                        {attachment}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Action Buttons */}
                              {showActions && (
                                <div className="flex gap-2 pt-2">
                                  {step.status === 'pending' && canStart && (
                                    <Button 
                                      size="sm" 
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleStatusChange(step.id, 'in_progress')
                                      }}
                                    >
                                      <Play className="h-3 w-3 ml-1" />
                                      بدء
                                    </Button>
                                  )}
                                  
                                  {step.status === 'in_progress' && (
                                    <>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleStatusChange(step.id, 'paused')
                                        }}
                                      >
                                        <Pause className="h-3 w-3 ml-1" />
                                        إيقاف مؤقت
                                      </Button>
                                      <Button 
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleStatusChange(step.id, 'completed')
                                        }}
                                      >
                                        <CheckCircle className="h-3 w-3 ml-1" />
                                        إنجاز
                                      </Button>
                                    </>
                                  )}
                                  
                                  {step.status === 'paused' && (
                                    <Button 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleStatusChange(step.id, 'in_progress')
                                      }}
                                    >
                                      <Play className="h-3 w-3 ml-1" />
                                      استئناف
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Status Indicator */}
                        <div className="flex-shrink-0">
                          <StatusIcon className={cn("h-5 w-5", getStatusColor(step.status))} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
} 