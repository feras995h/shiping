import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'MANAGER', 'USER', 'CLIENT']).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Client validation schemas
export const clientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  company: z.string().optional(),
  taxNumber: z.string().optional(),
  creditLimit: z.number().optional(),
});

// Supplier validation schemas
export const supplierSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  company: z.string().optional(),
  taxNumber: z.string().optional(),
  creditLimit: z.number().optional(),
});

// Shipment validation schemas
export const shipmentSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  employeeId: z.string().optional(),
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  weight: z.number().positive('Weight must be positive'),
  dimensions: z.string().optional(),
  description: z.string().optional(),
  cost: z.number().positive('Cost must be positive'),
  price: z.number().positive('Price must be positive'),
  amountPaid: z.number().min(0).default(0),
  currencyId: z.string().min(1, 'Currency is required'),
});

// Employee validation schemas
export const employeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  position: z.string().optional(),
  salary: z.number().positive('Salary must be positive').optional(),
  hireDate: z.date().optional(),
});

// Currency validation schemas
export const currencySchema = z.object({
  code: z.string().min(3, 'Currency code must be at least 3 characters'),
  name: z.string().min(1, 'Currency name is required'),
  symbol: z.string().min(1, 'Currency symbol is required'),
  rate: z.number().positive('Exchange rate must be positive'),
});

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string().optional(),
  page: z.number().min(1, 'Page must be at least 1').optional(),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const dateRangeSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

// API Response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
});

export type ApiResponse = z.infer<typeof apiResponseSchema>;

// Security Log validation
export const securityLogSchema = z.object({
  action: z.string().min(1, 'الإجراء مطلوب'),
  description: z.string().optional(),
  level: z.enum(['INFO', 'WARNING', 'ERROR']).optional(),
  ipAddress: z.string().optional(),
  userId: z.string().optional(),
})

export type SecurityLogFormData = z.infer<typeof securityLogSchema>

// ===== مخططات التحقق الجديدة للوظائف الناقصة =====

// Task validation
export const taskSchema = z.object({
  title: z.string().min(1, "عنوان المهمة مطلوب"),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "ON_HOLD"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  dueDate: z.date().optional(),
  assignedTo: z.string().min(1, "يجب اختيار موظف"),
  projectId: z.string().optional(),
})

export type TaskFormData = z.infer<typeof taskSchema>

// Project validation
export const projectSchema = z.object({
  name: z.string().min(1, "اسم المشروع مطلوب"),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED", "ON_HOLD"]),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  budget: z.number().positive().optional(),
})

export type ProjectFormData = z.infer<typeof projectSchema>

// Customs validation
export const customsSchema = z.object({
  shipmentId: z.string().min(1, "يجب اختيار الشحنة"),
  customsNumber: z.string().min(1, "رقم التخليص مطلوب"),
  status: z.enum(["PENDING", "IN_PROGRESS", "CLEARED", "REJECTED", "ON_HOLD"]),
  documents: z.string().optional(),
  fees: z.number().positive(),
  clearanceDate: z.date().optional(),
  notes: z.string().optional(),
})

export type CustomsFormData = z.infer<typeof customsSchema>

// Warehouse validation
export const warehouseSchema = z.object({
  name: z.string().min(1, "اسم المستودع مطلوب"),
  location: z.string().min(1, "موقع المستودع مطلوب"),
  capacity: z.number().positive().optional(),
  isActive: z.boolean().optional(),
})

export type WarehouseFormData = z.infer<typeof warehouseSchema>

// Inventory validation
export const inventorySchema = z.object({
  warehouseId: z.string().min(1, "يجب اختيار المستودع"),
  itemName: z.string().min(1, "اسم العنصر مطلوب"),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  minQuantity: z.number().int().min(0),
  maxQuantity: z.number().int().positive().optional(),
})

export type InventoryFormData = z.infer<typeof inventorySchema>

// Vehicle validation
export const vehicleSchema = z.object({
  plateNumber: z.string().min(1, "رقم اللوحة مطلوب"),
  model: z.string().min(1, "موديل المركبة مطلوب"),
  capacity: z.number().positive().optional(),
  status: z.enum(["ACTIVE", "MAINTENANCE", "OUT_OF_SERVICE", "RETIRED"]),
})

export type VehicleFormData = z.infer<typeof vehicleSchema>

// Equipment validation
export const equipmentSchema = z.object({
  name: z.string().min(1, "اسم المعدة مطلوب"),
  type: z.string().min(1, "نوع المعدة مطلوب"),
  status: z.enum(["ACTIVE", "MAINTENANCE", "OUT_OF_SERVICE", "RETIRED"]),
  location: z.string().optional(),
})

