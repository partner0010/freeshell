/**
 * Rate Limiting 및 API 할당량 관리
 * Rate Limiting & API Quota Management
 */

export interface RateLimitRule {
  id: string;
  name: string;
  endpoint?: string;
  method?: string;
  limit: number; // 요청 수
  window: number; // 시간 창 (초)
  enabled: boolean;
}

export interface QuotaPlan {
  id: string;
  name: string;
  description?: string;
  limits: {
    requestsPerDay?: number;
    requestsPerHour?: number;
    requestsPerMinute?: number;
    dataTransfer?: number; // MB
    storage?: number; // MB
  };
  price?: number;
}

export interface UsageStats {
  userId: string;
  endpoint: string;
  requests: number;
  dataTransfer: number;
  windowStart: Date;
  windowEnd: Date;
}

// Rate Limiter
export class RateLimiter {
  private rules: Map<string, RateLimitRule> = new Map();
  private quotas: Map<string, QuotaPlan> = new Map();
  private usage: Map<string, UsageStats> = new Map();

  // Rate Limit 규칙 생성
  createRule(
    name: string,
    limit: number,
    window: number,
    endpoint?: string,
    method?: string
  ): RateLimitRule {
    const rule: RateLimitRule = {
      id: `rule-${Date.now()}`,
      name,
      endpoint,
      method,
      limit,
      window,
      enabled: true,
    };
    this.rules.set(rule.id, rule);
    return rule;
  }

  // 할당량 플랜 생성
  createQuotaPlan(
    name: string,
    limits: QuotaPlan['limits'],
    description?: string,
    price?: number
  ): QuotaPlan {
    const plan: QuotaPlan = {
      id: `plan-${Date.now()}`,
      name,
      description,
      limits,
      price,
    };
    this.quotas.set(plan.id, plan);
    return plan;
  }

  // 요청 체크 (시뮬레이션)
  async checkRateLimit(
    userId: string,
    endpoint: string,
    ruleId: string
  ): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
    const rule = this.rules.get(ruleId);
    if (!rule || !rule.enabled) {
      return { allowed: true, remaining: Infinity, resetAt: new Date() };
    }

    const key = `${userId}:${endpoint}:${ruleId}`;
    const stats = this.usage.get(key);

    const now = new Date();
    const windowStart = new Date(now.getTime() - rule.window * 1000);

    if (!stats || stats.windowStart < windowStart) {
      // 새 시간 창
      this.usage.set(key, {
        userId,
        endpoint,
        requests: 1,
        dataTransfer: 0,
        windowStart: now,
        windowEnd: new Date(now.getTime() + rule.window * 1000),
      });
      return {
        allowed: true,
        remaining: rule.limit - 1,
        resetAt: new Date(now.getTime() + rule.window * 1000),
      };
    }

    if (stats.requests >= rule.limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: stats.windowEnd,
      };
    }

    stats.requests++;
    this.usage.set(key, stats);

    return {
      allowed: true,
      remaining: rule.limit - stats.requests,
      resetAt: stats.windowEnd,
    };
  }

  // 규칙 가져오기
  getRule(id: string): RateLimitRule | undefined {
    return this.rules.get(id);
  }

  // 모든 규칙 가져오기
  getAllRules(): RateLimitRule[] {
    return Array.from(this.rules.values());
  }

  // 플랜 가져오기
  getPlan(id: string): QuotaPlan | undefined {
    return this.quotas.get(id);
  }

  // 모든 플랜 가져오기
  getAllPlans(): QuotaPlan[] {
    return Array.from(this.quotas.values());
  }

  // 사용 통계 가져오기
  getUsage(userId: string, endpoint?: string): UsageStats[] {
    return Array.from(this.usage.values()).filter(
      (u) => u.userId === userId && (!endpoint || u.endpoint === endpoint)
    );
  }
}

export const rateLimiter = new RateLimiter();

