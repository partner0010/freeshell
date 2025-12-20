import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { licenseKey, deviceId } = await request.json();

    if (!licenseKey) {
      return NextResponse.json(
        { error: '라이선스 키를 입력하세요.' },
        { status: 400 }
      );
    }

    // 라이선스 조회
    const license = await prisma.subscriptionLicense.findUnique({
      where: { licenseKey },
      include: { user: true },
    });

    if (!license) {
      return NextResponse.json(
        { error: '유효하지 않은 라이선스 키입니다.' },
        { status: 404 }
      );
    }

    // 상태 확인
    if (license.status !== 'active') {
      return NextResponse.json(
        { error: `라이선스가 ${license.status === 'expired' ? '만료되었습니다' : '비활성화되었습니다'}.` },
        { status: 400 }
      );
    }

    // 만료 확인
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      await prisma.subscriptionLicense.update({
        where: { id: license.id },
        data: { status: 'expired' },
      });
      return NextResponse.json(
        { error: '라이선스가 만료되었습니다.' },
        { status: 400 }
      );
    }

    // 기기 수 확인
    if (deviceId) {
      const usageCount = await prisma.licenseUsage.count({
        where: { licenseId: license.id },
      });

      if (usageCount >= license.maxDevices) {
        // 기존 사용 기록 확인
        const existingUsage = await prisma.licenseUsage.findUnique({
          where: {
            licenseId_deviceId: {
              licenseId: license.id,
              deviceId,
            },
          },
        });

        if (!existingUsage) {
          return NextResponse.json(
            { error: `최대 ${license.maxDevices}개의 기기에서만 사용할 수 있습니다.` },
            { status: 400 }
          );
        }
      }

      // 사용 기록 업데이트/생성
      await prisma.licenseUsage.upsert({
        where: {
          licenseId_deviceId: {
            licenseId: license.id,
            deviceId,
          },
        },
        update: {
          lastUsedAt: new Date(),
        },
        create: {
          licenseId: license.id,
          deviceId,
          lastUsedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      license: {
        tier: license.tier,
        expiresAt: license.expiresAt,
        maxDevices: license.maxDevices,
        features: license.features,
      },
    });
  } catch (error: any) {
    console.error('라이선스 검증 오류:', error);
    return NextResponse.json(
      { error: '라이선스 검증 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

