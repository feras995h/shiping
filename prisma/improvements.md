# تحسينات قاعدة البيانات

## 1. إضافة فهارس (Indexes) للجداول

### فهرس لجدول الشحنات
```sql
CREATE INDEX idx_shipments_client_id ON shipments(clientId);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_created_at ON shipments(createdAt);
CREATE INDEX idx_shipments_tracking_number ON shipments(trackingNumber);
```

### فهرس لجدول الفواتير
```sql
CREATE INDEX idx_invoices_client_id ON invoices(clientId);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_created_at ON invoices(createdAt);
```

### فهرس لجدول العملاء
```sql
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_created_at ON clients(createdAt);
```

## 2. تحسين الاستعلامات

### تحسين استعلام جلب الشحنات
```prisma
// قبل التحسين
const shipments = await prisma.shipment.findMany({
  include: {
    client: true,
    user: true,
    invoices: true,
    customs: true
  }
});

// بعد التحسين - تحديد الحقول المطلوبة فقط
const shipments = await prisma.shipment.findMany({
  select: {
    id: true,
    trackingNumber: true,
    origin: true,
    destination: true,
    status: true,
    shippingDate: true,
    deliveryDate: true,
    cost: true,
    price: true,
    profit: true,
    createdAt: true,
    client: {
      select: {
        id: true,
        name: true,
        email: true
      }
    },
    user: {
      select: {
        id: true,
        name: true,
        email: true
      }
    }
    // إزالة العلاقات غير الضرورية للعرض الأولي
  }
});
```

### استخدام التصفح في الصفحات (Pagination) بشكل فعال
```prisma
const shipments = await prisma.shipment.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' }
});
```

## 3. استخدام التخزين المؤقت (Caching)

### التخزين المؤقت للبيانات الثابتة
```typescript
// مثال لتخزين العملاء مؤقتاً
const getClientsWithCache = async () => {
  const cacheKey = 'all-clients';
  const cachedClients = await redis.get(cacheKey);

  if (cachedClients) {
    return JSON.parse(cachedClients);
  }

  const clients = await prisma.client.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true
    }
  });

  await redis.set(cacheKey, JSON.stringify(clients), 'EX', 3600); // تخزين لمدة ساعة

  return clients;
};
```

## 4. تحسين الاتصال بقاعدة البيانات

### استخدام تجمع الاتصالات (Connection Pooling)
```typescript
// في ملف prisma.ts
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query'],
  }).$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        const start = performance.now();
        const result = await query(args);
        const end = performance.now();
        const duration = end - start;

        if (duration > 1000) { // تسجيل الاستعلامات البطيئة
          console.log(`Slow query: ${model}.${operation} took ${duration}ms`);
        }

        return result;
      }
    }
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
```
