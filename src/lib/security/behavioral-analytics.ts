/**
 * 행동 분석 기반 보안 시스템
 * Behavioral Analytics Security
 */

export interface UserBehavior {
  userId: string;
  patterns: BehaviorPattern[];
  riskScore: number;
  anomalies: Anomaly[];
  lastUpdated: number;
}

export interface BehaviorPattern {
  type: 'typing' | 'navigation' | 'click' | 'scroll' | 'time';
  value: number;
  frequency: number;
  deviation: number;
}

export interface Anomaly {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: number;
  confidence: number;
}

export interface SecurityAlert {
  id: string;
  userId: string;
  type: 'unusual-behavior' | 'suspicious-activity' | 'fraud';
  severity: 'medium' | 'high' | 'critical';
  description: string;
  evidence: string[];
  timestamp: number;
  action: 'monitor' | 'challenge' | 'block';
}

// 행동 분석 기반 보안 시스템
export class BehavioralAnalyticsSecurity {
  private behaviors: Map<string, UserBehavior> = new Map();
  private alerts: Map<string, SecurityAlert> = new Map();

  // 행동 패턴 업데이트
  updateBehavior(userId: string, pattern: Partial<BehaviorPattern>): void {
    const behavior = this.behaviors.get(userId) || {
      userId,
      patterns: [],
      riskScore: 0,
      anomalies: [],
      lastUpdated: Date.now(),
    };

    // 패턴 추가/업데이트
    const existingPattern = behavior.patterns.find((p) => p.type === pattern.type);
    if (existingPattern) {
      existingPattern.value = pattern.value || existingPattern.value;
      existingPattern.frequency++;
    } else {
      behavior.patterns.push({
        type: pattern.type!,
        value: pattern.value || 0,
        frequency: 1,
        deviation: 0,
      });
    }

    // 이상 탐지
    const anomalies = this.detectAnomalies(behavior);
    behavior.anomalies = anomalies;

    // 위험 점수 계산
    behavior.riskScore = this.calculateRiskScore(behavior);
    behavior.lastUpdated = Date.now();

    this.behaviors.set(userId, behavior);

    // 위험 점수가 높으면 알림 생성
    if (behavior.riskScore > 70) {
      this.createAlert(behavior);
    }
  }

  // 이상 탐지
  private detectAnomalies(behavior: UserBehavior): Anomaly[] {
    const anomalies: Anomaly[] = [];

    // 타이핑 패턴 이상
    const typingPattern = behavior.patterns.find((p) => p.type === 'typing');
    if (typingPattern && typingPattern.value < 20) {
      anomalies.push({
        type: 'slow-typing',
        severity: 'low',
        description: '평소보다 타이핑 속도가 느립니다',
        timestamp: Date.now(),
        confidence: 0.6,
      });
    }

    // 네비게이션 패턴 이상
    const navPattern = behavior.patterns.find((p) => p.type === 'navigation');
    if (navPattern && navPattern.frequency > 100) {
      anomalies.push({
        type: 'excessive-navigation',
        severity: 'medium',
        description: '비정상적으로 많은 네비게이션이 발생했습니다',
        timestamp: Date.now(),
        confidence: 0.8,
      });
    }

    // 시간 패턴 이상
    const hour = new Date().getHours();
    if (hour < 3 || hour > 23) {
      anomalies.push({
        type: 'unusual-time',
        severity: 'low',
        description: '비정상적인 시간대에 접근',
        timestamp: Date.now(),
        confidence: 0.5,
      });
    }

    return anomalies;
  }

  // 위험 점수 계산
  private calculateRiskScore(behavior: UserBehavior): number {
    let score = 0;

    // 이상 항목 기반 점수
    behavior.anomalies.forEach((anomaly) => {
      switch (anomaly.severity) {
        case 'critical':
          score += 30;
          break;
        case 'high':
          score += 20;
          break;
        case 'medium':
          score += 10;
          break;
        case 'low':
          score += 5;
          break;
      }
    });

    // 패턴 기반 점수
    behavior.patterns.forEach((pattern) => {
      if (pattern.deviation > 3) {
        score += 15;
      }
    });

    return Math.min(100, score);
  }

  // 보안 알림 생성
  private createAlert(behavior: UserBehavior): void {
    const alert: SecurityAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: behavior.userId,
      type: behavior.riskScore > 85 ? 'fraud' : behavior.riskScore > 70 ? 'suspicious-activity' : 'unusual-behavior',
      severity: behavior.riskScore > 85 ? 'critical' : behavior.riskScore > 75 ? 'high' : 'medium',
      description: `위험 점수: ${behavior.riskScore}`,
      evidence: behavior.anomalies.map((a) => a.description),
      timestamp: Date.now(),
      action: behavior.riskScore > 85 ? 'block' : behavior.riskScore > 75 ? 'challenge' : 'monitor',
    };

    this.alerts.set(alert.id, alert);
  }

  // MFA 요구 여부 결정
  shouldRequireMFA(userId: string): boolean {
    const behavior = this.behaviors.get(userId);
    if (!behavior) return false;

    return behavior.riskScore > 60 || behavior.anomalies.some((a) => a.severity === 'high' || a.severity === 'critical');
  }

  getBehavior(userId: string): UserBehavior | undefined {
    return this.behaviors.get(userId);
  }

  getAlerts(userId?: string): SecurityAlert[] {
    const alerts = Array.from(this.alerts.values());
    if (userId) {
      return alerts.filter((a) => a.userId === userId);
    }
    return alerts.sort((a, b) => b.timestamp - a.timestamp);
  }
}

export const behavioralAnalyticsSecurity = new BehavioralAnalyticsSecurity();

