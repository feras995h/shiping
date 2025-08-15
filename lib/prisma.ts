import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// تحسين إعدادات Prisma للأداء
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
  errorFormat: 'pretty',
});

// إضافة مستمع للاستعلامات البطيئة في بيئة التطوير
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    if (e.duration > 1000) {
      console.warn(`⚠️ Slow query: ${e.query} took ${e.duration}ms`);
    }
  });
}

// تحسين تجمع الاتصالات
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
    errorFormat: 'pretty',
  });
};

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 