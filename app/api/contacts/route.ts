import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validations'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } },
        { company: { contains: query, mode: 'insensitive' } },
        { notes: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (type) where.type = type
    if (category) where.category = category

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
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
      prisma.contact.count({ where })
    ])

    return ApiResponseHandler.success({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return ApiResponseHandler.serverError('فشل في جلب جهات الاتصال')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    const contact = await prisma.contact.create({
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

    return ApiResponseHandler.success(contact, 'تم إضافة جهة الاتصال بنجاح')
  } catch (error) {
    console.error('Error creating contact:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 