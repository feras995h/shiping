export const config = {
  database: {
    url: process.env.DATABASE_URL || "postgresql://username:password@localhost:5432/shipping_finance_db",
  },
  auth: {
    nextAuthUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
    nextAuthSecret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
    jwtSecret: process.env.JWT_SECRET || "your-jwt-secret-here",
  },
  email: {
    host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    user: process.env.EMAIL_SERVER_USER || "your-email@gmail.com",
    password: process.env.EMAIL_SERVER_PASSWORD || "your-app-password",
  },
  external: {
    shippingApiKey: process.env.SHIPPING_API_KEY || "your-shipping-api-key",
    paymentGatewayKey: process.env.PAYMENT_GATEWAY_KEY || "your-payment-gateway-key",
  },
  upload: {
    dir: process.env.UPLOAD_DIR || "public/uploads",
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760"), // 10MB
  },
  approvals: {
    invoiceThreshold: parseFloat(process.env.APPROVAL_INVOICE_THRESHOLD || '25000'), // 25,000
    paymentThreshold: parseFloat(process.env.APPROVAL_PAYMENT_THRESHOLD || '25000'), // 25,000
    defaultApproverRole: process.env.APPROVAL_DEFAULT_ROLE || 'FINANCE_MANAGER',
  },
} as const; 