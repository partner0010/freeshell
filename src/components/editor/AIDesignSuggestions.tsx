'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Layout,
  Palette,
  Eye,
  Check,
  X,
  RefreshCw,
  Zap,
  TrendingUp,
  Lightbulb,
  Download,
  Copy,
} from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

interface DesignVariant {
  id: string;
  name: string;
  description: string;
  preview: string; // base64 또는 URL
  styles: {
    colorScheme: string;
    typography: string;
    spacing: string;
    borderRadius: string;
    shadows: string;
  };
  blocks: any[];
  score: number; // 0-100
  tags: string[];
}

export function AIDesignSuggestions() {
  const { project, getCurrentPage, updateGlobalStyles, addBlock, updateBlock } = useEditorStore();
  const [suggestions, setSuggestions] = useState<DesignVariant[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<DesignVariant | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);

  // 현재 페이지 분석 및 디자인 제안 생성
  const analyzeAndSuggest = async () => {
    setIsAnalyzing(true);
    const currentPage = getCurrentPage();
    
    // AI 기반 디자인 분석 (실제로는 AI API 호출)
    // 여기서는 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const variants: DesignVariant[] = [
      {
        id: 'variant-1',
        name: '모던 미니멀',
        description: '깔끔하고 심플한 디자인으로 사용자 집중도 향상',
        preview: '',
        styles: {
          colorScheme: '단색 + 포인트 컬러',
          typography: 'Inter, 간결한 폰트',
          spacing: '넓은 여백',
          borderRadius: '둥근 모서리 (12px)',
          shadows: '부드러운 그림자',
        },
        blocks: [],
        score: 92,
        tags: ['모던', '미니멀', '깔끔'],
      },
      {
        id: 'variant-2',
        name: '다크 테마',
        description: '다크 모드를 적용한 현대적인 디자인',
        preview: '',
        styles: {
          colorScheme: '다크 배경 + 밝은 텍스트',
          typography: 'Roboto, 가독성 중심',
          spacing: '적당한 여백',
          borderRadius: '적당한 모서리 (8px)',
          shadows: '글로우 효과',
        },
        blocks: [],
        score: 88,
        tags: ['다크', '모던', '프리미엄'],
      },
      {
        id: 'variant-3',
        name: '컬러풀 그라디언트',
        description: '역동적인 그라디언트로 시각적 임팩트 강화',
        preview: '',
        styles: {
          colorScheme: '그라디언트 배경',
          typography: 'Poppins, 활기찬 폰트',
          spacing: '균형잡힌 여백',
          borderRadius: '둥근 모서리 (16px)',
          shadows: '컬러풀한 그림자',
        },
        blocks: [],
        score: 85,
        tags: ['컬러풀', '역동적', '트렌디'],
      },
      {
        id: 'variant-4',
        name: '클래식 엘레강트',
        description: '전통적인 우아함과 현대적인 요소의 조화',
        preview: '',
        styles: {
          colorScheme: '중성색 + 악센트',
          typography: 'Playfair Display, 세리프',
          spacing: '넉넉한 여백',
          borderRadius: '약한 모서리 (4px)',
          shadows: '정교한 그림자',
        },
        blocks: [],
        score: 90,
        tags: ['클래식', '우아', '프리미엄'],
      },
    ];

    // 프리뷰 이미지 생성 (실제로는 캔버스를 사용하여 생성)
    variants.forEach((variant) => {
      variant.preview = generatePreview(variant);
    });

    setSuggestions(variants);
    setIsAnalyzing(false);
  };

  // 프리뷰 이미지 생성
  const generatePreview = (variant: DesignVariant): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';

    // 배경
    if (variant.id === 'variant-2') {
      ctx.fillStyle = '#1a1a1a';
    } else if (variant.id === 'variant-3') {
      const gradient = ctx.createLinearGradient(0, 0, 400, 300);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = '#ffffff';
    }
    ctx.fillRect(0, 0, 400, 300);

    // 텍스트
    ctx.fillStyle = variant.id === 'variant-2' ? '#ffffff' : '#1a1a1a';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(variant.name, 200, 150);

    return canvas.toDataURL('image/png');
  };

  // 디자인 적용
  const applyDesign = (variant: DesignVariant) => {
    if (!project) return;

    // 글로벌 스타일 적용
    updateGlobalStyles({
      primaryColor: variant.id === 'variant-3' ? '#667eea' : '#8B5CF6',
      fontFamily: variant.styles.typography.split(',')[0],
      borderRadius: variant.styles.borderRadius.includes('12') ? '12px' : 
                   variant.styles.borderRadius.includes('16') ? '16px' : '8px',
    });

    // 블록 스타일 업데이트
    const currentPage = getCurrentPage();
    if (currentPage) {
      currentPage.blocks.forEach((block) => {
        updateBlock(block.id, {
          styles: {
            ...block.styles,
            // variant에 맞는 스타일 적용
          },
        });
      });
    }

    setSelectedVariant(null);
    alert(`${variant.name} 디자인이 적용되었습니다!`);
  };

  // 비교 모드
  const toggleComparison = () => {
    setComparisonMode(!comparisonMode);
    if (!comparisonMode) {
      setSelectedVariant(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">AI 디자인 제안</h2>
              <p className="text-sm text-gray-500">AI가 제안하는 최적의 디자인 대안들</p>
            </div>
          </div>
          <button
            onClick={toggleComparison}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              comparisonMode
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye size={16} className="inline mr-2" />
            비교 모드
          </button>
        </div>

        <button
          onClick={analyzeAndSuggest}
          disabled={isAnalyzing}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              AI 분석 중...
            </>
          ) : (
            <>
              <Zap size={20} />
              디자인 제안 받기
            </>
          )}
        </button>
      </div>

      {/* 제안 목록 */}
      <div className="flex-1 overflow-auto p-6">
        {suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Lightbulb className="text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg mb-2">디자인 제안을 받아보세요</p>
            <p className="text-gray-400 text-sm">
              현재 페이지를 분석하여 최적의 디자인 대안을 제안합니다
            </p>
          </div>
        ) : comparisonMode ? (
          // 비교 모드
          <div className="grid grid-cols-2 gap-4">
            {suggestions.map((variant) => (
              <motion.div
                key={variant.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 transition-all cursor-pointer"
                onClick={() => setSelectedVariant(variant)}
              >
                <div className="aspect-video bg-gray-100 relative">
                  {variant.preview ? (
                    <img
                      src={variant.preview}
                      alt={variant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Layout className="text-gray-400" size={48} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <span className="text-sm font-bold text-primary-600">{variant.score}점</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">{variant.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{variant.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {variant.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // 목록 모드
          <div className="space-y-4">
            {suggestions.map((variant, index) => (
              <motion.div
                key={variant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 transition-all"
              >
                <div className="flex">
                  {/* 프리뷰 */}
                  <div className="w-64 aspect-video bg-gray-100 relative shrink-0">
                    {variant.preview ? (
                      <img
                        src={variant.preview}
                        alt={variant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Layout className="text-gray-400" size={48} />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <span className="text-sm font-bold text-primary-600">{variant.score}점</span>
                    </div>
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{variant.name}</h3>
                        <p className="text-sm text-gray-600">{variant.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="text-green-500" size={20} />
                        <span className="text-lg font-bold text-green-600">
                          +{variant.score - 70}%
                        </span>
                      </div>
                    </div>

                    {/* 스타일 상세 */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <span className="text-xs text-gray-500">색상 스키마</span>
                        <p className="text-sm font-medium text-gray-800">
                          {variant.styles.colorScheme}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">타이포그래피</span>
                        <p className="text-sm font-medium text-gray-800">
                          {variant.styles.typography}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">여백</span>
                        <p className="text-sm font-medium text-gray-800">
                          {variant.styles.spacing}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">스타일</span>
                        <p className="text-sm font-medium text-gray-800">
                          {variant.styles.borderRadius}, {variant.styles.shadows}
                        </p>
                      </div>
                    </div>

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {variant.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-primary-50 text-primary-700 text-xs rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedVariant(variant)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                      >
                        <Eye size={16} />
                        미리보기
                      </button>
                      <button
                        onClick={() => applyDesign(variant)}
                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Check size={16} />
                        이 디자인 적용
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 미리보기 모달 */}
      <AnimatePresence>
        {selectedVariant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelectedVariant(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedVariant.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{selectedVariant.description}</p>
                </div>
                <button
                  onClick={() => setSelectedVariant(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              {/* 프리뷰 */}
              <div className="flex-1 overflow-auto p-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                  {selectedVariant.preview ? (
                    <img
                      src={selectedVariant.preview}
                      alt={selectedVariant.name}
                      className="w-full rounded-xl shadow-2xl"
                    />
                  ) : (
                    <div className="aspect-video bg-white rounded-xl flex items-center justify-center">
                      <Layout className="text-gray-400" size={64} />
                    </div>
                  )}
                </div>
              </div>

              {/* 푸터 */}
              <div className="p-6 border-t flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {selectedVariant.score}
                    </div>
                    <div className="text-xs text-gray-500">점수</div>
                  </div>
                  <div className="h-12 w-px bg-gray-200" />
                  <div>
                    <div className="text-sm text-gray-500">추천 이유</div>
                    <div className="text-sm font-medium text-gray-800">
                      {selectedVariant.description}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    applyDesign(selectedVariant);
                    setSelectedVariant(null);
                  }}
                  className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium flex items-center gap-2 transition-colors"
                >
                  <Check size={20} />
                  이 디자인 적용하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

