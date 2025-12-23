/**
 * 관리자 옵션 설정 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    // 실제로는 데이터베이스에서 옵션 조회
    const options = [
      // 일반 옵션
      {
        id: 'site-name',
        category: 'general',
        name: '사이트 이름',
        description: '사이트의 표시 이름',
        type: 'string',
        value: 'Freeshell',
        default: 'Freeshell',
      },
      {
        id: 'maintenance-mode',
        category: 'general',
        name: '점검 모드',
        description: '사이트를 점검 모드로 전환',
        type: 'boolean',
        value: false,
        default: false,
      },
      // 보안 옵션
      {
        id: 'require-2fa',
        category: 'security',
        name: '2단계 인증 필수',
        description: '관리자 계정에 2단계 인증 필수',
        type: 'boolean',
        value: false,
        default: false,
      },
      {
        id: 'session-timeout',
        category: 'security',
        name: '세션 타임아웃 (분)',
        description: '자동 로그아웃 시간',
        type: 'number',
        value: 60,
        default: 60,
      },
      // 성능 옵션
      {
        id: 'cache-enabled',
        category: 'performance',
        name: '캐싱 활성화',
        description: '페이지 캐싱 사용',
        type: 'boolean',
        value: true,
        default: true,
      },
      {
        id: 'cdn-enabled',
        category: 'performance',
        name: 'CDN 사용',
        description: 'CDN을 통한 정적 파일 제공',
        type: 'boolean',
        value: false,
        default: false,
      },
      // 알림 옵션
      {
        id: 'email-notifications',
        category: 'notifications',
        name: '이메일 알림',
        description: '중요 이벤트 이메일 알림',
        type: 'boolean',
        value: true,
        default: true,
      },
      {
        id: 'notification-level',
        category: 'notifications',
        name: '알림 레벨',
        description: '알림 중요도 레벨',
        type: 'select',
        value: 'medium',
        options: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
      },
    ];

    return NextResponse.json({
      success: true,
      options,
    });
  } catch (error: any) {
    console.error('옵션 조회 오류:', error);
    return NextResponse.json(
      { error: '옵션 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { options } = await request.json();

    // 실제로는 데이터베이스에 옵션 저장
    // 여기서는 성공 응답만 반환

    return NextResponse.json({
      success: true,
      message: '옵션이 저장되었습니다.',
    });
  } catch (error: any) {
    console.error('옵션 저장 오류:', error);
    return NextResponse.json(
      { error: '옵션 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

