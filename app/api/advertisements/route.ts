
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
