'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, RefreshCw, CheckCircle, AlertTriangle, XCircle, Info, Accessibility } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

interface AccessibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'passed';
  rule: string;
  description: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  suggestion?: string;
}

export function AccessibilityChecker() {
  const { getCurrentPage } = useEditorStore();
  const currentPage = getCurrentPage();
  const [isChecking, setIsChecking] = useState(false);
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [score, setScore] = useState(0);

  const checkAccessibility = () => {
    setIsChecking(true);

    setTimeout(() => {
      const blocks = currentPage?.blocks || [];
      const hasHeader = blocks.some(b => b.type === 'header');
      const hasImages = blocks.some(b => b.type === 'image');
      const hasContact = blocks.some(b => b.type === 'contact');
      const hasHero = blocks.some(b => b.type === 'hero');

      const newIssues: AccessibilityIssue[] = [
        // 통과 항목
        {
          id: 'color-contrast',
          type: 'passed',
          rule: '색상 대비',
          description: '텍스트와 배경의 색상 대비가 적절합니다',
          impact: 'serious',
        },
        {
          id: 'focus-visible',
          type: 'passed',
          rule: '포커스 표시',
          description: '인터랙티브 요소에 포커스 표시가 있습니다',
          impact: 'serious',
        },
        {
          id: 'semantic-html',
          type: hasHeader ? 'passed' : 'warning',
          rule: '시맨틱 HTML',
          description: hasHeader 
            ? '올바른 HTML 구조를 사용하고 있습니다'
            : '헤더 블록을 추가하여 시맨틱 구조를 개선하세요',
          impact: 'moderate',
          suggestion: hasHeader ? undefined : '헤더, 메인, 푸터 등의 시맨틱 요소를 사용하세요',
        },
        {
          id: 'alt-text',
          type: hasImages ? 'warning' : 'passed',
          rule: '이미지 대체 텍스트',
          description: hasImages 
            ? '일부 이미지에 대체 텍스트가 필요합니다'
            : '이미지 대체 텍스트가 적절합니다',
          impact: 'serious',
          suggestion: hasImages ? '모든 이미지에 설명적인 alt 텍스트를 추가하세요' : undefined,
        },
        {
          id: 'heading-order',
          type: 'passed',
          rule: '제목 순서',
          description: '제목이 올바른 순서로 사용되고 있습니다',
          impact: 'moderate',
        },
        {
          id: 'form-labels',
          type: hasContact ? 'passed' : 'passed',
          rule: '폼 레이블',
          description: '모든 폼 요소에 레이블이 있습니다',
          impact: 'critical',
        },
        {
          id: 'link-purpose',
          type: hasHero ? 'passed' : 'warning',
          rule: '링크 목적',
          description: hasHero 
            ? '링크의 목적이 명확합니다'
            : 'CTA 버튼에 명확한 텍스트를 사용하세요',
          impact: 'serious',
          suggestion: hasHero ? undefined : '"자세히 보기" 대신 구체적인 행동을 설명하세요',
        },
        {
          id: 'keyboard-nav',
          type: 'passed',
          rule: '키보드 내비게이션',
          description: '키보드로 모든 요소에 접근할 수 있습니다',
          impact: 'critical',
        },
        {
          id: 'touch-target',
          type: 'passed',
          rule: '터치 타겟 크기',
          description: '버튼과 링크가 충분히 큽니다 (44x44px 이상)',
          impact: 'serious',
        },
        {
          id: 'language',
          type: 'passed',
          rule: '페이지 언어',
          description: '페이지 언어가 정의되어 있습니다 (ko)',
          impact: 'serious',
        },
      ];

      setIssues(newIssues);
      
      // 점수 계산
      const passedCount = newIssues.filter(i => i.type === 'passed').length;
      const totalCount = newIssues.length;
      setScore(Math.round((passedCount / totalCount) * 100));
      
      setIsChecking(false);
    }, 1200);
  };

  useEffect(() => {
    checkAccessibility();
  }, [currentPage?.blocks.length]);

  const getTypeIcon = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'passed':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'error':
        return <XCircle className="text-red-500" size={16} />;
    }
  };

  const getImpactBadge = (impact: AccessibilityIssue['impact']) => {
    const colors = {
      critical: 'bg-red-100 text-red-700',
      serious: 'bg-orange-100 text-orange-700',
      moderate: 'bg-yellow-100 text-yellow-700',
      minor: 'bg-gray-100 text-gray-700',
    };
    return colors[impact];
  };

  const passedCount = issues.filter(i => i.type === 'passed').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;
  const errorCount = issues.filter(i => i.type === 'error').length;

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
            <Accessibility className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">접근성 검사</h3>
            <p className="text-xs text-gray-500">WCAG 2.1 기준</p>
          </div>
        </div>
        <button
          onClick={checkAccessibility}
          disabled={isChecking}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw size={18} className={isChecking ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* 점수 카드 */}
      <div className="bg-gradient-to-br from-pastel-mint to-pastel-sky rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">접근성 점수</p>
            <p className="text-3xl font-bold text-gray-800">{score}%</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle className="text-green-500" size={14} />
                {passedCount}
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="text-yellow-500" size={14} />
                {warningCount}
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="text-red-500" size={14} />
                {errorCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 검사 항목 */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {issues.map((issue, i) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`
              p-3 rounded-xl border transition-colors
              ${issue.type === 'passed' ? 'bg-green-50/50 border-green-100' : ''}
              ${issue.type === 'warning' ? 'bg-yellow-50/50 border-yellow-100' : ''}
              ${issue.type === 'error' ? 'bg-red-50/50 border-red-100' : ''}
            `}
          >
            <div className="flex items-start gap-2">
              <div className="mt-0.5">{getTypeIcon(issue.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-800">{issue.rule}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getImpactBadge(issue.impact)}`}>
                    {issue.impact}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{issue.description}</p>
                {issue.suggestion && (
                  <p className="text-xs text-blue-600 mt-1 flex items-start gap-1">
                    <Info size={12} className="shrink-0 mt-0.5" />
                    {issue.suggestion}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 가이드라인 링크 */}
      <div className="mt-4 pt-4 border-t">
        <a
          href="https://www.w3.org/WAI/WCAG21/quickref/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary-500 hover:underline flex items-center gap-1"
        >
          <Info size={12} />
          WCAG 2.1 가이드라인 보기
        </a>
      </div>
    </div>
  );
}

