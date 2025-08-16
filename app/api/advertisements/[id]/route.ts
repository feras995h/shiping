
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const advertisementUpdateSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب").optional(),
  description: z.string().min(1, "الوصف مطلوب").optional(),
  content: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  linkUrl: z.string().url().optional().or(z.literal("")),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const advertisement = await prisma.advertisement.findUnique({
      where: { id: params.id }
    })

    if (!advertisement) {
      return NextResponse.json(
        {
          success: false,
          error: 'الإعلان غير موجود',
          message: 'لم يتم العثور على الإعلان المطلوب'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: advertisement,
      message: "تم جلب الإعلان بنجاح"
    })
  } catch (error) {
    console.error('خطأ في جلب الإعلان:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'خطأ في جلب الإعلان',
        message: 'حدث خطأ أثناء جلب الإعلان'
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'employee'].includes(session.user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'غير مصرح لك بتعديل الإعلانات',
          message: 'ليس لديك صلاحية لتعديل الإعلانات'
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = advertisementUpdateSchema.parse(body)

    const existingAd = await prisma.advertisement.findUnique({
      where: { id: params.id }
    })

    if (!existingAd) {
      return NextResponse.json(
        {
          success: false,
          error: 'الإعلان غير موجود',
          message: 'لم يتم العثور على الإعلان المطلوب'
        },
        { status: 404 }
      )
    }

    const updateData: any = { ...validatedData }
    if (validatedData.startDate) {
      updateData.startDate = new Date(validatedData.startDate)
    }
    if (validatedData.endDate) {
      updateData.endDate = new Date(validatedData.endDate)
    }

    const advertisement = await prisma.advertisement.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: advertisement,
      message: "تم تحديث الإعلان بنجاح"
    })
  } catch (error) {
    console.error('خطأ في تحديث الإعلان:', error)
    
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
        error: 'خطأ في تحديث الإعلان',
        message: 'حدث خطأ أثناء تحديث الإعلان'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'غير مصرح لك بحذف الإعلانات',
          message: 'ليس لديك صلاحية لحذف الإعلانات'
        },
        { status: 403 }
      )
    }

    const existingAd = await prisma.advertisement.findUnique({
      where: { id: params.id }
    })

    if (!existingAd) {
      return NextResponse.json(
        {
          success: false,
          error: 'الإعلان غير موجود',
          message: 'لم يتم العثور على الإعلان المطلوب'
        },
        { status: 404 }
      )
    }

    await prisma.advertisement.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: "تم حذف الإعلان بنجاح"
    })
  } catch (error) {
    console.error('خطأ في حذف الإعلان:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'خطأ في حذف الإعلان',
        message: 'حدث خطأ أثناء حذف الإعلان'
      },
      { status: 500 }
    )
  }
}
