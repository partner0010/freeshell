/**
 * GRIP Network Security Module
 * 네트워크 보안 시스템
 */

import { logSecurityEvent } from './index';

// ============================================
// 1. IP 기반 보안
// ============================================

/**
 * IP 화이트리스트
 */
const ipWhitelist: Set<string> = new Set();

/**
 * IP 블랙리스트
 */
const ipBlacklist: Set<string> = new Set();

/**
 * IP 화이트리스트 추가
 */
export function addToWhitelist(ip: string): void {
  ipWhitelist.add(ip);
}

/**
 * IP 블랙리스트 추가
 */
export function addToBlacklist(ip: string): void {
  ipBlacklist.add(ip);
  logSecurityEvent({
    type: 'suspicious_activity',
    ip,
    details: { action: 'ip_blocked' },
  });
}

/**
 * IP 접근 허용 여부 확인
 */
export function isIpAllowed(ip: string): boolean {
  // 블랙리스트 먼저 확인
  if (ipBlacklist.has(ip)) return false;
  
  // 화이트리스트가 비어있으면 모두 허용
  if (ipWhitelist.size === 0) return true;
  
  // 화이트리스트 확인
  return ipWhitelist.has(ip);
}

/**
 * IP 주소 검증
 */
export function isValidIp(ip: string): boolean {
  // IPv4 검증
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.').map(Number);
    return parts.every((p) => p >= 0 && p <= 255);
  }
  
  // IPv6 검증
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv6Regex.test(ip);
}

/**
 * 사설 IP 확인
 */
export function isPrivateIp(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  
  // 10.0.0.0/8
  if (parts[0] === 10) return true;
  
  // 172.16.0.0/12
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  
  // 192.168.0.0/16
  if (parts[0] === 192 && parts[1] === 168) return true;
  
  // 127.0.0.0/8 (localhost)
  if (parts[0] === 127) return true;
  
  return false;
}

// ============================================
// 2. DDoS 방어
// ============================================

interface DdosEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
}

const ddosTracker = new Map<string, DdosEntry>();

const DDOS_THRESHOLD = 1000; // 임계값 (요청 수)
const DDOS_WINDOW = 60 * 1000; // 시간 창 (1분)

/**
 * DDoS 공격 감지
 */
export function detectDdos(ip: string): boolean {
  const now = Date.now();
  const entry = ddosTracker.get(ip);
  
  if (!entry || now - entry.firstRequest > DDOS_WINDOW) {
    ddosTracker.set(ip, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
    });
    return false;
  }
  
  entry.count++;
  entry.lastRequest = now;
  
  if (entry.count > DDOS_THRESHOLD) {
    logSecurityEvent({
      type: 'suspicious_activity',
      ip,
      details: { 
        type: 'ddos_detected',
        requestCount: entry.count,
        timeWindow: now - entry.firstRequest,
      },
    });
    addToBlacklist(ip);
    return true;
  }
  
  return false;
}

// ============================================
// 3. 봇 탐지
// ============================================

const knownBotPatterns = [
  /bot/i,
  /spider/i,
  /crawler/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
  /postman/i,
];

const allowedBots = [
  /googlebot/i,
  /bingbot/i,
  /yandexbot/i,
  /duckduckbot/i,
  /slurp/i, // Yahoo
];

/**
 * 봇 여부 확인
 */
export function isBot(userAgent: string): boolean {
  return knownBotPatterns.some((pattern) => pattern.test(userAgent));
}

/**
 * 허용된 봇인지 확인
 */
export function isAllowedBot(userAgent: string): boolean {
  return allowedBots.some((pattern) => pattern.test(userAgent));
}

/**
 * 악성 봇 여부 확인
 */
export function isMaliciousBot(userAgent: string): boolean {
  if (!isBot(userAgent)) return false;
  return !isAllowedBot(userAgent);
}

// ============================================
// 4. 요청 검증
// ============================================

/**
 * HTTP 메서드 검증
 */
export function isValidHttpMethod(
  method: string,
  allowedMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
): boolean {
  return allowedMethods.includes(method.toUpperCase());
}

/**
 * 요청 크기 검증
 */
export function isRequestSizeValid(size: number, maxSize: number = 10 * 1024 * 1024): boolean {
  return size <= maxSize;
}

/**
 * Content-Type 검증
 */
export function isValidContentType(
  contentType: string | null,
  allowedTypes: string[] = ['application/json', 'multipart/form-data', 'application/x-www-form-urlencoded']
): boolean {
  if (!contentType) return false;
  return allowedTypes.some((type) => contentType.includes(type));
}

