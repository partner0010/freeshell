'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Zap,
  Code,
  Palette,
  Eye,
  ArrowRight,
  X,
  RefreshCw,
  Download,
} from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

interface Improvement {
  id: string;
  category: 'performance' | 'seo' | 'accessibility' | 'design' | 'security' | 'ux';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  beforeAfter?: {
    before: string;
    after: string;
  };
  autoFixable: boolean;
  codeSuggestion?: string;
}

export function AIImprovementSuggestions() {
  const { project, getCurrentPage } = useEditorStore();
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImprovement, setSelectedImprovement] = useState<Improvement | null>(null);

  // 개선 사항 분석
  const analyzeImprovements = async () => {
    setIsAnalyzing(true);
    const currentPage = getCurrentPage();

    // 실제로는 AI API를 호출하여 분석
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const suggestions: Improvement[] = [
      {
        id: 'imp-1',
        category: 'performance',
        priority: 'high',
        title: '이미지 최적화 필요',
        description: '현재 페이지에 최적화되지 않은 대용량 이미지가 있습니다.',
        impact: '로딩 시간 40% 개선, Core Web Vitals 점수 향상',
        difficulty: 'easy',
        estimatedTime: '5분',
        autoFixable: true,
        codeSuggestion: 'WebP 포맷 사용, lazy loading 적용',
      },
      {
        id: 'imp-2',
        category: 'seo',
        priority: 'high',
        title: 'SEO 메타 태그 추가',
        description: '페이지에 메타 설명과 Open Graph 태그가 누락되어 있습니다.',
        impact: '검색 엔진 노출 60% 증가, 소셜 미디어 공유 품질 향상',
        difficulty: 'easy',
        estimatedTime: '3분',
        autoFixable: true,
        codeSuggestion: `
<meta name="description" content="페이지 설명">
<meta property="og:title" content="페이지 제목">
<meta property="og:description" content="페이지 설명">
        `,
      },
      {
        id: 'imp-3',
        category: 'accessibility',
        priority: 'high',
        title: '키보드 네비게이션 개선',
        description: '일부 인터랙티브 요소에 키보드 포커스가 없습니다.',
        impact: '접근성 점수 85점 → 95점, WCAG 2.1 AA 준수',
        difficulty: 'medium',
        estimatedTime: '10분',
        autoFixable: false,
      },
      {
        id: 'imp-4',
        category: 'design',
        priority: 'medium',
        title: '색상 대비 개선',
        description: '일부 텍스트와 배경의 색상 대비가 WCAG 기준에 미달합니다.',
        impact: '가독성 향상, 접근성 점수 +10점',
        difficulty: 'easy',
        estimatedTime: '5분',
        autoFixable: true,
        beforeAfter: {
          before: 'color: #999999',
          after: 'color: #333333',
        },
      },
      {
        id: 'imp-5',
        category: 'security',
        priority: 'high',
        title: '보안 헤더 추가',
        description: 'Content Security Policy 헤더가 최적화되지 않았습니다.',
        impact: '보안 점수 70점 → 95점, XSS 공격 방어 강화',
        difficulty: 'medium',
        estimatedTime: '15분',
        autoFixable: true,
      },
      {
        id: 'imp-6',
        category: 'ux',
        priority: 'medium',
        title: '로딩 상태 표시',
        description: '비동기 작업에 로딩 인디케이터가 없어 사용자가 대기 중임을 알 수 없습니다.',
        impact: '사용자 경험 향상, 이탈률 20% 감소',
        difficulty: 'easy',
        estimatedTime: '8분',
        autoFixable: false,
      },
    ];

    setImprovements(suggestions);
    setIsAnalyzing(false);
  };

  // 자동 적용
  const applyImprovement = async (improvement: Improvement) => {
    if (!improvement.autoFixable) {
      alert('이 개선사항은 수동으로 적용해야 합니다.');
      return;
    }

    // 실제로는 코드를 자동으로 수정
    // 여기서는 시뮬레이션
    const updated = improvements.map((imp) =>
      imp.id === improvement.id ? { ...imp, applied: true } : imp
    );
    setImprovements(updated);

    alert(`${improvement.title}이(가) 적용되었습니다!`);
  };

  // 카테고리별 필터링
  const filteredImprovements =
    selectedCategory === 'all'
      ? improvements
      : improvements.filter((imp) => imp.category === selectedCategory);

  const categories = [
    { id: 'all', label: '전체', icon: TrendingUp },
    { id: 'performance', label: '성능', icon: Zap },
    { id: 'seo', label: 'SEO', icon: Eye },
    { id: 'accessibility', label: '접근성', icon: CheckCircle },
    { id: 'design', label: '디자인', icon: Palette },
    { id: 'security', label: '보안', icon: AlertCircle },
    { id: 'ux', label: 'UX', icon: Lightbulb },
  ];

  const categoryIcons: Record<string, any> = {
    performance: Zap,
    seo: Eye,
    accessibility: CheckCircle,
    design: Palette,
    security: AlertCircle,
    ux: Lightbulb,
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center">
              <Lightbulb className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">AI 개선 제안</h2>
              <p className="text-sm text-gray-500">코드와 디자인을 분석하여 개선점 제안</p>
            </div>
          </div>
        </div>

        <button
          onClick={analyzeImprovements}
          disabled={isAnalyzing}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              분석 중...
            </>
          ) : (
            <>
              <TrendingUp size={20} />
              개선 사항 분석하기
            </>
          )}
        </button>

        {/* 카테고리 필터 */}
        {improvements.length > 0 && (
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const count =
                cat.id === 'all'
                  ? improvements.length
                  : improvements.filter((imp) => imp.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={16} />
                  {cat.label}
                  <span className="text-xs opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 개선 사항 목록 */}
      <div className="flex-1 overflow-auto p-6">
        {improvements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <TrendingUp className="text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg mb-2">개선 사항을 분석해보세요</p>
            <p className="text-gray-400 text-sm">
              현재 프로젝트를 분석하여 성능, SEO, 접근성 등을 개선할 수 있는 방법을 제안합니다
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredImprovements.map((improvement, index) => {
              const CategoryIcon = categoryIcons[improvement.category];
              return (
                <motion.div
                  key={improvement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    improvement.priority === 'high'
                      ? 'border-red-200 bg-red-50'
                      : improvement.priority === 'medium'
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* 아이콘 */}
                    <div
                      className={`p-3 rounded-xl shrink-0 ${
                        improvement.priority === 'high'
                          ? 'bg-red-100'
                          : improvement.priority === 'medium'
                          ? 'bg-yellow-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      {CategoryIcon ? (
                        <CategoryIcon
                          className={
                            improvement.priority === 'high'
                              ? 'text-red-600'
                              : improvement.priority === 'medium'
                              ? 'text-yellow-600'
                              : 'text-blue-600'
                          }
                          size={24}
                        />
                      ) : (
                        <Lightbulb size={24} />
                      )}
                    </div>

                    {/* 내용 */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-800">
                              {improvement.title}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                improvement.priority === 'high'
                                  ? 'bg-red-200 text-red-700'
                                  : improvement.priority === 'medium'
                                  ? 'bg-yellow-200 text-yellow-700'
                                  : 'bg-blue-200 text-blue-700'
                              }`}
                            >
                              {improvement.priority === 'high' ? '긴급' : improvement.priority === 'medium' ? '중요' : '일반'}
                            </span>
                            {improvement.autoFixable && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                                자동 적용 가능
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{improvement.description}</p>
                        </div>
                      </div>

                      {/* 영향 */}
                      <div className="bg-white/80 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp size={16} className="text-green-600" />
                          <span className="text-sm font-medium text-gray-700">예상 효과</span>
                        </div>
                        <p className="text-sm text-gray-600">{improvement.impact}</p>
                      </div>

                      {/* Before/After */}
                      {improvement.beforeAfter && (
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="text-xs font-medium text-red-700 mb-1">Before</div>
                            <code className="text-xs text-red-600">
                              {improvement.beforeAfter.before}
                            </code>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="text-xs font-medium text-green-700 mb-1">After</div>
                            <code className="text-xs text-green-600">
                              {improvement.beforeAfter.after}
                            </code>
                          </div>
                        </div>
                      )}

                      {/* 코드 제안 */}
                      {improvement.codeSuggestion && (
                        <div className="bg-gray-900 rounded-lg p-3 mb-3">
                          <div className="text-xs font-medium text-gray-400 mb-2">코드 제안</div>
                          <pre className="text-xs text-gray-300 overflow-x-auto">
                            {improvement.codeSuggestion}
                          </pre>
                        </div>
                      )}

                      {/* 메타 정보 */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Code size={12} />
                          {improvement.difficulty === 'easy' ? '쉬움' : improvement.difficulty === 'medium' ? '보통' : '어려움'}
                        </span>
                        <span>⏱️ {improvement.estimatedTime}</span>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedImprovement(improvement)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                          <Eye size={16} />
                          상세 보기
                        </button>
                        {improvement.autoFixable && (
                          <button
                            onClick={() => applyImprovement(improvement)}
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center justify-center gap-2 transition-colors"
                          >
                            <Zap size={16} />
                            자동 적용
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const report = {
                              improvement,
                              timestamp: new Date().toISOString(),
                            };
                            const dataStr = JSON.stringify(report, null, 2);
                            const blob = new Blob([dataStr], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `improvement-${improvement.id}.json`;
                            link.click();
                          }}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                          title="내보내기"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      <AnimatePresence>
        {selectedImprovement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelectedImprovement(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">{selectedImprovement.title}</h3>
                <button
                  onClick={() => setSelectedImprovement(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">설명</h4>
                    <p className="text-gray-600">{selectedImprovement.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">예상 효과</h4>
                    <p className="text-gray-600">{selectedImprovement.impact}</p>
                  </div>
                  {selectedImprovement.codeSuggestion && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">코드 제안</h4>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        {selectedImprovement.codeSuggestion}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-2">
                <button
                  onClick={() => setSelectedImprovement(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  닫기
                </button>
                {selectedImprovement.autoFixable && (
                  <button
                    onClick={() => {
                      applyImprovement(selectedImprovement);
                      setSelectedImprovement(null);
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    자동 적용
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

