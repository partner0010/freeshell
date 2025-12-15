'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Gauge, Zap, TrendingUp, AlertCircle } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  fps: number;
  memoryUsage?: number;
  domNodes: number;
  networkRequests: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
}

export function PreviewPerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 성능 메트릭 수집
    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      const fidEntries = performance.getEntriesByType('first-input');
      const clsEntries = performance.getEntriesByType('layout-shift');

      const newMetrics: PerformanceMetrics = {
        loadTime: navigation ? Math.round(navigation.loadEventEnd - navigation.fetchStart) : 0,
        renderTime: paint.find((p) => p.name === 'first-contentful-paint')
          ? Math.round(paint.find((p) => p.name === 'first-contentful-paint')!.startTime)
          : 0,
        fps: fps,
        memoryUsage: (performance as any).memory
          ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
          : undefined,
        domNodes: document.getElementsByTagName('*').length,
        networkRequests: performance.getEntriesByType('resource').length,
        largestContentfulPaint: lcpEntries.length > 0
          ? Math.round((lcpEntries[lcpEntries.length - 1] as any).renderTime || 0)
          : undefined,
        firstInputDelay: fidEntries.length > 0
          ? Math.round((fidEntries[0] as PerformanceEventTiming).processingStart - (fidEntries[0] as PerformanceEventTiming).startTime)
          : undefined,
        cumulativeLayoutShift: clsEntries.length > 0
          ? Math.round(
              clsEntries.reduce((sum, entry) => sum + ((entry as any).value || 0), 0) * 100
            ) / 100
          : undefined,
      };

      setMetrics(newMetrics);
    };

    // FPS 측정
    let lastTime = performance.now();
    let frames = 0;
    const fpsInterval = setInterval(() => {
      frames++;
      const currentTime = performance.now();
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frames * 1000) / (currentTime - lastTime)));
        frames = 0;
        lastTime = currentTime;
      }
    }, 100);

    // 초기 수집
    collectMetrics();

    // 주기적 업데이트
    const interval = setInterval(collectMetrics, 2000);

    // Performance Observer로 실시간 메트릭 수집
    if ('PerformanceObserver' in window) {
      // LCP 관찰
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          setMetrics((prev) =>
            prev
              ? {
                  ...prev,
                  largestContentfulPaint: Math.round(lastEntry.renderTime || 0),
                }
              : prev
          );
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observer not supported');
      }
    }

    return () => {
      clearInterval(interval);
      clearInterval(fpsInterval);
    };
  }, [fps]);

  if (!metrics) return null;

  const getPerformanceScore = (): { score: number; level: 'excellent' | 'good' | 'needs-improvement' | 'poor'; color: string } => {
    let score = 100;
    
    // LCP 점수 (2.5초 이하면 우수)
    if (metrics.largestContentfulPaint) {
      if (metrics.largestContentfulPaint > 4000) score -= 30;
      else if (metrics.largestContentfulPaint > 2500) score -= 15;
    }
    
    // FID 점수 (100ms 이하면 우수)
    if (metrics.firstInputDelay) {
      if (metrics.firstInputDelay > 300) score -= 30;
      else if (metrics.firstInputDelay > 100) score -= 15;
    }
    
    // CLS 점수 (0.1 이하면 우수)
    if (metrics.cumulativeLayoutShift) {
      if (metrics.cumulativeLayoutShift > 0.25) score -= 30;
      else if (metrics.cumulativeLayoutShift > 0.1) score -= 15;
    }
    
    // FPS 점수
    if (fps < 30) score -= 20;
    else if (fps < 50) score -= 10;

    if (score >= 90) return { score, level: 'excellent', color: 'text-green-600' };
    if (score >= 75) return { score, level: 'good', color: 'text-blue-600' };
    if (score >= 50) return { score, level: 'needs-improvement', color: 'text-yellow-600' };
    return { score, level: 'poor', color: 'text-red-600' };
  };

  const performanceScore = getPerformanceScore();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-6 left-6 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      {/* 헤더 */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Activity className="text-primary-600" size={18} />
          <span className="font-medium text-gray-800">성능 모니터</span>
          <span className={`text-sm font-bold ${performanceScore.color}`}>
            {performanceScore.score}/100
          </span>
        </div>
        <TrendingUp
          className={`text-gray-400 transition-transform ${showDetails ? 'rotate-180' : ''}`}
          size={16}
        />
      </button>

      {/* 상세 정보 */}
      {showDetails && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-gray-200"
        >
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {/* Core Web Vitals */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Core Web Vitals
              </h4>
              <div className="space-y-2">
                {metrics.largestContentfulPaint !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">LCP</span>
                    <span
                      className={`font-medium ${
                        metrics.largestContentfulPaint < 2500
                          ? 'text-green-600'
                          : metrics.largestContentfulPaint < 4000
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {metrics.largestContentfulPaint}ms
                    </span>
                  </div>
                )}
                {metrics.firstInputDelay !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">FID</span>
                    <span
                      className={`font-medium ${
                        metrics.firstInputDelay < 100
                          ? 'text-green-600'
                          : metrics.firstInputDelay < 300
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {metrics.firstInputDelay}ms
                    </span>
                  </div>
                )}
                {metrics.cumulativeLayoutShift !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">CLS</span>
                    <span
                      className={`font-medium ${
                        metrics.cumulativeLayoutShift < 0.1
                          ? 'text-green-600'
                          : metrics.cumulativeLayoutShift < 0.25
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {metrics.cumulativeLayoutShift.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 기타 메트릭 */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">메트릭</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Zap size={12} />
                    FPS
                  </span>
                  <span
                    className={`font-medium ${
                      fps >= 50 ? 'text-green-600' : fps >= 30 ? 'text-yellow-600' : 'text-red-600'
                    }`}
                  >
                    {fps}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Gauge size={12} />
                    로드 시간
                  </span>
                  <span className="font-medium text-gray-800">{metrics.loadTime}ms</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">DOM 노드</span>
                  <span className="font-medium text-gray-800">{metrics.domNodes}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">네트워크 요청</span>
                  <span className="font-medium text-gray-800">{metrics.networkRequests}</span>
                </div>
                {metrics.memoryUsage !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">메모리</span>
                    <span className="font-medium text-gray-800">{metrics.memoryUsage} MB</span>
                  </div>
                )}
              </div>
            </div>

            {/* 권장사항 */}
            {(performanceScore.level === 'needs-improvement' ||
              performanceScore.level === 'poor') && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-start gap-2 text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium mb-1">개선 권장</p>
                    <ul className="list-disc list-inside space-y-0.5 text-yellow-600">
                      {metrics.largestContentfulPaint && metrics.largestContentfulPaint > 2500 && (
                        <li>이미지 최적화가 필요합니다</li>
                      )}
                      {fps < 50 && <li>애니메이션 최적화가 필요합니다</li>}
                      {metrics.domNodes > 1000 && <li>DOM 구조를 단순화하세요</li>}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

