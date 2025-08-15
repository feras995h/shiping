import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseHandler } from '@/lib/api-response'
import { withRole } from '@/lib/auth-middleware'

export const GET = withRole(['ADMIN'])(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    // تحليل الشحنات
    const shipmentAnalytics = await getShipmentAnalytics(period)
    
    // تحليل الإيرادات
    const revenueAnalytics = await getRevenueAnalytics(period)
    
    // تحليل العملاء
    const clientAnalytics = await getClientAnalytics(period)
    
    // تحليل الأداء
    const performanceAnalytics = process.env.DEMO_MODE === 'true' ? await getPerformanceAnalytics(period) : { responseTime: {}, throughput: {}, errors: {} }

    return ApiResponseHandler.success({
      shipments: shipmentAnalytics,
      revenue: revenueAnalytics,
      clients: clientAnalytics,
      performance: performanceAnalytics
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return ApiResponseHandler.serverError('فشل في جلب التحليلات')
  }
})

async function getShipmentAnalytics(period: string) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const shipments = await prisma.shipment.findMany({
    where: { createdAt: { gte: startDate } },
    select: {
      status: true,
      cost: true,
      price: true,
      profit: true,
      createdAt: true
    }
  })

  const statusCounts = shipments.reduce((acc: any, shipment) => {
    acc[shipment.status] = (acc[shipment.status] || 0) + 1
    return acc
  }, {})

  const totalProfit = shipments.reduce((sum, shipment) => sum + Number(shipment.profit), 0)
  const totalRevenue = shipments.reduce((sum, shipment) => sum + Number(shipment.price), 0)

  return {
    total: shipments.length,
    statusCounts,
    totalProfit,
    totalRevenue,
    averageProfit: totalProfit / shipments.length || 0
  }
}

async function getRevenueAnalytics(period: string) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const invoices = await prisma.invoice.findMany({
    where: { createdAt: { gte: startDate } },
    select: {
      total: true,
      status: true,
      createdAt: true
    }
  })

  const totalRevenue = invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0)
  const paidRevenue = invoices
    .filter(invoice => invoice.status === 'PAID')
    .reduce((sum, invoice) => sum + Number(invoice.total), 0)

  return {
    total: totalRevenue,
    paid: paidRevenue,
    pending: totalRevenue - paidRevenue,
    averageInvoice: totalRevenue / invoices.length || 0
  }
}

async function getClientAnalytics(period: string) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const clients = await prisma.client.findMany({
    where: { createdAt: { gte: startDate } },
    include: {
      shipments: true,
      invoices: true
    }
  })

  const activeClients = clients.filter(client => client.shipments.length > 0).length
  const newClients = clients.length

  return {
    total: await prisma.client.count(),
    new: newClients,
    active: activeClients,
    averageShipmentsPerClient: clients.reduce((sum, client) => sum + client.shipments.length, 0) / clients.length || 0
  }
}

async function getPerformanceAnalytics(period: string) {
  // محاكاة بيانات الأداء
  return {
    responseTime: {
      average: Math.random() * 500 + 100,
      p95: Math.random() * 1000 + 200,
      p99: Math.random() * 2000 + 500
    },
    throughput: {
      requestsPerSecond: Math.random() * 100 + 50,
      concurrentUsers: Math.floor(Math.random() * 100) + 20
    },
    errors: {
      rate: Math.random() * 5,
      count: Math.floor(Math.random() * 100)
    }
  }
} 