/**
 * 사용자 플랜 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 실제로는 데이터베이스에서 사용자 플랜 조회
    // 여기서는 기본값으로 'free' 플랜 반환
    const plan = {
      name: '무료',
      tier: 'free' as const,
      price: 0,
      benefits: [
        '기본 AI 기능 사용',
        '제한된 저장 공간',
        '커뮤니티 지원',
        '기본 템플릿',
      ],
      features: {
        storage: '5GB',
        projects: '3개',
        aiCredits: '100/월',
        support: '커뮤니티',
        customization: '제한적',
      },
    };

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error: any) {
    console.error('플랜 조회 오류:', error);
    return NextResponse.json(
      { error: '플랜 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

