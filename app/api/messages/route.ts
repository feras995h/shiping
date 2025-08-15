import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { messageSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'
import { withAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const fromUserId = searchParams.get('fromUserId')
    const toUserId = searchParams.get('toUserId')
    const isRead = searchParams.get('isRead')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { subject: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (fromUserId) where.fromId = fromUserId
    if (toUserId) where.toId = toUserId
    if (isRead !== null) where.isRead = isRead === 'true'

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
          from: {
            select: { id: true, name: true, email: true }
          },
          to: {
            select: { id: true, name: true, email: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.message.count({ where })
    ])

    return ApiResponseHandler.success({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return ApiResponseHandler.serverError('فشل في جلب الرسائل')
  }
}

export const POST = withAuth(async (request: NextRequest, user: { id: string }) => {
  try {
    const body = await request.json()
    const validatedData = messageSchema.parse(body)

    const message = await prisma.message.create({
      data: {
        toId: validatedData.toId,
        subject: validatedData.subject,
        content: validatedData.content,
        fromId: user.id,
      },
      include: {
        from: {
          select: { id: true, name: true, email: true }
        },
        to: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return ApiResponseHandler.success(message, 'تم إرسال الرسالة بنجاح')
  } catch (error) {
    console.error('Error creating message:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
})