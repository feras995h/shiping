import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { equipmentSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { serialNumber: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (status) where.status = status
    if (category) where.category = category

    const [equipment, total] = await Promise.all([
      prisma.equipment.findMany({
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
      prisma.equipment.count({ where })
    ])

    return ApiResponseHandler.success({
      equipment,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return ApiResponseHandler.serverError('فشل في جلب المعدات')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = equipmentSchema.parse(body)

    const equipment = await prisma.equipment.create({
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

    return ApiResponseHandler.success(equipment, 'تم إضافة المعدة بنجاح')
  } catch (error) {
    console.error('Error creating equipment:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 