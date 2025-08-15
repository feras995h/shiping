# Golden Horse Shipping & Finance System

نظام متكامل لإدارة الشحن والمالية مع واجهة مستخدم حديثة وبنية تحتية حقيقية.

## 🚀 المميزات

### 📦 إدارة الشحن
- تتبع الشحنات في الوقت الفعلي
- إدارة العملاء والموردين
- تقارير الشحن التفصيلية
- نظام تتبع متقدم

### 💰 إدارة المالية
- إدارة الفواتير والمدفوعات
- الأصول الثابتة والإهلاك
- التقارير المالية الشاملة
- إدارة العملات

### 👥 إدارة الموارد البشرية
- إدارة الموظفين
- تتبع الأداء
- إدارة الرواتب

### 📊 لوحة التحكم
- إحصائيات حية
- رسوم بيانية تفاعلية
- مؤشرات الأداء الرئيسية

## 🛠️ البنية التحتية

### قاعدة البيانات
- **PostgreSQL** - قاعدة بيانات علائقية قوية
- **Prisma ORM** - إدارة قاعدة البيانات الحديثة
- **Migrations** - إدارة التحديثات الآمنة

### المصادقة والأمان
- **NextAuth.js** - نظام مصادقة متكامل
- **JWT** - رموز الأمان
- **bcrypt** - تشفير كلمات المرور

### التحقق من الصحة
- **Zod** - التحقق من صحة البيانات
- **TypeScript** - الأمان النوعي

### إدارة الحالة
- **Zustand** - إدارة الحالة البسيطة والفعالة
- **React Query** - إدارة البيانات من الخادم

## 📋 متطلبات النظام

- Node.js 18+ 
- PostgreSQL 14+
- pnpm (مفضل) أو npm

## ⚙️ التثبيت والإعداد

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd shipping-finance-system
```

### 2. تثبيت التبعيات
```bash
pnpm install
```

### 3. إعداد قاعدة البيانات

#### أ. إنشاء قاعدة بيانات PostgreSQL
```sql
CREATE DATABASE shipping_finance_db;
```

#### ب. إعداد متغيرات البيئة
أنشئ ملف `.env` في المجلد الجذر:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/shipping_finance_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# JWT
JWT_SECRET="your-jwt-secret-here"

# Email (optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"

# External APIs (optional)
SHIPPING_API_KEY="your-shipping-api-key"
PAYMENT_GATEWAY_KEY="your-payment-gateway-key"

# File Upload (optional)
UPLOAD_DIR="public/uploads"
MAX_FILE_SIZE="10485760" # 10MB
```

### 4. إعداد قاعدة البيانات
```bash
# إنشاء جداول قاعدة البيانات
pnpm db:push

# أو استخدام migrations
pnpm db:migrate

# إنشاء بيانات تجريبية
pnpm db:seed
```

### 5. تشغيل التطبيق
```bash
# وضع التطوير
pnpm dev

# أو بناء وتشغيل الإنتاج
pnpm build
pnpm start
```

## 🔐 بيانات تسجيل الدخول الافتراضية

بعد تشغيل `pnpm db:seed`، يمكنك تسجيل الدخول باستخدام:

- **البريد الإلكتروني:** admin@goldenhorse.com
- **كلمة المرور:** admin123

## 📁 هيكل المشروع

```
shipping-finance-system/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # صفحات المصادقة
│   ├── client/            # واجهة العميل
│   ├── admin/             # لوحة الإدارة
│   └── ...
├── components/            # مكونات React
│   ├── ui/               # مكونات واجهة المستخدم
│   └── shared/           # مكونات مشتركة
├── lib/                  # مكتبات مساعدة
│   ├── prisma.ts         # اتصال قاعدة البيانات
│   ├── auth.ts           # إعدادات المصادقة
│   ├── validations.ts    # مخططات التحقق
│   ├── api-service.ts    # خدمات API
│   └── store.ts          # إدارة الحالة
├── prisma/               # إعدادات Prisma
│   ├── schema.prisma     # مخطط قاعدة البيانات
│   └── seed.ts           # بيانات تجريبية
└── public/               # الملفات الثابتة
```

## 🗄️ نماذج قاعدة البيانات

### المستخدمين (Users)
- معلومات المستخدم الأساسية
- الأدوار والصلاحيات
- جلسات المصادقة

### العملاء (Clients)
- معلومات العملاء
- حدود الائتمان
- الأرصدة

### الموردين (Suppliers)
- معلومات الموردين
- حدود الائتمان
- الأرصدة

### الشحنات (Shipments)
- تتبع الشحنات
- معلومات التكلفة والأرباح
- الحالة والتواريخ

### الفواتير (Invoices)
- فواتير العملاء والموردين
- الضرائب والمبالغ
- حالة الدفع

### المدفوعات (Payments)
- سجلات المدفوعات
- طرق الدفع
- المراجع

### الأصول الثابتة (Fixed Assets)
- الأصول والمركبات
- الإهلاك والقيم
- المواقع والحالة

## 🔧 الأوامر المتاحة

```bash
# التطوير
pnpm dev              # تشغيل خادم التطوير
pnpm build            # بناء التطبيق
pnpm start            # تشغيل خادم الإنتاج
pnpm lint             # فحص الكود

# قاعدة البيانات
pnpm db:generate      # إنشاء Prisma Client
pnpm db:push          # تحديث قاعدة البيانات
pnpm db:migrate       # تشغيل migrations
pnpm db:studio        # فتح Prisma Studio
pnpm db:seed          # إنشاء بيانات تجريبية
```

## 📊 التقارير المتاحة

### تقارير الشحن
- تقرير الشحنات حسب الحالة
- تقرير الشحنات حسب التاريخ
- تقرير الربحية

### التقارير المالية
- تقرير الدخل
- الميزانية العمومية
- تقرير التدفق النقدي

### تقارير الموارد البشرية
- تقرير أداء الموظفين
- تقرير الرواتب
- تقرير الحضور

## 🔌 التكاملات

### خدمات الشحن
- DHL API
- FedEx API
- UPS API

### بوابات الدفع
- Stripe
- PayPal
- Square

### خدمات البريد الإلكتروني
- SendGrid
- Mailgun
- AWS SES

## 🚀 النشر

### Vercel (مُوصى به)
```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel
```

### Docker
```dockerfile
# Dockerfile متوفر في المشروع
docker build -t shipping-finance .
docker run -p 3000:3000 shipping-finance
```

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push إلى الفرع
5. إنشاء Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## 📞 الدعم

للمساعدة والدعم:
- إنشاء Issue في GitHub
- التواصل عبر البريد الإلكتروني
- مراجعة الوثائق

---

**Golden Horse Shipping & Finance System** - نظام متكامل لإدارة الشحن والمالية 🚀 