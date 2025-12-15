'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MousePointer2,
  Sparkles,
  Circle,
  Star,
  Zap,
  Heart,
  Droplet,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';

type CursorEffect = 'none' | 'glow' | 'trail' | 'particles' | 'ripple' | 'spotlight' | 'magnetic';

interface CursorPosition {
  x: number;
  y: number;
}

const cursorEffects = [
  { id: 'none', name: '없음', icon: Circle, description: '기본 커서' },
  { id: 'glow', name: '글로우', icon: Sparkles, description: '부드러운 빛 효과' },
  { id: 'trail', name: '트레일', icon: Star, description: '마우스 따라다니는 효과' },
  { id: 'particles', name: '파티클', icon: Zap, description: '입자가 터지는 효과' },
  { id: 'ripple', name: '리플', icon: Droplet, description: '물결 효과' },
  { id: 'spotlight', name: '스포트라이트', icon: Circle, description: '마우스 주변만 밝게' },
  { id: 'magnetic', name: '마그네틱', icon: Heart, description: '요소가 끌려오는 효과' },
];

export default function CursorEffects() {
  const [selectedEffect, setSelectedEffect] = useState<CursorEffect>('none');
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [trail, setTrail] = useState<CursorPosition[]>([]);
  const [isPreviewEnabled, setIsPreviewEnabled] = useState(false);
  const [cursorColor, setCursorColor] = useState('#8B5CF6');
  const [cursorSize, setCursorSize] = useState(20);
  const previewRef = useRef<HTMLDivElement>(null);

  // 커서 위치 추적
  useEffect(() => {
    if (!isPreviewEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = previewRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        setCursorPosition({ x, y });
        
        if (selectedEffect === 'trail') {
          setTrail(prev => [...prev.slice(-10), { x, y }]);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isPreviewEnabled, selectedEffect]);

  const generateCSS = () => {
    const css = `
/* GRIP Cursor Effects */
.cursor-effect-${selectedEffect} {
  cursor: none;
}

.custom-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  width: ${cursorSize}px;
  height: ${cursorSize}px;
  border-radius: 50%;
  background: ${cursorColor};
  mix-blend-mode: difference;
  transition: transform 0.1s ease-out;
}
${selectedEffect === 'glow' ? `
.custom-cursor::after {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  background: ${cursorColor};
  filter: blur(20px);
  opacity: 0.5;
}` : ''}
    `.trim();
    return css;
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <MousePointer2 size={18} />
          커서 효과
        </h3>
        <p className="text-sm text-gray-500 mt-1">독특한 마우스 커서 효과를 적용하세요</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 효과 선택 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">효과 유형</p>
          <div className="grid grid-cols-2 gap-2">
            {cursorEffects.map((effect) => (
              <button
                key={effect.id}
                onClick={() => setSelectedEffect(effect.id as CursorEffect)}
                className={`
                  p-3 rounded-xl border-2 transition-all text-left
                  ${selectedEffect === effect.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <effect.icon size={18} className={selectedEffect === effect.id ? 'text-primary-500' : 'text-gray-400'} />
                  <span className="font-medium text-sm text-gray-700">{effect.name}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{effect.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 커스터마이징 */}
        {selectedEffect !== 'none' && (
          <div className="space-y-4">
            <p className="text-xs font-medium text-gray-500">커스터마이징</p>
            
            {/* 색상 */}
            <div>
              <label className="text-sm text-gray-700 mb-2 block">색상</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={cursorColor}
                  onChange={(e) => setCursorColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                />
                <input
                  type="text"
                  value={cursorColor}
                  onChange={(e) => setCursorColor(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono uppercase"
                />
              </div>
            </div>

            {/* 크기 */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-700">크기</label>
                <span className="text-sm font-medium text-gray-800">{cursorSize}px</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                value={cursorSize}
                onChange={(e) => setCursorSize(parseInt(e.target.value))}
                className="w-full accent-primary-500"
              />
            </div>
          </div>
        )}

        {/* 미리보기 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-500">미리보기</p>
            <button
              onClick={() => setIsPreviewEnabled(!isPreviewEnabled)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                isPreviewEnabled ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isPreviewEnabled ? <Eye size={12} /> : <EyeOff size={12} />}
              {isPreviewEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
          <div
            ref={previewRef}
            className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden"
            style={{ cursor: isPreviewEnabled && selectedEffect !== 'none' ? 'none' : 'default' }}
          >
            {/* 미리보기 콘텐츠 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400 text-sm">마우스를 움직여보세요</p>
            </div>

            {/* 커서 효과 */}
            {isPreviewEnabled && selectedEffect !== 'none' && (
              <>
                {/* 글로우 커서 */}
                {selectedEffect === 'glow' && (
                  <motion.div
                    className="absolute pointer-events-none"
                    style={{
                      left: cursorPosition.x - cursorSize / 2,
                      top: cursorPosition.y - cursorSize / 2,
                      width: cursorSize,
                      height: cursorSize,
                    }}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        background: cursorColor,
                        boxShadow: `0 0 20px ${cursorColor}, 0 0 40px ${cursorColor}`,
                      }}
                    />
                  </motion.div>
                )}

                {/* 트레일 커서 */}
                {selectedEffect === 'trail' && trail.map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      left: pos.x - (cursorSize * (1 - i * 0.08)) / 2,
                      top: pos.y - (cursorSize * (1 - i * 0.08)) / 2,
                      width: cursorSize * (1 - i * 0.08),
                      height: cursorSize * (1 - i * 0.08),
                      background: cursorColor,
                      opacity: 1 - i * 0.1,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.1 }}
                  />
                ))}

                {/* 스포트라이트 */}
                {selectedEffect === 'spotlight' && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle 80px at ${cursorPosition.x}px ${cursorPosition.y}px, transparent 0%, rgba(0,0,0,0.7) 100%)`,
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* 생성된 CSS */}
        {selectedEffect !== 'none' && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">생성된 CSS</p>
            <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-x-auto max-h-32">
              {generateCSS()}
            </pre>
          </div>
        )}
      </div>

      {/* 적용 버튼 */}
      <div className="p-4 border-t">
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600">
          <Check size={18} />
          효과 적용
        </button>
      </div>
    </div>
  );
}

