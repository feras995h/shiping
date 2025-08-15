import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bankReconciliationSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const accountId = searchParams.get('accountId')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { referenceNumber: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (status) where.status = status
    if (accountId) where.accountId = accountId

    const [reconciliations, total] = await Promise.all([
      prisma.bankReconciliation.findMany({
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
      prisma.bankReconciliation.count({ where })
    ])

    return ApiResponseHandler.success({
      reconciliations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching bank reconciliations:', error)
    return ApiResponseHandler.serverError('فشل في جلب المصالحات البنكية')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = bankReconciliationSchema.parse(body)

    const reconciliation = await prisma.bankReconciliation.create({
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

    return ApiResponseHandler.success(reconciliation, 'تم إنشاء المصالحة البنكية بنجاح')
  } catch (error) {
    console.error('Error creating bank reconciliation:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 