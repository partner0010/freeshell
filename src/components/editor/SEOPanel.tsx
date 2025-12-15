'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Image, AlertCircle, CheckCircle, Info, RefreshCw } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

interface SEOScore {
  score: number;
  issues: SEOIssue[];
}

interface SEOIssue {
  type: 'error' | 'warning' | 'success';
  title: string;
  description: string;
}

export function SEOPanel() {
  const { getCurrentPage, updatePage, currentPageId } = useEditorStore();
  const currentPage = getCurrentPage();
  const [seoScore, setSeoScore] = useState<SEOScore>({ score: 0, issues: [] });

  const [seoData, setSeoData] = useState({
    title: currentPage?.settings.title || '',
    description: currentPage?.settings.description || '',
    ogImage: currentPage?.settings.ogImage || '',
    favicon: currentPage?.settings.favicon || '',
    keywords: '',
    canonicalUrl: '',
  });

  useEffect(() => {
    if (currentPage) {
      setSeoData({
        title: currentPage.settings.title || '',
        description: currentPage.settings.description || '',
        ogImage: currentPage.settings.ogImage || '',
        favicon: currentPage.settings.favicon || '',
        keywords: '',
        canonicalUrl: '',
      });
    }
  }, [currentPage]);

  useEffect(() => {
    analyzeSEO();
  }, [seoData]);

  const analyzeSEO = () => {
    const issues: SEOIssue[] = [];
    let score = 100;

    // 타이틀 검사
    if (!seoData.title) {
      issues.push({
        type: 'error',
        title: '페이지 제목 없음',
        description: '검색 결과에 표시될 페이지 제목을 입력하세요.',
      });
      score -= 20;
    } else if (seoData.title.length < 30) {
      issues.push({
        type: 'warning',
        title: '제목이 너무 짧음',
        description: '제목을 30자 이상으로 작성하면 검색 노출에 유리합니다.',
      });
      score -= 10;
    } else if (seoData.title.length > 60) {
      issues.push({
        type: 'warning',
        title: '제목이 너무 김',
        description: '제목이 60자를 초과하면 검색 결과에서 잘릴 수 있습니다.',
      });
      score -= 5;
    } else {
      issues.push({
        type: 'success',
        title: '적절한 제목 길이',
        description: '페이지 제목이 적절한 길이입니다.',
      });
    }

    // 설명 검사
    if (!seoData.description) {
      issues.push({
        type: 'error',
        title: '메타 설명 없음',
        description: '검색 결과에 표시될 페이지 설명을 입력하세요.',
      });
      score -= 20;
    } else if (seoData.description.length < 70) {
      issues.push({
        type: 'warning',
        title: '설명이 너무 짧음',
        description: '설명을 70자 이상으로 작성하면 검색 노출에 유리합니다.',
      });
      score -= 10;
    } else if (seoData.description.length > 160) {
      issues.push({
        type: 'warning',
        title: '설명이 너무 김',
        description: '설명이 160자를 초과하면 검색 결과에서 잘릴 수 있습니다.',
      });
      score -= 5;
    } else {
      issues.push({
        type: 'success',
        title: '적절한 설명 길이',
        description: '메타 설명이 적절한 길이입니다.',
      });
    }

    // OG 이미지 검사
    if (!seoData.ogImage) {
      issues.push({
        type: 'warning',
        title: 'OG 이미지 없음',
        description: '소셜 미디어 공유 시 표시될 이미지를 추가하세요.',
      });
      score -= 10;
    } else {
      issues.push({
        type: 'success',
        title: 'OG 이미지 설정됨',
        description: '소셜 미디어 공유 이미지가 설정되었습니다.',
      });
    }

    setSeoScore({ score: Math.max(0, score), issues });
  };

  const handleSave = () => {
    if (currentPageId) {
      updatePage(currentPageId, {
        settings: {
          ...currentPage?.settings,
          title: seoData.title,
          description: seoData.description,
          ogImage: seoData.ogImage,
          favicon: seoData.favicon,
        },
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-400 to-green-500';
    if (score >= 50) return 'from-yellow-400 to-yellow-500';
    return 'from-red-400 to-red-500';
  };

  return (
    <div className="h-full flex flex-col">
      {/* SEO 점수 */}
      <div className="bg-gradient-to-br from-pastel-lavender to-pastel-sky rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">SEO 점수</span>
          <button onClick={analyzeSEO} className="p-1 text-gray-500 hover:text-gray-700">
            <RefreshCw size={16} />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-white/50"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${seoScore.score * 2.2} 220`}
                className={getScoreColor(seoScore.score)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${getScoreColor(seoScore.score)}`}>
                {seoScore.score}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              {seoScore.score >= 80 && '훌륭합니다! SEO가 잘 최적화되어 있습니다.'}
              {seoScore.score >= 50 && seoScore.score < 80 && '괜찮지만 개선할 부분이 있습니다.'}
              {seoScore.score < 50 && 'SEO 개선이 필요합니다.'}
            </p>
          </div>
        </div>
      </div>

      {/* 입력 폼 */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* 페이지 제목 */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Search size={16} />
            페이지 제목
            <span className="text-xs text-gray-400">({seoData.title.length}/60)</span>
          </label>
          <input
            type="text"
            value={seoData.title}
            onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
            placeholder="검색 결과에 표시될 제목"
            className="input-field"
            maxLength={70}
          />
        </div>

        {/* 메타 설명 */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Globe size={16} />
            메타 설명
            <span className="text-xs text-gray-400">({seoData.description.length}/160)</span>
          </label>
          <textarea
            value={seoData.description}
            onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
            placeholder="검색 결과에 표시될 설명"
            className="input-field min-h-[80px] resize-none"
            maxLength={170}
          />
        </div>

        {/* OG 이미지 */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Image size={16} />
            소셜 미디어 이미지 (OG Image)
          </label>
          <input
            type="text"
            value={seoData.ogImage}
            onChange={(e) => setSeoData({ ...seoData, ogImage: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="input-field"
          />
          {seoData.ogImage && (
            <div className="mt-2 rounded-lg overflow-hidden border">
              <img src={seoData.ogImage} alt="OG Preview" className="w-full h-32 object-cover" />
            </div>
          )}
        </div>

        {/* 검색 미리보기 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">검색 결과 미리보기</label>
          <div className="bg-white border rounded-xl p-4">
            <p className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
              {seoData.title || '페이지 제목'}
            </p>
            <p className="text-green-700 text-sm">example.com › page</p>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {seoData.description || '페이지 설명이 여기에 표시됩니다...'}
            </p>
          </div>
        </div>

        {/* SEO 이슈 목록 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">SEO 체크리스트</label>
          <div className="space-y-2">
            {seoScore.issues.map((issue, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`
                  flex items-start gap-3 p-3 rounded-lg
                  ${issue.type === 'error' ? 'bg-red-50' : ''}
                  ${issue.type === 'warning' ? 'bg-yellow-50' : ''}
                  ${issue.type === 'success' ? 'bg-green-50' : ''}
                `}
              >
                {issue.type === 'error' && <AlertCircle className="text-red-500 shrink-0" size={18} />}
                {issue.type === 'warning' && <Info className="text-yellow-500 shrink-0" size={18} />}
                {issue.type === 'success' && <CheckCircle className="text-green-500 shrink-0" size={18} />}
                <div>
                  <p className="font-medium text-sm text-gray-800">{issue.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{issue.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="mt-4 pt-4 border-t">
        <button onClick={handleSave} className="btn-primary w-full">
          SEO 설정 저장
        </button>
      </div>
    </div>
  );
}

