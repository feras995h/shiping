# تحسينات الخادم والنشر (Server & Deployment)

## 1. تحسين إعدادات Next.js

### تحسين ملف next.config.mjs
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // تحسين الصور
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // ضغط الملفات
  compress: true,

  // تحسين حزم JavaScript
  swcMinify: true,

  // تحسين التخزين المؤقت للصفحات الثابتة
  generateStaticParams: false,

  // تحسين إعادة التوجيهات
  async redirects() {
    return [];
  },

  // تحسين العناوين
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // تحسين تجميع الوحدات
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },

  // تحسين أداء البناء
  output: 'standalone',

  // تحسين حزم التطبيق
  bundlePagesRouterDependencies: true,

  // تفعيل التخزين المؤقت للبيانات
  incrementalCacheHandlerPath: require.resolve('./cache-handler.js'),
};

export default nextConfig;
```

### تحسين ملف tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  // تحسين مسح الملفات
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // تحسين الأداء
  important: false,

  // تحسين التصميم
  theme: {
    extend: {
      // تحسين الألوان
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... باقي الألوان
      },

      // تحسين العناصر
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // تحسين الحركات
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },

      // تحسين الرسوم المتحركة
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },

  // تحسين المكونات
  plugins: [require('tailwindcss-animate')],

  // تحسين الأداء
  corePlugins: {
    preflight: false,
  },
};

export default config;
```

## 2. تحسين إعدادات Docker

### تحسين ملف Dockerfile
```dockerfile
# استخدام صورة خفيفة
FROM node:18-alpine AS base

# تثبيت التبعيات فقط عند تغيير ملفات الحزمة
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# نسخ ملفات الحزمة
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# بناء التطبيق
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# تعريف متغيرات البيئة
ENV NEXT_TELEMETRY_DISABLED=1

# بناء التطبيق
RUN npm run build

# صورة الإنتاج
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# إنشاء مستخدم غير جذري
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# نسخ الملفات الضرورية
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### تحسين ملف docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/shipping_finance_db
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret-key-here
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=shipping_finance_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

## 3. تحسين أداء الخادم

### استخدام Nginx كوكيل عكسي
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # شهادات SSL
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # تحسين SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # تحسين الأداء
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # التخزين المؤقت للملفات الثابتة
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }

    # التخزين المؤقت لصفحات API
    location /api/ {
      proxy_pass http://localhost:3000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
      proxy_cache api_cache;
      proxy_cache_valid 200 5m;
      add_header X-Proxy-Cache $upstream_cache_status;
    }

    # تمرير الطلبات الأخرى إلى Next.js
    location / {
      proxy_pass http://localhost:3000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }
}

# إعداد التخزين المؤقت لـ API
proxy_cache_path /var/cache/nginx/api_cache levels=1:2 keys_zone=api_cache:10m inactive=60m use_temp_path=off;
```

### تحسين إعدادات Node.js
```javascript
// في ملف server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Pool } = require('pg');

// تحسين إعدادات Node.js
process.env.NODE_ENV = 'production';

// تحسين تجمع اتصالات قاعدة البيانات
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // الحد الأقصى لعدد الاتصالات
  idleTimeoutMillis: 30000, // مهلة الاتصال الخامل
  connectionTimeoutMillis: 2000, // مهلة الاتصال
});

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handler(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
```

## 4. تحسين إعدادات البيئة

### تحسين متغيرات البيئة
```bash
# .env.production
# إعدادات قاعدة البيانات
DATABASE_URL="postgresql://postgres:password@db:5432/shipping_finance_db?pool=20"

# إعدادات المصادقة
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-very-secure-secret-key-here"

# إعدادات Redis
UPSTASH_REDIS_URL="https://your-redis-url"
UPSTASH_REDIS_TOKEN="your-redis-token"

# إعدادات البريد الإلكتروني
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"

# إعدادات الخدمات الخارجية
SHIPPING_API_KEY="your-shipping-api-key"
PAYMENT_GATEWAY_KEY="your-payment-gateway-key"

# إعدادات التطبيق
NODE_ENV="production"
PORT="3000"
```

## 5. تحسين المراقبة والتسجيل

### إضافة نظام مراقبة
```javascript
// lib/monitoring.js
const { createLogger, format, transports } = require('winston');

// إنشاء مسجل الأحداث
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'shipping-finance-api' },
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// إضافة نقل إلى وحدة التحكم في بيئة التطوير
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple()
  }));
}

// مراقبة أداء قاعدة البيانات
const monitorDatabasePerformance = (prisma) => {
  prisma.$on('query', (e) => {
    const duration = e.duration;
    if (duration > 1000) { // تسجيل الاستعلامات البطيئة
      logger.warn(`Slow query: ${e.query} took ${duration}ms`);
    }
  });

  prisma.$on('error', (e) => {
    logger.error('Database error:', e);
  });

  prisma.$on('info', (e) => {
    logger.info('Database info:', e);
  });
};

module.exports = { logger, monitorDatabasePerformance };
```

### استخدام Prometheus للمراقبة
```javascript
// lib/metrics.js
const client = require('prom-client');

// إنشاء سجل جديد
const register = new client.Registry();

// إضافة مقاييس افتراضية
client.collectDefaultMetrics({ register });

// إنشاء مقاييس مخصصة
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000]
});

const dbQueryDuration = new client.Histogram({
  name: 'db_query_duration_ms',
  help: 'Duration of database queries in ms',
  labelNames: ['operation', 'table'],
  buckets: [10, 50, 100, 200, 500, 1000]
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// تصدير المقاييس
module.exports = {
  register,
  httpRequestDurationMicroseconds,
  dbQueryDuration,
  activeConnections
};
```

## 6. تحسين استراتيجية النشر

### استخدام النشر التدريجي (Blue-Green Deployment)
```yaml
# docker-compose.blue.yml
version: '3.8'
services:
  app:
    image: shipping-finance-app:blue
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/shipping_finance_db
      - NEXTAUTH_URL=https://your-domain.com
      - NEXTAUTH_SECRET=your-secret-key-here
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - app-network

# docker-compose.green.yml
version: '3.8'
services:
  app:
    image: shipping-finance-app:green
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/shipping_finance_db
      - NEXTAUTH_URL=https://your-domain.com
      - NEXTAUTH_SECRET=your-secret-key-here
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - app-network
```

### استخدام Kubernetes للنشر
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: shipping-finance-app
  labels:
    app: shipping-finance-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: shipping-finance-app
  template:
    metadata:
      labels:
        app: shipping-finance-app
    spec:
      containers:
      - name: shipping-finance-app
        image: shipping-finance-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: NEXTAUTH_URL
          value: "https://your-domain.com"
        - name: NEXTAUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: nextauth-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: shipping-finance-service
spec:
  selector:
    app: shipping-finance-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: shipping-finance-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - your-domain.com
    secretName: shipping-finance-tls
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: shipping-finance-service
            port:
              number: 80
```
