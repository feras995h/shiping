import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bugTrackerSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (status) where.status = status
    if (priority) where.priority = priority

    const [bugs, total] = await Promise.all([
      prisma.bugTracker.findMany({
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
      prisma.bugTracker.count({ where })
    ])

    return ApiResponseHandler.success({
      bugs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching bugs:', error)
    return ApiResponseHandler.serverError('فشل في جلب الأخطاء')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = bugTrackerSchema.parse(body)

    const bug = await prisma.bugTracker.create({
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

    return ApiResponseHandler.success(bug, 'تم إنشاء الخطأ بنجاح')
  } catch (error) {
    console.error('Error creating bug:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 