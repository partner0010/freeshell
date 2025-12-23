/**
 * 관리자 대시보드 통계 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 실제 데이터 조회
    const [
      totalUsers,
      activeUsers,
      todayContent,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 최근 30일
          },
        },
      }),
      // 오늘 생성된 콘텐츠는 추후 구현
      Promise.resolve(0),
    ]);

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalProjects: 0, // 추후 구현
      activeProjects: 0, // 추후 구현
      todayContent,
      systemStatus: '정상',
    });
  } catch (error) {
    console.error('Admin stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

