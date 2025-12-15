'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Scroll,
  Eye,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  RotateCw,
  Maximize2,
  Minimize2,
  Zap,
  Check,
} from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

interface ScrollAnimation {
  id: string;
  name: string;
  description: string;
  preview: string;
  properties: {
    y?: number;
    x?: number;
    opacity?: number;
    scale?: number;
    rotate?: number;
  };
}

const scrollAnimations: ScrollAnimation[] = [
  {
    id: 'fade-up',
    name: '아래에서 페이드',
    description: '요소가 아래에서 위로 나타납니다',
    preview: '↑',
    properties: { y: 50, opacity: 0 },
  },
  {
    id: 'fade-down',
    name: '위에서 페이드',
    description: '요소가 위에서 아래로 나타납니다',
    preview: '↓',
    properties: { y: -50, opacity: 0 },
  },
  {
    id: 'fade-left',
    name: '왼쪽에서 페이드',
    description: '요소가 왼쪽에서 오른쪽으로 나타납니다',
    preview: '→',
    properties: { x: -50, opacity: 0 },
  },
  {
    id: 'fade-right',
    name: '오른쪽에서 페이드',
    description: '요소가 오른쪽에서 왼쪽으로 나타납니다',
    preview: '←',
    properties: { x: 50, opacity: 0 },
  },
  {
    id: 'zoom-in',
    name: '확대',
    description: '요소가 작은 상태에서 커집니다',
    preview: '⊕',
    properties: { scale: 0.8, opacity: 0 },
  },
  {
    id: 'zoom-out',
    name: '축소',
    description: '요소가 큰 상태에서 작아집니다',
    preview: '⊖',
    properties: { scale: 1.2, opacity: 0 },
  },
  {
    id: 'rotate',
    name: '회전',
    description: '요소가 회전하며 나타납니다',
    preview: '↻',
    properties: { rotate: -10, opacity: 0 },
  },
  {
    id: 'flip',
    name: '뒤집기',
    description: '요소가 뒤집히며 나타납니다',
    preview: '⟳',
    properties: { rotateX: 90, opacity: 0 },
  },
];

const easingOptions = [
  { value: 'easeOut', label: '부드럽게 끝' },
  { value: 'easeIn', label: '부드럽게 시작' },
  { value: 'easeInOut', label: '부드럽게 시작/끝' },
  { value: 'linear', label: '일정하게' },
  { value: 'spring', label: '탄성' },
];

export default function ScrollAnimations() {
  const { selectedBlockId } = useEditorStore();
  const [selectedAnimation, setSelectedAnimation] = useState<string>('fade-up');
  const [duration, setDuration] = useState(0.6);
  const [delay, setDelay] = useState(0);
  const [easing, setEasing] = useState('easeOut');
  const [threshold, setThreshold] = useState(0.2);
  const [stagger, setStagger] = useState(false);
  const [staggerDelay, setStaggerDelay] = useState(0.1);

  const applyAnimation = () => {
    // 실제로는 선택된 블록에 애니메이션 적용
    console.log('Animation applied:', {
      animation: selectedAnimation,
      duration,
      delay,
      easing,
      threshold,
      stagger,
      staggerDelay,
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Scroll size={18} />
          스크롤 애니메이션
        </h3>
        <p className="text-sm text-gray-500 mt-1">스크롤에 반응하는 효과를 추가하세요</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 애니메이션 선택 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">애니메이션 유형</p>
          <div className="grid grid-cols-4 gap-2">
            {scrollAnimations.map((anim) => (
              <button
                key={anim.id}
                onClick={() => setSelectedAnimation(anim.id)}
                className={`
                  p-3 rounded-xl border-2 transition-all text-center
                  ${selectedAnimation === anim.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <span className="text-2xl">{anim.preview}</span>
                <p className="text-xs text-gray-600 mt-1 truncate">{anim.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 미리보기 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">미리보기</p>
          <div className="bg-gray-100 rounded-xl p-8 flex items-center justify-center h-32">
            <motion.div
              key={selectedAnimation}
              initial={scrollAnimations.find(a => a.id === selectedAnimation)?.properties}
              animate={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration, ease: easing as any }}
              className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl shadow-lg"
            />
          </div>
          <button
            onClick={() => {
              // 리렌더링으로 애니메이션 재생
              setSelectedAnimation(prev => prev);
            }}
            className="w-full mt-2 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg flex items-center justify-center gap-2"
          >
            <RotateCw size={14} />
            다시 재생
          </button>
        </div>

        {/* 타이밍 설정 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">타이밍</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-700">지속 시간</label>
                <span className="text-sm font-medium text-gray-800">{duration}s</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={2}
                step={0.1}
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full accent-primary-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-700">딜레이</label>
                <span className="text-sm font-medium text-gray-800">{delay}s</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={delay}
                onChange={(e) => setDelay(parseFloat(e.target.value))}
                className="w-full accent-primary-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 block mb-2">이징</label>
              <select
                value={easing}
                onChange={(e) => setEasing(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                {easingOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 트리거 설정 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">트리거</p>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-700">뷰포트 진입 위치</label>
              <span className="text-sm font-medium text-gray-800">{Math.round(threshold * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full accent-primary-500"
            />
            <p className="text-xs text-gray-400 mt-1">요소가 화면의 {Math.round(threshold * 100)}% 위치에 도달하면 애니메이션 시작</p>
          </div>
        </div>

        {/* 스태거 애니메이션 */}
        <div>
          <button
            onClick={() => setStagger(!stagger)}
            className={`
              w-full flex items-center justify-between p-3 rounded-xl transition-colors
              ${stagger ? 'bg-primary-50 text-primary-700' : 'bg-gray-50 text-gray-600'}
            `}
          >
            <span className="flex items-center gap-2 text-sm">
              <Sparkles size={16} />
              순차 애니메이션
            </span>
            <span className={`w-8 h-5 rounded-full relative ${stagger ? 'bg-primary-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${stagger ? 'left-3.5' : 'left-0.5'}`} />
            </span>
          </button>
          
          {stagger && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3"
            >
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-700">항목 간 딜레이</label>
                <span className="text-sm font-medium text-gray-800">{staggerDelay}s</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={0.5}
                step={0.05}
                value={staggerDelay}
                onChange={(e) => setStaggerDelay(parseFloat(e.target.value))}
                className="w-full accent-primary-500"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* 적용 버튼 */}
      <div className="p-4 border-t">
        <button
          onClick={applyAnimation}
          disabled={!selectedBlockId}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check size={18} />
          {selectedBlockId ? '애니메이션 적용' : '블록을 선택하세요'}
        </button>
      </div>
    </div>
  );
}

