import { NextRequest, NextResponse } from 'next/server';
import { PerformanceMonitor } from '@/lib/performance/performance-monitor';

export async function GET(request: NextRequest) {
  try {
    const monitor = new PerformanceMonitor();
    const metrics = monitor.collectMetrics();
    const report = monitor.generateReport(metrics);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('성능 분석 오류:', error);
    return NextResponse.json(
      { error: '성능 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