// ============================================
// 5. 보안 헤더 검증
// ============================================

/**
 * Origin 검증
 */
export function isValidOrigin(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) return false;
  return allowedOrigins.includes(origin) || allowedOrigins.includes('*');
}

/**
 * Referer 검증
 */
export function isValidReferer(referer: string | null, allowedDomains: string[]): boolean {
  if (!referer) return true; // Referer가 없을 수 있음
  
  try {
    const url = new URL(referer);
    return allowedDomains.includes(url.hostname);
  } catch {
    return false;
  }
}

// ============================================
// 6. SSL/TLS 검증
// ============================================

/**
 * HTTPS 연결 확인
 */
export function isSecureConnection(protocol: string): boolean {
  return protocol === 'https:';
}

/**
 * 안전하지 않은 요청 리다이렉트 URL 생성
 */
export function getSecureRedirectUrl(url: string): string {
  return url.replace(/^http:/, 'https:');
}

// ============================================
// 7. 방화벽 규칙
// ============================================

interface FirewallRule {
  id: string;
  name: string;
  type: 'allow' | 'deny';
  conditions: {
    ip?: string | RegExp;
    path?: string | RegExp;
    method?: string[];
    userAgent?: string | RegExp;
    country?: string[];
  };
  priority: number;
}

const firewallRules: FirewallRule[] = [];

/**
 * 방화벽 규칙 추가
 */
export function addFirewallRule(rule: FirewallRule): void {
  firewallRules.push(rule);
  // 우선순위로 정렬
  firewallRules.sort((a, b) => b.priority - a.priority);
}

/**
 * 방화벽 규칙 평가
 */
export function evaluateFirewallRules(request: {
  ip: string;
  path: string;
  method: string;
  userAgent: string;
}): { allowed: boolean; matchedRule?: FirewallRule } {
  for (const rule of firewallRules) {
    let matched = true;
    
    // IP 조건 확인
    if (rule.conditions.ip) {
      if (typeof rule.conditions.ip === 'string') {
        matched = matched && request.ip === rule.conditions.ip;
      } else {
        matched = matched && rule.conditions.ip.test(request.ip);
      }
    }
    
    // 경로 조건 확인
    if (rule.conditions.path) {
      if (typeof rule.conditions.path === 'string') {
        matched = matched && request.path === rule.conditions.path;
      } else {
        matched = matched && rule.conditions.path.test(request.path);
      }
    }
    
    // 메서드 조건 확인
    if (rule.conditions.method) {
      matched = matched && rule.conditions.method.includes(request.method);
    }
    
    // User-Agent 조건 확인
    if (rule.conditions.userAgent) {
      if (typeof rule.conditions.userAgent === 'string') {
        matched = matched && request.userAgent.includes(rule.conditions.userAgent);
      } else {
        matched = matched && rule.conditions.userAgent.test(request.userAgent);
      }
    }
    
    if (matched) {
      return {
        allowed: rule.type === 'allow',
        matchedRule: rule,
      };
    }
  }
  
  // 기본: 허용
  return { allowed: true };
}

// ============================================
// 8. 지역 기반 접근 제어
// ============================================

const blockedCountries: Set<string> = new Set();

/**
 * 국가 차단
 */
export function blockCountry(countryCode: string): void {
  blockedCountries.add(countryCode.toUpperCase());
}

/**
 * 국가 차단 해제
 */
export function unblockCountry(countryCode: string): void {
  blockedCountries.delete(countryCode.toUpperCase());
}

/**
 * 국가 차단 여부 확인
 */
export function isCountryBlocked(countryCode: string): boolean {
  return blockedCountries.has(countryCode.toUpperCase());
}

// ============================================
// Export
// ============================================

export const NetworkSecurity = {
  // IP
  addToWhitelist,
  addToBlacklist,
  isIpAllowed,
  isValidIp,
  isPrivateIp,
  
  // DDoS
  detectDdos,
  
  // Bot
  isBot,
  isAllowedBot,
  isMaliciousBot,
  
  // Request Validation
  isValidHttpMethod,
  isRequestSizeValid,
  isValidContentType,
  
  // Headers
  isValidOrigin,
  isValidReferer,
  
  // SSL/TLS
  isSecureConnection,
  getSecureRedirectUrl,
  
  // Firewall
  addFirewallRule,
  evaluateFirewallRules,
  
  // Geo
  blockCountry,
  unblockCountry,
  isCountryBlocked,
};

export default NetworkSecurity;

