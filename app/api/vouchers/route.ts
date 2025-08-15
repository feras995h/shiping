import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { voucherSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { code: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (status) where.status = status
    if (type) where.type = type

    const [vouchers, total] = await Promise.all([
      prisma.voucher.findMany({
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
      prisma.voucher.count({ where })
    ])

    return ApiResponseHandler.success({
      vouchers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching vouchers:', error)
    return ApiResponseHandler.serverError('فشل في جلب الكوبونات')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = voucherSchema.parse(body)

    const voucher = await prisma.voucher.create({
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

    return ApiResponseHandler.success(voucher, 'تم إنشاء الكوبون بنجاح')
  } catch (error) {
    console.error('Error creating voucher:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 