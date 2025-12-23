/**
 * 트렌드 수집 API
 * 수동으로 트렌드 수집 트리거
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { autoLearningSystem } from '@/lib/trends/auto-learning-system';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const suggestions = await autoLearningSystem.collectTrends();

    return NextResponse.json({
      success: true,
      count: suggestions.length,
      suggestions: suggestions.slice(0, 10), // 최신 10개만 반환
    });
  } catch (error) {
    console.error('Trend collection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

