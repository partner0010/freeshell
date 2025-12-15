/**
 * GRIP Advanced Security Module
 * 고급 보안 기능 - 세계 최고 수준 달성
 */

import { logSecurityEvent } from './index';

// ============================================
// 1. Subresource Integrity (SRI)
// ============================================

/**
 * SRI 해시 생성
 */
export async function generateSriHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-384', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const base64Hash = btoa(String.fromCharCode(...hashArray));
  return `sha384-${base64Hash}`;
}

/**
 * SRI 검증
 */
export async function verifySriHash(content: string, expectedHash: string): Promise<boolean> {
  const actualHash = await generateSriHash(content);
  return actualHash === expectedHash;
}

// ============================================
// 2. Open Redirect 방지
// ============================================

const TRUSTED_DOMAINS = [
  'localhost',
  'localhost:3000',
  'grip.app',
  'www.grip.app',
  'api.grip.app',
];

/**
 * Open Redirect 취약점 검사
 */
export function isOpenRedirectSafe(url: string): boolean {
  // 상대 경로는 안전
  if (url.startsWith('/') && !url.startsWith('//')) {
    return true;
  }
  
  try {
    const parsed = new URL(url);
    
    // 신뢰할 수 있는 도메인인지 확인
    if (!TRUSTED_DOMAINS.includes(parsed.host)) {
      logSecurityEvent({
        type: 'suspicious_activity',
        details: { type: 'open_redirect_attempt', url },
      });
      return false;
    }
    
    // 허용된 프로토콜만
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * 안전한 리다이렉트 URL 반환
 */
export function getSafeRedirectUrl(url: string, fallback: string = '/'): string {
  return isOpenRedirectSafe(url) ? url : fallback;
}

// ============================================
// 3. Server-Side Request Forgery (SSRF) 방지
// ============================================

const BLOCKED_IP_RANGES = [
  // Loopback
  /^127\./,
  /^0\./,
  // Private networks
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^192\.168\./,
  // Link-local
  /^169\.254\./,
  // AWS metadata
  /^169\.254\.169\.254/,
  // Localhost IPv6
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
];

/**
 * SSRF 취약점 검사
 */
export async function isSsrfSafe(url: string): Promise<boolean> {
  try {
    const parsed = new URL(url);
    
    // IP 주소 직접 접근 차단
    const hostname = parsed.hostname;
    
    // 차단된 IP 범위 확인
    for (const pattern of BLOCKED_IP_RANGES) {
      if (pattern.test(hostname)) {
        logSecurityEvent({
          type: 'suspicious_activity',
          details: { type: 'ssrf_attempt', url, hostname },
        });
        return false;
      }
    }
    
    // 허용된 프로토콜만
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    
    // 포트 검사 (위험한 포트 차단)
    const port = parsed.port || (parsed.protocol === 'https:' ? '443' : '80');
    const dangerousPorts = ['22', '23', '25', '3306', '5432', '6379', '27017'];
    if (dangerousPorts.includes(port)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// ============================================
// 4. XML External Entity (XXE) 방지
// ============================================

/**
 * XXE 공격 패턴 탐지
 */
export function detectXxeAttack(xml: string): boolean {
  const xxePatterns = [
    /<!DOCTYPE[^>]*\[/i,
    /<!ENTITY/i,
    /SYSTEM\s+["']/i,
    /PUBLIC\s+["']/i,
    /file:\/\//i,
    /expect:\/\//i,
    /php:\/\//i,
  ];
  
  if (xxePatterns.some((pattern) => pattern.test(xml))) {
    logSecurityEvent({
      type: 'suspicious_activity',
      details: { type: 'xxe_attempt' },
    });
    return true;
  }
  
  return false;
}

/**
 * 안전한 XML 파싱 설정
 */
export function getSafeXmlParserConfig() {
  return {
    // DOCTYPE 선언 비활성화
    disallowDoctype: true,
    // 외부 엔티티 비활성화
    resolveExternalEntities: false,
    // 외부 DTD 비활성화
    loadExternalDtd: false,
    // 엔티티 확장 제한
    maxEntityExpansions: 1000,
  };
}

// ============================================
// 5. Insecure Deserialization 방지
// ============================================

/**
 * 직렬화된 데이터 안전성 검사
 */
export function isSafeToDeserialize(data: string): boolean {
  // 위험한 패턴 검사
  const dangerousPatterns = [
    /__proto__/i,
    /constructor\s*:/i,
    /prototype\s*:/i,
    /\$\{/,
    /eval\s*\(/i,
    /Function\s*\(/i,
  ];
  
  if (dangerousPatterns.some((pattern) => pattern.test(data))) {
    logSecurityEvent({
      type: 'suspicious_activity',
      details: { type: 'insecure_deserialization' },
    });
    return false;
  }
  
  return true;
}

/**
 * 안전한 JSON 파싱
 */
export function safeJsonParse<T>(data: string, defaultValue: T): T {
  if (!isSafeToDeserialize(data)) {
    return defaultValue;
  }
  
  try {
    const parsed = JSON.parse(data);
    
    // Prototype pollution 방지
    if (typeof parsed === 'object' && parsed !== null) {
      if ('__proto__' in parsed || 'constructor' in parsed || 'prototype' in parsed) {
        return defaultValue;
      }
    }
    
    return parsed as T;
  } catch {
    return defaultValue;
  }
}

// ============================================
// 6. Clickjacking 방지 강화
// ============================================

/**
 * Frame Busting 코드 생성
 */
export function getFrameBustingScript(): string {
  return `
    if (window.top !== window.self) {
      window.top.location = window.self.location;
    }
  `;
}

/**
 * 현재 페이지가 프레임 내에서 로드되었는지 확인
 */
export function isInFrame(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    // 접근 거부 = 다른 도메인의 프레임 내에 있음
    return true;
  }
}

// ============================================
// 7. Security Headers 강화
// ============================================

export function getAdvancedSecurityHeaders(): Record<string, string> {
  return {
    // 기존 헤더에 추가
    'X-Download-Options': 'noopen',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Clear-Site-Data': '"cache","cookies","storage"', // 로그아웃 시 사용
    'Expect-CT': 'max-age=86400, enforce',
    'X-DNS-Prefetch-Control': 'off',
    
    // Cross-Origin 정책 강화
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'same-origin',
    
    // Cache 보안
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '-1',
  };
}

// ============================================
// 8. API 보안 강화
// ============================================

interface ApiRateLimitConfig {
  endpoint: string;
  maxRequests: number;
  windowMs: number;
}

const apiRateLimits: ApiRateLimitConfig[] = [
  { endpoint: '/api/auth/login', maxRequests: 5, windowMs: 15 * 60 * 1000 },
  { endpoint: '/api/auth/register', maxRequests: 3, windowMs: 60 * 60 * 1000 },
  { endpoint: '/api/auth/reset-password', maxRequests: 3, windowMs: 60 * 60 * 1000 },
  { endpoint: '/api/upload', maxRequests: 10, windowMs: 60 * 1000 },
  { endpoint: '/api/ai', maxRequests: 20, windowMs: 60 * 1000 },
];

const apiRateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * API 엔드포인트별 Rate Limit 검사
 */
export function checkApiRateLimit(
  endpoint: string,
  identifier: string
): { allowed: boolean; remaining: number; resetTime: number } {
  // 엔드포인트 설정 찾기
  const config = apiRateLimits.find((c) => endpoint.startsWith(c.endpoint));
  if (!config) {
    return { allowed: true, remaining: 100, resetTime: Date.now() + 60000 };
  }
  
  const key = `${endpoint}:${identifier}`;
  const now = Date.now();
  const entry = apiRateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    apiRateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime: now + config.windowMs };
  }
  
  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }
  
  entry.count++;
  return { allowed: true, remaining: config.maxRequests - entry.count, resetTime: entry.resetTime };
}

// ============================================
// 9. WebSocket 보안
// ============================================

/**
 * WebSocket Origin 검증
 */
export function validateWebSocketOrigin(origin: string | null): boolean {
  if (!origin) return false;
  
  try {
    const url = new URL(origin);
    return TRUSTED_DOMAINS.includes(url.host);
  } catch {
    return false;
  }
}

/**
 * WebSocket 메시지 검증
 */
export function validateWebSocketMessage(message: string): boolean {
  // 크기 제한
  if (message.length > 1024 * 1024) { // 1MB
    return false;
  }
  
  // JSON 형식 검증
  try {
    const parsed = JSON.parse(message);
    return isSafeToDeserialize(message);
  } catch {
    return false;
  }
}

// ============================================
// 10. 파일 업로드 보안 강화
// ============================================

/**
 * 파일 Magic Number 검증
 */
export function validateFileMagicNumber(buffer: ArrayBuffer, expectedType: string): boolean {
  const bytes = new Uint8Array(buffer.slice(0, 12));
  
  const magicNumbers: Record<string, number[]> = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/gif': [0x47, 0x49, 0x46, 0x38],
    'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF
    'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
    'video/mp4': [0x00, 0x00, 0x00], // ftyp at offset 4
  };
  
  const expected = magicNumbers[expectedType];
  if (!expected) return true; // 알 수 없는 타입은 통과
  
  for (let i = 0; i < expected.length; i++) {
    if (bytes[i] !== expected[i]) {
      logSecurityEvent({
        type: 'suspicious_activity',
        details: { type: 'file_magic_mismatch', expectedType },
      });
      return false;
    }
  }
  
  return true;
}

/**
 * 파일명 정규화
 */
export function sanitizeFileName(fileName: string): string {
  // 위험한 문자 제거
  let safe = fileName
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/\.\./g, '_')
    .trim();
  
  // 숨김 파일 방지
  if (safe.startsWith('.')) {
    safe = '_' + safe.substring(1);
  }
  
  // 최대 길이 제한
  if (safe.length > 255) {
    const ext = safe.substring(safe.lastIndexOf('.'));
    safe = safe.substring(0, 255 - ext.length) + ext;
  }
  
  return safe;
}

/**
 * 이미지 exif 데이터에서 민감 정보 제거 (서버에서 처리 필요)
 */
export function shouldStripExifData(): boolean {
  return true;
}

// ============================================
// 11. 비밀번호 유출 검사 (Have I Been Pwned API)
// ============================================

/**
 * 비밀번호가 유출되었는지 확인 (k-anonymity 방식)
 */
export async function isPasswordBreached(password: string): Promise<boolean> {
  try {
    // SHA-1 해시 생성
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    // 첫 5글자만 전송 (k-anonymity)
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);
    
    // Have I Been Pwned API 호출
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!response.ok) {
      return false; // API 오류 시 통과
    }
    
    const text = await response.text();
    const hashes = text.split('\n');
    
    for (const line of hashes) {
      const [hash, count] = line.split(':');
      if (hash.trim() === suffix) {
        const breachCount = parseInt(count, 10);
        if (breachCount > 0) {
          logSecurityEvent({
            type: 'suspicious_activity',
            details: { type: 'breached_password', breachCount },
          });
          return true;
        }
      }
    }
    
    return false;
  } catch {
    return false; // 오류 시 통과
  }
}

// ============================================
// 12. 콘텐츠 무결성 검증
// ============================================

/**
 * 콘텐츠 해시 생성
 */
export async function generateContentHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 콘텐츠 무결성 검증
 */
export async function verifyContentIntegrity(
  content: string,
  expectedHash: string
): Promise<boolean> {
  const actualHash = await generateContentHash(content);
  return actualHash === expectedHash;
}

// ============================================
// 13. Security.txt 생성
// ============================================

export function getSecurityTxt(): string {
  return `# GRIP Security Policy
Contact: mailto:security@grip.app
Encryption: https://grip.app/.well-known/pgp-key.txt
Acknowledgments: https://grip.app/security/hall-of-fame
Policy: https://grip.app/security/policy
Hiring: https://grip.app/careers
Preferred-Languages: ko, en
Canonical: https://grip.app/.well-known/security.txt
Expires: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}
`;
}

// ============================================
// 14. 봇 탐지 강화 (Fingerprinting)
// ============================================

export interface BrowserFingerprint {
  userAgent: string;
  language: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  cookiesEnabled: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  webGL: string;
  canvas: string;
}

/**
 * 브라우저 핑거프린트 생성
 */
export function generateBrowserFingerprint(): BrowserFingerprint | null {
  if (typeof window === 'undefined') return null;
  
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookiesEnabled: navigator.cookieEnabled,
    localStorage: !!window.localStorage,
    sessionStorage: !!window.sessionStorage,
    webGL: getWebGLFingerprint(),
    canvas: getCanvasFingerprint(),
  };
}

function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'none';
    
    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'unknown';
    
    const vendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    return `${vendor}~${renderer}`;
  } catch {
    return 'error';
  }
}

