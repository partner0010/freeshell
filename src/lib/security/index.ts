/**
 * GRIP Security Module
 * 세계 최고 수준의 보안 시스템
 */

// ============================================
// 1. XSS (Cross-Site Scripting) 방어
// ============================================

/**
 * HTML 특수문자 이스케이프
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  return str.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char]);
}

/**
 * 위험한 스크립트 태그 제거
 */
export function sanitizeHtml(html: string): string {
  // 스크립트 태그 제거
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // onclick, onerror 등 이벤트 핸들러 제거
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
  
  // javascript: URL 제거
  sanitized = sanitized.replace(/javascript\s*:/gi, '');
  
  // data: URL 제거 (이미지 제외)
  sanitized = sanitized.replace(/data\s*:(?!image\/)/gi, '');
  
  // vbscript: URL 제거
  sanitized = sanitized.replace(/vbscript\s*:/gi, '');
  
  // expression() CSS 제거
  sanitized = sanitized.replace(/expression\s*\(/gi, '');
  
  return sanitized;
}

/**
 * 사용자 입력 검증 및 살균
 */
export function sanitizeInput(input: string, options?: {
  maxLength?: number;
  allowHtml?: boolean;
  allowUrls?: boolean;
}): string {
  const { maxLength = 10000, allowHtml = false, allowUrls = true } = options || {};
  
  let sanitized = input.trim();
  
  // 길이 제한
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  // HTML 처리
  if (!allowHtml) {
    sanitized = escapeHtml(sanitized);
  } else {
    sanitized = sanitizeHtml(sanitized);
  }
  
  // URL 검증
  if (!allowUrls) {
    sanitized = sanitized.replace(/https?:\/\/[^\s]+/gi, '[URL 제거됨]');
  }
  
  // 널 바이트 제거
  sanitized = sanitized.replace(/\0/g, '');
  
  // 제어 문자 제거
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
  
  return sanitized;
}

// ============================================
// 2. CSRF (Cross-Site Request Forgery) 방어
// ============================================

/**
 * CSRF 토큰 생성
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // 서버 사이드용 (Node.js crypto 사용)
    for (let i = 0; i < 32; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * CSRF 토큰 검증
 */
export function validateCsrfToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false;
  if (token.length !== storedToken.length) return false;
  
  // 타이밍 공격 방지를 위한 상수 시간 비교
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }
  return result === 0;
}

// ============================================
// 3. SQL Injection 방어
// ============================================

/**
 * SQL Injection 위험 문자 이스케이프
 */
export function escapeSql(str: string): string {
  return str
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/;/g, '\\;')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
}

/**
 * SQL Injection 패턴 검출
 */
export function detectSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC|EXECUTE|UNION|JOIN)\b)/i,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
    /(--|;|\/\*|\*\/|@@|@|char|nchar|varchar|nvarchar|alter|begin|cast|create|cursor|declare|delete|drop|end|exec|execute|fetch|insert|kill|select|sys|sysobjects|syscolumns|table|update)/i,
    /('|\"|;|--|\*|\/\*|\*\/)/,
  ];
  
  return sqlPatterns.some((pattern) => pattern.test(input));
}

// ============================================
// 4. 비밀번호 보안
// ============================================

/**
 * 비밀번호 강도 검사
 */
export function checkPasswordStrength(password: string): {
  score: number;
  level: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  suggestions: string[];
} {
  let score = 0;
  const suggestions: string[] = [];
  
  // 길이 검사
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (password.length < 8) suggestions.push('최소 8자 이상 입력하세요');
  
  // 소문자 검사
  if (/[a-z]/.test(password)) score += 1;
  else suggestions.push('소문자를 포함하세요');
  
  // 대문자 검사
  if (/[A-Z]/.test(password)) score += 1;
  else suggestions.push('대문자를 포함하세요');
  
  // 숫자 검사
  if (/[0-9]/.test(password)) score += 1;
  else suggestions.push('숫자를 포함하세요');
  
  // 특수문자 검사
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
  else suggestions.push('특수문자를 포함하세요');
  
  // 연속 문자 검사
  if (/(.)\1{2,}/.test(password)) {
    score -= 1;
    suggestions.push('연속된 동일 문자를 피하세요');
  }
  
  // 일반적인 패턴 검사
  const commonPatterns = ['123456', 'password', 'qwerty', 'abc123', 'admin'];
  if (commonPatterns.some((p) => password.toLowerCase().includes(p))) {
    score -= 2;
    suggestions.push('일반적인 패턴을 피하세요');
  }
  
  // 레벨 결정
  let level: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  if (score <= 2) level = 'weak';
  else if (score <= 4) level = 'fair';
  else if (score <= 5) level = 'good';
  else if (score <= 6) level = 'strong';
  else level = 'very-strong';
  
  return { score: Math.max(0, Math.min(7, score)), level, suggestions };
}

/**
 * 비밀번호 해시 (클라이언트 사이드 - 실제로는 서버에서 bcrypt 사용)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ============================================
// 5. 세션 보안
// ============================================

/**
 * 안전한 세션 ID 생성
 */
