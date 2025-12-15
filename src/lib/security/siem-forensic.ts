/**
 * SIEM 및 포렌식 분석 시스템
 * Security Information and Event Management
 */

export interface SecurityEvent {
  id: string;
  timestamp: number;
  type: 'auth' | 'access' | 'error' | 'network' | 'file' | 'system';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  target: string;
  user?: string;
  action: string;
  result: 'success' | 'failure' | 'blocked';
  metadata: Record<string, any>;
}

export interface CorrelationRule {
  id: string;
  name: string;
  description: string;
  pattern: string;
  threshold: number;
  timeWindow: number; // milliseconds
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface ForensicAnalysis {
  id: string;
  eventId: string;
  analysis: string;
  findings: string[];
  timeline: TimelineEvent[];
  conclusion: string;
  recommendations: string[];
}

export interface TimelineEvent {
  timestamp: number;
  event: string;
  source: string;
  details: string;
}

// SIEM 시스템
export class SIEMSystem {
  private events: Map<string, SecurityEvent> = new Map();
  private correlationRules: Map<string, CorrelationRule> = new Map();

  // 기본 상관 규칙 생성
  createDefaultRules(): void {
    // 다중 실패 로그인 시도
    this.addRule({
      id: 'rule-1',
      name: '다중 실패 로그인',
      description: '5분 내 5회 이상 실패한 로그인 시도',
      pattern: 'auth.failure',
      threshold: 5,
      timeWindow: 5 * 60 * 1000,
      severity: 'high',
    });

    // 의심스러운 파일 접근
    this.addRule({
      id: 'rule-2',
      name: '의심스러운 파일 접근',
      description: '다수의 시스템 파일 접근 시도',
      pattern: 'file.access.system',
      threshold: 10,
      timeWindow: 10 * 60 * 1000,
      severity: 'medium',
    });
  }

  addRule(rule: CorrelationRule): void {
    this.correlationRules.set(rule.id, rule);
  }

  // 이벤트 수집
  collectEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): SecurityEvent {
    const fullEvent: SecurityEvent = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    this.events.set(fullEvent.id, fullEvent);

    // 상관 분석
    this.correlateEvents(fullEvent);

    return fullEvent;
  }

  // 이벤트 상관 분석
  private correlateEvents(newEvent: SecurityEvent): void {
    for (const rule of this.correlationRules.values()) {
      if (this.matchesPattern(newEvent, rule.pattern)) {
        const recentEvents = this.getRecentEvents(
          rule.pattern,
          rule.timeWindow
        );

        if (recentEvents.length >= rule.threshold) {
          // 알림 생성
          this.createAlert(rule, recentEvents);
        }
      }
    }
  }

  private matchesPattern(event: SecurityEvent, pattern: string): boolean {
    // 패턴 매칭 로직
    const [type, ...parts] = pattern.split('.');
    if (event.type !== type) return false;

    if (parts.includes('failure') && event.result !== 'failure') return false;
    if (parts.includes('system') && !event.target.includes('system')) return false;

    return true;
  }

  private getRecentEvents(pattern: string, timeWindow: number): SecurityEvent[] {
    const now = Date.now();
    return Array.from(this.events.values()).filter((e) => {
      const inTimeWindow = now - e.timestamp <= timeWindow;
      return inTimeWindow && this.matchesPattern(e, pattern);
    });
  }

  private createAlert(rule: CorrelationRule, events: SecurityEvent[]): void {
    // 알림 생성 로직
    console.log(`Alert: ${rule.name}`, {
      rule: rule.name,
      events: events.length,
      severity: rule.severity,
    });
  }

  // 포렌식 분석
  analyzeForensics(eventIds: string[]): ForensicAnalysis {
    const events = eventIds
      .map((id) => this.events.get(id))
      .filter((e) => e !== undefined) as SecurityEvent[];

    events.sort((a, b) => a.timestamp - b.timestamp);

    // 타임라인 생성
    const timeline: TimelineEvent[] = events.map((e) => ({
      timestamp: e.timestamp,
      event: e.action,
      source: e.source,
      details: JSON.stringify(e.metadata),
    }));

    // 패턴 분석
    const findings: string[] = [];
    if (events.filter((e) => e.result === 'failure').length > 5) {
      findings.push('다수의 실패한 시도가 감지되었습니다');
    }
    if (events.some((e) => e.severity === 'critical')) {
      findings.push('중요한 보안 이벤트가 포함되어 있습니다');
    }

    return {
      id: `analysis-${Date.now()}`,
      eventId: eventIds[0],
      analysis: `${events.length}개의 이벤트를 분석했습니다`,
      findings,
      timeline,
      conclusion: '의심스러운 활동이 감지되었습니다',
      recommendations: [
        '해당 IP 주소 차단 고려',
        '사용자 계정 상태 확인',
        '시스템 로그 추가 검토',
      ],
    };
  }

  // 이벤트 검색
  searchEvents(query: {
    type?: SecurityEvent['type'];
    severity?: SecurityEvent['severity'];
    user?: string;
    startTime?: number;
    endTime?: number;
  }): SecurityEvent[] {
    let events = Array.from(this.events.values());

    if (query.type) {
      events = events.filter((e) => e.type === query.type);
    }
    if (query.severity) {
      events = events.filter((e) => e.severity === query.severity);
    }
    if (query.user) {
      events = events.filter((e) => e.user === query.user);
    }
    if (query.startTime) {
      events = events.filter((e) => e.timestamp >= query.startTime!);
    }
    if (query.endTime) {
      events = events.filter((e) => e.timestamp <= query.endTime!);
    }

    return events.sort((a, b) => b.timestamp - a.timestamp);
  }

  getEvents(limit?: number): SecurityEvent[] {
    const events = Array.from(this.events.values());
    events.sort((a, b) => b.timestamp - a.timestamp);
    return limit ? events.slice(0, limit) : events;
  }
}

export const siemSystem = new SIEMSystem();
siemSystem.createDefaultRules();

