/**
 * 콘텐츠 모더레이션 시스템
 * Content Moderation System
 */

export type ModerationAction = 'allow' | 'block' | 'flag' | 'review';

export interface ModerationRule {
  id: string;
  name: string;
  type: 'keyword' | 'pattern' | 'ai';
  pattern?: string;
  keywords?: string[];
  action: ModerationAction;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ModerationResult {
  id: string;
  content: string;
  contentType: 'text' | 'image' | 'video' | 'comment';
  action: ModerationAction;
  reason: string;
  severity: ModerationRule['severity'];
  matchedRules: string[];
  timestamp: Date;
}

// 콘텐츠 모더레이터
export class ContentModerator {
  private rules: Map<string, ModerationRule> = new Map();
  private results: ModerationResult[] = [];

  // 모더레이션 규칙 생성
  createRule(
    name: string,
    type: ModerationRule['type'],
    action: ModerationAction,
    severity: ModerationRule['severity'] = 'medium',
    pattern?: string,
    keywords?: string[]
  ): ModerationRule {
    const rule: ModerationRule = {
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      pattern,
      keywords,
      action,
      enabled: true,
      severity,
    };
    this.rules.set(rule.id, rule);
    return rule;
  }

  // 콘텐츠 모더레이션 (시뮬레이션)
  async moderate(
    content: string,
    contentType: ModerationResult['contentType'] = 'text'
  ): Promise<ModerationResult> {
    const matchedRules: string[] = [];
    let action: ModerationAction = 'allow';
    let reason = '콘텐츠가 정상입니다';
    let severity: ModerationRule['severity'] = 'low';

    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;

      let matched = false;

      switch (rule.type) {
        case 'keyword':
          if (rule.keywords) {
            matched = rule.keywords.some(keyword =>
              content.toLowerCase().includes(keyword.toLowerCase())
            );
          }
          break;
        case 'pattern':
          if (rule.pattern) {
            const regex = new RegExp(rule.pattern, 'i');
            matched = regex.test(content);
          }
          break;
        case 'ai':
          // AI 기반 모더레이션 (시뮬레이션)
          matched = Math.random() < 0.1; // 10% 확률로 플래그
          break;
      }

      if (matched) {
        matchedRules.push(rule.id);
        if (this.getSeverityWeight(rule.severity) > this.getSeverityWeight(severity)) {
          severity = rule.severity;
          action = rule.action;
          reason = rule.name;
        }
      }
    }

    const result: ModerationResult = {
      id: `result-${Date.now()}`,
      content: content.substring(0, 100),
      contentType,
      action,
      reason,
      severity,
      matchedRules,
      timestamp: new Date(),
    };

    this.results.push(result);
    return result;
  }

  // 심각도 가중치
  private getSeverityWeight(severity: ModerationRule['severity']): number {
    const weights = { low: 1, medium: 2, high: 3, critical: 4 };
    return weights[severity];
  }

  // 규칙 가져오기
  getRule(id: string): ModerationRule | undefined {
    return this.rules.get(id);
  }

  // 모든 규칙 가져오기
  getAllRules(): ModerationRule[] {
    return Array.from(this.rules.values());
  }

  // 결과 가져오기
  getResults(limit: number = 100): ModerationResult[] {
    return this.results.slice(-limit).reverse();
  }
}

export const contentModerator = new ContentModerator();

