import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { financialReportSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const period = searchParams.get('period')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (type) where.type = type
    if (period) where.period = period

    const [reports, total] = await Promise.all([
      prisma.financialReport.findMany({
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
      prisma.financialReport.count({ where })
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
    console.error('Error fetching financial reports:', error)
    return ApiResponseHandler.serverError('فشل في جلب التقارير المالية')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = financialReportSchema.parse(body)

    const report = await prisma.financialReport.create({
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

    return ApiResponseHandler.success(report, 'تم إنشاء التقرير المالي بنجاح')
  } catch (error) {
    console.error('Error creating financial report:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 