import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 사용자의 라이선스 조회
    const license = await prisma.subscriptionLicense.findFirst({
      where: { userId: token.id as string },
    });

    if (!license) {
      return NextResponse.json({
        license: null,
      });
    }

    // 만료 확인
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      await prisma.subscriptionLicense.update({
        where: { id: license.id },
        data: { status: 'expired' },
      });
    }

    return NextResponse.json({
      license: {
        tier: license.tier,
        expiresAt: license.expiresAt,
        maxDevices: license.maxDevices,
        features: license.features,
        status: license.status,
      },
    });
  } catch (error: any) {
    console.error('라이선스 조회 오류:', error);
    return NextResponse.json(
      { error: '라이선스 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

