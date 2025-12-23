/**
 * 데이터 유출 보고서 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { aiSecurityGuard } from '@/lib/security/ai-security-guard';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const reports = await aiSecurityGuard.getDataBreachReports();

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Security breaches API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