export type EquipmentFormData = z.infer<typeof equipmentSchema>

// Ticket validation
export const ticketSchema = z.object({
  title: z.string().min(1, "عنوان التذكرة مطلوب"),
  description: z.string().min(1, "وصف التذكرة مطلوب"),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "CANCELLED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  category: z.string().min(1, "فئة التذكرة مطلوبة"),
  assignedTo: z.string().optional(),
})

export type TicketFormData = z.infer<typeof ticketSchema>

// Message validation
export const messageSchema = z.object({
  toId: z.string().min(1, "يجب اختيار المستلم"),
  subject: z.string().optional(),
  content: z.string().min(1, "محتوى الرسالة مطلوب"),
})

export type MessageFormData = z.infer<typeof messageSchema>

// Contact validation
export const contactSchema = z.object({
  name: z.string().min(1, "اسم جهة الاتصال مطلوب"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  notes: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>

// Settlement validation
export const settlementSchema = z.object({
  clientId: z.string().min(1, "يجب اختيار العميل"),
  amount: z.number().positive(),
  method: z.string().min(1, "طريقة التسوية مطلوبة"),
  reference: z.string().optional(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"]),
})

export type SettlementFormData = z.infer<typeof settlementSchema>

// Discount validation
export const discountSchema = z.object({
  clientId: z.string().min(1, "يجب اختيار العميل"),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING", "SPECIAL_OFFER"]),
  value: z.number().positive(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
})

export type DiscountFormData = z.infer<typeof discountSchema>

// Evaluation validation
export const evaluationSchema = z.object({
  employeeId: z.string().min(1, "يجب اختيار الموظف"),
  evaluatorId: z.string().min(1, "يجب اختيار المقيم"),
  score: z.number().int().min(1).max(10),
  comments: z.string().optional(),
  evaluationDate: z.date(),
})

export type EvaluationFormData = z.infer<typeof evaluationSchema>

// Goal validation
export const goalSchema = z.object({
  employeeId: z.string().min(1, "يجب اختيار الموظف"),
  title: z.string().min(1, "عنوان الهدف مطلوب"),
  description: z.string().optional(),
  target: z.string().min(1, "الهدف مطلوب"),
  progress: z.number().int().min(0).max(100),
  dueDate: z.date().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED", "ON_HOLD"]),
})

export type GoalFormData = z.infer<typeof goalSchema>

// System Setting validation
export const systemSettingSchema = z.object({
  key: z.string().min(1, "مفتاح الإعداد مطلوب"),
  value: z.string().min(1, "قيمة الإعداد مطلوبة"),
  description: z.string().optional(),
  category: z.string().min(1, "فئة الإعداد مطلوبة"),
  isActive: z.boolean().optional(),
})

export type SystemSettingFormData = z.infer<typeof systemSettingSchema>

// Alert validation
export const alertSchema = z.object({
  title: z.string().min(1, "عنوان التنبيه مطلوب"),
  message: z.string().min(1, "رسالة التنبيه مطلوبة"),
  type: z.enum(["INFO", "WARNING", "ERROR", "SUCCESS"]),
  userId: z.string().optional(),
})

export type AlertFormData = z.infer<typeof alertSchema>

// Report validation
export const reportSchema = z.object({
  title: z.string().min(1, "عنوان التقرير مطلوب"),
  type: z.enum(["SALES", "SHIPPING", "FINANCIAL", "OPERATIONAL", "CUSTOMER", "EMPLOYEE"]),
  parameters: z.string().optional(), // JSON string
})

export type ReportFormData = z.infer<typeof reportSchema>

// Purchase Order validation
export const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, "يجب اختيار المورد"),
  orderNumber: z.string().min(1, "رقم الطلب مطلوب"),
  description: z.string().optional(),
  totalAmount: z.number().positive(),
  status: z.enum(["DRAFT", "PENDING", "APPROVED", "ORDERED", "RECEIVED", "CANCELLED"]),
  expectedDeliveryDate: z.date().optional(),
})

export type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>

// Payment validation
export const paymentSchema = z.object({
  supplierId: z.string().min(1, "يجب اختيار المورد"),
  amount: z.number().positive(),
  method: z.string().min(1, "طريقة الدفع مطلوبة"),
  referenceNumber: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"]),
})

export type PaymentFormData = z.infer<typeof paymentSchema>

// Fixed Asset validation
export const fixedAssetSchema = z.object({
  name: z.string().min(1, "اسم الأصل مطلوب"),
  category: z.string().min(1, "فئة الأصل مطلوبة"),
  serialNumber: z.string().optional(),
  purchaseDate: z.date().optional(),
  purchasePrice: z.number().positive().optional(),
  currentValue: z.number().positive().optional(),
  status: z.enum(["ACTIVE", "MAINTENANCE", "RETIRED", "SOLD"]),
  location: z.string().optional(),
  description: z.string().optional(),
})

export type FixedAssetFormData = z.infer<typeof fixedAssetSchema>

// Invoice validation
export const invoiceSchema = z.object({
  clientId: z.string().min(1, "يجب اختيار العميل"),
  invoiceNumber: z.string().min(1, "رقم الفاتورة مطلوب"),
  description: z.string().optional(),
  amount: z.number().positive(),
  taxAmount: z.number().min(0).optional(),
  totalAmount: z.number().positive(),
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"]),
  dueDate: z.date().optional(),
})

export type InvoiceFormData = z.infer<typeof invoiceSchema>

// Document validation
export const documentSchema = z.object({
  title: z.string().min(1, "عنوان المستند مطلوب"),
  fileName: z.string().min(1, "اسم الملف مطلوب"),
  filePath: z.string().min(1, "مسار الملف مطلوب"),
  fileSize: z.number().positive(),
  fileType: z.string().min(1, "نوع الملف مطلوب"),
  type: z.enum(["INVOICE", "CONTRACT", "RECEIPT", "REPORT", "OTHER"]),
  category: z.string().optional(),
  description: z.string().optional(),
})

export type DocumentFormData = z.infer<typeof documentSchema>

// Supplier Invoice validation
export const supplierInvoiceSchema = z.object({
  supplierId: z.string().min(1, "يجب اختيار المورد"),
  invoiceNumber: z.string().min(1, "رقم الفاتورة مطلوب"),
  description: z.string().optional(),
  amount: z.number().positive(),
  taxAmount: z.number().min(0).optional(),
  totalAmount: z.number().positive(),
  status: z.enum(["DRAFT", "RECEIVED", "APPROVED", "PAID", "CANCELLED"]),
  dueDate: z.date().optional(),
})

export type SupplierInvoiceFormData = z.infer<typeof supplierInvoiceSchema>

// Quote validation
export const quoteSchema = z.object({
  clientId: z.string().min(1, "يجب اختيار العميل"),
  quoteNumber: z.string().min(1, "رقم العرض مطلوب"),
  description: z.string().optional(),
  amount: z.number().positive(),
  taxAmount: z.number().min(0).optional(),
  totalAmount: z.number().positive(),
  status: z.enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"]),
  validUntil: z.date().optional(),
})

export type QuoteFormData = z.infer<typeof quoteSchema>

// Receipt validation
export const receiptSchema = z.object({
  clientId: z.string().min(1, "يجب اختيار العميل"),
  receiptNumber: z.string().min(1, "رقم الإيصال مطلوب"),
  description: z.string().optional(),
  amount: z.number().positive(),
  method: z.string().min(1, "طريقة الدفع مطلوبة"),
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]),
})

