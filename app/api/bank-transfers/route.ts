import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bankTransferSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const fromAccountId = searchParams.get('fromAccountId')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { transferNumber: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (status) where.status = status
    if (fromAccountId) where.fromAccountId = fromAccountId

    const [transfers, total] = await Promise.all([
      prisma.bankTransfer.findMany({
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
      prisma.bankTransfer.count({ where })
    ])

    return ApiResponseHandler.success({
      transfers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching bank transfers:', error)
    return ApiResponseHandler.serverError('فشل في جلب التحويلات البنكية')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = bankTransferSchema.parse(body)

    const transfer = await prisma.bankTransfer.create({
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

    return ApiResponseHandler.success(transfer, 'تم إنشاء التحويل البنكي بنجاح')
  } catch (error) {
    console.error('Error creating bank transfer:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 