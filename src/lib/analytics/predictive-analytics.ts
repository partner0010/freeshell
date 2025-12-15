/**
 * 예측 분석 및 개인화 시스템
 * Predictive Analytics and Personalization
 */

export interface UserProfile {
  userId: string;
  preferences: Record<string, any>;
  behavior: UserBehavior;
  predictions: Prediction[];
}

export interface UserBehavior {
  clicks: number;
  views: number;
  timeSpent: number;
  features: string[];
  patterns: BehaviorPattern[];
}

export interface BehaviorPattern {
  type: 'time' | 'feature' | 'device' | 'location';
  value: string;
  frequency: number;
  confidence: number;
}

export interface Prediction {
  type: 'feature' | 'content' | 'action';
  item: string;
  score: number;
  confidence: number;
  reason: string;
}

export interface Recommendation {
  id: string;
  type: 'feature' | 'content' | 'optimization';
  title: string;
  description: string;
  score: number;
  impact: 'high' | 'medium' | 'low';
  actionUrl?: string;
}

// 예측 분석 시스템
export class PredictiveAnalytics {
  private profiles: Map<string, UserProfile> = new Map();

  // 사용자 프로필 업데이트
  updateProfile(userId: string, behavior: Partial<UserBehavior>): void {
    const profile = this.profiles.get(userId) || {
      userId,
      preferences: {},
      behavior: {
        clicks: 0,
        views: 0,
        timeSpent: 0,
        features: [],
        patterns: [],
      },
      predictions: [],
    };

    if (behavior.clicks !== undefined) profile.behavior.clicks += behavior.clicks;
    if (behavior.views !== undefined) profile.behavior.views += behavior.views;
    if (behavior.timeSpent !== undefined) profile.behavior.timeSpent += behavior.timeSpent;
    if (behavior.features) profile.behavior.features.push(...behavior.features);

    // 패턴 분석
    this.analyzePatterns(profile);

    // 예측 생성
    profile.predictions = this.generatePredictions(profile);

    this.profiles.set(userId, profile);
  }

  // 패턴 분석
  private analyzePatterns(profile: UserProfile): void {
    const patterns: BehaviorPattern[] = [];

    // 시간 패턴
    const hour = new Date().getHours();
    patterns.push({
      type: 'time',
      value: `${hour}:00`,
      frequency: 1,
      confidence: 0.8,
    });

    // 기능 패턴
    const featureCounts = new Map<string, number>();
    profile.behavior.features.forEach((f) => {
      featureCounts.set(f, (featureCounts.get(f) || 0) + 1);
    });

    featureCounts.forEach((count, feature) => {
      if (count > 3) {
        patterns.push({
          type: 'feature',
          value: feature,
          frequency: count,
          confidence: Math.min(count / 10, 1),
        });
      }
    });

    profile.behavior.patterns = patterns;
  }

  // 예측 생성
  private generatePredictions(profile: UserProfile): Prediction[] {
    const predictions: Prediction[] = [];

    // 기능 예측
    profile.behavior.patterns.forEach((pattern) => {
      if (pattern.type === 'feature' && pattern.confidence > 0.7) {
        predictions.push({
          type: 'feature',
          item: pattern.value,
          score: pattern.confidence * 100,
          confidence: pattern.confidence,
          reason: `이전에 ${pattern.frequency}번 사용했습니다`,
        });
      }
    });

    return predictions.sort((a, b) => b.score - a.score);
  }

  // 개인화 추천
  getPersonalizedRecommendations(userId: string): Recommendation[] {
    const profile = this.profiles.get(userId);
    if (!profile) return [];

    const recommendations: Recommendation[] = [];

    // 기능 추천
    profile.predictions.forEach((pred) => {
      recommendations.push({
        id: `rec-${pred.item}`,
        type: 'feature',
        title: `${pred.item} 사용 추천`,
        description: pred.reason,
        score: pred.score,
        impact: pred.score > 80 ? 'high' : 'medium',
      });
    });

    // 최적화 추천
    if (profile.behavior.timeSpent > 3600000) {
      recommendations.push({
        id: 'rec-optimize',
        type: 'optimization',
        title: '성능 최적화 추천',
        description: '사용 시간이 길어 최적화가 필요합니다',
        score: 85,
        impact: 'high',
      });
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  // 사용자 세그먼트
  getUserSegments(): Map<string, string[]> {
    const segments = new Map<string, string[]>();

    for (const [userId, profile] of this.profiles.entries()) {
      let segment = 'casual';
      
      if (profile.behavior.clicks > 100) segment = 'power';
      else if (profile.behavior.clicks > 50) segment = 'active';
      else if (profile.behavior.clicks > 10) segment = 'regular';

      if (!segments.has(segment)) {
        segments.set(segment, []);
      }
      segments.get(segment)!.push(userId);
    }

    return segments;
  }

  getProfile(userId: string): UserProfile | undefined {
    return this.profiles.get(userId);
  }
}

export const predictiveAnalytics = new PredictiveAnalytics();

