import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (role && role !== 'all') {
      where.role = role
    }
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          department: true,
          phone: true,
          location: true,
          lastLogin: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    return ApiResponseHandler.success({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return ApiResponseHandler.serverError('خطأ في جلب المستخدمين')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, role, department, phone, location, password } = body

    // التحقق من وجود المستخدم
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return ApiResponseHandler.validationError(['البريد الإلكتروني مستخدم بالفعل'])
    }

    // إنشاء المستخدم الجديد
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        department,
        phone,
        location,
        password: password ? await hashPassword(password) : undefined,
        status: 'active'
      }
    })

    return ApiResponseHandler.success(user, 'تم إنشاء المستخدم بنجاح')
  } catch (error) {
    console.error('Error creating user:', error)
    return ApiResponseHandler.serverError('خطأ في إنشاء المستخدم')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    })

    return ApiResponseHandler.success(user, 'تم تحديث المستخدم بنجاح')
  } catch (error) {
    console.error('Error updating user:', error)
    return ApiResponseHandler.serverError('خطأ في تحديث المستخدم')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return ApiResponseHandler.validationError(['معرف المستخدم مطلوب'])
    }

    await prisma.user.delete({
      where: { id }
    })

    return ApiResponseHandler.success(null, 'تم حذف المستخدم بنجاح')
  } catch (error) {
    console.error('Error deleting user:', error)
    return ApiResponseHandler.serverError('خطأ في حذف المستخدم')
  }
}

async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.hash(password, 12)
}
