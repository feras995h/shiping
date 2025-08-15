# تحسينات واجهات برمجة التطبيقات (API)

## 1. تحسين استجابات API

### تقليل حجم البيانات المرسلة
```typescript
// قبل التحسين - إرسال جميع الحقول
export async function GET(request: NextRequest) {
  const shipments = await prisma.shipment.findMany({
    include: {
      client: true,
      user: true,
      invoices: true,
      customs: true
    }
  });

  return ApiResponseHandler.success(shipments);
}

// بعد التحسين - إرسال الحقول المطلوبة فقط
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fields = searchParams.get('fields')?.split(',') || [];

  // تحديد الحقول الافتراضية
  const defaultFields = ['id', 'trackingNumber', 'origin', 'destination', 'status', 'createdAt'];
  const selectedFields = fields.length > 0 ? fields : defaultFields;

  // بناء كائن الاختيار ديناميكيًا
  const select: any = {};
  selectedFields.forEach(field => {
    select[field] = true;
  });

  // إضافة العلاقات المطلوبة
  if (fields.includes('client')) {
    select.client = {
      select: {
        id: true,
        name: true,
        email: true
      }
    };
  }

  const shipments = await prisma.shipment.findMany({
    select,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' }
  });

  return ApiResponseHandler.success(shipments);
}
```

## 2. إضافة التخزين المؤقت للاستجابات

### استخدام Redis للتخزين المؤقت
```typescript
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponseHandler } from '@/lib/api-response';
import { Redis } from '@upstash/redis';

// إنشاء عميل Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // إنشاء مفتاح فريد للتخزين المؤقت
    const cacheKey = `shipments:${query}:${page}:${limit}:${status}`;

    // محاولة جلب البيانات من التخزين المؤقت
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return ApiResponseHandler.success(JSON.parse(cachedData));
    }

    const skip = (page - 1) * limit;

    const where: any = {
      OR: [
        { trackingNumber: { contains: query, mode: 'insensitive' } },
        { origin: { contains: query, mode: 'insensitive' } },
        { destination: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (status) where.status = status;

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        include: {
          client: {
            select: { id: true, name: true, email: true }
          },
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.shipment.count({ where })
    ]);

    const responseData = {
      shipments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    // تخزين البيانات في Redis لمدة 5 دقائق
    await redis.setex(cacheKey, 300, JSON.stringify(responseData));

    return ApiResponseHandler.success(responseData);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return ApiResponseHandler.serverError('فشل في جلب الشحنات');
  }
}
```

## 3. تحسين أداء الطلبات المتعددة

### استخدام Promise.all للطلبات المتوازية
```typescript
// قبل التحسين - طلبات متسلسلة
export async function GET(request: NextRequest) {
  const shipments = await prisma.shipment.findMany();
  const clients = await prisma.client.findMany();
  const invoices = await prisma.invoice.findMany();

  return ApiResponseHandler.success({ shipments, clients, invoices });
}

// بعد التحسين - طلبات متوازية
export async function GET(request: NextRequest) {
  const [shipments, clients, invoices] = await Promise.all([
    prisma.shipment.findMany(),
    prisma.client.findMany(),
    prisma.invoice.findMany()
  ]);

  return ApiResponseHandler.success({ shipments, clients, invoices });
}
```

## 4. تحسين معالجة الأخطاء

### معالجة الأخطاء بشكل مفصل
```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // التحقق من صحة البيانات
    const validatedData = shipmentSchema.parse(body);

    // التحقق من وجود العميل
    const client = await prisma.client.findUnique({
      where: { id: validatedData.clientId }
    });

    if (!client) {
      return ApiResponseHandler.notFound('العميل غير موجود');
    }

    // إنشاء الشحنة
    const shipment = await prisma.shipment.create({
      data: {
        ...validatedData,
        createdBy: 'user-id', // سيتم استبداله بـ user ID الفعلي
      },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // إبطال التخزين المؤقت للشحنات
    await redis.del('shipments:*');

    return ApiResponseHandler.success(shipment, 'تم إنشاء الشحنة بنجاح');
  } catch (error) {
    console.error('Error creating shipment:', error);

    if (error instanceof z.ZodError) {
      return ApiResponseHandler.validationError(error.errors.map(e => e.message));
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return ApiResponseHandler.error('رقم التتبع موجود بالفعل', 409);
      }
    }

    return ApiResponseHandler.serverError('فشل في إنشاء الشحنة');
  }
}
```

## 5. تحسين استعلامات البحث

### استخدام البحث النصي الكامل (Full-Text Search)
```typescript
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    let where: any = {};

    if (query) {
      // استخدام البحث النصي الكامل إذا كان متاحًا
      where = {
        OR: [
          { trackingNumber: { contains: query, mode: 'insensitive' } },
          { origin: { contains: query, mode: 'insensitive' } },
          { destination: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          // البحث في بيانات العميل المرتبط
          {
            client: {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
                { company: { contains: query, mode: 'insensitive' } }
              ]
            }
          }
        ]
      };
    }

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        include: {
          client: {
            select: { id: true, name: true, email: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.shipment.count({ where })
    ]);

    return ApiResponseHandler.success({
      shipments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return ApiResponseHandler.serverError('فشل في جلب الشحنات');
  }
}
```
