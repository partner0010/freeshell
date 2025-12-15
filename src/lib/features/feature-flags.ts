/**
 * Feature Flags / Feature Toggles 시스템
 * Feature Flags System
 */

export type RolloutStrategy = 'all' | 'percentage' | 'canary' | 'custom';

export interface FeatureFlag {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  strategy: RolloutStrategy;
  percentage?: number; // 0-100
  targetUsers?: string[]; // 사용자 ID 목록
  targetGroups?: string[]; // 그룹 ID 목록
  environment?: 'development' | 'staging' | 'production';
  createdAt: Date;
  updatedAt: Date;
}

// Feature Flags 관리자
export class FeatureFlagsManager {
  private flags: Map<string, FeatureFlag> = new Map();

  // Feature Flag 생성
  createFlag(
    name: string,
    description?: string,
    environment?: FeatureFlag['environment']
  ): FeatureFlag {
    const flag: FeatureFlag = {
      id: `flag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      enabled: false,
      strategy: 'all',
      environment: environment || 'production',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.flags.set(flag.id, flag);
    return flag;
  }

  // Flag 활성화/비활성화
  toggleFlag(id: string, enabled: boolean): void {
    const flag = this.flags.get(id);
    if (!flag) throw new Error('Flag not found');
    flag.enabled = enabled;
    flag.updatedAt = new Date();
  }

  // Rollout 전략 업데이트
  updateStrategy(
    id: string,
    strategy: RolloutStrategy,
    percentage?: number,
    targetUsers?: string[],
    targetGroups?: string[]
  ): void {
    const flag = this.flags.get(id);
    if (!flag) throw new Error('Flag not found');
    flag.strategy = strategy;
    flag.percentage = percentage;
    flag.targetUsers = targetUsers;
    flag.targetGroups = targetGroups;
    flag.updatedAt = new Date();
  }

  // Feature Flag 체크 (사용자별)
  async isEnabled(flagId: string, userId?: string, userGroups?: string[]): Promise<boolean> {
    const flag = this.flags.get(flagId);
    if (!flag || !flag.enabled) return false;

    switch (flag.strategy) {
      case 'all':
        return true;
      case 'percentage':
        if (flag.percentage === undefined) return false;
        const hash = userId ? this.hashUserId(userId) : Math.random() * 100;
        return hash < flag.percentage;
      case 'canary':
        // 카나리 배포 - 특정 사용자/그룹만
        if (userId && flag.targetUsers?.includes(userId)) return true;
        if (userGroups && flag.targetGroups?.some(g => userGroups.includes(g))) return true;
        return false;
      case 'custom':
        // 커스텀 로직
        if (userId && flag.targetUsers?.includes(userId)) return true;
        if (userGroups && flag.targetGroups?.some(g => userGroups.includes(g))) return true;
        return false;
      default:
        return false;
    }
  }

  // 사용자 ID 해시 (일관된 퍼센트 계산)
  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % 100;
  }

  // Flag 가져오기
  getFlag(id: string): FeatureFlag | undefined {
    return this.flags.get(id);
  }

  // 모든 Flag 가져오기
  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }
}

export const featureFlagsManager = new FeatureFlagsManager();

