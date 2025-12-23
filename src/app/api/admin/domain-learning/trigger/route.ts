/**
 * 도메인별 AI 자동 학습 트리거 API
 * 각 메뉴의 AI가 자신의 기능에 맞게 학습
 */

import { NextRequest, NextResponse } from 'next/server';
import { domainLearningSystem } from '@/lib/ai/domain-specific-learning';

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json().catch(() => ({}));

    if (domain) {
      // 특정 도메인만 학습
      const result = await domainLearningSystem.learnForDomain(domain);
      return NextResponse.json({
        success: true,
        domain,
        result,
      });
    } else {
      // 모든 도메인 학습
      const results = await domainLearningSystem.learnAllDomains();
      return NextResponse.json({
        success: true,
        message: '모든 도메인 학습 완료',
        results,
      });
    }
  } catch (error: any) {
    console.error('도메인별 학습 트리거 실패:', error);
    return NextResponse.json(
      { error: '도메인별 학습 중 오류가 발생했습니다.', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (domain) {
      // 특정 도메인의 학습 결과 조회
      const interactions = domainLearningSystem.getInteractions(domain);
      const patterns = domainLearningSystem.getLearnedPatterns(domain);
      
      return NextResponse.json({
        success: true,
        domain,
        interactions: interactions.length,
        patterns: patterns.length,
        recentInteractions: interactions.slice(-10),
      });
    } else {
      // 모든 도메인 통계
      const domains = ['chat', 'code', 'content', 'image', 'video', 'security', 'signature', 'debug', 'validate'];
      const stats = domains.map(d => {
        const interactions = domainLearningSystem.getInteractions(d);
        return {
          domain: d,
          interactions: interactions.length,
        };
      });

      return NextResponse.json({
        success: true,
        stats,
      });
    }
  } catch (error: any) {
    console.error('도메인별 학습 조회 실패:', error);
    return NextResponse.json(
      { error: '도메인별 학습 조회 중 오류가 발생했습니다.', details: error.message },
      { status: 500 }
    );
  }
}

