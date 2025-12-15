/**
 * 보안 헤더 강화
 * Enhanced Security Headers
 */

export interface SecurityHeaders {
  'Content-Security-Policy': string;
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Strict-Transport-Security': string;
  'X-XSS-Protection': string;
}

/**
 * 강화된 CSP 정책
 */
export function getEnhancedCSP(): string {
  const isDev = process.env.NODE_ENV === 'development';
  
  // 개발 환경에서는 더 관대한 정책
  const scriptSrc = isDev
    ? "'self' 'unsafe-eval' 'unsafe-inline' https:"
    : "'self' https://cdn.jsdelivr.net https://unpkg.com";
  
  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "media-src 'self' data: https: blob:",
    "connect-src 'self' https: wss: ws:",
    "frame-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
    "block-all-mixed-content",
  ].join('; ');
}

/**
 * 모든 보안 헤더 생성
 */
export function getAllSecurityHeaders(): SecurityHeaders {
  return {
    'Content-Security-Policy': getEnhancedCSP(),
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()',
    ].join(', '),
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-XSS-Protection': '1; mode=block',
  };
}

/**
 * Next.js 미들웨어용 보안 헤더
 */
export function getNextJSecurityHeaders(): Record<string, string> {
  return {
    ...getAllSecurityHeaders(),
    // Next.js 특화 헤더
    'X-DNS-Prefetch-Control': 'on',
    'X-Download-Options': 'noopen',
  };
}

