/**
 * 자동 점검 및 복구 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { selfHealingSystem } from '@/lib/automation/self-healing';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const run = searchParams.get('run') === 'true';

    if (run) {
      // 자동 점검 실행
      const result = await selfHealingSystem.runDailyCheck();
      return NextResponse.json({
        success: true,
        result,
      });
    } else {
      // 마지막 점검 시간 조회
      const lastCheck = selfHealingSystem.getLastCheckTime();
      return NextResponse.json({
        success: true,
        lastCheck,
      });
    }
  } catch (error: any) {
    console.error('자동 점검 오류:', error);
    return NextResponse.json(
      { error: '자동 점검 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 자동 점검 스케줄러 시작
    selfHealingSystem.startAutoCheck();
    
    return NextResponse.json({
      success: true,
      message: '자동 점검 스케줄러가 시작되었습니다.',
    });
  } catch (error: any) {
    console.error('스케줄러 시작 오류:', error);
    return NextResponse.json(
      { error: '스케줄러 시작 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

