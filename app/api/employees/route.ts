import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const department = searchParams.get('department')
    const status = searchParams.get('status')
    const position = searchParams.get('position')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (department && department !== 'all') {
      where.department = department
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (position && position !== 'all') {
      where.position = position
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          position: true,
          hireDate: true,
          salary: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.employee.count({ where })
    ])

    // تنسيق البيانات
    const formattedEmployees = employees.map(employee => ({
      ...employee,
      subordinateCount: 0, // سيتم حسابه لاحقاً
      taskCount: 0, // سيتم حسابه لاحقاً
      evaluationCount: 0 // سيتم حسابه لاحقاً
    }))

    return ApiResponseHandler.success({
      employees: formattedEmployees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    logger.error('خطأ في جلب الموظفين', { error })
    return ApiResponseHandler.serverError('خطأ في جلب الموظفين')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      email, 
      phone, 
      position, 
      salary, 
      hireDate,
      status = 'active'
    } = body

    // التحقق من البيانات المطلوبة
    if (!name || !email || !position) {
      return ApiResponseHandler.validationError([
        'الاسم والبريد الإلكتروني والمنصب مطلوبة'
      ])
    }

    // التحقق من عدم تكرار البريد الإلكتروني
    const existingEmployee = await prisma.employee.findFirst({
      where: { email }
    })

    if (existingEmployee) {
      return ApiResponseHandler.validationError([
        'البريد الإلكتروني مستخدم بالفعل'
      ])
    }

    // التحقق من وجود المدير سيتم إضافته لاحقاً

    // إنشاء الموظف الجديد
    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        phone,
        position,
        salary: salary ? parseFloat(salary) : 0,
        hireDate: hireDate ? new Date(hireDate) : new Date(),
        createdBy: 'system' // سيتم تحديثه لاحقاً
      }
    })

    logger.logSystemEvent('إنشاء موظف جديد', { 
      employeeId: employee.id, 
      name, 
      email,
      position 
    })

    return ApiResponseHandler.success(employee, 'تم إنشاء الموظف بنجاح')
  } catch (error) {
    logger.error('خطأ في إنشاء الموظف', { error })
    return ApiResponseHandler.serverError('خطأ في إنشاء الموظف')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return ApiResponseHandler.validationError(['معرف الموظف مطلوب'])
    }

    // التحقق من وجود الموظف
    const existingEmployee = await prisma.employee.findUnique({
      where: { id }
    })

    if (!existingEmployee) {
      return ApiResponseHandler.notFound('الموظف غير موجود')
    }

    // التحقق من عدم تكرار البريد الإلكتروني
    if (updateData.email) {
      const duplicateCheck = await prisma.employee.findFirst({
        where: {
          email: updateData.email,
          NOT: { id }
        }
      })

      if (duplicateCheck) {
        return ApiResponseHandler.validationError([
          'البريد الإلكتروني مستخدم من قبل موظف آخر'
        ])
      }
    }

    // التحقق من المدير سيتم إضافته لاحقاً

    const employee = await prisma.employee.update({
      where: { id },
      data: updateData
    })

    logger.logSystemEvent('تحديث موظف', { 
      employeeId: id, 
      updates: updateData 
    })

    return ApiResponseHandler.success(employee, 'تم تحديث الموظف بنجاح')
  } catch (error) {
    logger.error('خطأ في تحديث الموظف', { error })
    return ApiResponseHandler.serverError('خطأ في تحديث الموظف')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return ApiResponseHandler.validationError(['معرف الموظف مطلوب'])
    }

    // التحقق من عدم وجود مرؤوسين سيتم إضافته لاحقاً
    const subordinatesCount = 0

    // التحقق من عدم وجود مهام مرتبطة
    const tasksCount = await prisma.task.count({
      where: { 
        OR: [
          { assignedTo: id },
          { createdBy: id }
        ]
      }
    })

    if (tasksCount > 0) {
      return ApiResponseHandler.validationError([
        `لا يمكن حذف الموظف لأنه مرتبط بـ ${tasksCount} مهمة`
      ])
    }

    await prisma.employee.delete({
      where: { id }
    })

    logger.logSystemEvent('حذف موظف', { employeeId: id })
    return ApiResponseHandler.success(null, 'تم حذف الموظف بنجاح')
  } catch (error) {
    logger.error('خطأ في حذف الموظف', { error })
    return ApiResponseHandler.serverError('خطأ في حذف الموظف')
  }
}

// الحصول على معلومات إضافية
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'getDepartments':
        // سيتم إضافة الأقسام لاحقاً
        const departments: any[] = []
        return ApiResponseHandler.success(departments)

      case 'getPositions':
        const positions = await prisma.employee.groupBy({
          by: ['position'],
          _count: {
            position: true
          }
        })

        const formattedPositions = positions.map(pos => ({
          position: pos.position,
          count: pos._count.position
        }))

        return ApiResponseHandler.success(formattedPositions)

      case 'getHierarchy':
        const { employeeId } = data
        
        if (!employeeId) {
          return ApiResponseHandler.validationError(['معرف الموظف مطلوب'])
        }

        const hierarchy = await prisma.employee.findMany({
          where: {
            id: employeeId
          },
          select: {
            id: true,
            name: true,
            position: true
          }
        })

        return ApiResponseHandler.success(hierarchy)

      default:
        return ApiResponseHandler.validationError(['إجراء غير مدعوم'])
    }
  } catch (error) {
    logger.error('خطأ في الحصول على معلومات إضافية', { error })
    return ApiResponseHandler.serverError('خطأ في الحصول على المعلومات')
  }
} 