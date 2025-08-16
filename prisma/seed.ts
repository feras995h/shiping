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
  const advertisements = await prisma.advertisement.createMany({
    data: [
      {
        title: "عروض خاصة على الشحن الدولي",
        description: "خصم 20% على جميع خدمات الشحن الدولي",
        content: "استفد من عروضنا الخاصة على الشحن الدولي مع خصم يصل إلى 20% على جميع الوجهات. العرض ساري حتى نهاية الشهر.",
        imageUrl: "/placeholder.jpg",
        linkUrl: "/shipments",
        isActive: true,
        order: 1,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 يوم من الآن
        createdBy: adminUser.id
      },
      {
        title: "نظام إدارة مالية متطور",
        description: "إدارة شاملة للحسابات والمعاملات المالية",
        content: "نظام محاسبي متكامل يوفر إدارة شاملة للحسابات، التقارير المالية، وتتبع المعاملات بدقة عالية.",
        imageUrl: "/placeholder.jpg",
        linkUrl: "/financial/dashboard",
        isActive: true,
        order: 2,
        startDate: new Date(),
        createdBy: adminUser.id
      },
      {
        title: "خدمة العملاء على مدار الساعة",
        description: "دعم فني متواصل لضمان أفضل خدمة",
        content: "فريق الدعم الفني متاح على مدار الساعة لمساعدتكم في جميع استفساراتكم ومتطلباتكم.",
        imageUrl: "/placeholder.jpg",
        linkUrl: "/client/chat",
        isActive: true,
        order: 3,
        startDate: new Date(),
        createdBy: employeeUser.id
      }
    ]
  })

  console.log('تم إنشاء البيانات التجريبية بنجاح!')
  console.log(`تم إنشاء ${advertisements.count} إعلان تجريبي`)

  console.log('🎉 تم إكمال عملية البذر بنجاح!');
}

main()
  .catch((e) => {
    console.error('❌ خطأ في عملية البذر:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });