import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { reportSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'
import { withAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const userId = searchParams.get('userId')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (type) where.type = type
    if (userId) where.createdBy = userId

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
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
      prisma.report.count({ where })
    ])

    return ApiResponseHandler.success({
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return ApiResponseHandler.serverError('فشل في جلب التقارير')
  }
}

export const POST = withAuth(async (request: NextRequest, user: { id: string }) => {
  try {
    const body = await request.json()
    const validatedData = reportSchema.parse(body)

    const report = await prisma.report.create({
      data: {
        ...validatedData,
        createdBy: user.id,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return ApiResponseHandler.success(report, 'تم إنشاء التقرير بنجاح')
  } catch (error) {
    console.error('Error creating report:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
})