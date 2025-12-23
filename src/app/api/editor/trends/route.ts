/**
 * 에디터 트렌드 기능 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { trendFeaturesManager } from '@/lib/editor/trend-features';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');

    let features = trendFeaturesManager.getAllFeatures();

    if (category) {
      features = features.filter(f => f.category === category);
    }

    if (priority) {
      features = features.filter(f => f.priority === priority);
    }

    if (status) {
      features = features.filter(f => f.status === status);
    }

    return NextResponse.json({
      success: true,
      features,
    });
  } catch (error: any) {
    console.error('트렌드 기능 조회 오류:', error);
    return NextResponse.json(
      { error: '트렌드 기능 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

