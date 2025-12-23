/**
 * 종합 검증 API
 * 미구현, 미동작, 소스 오류, 보안 등 종합 검증
 */

import { NextRequest, NextResponse } from 'next/server';
import { comprehensiveValidator } from '@/lib/testing/comprehensive-validator';

export async function POST(request: NextRequest) {
  try {
    const report = await comprehensiveValidator.validateAll();

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('종합 검증 오류:', error);
    return NextResponse.json(
      { error: `종합 검증 중 오류가 발생했습니다: ${error.message}` },
      { status: 500 }
    );
  }
}

