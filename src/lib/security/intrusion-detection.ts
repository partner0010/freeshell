/**
 * 침입 탐지 시스템 (IDS)
 * 비정상적인 요청 패턴 탐지 및 차단
 */

import { NextRequest } from 'next/server';

export interface IntrusionAlert {
  type: 'brute_force' | 'suspicious_activity' | 'rate_limit_exceeded' | 'malicious_pattern';
  severity: 'critical' | 'high' | 'medium' | 'low';
  ip: string;
  userAgent: string;
  path: string;
  timestamp: Date;
  details: string;
  blocked: boolean;
}

/**
 * 요청 추적 정보
 */
interface RequestTracker {
  ip: string;
  requests: Array<{
    timestamp: Date;
    path: string;
    method: string;
    statusCode: number;
  }>;
  lastRequest: Date;
  blocked: boolean;
  blockUntil?: Date;
}

/**
 * 메모리 기반 추적 (프로덕션에서는 Redis 등 사용 권장)
 */
const requestTrackers = new Map<string, RequestTracker>();

/**
 * 정리 작업 (오래된 추적 정보 제거)
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, tracker] of requestTrackers.entries()) {
    // 1시간 이상 된 요청 기록 제거
    tracker.requests = tracker.requests.filter(
      req => now - req.timestamp.getTime() < 3600000
    );

    // 요청 기록이 없으면 제거
    if (tracker.requests.length === 0) {
      requestTrackers.delete(ip);
    }

    // 차단 해제 시간이 지났으면 해제
    if (tracker.blocked && tracker.blockUntil && now > tracker.blockUntil.getTime()) {
      tracker.blocked = false;
      tracker.blockUntil = undefined;
    }
  }
}, 60000); // 1분마다 정리

/**
 * IP 주소 추출
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * 요청 추적 및 분석
 */
export function trackRequest(request: NextRequest): {
  allowed: boolean;
  alerts: IntrusionAlert[];
} {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const path = request.nextUrl.pathname;
  const method = request.method;

  // 추적 정보 가져오기 또는 생성
  let tracker = requestTrackers.get(ip);
  if (!tracker) {
    tracker = {
      ip,
      requests: [],
      lastRequest: new Date(),
      blocked: false,
    };
    requestTrackers.set(ip, tracker);
  }

  // 차단된 IP인지 확인
  if (tracker.blocked) {
    if (tracker.blockUntil && new Date() < tracker.blockUntil) {
      return {
        allowed: false,
        alerts: [{
          type: 'rate_limit_exceeded',
          severity: 'high',
          ip,
          userAgent,
          path,
          timestamp: new Date(),
          details: '이 IP는 일시적으로 차단되었습니다.',
          blocked: true,
        }],
      };
    } else {
      // 차단 시간이 지났으면 해제
      tracker.blocked = false;
      tracker.blockUntil = undefined;
    }
  }

  // 요청 기록
  tracker.requests.push({
    timestamp: new Date(),
    path,
    method,
    statusCode: 200, // 실제로는 응답 후 업데이트
  });
  tracker.lastRequest = new Date();

  // 최근 1분간의 요청 수
  const oneMinuteAgo = new Date(Date.now() - 60000);
  const recentRequests = tracker.requests.filter(
    req => req.timestamp > oneMinuteAgo
  );

  const alerts: IntrusionAlert[] = [];

  // Rate Limiting: 1분에 100회 이상 요청
  if (recentRequests.length > 100) {
    tracker.blocked = true;
    tracker.blockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15분 차단

    alerts.push({
      type: 'rate_limit_exceeded',
      severity: 'high',
      ip,
      userAgent,
      path,
      timestamp: new Date(),
      details: `1분간 ${recentRequests.length}회 요청 - Rate limit 초과`,
      blocked: true,
    });
  }

  // Brute Force 탐지: 같은 경로에 반복 실패
  const failedRequests = recentRequests.filter(req => req.statusCode >= 400);
  if (failedRequests.length > 20) {
    alerts.push({
      type: 'brute_force',
      severity: 'critical',
      ip,
      userAgent,
      path,
      timestamp: new Date(),
      details: `반복적인 실패 요청 감지: ${failedRequests.length}회`,
      blocked: false, // 경고만
    });
  }

  // 의심스러운 패턴 탐지
  const suspiciousPaths = ['/admin', '/api/admin', '/api/auth'];
  if (suspiciousPaths.some(sp => path.includes(sp)) && failedRequests.length > 5) {
    alerts.push({
      type: 'suspicious_activity',
      severity: 'high',
      ip,
      userAgent,
      path,
      timestamp: new Date(),
      details: '보호된 경로에 대한 의심스러운 접근 시도',
      blocked: false,
    });
  }

  // 악성 User-Agent 탐지
  const maliciousAgents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zap'];
  if (maliciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    tracker.blocked = true;
    tracker.blockUntil = new Date(Date.now() + 60 * 60 * 1000); // 1시간 차단

    alerts.push({
      type: 'malicious_pattern',
      severity: 'critical',
      ip,
      userAgent,
      path,
      timestamp: new Date(),
      details: `악성 도구 사용 감지: ${userAgent}`,
      blocked: true,
    });
  }

  return {
    allowed: !tracker.blocked,
    alerts,
  };
}

/**
 * 차단된 IP 목록 조회
 */
export function getBlockedIPs(): string[] {
  const blocked: string[] = [];
  for (const [ip, tracker] of requestTrackers.entries()) {
    if (tracker.blocked) {
      blocked.push(ip);
    }
  }
  return blocked;
}

/**
 * IP 차단 해제
 */
export function unblockIP(ip: string): boolean {
  const tracker = requestTrackers.get(ip);
  if (tracker) {
    tracker.blocked = false;
    tracker.blockUntil = undefined;
    return true;
  }
  return false;
}
