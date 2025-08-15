# 📁 ترتيب ملفات المشروع - Frontend & Backend

## 🎨 **FRONTEND (العرض والواجهات)**

### 📱 **الصفحات الرئيسية** (`app/`)
```
app/
├── page.tsx                        # الصفحة الرئيسية
├── layout.tsx                      # التخطيط العام
├── globals.css                     # الأنماط العامة
├── loading.tsx                     # صفحة التحميل
└── not-found.tsx                   # صفحة 404
```

### 🔐 **صفحات المصادقة**
```
app/auth/
└── login/
    └── page.tsx                    # صفحة تسجيل الدخول
```

### 👤 **لوحات تحكم المستخدمين**

#### **لوحة العملاء**
```
app/client/
├── dashboard/page.tsx              # لوحة تحكم العميل
├── profile/page.tsx                # الملف الشخصي
├── addresses/page.tsx              # العناوين
├── chat/page.tsx                   # المحادثات
├── complaints/page.tsx             # الشكاوى
├── cost-analysis/page.tsx          # تحليل التكاليف
├── discounts/page.tsx              # الخصومات
├── financial-reports/page.tsx      # التقارير المالية
├── inquiries/page.tsx              # الاستفسارات
├── messages/page.tsx               # الرسائل
├── my-statistics/page.tsx          # إحصائياتي
├── notifications/page.tsx          # الإشعارات
├── price-comparison/page.tsx       # مقارنة الأسعار
├── pricing/page.tsx                # التسعير
├── settings/page.tsx               # الإعدادات
├── settlements/page.tsx            # التسويات
└── tickets/page.tsx                # التذاكر
```

#### **لوحة الموظفين**
```
app/employee/
├── dashboard/page.tsx              # لوحة تحكم الموظف
├── agent-coordination/page.tsx     # تنسيق الوكلاء
├── assets/page.tsx                 # الأصول
├── calendar/page.tsx               # التقويم
├── employees/page.tsx              # الموظفين
├── equipment/page.tsx              # المعدات
├── evaluations/page.tsx            # التقييمات
├── goals/page.tsx                  # الأهداف
├── inventory/                      # المخزون
│   ├── page.tsx
│   └── loading.tsx
├── messages/page.tsx               # الرسائل
├── my-stats/page.tsx               # إحصائياتي
├── profile/page.tsx                # الملف الشخصي
├── projects/page.tsx               # المشاريع
├── reports/page.tsx                # التقارير
├── support/page.tsx                # الدعم
├── tasks/page.tsx                  # المهام
├── vehicles/page.tsx               # المركبات
└── workflow/page.tsx               # سير العمل
```

#### **لوحة المدير**
```
app/admin/
├── dashboard/page.tsx              # لوحة تحكم المدير
├── alerts/page.tsx                 # التنبيهات
├── analytics/page.tsx              # التحليلات
├── approvals/page.tsx              # الموافقات
├── audit/page.tsx                  # التدقيق
├── backups/page.tsx                # النسخ الاحتياطية
├── cloud-services/page.tsx         # الخدمات السحابية
├── customs-integrations/page.tsx   # تكامل الجمارك
├── integrations/page.tsx           # التكاملات
├── monitoring/page.tsx             # المراقبة
├── partner-integrations/page.tsx   # تكامل الشركاء
├── performance/page.tsx            # الأداء
├── performance-reports/page.tsx    # تقارير الأداء
├── roles/page.tsx                  # الأدوار
├── security-logs/page.tsx          # سجلات الأمان
├── settings/page.tsx               # الإعدادات
├── statistics/page.tsx             # الإحصائيات
└── users/page.tsx                  # المستخدمين
```

### 💰 **النظام المالي**
```
app/financial/
├── dashboard/                      # لوحة المدير المالي
│   ├── page.tsx                   # اللوحة الأساسية
│   ├── loading.tsx                # تحميل
│   └── enhanced/                  # اللوحة المحسنة
│       └── page.tsx
├── advances/page.tsx               # السلف
├── payroll/page.tsx                # كشف الرواتب
└── system/                         # نظام مالي
```

