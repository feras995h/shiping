
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponseHandler } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-middleware';

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const type = url.searchParams.get('type');
    const isRead = url.searchParams.get('isRead');

    const where: any = {};
    if (type) where.type = type;
    if (isRead !== null) where.isRead = isRead === 'true';

    const alerts = await prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    const total = await prisma.alert.count({ where });

    return ApiResponseHandler.success({
      alerts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('خطأ في جلب التنبيهات:', error);
    return ApiResponseHandler.serverError('فشل في جلب التنبيهات');
  }
});

export const POST = withAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json();
    const { title, message, type, userId } = body;

    const alert = await prisma.alert.create({
      data: {
        title,
        message,
        type,
        userId: userId || user.id,
        isRead: false
      }
    });

    return ApiResponseHandler.created(alert);

  } catch (error) {
    console.error('خطأ في إنشاء التنبيه:', error);
    return ApiResponseHandler.serverError('فشل في إنشاء التنبيه');
  }
});

export const PATCH = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { alertId, isRead } = body;

    const alert = await prisma.alert.update({
      where: { id: alertId },
      data: { isRead }
    });

    return ApiResponseHandler.success(alert);

  } catch (error) {
    console.error('خطأ في تحديث التنبيه:', error);
    return ApiResponseHandler.serverError('فشل في تحديث التنبيه');
  }
});
