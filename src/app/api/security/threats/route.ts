/**
 * 위협 감지 통계 API
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

    const logs = await aiSecurityGuard.getSecurityLogs({ limit: 1000 });
    
    // 통계 계산
    const stats = {
      total: logs.length,
      bySeverity: {
        critical: logs.filter(l => l.severity === 'critical').length,
        high: logs.filter(l => l.severity === 'high').length,
        medium: logs.filter(l => l.severity === 'medium').length,
        low: logs.filter(l => l.severity === 'low').length,
      },
      byThreatType: logs.reduce((acc, log) => {
        if (log.threatType) {
          acc[log.threatType] = (acc[log.threatType] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
      byAction: {
        blocked: logs.filter(l => l.action === 'blocked').length,
        monitored: logs.filter(l => l.action === 'monitored').length,
        allowed: logs.filter(l => l.action === 'allowed').length,
      },
      recent: logs.filter(l => {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return l.timestamp >= oneHourAgo;
      }).length,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Security threats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

