/**
 * 성능 최적화 컴포넌트
 * 코드 분할, 지연 로딩, 이미지 최적화
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Zap, CheckCircle, AlertCircle } from 'lucide-react';

export function PerformanceOptimizer() {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    resourceCount: 0,
    totalSize: 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const perfData = window.performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      const renderTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
      
      const resources = window.performance.getEntriesByType('resource');
      const totalSize = resources.reduce((sum, resource: any) => {
        return sum + (resource.transferSize || 0);
      }, 0);

      setMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(renderTime),
        resourceCount: resources.length,
        totalSize: Math.round(totalSize / 1024), // KB
      });
    }
  }, []);

  const getPerformanceGrade = (loadTime: number) => {
    if (loadTime < 1000) return { grade: 'A+', color: 'green' };
    if (loadTime < 2000) return { grade: 'A', color: 'green' };
    if (loadTime < 3000) return { grade: 'B', color: 'yellow' };
    if (loadTime < 5000) return { grade: 'C', color: 'orange' };
    return { grade: 'D', color: 'red' };
  };

  const grade = getPerformanceGrade(metrics.loadTime);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Zap className="text-yellow-600" size={24} />
        <div>
          <h3 className="font-bold text-gray-900">성능 모니터링</h3>
          <p className="text-sm text-gray-600">실시간 성능 지표</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">로딩 시간</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.loadTime}ms</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-bold text-${grade.color}-600 bg-${grade.color}-100`}>
            {grade.grade}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">렌더링 시간</p>
            <p className="text-xl font-bold text-gray-900">{metrics.renderTime}ms</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">리소스 수</p>
            <p className="text-xl font-bold text-gray-900">{metrics.resourceCount}</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">총 전송 크기</p>
          <p className="text-xl font-bold text-gray-900">{metrics.totalSize} KB</p>
        </div>

        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">최적화 팁</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>이미지 최적화 및 지연 로딩 사용</li>
              <li>코드 분할 및 트리 쉐이킹</li>
              <li>CDN 활용으로 리소스 로딩 속도 향상</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
