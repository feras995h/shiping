import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiResponse } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return apiResponse(null, 'غير مصرح', 401);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const active = searchParams.get('active');

    let whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    if (type) {
      whereClause.type = type;
    }

    if (active === 'true') {
      const now = new Date();
      whereClause = {
        ...whereClause,
        status: 'ACTIVE',
        OR: [
          { startDate: null },
          { startDate: { lte: now } }
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } }
            ]
          }
        ]
      };
    }

    const advertisements = await prisma.advertisement.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return apiResponse(advertisements, 'تم جلب الإعلانات بنجاح');
  } catch (error) {
    console.error('خطأ في جلب الإعلانات:', error);
    return apiResponse(null, 'خطأ في جلب الإعلانات', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EMPLOYEE', 'FINANCE_MANAGER'].includes(session.user.role)) {
      return apiResponse(null, 'غير مصرح بإنشاء الإعلانات', 403);
    }

    const data = await request.json();
    const {
      title,
      content,
      imageUrl,
      linkUrl,
      type,
      status,
      priority,
      startDate,
      endDate,
      targetRole
    } = data;

    if (!title || !content) {
      return apiResponse(null, 'العنوان والمحتوى مطلوبان', 400);
    }

    const advertisement = await prisma.advertisement.create({
      data: {
        title,
        content,
        imageUrl,
        linkUrl,
        type: type || 'BANNER',
        status: status || 'DRAFT',
        priority: priority || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        targetRole,
        createdBy: session.user.id
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return apiResponse(advertisement, 'تم إنشاء الإعلان بنجاح', 201);
  } catch (error) {
    console.error('خطأ في إنشاء الإعلان:', error);
    return apiResponse(null, 'خطأ في إنشاء الإعلان', 500);
  }
}