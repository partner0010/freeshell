/**
 * GRIP Security Headers
 * HTTP 보안 헤더 설정
 */

export interface SecurityHeaders {
  [key: string]: string;
}

/**
 * 기본 보안 헤더
 */
export function getSecurityHeaders(): SecurityHeaders {
  return {
    // XSS 보호
    'X-XSS-Protection': '1; mode=block',
    
    // MIME 스니핑 방지
    'X-Content-Type-Options': 'nosniff',
    
    // 클릭재킹 방지
    'X-Frame-Options': 'SAMEORIGIN',
    
    // Referrer 정책
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // HTTPS 강제 (HSTS)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // 권한 정책
    'Permissions-Policy': 'camera=(), microphone=(self), geolocation=(self), interest-cohort=()',
    
    // Content Security Policy
    'Content-Security-Policy': getContentSecurityPolicy(),
    
    // Cross-Origin 정책
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'same-origin',
    
    // 캐시 제어 (민감한 페이지용)
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };
}

/**
 * Content Security Policy 생성
 */
export function getContentSecurityPolicy(): string {
  const directives = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'img-src': ["'self'", 'data:', 'blob:', 'https:', 'https://images.unsplash.com', 'https://api.qrserver.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'connect-src': ["'self'", 'https://api.unsplash.com', 'wss:', 'https:'],
    'media-src': ["'self'", 'blob:'],
    'object-src': ["'none'"],
    'frame-src': ["'self'", 'https://www.youtube.com', 'https://player.vimeo.com'],
    'frame-ancestors': ["'self'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': [],
    'block-all-mixed-content': [],
  };
  
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

/**
 * API 응답용 보안 헤더
 */
export function getApiSecurityHeaders(): SecurityHeaders {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

/**
 * CORS 헤더
 */
export function getCorsHeaders(origin: string, allowedOrigins: string[]): SecurityHeaders {
  const isAllowed = allowedOrigins.includes(origin) || allowedOrigins.includes('*');
  
  if (!isAllowed) {
    return {};
  }
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  getSecurityHeaders,
  getContentSecurityPolicy,
  getApiSecurityHeaders,
  getCorsHeaders,
};

