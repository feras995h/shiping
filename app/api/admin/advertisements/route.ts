
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ApiResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'employee'].includes(session.user.role)) {
      return NextResponse.json(
        ApiResponse.error('غير مصرح لك بعرض الإعلانات'),
        { status: 403 }
      )
    }

    const advertisements = await prisma.advertisement.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
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