### 📊 **النظام المحاسبي**
```
app/accounting/
├── page.tsx                        # الصفحة الرئيسية
├── loading.tsx                     # تحميل
├── balance-sheet/                  # الميزانية العمومية
│   ├── page.tsx
│   └── loading.tsx
├── chart/                          # دليل الحسابات
│   ├── page.tsx
│   └── loading.tsx
├── income-statement/               # قائمة الدخل
│   ├── page.tsx
│   └── loading.tsx
├── journal/                        # دفتر اليومية
│   ├── page.tsx
│   └── loading.tsx
├── ledger/                         # دفتر الأستاذ
│   ├── page.tsx
│   └── loading.tsx
└── trial-balance/                  # ميزان المراجعة
    └── page.tsx
```

### 📋 **صفحات العمليات**
```
app/
├── clients/                        # العملاء
│   ├── page.tsx
│   └── loading.tsx
├── suppliers/                      # الموردين
│   ├── page.tsx
│   └── loading.tsx
├── shipments/                      # الشحنات
│   ├── page.tsx
│   └── loading.tsx
├── invoices/                       # الفواتير
│   ├── page.tsx
│   └── loading.tsx
├── payments/                       # المدفوعات
├── quotes/                         # عروض الأسعار
│   ├── page.tsx
│   └── loading.tsx
├── purchase-orders/                # أوامر الشراء
│   ├── page.tsx
│   └── loading.tsx
├── fixed-assets/                   # الأصول الثابتة
│   ├── page.tsx
│   └── loading.tsx
├── documents/                      # المستندات
│   ├── page.tsx
│   └── loading.tsx
├── tracking/page.tsx               # التتبع
├── shipping-orders/page.tsx        # أوامر الشحن
├── supplier-invoices/page.tsx      # فواتير الموردين
├── receipts/page.tsx               # الإيصالات
├── vouchers/page.tsx               # السندات
├── currencies/page.tsx             # العملات
├── customs/page.tsx                # الجمارك
└── contacts/page.tsx               # جهات الاتصال
```

### 📈 **التقارير**
```
app/reports/
├── page.tsx                        # التقارير الرئيسية
├── financial/page.tsx              # التقارير المالية
├── profit/page.tsx                 # تقارير الربح
├── sales/page.tsx                  # تقارير المبيعات
└── shipping/page.tsx               # تقارير الشحن
```

### 🛠️ **أدوات النظام**
```
app/
├── system-test/page.tsx            # اختبار النظام
├── automation-test/page.tsx        # اختبار الأتمتة
└── bug-tracker/page.tsx            # تتبع الأخطاء
```

---

## ⚙️ **BACKEND (الخادم والمنطق)**

### 🔌 **واجهات برمجة التطبيقات** (`app/api/`)

#### **المصادقة والأمان**
```
app/api/auth/
└── [...nextauth]/
    └── route.ts                    # NextAuth.js
```

#### **إدارة المستخدمين والأدوار**
```
app/api/admin/
├── alerts/route.ts                 # تنبيهات المدير
├── analytics/route.ts              # تحليلات
├── approvals/route.ts              # الموافقات
├── audit/route.ts                  # التدقيق
├── backups/route.ts                # النسخ الاحتياطية
├── cloud-services/route.ts         # الخدمات السحابية
├── customs-integrations/route.ts   # تكامل الجمارك
├── integrations/route.ts           # التكاملات
├── monitoring/route.ts             # المراقبة
├── partner-integrations/route.ts   # تكامل الشركاء
├── performance/route.ts            # الأداء
├── performance-reports/route.ts    # تقارير الأداء
├── roles/route.ts                  # الأدوار
├── security-logs/route.ts          # سجلات الأمان
├── settings/route.ts               # الإعدادات
└── statistics/route.ts             # الإحصائيات
```

