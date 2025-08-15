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

  const admin = await prisma.user.upsert({
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

  console.log('✅ تم إنشاء المستخدم الإداري');

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
      createdBy: admin.id
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
      createdBy: admin.id
    }
  });

  console.log('✅ تم إنشاء إعدادات النظام');

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