"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Globe, Ship, Package, MapPin, Clock, AlertTriangle, CheckCircle, 
  Building2, Truck, Plane, Anchor, Calendar, DollarSign, TrendingUp,
  FileText, Shield, Users, Target, Activity
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChinaShipment {
  id: string
  trackingNumber: string
  status: 'pending' | 'in_production' | 'ready_for_shipping' | 'shipped' | 'in_transit' | 'arrived' | 'delivered'
  origin: string
  destination: string
  supplier: string
  client: string
  items: {
    name: string
    quantity: number
    unit: string
    value: number
  }[]
  totalValue: number
  currency: string
  weight: number
  volume: number
  containerType?: string
  shippingMethod: 'sea' | 'air' | 'land'
  estimatedDeparture: string
  estimatedArrival: string
  actualDeparture?: string
  actualArrival?: string
  documents: {
    type: string
    name: string
    status: 'pending' | 'received' | 'approved' | 'rejected'
    url?: string
  }[]
  customsStatus: 'pending' | 'in_progress' | 'cleared' | 'held'
  notes?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
}

export interface ChinaMetrics {
  totalShipments: number
  activeShipments: number
  completedShipments: number
  pendingShipments: number
  totalValue: number
  averageTransitTime: number
  customsClearanceRate: number
  supplierPerformance: number
  documentCompletionRate: number
}

interface ChinaIntegrationProps {
  shipments: ChinaShipment[]
  metrics: ChinaMetrics
  currency?: string
  onShipmentClick?: (shipment: ChinaShipment) => void
  onDocumentAction?: (shipmentId: string, documentType: string, action: string) => void
  className?: string
}

