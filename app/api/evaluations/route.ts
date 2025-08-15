import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluationSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const employeeId = searchParams.get('employeeId')
    const evaluatorId = searchParams.get('evaluatorId')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { notes: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (employeeId) where.employeeId = employeeId
    if (evaluatorId) where.evaluatorId = evaluatorId

    const [evaluations, total] = await Promise.all([
      prisma.evaluation.findMany({
        where,
        include: {
          employee: {
            select: { id: true, name: true, email: true }
          },
          evaluator: {
            select: { id: true, name: true, email: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.evaluation.count({ where })
    ])

    return ApiResponseHandler.success({
      evaluations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching evaluations:', error)
    return ApiResponseHandler.serverError('فشل في جلب التقييمات')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = evaluationSchema.parse(body)

    const evaluation = await prisma.evaluation.create({
      data: {
        ...validatedData,
        evaluatorId: 'user-id', // سيتم استبداله بـ user ID الفعلي
      },
      include: {
        employee: {
          select: { id: true, name: true, email: true }
        },
        evaluator: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return ApiResponseHandler.success(evaluation, 'تم إنشاء التقييم بنجاح')
  } catch (error) {
    console.error('Error creating evaluation:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 