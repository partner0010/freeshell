/**
 * 코드 분석 API
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: '코드를 입력하세요.' },
        { status: 400 }
      );
    }

    // 간단한 코드 분석 (실제로는 더 정교한 분석 필요)
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // 기본 검사
    if (code.includes('console.log')) {
      warnings.push('프로덕션 코드에서 console.log 사용을 피하세요.');
    }

    if (code.includes('eval(')) {
      errors.push('eval() 사용은 보안 위험이 있습니다.');
    }

    if (code.includes('var ')) {
      suggestions.push('var 대신 const 또는 let을 사용하세요.');
    }

    if (!code.includes('try') && code.includes('await')) {
      suggestions.push('비동기 코드에 에러 핸들링을 추가하세요.');
    }

    const result = {
      success: true,
      errors,
      warnings,
      suggestions,
    };

    // 도메인별 학습 시스템에 상호작용 기록
    try {
      const { domainLearningSystem } = await import('@/lib/ai/domain-specific-learning');
      domainLearningSystem.recordInteraction('debug', {
        action: 'analyze-code',
        input: code,
        output: JSON.stringify(result),
        feedback: undefined,
      });
    } catch (error) {
      console.error('학습 기록 실패:', error);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('코드 분석 오류:', error);
    return NextResponse.json(
      { error: '코드 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