export type ReceiptFormData = z.infer<typeof receiptSchema>

// Voucher validation
export const voucherSchema = z.object({
  code: z.string().min(1, "كود الكوبون مطلوب"),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]),
  value: z.number().positive(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  validFrom: z.date().optional(),
  validUntil: z.date().optional(),
})

export type VoucherFormData = z.infer<typeof voucherSchema>

// Tracking validation
export const trackingSchema = z.object({
  shipmentId: z.string().min(1, "يجب اختيار الشحنة"),
  trackingNumber: z.string().min(1, "رقم التتبع مطلوب"),
  location: z.string().min(1, "الموقع مطلوب"),
  status: z.enum(["PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "EXCEPTION"]),
  description: z.string().optional(),
})

export type TrackingFormData = z.infer<typeof trackingSchema>

// Shipping Order validation
export const shippingOrderSchema = z.object({
  clientId: z.string().min(1, "يجب اختيار العميل"),
  orderNumber: z.string().min(1, "رقم الطلب مطلوب"),
  description: z.string().optional(),
  origin: z.string().min(1, "نقطة البداية مطلوبة"),
  destination: z.string().min(1, "نقطة الوصول مطلوبة"),
  weight: z.number().positive().optional(),
  dimensions: z.string().optional(),
  status: z.enum(["DRAFT", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  expectedDeliveryDate: z.date().optional(),
})

export type ShippingOrderFormData = z.infer<typeof shippingOrderSchema>

// Bank Reconciliation validation
export const bankReconciliationSchema = z.object({
  accountId: z.string().min(1, "يجب اختيار الحساب البنكي"),
  referenceNumber: z.string().min(1, "الرقم المرجعي مطلوب"),
  description: z.string().optional(),
  amount: z.number().positive(),
  type: z.enum(["DEPOSIT", "WITHDRAWAL", "TRANSFER", "FEE"]),
  status: z.enum(["PENDING", "RECONCILED", "DISPUTED"]),
  transactionDate: z.date(),
})

export type BankReconciliationFormData = z.infer<typeof bankReconciliationSchema>

// Bank Transfer validation
export const bankTransferSchema = z.object({
  fromAccountId: z.string().min(1, "يجب اختيار الحساب المرسل"),
  toAccountId: z.string().min(1, "يجب اختيار الحساب المستلم"),
  transferNumber: z.string().min(1, "رقم التحويل مطلوب"),
  amount: z.number().positive(),
  description: z.string().optional(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"]),
  transferDate: z.date(),
})

export type BankTransferFormData = z.infer<typeof bankTransferSchema>

// System Test validation
export const systemTestSchema = z.object({
  name: z.string().min(1, "اسم الاختبار مطلوب"),
  type: z.enum(["UNIT", "INTEGRATION", "PERFORMANCE", "SECURITY", "UI"]),
  description: z.string().optional(),
  status: z.enum(["PENDING", "RUNNING", "PASSED", "FAILED", "SKIPPED"]),
  result: z.string().optional(),
})

export type SystemTestFormData = z.infer<typeof systemTestSchema>

// Automation Test validation
export const automationTestSchema = z.object({
  name: z.string().min(1, "اسم الاختبار مطلوب"),
  type: z.enum(["API", "UI", "DATABASE", "INTEGRATION"]),
  description: z.string().optional(),
  status: z.enum(["PENDING", "RUNNING", "PASSED", "FAILED", "SKIPPED"]),
  result: z.string().optional(),
  executionTime: z.number().optional(),
})

export type AutomationTestFormData = z.infer<typeof automationTestSchema>

// Bug Tracker validation
export const bugTrackerSchema = z.object({
  title: z.string().min(1, "عنوان الخطأ مطلوب"),
  description: z.string().min(1, "وصف الخطأ مطلوب"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REOPENED"]),
  severity: z.enum(["MINOR", "MAJOR", "CRITICAL", "BLOCKER"]),
  assignedTo: z.string().optional(),
})

export type BugTrackerFormData = z.infer<typeof bugTrackerSchema>

// Financial Report validation
export const financialReportSchema = z.object({
  title: z.string().min(1, "عنوان التقرير مطلوب"),
  type: z.enum(["BALANCE_SHEET", "INCOME_STATEMENT", "CASH_FLOW", "PROFIT_LOSS"]),
  period: z.string().min(1, "الفترة المطلوبة"),
  description: z.string().optional(),
  data: z.string().optional(), // JSON string
})

export type FinancialReportFormData = z.infer<typeof financialReportSchema>

// Profit Report validation
export const profitReportSchema = z.object({
  title: z.string().min(1, "عنوان التقرير مطلوب"),
  type: z.enum(["MONTHLY", "QUARTERLY", "YEARLY", "CUSTOM"]),
  period: z.string().min(1, "الفترة المطلوبة"),
  description: z.string().optional(),
  data: z.string().optional(), // JSON string
})

export type ProfitReportFormData = z.infer<typeof profitReportSchema>

// Sales Report validation
export const salesReportSchema = z.object({
  title: z.string().min(1, "عنوان التقرير مطلوب"),
  type: z.enum(["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]),
  period: z.string().min(1, "الفترة المطلوبة"),
  description: z.string().optional(),
  data: z.string().optional(), // JSON string
})

export type SalesReportFormData = z.infer<typeof salesReportSchema>

// Shipping Report validation
export const shippingReportSchema = z.object({
  title: z.string().min(1, "عنوان التقرير مطلوب"),
  type: z.enum(["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]),
  period: z.string().min(1, "الفترة المطلوبة"),
  description: z.string().optional(),
  data: z.string().optional(), // JSON string
})

export type ShippingReportFormData = z.infer<typeof shippingReportSchema> 

// ====== مخططات التحقق لدليل الحسابات ======
export const glAccountSchema = z.object({
  name: z.string().min(1, "اسم الحساب مطلوب"),
  parentId: z.string().nullable().optional(),
  currencyId: z.string().optional(),
  natureOverride: z.boolean().optional(),
})

export const glAccountUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "اسم الحساب مطلوب").optional(),
  code: z.string().min(1, "الرمز مطلوب").optional(),
  currencyId: z.string().optional(),
  natureOverride: z.boolean().optional(),
})

export type GlAccountFormData = z.infer<typeof glAccountSchema>