import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@goldenhorse.com' },
    update: {},
    create: {
      email: 'admin@goldenhorse.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create sample clients
  const clients = await Promise.all([
    prisma.client.upsert({
      where: { email: 'client1@example.com' },
      update: {},
      create: {
        name: 'ABC Company',
        email: 'client1@example.com',
        phone: '+1234567890',
        address: '123 Business St, City, Country',
        company: 'ABC Company Ltd',
        taxNumber: 'TAX123456',
        creditLimit: 10000,
        balance: 0,
        isActive: true,
        createdBy: adminUser.id,
      },
    }),
    prisma.client.upsert({
      where: { email: 'client2@example.com' },
      update: {},
      create: {
        name: 'XYZ Corporation',
        email: 'client2@example.com',
        phone: '+0987654321',
        address: '456 Corporate Ave, City, Country',
        company: 'XYZ Corporation Inc',
        taxNumber: 'TAX789012',
        creditLimit: 15000,
        balance: 0,
        isActive: true,
        createdBy: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Sample clients created:', clients.length);

  // Create sample suppliers
  const suppliers = await Promise.all([
    prisma.supplier.upsert({
      where: { email: 'supplier1@example.com' },
      update: {},
      create: {
        name: 'Global Logistics',
        email: 'supplier1@example.com',
        phone: '+1112223333',
        address: '789 Logistics Blvd, City, Country',
        company: 'Global Logistics Co',
        taxNumber: 'TAX345678',
        creditLimit: 20000,
        balance: 0,
        isActive: true,
        createdBy: adminUser.id,
      },
    }),
    prisma.supplier.upsert({
      where: { email: 'supplier2@example.com' },
      update: {},
      create: {
        name: 'Express Shipping',
        email: 'supplier2@example.com',
        phone: '+4445556666',
        address: '321 Express Way, City, Country',
        company: 'Express Shipping Ltd',
        taxNumber: 'TAX901234',
        creditLimit: 25000,
        balance: 0,
        isActive: true,
        createdBy: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Sample suppliers created:', suppliers.length);

  // Create sample employees
  const employees = await Promise.all([
    prisma.employee.upsert({
      where: { email: 'employee1@example.com' },
      update: {},
      create: {
        name: 'John Doe',
        email: 'employee1@example.com',
        phone: '+7778889999',
        position: 'Logistics Manager',
        salary: 5000,
        hireDate: new Date('2023-01-15'),
        isActive: true,
        createdBy: adminUser.id,
      },
    }),
    prisma.employee.upsert({
      where: { email: 'employee2@example.com' },
      update: {},
      create: {
        name: 'Jane Smith',
        email: 'employee2@example.com',
        phone: '+3334445555',
        position: 'Shipping Coordinator',
        salary: 4000,
        hireDate: new Date('2023-03-20'),
        isActive: true,
        createdBy: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Sample employees created:', employees.length);

  // Create sample shipments
  const shipments = await Promise.all([
    prisma.shipment.create({
      data: {
        trackingNumber: 'SH-20241201-001',
        clientId: clients[0].id,
        employeeId: employees[0].id,
        origin: 'New York, USA',
        destination: 'London, UK',
        weight: 25.5,
        dimensions: '50x30x20 cm',
        description: 'Electronics shipment',
        status: 'IN_TRANSIT',
        shippingDate: new Date('2024-12-01'),
        cost: 150,
        price: 300,
        profit: 150,
        createdBy: adminUser.id,
      },
    }),
    prisma.shipment.create({
      data: {
        trackingNumber: 'SH-20241201-002',
        clientId: clients[1].id,
        employeeId: employees[1].id,
        origin: 'Tokyo, Japan',
        destination: 'Paris, France',
        weight: 15.2,
        dimensions: '40x25x15 cm',
        description: 'Fashion items',
        status: 'PENDING',
        cost: 120,
        price: 250,
        profit: 130,
        createdBy: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Sample shipments created:', shipments.length);

  // Create sample invoices
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-001',
        clientId: clients[0].id,
        shipmentId: shipments[0].id,
        amount: 300,
        tax: 30,
        total: 330,
        status: 'PENDING',
        issuedDate: new Date('2024-12-01'),
        dueDate: new Date('2024-12-31'),
        notes: 'Electronics shipment invoice',
        createdBy: adminUser.id,
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-002',
        clientId: clients[1].id,
        shipmentId: shipments[1].id,
        amount: 250,
        tax: 25,
        total: 275,
        status: 'PENDING',
        issuedDate: new Date('2024-12-01'),
        dueDate: new Date('2024-12-31'),
        notes: 'Fashion items invoice',
        createdBy: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Sample invoices created:', invoices.length);

  // Create sample payments
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        invoiceId: invoices[0].id,
        clientId: clients[0].id,
        amount: 330,
        method: 'BANK_TRANSFER',
        reference: 'PAY-2024-001',
        status: 'COMPLETED',
        paymentDate: new Date('2024-12-02'),
        notes: 'Full payment received',
        createdBy: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Sample payments created:', payments.length);

  // Create sample fixed assets
  const fixedAssets = await Promise.all([
    prisma.fixedAsset.create({
      data: {
        name: 'Delivery Van',
        description: 'Company delivery vehicle',
        category: 'Vehicles',
        purchaseDate: new Date('2023-01-01'),
        cost: 25000,
        currentValue: 22000,
        depreciationRate: 10,
        location: 'Main Warehouse',
        status: 'ACTIVE',
        createdBy: adminUser.id,
      },
    }),
    prisma.fixedAsset.create({
      data: {
        name: 'Forklift',
        description: 'Warehouse forklift',
        category: 'Equipment',
        purchaseDate: new Date('2023-02-15'),
        cost: 15000,
        currentValue: 13500,
        depreciationRate: 15,
        location: 'Main Warehouse',
        status: 'ACTIVE',
        createdBy: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Sample fixed assets created:', fixedAssets.length);

  // Create sample currencies
  const currencies = await Promise.all([
    prisma.currency.upsert({
      where: { code: 'USD' },
      update: {},
      create: {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        rate: 1.0,
        isActive: true,
      },
    }),
    prisma.currency.upsert({
      where: { code: 'EUR' },
      update: {},
      create: {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        rate: 0.85,
        isActive: true,
      },
    }),
    prisma.currency.upsert({
      where: { code: 'GBP' },
      update: {},
      create: {
        code: 'GBP',
        name: 'British Pound',
        symbol: '£',
        rate: 0.73,
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Sample currencies created:', currencies.length);

  // Initialize basic Chart of Accounts roots and system accounts
  const currency = currencies[0]
  const p: any = prisma as any
  const [assetRoot, expenseRoot, liabilityRoot, equityRoot, revenueRoot] = await Promise.all([
    p.glAccount.upsert({
      where: { code: '1' },
      update: {},
      create: { name: 'الأصول', code: '1', level: 1, rootType: 'ASSET', nature: 'DEBIT', currencyId: currency.id, isSystem: true }
    }),
    p.glAccount.upsert({
      where: { code: '2' },
      update: {},
      create: { name: 'المصروفات', code: '2', level: 1, rootType: 'EXPENSE', nature: 'DEBIT', currencyId: currency.id, isSystem: true }
    }),
    p.glAccount.upsert({
      where: { code: '3' },
      update: {},
      create: { name: 'الالتزامات', code: '3', level: 1, rootType: 'LIABILITY', nature: 'CREDIT', currencyId: currency.id, isSystem: true }
    }),
    p.glAccount.upsert({
      where: { code: '4' },
      update: {},
      create: { name: 'حقوق الملكية', code: '4', level: 1, rootType: 'EQUITY', nature: 'CREDIT', currencyId: currency.id, isSystem: true }
    }),
    p.glAccount.upsert({
      where: { code: '5' },
      update: {},
      create: { name: 'الإيرادات', code: '5', level: 1, rootType: 'REVENUE', nature: 'CREDIT', currencyId: currency.id, isSystem: true }
    }),
  ])

  const systemParents = await Promise.all([
    p.glAccount.upsert({
      where: { slug: 'employees_payable' },
      update: {},
      create: { name: 'الدائنون – موظفون', code: '3.1', level: 2, parentId: liabilityRoot.id, rootType: 'LIABILITY', nature: 'CREDIT', currencyId: currency.id, isSystem: true, slug: 'employees_payable' }
    }),
    p.glAccount.upsert({
      where: { slug: 'advances' },
      update: {},
      create: { name: 'العهد', code: '1.1', level: 2, parentId: assetRoot.id, rootType: 'ASSET', nature: 'DEBIT', currencyId: currency.id, isSystem: true, slug: 'advances' }
    }),
    p.glAccount.upsert({
      where: { slug: 'employee_loans' },
      update: {},
      create: { name: 'السلف', code: '1.2', level: 2, parentId: assetRoot.id, rootType: 'ASSET', nature: 'DEBIT', currencyId: currency.id, isSystem: true, slug: 'employee_loans' }
    }),
    p.glAccount.upsert({
      where: { slug: 'accounts_receivable_clients' },
      update: {},
      create: { name: 'المدينون – عملاء', code: '1.3', level: 2, parentId: assetRoot.id, rootType: 'ASSET', nature: 'DEBIT', currencyId: currency.id, isSystem: true, slug: 'accounts_receivable_clients' }
    }),
    p.glAccount.upsert({
      where: { slug: 'fixed_assets' },
      update: {},
      create: { name: 'الأصول الثابتة', code: '1.4', level: 2, parentId: assetRoot.id, rootType: 'ASSET', nature: 'DEBIT', currencyId: currency.id, isSystem: true, slug: 'fixed_assets' }
    }),
    p.glAccount.upsert({
      where: { slug: 'depreciation_expense' },
      update: {},
      create: { name: 'مصروف الإهلاك', code: '2.1', level: 2, parentId: expenseRoot.id, rootType: 'EXPENSE', nature: 'DEBIT', currencyId: currency.id, isSystem: true, slug: 'depreciation_expense' }
    }),
    p.glAccount.upsert({
      where: { slug: 'accumulated_depreciation' },
      update: {},
      create: { name: 'مجمع الإهلاك', code: '3.2', level: 2, parentId: liabilityRoot.id, rootType: 'LIABILITY', nature: 'CREDIT', currencyId: currency.id, isSystem: true, slug: 'accumulated_depreciation' }
    }),
  ])

  console.log('✅ Chart of Accounts initialized:', { roots: [assetRoot.code, expenseRoot.code, liabilityRoot.code, equityRoot.code, revenueRoot.code], systemParents: systemParents.length })

  // Seed default system settings (approvals/alerts)
  const settings = [
    { key: 'invoiceThreshold', value: '25000', category: 'APPROVALS', description: 'حد إنشاء طلب موافقة تلقائي للفواتير' },
    { key: 'paymentThreshold', value: '25000', category: 'APPROVALS', description: 'حد إنشاء طلب موافقة تلقائي للمدفوعات' },
    { key: 'defaultApproverRole', value: 'FINANCE_MANAGER', category: 'APPROVALS', description: 'الدور الافتراضي للجهة المعتمدة' },
    { key: 'lowCashAmount', value: '10000', category: 'ALERTS', description: 'حد السيولة الحرجة' },
    { key: 'largeTransactionAmount', value: '50000', category: 'ALERTS', description: 'حد تنبيه المعاملة الكبيرة' },
    { key: 'overdueInvoiceDays', value: '30', category: 'ALERTS', description: 'أيام التأخير قبل اعتبار الفاتورة متأخرة' },
    { key: 'balanceMismatchTolerance', value: '0.01', category: 'ALERTS', description: 'هامش التفاوت المقبول لميزان المراجعة' },
  ]

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, category: s.category, description: s.description },
      create: { key: s.key, value: s.value, category: s.category, description: s.description, createdBy: adminUser.id },
    })
  }
  console.log('✅ Default system settings seeded')

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 