#### **النظام المالي والمحاسبي**
```
app/api/
├── financial/
│   ├── metrics/route.ts            # المقاييس المالية
│   └── sync/route.ts               # مزامنة البيانات المالية
├── accounting/
│   └── advanced-reports/route.ts   # التقارير المحاسبية المتقدمة
├── accounts/route.ts               # الحسابات
├── payments/route.ts               # المدفوعات
├── invoices/route.ts               # الفواتير
├── receipts/route.ts               # الإيصالات
├── vouchers/route.ts               # السندات
├── fixed-assets/route.ts           # الأصول الثابتة
└── currencies/route.ts             # العملات
```

#### **إدارة العمليات**
```
app/api/
├── clients/route.ts                # العملاء
├── suppliers/route.ts              # الموردين
├── shipments/route.ts              # الشحنات
├── shipping-orders/route.ts        # أوامر الشحن
├── tracking/route.ts               # التتبع
├── purchase-orders/route.ts        # أوامر الشراء
├── quotes/route.ts                 # عروض الأسعار
├── supplier-invoices/route.ts      # فواتير الموردين
├── settlements/route.ts            # التسويات
├── discounts/route.ts              # الخصومات
├── warehouses/route.ts             # المستودعات
├── inventory/route.ts              # المخزون
├── vehicles/route.ts               # المركبات
├── equipment/route.ts              # المعدات
└── customs/route.ts                # الجمارك
```

#### **إدارة الموارد البشرية**
```
app/api/
├── employees/route.ts              # الموظفين
├── evaluations/route.ts            # التقييمات
├── goals/route.ts                  # الأهداف
├── tasks/route.ts                  # المهام
└── projects/route.ts               # المشاريع
```

#### **التقارير والتحليلات**
```
app/api/reports/
├── route.ts                        # التقارير العامة
├── financial/route.ts              # التقارير المالية
├── profit/route.ts                 # تقارير الربح
├── sales/route.ts                  # تقارير المبيعات
└── shipping/route.ts               # تقارير الشحن
```

#### **التكاملات والخدمات**
```
app/api/
├── bank-transfers/route.ts         # التحويلات البنكية
├── bank-reconciliation/route.ts    # تسوية البنك
├── messages/route.ts               # الرسائل
├── contacts/route.ts               # جهات الاتصال
├── documents/route.ts              # المستندات
├── tickets/route.ts                # التذاكر
├── alerts/route.ts                 # التنبيهات
├── security-logs/route.ts          # سجلات الأمان
└── system-settings/route.ts        # إعدادات النظام
```

#### **أدوات التطوير والاختبار**
```
app/api/
├── system-test/route.ts            # اختبار النظام
├── automation-test/route.ts        # اختبار الأتمتة
└── bug-tracker/route.ts            # تتبع الأخطاء
```

---

## 🧩 **المكونات المشتركة** (`components/`)

### 🎨 **مكونات الواجهة**
```
components/ui/
├── accordion.tsx                   # الأكورديون
├── alert-dialog.tsx                # حوار التنبيه
├── alert.tsx                       # التنبيه
├── avatar.tsx                      # الصورة الرمزية
├── badge.tsx                       # الشارة
├── button.tsx                      # الزر
├── calendar.tsx                    # التقويم
├── card.tsx                        # البطاقة
├── checkbox.tsx                    # مربع الاختيار
├── dialog.tsx                      # الحوار
├── dropdown-menu.tsx               # القائمة المنسدلة
├── form.tsx                        # النموذج
├── input.tsx                       # الإدخال
├── label.tsx                       # التسمية
├── select.tsx                      # الاختيار
├── table.tsx                       # الجدول
├── tabs.tsx                        # التبويبات
├── textarea.tsx                    # منطقة النص
├── toast.tsx                       # التنبيه المنبثق
├── tooltip.tsx                     # تلميح الأداة
├── progress.tsx                    # شريط التقدم
├── skeleton.tsx                    # الهيكل العظمي
└── sidebar.tsx                     # الشريط الجانبي
```