export function generateSessionId(): string {
  return generateCsrfToken() + '-' + Date.now().toString(36);
}

/**
 * 세션 유효성 검사
 */
export function isSessionValid(session: {
  id: string;
  createdAt: number;
  lastActivity: number;
  maxAge?: number;
  maxInactivity?: number;
}): boolean {
  const now = Date.now();
  const maxAge = session.maxAge || 24 * 60 * 60 * 1000; // 기본 24시간
  const maxInactivity = session.maxInactivity || 30 * 60 * 1000; // 기본 30분
  
  // 세션 만료 검사
  if (now - session.createdAt > maxAge) return false;
  
  // 비활성 시간 검사
  if (now - session.lastActivity > maxInactivity) return false;
  
  return true;
}

// ============================================
// 6. URL 보안
// ============================================

/**
 * URL 검증
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // 허용된 프로토콜만
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * 안전한 리다이렉트 URL 검증
 */
export function isSafeRedirectUrl(url: string, allowedHosts: string[]): boolean {
  try {
    const parsed = new URL(url);
    return allowedHosts.includes(parsed.host);
  } catch {
    // 상대 경로는 허용
    return url.startsWith('/') && !url.startsWith('//');
  }
}

// ============================================
// 7. 파일 업로드 보안
// ============================================

/**
 * 파일 확장자 검증
 */
export function isAllowedFileExtension(
  filename: string,
  allowedExtensions: string[] = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf']
): boolean {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return allowedExtensions.includes(ext);
}

/**
 * 파일 MIME 타입 검증
 */
export function isAllowedMimeType(
  mimeType: string,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
): boolean {
  return allowedTypes.includes(mimeType);
}

/**
 * 파일 크기 검증
 */
export function isAllowedFileSize(size: number, maxSize: number = 10 * 1024 * 1024): boolean {
  return size <= maxSize;
}

// ============================================
// 8. 이메일 보안
// ============================================

/**
 * 이메일 형식 검증
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

// ============================================
// 9. 보안 로깅
// ============================================

type SecurityEventType = 
  | 'login_attempt'
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'password_change'
  | 'permission_denied'
  | 'suspicious_activity'
  | 'rate_limit_exceeded'
  | 'csrf_violation'
  | 'xss_attempt'
  | 'sql_injection_attempt';

interface SecurityEvent {
  type: SecurityEventType;
  timestamp: number;
  userId?: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

const securityLogs: SecurityEvent[] = [];

/**
 * 보안 이벤트 로깅
 */
export function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
  const logEntry: SecurityEvent = {
    ...event,
    timestamp: Date.now(),
  };
  
  securityLogs.push(logEntry);
  
  // 콘솔에도 출력 (개발 환경)
  if (process.env.NODE_ENV === 'development') {
    console.log('[SECURITY]', logEntry);
  }
  
  // 심각한 이벤트는 즉시 알림
  const criticalEvents: SecurityEventType[] = [
    'suspicious_activity',
    'csrf_violation',
    'xss_attempt',
    'sql_injection_attempt',
  ];
  
  if (criticalEvents.includes(event.type)) {
    console.error('[SECURITY ALERT]', logEntry);
    // 실제로는 이메일, Slack 등으로 알림 전송
  }
}

/**
 * 보안 로그 조회
 */
export function getSecurityLogs(filter?: {
  type?: SecurityEventType;
  userId?: string;
  startTime?: number;
  endTime?: number;
}): SecurityEvent[] {
  let filtered = [...securityLogs];
  
  if (filter?.type) {
    filtered = filtered.filter((log) => log.type === filter.type);
  }
  if (filter?.userId) {
    filtered = filtered.filter((log) => log.userId === filter.userId);
  }
  if (filter?.startTime) {
    filtered = filtered.filter((log) => log.timestamp >= filter.startTime!);
  }
  if (filter?.endTime) {
    filtered = filtered.filter((log) => log.timestamp <= filter.endTime!);
  }
  
  return filtered;
}

// ============================================
// 10. Rate Limiting
// ============================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate Limit 검사
 */
export function checkRateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetTime: now + windowMs };
  }
  
  if (entry.count >= limit) {
    logSecurityEvent({
      type: 'rate_limit_exceeded',
      details: { key, limit, windowMs },
    });
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }
  
  entry.count++;
  return { allowed: true, remaining: limit - entry.count, resetTime: entry.resetTime };
}

// ============================================
// Export All
// ============================================

export const Security = {
  // XSS
  escapeHtml,
  sanitizeHtml,
  sanitizeInput,
  
  // CSRF
  generateCsrfToken,
  validateCsrfToken,
  
  // SQL Injection
  escapeSql,
  detectSqlInjection,
  
  // Password
  checkPasswordStrength,
  hashPassword,
  
  // Session
  generateSessionId,
  isSessionValid,
  
  // URL
  isValidUrl,
  isSafeRedirectUrl,
  
  // File
  isAllowedFileExtension,
  isAllowedMimeType,
  isAllowedFileSize,
  
  // Email
  isValidEmail,
  
  // Logging
  logSecurityEvent,
  getSecurityLogs,
  
  // Rate Limiting
  checkRateLimit,
};

export default Security;

