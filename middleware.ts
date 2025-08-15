import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// قائمة المسارات المحمية
const protectedPaths = [
  '/admin',
  '/employee',
  '/client',
  '/financial',
  '/api/admin',
  '/api/employees',
  '/api/clients',
  '/api/financial'
]

// قائمة المسارات العامة
const publicPaths = [
  '/',
  '/auth/login',
  '/api/auth',
  '/api/health'
]

// قائمة IPs المحظورة (يمكن تحديثها من قاعدة البيانات)
const blockedIPs = new Set<string>()

// معدلات الحد الأقصى للطلبات
const rateLimits = new Map<string, { count: number; resetTime: number }>()

// قائمة User Agents المشبوهة
const suspiciousUserAgents = [
  'bot',
  'crawler',
  'spider',
  'scraper',
  'curl',
  'wget'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''

  // 1. فحص IP المحظور
  if (blockedIPs.has(ip)) {
    return new NextResponse('Access Denied', { 
      status: 403,
      headers: {
        'X-Blocked-Reason': 'IP Blocked',
        'X-Block-Time': new Date().toISOString()
      }
    })
  }

  // 2. فحص User Agent المشبوه
  if (isSuspiciousUserAgent(userAgent)) {
    logSecurityEvent('suspicious_user_agent', ip, userAgent, { userAgent })
    
    // عدم حظر مباشر ولكن تسجيل الحدث
    // يمكن إضافة منطق إضافي هنا حسب الحاجة
  }

  // 3. فحص Rate Limiting
  if (!checkRateLimit(ip, pathname)) {
    logSecurityEvent('rate_limit_exceeded', ip, userAgent, { pathname })
    
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': Math.ceil(Date.now() / 1000 + 60).toString(),
        'Retry-After': '60'
      }
    })
  }

  // 4. فحص الأمان للمسارات المحمية
  if (isProtectedPath(pathname)) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    
    if (!token) {
      logSecurityEvent('unauthorized_access', ip, userAgent, { pathname })
      
      // إعادة توجيه لصفحة تسجيل الدخول
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // فحص الصلاحيات حسب المسار
    if (!hasRequiredPermission(pathname, token.role as string)) {
      logSecurityEvent('permission_denied', ip, userAgent, { 
        pathname, 
        userRole: token.role,
        userId: token.id 
      })
      
      return new NextResponse('Access Denied', { 
        status: 403,
        headers: {
          'X-Access-Denied-Reason': 'Insufficient Permissions',
          'X-Required-Role': getRequiredRole(pathname) || 'unknown'
        }
      })
    }

    // تسجيل الوصول الناجح
    logSecurityEvent('authorized_access', ip, userAgent, {
      pathname,
      userId: token.id,
      userRole: token.role
    })
  }

  // 5. فحص طلبات API للأنماط الخبيثة
  if (pathname.startsWith('/api/')) {
    const maliciousPatternDetected = await checkMaliciousPatterns(request)
    if (maliciousPatternDetected) {
      logSecurityEvent('malicious_request', ip, userAgent, { 
        pathname,
        pattern: maliciousPatternDetected 
      })
      
      // حظر IP مؤقتاً
      blockedIPs.add(ip)
      setTimeout(() => blockedIPs.delete(ip), 60 * 60 * 1000) // ساعة واحدة
      
      return new NextResponse('Malicious Request Detected', { 
        status: 400,
        headers: {
          'X-Security-Block': 'Malicious Pattern Detected',
          'X-Pattern': maliciousPatternDetected
        }
      })
    }
  }

  // 6. إضافة headers الأمان
  const response = NextResponse.next()
  
  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // HSTS (في الإنتاج فقط)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  return response
}

/**
 * الحصول على IP العميل
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const remoteAddr = request.ip
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  return realIP || remoteAddr || '127.0.0.1'
}

/**
 * فحص ما إذا كان المسار محمي
 */
function isProtectedPath(pathname: string): boolean {
  return protectedPaths.some(path => pathname.startsWith(path)) &&
         !publicPaths.some(path => pathname.startsWith(path))
}

/**
 * فحص الصلاحيات المطلوبة
 */
function hasRequiredPermission(pathname: string, userRole: string): boolean {
  // مسارات المدير
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    return userRole === 'ADMIN' || userRole === 'MANAGER'
  }
  
  // مسارات الموظف
  if (pathname.startsWith('/employee') || pathname.startsWith('/api/employees')) {
    return ['ADMIN', 'MANAGER', 'USER'].includes(userRole)
  }
  
  // مسارات العميل
  if (pathname.startsWith('/client') || pathname.startsWith('/api/clients')) {
    return ['ADMIN', 'MANAGER', 'USER', 'CLIENT'].includes(userRole)
  }
  
  // مسارات المالية
  if (pathname.startsWith('/financial') || pathname.startsWith('/api/financial')) {
    return userRole === 'ADMIN' || userRole === 'MANAGER'
  }
  
  return true
}

