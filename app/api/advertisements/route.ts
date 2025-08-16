
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ApiResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const advertisements = await prisma.advertisement.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null },
          { startDate: { lte: new Date() } }
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: new Date() } }
            ]
          }
        ]
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(ApiResponse.success(advertisements))
  } catch (error) {
    console.error('خطأ في جلب الإعلانات:', error)
    return NextResponse.json(
      ApiResponse.error('خطأ في جلب الإعلانات'),
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'employee'].includes(session.user.role)) {
      return NextResponse.json(
        ApiResponse.error('غير مصرح لك بإنشاء الإعلانات'),
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, content, imageUrl, linkUrl, startDate, endDate, order } = body

    const advertisement = await prisma.advertisement.create({
      data: {
        title,
        description,
        content,
        imageUrl,
        linkUrl,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        order: order || 0,
        createdBy: session.user.id
      }
    })

    return NextResponse.json(ApiResponse.success(advertisement))
  } catch (error) {
    console.error('خطأ في إنشاء الإعلان:', error)
    return NextResponse.json(
      ApiResponse.error('خطأ في إنشاء الإعلان'),
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';

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
