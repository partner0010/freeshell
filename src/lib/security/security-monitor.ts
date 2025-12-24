/**
 * 보안 모니터링 시스템
 * 실시간 보안 이벤트 추적 및 알림
 */

import { IntrusionAlert } from './intrusion-detection';
import { VulnerabilityReport } from './vulnerability-scanner';

export interface SecurityEvent {
  id: string;
  type: 'intrusion' | 'vulnerability' | 'data_breach' | 'unauthorized_access';
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
  source: string;
  details: any;
  resolved: boolean;
}

/**
 * 보안 이벤트 저장소 (프로덕션에서는 데이터베이스 사용)
 */
const securityEvents: SecurityEvent[] = [];
const MAX_EVENTS = 10000; // 최대 10,000개 이벤트 보관

/**
 * 보안 이벤트 기록
 */
export function logSecurityEvent(
  type: SecurityEvent['type'],
  severity: SecurityEvent['severity'],
  source: string,
  details: any
): SecurityEvent {
  const event: SecurityEvent = {
    id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    severity,
    timestamp: new Date(),
    source,
    details,
    resolved: false,
  };

  securityEvents.push(event);

  // 최대 개수 초과 시 오래된 이벤트 제거
  if (securityEvents.length > MAX_EVENTS) {
    securityEvents.shift();
  }

  // Critical 이벤트는 즉시 알림 (실제로는 이메일, Slack 등으로 전송)
  if (severity === 'critical') {
    console.error('🚨 CRITICAL SECURITY EVENT:', event);
    // TODO: 알림 시스템 연동
  }

  return event;
}

/**
 * 침입 알림 기록
 */
export function logIntrusionAlert(alert: IntrusionAlert): void {
  logSecurityEvent(
    'intrusion',
    alert.severity,
    alert.ip,
    {
      type: alert.type,
      path: alert.path,
      userAgent: alert.userAgent,
      details: alert.details,
      blocked: alert.blocked,
    }
  );
}

/**
 * 취약점 보고 기록
 */
export function logVulnerabilityReport(report: VulnerabilityReport): void {
  logSecurityEvent(
    'vulnerability',
    report.severity,
    'scanner',
    {
      type: report.type,
      details: report.details,
      blocked: report.blocked,
    }
  );
}

/**
 * 보안 이벤트 조회
 */
export function getSecurityEvents(filters?: {
  type?: SecurityEvent['type'];
  severity?: SecurityEvent['severity'];
  resolved?: boolean;
  limit?: number;
}): SecurityEvent[] {
  let events = [...securityEvents];

  if (filters?.type) {
    events = events.filter(e => e.type === filters.type);
  }

  if (filters?.severity) {
    events = events.filter(e => e.severity === filters.severity);
  }

  if (filters?.resolved !== undefined) {
    events = events.filter(e => e.resolved === filters.resolved);
  }

  // 최신순 정렬
  events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  if (filters?.limit) {
    events = events.slice(0, filters.limit);
  }

  return events;
}

/**
 * 보안 통계
 */
export function getSecurityStats(): {
  totalEvents: number;
  criticalEvents: number;
  highEvents: number;
  unresolvedEvents: number;
  recentIntrusions: number;
  recentVulnerabilities: number;
} {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  const recentEvents = securityEvents.filter(
    e => e.timestamp.getTime() > oneDayAgo
  );

  return {
    totalEvents: securityEvents.length,
    criticalEvents: securityEvents.filter(e => e.severity === 'critical').length,
    highEvents: securityEvents.filter(e => e.severity === 'high').length,
    unresolvedEvents: securityEvents.filter(e => !e.resolved).length,
    recentIntrusions: recentEvents.filter(e => e.type === 'intrusion').length,
    recentVulnerabilities: recentEvents.filter(e => e.type === 'vulnerability').length,
  };
}

/**
 * 이벤트 해결 처리
 */
export function resolveSecurityEvent(eventId: string): boolean {
  const event = securityEvents.find(e => e.id === eventId);
  if (event) {
    event.resolved = true;
    return true;
  }
  return false;
}

