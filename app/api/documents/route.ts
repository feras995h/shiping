import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { documentSchema } from '@/lib/validations'
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
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { fileName: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (type) where.type = type
    if (category) where.category = category

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
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
      prisma.document.count({ where })
    ])

    return ApiResponseHandler.success({
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return ApiResponseHandler.serverError('فشل في جلب المستندات')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = documentSchema.parse(body)

    const document = await prisma.document.create({
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

    return ApiResponseHandler.success(document, 'تم إنشاء المستند بنجاح')
  } catch (error) {
    console.error('Error creating document:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 