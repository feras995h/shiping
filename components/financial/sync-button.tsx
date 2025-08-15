"use client"

import React, { useState } from "react"
import { RefreshCw, Database, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SyncStatus {
  inProgress: boolean
  lastSync: string | null
  minutesSinceLastSync: number | null
}

export default function SyncButton() {
  const [syncing, setSyncing] = useState(false)
  const [status, setStatus] = useState<SyncStatus>({
    inProgress: false,
    lastSync: null,
    minutesSinceLastSync: null
  })

  const sync = async (action: string) => {
    try {
      setSyncing(true)
      
      const response = await fetch('/api/financial/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(data.message || 'تمت المزامنة بنجاح')
        await checkStatus()
      } else {
        toast.error(data.message || 'فشل في المزامنة')
      }
    } catch (error) {
      toast.error('خطأ في المزامنة')
      console.error('خطأ في المزامنة:', error)
    } finally {
      setSyncing(false)
    }
  }

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/financial/sync')
      const data = await response.json()
      
      if (data.success) {
        setStatus(data.data)
      }
    } catch (error) {
      console.error('خطأ في جلب حالة المزامنة:', error)
    }
  }

  const getStatusColor = () => {
    if (status.inProgress || syncing) return 'bg-blue-500'
    if (!status.lastSync) return 'bg-gray-500'
    if (status.minutesSinceLastSync && status.minutesSinceLastSync > 30) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStatusText = () => {
    if (status.inProgress || syncing) return 'جاري المزامنة...'
    if (!status.lastSync) return 'لم تتم المزامنة'
    if (status.minutesSinceLastSync === null) return 'غير معروف'
    if (status.minutesSinceLastSync < 1) return 'الآن'
    if (status.minutesSinceLastSync < 60) return `منذ ${status.minutesSinceLastSync} دقيقة`
    const hours = Math.floor(status.minutesSinceLastSync / 60)
    return `منذ ${hours} ساعة`
  }

  // جلب الحالة عند تحميل المكون
  React.useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 60000) // كل دقيقة
    return () => clearInterval(interval)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative border-gold-300 hover:bg-gold-50"
          disabled={syncing || status.inProgress}
        >
          <RefreshCw className={`h-4 w-4 ml-2 ${(syncing || status.inProgress) ? 'animate-spin' : ''}`} />
          مزامنة البيانات
          <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${getStatusColor()}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Database className="h-4 w-4" />
            مزامنة البيانات المالية
          </div>
          <div className="text-xs text-muted-foreground font-normal mt-1">
            آخر مزامنة: {getStatusText()}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => sync('full_sync')}
          disabled={syncing || status.inProgress}
        >
          <RefreshCw className="h-4 w-4 ml-2" />
          مزامنة كاملة
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => sync('sync_accounts')}
          disabled={syncing || status.inProgress}
        >
          <Database className="h-4 w-4 ml-2" />
          مزامنة دليل الحسابات
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => sync('sync_transactions')}
          disabled={syncing || status.inProgress}
        >
          <RefreshCw className="h-4 w-4 ml-2" />
          مزامنة القيود المحاسبية
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => sync('backup')}
          disabled={syncing || status.inProgress}
        >
          <CheckCircle className="h-4 w-4 ml-2" />
          إنشاء نسخة احتياطية
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => sync('restore')}
          disabled={syncing || status.inProgress}
          className="text-orange-600"
        >
          <AlertCircle className="h-4 w-4 ml-2" />
          استعادة من النسخة الاحتياطية
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <div className="px-2 py-1">
          <Badge 
            variant="outline" 
            className={`w-full justify-center text-xs ${
              status.inProgress || syncing ? 'border-blue-200 text-blue-700' :
              !status.lastSync ? 'border-gray-200 text-gray-700' :
              status.minutesSinceLastSync && status.minutesSinceLastSync > 30 ? 'border-yellow-200 text-yellow-700' :
              'border-green-200 text-green-700'
            }`}
          >
            {status.inProgress || syncing ? (
              <>
                <RefreshCw className="h-3 w-3 ml-1 animate-spin" />
                جاري المزامنة
              </>
            ) : !status.lastSync ? (
              'غير مزامن'
            ) : (
              <>
                <CheckCircle className="h-3 w-3 ml-1" />
                مزامن
              </>
            )}
          </Badge>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