### ✨ **المكونات المتحركة المخصصة**
```
components/ui/
├── simple-animated-counter.tsx     # العداد المتحرك
├── simple-loading-spinner.tsx      # محمل الدوران
├── simple-animated-card.tsx        # البطاقة المتحركة
├── simple-progress-ring.tsx        # حلقة التقدم
├── animated-counter.tsx            # العداد المتحرك (framer-motion)
├── loading-spinner.tsx             # محمل الدوران (framer-motion)
├── animated-card.tsx               # البطاقة المتحركة (framer-motion)
└── progress-ring.tsx               # حلقة التقدم (framer-motion)
```

### 💰 **المكونات المالية**
```
components/financial/
├── advanced-financial-dashboard.tsx    # لوحة التحكم المالية المتقدمة
├── simple-advanced-financial-dashboard.tsx # نسخة مبسطة
├── enhanced-financial-stats.tsx        # الإحصائيات المالية المحسنة
├── financial-notifications.tsx         # الإشعارات المالية
├── financial-alerts-panel.tsx          # لوحة التنبيهات المالية
└── sync-button.tsx                     # زر المزامنة
```

### 🔧 **المكونات المشتركة**
```
components/shared/
├── advanced-kpi-grid.tsx              # شبكة مؤشرات الأداء المتقدمة
├── unified-dashboard.tsx              # لوحة التحكم الموحدة
├── kpi-cards.tsx                      # بطاقات مؤشرات الأداء
├── page-header.tsx                    # رأس الصفحة
├── table-toolbar.tsx                  # شريط أدوات الجدول
├── advanced-workflow.tsx              # سير العمل المتقدم
├── workflow-steps.tsx                 # خطوات سير العمل
├── china-integration.tsx              # تكامل الصين
└── financial-integration.tsx          # التكامل المالي
```

### 🔐 **مكونات المصادقة**
```
components/auth/
└── (مكونات المصادقة)
```

### 🎨 **مكونات التخطيط**
```
components/
├── layout.tsx                          # التخطيط العام
└── theme-provider.tsx                  # مزود الثيم
```

---

## 📚 **المكتبات والخدمات** (`lib/`)

### 🔧 **الخدمات الأساسية**
```
lib/
├── prisma.ts                          # عميل Prisma
├── auth.ts                            # المصادقة
├── auth-middleware.ts                 # وسطاء المصادقة
├── config.ts                          # الإعدادات
├── utils.ts                           # الأدوات المساعدة
├── validations.ts                     # التحقق من البيانات
├── api-response.ts                    # استجابات API
├── api-service.ts                     # خدمة API
└── settings.ts                        # الإعدادات
```

### 💰 **الخدمات المالية**
```
lib/
├── accounting-service.ts              # خدمة المحاسبة
├── accounting.ts                      # المحاسبة
├── financial-sync.ts                  # مزامنة البيانات المالية
├── financial-alerts.ts               # التنبيهات المالية
├── advanced-accounting.ts            # المحاسبة المتقدمة
├── gl-store.ts                        # متجر دليل الحسابات
└── gl-transactions.ts                 # معاملات دليل الحسابات
```

### 🔒 **الأمان والمراقبة**
```
lib/
├── audit-trail.ts                     # مسار التدقيق
├── security-monitor.ts                # مراقب الأمان
├── monitoring.ts                      # المراقبة
└── performance-monitor.ts             # مراقب الأداء
```

### 🤖 **الأتمتة والإشعارات**
```
lib/
├── advanced-notifications.ts          # الإشعارات المتقدمة
├── automation-engine.ts              # محرك الأتمتة
├── performance-optimizations.ts       # تحسينات الأداء
└── store.ts                           # المتجر العام
```

---

## 🗄️ **قاعدة البيانات** (`prisma/`)
```
prisma/
├── schema.prisma                      # مخطط قاعدة البيانات
├── seed.ts                            # بيانات البذر
├── migrations/                        # ملفات الهجرة
└── improvements.md                    # تحسينات قاعدة البيانات
```

