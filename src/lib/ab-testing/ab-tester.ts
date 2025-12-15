/**
 * A/B 테스트 도구
 * A/B Testing Tool
 */

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  changes: Record<string, any>;
  traffic: number; // percentage (0-100)
}

export interface ABTest {
  id: string;
  name: string;
  description?: string;
  variants: ABTestVariant[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate?: Date;
  endDate?: Date;
  metrics: {
    visitors: number;
    conversions: number;
    conversionRate: number;
  };
}

// A/B 테스트 도구
export class ABTester {
  private tests: Map<string, ABTest> = new Map();

  // 테스트 생성
  createTest(name: string, description?: string): ABTest {
    const test: ABTest = {
      id: `test-${Date.now()}`,
      name,
      description,
      variants: [],
      status: 'draft',
      metrics: {
        visitors: 0,
        conversions: 0,
        conversionRate: 0,
      },
    };
    this.tests.set(test.id, test);
    return test;
  }

  // 변형 추가
  addVariant(testId: string, variant: Omit<ABTestVariant, 'id'>): ABTestVariant {
    const test = this.tests.get(testId);
    if (!test) throw new Error('Test not found');

    const newVariant: ABTestVariant = {
      ...variant,
      id: `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    test.variants.push(newVariant);
    return newVariant;
  }

  // 테스트 시작
  startTest(testId: string): void {
    const test = this.tests.get(testId);
    if (!test) throw new Error('Test not found');

    test.status = 'running';
    test.startDate = new Date();
  }

  // 테스트 정지
  pauseTest(testId: string): void {
    const test = this.tests.get(testId);
    if (!test) throw new Error('Test not found');

    test.status = 'paused';
  }

  // 통계 계산
  calculateStats(test: ABTest): Record<string, any> {
    const stats: Record<string, any> = {};

    test.variants.forEach(variant => {
      // 시뮬레이션 데이터
      const visitors = Math.floor(Math.random() * 1000) + 100;
      const conversions = Math.floor(visitors * (0.1 + Math.random() * 0.1));
      const conversionRate = (conversions / visitors) * 100;

      stats[variant.id] = {
        visitors,
        conversions,
        conversionRate: conversionRate.toFixed(2),
      };
    });

    return stats;
  }

  // 테스트 가져오기
  getTest(id: string): ABTest | undefined {
    return this.tests.get(id);
  }

  // 모든 테스트 가져오기
  getAllTests(): ABTest[] {
    return Array.from(this.tests.values());
  }
}

export const abTester = new ABTester();

