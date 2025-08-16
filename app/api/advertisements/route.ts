
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Schema للتحقق من صحة البيانات
const advertisementSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  content: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  linkUrl: z.string().url().optional().or(z.literal("")),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  order: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true)
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    const whereClause = activeOnly ? {
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
    } : {}

    const advertisements = await prisma.advertisement.findMany({
      where: whereClause,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: advertisements,
      message: "تم جلب الإعلانات بنجاح"
    })
  } catch (error) {
    console.error('خطأ في جلب الإعلانات:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'خطأ في جلب الإعلانات',
        message: 'حدث خطأ أثناء جلب الإعلانات'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'employee'].includes(session.user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'غير مصرح لك بإنشاء الإعلانات',
          message: 'ليس لديك صلاحية لإنشاء الإعلانات'
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = advertisementSchema.parse(body)

    const advertisement = await prisma.advertisement.create({
      data: {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        createdBy: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      data: advertisement,
      message: "تم إنشاء الإعلان بنجاح"
    })
  } catch (error) {
    console.error('خطأ في إنشاء الإعلان:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'بيانات غير صحيحة',
          message: error.errors[0]?.message || 'البيانات المدخلة غير صحيحة'
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'خطأ في إنشاء الإعلان',
        message: 'حدث خطأ أثناء إنشاء الإعلان'
      },
      { status: 500 }
    )
  }
}
