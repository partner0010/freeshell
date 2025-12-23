/**
 * 원격 세션 연결 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateUUID } from '@/utils/uuid';

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
    const { code } = await request.json();

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: '올바른 연결 코드를 입력하세요.' },
        { status: 400 }
      );
    }

    const session = sessions.get(code.toUpperCase());

    if (!session) {
      return NextResponse.json(
        { error: '연결 코드가 올바르지 않거나 세션이 만료되었습니다.' },
        { status: 404 }
      );
    }

    if (session.status === 'ended') {
      return NextResponse.json(
        { error: '이미 종료된 세션입니다.' },
        { status: 400 }
      );
    }

    if (session.status === 'connected') {
      return NextResponse.json(
        { error: '이미 다른 클라이언트가 연결되어 있습니다.' },
        { status: 400 }
      );
    }

    const clientId = generateUUID();
    session.clientId = clientId;
    session.status = 'connected';

    return NextResponse.json({
      success: true,
      sessionId: session.sessionId,
      clientId,
    });
  } catch (error: any) {
    console.error('세션 연결 오류:', error);
    return NextResponse.json(
      { error: '세션 연결 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

