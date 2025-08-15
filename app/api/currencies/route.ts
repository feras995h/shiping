import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { currencySchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'
import { withRole } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const isActive = searchParams.get('isActive')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { code: { contains: query, mode: 'insensitive' } },
        { symbol: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (isActive !== null) where.isActive = isActive === 'true'

    const [currencies, total] = await Promise.all([
      prisma.currency.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.currency.count({ where })
    ])

    return ApiResponseHandler.success({
      currencies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching currencies:', error)
    return ApiResponseHandler.serverError('فشل في جلب العملات')
  }
}

export const POST = withRole(['ADMIN'])(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const validatedData = currencySchema.parse(body)

    const currency = await prisma.currency.create({
      data: {
        ...validatedData,
      },
      
    })

    return ApiResponseHandler.success(currency, 'تم إنشاء العملة بنجاح')
  } catch (error) {
    console.error('Error creating currency:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
})