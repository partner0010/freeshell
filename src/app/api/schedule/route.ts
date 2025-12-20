import { NextRequest, NextResponse } from 'next/server';
import { contentScheduler, type ScheduleConfig } from '@/lib/scheduling/scheduler';

export const runtime = 'nodejs';

// 스케줄 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const job = contentScheduler.getSchedule(id);
      if (!job) {
        return NextResponse.json({ error: '스케줄을 찾을 수 없습니다.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: job });
    }

    const allJobs = contentScheduler.getAllSchedules();
    return NextResponse.json({ success: true, data: allJobs });
  } catch (error: any) {
    return NextResponse.json(
      { error: '스케줄 조회 중 오류가 발생했습니다.', detail: error.message },
      { status: 500 }
    );
  }
}

// 스케줄 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config: ScheduleConfig = body;

    if (!config.topic || !config.contentType || !config.frequency) {
      return NextResponse.json(
        { error: 'topic, contentType, frequency가 필요합니다.' },
        { status: 400 }
      );
    }

    const job = contentScheduler.addSchedule(config);
    return NextResponse.json({ success: true, data: job });
  } catch (error: any) {
    return NextResponse.json(
      { error: '스케줄 생성 중 오류가 발생했습니다.', detail: error.message },
      { status: 500 }
    );
  }
}

// 스케줄 업데이트
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'id가 필요합니다.' }, { status: 400 });
    }

    const job = contentScheduler.updateSchedule(id, updates);
    if (!job) {
      return NextResponse.json({ error: '스케줄을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error: any) {
    return NextResponse.json(
      { error: '스케줄 업데이트 중 오류가 발생했습니다.', detail: error.message },
      { status: 500 }
    );
  }
}

// 스케줄 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id가 필요합니다.' }, { status: 400 });
    }

    const deleted = contentScheduler.deleteSchedule(id);
    if (!deleted) {
      return NextResponse.json({ error: '스케줄을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: '스케줄이 삭제되었습니다.' });
  } catch (error: any) {
    return NextResponse.json(
      { error: '스케줄 삭제 중 오류가 발생했습니다.', detail: error.message },
      { status: 500 }
    );
  }
}

