import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const action = searchParams.get('action') // CREATE | UPDATE | DELETE
    const userId = searchParams.get('userId')
    const entityType = searchParams.get('entityType') // INVOICE | PAYMENT | JOURNAL_ENTRY ...
    const entityId = searchParams.get('entityId')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const skip = (page - 1) * limit

    const where: any = {
      AND: [] as any[],
    }

    if (query) {
      where.AND.push({
        OR: [
          { summary: { contains: query, mode: 'insensitive' } },
          { entityId: { contains: query, mode: 'insensitive' } },
          { ipAddress: { contains: query, mode: 'insensitive' } },
          { user: { name: { contains: query, mode: 'insensitive' } } },
        ]
      })
    }
    if (action) where.AND.push({ action })
    if (userId) where.AND.push({ userId })
    if (entityType) where.AND.push({ entityType })
    if (entityId) where.AND.push({ entityId })
    if (from || to) {
      where.AND.push({
        createdAt: {
          ...(from ? { gte: new Date(from) } : {}),
          ...(to ? { lte: new Date(to) } : {}),
        }
      })
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.auditLog.count({ where })
    ])

    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - 7)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const auditStats = {
      total,
      today: await prisma.auditLog.count({ where: { createdAt: { gte: startOfToday } } }),
      thisWeek: await prisma.auditLog.count({ where: { createdAt: { gte: startOfWeek } } }),
      thisMonth: await prisma.auditLog.count({ where: { createdAt: { gte: startOfMonth } } }),
    }

    const actionAnalysis = await prisma.auditLog.groupBy({
      by: ['action'],
      _count: { action: true },
      orderBy: { _count: { action: 'desc' } },
      take: 10,
      where,
    })
    const entityAnalysis = await prisma.auditLog.groupBy({
      by: ['entityType'],
      _count: { entityType: true },
      orderBy: { _count: { entityType: 'desc' } },
      take: 10,
      where,
    })

    return ApiResponseHandler.success({
      logs,
      stats: auditStats,
      analysis: { actions: actionAnalysis, entities: entityAnalysis },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return ApiResponseHandler.serverError('فشل في جلب سجلات المراجعة')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entityType, entityId, action, summary, changes, userId, ipAddress, userAgent } = body

    const log = await prisma.auditLog.create({
      data: {
        entityType,
        entityId,
        action,
        summary,
        changes,
        userId: userId ?? null,
        ipAddress,
        userAgent,
      },
      include: { user: { select: { id: true, name: true, email: true } } }
    })

    return ApiResponseHandler.success(log, 'تم إنشاء سجل التدقيق بنجاح')
  } catch (error) {
    console.error('Error creating audit log:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
}