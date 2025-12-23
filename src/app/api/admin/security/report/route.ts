/**
 * 보안 보고서 API
 * AI 방어 로그 및 조치사항 보고서
 */

import { NextRequest, NextResponse } from 'next/server';
import { AISecurityEnhancer } from '@/lib/security/ai-security-enhancer';
import { AISecurityGuard } from '@/lib/security/ai-security-guard';

const securityGuard = new AISecurityGuard();
const securityEnhancer = new AISecurityEnhancer(securityGuard);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'daily';

    // 일일 보고서 생성
    const report = await securityEnhancer.generateDailyReport();

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('보안 보고서 생성 오류:', error);
    return NextResponse.json(
      { error: '보안 보고서 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, trendId } = await request.json();

    if (action === 'apply_trend' && trendId) {
      const success = await securityEnhancer.applySecurityTrend(trendId);
      return NextResponse.json({
        success,
        message: success ? '보안 트렌드가 적용되었습니다.' : '보안 트렌드 적용에 실패했습니다.',
      });
    }

    return NextResponse.json(
      { error: '알 수 없는 액션입니다.' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('보안 액션 오류:', error);
    return NextResponse.json(
      { error: '보안 액션 실행 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

