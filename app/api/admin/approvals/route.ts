import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { withRole } from '@/lib/auth-middleware'
import { getAuditTrail } from '@/lib/audit-trail'

export const GET = withRole(['ADMIN','MANAGER'])(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const entityType = searchParams.get('entityType')
    const approverRole = searchParams.get('approverRole')

    const skip = (page - 1) * limit
    const where: any = { AND: [] as any[] }
    if (status) where.AND.push({ status })
    if (entityType) where.AND.push({ entityType })
    if (approverRole) where.AND.push({ approverRole })

    const [requests, total] = await Promise.all([
      prisma.approvalRequest.findMany({
        where,
        include: {
          requester: { select: { id: true, name: true, email: true } },
          actions: {
            include: { actor: { select: { id: true, name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.approvalRequest.count({ where })
    ])

    return ApiResponseHandler.success({
      requests,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    console.error('Error fetching approval requests:', error)
    return ApiResponseHandler.serverError('فشل في جلب طلبات الموافقات')
  }
})

export const POST = withRole(['ADMIN','MANAGER'])(async (request: NextRequest, user: { id: string }) => {
  try {
    const body = await request.json()
    const { entityType, entityId, amount, reason, requestedBy, approverRole } = body

    const req = await prisma.approvalRequest.create({
      data: {
        entityType,
        entityId,
        amount,
        reason,
        requestedBy: requestedBy || user.id,
        approverRole,
      }
    })

    // Audit log
    try {
      const audit = getAuditTrail(prisma)
      await audit.logCreate('JOURNAL_ENTRY', req.id, {
        entityType,
        entityId,
        amount,
        reason,
        approverRole,
      }, { userId: requestedBy || user.id })
    } catch (_) {}

    // Create system alert for new approval request
    try {
      await prisma.alert.create({
        data: {
          title: 'طلب موافقة جديد',
          message: `تم إنشاء طلب موافقة على ${entityType} بقيمة ${amount} للكيان ${entityId}`,
          type: 'WARNING',
        }
      })
    } catch (_) {}

    return ApiResponseHandler.success(req, 'تم إنشاء طلب الموافقة')
  } catch (error) {
    console.error('Error creating approval request:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
})

export const PUT = withRole(['ADMIN','MANAGER'])(async (request: NextRequest, user: { id: string }) => {
  try {
    const body = await request.json()
    const { requestId, actorId, outcome, comment } = body

    const action = await prisma.approvalAction.create({
      data: {
        requestId,
        actorId,
        outcome,
        comment,
      },
      include: {
        request: true,
      }
    })

    // تحديث حالة الطلب
    await prisma.approvalRequest.update({
      where: { id: requestId },
      data: { status: outcome === 'APPROVED' ? 'APPROVED' : 'REJECTED' }
    })

    // Audit log
    try {
      const audit = getAuditTrail(prisma)
      await audit.logUpdate('JOURNAL_ENTRY', requestId, {
        outcome,
        comment,
      }, { userId: actorId || user.id })
    } catch (_) {}

    // Create system alert for approval outcome
    try {
      await prisma.alert.create({
        data: {
          title: outcome === 'APPROVED' ? 'تم اعتماد الطلب' : 'تم رفض الطلب',
          message: `الطلب ${requestId}: ${outcome === 'APPROVED' ? 'تم الاعتماد' : 'تم الرفض'} ${comment ? `- ملاحظة: ${comment}` : ''}`,
          type: outcome === 'APPROVED' ? 'SUCCESS' : 'ERROR',
        }
      })
    } catch (_) {}

    return ApiResponseHandler.success(action, 'تم تسجيل إجراء الموافقة')
  } catch (error) {
    console.error('Error updating approval request:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
})


