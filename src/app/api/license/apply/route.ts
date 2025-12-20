import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { licenseKey } = await request.json();

    if (!licenseKey) {
      return NextResponse.json(
        { error: '라이선스 키를 입력하세요.' },
        { status: 400 }
      );
    }

    // 라이선스 조회
    const license = await prisma.subscriptionLicense.findUnique({
      where: { licenseKey },
    });

    if (!license) {
      return NextResponse.json(
        { error: '유효하지 않은 라이선스 키입니다.' },
        { status: 404 }
      );
    }

    // 이미 다른 사용자에게 할당되어 있는지 확인
    if (license.userId && license.userId !== token.id) {
      return NextResponse.json(
        { error: '이미 다른 사용자에게 할당된 라이선스입니다.' },
        { status: 400 }
      );
    }

    // 상태 확인
    if (license.status !== 'active') {
      return NextResponse.json(
        { error: '비활성화된 라이선스입니다.' },
        { status: 400 }
      );
    }

    // 만료 확인
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: '만료된 라이선스입니다.' },
        { status: 400 }
      );
    }

    // 사용자에게 라이선스 할당
    await prisma.subscriptionLicense.update({
      where: { id: license.id },
      data: { userId: token.id as string },
    });

    // 사용자 구독 정보 업데이트
    await prisma.user.update({
      where: { id: token.id as string },
      data: {
        subscriptionTier: license.tier,
        subscriptionExpiresAt: license.expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: '라이선스가 적용되었습니다.',
      license: {
        tier: license.tier,
        expiresAt: license.expiresAt,
        maxDevices: license.maxDevices,
        features: license.features,
      },
    });
  } catch (error: any) {
    console.error('라이선스 적용 오류:', error);
    return NextResponse.json(
      { error: '라이선스 적용 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

