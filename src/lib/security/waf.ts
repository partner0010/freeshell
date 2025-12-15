/**
 * 웹 애플리케이션 방화벽 (WAF)
 * Web Application Firewall
 */

export interface WAFRule {
  id: string;
  name: string;
  enabled: boolean;
  type: 'ip' | 'pattern' | 'rate-limit' | 'geo' | 'user-agent';
  condition: string;
  action: 'allow' | 'block' | 'challenge' | 'log';
  priority: number;
}

export interface WAFRequest {
  ip: string;
  method: string;
  path: string;
  headers: Record<string, string>;
  body?: any;
  userAgent: string;
  country?: string;
  userId?: string;
}

export interface WAFResponse {
  allowed: boolean;
  action: 'allow' | 'block' | 'challenge';
  matchedRules: string[];
  reason?: string;
  challenge?: 'captcha' | 'mfa';
}

// WAF 시스템
export class WAFSystem {
  private rules: Map<string, WAFRule> = new Map();
  private blocklist: Set<string> = new Set();
  private allowlist: Set<string> = new Set();

  constructor() {
    this.createDefaultRules();
  }

  private createDefaultRules(): void {
    // SQL Injection 차단
    this.addRule({
      id: 'sql-injection',
      name: 'SQL Injection 차단',
      enabled: true,
      type: 'pattern',
      condition: '(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION)\b|[\'";]\\s*(OR|AND)\\s*[\'"]?\\d+[\'"]?\\s*=\\s*[\'"]?\\d+)',
      action: 'block',
      priority: 1,
    });

    // XSS 차단
    this.addRule({
      id: 'xss',
      name: 'XSS 차단',
      enabled: true,
      type: 'pattern',
      condition: '(<script[\\s>]|javascript:|on\\w+\\s*=|<iframe[\\s>])',
      action: 'block',
      priority: 2,
    });

    // Rate Limiting
    this.addRule({
      id: 'rate-limit',
      name: 'Rate Limiting',
      enabled: true,
      type: 'rate-limit',
      condition: 'requests_per_minute > 100',
      action: 'challenge',
      priority: 3,
    });

    // 봇 차단
    this.addRule({
      id: 'bot-block',
      name: '악성 봇 차단',
      enabled: true,
      type: 'user-agent',
      condition: '(curl|wget|python|scrapy|bot|crawler)',
      action: 'block',
      priority: 4,
    });
  }

  addRule(rule: WAFRule): void {
    this.rules.set(rule.id, rule);
  }

  // 요청 검사
  async inspectRequest(request: WAFRequest): Promise<WAFResponse> {
    const matchedRules: string[] = [];

    // 화이트리스트 우선
    if (this.allowlist.has(request.ip)) {
      return {
        allowed: true,
        action: 'allow',
        matchedRules: [],
      };
    }

    // 블랙리스트 체크
    if (this.blocklist.has(request.ip)) {
      return {
        allowed: false,
        action: 'block',
        matchedRules: ['blocklist'],
        reason: 'IP가 블랙리스트에 있습니다',
      };
    }

    // 규칙 검사 (우선순위 순)
    const sortedRules = Array.from(this.rules.values()).sort(
      (a, b) => a.priority - b.priority
    );

    for (const rule of sortedRules) {
      if (!rule.enabled) continue;

      if (this.matchesRule(rule, request)) {
        matchedRules.push(rule.id);

        switch (rule.action) {
          case 'block':
            this.blocklist.add(request.ip);
            return {
              allowed: false,
              action: 'block',
              matchedRules,
              reason: `Rule: ${rule.name}`,
            };

          case 'challenge':
            return {
              allowed: true,
              action: 'challenge',
              matchedRules,
              challenge: 'captcha',
              reason: `Rule: ${rule.name}`,
            };

          case 'log':
            // 로그만 남기고 통과
            break;
        }
      }
    }

    return {
      allowed: true,
      action: 'allow',
      matchedRules,
    };
  }

  private matchesRule(rule: WAFRule, request: WAFRequest): boolean {
    switch (rule.type) {
      case 'pattern':
        const content = `${request.method} ${request.path} ${JSON.stringify(request.headers)} ${JSON.stringify(request.body)}`;
        const regex = new RegExp(rule.condition, 'i');
        return regex.test(content);

      case 'ip':
        return rule.condition.split(',').includes(request.ip);

      case 'user-agent':
        const uaRegex = new RegExp(rule.condition, 'i');
        return uaRegex.test(request.userAgent);

      case 'rate-limit':
        // 실제로는 rate limit 체크
        return false;

      case 'geo':
        if (rule.condition.startsWith('block:')) {
          const countries = rule.condition.replace('block:', '').split(',');
          return request.country && countries.includes(request.country);
        }
        return false;

      default:
        return false;
    }
  }

  // IP 차단
  blockIP(ip: string): void {
    this.blocklist.add(ip);
  }

  // IP 허용
  allowIP(ip: string): void {
    this.allowlist.add(ip);
    this.blocklist.delete(ip);
  }

  getRules(): WAFRule[] {
    return Array.from(this.rules.values());
  }
}

export const wafSystem = new WAFSystem();

