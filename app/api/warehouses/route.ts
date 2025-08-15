import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { warehouseSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const location = searchParams.get('location')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (location) where.location = { contains: location, mode: 'insensitive' }

    const [warehouses, total] = await Promise.all([
      prisma.warehouse.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          inventory: {
            select: { id: true, name: true, quantity: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.warehouse.count({ where })
    ])

    return ApiResponseHandler.success({
      warehouses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching warehouses:', error)
    return ApiResponseHandler.serverError('فشل في جلب المستودعات')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = warehouseSchema.parse(body)

    const warehouse = await prisma.warehouse.create({
      data: {
        ...validatedData,
        createdBy: 'user-id', // سيتم استبداله بـ user ID الفعلي
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        inventory: {
          select: { id: true, name: true, quantity: true }
        }
      }
    })

    return ApiResponseHandler.success(warehouse, 'تم إنشاء المستودع بنجاح')
  } catch (error) {
    console.error('Error creating warehouse:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 