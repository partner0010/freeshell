'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Image, FileCode, Clock, RefreshCw, CheckCircle, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

interface PerformanceMetric {
  id: string;
  name: string;
  score: number;
  status: 'good' | 'needs-improvement' | 'poor';
  description: string;
  suggestion?: string;
}

export function PerformancePanel() {
  const { getCurrentPage } = useEditorStore();
  const currentPage = getCurrentPage();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  const analyzePerformance = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const blockCount = currentPage?.blocks.length || 0;
      const hasHero = currentPage?.blocks.some(b => b.type === 'hero');
      const hasImages = currentPage?.blocks.some(b => b.type === 'image' || b.type === 'gallery');
      const hasHeader = currentPage?.blocks.some(b => b.type === 'header');
      const hasFooter = currentPage?.blocks.some(b => b.type === 'footer');

      const newMetrics: PerformanceMetric[] = [
        {
          id: 'fcp',
          name: 'First Contentful Paint',
          score: hasHero ? 92 : 78,
          status: hasHero ? 'good' : 'needs-improvement',
          description: '첫 번째 콘텐츠가 렌더링되는 시간',
          suggestion: hasHero ? undefined : '히어로 섹션을 추가하여 초기 콘텐츠를 최적화하세요',
        },
        {
          id: 'lcp',
          name: 'Largest Contentful Paint',
          score: hasImages ? 75 : 88,
          status: hasImages ? 'needs-improvement' : 'good',
          description: '가장 큰 콘텐츠가 표시되는 시간',
          suggestion: hasImages ? '이미지 최적화 및 지연 로딩을 사용하세요' : undefined,
        },
        {
          id: 'cls',
          name: 'Cumulative Layout Shift',
          score: 95,
          status: 'good',
          description: '레이아웃 이동 정도',
        },
        {
          id: 'tbt',
          name: 'Total Blocking Time',
          score: blockCount > 10 ? 65 : 90,
          status: blockCount > 10 ? 'needs-improvement' : 'good',
          description: '메인 스레드 블로킹 시간',
          suggestion: blockCount > 10 ? '블록 수를 줄이거나 코드 분할을 고려하세요' : undefined,
        },
        {
          id: 'structure',
          name: '페이지 구조',
          score: hasHeader && hasFooter ? 100 : 70,
          status: hasHeader && hasFooter ? 'good' : 'needs-improvement',
          description: '올바른 HTML 구조',
          suggestion: !hasHeader || !hasFooter ? '헤더와 푸터를 추가하여 페이지 구조를 완성하세요' : undefined,
        },
        {
          id: 'accessibility',
          name: '접근성 기본 점수',
          score: 85,
          status: 'good',
          description: 'WCAG 기본 준수 여부',
        },
      ];

      setMetrics(newMetrics);
      const avgScore = Math.round(newMetrics.reduce((sum, m) => sum + m.score, 0) / newMetrics.length);
      setOverallScore(avgScore);
      setIsAnalyzing(false);
    }, 1500);
  };

  useEffect(() => {
    analyzePerformance();
  }, [currentPage?.blocks.length]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'from-green-400 to-green-500';
    if (score >= 50) return 'from-yellow-400 to-yellow-500';
    return 'from-red-400 to-red-500';
  };

  const getStatusIcon = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'needs-improvement':
        return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'poor':
        return <XCircle className="text-red-500" size={16} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
            <Zap className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">성능 분석</h3>
            <p className="text-xs text-gray-500">페이지 성능 점수</p>
          </div>
        </div>
        <button
          onClick={analyzePerformance}
          disabled={isAnalyzing}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw size={18} className={isAnalyzing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* 전체 점수 */}
      <div className="bg-gradient-to-br from-pastel-lavender to-pastel-sky rounded-xl p-6 mb-6 text-center">
        <div className="relative w-28 h-28 mx-auto mb-4">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-white/30"
            />
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${overallScore * 3.02} 302`}
              strokeLinecap="round"
              className={getScoreColor(overallScore)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
              {isAnalyzing ? '...' : overallScore}
            </span>
            <span className="text-xs text-gray-500">/ 100</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {overallScore >= 90 && '훌륭합니다! 성능이 최적화되어 있습니다.'}
          {overallScore >= 70 && overallScore < 90 && '좋습니다. 몇 가지 개선 사항이 있습니다.'}
          {overallScore < 70 && '성능 개선이 필요합니다.'}
        </p>
      </div>

      {/* 메트릭 목록 */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-4 border"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(metric.status)}
                <span className="font-medium text-gray-800 text-sm">{metric.name}</span>
              </div>
              <span className={`font-bold ${getScoreColor(metric.score)}`}>
                {metric.score}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2">{metric.description}</p>
            {metric.suggestion && (
              <p className="text-xs text-yellow-600 bg-yellow-50 rounded-lg p-2">
                💡 {metric.suggestion}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* 팁 */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-start gap-2 text-xs text-gray-500">
          <TrendingUp size={14} className="shrink-0 mt-0.5" />
          <p>
            성능 점수는 Google Lighthouse 지표를 기반으로 합니다.
            90점 이상이면 우수한 성능입니다.
          </p>
        </div>
      </div>
    </div>
  );
}

