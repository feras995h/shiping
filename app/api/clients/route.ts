
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponseHandler } from '@/lib/api-response';
import { withAuth } from '@/lib/auth-middleware';

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const query = url.searchParams.get('query');

    const where: any = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { company: { contains: query, mode: 'insensitive' } }
      ];
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: { name: true }
        },
        _count: {
          select: {
            shipments: true,
            invoices: true,
            payments: true
          }
        }
      }
    });

    const total = await prisma.client.count({ where });

    return ApiResponseHandler.success({
      clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('خطأ في جلب العملاء:', error);
    return ApiResponseHandler.serverError('فشل في جلب العملاء');
  }
});

export const POST = withAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json();
    const { name, email, phone, address, company, taxNumber, creditLimit } = body;

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address,
        company,
        taxNumber,
        creditLimit: creditLimit ? parseFloat(creditLimit) : null,
        createdBy: user.id
      }
    });

    return ApiResponseHandler.created(client);

  } catch (error) {
    console.error('خطأ في إنشاء العميل:', error);
    return ApiResponseHandler.serverError('فشل في إنشاء العميل');
  }
});
