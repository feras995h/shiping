import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const assignedTo = searchParams.get('assignedTo')
    const createdBy = searchParams.get('createdBy')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status && status !== 'all') {
      where.status = status
    }

    if (priority && priority !== 'all') {
      where.priority = priority
    }

    if (assignedTo && assignedTo !== 'all') {
      where.assignedTo = assignedTo
    }

    if (createdBy && createdBy !== 'all') {
      where.createdBy = createdBy
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          project: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.task.count({ where })
    ])

    return ApiResponseHandler.success({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    logger.error('خطأ في جلب المهام', { error })
    return ApiResponseHandler.serverError('خطأ في جلب المهام')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      description, 
      priority = 'MEDIUM',
      dueDate, 
      assignedTo,
      createdBy,
      projectId
    } = body

    // التحقق من البيانات المطلوبة
    if (!title || !assignedTo || !createdBy) {
      return ApiResponseHandler.validationError([
        'عنوان المهمة والمستخدم المكلف والمستخدم المنشئ مطلوبون'
      ])
    }

    // التحقق من وجود المستخدم المكلف
    const assignedUser = await prisma.user.findUnique({
      where: { id: assignedTo }
    })

    if (!assignedUser) {
      return ApiResponseHandler.validationError(['المستخدم المكلف غير موجود'])
    }

    // التحقق من وجود المستخدم المنشئ
    const creatorUser = await prisma.user.findUnique({
      where: { id: createdBy }
    })

    if (!creatorUser) {
      return ApiResponseHandler.validationError(['المستخدم المنشئ غير موجود'])
    }

    // التحقق من وجود المشروع إذا تم تحديده
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId }
      })

      if (!project) {
        return ApiResponseHandler.validationError(['المشروع غير موجود'])
      }
    }

    // إنشاء المهمة
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedTo,
        createdBy,
        projectId: projectId || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    logger.logSystemEvent('إنشاء مهمة جديدة', { 
      taskId: task.id, 
      title, 
      assignedTo,
      projectId 
    })

    return ApiResponseHandler.success(task, 'تم إنشاء المهمة بنجاح')
  } catch (error) {
    logger.error('خطأ في إنشاء المهمة', { error })
    return ApiResponseHandler.serverError('خطأ في إنشاء المهمة')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return ApiResponseHandler.validationError(['معرف المهمة مطلوب'])
    }

    // التحقق من وجود المهمة
    const existingTask = await prisma.task.findUnique({
      where: { id }
    })

    if (!existingTask) {
      return ApiResponseHandler.notFound('المهمة غير موجودة')
    }

    // التحقق من وجود المستخدم المكلف إذا تم تغييره
    if (updateData.assignedTo) {
      const user = await prisma.user.findUnique({
        where: { id: updateData.assignedTo }
      })

      if (!user) {
        return ApiResponseHandler.validationError(['المستخدم المكلف غير موجود'])
      }
    }

    // التحقق من وجود المشروع إذا تم تغييره
    if (updateData.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: updateData.projectId }
      })

      if (!project) {
        return ApiResponseHandler.validationError(['المشروع غير موجود'])
      }
    }

    // تحديث تاريخ الإكمال إذا تم تغيير الحالة إلى مكتملة
    if (updateData.status === 'COMPLETED' && !existingTask.completedAt) {
      updateData.completedAt = new Date()
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    logger.logSystemEvent('تحديث مهمة', { 
      taskId: id, 
      updates: updateData 
    })

    return ApiResponseHandler.success(task, 'تم تحديث المهمة بنجاح')
  } catch (error) {
    logger.error('خطأ في تحديث المهمة', { error })
    return ApiResponseHandler.serverError('خطأ في تحديث المهمة')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return ApiResponseHandler.validationError(['معرف المهمة مطلوب'])
    }

    // التحقق من عدم وجود تعليقات مرتبطة (يمكن إضافة المزيد من الفحوصات هنا)
    // حالياً لا توجد نماذج للتعليقات في Prisma schema

    await prisma.task.delete({
      where: { id }
    })

    logger.logSystemEvent('حذف مهمة', { taskId: id })
    return ApiResponseHandler.success(null, 'تم حذف المهمة بنجاح')
  } catch (error) {
    logger.error('خطأ في حذف المهمة', { error })
    return ApiResponseHandler.serverError('خطأ في حذف المهمة')
  }
}

