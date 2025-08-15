import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [roles, permissions] = await Promise.all([
      prisma.role.findMany({
        where,
        include: {
          _count: {
            select: { users: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.permission.findMany({
        where: category && category !== 'all' ? { category } : {},
        orderBy: { category: 'asc' }
      })
    ])

    // تنسيق البيانات
    const formattedRoles = roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions || [],
      userCount: role._count.users,
      isDefault: role.isDefault || false,
      createdAt: role.createdAt
    }))

    const formattedPermissions = permissions.map(permission => ({
      id: permission.id,
      name: permission.name,
      category: permission.category,
      description: permission.description
    }))

    return ApiResponseHandler.success({
      roles: formattedRoles,
      permissions: formattedPermissions,
      categories: Array.from(new Set(permissions.map(p => p.category)))
    })
  } catch (error) {
    console.error('Error fetching roles and permissions:', error)
    return ApiResponseHandler.serverError('خطأ في جلب الأدوار والصلاحيات')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, permissions } = body

    // التحقق من وجود الدور
    const existingRole = await prisma.role.findUnique({
      where: { name }
    })

    if (existingRole) {
      return ApiResponseHandler.validationError(['اسم الدور مستخدم بالفعل'])
    }

    // إنشاء الدور الجديد
    const role = await prisma.role.create({
      data: {
        name,
        description,
        permissions: permissions || [],
        isDefault: false
      }
    })

    return ApiResponseHandler.success(role, 'تم إنشاء الدور بنجاح')
  } catch (error) {
    console.error('Error creating role:', error)
    return ApiResponseHandler.serverError('خطأ في إنشاء الدور')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const role = await prisma.role.update({
      where: { id },
      data: updateData
    })

    return ApiResponseHandler.success(role, 'تم تحديث الدور بنجاح')
  } catch (error) {
    console.error('Error updating role:', error)
    return ApiResponseHandler.serverError('خطأ في تحديث الدور')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return ApiResponseHandler.validationError(['معرف الدور مطلوب'])
    }

    // التحقق من عدم وجود مستخدمين يستخدمون هذا الدور
    const usersWithRole = await prisma.user.count({
      where: { roleId: id }
    })

    if (usersWithRole > 0) {
      return ApiResponseHandler.validationError([
        `لا يمكن حذف الدور لأنه مستخدم من قبل ${usersWithRole} مستخدم`
      ])
    }

    await prisma.role.delete({
      where: { id }
    })

    return ApiResponseHandler.success(null, 'تم حذف الدور بنجاح')
  } catch (error) {
    console.error('Error deleting role:', error)
    return ApiResponseHandler.serverError('خطأ في حذف الدور')
  }
}
