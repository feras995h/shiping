import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
// استخدام مخطط عام بدل securityLogSchema غير الموجود
import { ApiResponseHandler } from '@/lib/api-response'
import { securityLogSchema } from '@/lib/validations'
import { withAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const level = searchParams.get('level')
    const userId = searchParams.get('userId')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { action: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { ipAddress: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (level) where.level = level
    if (userId) where.userId = userId

    const [logs, total] = await Promise.all([
      prisma.securityLog.findMany({
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
      prisma.securityLog.count({ where })
    ])

    return ApiResponseHandler.success({
      logs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    console.error('Error fetching security logs:', error)
    return ApiResponseHandler.serverError('فشل في جلب سجلات الأمان')
  }
}

export const POST = withAuth(async (request: NextRequest, user: { id: string }) => {
  try {
    const body = await request.json()
    const validatedData = securityLogSchema.parse(body)

    const log = await prisma.securityLog.create({
      data: {
        action: validatedData.action,
        description: validatedData.description,
        level: validatedData.level || 'INFO',
        ipAddress: validatedData.ipAddress,
        userId: validatedData.userId || user.id,
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    })

    return ApiResponseHandler.success(log, 'تم إنشاء سجل الأمان بنجاح')
  } catch (error) {
    console.error('Error creating security log:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
})