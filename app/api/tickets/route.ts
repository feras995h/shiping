import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ticketSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const assignedTo = searchParams.get('assignedTo')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (status) where.status = status
    if (priority) where.priority = priority
    if (assignedTo) where.assignedTo = assignedTo

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          assignee: {
            select: { id: true, name: true, email: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.ticket.count({ where })
    ])

    return ApiResponseHandler.success({
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return ApiResponseHandler.serverError('فشل في جلب التذاكر')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = ticketSchema.parse(body)

    const ticket = await prisma.ticket.create({
      data: {
        ...validatedData,
        createdBy: 'user-id', // سيتم استبداله بـ user ID الفعلي
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        assignee: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return ApiResponseHandler.success(ticket, 'تم إنشاء التذكرة بنجاح')
  } catch (error) {
    console.error('Error creating ticket:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 