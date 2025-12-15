'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Minimize2, Maximize2 } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

export default function EditorMinimap() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [viewportPosition, setViewportPosition] = useState({ top: 0, height: 100 });
  const minimapRef = useRef<HTMLDivElement>(null);
  const { blocks } = useEditorStore();

  // 뷰포트 위치 추적
  useEffect(() => {
    const handleScroll = () => {
      const canvas = document.querySelector('[data-canvas]');
      if (!canvas) return;

      const { scrollTop, scrollHeight, clientHeight } = canvas as HTMLElement;
      const viewportTop = (scrollTop / scrollHeight) * 100;
      const viewportHeight = (clientHeight / scrollHeight) * 100;

      setViewportPosition({
        top: viewportTop,
        height: Math.max(viewportHeight, 10), // 최소 10% 높이
      });
    };

    const canvas = document.querySelector('[data-canvas]');
    if (canvas) {
      canvas.addEventListener('scroll', handleScroll);
      handleScroll(); // 초기값 설정
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // 미니맵 클릭으로 스크롤
  const handleMinimapClick = (e: React.MouseEvent) => {
    if (!minimapRef.current) return;

    const rect = minimapRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const percentage = clickY / rect.height;

    const canvas = document.querySelector('[data-canvas]');
    if (canvas) {
      const { scrollHeight, clientHeight } = canvas as HTMLElement;
      const targetScroll = percentage * scrollHeight - clientHeight / 2;
      canvas.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  // 블록 색상 결정
  const getBlockColor = (type: string) => {
    const colors: Record<string, string> = {
      header: 'bg-purple-400',
      hero: 'bg-blue-400',
      text: 'bg-gray-400',
      image: 'bg-green-400',
      features: 'bg-yellow-400',
      testimonials: 'bg-pink-400',
      pricing: 'bg-orange-400',
      contact: 'bg-teal-400',
      footer: 'bg-gray-500',
      cta: 'bg-red-400',
      stats: 'bg-indigo-400',
      divider: 'bg-gray-300',
      spacer: 'bg-transparent border border-gray-200',
    };
    return colors[type] || 'bg-gray-400';
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 right-4 p-2 bg-white shadow-lg rounded-lg hover:bg-gray-50 z-30"
        title="미니맵 열기"
      >
        <Maximize2 size={18} className="text-gray-600" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-4 right-4 z-30"
    >
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        {/* 헤더 */}
        <div className="px-3 py-2 border-b flex items-center justify-between bg-gray-50">
          <span className="text-xs font-medium text-gray-600">미니맵</span>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <Minimize2 size={14} className="text-gray-500" />
          </button>
        </div>

        {/* 미니맵 영역 */}
        <div
          ref={minimapRef}
          onClick={handleMinimapClick}
          className="relative w-32 h-48 bg-gray-100 cursor-pointer"
        >
          {/* 블록들 */}
          <div className="absolute inset-2 space-y-1">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className={`
                  w-full rounded-sm transition-all
                  ${getBlockColor(block.type)}
                `}
                style={{
                  height: block.type === 'spacer' ? '4px' : 
                         block.type === 'hero' ? '24px' : 
                         block.type === 'features' ? '16px' : '8px',
                  opacity: 0.8,
                }}
              />
            ))}
          </div>

          {/* 현재 뷰포트 표시 */}
          <motion.div
            className="absolute left-0 right-0 bg-primary-500/20 border-2 border-primary-500 rounded pointer-events-none"
            style={{
              top: `${viewportPosition.top}%`,
              height: `${viewportPosition.height}%`,
            }}
            animate={{
              top: `${viewportPosition.top}%`,
              height: `${viewportPosition.height}%`,
            }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* 블록 수 표시 */}
        <div className="px-3 py-2 border-t bg-gray-50">
          <span className="text-xs text-gray-500">{blocks.length}개 블록</span>
        </div>
      </div>
    </motion.div>
  );
}