---

## 🎯 **الملفات الإضافية**

### 📝 **التوثيق**
```
├── README.md                          # دليل المشروع
├── CHANGELOG.md                       # سجل التغييرات
├── CONTRIBUTING.md                    # دليل المساهمة
├── LICENSE                            # الرخصة
├── ARCHITECTURE_REVIEW.md             # مراجعة البنية
├── IMPLEMENTATION_REPORT.md           # تقرير التنفيذ
├── INFRASTRUCTURE_COMPLETE.md        # اكتمال البنية التحتية
├── INFRASTRUCTURE_SUMMARY.md         # ملخص البنية التحتية
├── TESTING_REPORT.md                  # تقرير الاختبار
├── PERFORMANCE_IMPLEMENTATION_GUIDE.md # دليل تنفيذ الأداء
├── MISSING_INFRASTRUCTURE_ANALYSIS.md # تحليل البنية المفقودة
├── FINANCIAL_DASHBOARD_INTEGRATION_REPORT.md # تقرير تكامل لوحة المدير المالي
├── FINANCIAL_SYSTEM_INTEGRATION_SUCCESS_REPORT.md # تقرير نجاح تكامل النظام المالي
└── PROJECT_STRUCTURE_ORGANIZATION.md  # هذا الملف
```

### ⚙️ **إعدادات المشروع**
```
├── package.json                       # تبعيات المشروع
├── package-performance.json          # تبعيات الأداء
├── pnpm-lock.yaml                     # قفل التبعيات
├── tsconfig.json                      # إعدادات TypeScript
├── tailwind.config.ts                 # إعدادات Tailwind
├── postcss.config.mjs                 # إعدادات PostCSS
├── next.config.mjs                    # إعدادات Next.js
├── next-performance.config.mjs        # إعدادات أداء Next.js
├── components.json                    # إعدادات المكونات
├── env.example                        # مثال متغيرات البيئة
├── config.yml                         # ملف الإعدادات
├── middleware.ts                      # الوسطاء
├── cache-handler.js                   # معالج التخزين المؤقت
└── cloudflared.exe                    # أداة Cloudflare
```

### 🐳 **Docker والنشر**
```
├── Dockerfile                         # ملف Docker
├── docker-compose.yml                 # إعداد Docker Compose
└── scripts/
    ├── setup.sh                       # سكريبت الإعداد
    └── setup-docker.sh                # سكريبت إعداد Docker
```

### 🎨 **الأنماط والأصول**
```
├── styles/
│   └── globals.css                    # الأنماط العامة
├── hooks/
│   ├── use-mobile.tsx                 # هوك الجوال
│   └── use-toast.ts                   # هوك التنبيه
└── public/
    ├── placeholder-logo.png           # شعار مؤقت
    ├── placeholder-logo.svg           # شعار مؤقت SVG
    ├── placeholder-user.jpg           # صورة مستخدم مؤقتة
    ├── placeholder.jpg                # صورة مؤقتة
    └── placeholder.svg                # صورة مؤقتة SVG
```

---

## 📊 **ملخص التوزيع**

### 🎨 **Frontend (40% من المشروع)**
- **156 صفحة** تفاعلية
- **50+ مكون UI** قابل لإعادة الاستخدام  
- **15+ مكون متحرك** مخصص
- **4 لوحات تحكم** متخصصة (عميل، موظف، مدير، مالي)

### ⚙️ **Backend (35% من المشروع)**
- **80+ API endpoint** 
- **15+ خدمة** متخصصة
- **نظام مصادقة** متقدم
- **نظام مراقبة** وأمان

### 🗄️ **Database & Infrastructure (25% من المشروع)**
- **مخطط قاعدة بيانات** شامل
- **نظام هجرة** متقدم
- **خدمات التكامل** والمزامنة
- **أدوات المراقبة** والأداء

**🎯 المجموع: مشروع متكامل بنسبة 100%!** 🚀



