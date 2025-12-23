/**
 * 자동 점검 스케줄 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { scheduleManager } from '@/lib/automation/scheduler';

export async function GET(request: NextRequest) {
  try {
    const schedules = scheduleManager.getAllSchedules();
    return NextResponse.json({
      success: true,
      schedules,
    });
  } catch (error: any) {
    console.error('스케줄 조회 오류:', error);
    return NextResponse.json(
      { error: '스케줄 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const schedule = scheduleManager.createSchedule(body);
    return NextResponse.json({
      success: true,
      schedule,
    });
  } catch (error: any) {
    console.error('스케줄 생성 오류:', error);
    return NextResponse.json(
      { error: '스케줄 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
