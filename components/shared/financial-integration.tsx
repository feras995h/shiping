"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, 
  Clock, Building2, CreditCard, Receipt, Calculator, Percent, Target
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface FinancialTransaction {
  id: string
  type: 'income' | 'expense' | 'adjustment'
  amount: number
  currency: string
  description: string
  category: string
  date: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  relatedEntity?: {
    type: 'shipment' | 'client' | 'supplier' | 'employee'
    id: string
    name: string
  }
  metadata?: Record<string, any>
}

export interface FinancialMetrics {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  outstandingInvoices: number
  pendingReceipts: number
  cashFlow: number
  budgetUtilization: number
}

interface FinancialIntegrationProps {
  transactions: FinancialTransaction[]
  metrics: FinancialMetrics
  currency?: string
  showCharts?: boolean
  onTransactionClick?: (transaction: FinancialTransaction) => void
  className?: string
}

export function FinancialIntegration({
  transactions,
  metrics,
  currency = "د.ل",
  showCharts = true,
  onTransactionClick,
  className = ""
}: FinancialIntegrationProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [filterType, setFilterType] = useState<string>("all")

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income': return TrendingUp
      case 'expense': return TrendingDown

      case 'adjustment': return Calculator
      default: return DollarSign
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'income': return 'text-green-600'
      case 'expense': return 'text-red-600'

      case 'adjustment': return 'text-amber-600'
      default: return 'text-slate-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-slate-100 text-slate-800'
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

  const filteredTransactions = transactions.filter(t => 
    filterType === "all" || t.type === filterType
  )

  const recentTransactions = filteredTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return (
    <div className={cn("space-y-6", className)}>
      {/* Financial Metrics Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">إجمالي الإيرادات</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(metrics.totalRevenue)}
            </div>
            <p className="text-xs text-slate-500">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">إجمالي المصروفات</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(metrics.totalExpenses)}
            </div>
            <p className="text-xs text-slate-500">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">صافي الربح</CardTitle>
            <DollarSign className="h-4 w-4 text-gold-600" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", metrics.netProfit >= 0 ? "text-green-600" : "text-red-600")}>
              {formatCurrency(metrics.netProfit)}
            </div>
            <p className="text-xs text-slate-500">هامش الربح: {metrics.profitMargin}%</p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">التدفق النقدي</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", metrics.cashFlow >= 0 ? "text-green-600" : "text-red-600")}>
              {formatCurrency(metrics.cashFlow)}
            </div>
            <p className="text-xs text-slate-500">استخدام الميزانية: {metrics.budgetUtilization}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="card-premium border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              الفواتير المستحقة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {metrics.outstandingInvoices}
            </div>
            <p className="text-xs text-amber-700">فواتير بانتظار السداد</p>
          </CardContent>
        </Card>

        <Card className="card-premium border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-red-600" />
              المقبوضات المعلقة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {metrics.pendingReceipts}
            </div>
            <p className="text-xs text-red-700">مقبوضات معلقة</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-gold-600" />
              المعاملات المالية الأخيرة
            </span>
            <div className="flex gap-2">
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs border rounded px-2 py-1"
              >
                <option value="all">جميع المعاملات</option>
                <option value="income">الإيرادات</option>
                <option value="expense">المصروفات</option>

                <option value="adjustment">التسويات</option>
              </select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const TransactionIcon = getTransactionIcon(transaction.type)
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => onTransactionClick?.(transaction)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-full", getTransactionColor(transaction.type).replace('text-', 'bg-').replace('-600', '-100'))}>
                      <TransactionIcon className={cn("h-4 w-4", getTransactionColor(transaction.type))} />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{transaction.description}</div>
                      <div className="text-sm text-slate-500">
                        {transaction.category} • {new Date(transaction.date).toLocaleDateString('ar-SA')}
                      </div>
                      {transaction.relatedEntity && (
                        <div className="text-xs text-slate-400">
                          {transaction.relatedEntity.type}: {transaction.relatedEntity.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn("font-bold", getTransactionColor(transaction.type))}>
                      {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </div>
                    <Badge className={cn("text-xs mt-1", getStatusColor(transaction.status))}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Financial Health Indicator */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-gold-600" />
            مؤشر الصحة المالية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>معدل الربحية</span>
                <span>{metrics.profitMargin}%</span>
              </div>
              <Progress 
                value={Math.min(metrics.profitMargin, 100)} 
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>استخدام الميزانية</span>
                <span>{metrics.budgetUtilization}%</span>
              </div>
              <Progress 
                value={metrics.budgetUtilization} 
                className="h-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{metrics.totalRevenue.toLocaleString()}</div>
                <div className="text-xs text-green-700">إجمالي الإيرادات</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-lg font-bold text-red-600">{metrics.totalExpenses.toLocaleString()}</div>
                <div className="text-xs text-red-700">إجمالي المصروفات</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 