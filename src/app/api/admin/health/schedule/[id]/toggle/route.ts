/**
 * 스케줄 활성화/비활성화 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { scheduleManager } from '@/lib/automation/scheduler';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { enabled } = await request.json();
    const schedule = scheduleManager.toggleSchedule(params.id, enabled);

    if (!schedule) {
      return NextResponse.json(
        { error: '스케줄을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: enabled ? '스케줄이 활성화되었습니다.' : '스케줄이 비활성화되었습니다.',
    });
  } catch (error: any) {
    console.error('스케줄 토글 오류:', error);
    return NextResponse.json(
      { error: '스케줄 토글 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

