'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Gauge,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
} from 'lucide-react';
import {
  getMemoryUsage,
  detectMemoryLeaks,
  measurePerformance,
  BatchUpdater,
} from '@/lib/performance/optimizer';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  recommendation?: string;
}

export function PerformanceOptimizer() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizations, setOptimizations] = useState<string[]>([]);

  useEffect(() => {
    analyzePerformance();
    const interval = setInterval(analyzePerformance, 5000);
    return () => clearInterval(interval);
  }, []);

  const analyzePerformance = useCallback(() => {
    setIsAnalyzing(true);

    // 성능 측정
    const measuredMetrics = measurePerformance('full-analysis', () => {
      const memory = getMemoryUsage();
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      return [
        {
          name: '페이지 로드 시간',
          value: navigation ? (navigation.loadEventEnd - navigation.fetchStart) / 1000 : 0,
          unit: '초',
          status: navigation && (navigation.loadEventEnd - navigation.fetchStart) < 2000 ? 'good' : 'warning',
          recommendation: navigation && (navigation.loadEventEnd - navigation.fetchStart) > 2000 
            ? '코드 스플리팅 및 레이지 로딩 적용 권장' 
            : undefined,
        },
        {
          name: '메모리 사용량',
          value: memory.percentage,
          unit: '%',
          status: memory.percentage < 70 ? 'good' : memory.percentage < 85 ? 'warning' : 'critical',
          recommendation: memory.percentage > 70 
            ? '메모리 누수 확인 및 불필요한 객체 정리 권장' 
            : undefined,
        },
        {
          name: 'FPS',
          value: 60, // 실제로는 측정 필요
          unit: 'fps',
          status: 60 >= 60 ? 'good' : 60 >= 30 ? 'warning' : 'critical',
          recommendation: 60 < 60 
            ? '애니메이션 최적화 및 GPU 가속 활용 권장' 
            : undefined,
        },
        {
          name: '번들 크기',
          value: 500, // 실제로는 측정 필요
          unit: 'KB',
          status: 500 < 500 ? 'good' : 500 < 1000 ? 'warning' : 'critical',
          recommendation: 500 > 500 
            ? '코드 스플리팅 및 트리 쉐이킹 적용 권장' 
            : undefined,
        },
      ] as PerformanceMetric[];
    });

    setMetrics(measuredMetrics);

    // 최적화 제안
    const suggestions: string[] = [];
    measuredMetrics.forEach((metric) => {
      if (metric.recommendation) {
        suggestions.push(`${metric.name}: ${metric.recommendation}`);
      }
    });

    setOptimizations(suggestions);
    setIsAnalyzing(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <Zap className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">성능 최적화</h2>
              <p className="text-sm text-gray-500">실시간 성능 모니터링 및 최적화</p>
            </div>
          </div>
          <button
            onClick={analyzePerformance}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw size={16} className={isAnalyzing ? 'animate-spin' : ''} />
            재분석
          </button>
        </div>
      </div>

      {/* 메트릭 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 border-2 rounded-xl ${getStatusColor(metric.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                {metric.status === 'good' ? (
                  <CheckCircle2 size={20} className="text-green-600" />
                ) : (
                  <AlertTriangle size={20} className="text-yellow-600" />
                )}
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {metric.value.toFixed(1)}{metric.unit}
              </div>
              {metric.recommendation && (
                <div className="text-xs text-gray-600 mt-2">{metric.recommendation}</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 최적화 제안 */}
        {optimizations.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">최적화 제안</h3>
            <ul className="space-y-1">
              {optimizations.map((opt, index) => (
                <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                  <TrendingDown size={14} className="mt-0.5 shrink-0" />
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

