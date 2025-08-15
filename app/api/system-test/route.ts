import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { systemTestSchema } from '@/lib/validations'
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
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (status) where.status = status
    if (type) where.type = type

    const [tests, total] = await Promise.all([
      prisma.systemTest.findMany({
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
      prisma.systemTest.count({ where })
    ])

    return ApiResponseHandler.success({
      tests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching system tests:', error)
    return ApiResponseHandler.serverError('فشل في جلب الاختبارات')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = systemTestSchema.parse(body)

    const test = await prisma.systemTest.create({
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

    return ApiResponseHandler.success(test, 'تم إنشاء الاختبار بنجاح')
  } catch (error) {
    console.error('Error creating system test:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 