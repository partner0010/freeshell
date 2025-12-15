/**
 * Zero Trust Security System
 * 모든 사용자와 요청을 검증하는 보안 모델
 */

export interface ZeroTrustPolicy {
  id: string;
  name: string;
  enabled: boolean;
  rules: SecurityRule[];
}

export interface SecurityRule {
  id: string;
  type: 'ip' | 'device' | 'user' | 'location' | 'behavior';
  condition: string;
  action: 'allow' | 'deny' | 'challenge';
  priority: number;
}

export interface VerificationRequest {
  userId?: string;
  ip: string;
  userAgent: string;
  deviceFingerprint?: string;
  location?: {
    country: string;
    city: string;
  };
  behavior?: {
    requestPattern: string;
    sessionDuration: number;
    resourceAccess: string[];
  };
}

export interface VerificationResult {
  allowed: boolean;
  challenge?: 'mfa' | 'captcha' | 'email' | 'sms';
  reason?: string;
  riskScore: number; // 0-100
}

// Zero Trust 검증 엔진
export class ZeroTrustEngine {
  private policies: Map<string, ZeroTrustPolicy> = new Map();

  // 기본 정책 생성
  createDefaultPolicies(): void {
    // 1. IP 화이트리스트 정책
    this.addPolicy({
      id: 'ip-whitelist',
      name: '신뢰할 수 있는 IP',
      enabled: true,
      rules: [
        {
          id: 'trusted-ip',
          type: 'ip',
          condition: '127.0.0.1,::1,localhost',
          action: 'allow',
          priority: 1,
        },
      ],
    });

    // 2. 의심스러운 행동 패턴 감지
    this.addPolicy({
      id: 'suspicious-behavior',
      name: '의심스러운 행동 감지',
      enabled: true,
      rules: [
        {
          id: 'rapid-requests',
          type: 'behavior',
          condition: 'requests_per_minute > 100',
          action: 'challenge',
          priority: 2,
        },
        {
          id: 'unusual-location',
          type: 'location',
          condition: 'country_change_within_1h',
          action: 'challenge',
          priority: 3,
        },
      ],
    });

    // 3. 장치 지문 검증
    this.addPolicy({
      id: 'device-fingerprint',
      name: '장치 검증',
      enabled: true,
      rules: [
        {
          id: 'new-device',
          type: 'device',
          condition: 'device_not_registered',
          action: 'challenge',
          priority: 4,
        },
      ],
    });
  }

  addPolicy(policy: ZeroTrustPolicy): void {
    this.policies.set(policy.id, policy);
  }

  // 요청 검증
  async verifyRequest(request: VerificationRequest): Promise<VerificationResult> {
    let riskScore = 0;
    let challenge: VerificationResult['challenge'] | undefined;
    let reason: string | undefined;

    // 정책별 검증
    for (const policy of this.policies.values()) {
      if (!policy.enabled) continue;

      for (const rule of policy.rules.sort((a, b) => a.priority - b.priority)) {
        const match = this.evaluateRule(rule, request);
        
        if (match) {
          switch (rule.action) {
            case 'deny':
              return {
                allowed: false,
                reason: `Policy: ${policy.name}, Rule: ${rule.id}`,
                riskScore: 100,
              };
            
            case 'challenge':
              if (!challenge) {
                challenge = this.determineChallenge(rule.type);
                reason = `Policy: ${policy.name}, Rule: ${rule.id}`;
              }
              riskScore += 30;
              break;
            
            case 'allow':
              riskScore -= 10;
              break;
          }
        }
      }
    }

    // 위험 점수 기반 최종 결정
    if (riskScore >= 70) {
      return {
        allowed: false,
        challenge,
        reason: reason || 'High risk score',
        riskScore,
      };
    }

    if (riskScore >= 40) {
      return {
        allowed: true,
        challenge: challenge || 'mfa',
        riskScore,
      };
    }

    return {
      allowed: true,
      riskScore,
    };
  }

  private evaluateRule(rule: SecurityRule, request: VerificationRequest): boolean {
    switch (rule.type) {
      case 'ip':
        return rule.condition.split(',').includes(request.ip);
      
      case 'device':
        // 장치 검증 로직
        return rule.condition === 'device_not_registered' && !request.deviceFingerprint;
      
      case 'location':
        // 위치 기반 검증
        return rule.condition.includes('country_change');
      
      case 'behavior':
        // 행동 패턴 검증
        return rule.condition.includes('requests_per_minute');
      
      default:
        return false;
    }
  }

  private determineChallenge(type: SecurityRule['type']): VerificationResult['challenge'] {
    switch (type) {
      case 'device':
        return 'email';
      case 'location':
        return 'sms';
      case 'behavior':
        return 'captcha';
      default:
        return 'mfa';
    }
  }
}

export const zeroTrustEngine = new ZeroTrustEngine();
zeroTrustEngine.createDefaultPolicies();

