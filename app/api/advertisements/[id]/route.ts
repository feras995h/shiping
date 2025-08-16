
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
