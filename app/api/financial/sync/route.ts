import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { getFinancialSyncService } from '@/lib/financial-sync'

/**
 * API لمزامنة البيانات المالية بين المخزن المحلي وقاعدة البيانات
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, fromDate, toDate } = body

    const syncService = getFinancialSyncService(prisma)

    switch (action) {
      case 'full_sync':
        const result = await syncService.fullSync()
        return ApiResponseHandler.success(result, 'تمت المزامنة')

      case 'sync_accounts':
        await syncService.syncChartOfAccounts()
        return ApiResponseHandler.success(null, 'تم مزامنة دليل الحسابات')

      case 'sync_transactions':
        await syncService.syncJournalEntries(fromDate, toDate)
        return ApiResponseHandler.success(null, 'تم مزامنة القيود المحاسبية')

      case 'status':
        const status = syncService.getSyncStatus()
        return ApiResponseHandler.success(status, 'حالة المزامنة')

      case 'backup':
        const backupResult = await syncService.createLocalBackup()
        return ApiResponseHandler.success(backupResult, 'تم إنشاء النسخة الاحتياطية')

      case 'restore':
        const restoreResult = await syncService.restoreFromBackup()
        return ApiResponseHandler.success(restoreResult, 'تم استعادة البيانات')

      default:
        return ApiResponseHandler.validationError(['إجراء غير صحيح'])
    }

  } catch (error) {
    console.error('خطأ في مزامنة البيانات المالية:', error)
    return ApiResponseHandler.serverError('فشل في مزامنة البيانات')
  }
}

export async function GET(request: NextRequest) {
  try {
    const syncService = getFinancialSyncService(prisma)
    const status = syncService.getSyncStatus()
    
    return ApiResponseHandler.success(status, 'حالة المزامنة')
  } catch (error) {
    console.error('خطأ في جلب حالة المزامنة:', error)
    return ApiResponseHandler.serverError('فشل في جلب حالة المزامنة')
  }
}


