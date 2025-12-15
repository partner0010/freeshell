/**
 * 침입 탐지 시스템 (IDS)
 * 이상 행위 및 공격 패턴 실시간 감지
 */

export interface IntrusionAlert {
  id: string;
  type: 'brute-force' | 'sql-injection' | 'xss' | 'dos' | 'unauthorized-access' | 'anomaly';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  target: string;
  timestamp: number;
  description: string;
  evidence: string[];
  blocked: boolean;
}

export interface BehaviorPattern {
  ip: string;
  requestCount: number;
  errorCount: number;
  uniqueEndpoints: number;
  suspiciousKeywords: string[];
  lastSeen: number;
  riskScore: number;
}

// 침입 탐지 시스템
export class IntrusionDetectionSystem {
  private alerts: Map<string, IntrusionAlert> = new Map();
  private behaviorPatterns: Map<string, BehaviorPattern> = new Map();
  private listeners: Set<(alert: IntrusionAlert) => void> = new Set();

  // 요청 분석
  analyzeRequest(request: {
    ip: string;
    method: string;
    path: string;
    headers: Record<string, string>;
    body?: any;
    response?: {
      status: number;
      body?: any;
    };
  }): void {
    // 행동 패턴 업데이트
    const pattern = this.updateBehaviorPattern(request);

    // 이상 탐지
    this.detectAnomalies(request, pattern);

    // 공격 패턴 감지
    this.detectAttackPatterns(request, pattern);
  }

  private updateBehaviorPattern(request: {
    ip: string;
    path: string;
    response?: { status: number };
  }): BehaviorPattern {
    const existing = this.behaviorPatterns.get(request.ip) || {
      ip: request.ip,
      requestCount: 0,
      errorCount: 0,
      uniqueEndpoints: 0,
      suspiciousKeywords: [],
      lastSeen: Date.now(),
      riskScore: 0,
    };

    existing.requestCount++;
    if (request.response && request.response.status >= 400) {
      existing.errorCount++;
    }

    // 위험 점수 계산
    existing.riskScore = this.calculateRiskScore(existing);
    existing.lastSeen = Date.now();

    this.behaviorPatterns.set(request.ip, existing);
    return existing;
  }

  private calculateRiskScore(pattern: BehaviorPattern): number {
    let score = 0;

    // 요청 빈도
    if (pattern.requestCount > 100) score += 30;
    if (pattern.requestCount > 500) score += 50;

    // 에러 비율
    const errorRate = pattern.errorCount / pattern.requestCount;
    if (errorRate > 0.5) score += 20;

    // 의심스러운 키워드
    score += pattern.suspiciousKeywords.length * 10;

    return Math.min(100, score);
  }

  private detectAnomalies(
    request: { ip: string; path: string },
    pattern: BehaviorPattern
  ): void {
    // 비정상적으로 높은 요청 빈도
    if (pattern.requestCount > 1000) {
      this.createAlert({
        type: 'dos',
        severity: 'high',
        source: request.ip,
        target: request.path,
        description: '비정상적으로 높은 요청 빈도 감지',
        evidence: [`요청 수: ${pattern.requestCount}`],
        blocked: false,
      });
    }

    // 높은 에러율
    const errorRate = pattern.errorCount / pattern.requestCount;
    if (errorRate > 0.7 && pattern.requestCount > 50) {
      this.createAlert({
        type: 'brute-force',
        severity: 'medium',
        source: request.ip,
        target: request.path,
        description: '높은 에러율로 인한 무차별 대입 공격 의심',
        evidence: [`에러율: ${(errorRate * 100).toFixed(1)}%`],
        blocked: false,
      });
    }
  }

  private detectAttackPatterns(
    request: {
      path: string;
      headers: Record<string, string>;
      body?: any;
    },
    pattern: BehaviorPattern
  ): void {
    const content = `${request.path} ${JSON.stringify(request.headers)} ${JSON.stringify(request.body)}`;

    // SQL Injection 패턴
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION)\b)/i,
      /(['";]\s*(OR|AND)\s*['"]?\d+['"]?\s*=\s*['"]?\d+)/i,
      /(;?\s*(DROP|DELETE|UPDATE|INSERT)\s+)/i,
    ];

    if (sqlPatterns.some((p) => p.test(content))) {
      this.createAlert({
        type: 'sql-injection',
        severity: 'critical',
        source: 'unknown',
        target: request.path,
        description: 'SQL Injection 공격 시도 감지',
        evidence: ['SQL 키워드 발견'],
        blocked: true,
      });
    }

    // XSS 패턴
    const xssPatterns = [
      /<script[\s>]/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe[\s>]/i,
    ];

    if (xssPatterns.some((p) => p.test(content))) {
      this.createAlert({
        type: 'xss',
        severity: 'high',
        source: 'unknown',
        target: request.path,
        description: 'XSS 공격 시도 감지',
        evidence: ['XSS 패턴 발견'],
        blocked: true,
      });
    }
  }

  private createAlert(alert: Omit<IntrusionAlert, 'id' | 'timestamp'>): void {
    const fullAlert: IntrusionAlert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    this.alerts.set(fullAlert.id, fullAlert);
    this.notifyListeners(fullAlert);
  }

  subscribe(listener: (alert: IntrusionAlert) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(alert: IntrusionAlert): void {
    this.listeners.forEach((listener) => listener(alert));
  }

  getAlerts(limit?: number): IntrusionAlert[] {
    const alerts = Array.from(this.alerts.values());
    alerts.sort((a, b) => b.timestamp - a.timestamp);
    return limit ? alerts.slice(0, limit) : alerts;
  }

  getBehaviorPatterns(): BehaviorPattern[] {
    return Array.from(this.behaviorPatterns.values());
  }
}

export const idsSystem = new IntrusionDetectionSystem();

