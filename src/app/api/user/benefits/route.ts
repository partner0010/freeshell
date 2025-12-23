/**
 * 회원 혜택 API
 * 온라인 조사 기반 다양한 혜택 제공
 */

import { NextRequest, NextResponse } from 'next/server';

interface Benefit {
  id: string;
  title: string;
  description: string;
  category: 'storage' | 'features' | 'support' | 'premium' | 'collaboration';
  free: boolean;
  premium: boolean;
  pro: boolean;
  value?: string;
}

export async function GET(request: NextRequest) {
  try {
    // 온라인 조사 기반 혜택 구성
    const benefits: Benefit[] = [
      {
        id: 'unlimited-storage',
        title: '무제한 저장 공간',
        description: '클라우드에 무제한으로 저장하세요',
        category: 'storage',
        free: false,
        premium: true,
        pro: true,
        value: '무제한',
      },
      {
        id: 'premium-ai',
        title: '프리미엄 AI 모델',
        description: '고급 AI 모델을 사용하여 더 나은 결과를 얻으세요',
        category: 'features',
        free: false,
        premium: true,
        pro: true,
      },
      {
        id: 'priority-support',
        title: '우선 지원',
        description: '문제 해결을 위한 우선 지원',
        category: 'support',
        free: false,
        premium: true,
        pro: true,
      },
      {
        id: 'private-content',
        title: '비공개 콘텐츠',
        description: '비공개로 콘텐츠를 저장하고 관리하세요',
        category: 'features',
        free: false,
        premium: true,
        pro: true,
      },
      {
        id: 'premium-templates',
        title: '프리미엄 템플릿',
        description: '고급 템플릿을 무제한으로 사용하세요',
        category: 'premium',
        free: false,
        premium: true,
        pro: true,
      },
      {
        id: 'api-access',
        title: 'API 접근',
        description: 'API를 통해 자동화하고 통합하세요',
        category: 'features',
        free: false,
        premium: false,
        pro: true,
      },
      {
        id: 'team-collaboration',
        title: '팀 협업',
        description: '팀과 함께 작업하고 공유하세요',
        category: 'collaboration',
        free: false,
        premium: false,
        pro: true,
      },
      {
        id: 'custom-ai',
        title: '커스텀 AI 모델',
        description: '자신만의 AI 모델을 훈련하고 사용하세요',
        category: 'features',
        free: false,
        premium: false,
        pro: true,
      },
      {
        id: 'white-label',
        title: '화이트라벨',
        description: '브랜딩을 제거하고 자신의 브랜드로 사용하세요',
        category: 'premium',
        free: false,
        premium: false,
        pro: true,
      },
      {
        id: 'advanced-analytics',
        title: '고급 분석',
        description: '상세한 사용 통계와 분석을 확인하세요',
        category: 'features',
        free: false,
        premium: false,
        pro: true,
      },
    ];

    return NextResponse.json({
      success: true,
      benefits,
    });
  } catch (error: any) {
    console.error('혜택 조회 오류:', error);
    return NextResponse.json(
      { error: '혜택 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
