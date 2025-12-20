import { NextRequest, NextResponse } from 'next/server';
import { contentScheduler } from '@/lib/scheduling/scheduler';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'id가 필요합니다.' }, { status: 400 });
    }

    const job = contentScheduler.toggleSchedule(id);
    if (!job) {
      return NextResponse.json({ error: '스케줄을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error: any) {
    return NextResponse.json(
      { error: '스케줄 토글 중 오류가 발생했습니다.', detail: error.message },
      { status: 500 }
    );
  }
}

