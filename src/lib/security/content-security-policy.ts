/**
 * Content Security Policy (CSP) 강화
 * Enhanced Content Security Policy
 */

export interface CSPDirective {
  'default-src'?: string[];
  'script-src'?: string[];
  'style-src'?: string[];
  'img-src'?: string[];
  'connect-src'?: string[];
  'font-src'?: string[];
  'object-src'?: string[];
  'media-src'?: string[];
  'frame-src'?: string[];
  'worker-src'?: string[];
  'manifest-src'?: string[];
  'base-uri'?: string[];
  'form-action'?: string[];
  'frame-ancestors'?: string[];
  'upgrade-insecure-requests'?: boolean;
  'block-all-mixed-content'?: boolean;
}

export interface SecurityHeaders {
  'Content-Security-Policy'?: string;
  'Strict-Transport-Security'?: string;
  'X-Frame-Options'?: string;
  'X-Content-Type-Options'?: string;
  'Referrer-Policy'?: string;
  'Permissions-Policy'?: string;
}

// CSP 강화 시스템
export class ContentSecurityPolicySystem {
  // 기본 CSP 생성
  generateCSP(directives: Partial<CSPDirective> = {}): string {
    const defaultDirectives: CSPDirective = {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'img-src': ["'self'", 'data:', 'https:'],
      'connect-src': ["'self'", 'https://api.openai.com', 'https://api.deepai.org'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'frame-src': ["'none'"],
      'worker-src': ["'self'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'upgrade-insecure-requests': true,
      'block-all-mixed-content': true,
    };

    const finalDirectives = { ...defaultDirectives, ...directives };
    const parts: string[] = [];

    Object.entries(finalDirectives).forEach(([key, value]) => {
      if (value === undefined) return;
      
      if (typeof value === 'boolean') {
        if (value) parts.push(key);
      } else if (Array.isArray(value)) {
        parts.push(`${key} ${value.join(' ')}`);
      }
    });

    return parts.join('; ');
  }

  // 보안 헤더 생성
  generateSecurityHeaders(csp?: string): SecurityHeaders {
    return {
      'Content-Security-Policy': csp || this.generateCSP(),
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    };
  }

  // CSP 검증
  validateCSP(csp: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 기본 검증 로직
    if (!csp.includes("'self'")) {
      errors.push("'self' 소스가 없습니다");
    }

    if (csp.includes("'unsafe-eval'")) {
      errors.push("'unsafe-eval'는 보안 위험이 있습니다");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const contentSecurityPolicySystem = new ContentSecurityPolicySystem();

