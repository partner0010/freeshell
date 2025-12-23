/**
 * 인터랙티브 튜토리얼 컴포넌트
 * 사용자 온보딩 및 교육
 */

'use client';

import React, { useState } from 'react';
import { Play, X, ChevronRight, ChevronLeft, BookOpen, Video, FileText, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  content: string;
  type: 'video' | 'text' | 'interactive';
}

export function InteractiveTutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);

  const tutorials: TutorialStep[] = [
    {
      id: '1',
      title: '시작하기',
      description: 'Freeshell의 기본 사용법을 알아보세요',
      content: 'Freeshell은 AI 기반 콘텐츠 생성 플랫폼입니다. 에디터에서 블록을 드래그하여 웹페이지를 만들 수 있습니다.',
      type: 'text',
    },
    {
      id: '2',
      title: 'AI 기능 사용하기',
      description: 'AI로 콘텐츠를 생성하는 방법',
      content: 'AI 어시스턴트를 사용하여 텍스트, 이미지, 코드를 자동으로 생성할 수 있습니다.',
      type: 'video',
      videoUrl: '/tutorials/ai-features.mp4',
    },
    {
      id: '3',
      title: '템플릿 활용하기',
      description: '템플릿 마켓플레이스 사용법',
      content: '다양한 템플릿을 선택하여 빠르게 시작할 수 있습니다.',
      type: 'text',
    },
    {
      id: '4',
      title: '협업 기능',
      description: '실시간 협업으로 함께 작업하기',
      content: '여러 사용자와 동시에 작업하고 실시간으로 소통할 수 있습니다.',
      type: 'interactive',
    },
  ];

  const currentTutorial = tutorials[currentStep];
  const progress = ((currentStep + 1) / tutorials.length) * 100;

  const handleNext = () => {
    if (currentStep < tutorials.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompletedSteps(new Set([...completedSteps, currentTutorial.id]));
      setIsOpen(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps(new Set([...completedSteps, currentTutorial.id]));
    if (currentStep < tutorials.length - 1) {
      handleNext();
    } else {
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center group"
        aria-label="튜토리얼"
      >
        <BookOpen size={24} />
      </button>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* 헤더 */}
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">인터랙티브 튜토리얼</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentStep + 1} / {tutorials.length}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* 진행 바 */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* 콘텐츠 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  {currentTutorial.type === 'video' && <Video className="text-blue-600" size={20} />}
                  {currentTutorial.type === 'text' && <FileText className="text-blue-600" size={20} />}
                  {currentTutorial.type === 'interactive' && <Play className="text-blue-600" size={20} />}
                  <h3 className="text-xl font-bold text-gray-900">{currentTutorial.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{currentTutorial.description}</p>
              </div>

              {currentTutorial.type === 'video' && currentTutorial.videoUrl ? (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Video className="mx-auto text-gray-400 mb-2" size={48} />
                    <p className="text-gray-600">비디오 재생 영역</p>
                  </div>
                </div>
              ) : null}

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{currentTutorial.content}</p>
              </div>
            </div>

            {/* 푸터 */}
            <div className="p-6 border-t flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft size={18} />
                이전
              </button>
              
              <div className="flex gap-2">
                {tutorials.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep
                        ? 'bg-purple-600'
                        : index < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentStep < tutorials.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  다음
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  완료
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

