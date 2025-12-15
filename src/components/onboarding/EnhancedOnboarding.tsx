'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  target?: string; // 하이라이트할 요소 ID
}

interface EnhancedOnboardingProps {
  steps: OnboardingStep[];
  onComplete: () => void;
  onSkip: () => void;
}

export function EnhancedOnboarding({
  steps,
  onComplete,
  onSkip,
}: EnhancedOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const current = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    setCompletedSteps(new Set([...completedSteps, current.id]));
    if (isLast) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  // 타겟 요소 하이라이트
  React.useEffect(() => {
    if (current.target) {
      const element = document.querySelector(current.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // 하이라이트 효과 추가 가능
      }
    }
  }, [current]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        {/* 오버레이 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* 온보딩 카드 */}
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-auto">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="max-w-md w-full"
          >
            <Card className="p-6 shadow-2xl">
              {/* 진행 바 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    단계 {currentStep + 1} / {steps.length}
                  </span>
                  <button
                    onClick={handleSkip}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                  />
                </div>
              </div>

              {/* 아이콘 */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <Sparkles className="text-white" size={32} />
                </div>
              </div>

              {/* 콘텐츠 */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {current.title}
                </h2>
                <p className="text-gray-600 mb-4">{current.description}</p>
                {current.content}
              </div>

              {/* 단계 표시 */}
              <div className="flex justify-center gap-2 mb-6">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-purple-600 w-8'
                        : completedSteps.has(step.id)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* 버튼 */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="flex-1"
                >
                  건너뛰기
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  {isLast ? (
                    <>
                      <CheckCircle2 size={18} />
                      완료
                    </>
                  ) : (
                    <>
                      다음
                      <ArrowRight size={18} />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

