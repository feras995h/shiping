import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء عملية البذر...');

  // إنشاء العملات
  const usd = await prisma.currency.upsert({
    where: { code: 'USD' },
    update: {},
    create: {
      code: 'USD',
      name: 'الدولار الأمريكي',
      symbol: '$',
      rate: 1.0,
      isActive: true
    }
  });

  const lyd = await prisma.currency.upsert({
    where: { code: 'LYD' },
    update: {},
    create: {
      code: 'LYD',
      name: 'الدينار الليبي',
      symbol: 'ل.د',
      rate: 4.85,
      isActive: true
    }
  });

  console.log('✅ تم إنشاء العملات');

  // إنشاء المستخدم الإداري
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@company.ly' },
    update: {},
    create: {
      email: 'admin@company.ly',
      name: 'المدير العام',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true
    }
  });

  // إنشاء مستخدم موظف تجريبي
  const hashedEmployeePassword = await bcrypt.hash('employee123', 12);
  const employeeUser = await prisma.user.upsert({
    where: { email: 'employee@company.ly' },
    update: {},
    create: {
      email: 'employee@company.ly',
      name: 'موظف تجريبي',
      password: hashedEmployeePassword,
      role: 'EMPLOYEE',
      isActive: true
    }
  });

  console.log('✅ تم إنشاء المستخدم الإداري والموظف');

  // إنشاء دليل الحسابات الأساسي
  const assetAccount = await prisma.glAccount.upsert({
    where: { code: '1' },
    update: {},
    create: {
      name: 'الأصول',
      code: '1',
      level: 1,
      rootType: 'ASSET',
      nature: 'DEBIT',
      currencyId: usd.id,
      isSystem: true
    }
  });

  const liabilityAccount = await prisma.glAccount.upsert({
    where: { code: '2' },
    update: {},
    create: {
      name: 'الخصوم',
      code: '2',
      level: 1,
      rootType: 'LIABILITY',
      nature: 'CREDIT',
      currencyId: usd.id,
      isSystem: true
    }
  });

  const equityAccount = await prisma.glAccount.upsert({
    where: { code: '3' },
    update: {},
    create: {
      name: 'حقوق الملكية',
      code: '3',
      level: 1,
      rootType: 'EQUITY',
      nature: 'CREDIT',
      currencyId: usd.id,
      isSystem: true
    }
  });

  const revenueAccount = await prisma.glAccount.upsert({
    where: { code: '4' },
    update: {},
    create: {
      name: 'الإيرادات',
      code: '4',
      level: 1,
      rootType: 'REVENUE',
      nature: 'CREDIT',
      currencyId: usd.id,
      isSystem: true
    }
  });

  const expenseAccount = await prisma.glAccount.upsert({
    where: { code: '5' },
    update: {},
    create: {
      name: 'المصروفات',
      code: '5',
      level: 1,
      rootType: 'EXPENSE',
      nature: 'DEBIT',
      currencyId: usd.id,
      isSystem: true
    }
  });

  console.log('✅ تم إنشاء دليل الحسابات الأساسي');

  // إنشاء إعدادات النظام
  await prisma.systemSetting.upsert({
    where: { key: 'company_name' },
    update: {},
    create: {
      key: 'company_name',
      value: 'شركة الشحن الدولي',
      description: 'اسم الشركة',
      category: 'general',
      createdBy: adminUser.id
    }
  });

  await prisma.systemSetting.upsert({
    where: { key: 'default_currency' },
    update: {},
    create: {
      key: 'default_currency',
      value: usd.id,
      description: 'العملة الافتراضية',
      category: 'financial',
      createdBy: adminUser.id
    }
  });

  console.log('✅ تم إنشاء إعدادات النظام');

  // إنشاء إعلانات تجريبية
  const advertisements = await Promise.all([
    prisma.advertisement.create({
      data: {
        title: 'مرحباً بكم في نظام إدارة الشحن',
        content: 'نظام متكامل لإدارة عمليات الشحن والشؤون المالية مع تتبع دقيق ومراقبة شاملة',
        type: 'SLIDER',
        status: 'ACTIVE',
        priority: 10,
        imageUrl: '/placeholder.jpg',
        linkUrl: '/about',
        createdBy: adminUser.id
      }
    }),
    prisma.advertisement.create({
      data: {
        title: 'خصم خاص للعملاء الجدد',
        content: 'احصل على خصم 20% على أول شحنة لك معنا',
        type: 'BANNER',
        status: 'ACTIVE',
        priority: 8,
        targetRole: 'CLIENT',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 يوم
        createdBy: adminUser.id
      }
    }),
    prisma.advertisement.create({
      data: {
        title: 'تحديث مهم على النظام',
        content: 'تم إضافة ميزات جديدة لتحسين تجربة المستخدم',
        type: 'ANNOUNCEMENT',
        status: 'ACTIVE',
        priority: 5,
        createdBy: adminUser.id
      }
    }),
    prisma.advertisement.create({
      data: {
        title: 'اجتماع الفريق الأسبوعي',
        content: 'اجتماع فريق العمل يوم الأحد الساعة 10 صباحاً',
        type: 'BANNER',
        status: 'ACTIVE',
        priority: 3,
        targetRole: 'EMPLOYEE',
        createdBy: adminUser.id
      }
    })
  ]);

  console.log('تم إنشاء بيانات التجربة بنجاح');
}

main()
  .catch((e) => {
    console.error('❌ خطأ في عملية البذر:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });