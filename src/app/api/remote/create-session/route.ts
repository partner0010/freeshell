/**
 * 원격 세션 생성 API
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

    const sessionId = generateUUID();
    const hostId = generateUUID();

    sessions.set(sessionId, {
      sessionId,
      code: code.toUpperCase(),
      hostId,
      clientId: null,
      createdAt: new Date(),
      status: 'waiting',
    });

    // 코드로도 검색 가능하도록 저장
    sessions.set(code.toUpperCase(), sessions.get(sessionId)!);

    return NextResponse.json({
      success: true,
      sessionId,
      code: code.toUpperCase(),
    });
  } catch (error: any) {
    console.error('세션 생성 오류:', error);
    return NextResponse.json(
      { error: '세션 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const session = sessions.get(code.toUpperCase());
    if (session) {
      return NextResponse.json({
        success: true,
        session: {
          sessionId: session.sessionId,
          status: session.status,
          createdAt: session.createdAt,
        },
      });
    }
  }

  return NextResponse.json(
    { error: '세션을 찾을 수 없습니다.' },
    { status: 404 }
  );
}