// إدارة المهام
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'updateStatus':
        const { taskId, status } = data
        
        if (!taskId || !status) {
          return ApiResponseHandler.validationError([
            'معرف المهمة والحالة مطلوبان'
          ])
        }

        const statusTask = await prisma.task.findUnique({
          where: { id: taskId }
        })

        if (!statusTask) {
          return ApiResponseHandler.notFound('المهمة غير موجودة')
        }

        const updateData: any = { status }
        
        // تحديث تاريخ الإكمال إذا تم تغيير الحالة إلى مكتملة
        if (status === 'COMPLETED' && !statusTask.completedAt) {
          updateData.completedAt = new Date()
        }

        const updatedTask = await prisma.task.update({
          where: { id: taskId },
          data: updateData,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            creator: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            project: {
              select: {
                id: true,
                name: true
              }
            }
          }
        })

        logger.logSystemEvent('تحديث حالة مهمة', { 
          taskId, 
          oldStatus: statusTask.status,
          newStatus: status 
        })

        return ApiResponseHandler.success(updatedTask, 'تم تحديث حالة المهمة بنجاح')

      case 'addComment':
        const { taskId: commentTaskId, comment, userId } = data
        
        if (!commentTaskId || !comment || !userId) {
          return ApiResponseHandler.validationError([
            'معرف المهمة والتعليق ومعرف المستخدم مطلوبون'
          ])
        }

        // التحقق من وجود المهمة
        const commentTask = await prisma.task.findUnique({
          where: { id: commentTaskId }
        })

        if (!commentTask) {
          return ApiResponseHandler.notFound('المهمة غير موجودة')
        }

        // التحقق من وجود المستخدم
        const commentUser = await prisma.user.findUnique({
          where: { id: userId }
        })

        if (!commentUser) {
          return ApiResponseHandler.notFound('المستخدم غير موجود')
        }

        // حالياً لا توجد نماذج للتعليقات في Prisma schema
        // يمكن إضافة هذه الوظائف لاحقاً عند إنشاء النماذج

        logger.logSystemEvent('إضافة تعليق على مهمة', { 
          taskId: commentTaskId, 
          comment,
          userId 
        })

        return ApiResponseHandler.success({
          message: 'تم تسجيل التعليق - يتطلب إنشاء نموذج التعليقات'
        }, 'تم إضافة التعليق بنجاح')

      case 'getComments':
        const { taskId: commentsTaskId } = data
        
        if (!commentsTaskId) {
          return ApiResponseHandler.validationError(['معرف المهمة مطلوب'])
        }

        // التحقق من وجود المهمة
        const commentsTask = await prisma.task.findUnique({
          where: { id: commentsTaskId }
        })

        if (!commentsTask) {
          return ApiResponseHandler.notFound('المهمة غير موجودة')
        }

        // حالياً لا توجد نماذج للتعليقات في Prisma schema
        // يمكن إضافة هذه الوظائف لاحقاً عند إنشاء النماذج

        return ApiResponseHandler.success({
          message: 'التعليقات غير متوفرة حالياً - يتطلب إنشاء نموذج التعليقات'
        })

      default:
        return ApiResponseHandler.validationError(['إجراء غير مدعوم'])
    }
  } catch (error) {
    logger.error('خطأ في إدارة المهمة', { error })
    return ApiResponseHandler.serverError('خطأ في إدارة المهمة')
  }
} 