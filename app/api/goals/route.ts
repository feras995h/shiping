import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { goalSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const employeeId = searchParams.get('employeeId')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (status) where.status = status
    if (employeeId) where.employeeId = employeeId

    const [goals, total] = await Promise.all([
      prisma.goal.findMany({
        where,
        include: {
          employee: {
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
      prisma.goal.count({ where })
    ])

    return ApiResponseHandler.success({
      goals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return ApiResponseHandler.serverError('فشل في جلب الأهداف')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = goalSchema.parse(body)

    const goal = await prisma.goal.create({
      data: {
        ...validatedData,
        createdBy: 'user-id', // سيتم استبداله بـ user ID الفعلي
      },
      include: {
        employee: {
          select: { id: true, name: true, email: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return ApiResponseHandler.success(goal, 'تم إنشاء الهدف بنجاح')
  } catch (error) {
    console.error('Error creating goal:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 