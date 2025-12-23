/**
 * 전자서명 완료 API
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { signature } = await request.json();
    const documentId = params.id;

    if (!signature) {
      return NextResponse.json(
        { error: '서명 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    // 실제로는:
    // 1. 서명 데이터를 암호화하여 저장
    // 2. 타임스탬프 추가
    // 3. 문서에 서명 적용
    // 4. 서명자에게 알림 전송

    return NextResponse.json({
      success: true,
      message: '서명이 완료되었습니다.',
      documentId,
    });
  } catch (error: any) {
    console.error('서명 완료 오류:', error);
    return NextResponse.json(
      { error: '서명 완료 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

