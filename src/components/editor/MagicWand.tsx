'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2,
  Sparkles,
  Palette,
  Type,
  Layout,
  Zap,
  RefreshCw,
  Check,
  ArrowRight,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: 'color' | 'typography' | 'layout' | 'performance';
  impact: 'high' | 'medium' | 'low';
  preview?: string;
}

const suggestions: Suggestion[] = [
  {
    id: '1',
    title: '대비 개선',
    description: '텍스트와 배경의 대비를 높여 가독성을 개선하세요',
    category: 'color',
    impact: 'high',
  },
  {
    id: '2',
    title: '여백 최적화',
    description: '콘텐츠 간 여백을 균일하게 조정하세요',
    category: 'layout',
    impact: 'medium',
  },
  {
    id: '3',
    title: '폰트 크기 조정',
    description: '모바일에서 더 읽기 쉽도록 폰트 크기를 키우세요',
    category: 'typography',
    impact: 'medium',
  },
  {
    id: '4',
    title: '이미지 최적화',
    description: '이미지를 압축하여 로딩 속도를 개선하세요',
    category: 'performance',
    impact: 'high',
  },
  {
    id: '5',
    title: 'CTA 강조',
    description: '액션 버튼을 더 눈에 띄게 만드세요',
    category: 'color',
    impact: 'high',
  },
  {
    id: '6',
    title: '정렬 통일',
    description: '텍스트 정렬을 일관되게 유지하세요',
    category: 'layout',
    impact: 'low',
  },
];

const categoryConfig = {
  color: { icon: Palette, color: 'bg-pink-100 text-pink-600' },
  typography: { icon: Type, color: 'bg-blue-100 text-blue-600' },
  layout: { icon: Layout, color: 'bg-purple-100 text-purple-600' },
  performance: { icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
};

const impactColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

export default function MagicWand() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [isApplying, setIsApplying] = useState(false);

  const analyze = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
    setAnalyzed(true);
  };

  const toggleSuggestion = (id: string) => {
    setSelectedSuggestions(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedSuggestions.length === suggestions.length) {
      setSelectedSuggestions([]);
    } else {
      setSelectedSuggestions(suggestions.map(s => s.id));
    }
  };

  const applySelected = async () => {
    setIsApplying(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsApplying(false);
    // 적용 완료 후 처리
  };

  const score = analyzed ? 72 : 0;
  const improvedScore = score + (selectedSuggestions.length * 5);

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Wand2 size={18} />
          마법 지팡이
        </h3>
        <p className="text-sm text-white/80 mt-1">AI가 디자인을 분석하고 개선점을 제안합니다</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 분석 버튼 */}
        {!analyzed && (
          <div className="text-center py-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mb-6">
              <Wand2 size={48} className="text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">디자인 분석</h3>
            <p className="text-gray-500 mb-6">
              AI가 현재 디자인을 분석하고<br />개선할 수 있는 부분을 찾아드립니다
            </p>
            <button
              onClick={analyze}
              disabled={isAnalyzing}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  분석 중...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  마법 분석 시작
                </>
              )}
            </button>
          </div>
        )}

        {/* 분석 결과 */}
        {analyzed && (
          <>
            {/* 점수 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center">
              <p className="text-sm text-gray-500 mb-2">현재 디자인 점수</p>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-5xl font-bold text-purple-600">{score}</div>
                {selectedSuggestions.length > 0 && (
                  <>
                    <ArrowRight className="text-gray-400" />
                    <div className="text-5xl font-bold text-green-600">{improvedScore}</div>
                  </>
                )}
              </div>
              {selectedSuggestions.length > 0 && (
                <p className="text-sm text-green-600 flex items-center justify-center gap-1">
                  <TrendingUp size={14} />
                  {improvedScore - score}점 개선 예상
                </p>
              )}
            </div>

            {/* 제안 목록 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500">개선 제안 ({suggestions.length}개)</p>
                <button
                  onClick={selectAll}
                  className="text-xs text-primary-600 hover:underline"
                >
                  {selectedSuggestions.length === suggestions.length ? '전체 해제' : '전체 선택'}
                </button>
              </div>
              <div className="space-y-2">
                {suggestions.map((suggestion) => {
                  const config = categoryConfig[suggestion.category];
                  const isSelected = selectedSuggestions.includes(suggestion.id);
                  
                  return (
                    <motion.div
                      key={suggestion.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => toggleSuggestion(suggestion.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                          <config.icon size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-800">{suggestion.title}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${impactColors[suggestion.impact]}`}>
                              {suggestion.impact === 'high' ? '높음' : suggestion.impact === 'medium' ? '보통' : '낮음'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{suggestion.description}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'bg-primary-500 border-primary-500'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && <Check size={14} className="text-white" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 팁 */}
            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Lightbulb size={20} className="text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">프로 팁</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    높음 영향도의 제안을 먼저 적용하면 가장 큰 효과를 볼 수 있어요!
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 적용 버튼 */}
      {analyzed && selectedSuggestions.length > 0 && (
        <div className="p-4 border-t">
          <button
            onClick={applySelected}
            disabled={isApplying}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
          >
            {isApplying ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                적용 중...
              </>
            ) : (
              <>
                <Wand2 size={18} />
                {selectedSuggestions.length}개 개선 적용
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

