/**
 * 트렌드 제안 API
 * 관리자 대시보드에서 트렌드 제안 조회 및 관리
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { autoLearningSystem } from '@/lib/trends/auto-learning-system';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as any;
    const priority = searchParams.get('priority') as any;
    const status = searchParams.get('status') as any;
    const limit = parseInt(searchParams.get('limit') || '50');

    const suggestions = autoLearningSystem.getSuggestions({
      category,
      priority,
      status,
      limit,
    });

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Trends suggestions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, adminNotes } = body;

    await autoLearningSystem.updateSuggestionStatus(id, status, adminNotes);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update suggestion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

