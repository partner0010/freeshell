/**
 * GRIP Security Middleware
 * Next.js 보안 미들웨어
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================
// 보안 설정
// ============================================

const SECURITY_CONFIG = {
  // Rate Limiting
  rateLimit: {
    windowMs: 60 * 1000, // 1분
    maxRequests: 100,
  },
  
  // 허용된 호스트
  allowedHosts: [
    'localhost',
    'localhost:3000',
    '127.0.0.1',
    '127.0.0.1:3000',
    'freeshell.co.kr',
    'www.freeshell.co.kr',
  ],
  
  // 차단된 User-Agent
  blockedUserAgents: [
    'curl',
    'wget',
    'python-requests',
    'scrapy',
  ],
  
  // 보안 경로 (인증 필요)
  protectedPaths: [
    '/admin',
    '/api/admin',
  ],
};

// Rate Limit 저장소
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// ============================================
// 보안 헤더
// ============================================

function getSecurityHeaders(): Record<string, string> {
  return {
    // XSS 보호 (구식이지만 호환성을 위해 유지)
    'X-XSS-Protection': '1; mode=block',
    
    // MIME 스니핑 방지
    'X-Content-Type-Options': 'nosniff',
    
    // 클릭재킹 방지 (CSP로 대체 가능하지만 호환성 유지)
    'X-Frame-Options': 'SAMEORIGIN',
    
    // Referrer 정책 (2024 최신 표준)
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // 권한 정책 (Permissions Policy - 2024 표준)
    'Permissions-Policy': [
      'accelerometer=()',
      'ambient-light-sensor=()',
      'autoplay=(self)',
      'battery=()',
      'camera=()',
      'cross-origin-isolated=()',
      'display-capture=()',
      'document-domain=(self)',
      'encrypted-media=(self)',
      'execution-while-not-rendered=()',
      'execution-while-out-of-viewport=()',
      'fullscreen=(self)',
      'geolocation=(self)',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'midi=()',
      'navigation-override=()',
      'payment=()',
      'picture-in-picture=()',
      'publickey-credentials-get=(self)',
      'screen-wake-lock=()',
      'sync-xhr=(self)',
      'usb=()',
      'web-share=(self)',
      'xr-spatial-tracking=()',
      'interest-cohort=()', // FLoC 차단
    ].join(', '),
    
    // Content Security Policy (2024 최신 표준 - strict)
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://fonts.googleapis.com", // Next.js 개발 모드용
      "script-src-elem 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https: https://images.unsplash.com https://api.qrserver.com",
      "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net",
      "connect-src 'self' https: wss: https://api.unsplash.com https://api.pwnedpasswords.com",
      "media-src 'self' blob: https:",
      "object-src 'none'",
      "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "manifest-src 'self'",
      "worker-src 'self' blob:",
      "child-src 'none'",
      "upgrade-insecure-requests",
      "block-all-mixed-content",
    ].join('; '),
    
    // Cross-Origin 정책 (2024 최신)
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'same-origin',
    
    // HTTPS 강제 (HSTS - 프로덕션)
    ...(process.env.NODE_ENV === 'production' ? {
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    } : {}),
    
    // 추가 보안 헤더 (2024)
    'X-Download-Options': 'noopen',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-DNS-Prefetch-Control': 'off',
    'Expect-CT': 'max-age=86400, enforce',
  };
}

// ============================================
// Rate Limiting
// ============================================

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = ip;
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + SECURITY_CONFIG.rateLimit.windowMs,
    });
    return { allowed: true, remaining: SECURITY_CONFIG.rateLimit.maxRequests - 1 };
  }
  
  if (entry.count >= SECURITY_CONFIG.rateLimit.maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  
  entry.count++;
  return { allowed: true, remaining: SECURITY_CONFIG.rateLimit.maxRequests - entry.count };
}

// ============================================
// 미들웨어
// ============================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  const host = request.headers.get('host') || '';
  
  // 1. 호스트 검증 (Host Header Injection 방지)
  if (process.env.NODE_ENV === 'production' && !SECURITY_CONFIG.allowedHosts.includes(host)) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // 2. 악성 봇 차단
  const isBlockedBot = SECURITY_CONFIG.blockedUserAgents.some(
    (bot) => userAgent.toLowerCase().includes(bot.toLowerCase())
  );
  if (isBlockedBot) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // 3. Rate Limiting
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Remaining': '0',
      },
    });
  }
  
  // 4. 경로 탐색 공격 방지
  if (pathname.includes('..') || pathname.includes('//')) {
    return new NextResponse('Bad Request', { status: 400 });
  }
  
  // 5. SQL Injection 기본 필터 (URL에서)
  const sqlPatterns = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|UNION)\b)/i;
  if (sqlPatterns.test(pathname) || sqlPatterns.test(request.nextUrl.search)) {
    return new NextResponse('Bad Request', { status: 400 });
  }
  
  // 6. XSS 기본 필터 (URL에서)
  const xssPatterns = /<script|javascript:|on\w+\s*=/i;
  if (xssPatterns.test(pathname) || xssPatterns.test(request.nextUrl.search)) {
    return new NextResponse('Bad Request', { status: 400 });
  }
  
  // 7. 보호된 경로 체크 (기본 인증 필요)
  const isProtectedPath = SECURITY_CONFIG.protectedPaths.some(
    (path) => pathname.startsWith(path)
  );
  
  if (isProtectedPath) {
    // 세션 쿠키 확인 (실제로는 JWT 검증 등)
    const sessionCookie = request.cookies.get('session');
    const isAuthenticated = sessionCookie?.value; // 실제로는 토큰 검증
    
    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    // 주석 처리 - 실제 인증 시스템 구현 후 활성화
    // if (!isAuthenticated) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
  }
  
  // 8. 응답에 보안 헤더 추가
  const response = NextResponse.next();
  
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Rate Limit 헤더 추가
  response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
  
  // 요청 ID 추가 (디버깅/로깅용)
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-ID', requestId);
  
  return response;
}

// ============================================
// Matcher 설정
// ============================================

export const config = {
  matcher: [
    /*
     * 아래 경로를 제외한 모든 요청에 적용:
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     * - public 폴더의 정적 파일들
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

