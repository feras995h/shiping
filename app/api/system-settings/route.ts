import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { systemSettingSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { key: { contains: query, mode: 'insensitive' } },
        { value: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (category) where.category = category

    const [settings, total] = await Promise.all([
      prisma.systemSetting.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.systemSetting.count({ where })
    ])

    return ApiResponseHandler.success({
      settings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching system settings:', error)
    return ApiResponseHandler.serverError('فشل في جلب إعدادات النظام')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = systemSettingSchema.parse(body)

    const setting = await prisma.systemSetting.create({
      data: {
        ...validatedData,
        createdBy: 'user-id', // سيتم استبداله بـ user ID الفعلي
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return ApiResponseHandler.success(setting, 'تم إنشاء إعداد النظام بنجاح')
  } catch (error) {
    console.error('Error creating system setting:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 