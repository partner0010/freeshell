'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Blocks, Sparkles, Palette, MousePointer, Eye, Rocket } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  highlight?: string;
  position?: 'center' | 'left' | 'right';
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'GRIP에 오신 것을 환영합니다! 👋',
    description: '블록을 쌓듯이 쉽게 웹사이트를 만들어보세요. 이 튜토리얼에서 기본 사용법을 알려드릴게요.',
    icon: Rocket,
    position: 'center',
  },
  {
    id: 'blocks',
    title: '블록 추가하기',
    description: '왼쪽 패널에서 원하는 블록을 클릭하여 추가하세요. 헤더, 히어로, 기능 소개 등 다양한 블록이 준비되어 있습니다.',
    icon: Blocks,
    highlight: 'sidebar-blocks',
    position: 'left',
  },
  {
    id: 'ai',
    title: 'AI 어시스턴트',
    description: '"랜딩페이지 만들어줘"처럼 원하는 것을 설명하면 AI가 자동으로 페이지 구조를 만들어줍니다.',
    icon: Sparkles,
    highlight: 'sidebar-ai',
    position: 'left',
  },
  {
    id: 'editing',
    title: '블록 편집하기',
    description: '캔버스에서 블록을 클릭하면 내용을 편집할 수 있습니다. 드래그해서 순서를 바꿀 수도 있어요.',
    icon: MousePointer,
    highlight: 'canvas',
    position: 'center',
  },
  {
    id: 'styles',
    title: '스타일 변경하기',
    description: '블록을 선택한 후 스타일 패널에서 배경색, 여백, 정렬 등을 변경할 수 있습니다.',
    icon: Palette,
    highlight: 'sidebar-styles',
    position: 'left',
  },
  {
    id: 'preview',
    title: '미리보기',
    description: '상단의 미리보기 버튼을 클릭하면 실제 웹사이트처럼 결과물을 확인할 수 있습니다.',
    icon: Eye,
    highlight: 'toolbar-preview',
    position: 'right',
  },
];

interface OnboardingTutorialProps {
  onComplete: () => void;
}

export function OnboardingTutorial({ onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const step = tutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('grip-tutorial-completed', 'true');
    setTimeout(onComplete, 300);
  };

  useEffect(() => {
    const completed = localStorage.getItem('grip-tutorial-completed');
    if (completed) {
      setIsVisible(false);
      onComplete();
    }
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        {/* 메인 카드 */}
        <motion.div
          key={step.id}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {tutorialSteps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentStep ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleSkip}
              className="text-white/70 hover:text-white text-sm"
            >
              건너뛰기
            </button>
          </div>

          {/* 콘텐츠 */}
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-20 h-20 bg-gradient-to-br from-pastel-lavender via-pastel-sky to-pastel-mint rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <step.icon size={40} className="text-primary-600" />
            </motion.div>

            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-display font-bold text-gray-800 mb-4"
            >
              {step.title}
            </motion.h2>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 leading-relaxed"
            >
              {step.description}
            </motion.p>
          </div>

          {/* 푸터 */}
          <div className="px-6 pb-6 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={isFirstStep}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${isFirstStep
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <ChevronLeft size={20} />
              이전
            </button>

            <span className="text-sm text-gray-400">
              {currentStep + 1} / {tutorialSteps.length}
            </span>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {isLastStep ? '시작하기' : '다음'}
              {!isLastStep && <ChevronRight size={20} />}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// 튜토리얼 리셋 함수 (설정에서 사용 가능)
export function resetTutorial() {
  localStorage.removeItem('grip-tutorial-completed');
}

