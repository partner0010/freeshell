/**
 * WebRTC 시그널링 서버
 * Offer/Answer 및 ICE Candidate 교환
 */

import { NextRequest, NextResponse } from 'next/server';

// 시그널링 메시지 저장소 (실제로는 WebSocket 또는 Redis 사용)
const signalingMessages = new Map<string, Array<{
  type: 'offer' | 'answer' | 'ice-candidate';
  from: string;
  to: string;
  data: any;
  timestamp: Date;
}>>();

export async function POST(request: NextRequest) {
  try {
    const { sessionId, type, from, to, data } = await request.json();

    if (!sessionId || !type || !from || !to) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const message = {
      type,
      from,
      to,
      data,
      timestamp: new Date(),
    };

    // 메시지 저장
    if (!signalingMessages.has(sessionId)) {
      signalingMessages.set(sessionId, []);
    }
    signalingMessages.get(sessionId)!.push(message);

    return NextResponse.json({
      success: true,
      messageId: `msg-${Date.now()}`,
    });
  } catch (error: any) {
    console.error('시그널링 오류:', error);
    return NextResponse.json(
      { error: '시그널링 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const userId = searchParams.get('userId');
  const lastMessageId = searchParams.get('lastMessageId');

  if (!sessionId || !userId) {
    return NextResponse.json(
      { error: '세션 ID와 사용자 ID가 필요합니다.' },
      { status: 400 }
    );
  }

  const messages = signalingMessages.get(sessionId) || [];
  
  // 해당 사용자에게 전달할 메시지만 필터링
  const userMessages = messages.filter(msg => msg.to === userId);

  // 마지막 메시지 이후의 메시지만 반환
  if (lastMessageId) {
    const lastIndex = messages.findIndex(msg => msg.timestamp.toString() === lastMessageId);
    return NextResponse.json({
      success: true,
      messages: userMessages.slice(lastIndex + 1),
    });
  }

  return NextResponse.json({
    success: true,
    messages: userMessages,
  });
}

