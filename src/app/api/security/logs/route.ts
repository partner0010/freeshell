/**
 * 보안 로그 API
 * 관리자 대시보드에서 보안 로그 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { aiSecurityGuard } from '@/lib/security/ai-security-guard';

export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const severity = searchParams.get('severity') as 'low' | 'medium' | 'high' | 'critical' | null;
    const threatType = searchParams.get('threatType') as any;
    const ip = searchParams.get('ip');
    const limit = parseInt(searchParams.get('limit') || '100');

    const logs = await aiSecurityGuard.getSecurityLogs({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      severity: severity || undefined,
      threatType,
      ip: ip || undefined,
      limit,
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Security logs API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

