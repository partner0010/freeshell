import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 인증번호 생성
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || !/^010-\d{4}-\d{4}$/.test(phone)) {
      return NextResponse.json(
        { error: '올바른 휴대폰 번호를 입력하세요.' },
        { status: 400 }
      );
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5분 후 만료

    // 기존 인증 요청 삭제
    await prisma.identityVerification.deleteMany({
      where: { phone },
    });

    // 새 인증 요청 생성
    await prisma.identityVerification.create({
      data: {
        phone,
        code,
        expiresAt,
        userId: '', // 회원가입 전이므로 빈 문자열
      },
    });

    // 실제로는 SMS 발송 API를 호출해야 합니다
    // 예: 카카오 알림톡, 네이버 클라우드 플랫폼 등
    console.log(`[개발 모드] 인증번호: ${code} (${phone})`);

    // 개발 환경에서는 인증번호를 반환 (프로덕션에서는 제거)
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        message: '인증번호가 전송되었습니다.',
        code: code, // 개발 환경에서만
      });
    }

    return NextResponse.json({
      success: true,
      message: '인증번호가 전송되었습니다.',
    });
  } catch (error: any) {
    console.error('인증번호 전송 오류:', error);
    return NextResponse.json(
      { error: '인증번호 전송 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