export function ChinaIntegration({
  shipments,
  metrics,
  currency = "د.ل",
  onShipmentClick,
  onDocumentAction,
  className = ""
}: ChinaIntegrationProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock
      case 'in_production': return Building2
      case 'ready_for_shipping': return Package
      case 'shipped': return Ship
      case 'in_transit': return Truck
      case 'arrived': return Anchor
      case 'delivered': return CheckCircle
      default: return Package
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-slate-600'
      case 'in_production': return 'text-blue-600'
      case 'ready_for_shipping': return 'text-amber-600'
      case 'shipped': return 'text-cyan-600'
      case 'in_transit': return 'text-purple-600'
      case 'arrived': return 'text-green-600'
      case 'delivered': return 'text-green-700'
      default: return 'text-slate-600'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-slate-100 text-slate-800'
      case 'in_production': return 'bg-blue-100 text-blue-800'
      case 'ready_for_shipping': return 'bg-amber-100 text-amber-800'
      case 'shipped': return 'bg-cyan-100 text-cyan-800'
      case 'in_transit': return 'bg-purple-100 text-purple-800'
      case 'arrived': return 'bg-green-100 text-green-800'
      case 'delivered': return 'bg-green-200 text-green-900'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getShippingMethodIcon = (method: string) => {
    switch (method) {
      case 'sea': return Ship
      case 'air': return Plane
      case 'land': return Truck
      default: return Truck
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-LY', {
      style: 'currency',
      currency: 'LYD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getTransitProgress = (shipment: ChinaShipment) => {
    const statusOrder = ['pending', 'in_production', 'ready_for_shipping', 'shipped', 'in_transit', 'arrived', 'delivered']
    const currentIndex = statusOrder.indexOf(shipment.status)
    return ((currentIndex + 1) / statusOrder.length) * 100
  }

  const filteredShipments = shipments
    .filter(s => (filterStatus === "all" || s.status === filterStatus) && 
                 (filterPriority === "all" || s.priority === filterPriority))
    .sort((a, b) => {
      switch (sortBy) {
        case 'date': return new Date(b.estimatedDeparture).getTime() - new Date(a.estimatedDeparture).getTime()
        case 'value': return b.totalValue - a.totalValue
        case 'priority': {
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        default: return 0
      }
    })

  return (
    <div className={cn("space-y-6", className)}>
      {/* China Integration Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">إجمالي الشحنات</CardTitle>
            <Globe className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">
              {metrics.totalShipments}
            </div>
            <p className="text-xs text-slate-500">شحنة من الصين</p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">الشحنات النشطة</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics.activeShipments}
            </div>
            <p className="text-xs text-slate-500">قيد المعالجة</p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">إجمالي القيمة</CardTitle>
            <DollarSign className="h-4 w-4 text-gold-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gold-600">
              {formatCurrency(metrics.totalValue)}
            </div>
            <p className="text-xs text-slate-500">قيمة الشحنات</p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">معدل التخليص</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.customsClearanceRate}%
            </div>
            <p className="text-xs text-slate-500">نجح التخليص الجمركي</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Indicators */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="card-premium">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-600" />
              متوسط وقت العبور
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics.averageTransitTime} يوم
            </div>
            <p className="text-xs text-blue-700">من الصين إلى ليبيا</p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-green-600" />
              أداء الموردين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.supplierPerformance}%
            </div>
            <p className="text-xs text-green-700">معدل الالتزام بالمواعيد</p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-purple-600" />
              اكتمال المستندات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {metrics.documentCompletionRate}%
            </div>
            <p className="text-xs text-purple-700">معدل اكتمال الوثائق</p>
          </CardContent>
        </Card>
      </div>

      {/* Shipments List */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Ship className="h-5 w-5 text-gold-600" />
              شحنات الصين
            </span>
            <div className="flex gap-2">
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs border rounded px-2 py-1"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">في الانتظار</option>
                <option value="in_production">قيد الإنتاج</option>
                <option value="ready_for_shipping">جاهز للشحن</option>
                <option value="shipped">تم الشحن</option>
                <option value="in_transit">قيد العبور</option>
                <option value="arrived">وصل</option>
                <option value="delivered">تم التسليم</option>
              </select>
              <select 
                value={filterPriority} 
                onChange={(e) => setFilterPriority(e.target.value)}
                className="text-xs border rounded px-2 py-1"
              >
                <option value="all">جميع الأولويات</option>
                <option value="critical">حرجة</option>
                <option value="high">عالية</option>
                <option value="medium">متوسطة</option>
                <option value="low">منخفضة</option>
              </select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredShipments.map((shipment) => {
              const StatusIcon = getStatusIcon(shipment.status)
              const ShippingMethodIcon = getShippingMethodIcon(shipment.shippingMethod)
              return (
                <div
                  key={shipment.id}
                  className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => onShipmentClick?.(shipment)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-slate-800">
                          {shipment.trackingNumber}
                        </h4>
                        <Badge className={cn("text-xs", getStatusBadgeColor(shipment.status))}>
                          {shipment.status}
                        </Badge>
                        <Badge className={cn("text-xs", getPriorityColor(shipment.priority))}>
                          {shipment.priority}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                        <div>
                          <span className="font-medium">المورد:</span> {shipment.supplier}
                        </div>
                        <div>
                          <span className="font-medium">العميل:</span> {shipment.client}
                        </div>
                        <div>
                          <span className="font-medium">الوزن:</span> {shipment.weight} كجم
                        </div>
                        <div>
                          <span className="font-medium">القيمة:</span> {formatCurrency(shipment.totalValue)}
                        </div>
                      </div>

                      {/* Transit Progress */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>تقدم العبور</span>
                          <span>{Math.round(getTransitProgress(shipment))}%</span>
                        </div>
                        <Progress value={getTransitProgress(shipment)} className="h-2" />
                      </div>

                      {/* Route and Dates */}
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{shipment.origin} → {shipment.destination}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ShippingMethodIcon className="h-3 w-3" />
                          <span>{shipment.shippingMethod === 'sea' ? 'بحر' : shipment.shippingMethod === 'air' ? 'جو' : 'بر'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>ETA: {new Date(shipment.estimatedArrival).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>

                      {/* Documents Status */}
                      {shipment.documents.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs font-medium text-slate-600 mb-2">حالة المستندات:</div>
                          <div className="flex flex-wrap gap-2">
                            {shipment.documents.map((doc, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className={cn("text-xs", {
                                  'border-green-200 text-green-700': doc.status === 'approved',
                                  'border-yellow-200 text-yellow-700': doc.status === 'received',
                                  'border-red-200 text-red-700': doc.status === 'rejected',
                                  'border-slate-200 text-slate-700': doc.status === 'pending'
                                })}
                              >
                                {doc.type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0 ml-4">
                      <StatusIcon className={cn("h-6 w-6", getStatusColor(shipment.status))} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 