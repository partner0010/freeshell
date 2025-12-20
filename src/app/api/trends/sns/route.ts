import { NextRequest, NextResponse } from 'next/server';
import { updateTrends } from '@/lib/trends/sns-monitor';

export async function GET(request: NextRequest) {
  try {
    const analysis = await updateTrends();
    
    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error('SNS 트렌드 조회 오류:', error);
    return NextResponse.json(
      { error: '트렌드 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

