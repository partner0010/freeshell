/**
 * 데이터 유출 방지 시스템 (DLP)
 * Data Loss Prevention
 */

export interface SensitiveDataPattern {
  id: string;
  name: string;
  type: 'credit-card' | 'ssn' | 'email' | 'phone' | 'api-key' | 'password' | 'custom';
  pattern: RegExp;
  description: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

export interface DataLeakEvent {
  id: string;
  timestamp: number;
  type: 'detected' | 'blocked' | 'warned';
  dataType: string;
  location: string;
  context: string;
  action: 'allowed' | 'blocked' | 'redacted';
  user?: string;
}

export interface DLPPolicy {
  id: string;
  name: string;
  enabled: boolean;
  patterns: string[];
  action: 'block' | 'warn' | 'log' | 'redact';
  scope: 'all' | 'specific';
  targets?: string[];
}

// DLP 시스템
export class DLPSystem {
  private patterns: Map<string, SensitiveDataPattern> = new Map();
  private policies: Map<string, DLPPolicy> = new Map();
  private events: Map<string, DataLeakEvent> = new Map();

  constructor() {
    this.createDefaultPatterns();
    this.createDefaultPolicies();
  }

  private createDefaultPatterns(): void {
    // 신용카드 번호
    this.addPattern({
      id: 'cc-pattern',
      name: '신용카드 번호',
      type: 'credit-card',
      pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
      description: '신용카드 번호 패턴 (16자리 숫자)',
      riskLevel: 'critical',
    });

    // 이메일 주소
    this.addPattern({
      id: 'email-pattern',
      name: '이메일 주소',
      type: 'email',
      pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      description: '이메일 주소 패턴',
      riskLevel: 'low',
    });

    // 전화번호
    this.addPattern({
      id: 'phone-pattern',
      name: '전화번호',
      type: 'phone',
      pattern: /\b\d{2,3}[-.\s]?\d{3,4}[-.\s]?\d{4}\b/g,
      description: '전화번호 패턴',
      riskLevel: 'medium',
    });

    // API 키
    this.addPattern({
      id: 'api-key-pattern',
      name: 'API 키',
      type: 'api-key',
      pattern: /\b(api[_-]?key|apikey|access[_-]?token)[\s:=]+['"]?([A-Za-z0-9_\-]{20,})['"]?/gi,
      description: 'API 키 패턴',
      riskLevel: 'critical',
    });

    // 비밀번호
    this.addPattern({
      id: 'password-pattern',
      name: '비밀번호',
      type: 'password',
      pattern: /\b(password|pwd|passwd)[\s:=]+['"]?([^\s'"]{8,})['"]?/gi,
      description: '비밀번호 패턴',
      riskLevel: 'critical',
    });
  }

  private createDefaultPolicies(): void {
    this.addPolicy({
      id: 'default-policy',
      name: '기본 DLP 정책',
      enabled: true,
      patterns: ['cc-pattern', 'api-key-pattern', 'password-pattern'],
      action: 'block',
      scope: 'all',
    });
  }

  addPattern(pattern: SensitiveDataPattern): void {
    this.patterns.set(pattern.id, pattern);
  }

  addPolicy(policy: DLPPolicy): void {
    this.policies.set(policy.id, policy);
  }

  // 데이터 검사
  scanData(content: string, context?: { location?: string; user?: string }): {
    detected: boolean;
    events: DataLeakEvent[];
    sanitized?: string;
  } {
    const events: DataLeakEvent[] = [];
    let sanitized = content;

    // 활성화된 정책 확인
    for (const policy of this.policies.values()) {
      if (!policy.enabled) continue;

      for (const patternId of policy.patterns) {
        const pattern = this.patterns.get(patternId);
        if (!pattern) continue;

        const matches = content.match(pattern.pattern);
        if (matches && matches.length > 0) {
          const event: DataLeakEvent = {
            id: `dlp-event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            type: policy.action === 'block' ? 'blocked' : policy.action === 'warn' ? 'detected' : 'detected',
            dataType: pattern.name,
            location: context?.location || 'unknown',
            context: content.substring(0, 100),
            action: policy.action === 'block' ? 'blocked' : policy.action === 'redact' ? 'redacted' : 'allowed',
            user: context?.user,
          };

          events.push(event);
          this.events.set(event.id, event);

          // 데이터 마스킹/삭제
          if (policy.action === 'redact') {
            matches.forEach((match) => {
              const masked = '*'.repeat(match.length);
              sanitized = sanitized.replace(match, masked);
            });
          }

          if (policy.action === 'block') {
            return {
              detected: true,
              events,
              sanitized: undefined,
            };
          }
        }
      }
    }

    return {
      detected: events.length > 0,
      events,
      sanitized: events.length > 0 ? sanitized : undefined,
    };
  }

  getEvents(limit?: number): DataLeakEvent[] {
    const events = Array.from(this.events.values());
    events.sort((a, b) => b.timestamp - a.timestamp);
    return limit ? events.slice(0, limit) : events;
  }

  getStats(): {
    total: number;
    blocked: number;
    warned: number;
    byType: Record<string, number>;
  } {
    const events = Array.from(this.events.values());
    return {
      total: events.length,
      blocked: events.filter((e) => e.action === 'blocked').length,
      warned: events.filter((e) => e.type === 'warned').length,
      byType: events.reduce((acc, e) => {
        acc[e.dataType] = (acc[e.dataType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

export const dlpSystem = new DLPSystem();

