import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const level = searchParams.get('level')

    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { action: { contains: query, mode: 'insensitive' } },
        { details: { contains: query, mode: 'insensitive' } },
        { ipAddress: { contains: query, mode: 'insensitive' } },
      ],
    }

    // Note: level field doesn't exist in SecurityLog model

    const [logs, total] = await Promise.all([
      prisma.securityLog.findMany({
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
      prisma.securityLog.count({ where })
    ])

    // إحصائيات الأمان (simplified since level field doesn't exist)
    const securityStats = {
      total: total,
      today: await prisma.securityLog.count({ 
        where: { 
          createdAt: { 
            gte: new Date(new Date().setHours(0, 0, 0, 0)) 
          } 
        } 
      }),
      thisWeek: await prisma.securityLog.count({ 
        where: { 
          createdAt: { 
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
          } 
        } 
      }),
      uniqueUsers: await prisma.securityLog.groupBy({
        by: ['userId'],
        _count: true
      }).then(groups => groups.length)
    }

    return ApiResponseHandler.success({
      logs,
      stats: securityStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching security logs:', error)
    return ApiResponseHandler.serverError('فشل في جلب سجلات الأمان')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, details, ipAddress, userAgent, userId } = body

    const log = await prisma.securityLog.create({
      data: {
        action,
        details, // Use 'details' instead of 'description'
        ipAddress,
        userAgent,
        userId: userId || 'system', // Make userId required as per schema
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return ApiResponseHandler.success(log, 'تم إنشاء سجل الأمان بنجاح')
  } catch (error) {
    console.error('Error creating security log:', error)
    return ApiResponseHandler.validationError(['بيانات غير صحيحة'])
  }
} 