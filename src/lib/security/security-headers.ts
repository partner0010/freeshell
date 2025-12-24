/**
 * 보안 헤더 설정
 * Next.js에서 사용할 보안 헤더
 */

export const securityHeaders = {
  // XSS 보호
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  
  // HTTPS 강제
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.openai.com https://api-inference.huggingface.co",
    "frame-ancestors 'none'",
  ].join('; '),
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
  ].join(', '),
};

/**
 * Next.js headers에 적용할 보안 헤더
 */
export function getSecurityHeaders() {
  return Object.entries(securityHeaders).map(([key, value]) => ({
    key,
    value,
  }));
}
