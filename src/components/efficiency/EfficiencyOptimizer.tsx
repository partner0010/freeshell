'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  TrendingUp,
  Activity,
  Database,
  Search,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import {
  globalCache,
  type CacheStats,
} from '@/lib/efficiency/smart-cache';
import {
  bundleOptimizer,
  type BundleAnalysis,
} from '@/lib/efficiency/bundle-optimizer';

export function EfficiencyOptimizer() {
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [bundleAnalysis, setBundleAnalysis] = useState<BundleAnalysis | null>(null);
  const [optimizations, setOptimizations] = useState<string[]>([]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setCacheStats(globalCache.getStats());
    
    // 번들 분석 시뮬레이션
    const analysis = bundleOptimizer.analyzeBundle([
      {
        name: 'main',
        size: 500 * 1024,
        modules: ['app', 'components'],
        loadTime: 1200,
      },
      {
        name: 'vendor',
        size: 300 * 1024,
        modules: ['react', 'framer-motion'],
        loadTime: 800,
      },
    ]);
    setBundleAnalysis(analysis);

    // 최적화 제안
    const suggestions: string[] = [];
    if (cacheStats && cacheStats.hitRate < 70) {
      suggestions.push('캐시 히트율이 낮습니다. TTL을 조정하세요.');
    }
    if (analysis.totalSize > 500 * 1024) {
      suggestions.push('번들 크기를 줄이기 위해 코드 스플리팅을 적용하세요.');
    }
    setOptimizations(suggestions);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center">
            <Zap className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">효율성 최적화</h2>
            <p className="text-sm text-gray-500">캐싱, 번들, 성능 최적화</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* 캐시 통계 */}
        {cacheStats && (
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Database size={20} />
              캐시 성능
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="text-sm text-gray-500 mb-1">히트율</div>
                <div className="text-2xl font-bold text-blue-600">
                  {cacheStats.hitRate.toFixed(1)}%
                </div>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="text-sm text-gray-500 mb-1">히트</div>
                <div className="text-2xl font-bold text-green-600">{cacheStats.hits}</div>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="text-sm text-gray-500 mb-1">미스</div>
                <div className="text-2xl font-bold text-red-600">{cacheStats.misses}</div>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <div className="text-sm text-gray-500 mb-1">크기</div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatBytes(cacheStats.size)}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 번들 분석 */}
        {bundleAnalysis && (
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity size={20} />
              번들 분석
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-white border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">총 번들 크기</span>
                  <span className="text-2xl font-bold text-gray-800">
                    {formatBytes(bundleAnalysis.totalSize)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white border rounded-xl">
                <div className="font-semibold text-gray-800 mb-3">청크 정보</div>
                <div className="space-y-2">
                  {bundleAnalysis.chunks.map((chunk, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{chunk.name}</span>
                      <span className="font-medium">{formatBytes(chunk.size)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {bundleAnalysis.duplicates.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="font-semibold text-yellow-800 mb-2">
                    중복 모듈 ({bundleAnalysis.duplicates.length}개)
                  </div>
                  <div className="text-sm text-yellow-700">
                    {bundleAnalysis.duplicates.slice(0, 5).join(', ')}
                    {bundleAnalysis.duplicates.length > 5 && '...'}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 최적화 제안 */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            최적화 제안
          </h3>
          {optimizations.length === 0 ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="text-green-600" size={24} />
              <span className="text-green-800">최적화가 잘 되어 있습니다!</span>
            </div>
          ) : (
            <div className="space-y-2">
              {optimizations.map((opt, i) => (
                <div key={i} className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-sm text-blue-800">• {opt}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

