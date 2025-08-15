import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { shippingReportSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const period = searchParams.get('period')
    const type = searchParams.get('type')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (period) where.period = period
    if (type) where.type = type

    const [reports, total] = await Promise.all([
      prisma.shippingReport.findMany({
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
      prisma.shippingReport.count({ where })
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
    console.error('Error fetching shipping reports:', error)
    return ApiResponseHandler.serverError('فشل في جلب تقارير الشحن')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = shippingReportSchema.parse(body)

    const report = await prisma.shippingReport.create({
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

    return ApiResponseHandler.success(report, 'تم إنشاء تقرير الشحن بنجاح')
  } catch (error) {
    console.error('Error creating shipping report:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 