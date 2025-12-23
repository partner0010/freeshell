/**
 * 자동 점검 스케줄 개별 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { scheduleManager } from '@/lib/automation/scheduler';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const schedule = scheduleManager.getSchedule(params.id);
    if (!schedule) {
      return NextResponse.json(
        { error: '스케줄을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      schedule,
    });
  } catch (error: any) {
    console.error('스케줄 조회 오류:', error);
    return NextResponse.json(
      { error: '스케줄 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const schedule = scheduleManager.updateSchedule(params.id, body);
    if (!schedule) {
      return NextResponse.json(
        { error: '스케줄을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      schedule,
    });
  } catch (error: any) {
    console.error('스케줄 업데이트 오류:', error);
    return NextResponse.json(
      { error: '스케줄 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = scheduleManager.deleteSchedule(params.id);
    if (!success) {
      return NextResponse.json(
        { error: '스케줄을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error('스케줄 삭제 오류:', error);
    return NextResponse.json(
      { error: '스케줄 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
