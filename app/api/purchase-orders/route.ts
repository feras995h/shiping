import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { purchaseOrderSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const supplierId = searchParams.get('supplierId')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { orderNumber: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (status) where.status = status
    if (supplierId) where.supplierId = supplierId

    const [orders, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        include: {
          supplier: {
            select: { id: true, name: true, email: true }
          },
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.purchaseOrder.count({ where })
    ])

    return ApiResponseHandler.success({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching purchase orders:', error)
    return ApiResponseHandler.serverError('فشل في جلب أوامر الشراء')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = purchaseOrderSchema.parse(body)

    const order = await prisma.purchaseOrder.create({
      data: {
        ...validatedData,
        createdBy: 'user-id', // سيتم استبداله بـ user ID الفعلي
      },
      include: {
        supplier: {
          select: { id: true, name: true, email: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return ApiResponseHandler.success(order, 'تم إنشاء أمر الشراء بنجاح')
  } catch (error) {
    console.error('Error creating purchase order:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 