function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'none';
    
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('GRIP fingerprint', 2, 2);
    
    return canvas.toDataURL().slice(-50);
  } catch {
    return 'error';
  }
}

/**
 * 의심스러운 봇 행동 탐지
 */
export function detectSuspiciousBotBehavior(fingerprint: BrowserFingerprint): boolean {
  // User-Agent와 플랫폼 불일치
  if (
    fingerprint.userAgent.includes('Windows') &&
    !fingerprint.platform.includes('Win')
  ) {
    return true;
  }
  
  // 비정상적인 해상도
  if (fingerprint.screenResolution === '0x0') {
    return true;
  }
  
  // JavaScript 기능 부재
  if (!fingerprint.cookiesEnabled && !fingerprint.localStorage) {
    return true;
  }
  
  // WebGL 없음 (헤드리스 브라우저 가능성)
  if (fingerprint.webGL === 'none' || fingerprint.webGL === 'error') {
    return true;
  }
  
  return false;
}

// ============================================
// Export
// ============================================

export const AdvancedSecurity = {
  // SRI
  generateSriHash,
  verifySriHash,
  
  // Open Redirect
  isOpenRedirectSafe,
  getSafeRedirectUrl,
  
  // SSRF
  isSsrfSafe,
  
  // XXE
  detectXxeAttack,
  getSafeXmlParserConfig,
  
  // Deserialization
  isSafeToDeserialize,
  safeJsonParse,
  
  // Clickjacking
  getFrameBustingScript,
  isInFrame,
  
  // Headers
  getAdvancedSecurityHeaders,
  
  // API
  checkApiRateLimit,
  
  // WebSocket
  validateWebSocketOrigin,
  validateWebSocketMessage,
  
  // File Upload
  validateFileMagicNumber,
  sanitizeFileName,
  shouldStripExifData,
  
  // Password
  isPasswordBreached,
  
  // Integrity
  generateContentHash,
  verifyContentIntegrity,
  
  // Security.txt
  getSecurityTxt,
  
  // Bot Detection
  generateBrowserFingerprint,
  detectSuspiciousBotBehavior,
};

export default AdvancedSecurity;

