
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponseHandler } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-middleware';

export const GET = withAuth(async (request: NextRequest) => {
  try {
    // فحص حالة المزامنة الحالية
    const lastSync = await prisma.systemSetting.findUnique({
      where: { key: 'last_financial_sync' }
    });

    const pendingTransactions = await prisma.journalEntry.count({
      where: { isPosted: false }
    });

    const totalAccounts = await prisma.glAccount.count();
    const activeAccounts = await prisma.glAccount.count({
      where: { isActive: true }
    });

    return ApiResponseHandler.success({
      lastSync: lastSync?.value ? new Date(lastSync.value) : null,
      pendingTransactions,
      totalAccounts,
      activeAccounts,
      status: pendingTransactions > 0 ? 'pending' : 'synchronized'
    });

  } catch (error) {
    console.error('خطأ في فحص حالة المزامنة:', error);
    return ApiResponseHandler.serverError('فشل في فحص حالة المزامنة');
  }
});

export const POST = withAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json();
    const { type = 'full' } = body;

    // تنفيذ المزامنة
    let syncedCount = 0;

    if (type === 'full') {
      // مزامنة كاملة - ترحيل جميع القيود غير المرحلة
      const pendingEntries = await prisma.journalEntry.findMany({
        where: { isPosted: false },
        include: { entries: true }
      });

      for (const entry of pendingEntries) {
        await prisma.journalEntry.update({
          where: { id: entry.id },
          data: { isPosted: true }
        });
        syncedCount++;
      }
    }

    // تحديث وقت آخر مزامنة
    await prisma.systemSetting.upsert({
      where: { key: 'last_financial_sync' },
      update: { value: new Date().toISOString() },
      create: {
        key: 'last_financial_sync',
        value: new Date().toISOString(),
        description: 'آخر مزامنة مالية',
        category: 'financial',
        createdBy: user.id
      }
    });

    // إنشاء تنبيه نجاح المزامنة
    await prisma.alert.create({
      data: {
        title: 'تم إكمال المزامنة المالية',
        message: `تم ترحيل ${syncedCount} قيد محاسبي بنجاح`,
        type: 'SUCCESS',
        userId: user.id
      }
    });

    return ApiResponseHandler.success({
      message: 'تم إكمال المزامنة بنجاح',
      syncedTransactions: syncedCount,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('خطأ في المزامنة المالية:', error);
    
    // إنشاء تنبيه خطأ
    await prisma.alert.create({
      data: {
        title: 'فشل في المزامنة المالية',
        message: 'حدث خطأ أثناء تنفيذ المزامنة المالية',
        type: 'ERROR'
      }
    });

    return ApiResponseHandler.serverError('فشل في تنفيذ المزامنة');
  }
});
