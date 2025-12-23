/**
 * 관리자 초기화 API
 * 기본 관리자 계정 생성
 */

import { NextResponse } from 'next/server';
import { createDefaultAdmin } from '@/lib/auth/create-admin';

export async function POST() {
  try {
    const admin = await createDefaultAdmin();
    
    return NextResponse.json({
      success: true,
      message: '관리자 계정이 생성되었습니다.',
      admin: {
        email: admin.email,
        role: admin.role,
      },
      credentials: {
        email: 'admin@freeshell.co.kr',
        password: 'admin123!@#',
        note: '보안을 위해 로그인 후 비밀번호를 변경하세요!',
      },
    });
  } catch (error: any) {
    if (error.message?.includes('이미 존재')) {
      return NextResponse.json({
        success: false,
        message: '관리자 계정이 이미 존재합니다.',
      });
    }

    console.error('Admin init error:', error);
    return NextResponse.json(
      { error: '관리자 계정 생성 실패' },
      { status: 500 }
    );
  }
}

