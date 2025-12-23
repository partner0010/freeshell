/**
 * 원격 세션 종료 API
 */

import { NextRequest, NextResponse } from 'next/server';

// 세션 저장소 (실제로는 Redis나 DB 사용)
const sessions = new Map<string, {
  sessionId: string;
  code: string;
  hostId: string;
  clientId: string | null;
  createdAt: Date;
  status: 'waiting' | 'connected' | 'ended';
}>();

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: '세션 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const session = sessions.get(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: '세션을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    session.status = 'ended';

    // 세션 정리 (실제로는 타임아웃 설정)
    setTimeout(() => {
      sessions.delete(sessionId);
      sessions.delete(session.code);
    }, 60000); // 1분 후 삭제

    return NextResponse.json({
      success: true,
      message: '세션이 종료되었습니다.',
    });
  } catch (error: any) {
    console.error('세션 종료 오류:', error);
    return NextResponse.json(
      { error: '세션 종료 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