/**
 * الحصول على الدور المطلوب للمسار
 */
function getRequiredRole(pathname: string): string | null {
  if (pathname.startsWith('/admin')) return 'ADMIN'
  if (pathname.startsWith('/employee')) return 'USER'
  if (pathname.startsWith('/client')) return 'CLIENT'
  if (pathname.startsWith('/financial')) return 'MANAGER'
  return null
}

/**
 * فحص User Agent المشبوه
 */
function isSuspiciousUserAgent(userAgent: string): boolean {
  const lowerUA = userAgent.toLowerCase()
  return suspiciousUserAgents.some(suspicious => lowerUA.includes(suspicious))
}

/**
 * فحص معدل الطلبات
 */
function checkRateLimit(ip: string, pathname: string): boolean {
  const key = `${ip}_${pathname}`
  const now = Date.now()
  const windowMs = 60 * 1000 // دقيقة واحدة
  const maxRequests = pathname.startsWith('/api/') ? 100 : 200 // حد أقل لـ API

  if (!rateLimits.has(key)) {
    rateLimits.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  const rateLimit = rateLimits.get(key)!
  
  if (now > rateLimit.resetTime) {
    rateLimit.count = 1
    rateLimit.resetTime = now + windowMs
    return true
  }

  rateLimit.count++
  return rateLimit.count <= maxRequests
}

/**
 * فحص الأنماط الخبيثة في الطلبات
 */
async function checkMaliciousPatterns(request: NextRequest): Promise<string | null> {
  const url = request.url
  const searchParams = request.nextUrl.searchParams.toString()
  
  // أنماط SQL Injection
  const sqlPatterns = [
    /(\bSELECT\b.*\bFROM\b)/i,
    /(\bUNION\b.*\bSELECT\b)/i,
    /(\bDROP\b.*\bTABLE\b)/i,
    /(\bINSERT\b.*\bINTO\b)/i,
    /(;--)/,
    /(\bOR\b.*=.*)/i
  ]
  
  // أنماط XSS
  const xssPatterns = [
    /<script[^>]*>.*<\/script>/i,
    /javascript:/i,
    /onload\s*=/i,
    /onerror\s*=/i,
    /onclick\s*=/i
  ]
  
  // أنماط Path Traversal
  const pathTraversalPatterns = [
    /\.\.\//,
    /\.\.\\/,
    /%2e%2e%2f/i,
    /%2e%2e%5c/i
  ]
  
  const allPatterns = [
    ...sqlPatterns.map(p => ({ pattern: p, type: 'SQL Injection' })),
    ...xssPatterns.map(p => ({ pattern: p, type: 'XSS' })),
    ...pathTraversalPatterns.map(p => ({ pattern: p, type: 'Path Traversal' }))
  ]
  
  const testString = `${url} ${searchParams}`
  
  for (const { pattern, type } of allPatterns) {
    if (pattern.test(testString)) {
      return type
    }
  }
  
  // فحص body للطلبات POST/PUT
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    try {
      const body = await request.text()
      for (const { pattern, type } of allPatterns) {
        if (pattern.test(body)) {
          return type
        }
      }
    } catch (error) {
      // تجاهل أخطاء قراءة body
    }
  }
  
  return null
}

/**
 * تسجيل حدث أمني
 */
function logSecurityEvent(
  type: string,
  ip: string,
  userAgent: string,
  details: Record<string, any>
): void {
  // في التطبيق الحقيقي، ستحفظ في قاعدة البيانات أو نظام logging
  console.log(`[SECURITY EVENT] ${type}`, {
    timestamp: new Date().toISOString(),
    ip,
    userAgent,
    ...details
  })
  
  // يمكن إضافة تكامل مع نظام المراقبة هنا
  // securityMonitor.logSecurityEvent(type, undefined, ip, userAgent, details)
}

// تنظيف البيانات المؤقتة كل ساعة
setInterval(() => {
  const now = Date.now()
  
  // تنظيف rate limits المنتهية الصلاحية
  for (const [key, limit] of rateLimits.entries()) {
    if (now > limit.resetTime) {
      rateLimits.delete(key)
    }
  }
}, 60 * 60 * 1000)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}



