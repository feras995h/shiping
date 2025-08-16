
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ApiResponse } from "@/lib/api-response"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'employee'].includes(session.user.role)) {
      return NextResponse.json(
        ApiResponse.error('غير مصرح لك بتعديل الإعلانات'),
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, content, imageUrl, linkUrl, isActive, startDate, endDate, order } = body

    const advertisement = await prisma.advertisement.update({
      where: { id: params.id },
      data: {
        title,
        description,
        content,
        imageUrl,
        linkUrl,
        isActive,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        order
      }
    })

    return NextResponse.json(ApiResponse.success(advertisement))
  } catch (error) {
    console.error('خطأ في تعديل الإعلان:', error)
    return NextResponse.json(
      ApiResponse.error('خطأ في تعديل الإعلان'),
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        ApiResponse.error('غير مصرح لك بحذف الإعلانات'),
        { status: 403 }
      )
    }

    await prisma.advertisement.delete({
      where: { id: params.id }
    })

    return NextResponse.json(ApiResponse.success({ message: 'تم حذف الإعلان بنجاح' }))
  } catch (error) {
    console.error('خطأ في حذف الإعلان:', error)
    return NextResponse.json(
      ApiResponse.error('خطأ في حذف الإعلان'),
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return apiResponse(null, 'غير مصرح', 401);
    }

    const advertisement = await prisma.advertisement.findUnique({
      where: { id: params.id },
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

    if (!advertisement) {
      return apiResponse(null, 'الإعلان غير موجود', 404);
    }

    return apiResponse(advertisement, 'تم جلب الإعلان بنجاح');
  } catch (error) {
    console.error('خطأ في جلب الإعلان:', error);
    return apiResponse(null, 'خطأ في جلب الإعلان', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EMPLOYEE', 'FINANCE_MANAGER'].includes(session.user.role)) {
      return apiResponse(null, 'غير مصرح بتعديل الإعلانات', 403);
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

    const advertisement = await prisma.advertisement.update({
      where: { id: params.id },
      data: {
        title,
        content,
        imageUrl,
        linkUrl,
        type,
        status,
        priority,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        targetRole,
        updatedAt: new Date()
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

    return apiResponse(advertisement, 'تم تحديث الإعلان بنجاح');
  } catch (error) {
    console.error('خطأ في تحديث الإعلان:', error);
    return apiResponse(null, 'خطأ في تحديث الإعلان', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EMPLOYEE', 'FINANCE_MANAGER'].includes(session.user.role)) {
      return apiResponse(null, 'غير مصرح بحذف الإعلانات', 403);
    }

    await prisma.advertisement.delete({
      where: { id: params.id }
    });

    return apiResponse(null, 'تم حذف الإعلان بنجاح');
  } catch (error) {
    console.error('خطأ في حذف الإعلان:', error);
    return apiResponse(null, 'خطأ في حذف الإعلان', 500);
  }
}
