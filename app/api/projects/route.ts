import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status && status !== 'all') {
      where.status = status
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          tasks: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.project.count({ where })
    ])

    // تنسيق البيانات
    const formattedProjects = projects.map(project => ({
      ...project,
      taskCount: project.tasks.length,
      completedTaskCount: project.tasks.filter(t => t.status === 'COMPLETED').length
    }))

    return ApiResponseHandler.success({
      projects: formattedProjects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    logger.error('خطأ في جلب المشاريع', { error })
    return ApiResponseHandler.serverError('خطأ في جلب المشاريع')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      description, 
      startDate, 
      endDate, 
      budget,
      createdBy
    } = body

    // التحقق من البيانات المطلوبة
    if (!name || !createdBy) {
      return ApiResponseHandler.validationError([
        'اسم المشروع والمستخدم المنشئ مطلوبان'
      ])
    }

    // التحقق من وجود المستخدم
    const user = await prisma.user.findUnique({
      where: { id: createdBy }
    })

    if (!user) {
      return ApiResponseHandler.validationError(['المستخدم غير موجود'])
    }

    // التحقق من صحة التواريخ
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return ApiResponseHandler.validationError([
        'تاريخ البداية يجب أن يكون قبل تاريخ النهاية'
      ])
    }

    // إنشاء المشروع
    const project = await prisma.project.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budget: budget ? parseFloat(budget) : null,
        createdBy
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    logger.logSystemEvent('إنشاء مشروع جديد', { 
      projectId: project.id, 
      name, 
      createdBy 
    })

    return ApiResponseHandler.success(project, 'تم إنشاء المشروع بنجاح')
  } catch (error) {
    logger.error('خطأ في إنشاء المشروع', { error })
    return ApiResponseHandler.serverError('خطأ في إنشاء المشروع')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return ApiResponseHandler.validationError(['معرف المشروع مطلوب'])
    }

    // التحقق من وجود المشروع
    const existingProject = await prisma.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return ApiResponseHandler.notFound('المشروع غير موجود')
    }

    // التحقق من وجود المستخدم إذا تم تغييره
    if (updateData.createdBy) {
      const user = await prisma.user.findUnique({
        where: { id: updateData.createdBy }
      })

      if (!user) {
        return ApiResponseHandler.validationError(['المستخدم غير موجود'])
      }
    }

    // التحقق من صحة التواريخ
    if (updateData.startDate && updateData.endDate && 
        new Date(updateData.startDate) >= new Date(updateData.endDate)) {
      return ApiResponseHandler.validationError([
        'تاريخ البداية يجب أن يكون قبل تاريخ النهاية'
      ])
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    logger.logSystemEvent('تحديث مشروع', { 
      projectId: id, 
      updates: updateData 
    })

    return ApiResponseHandler.success(project, 'تم تحديث المشروع بنجاح')
  } catch (error) {
    logger.error('خطأ في تحديث المشروع', { error })
    return ApiResponseHandler.serverError('خطأ في تحديث المشروع')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return ApiResponseHandler.validationError(['معرف المشروع مطلوب'])
    }

    // التحقق من عدم وجود مهام مرتبطة
    const tasksCount = await prisma.task.count({
      where: { projectId: id }
    })

    if (tasksCount > 0) {
      return ApiResponseHandler.validationError([
        `لا يمكن حذف المشروع لأنه مرتبط بـ ${tasksCount} مهمة`
      ])
    }

    await prisma.project.delete({
      where: { id }
    })

    logger.logSystemEvent('حذف مشروع', { projectId: id })
    return ApiResponseHandler.success(null, 'تم حذف المشروع بنجاح')
  } catch (error) {
    logger.error('خطأ في حذف المشروع', { error })
    return ApiResponseHandler.serverError('خطأ في حذف المشروع')
  }
}

// إدارة المشاريع
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'getProjectStats':
        const { projectId } = data
        
        if (!projectId) {
          return ApiResponseHandler.validationError(['معرف المشروع مطلوب'])
        }

        const [tasks, completedTasks] = await Promise.all([
          prisma.task.count({ where: { projectId } }),
          prisma.task.count({ 
            where: { 
              projectId,
              status: 'COMPLETED'
            } 
          })
        ])

        const progress = tasks > 0 ? Math.round((completedTasks / tasks) * 100) : 0

        return ApiResponseHandler.success({
          totalTasks: tasks,
          completedTasks,
          progress
        })

      case 'getProjectTimeline':
        const { projectId: timelineProjectId } = data
        
        if (!timelineProjectId) {
          return ApiResponseHandler.validationError(['معرف المشروع مطلوب'])
        }

        // حالياً لا توجد نماذج للمراحل الزمنية في Prisma schema
        // يمكن إضافة هذه الوظائف لاحقاً عند إنشاء النماذج

        return ApiResponseHandler.success({
          message: 'المراحل الزمنية غير متوفرة حالياً - يتطلب إنشاء نماذج إضافية'
        })

      case 'getProjectTeam':
        const { projectId: teamProjectId } = data
        
        if (!teamProjectId) {
          return ApiResponseHandler.validationError(['معرف المشروع مطلوب'])
        }

        // جلب المهام والمستخدمين المرتبطين بالمشروع
        const projectTasks = await prisma.task.findMany({
          where: { projectId: teamProjectId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        })

        // تجميع المستخدمين الفريدين
        const uniqueUsers = projectTasks.reduce((users, task) => {
          if (task.user && !users.find(u => u.id === task.user.id)) {
            users.push(task.user)
          }
          return users
        }, [] as any[])

        // حساب إحصائيات كل مستخدم
        const teamMembers = uniqueUsers.map(user => {
          const userTasks = projectTasks.filter(t => t.user?.id === user.id)
          const completedUserTasks = userTasks.filter(t => t.status === 'COMPLETED')
          
          return {
            ...user,
            totalTasks: userTasks.length,
            completedTasks: completedUserTasks.length,
            progress: userTasks.length > 0 ? Math.round((completedUserTasks.length / userTasks.length) * 100) : 0
          }
        })

        return ApiResponseHandler.success({
          teamMembers,
          totalTeamMembers: teamMembers.length
        })

      default:
        return ApiResponseHandler.validationError(['إجراء غير مدعوم'])
    }
  } catch (error) {
    logger.error('خطأ في إدارة المشروع', { error })
    return ApiResponseHandler.serverError('خطأ في إدارة المشروع')
  }
} 