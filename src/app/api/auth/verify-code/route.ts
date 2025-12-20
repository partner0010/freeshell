import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: '휴대폰 번호와 인증번호를 입력하세요.' },
        { status: 400 }
      );
    }

    // 인증 요청 찾기
    const verification = await prisma.identityVerification.findFirst({
      where: {
        phone,
        verified: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: '인증번호가 만료되었거나 존재하지 않습니다.' },
        { status: 400 }
      );
    }

    // 시도 횟수 확인
    if (verification.attempts >= 5) {
      return NextResponse.json(
        { error: '인증 시도 횟수를 초과했습니다. 다시 인증번호를 요청하세요.' },
        { status: 400 }
      );
    }

    // 인증번호 확인
    if (verification.code !== code) {
      await prisma.identityVerification.update({
        where: { id: verification.id },
        data: { attempts: verification.attempts + 1 },
      });

      return NextResponse.json(
        { error: '인증번호가 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    // 인증 완료
    await prisma.identityVerification.update({
      where: { id: verification.id },
      data: {
        verified: true,
        verifiedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: '본인 인증이 완료되었습니다.',
    });
  } catch (error: any) {
    console.error('인증번호 확인 오류:', error);
    return NextResponse.json(
      { error: '인증번호 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

