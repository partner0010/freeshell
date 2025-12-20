import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// 라이선스 키 생성
function generateLicenseKey(): string {
  const segments = [];
  for (let i = 0; i < 4; i++) {
    const segment = crypto.randomBytes(4).toString('hex').toUpperCase();
    segments.push(segment);
  }
  return segments.join('-');
}

export async function POST(request: NextRequest) {
  try {
    const { tier, expiresAt, maxDevices, features, userId } = await request.json();

    if (!tier || !['free', 'pro', 'enterprise'].includes(tier)) {
      return NextResponse.json(
        { error: '올바른 구독 티어를 선택하세요.' },
        { status: 400 }
      );
    }

    // 라이선스 키 생성 (중복 확인)
    let licenseKey: string;
    let exists = true;
    while (exists) {
      licenseKey = generateLicenseKey();
      const existing = await prisma.subscriptionLicense.findUnique({
        where: { licenseKey },
      });
      exists = !!existing;
    }

    // 라이선스 생성
    const license = await prisma.subscriptionLicense.create({
      data: {
        licenseKey: licenseKey!,
        userId: userId || null,
        tier,
        status: 'active',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxDevices: maxDevices || 1,
        features: features || {},
        metadata: {},
      },
    });

    return NextResponse.json({
      success: true,
      license: {
        id: license.id,
        licenseKey: license.licenseKey,
        tier: license.tier,
        expiresAt: license.expiresAt,
        maxDevices: license.maxDevices,
      },
    });
  } catch (error: any) {
    console.error('라이선스 생성 오류:', error);
    return NextResponse.json(
      { error: '라이선스 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

