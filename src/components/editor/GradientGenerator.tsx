'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCw,
  Shuffle,
  Download,
  Droplet,
} from 'lucide-react';

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

const presetGradients = [
  { name: '선셋', colors: ['#FF6B6B', '#FFE66D'] },
  { name: '오션', colors: ['#667EEA', '#764BA2'] },
  { name: '민트', colors: ['#11998E', '#38EF7D'] },
  { name: '피치', colors: ['#FFECD2', '#FCB69F'] },
  { name: '스카이', colors: ['#A1C4FD', '#C2E9FB'] },
  { name: '버블검', colors: ['#F093FB', '#F5576C'] },
  { name: '레몬', colors: ['#F7FF00', '#DB36A4'] },
  { name: '코랄', colors: ['#FF9A9E', '#FECFEF'] },
];

export default function GradientGenerator() {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(90);
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: '1', color: '#8B5CF6', position: 0 },
    { id: '2', color: '#EC4899', position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const generateGradientCSS = useCallback(() => {
    const stops = [...colorStops]
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');

    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${stops})`;
    } else {
      return `radial-gradient(circle, ${stops})`;
    }
  }, [colorStops, gradientType, angle]);

  const addColorStop = () => {
    const newStop: ColorStop = {
      id: Math.random().toString(36).substr(2, 9),
      color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
      position: 50,
    };
    setColorStops([...colorStops, newStop]);
  };

  const removeColorStop = (id: string) => {
    if (colorStops.length <= 2) return;
    setColorStops(colorStops.filter(stop => stop.id !== id));
  };

  const updateColorStop = (id: string, updates: Partial<ColorStop>) => {
    setColorStops(colorStops.map(stop =>
      stop.id === id ? { ...stop, ...updates } : stop
    ));
  };

  const applyPreset = (preset: typeof presetGradients[0]) => {
    setColorStops([
      { id: '1', color: preset.colors[0], position: 0 },
      { id: '2', color: preset.colors[1], position: 100 },
    ]);
  };

  const randomize = () => {
    setColorStops(colorStops.map(stop => ({
      ...stop,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
    })));
    setAngle(Math.floor(Math.random() * 360));
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(generateGradientCSS());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Palette size={18} />
          그라디언트 생성기
        </h3>
        <p className="text-sm text-gray-500 mt-1">아름다운 그라디언트를 만들어보세요</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 프리뷰 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">미리보기</p>
          <div
            className="h-32 rounded-xl shadow-inner"
            style={{ background: generateGradientCSS() }}
          />
        </div>

        {/* 프리셋 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">프리셋</p>
          <div className="grid grid-cols-4 gap-2">
            {presetGradients.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="group relative h-12 rounded-lg overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})`,
                }}
              >
                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {preset.name}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 타입 선택 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">그라디언트 타입</p>
          <div className="flex gap-2">
            <button
              onClick={() => setGradientType('linear')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                gradientType === 'linear'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              선형
            </button>
            <button
              onClick={() => setGradientType('radial')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                gradientType === 'radial'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              방사형
            </button>
          </div>
        </div>

        {/* 각도 (선형만) */}
        {gradientType === 'linear' && (
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-700">각도</label>
              <span className="text-sm font-medium text-gray-800">{angle}°</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value))}
                className="flex-1 accent-primary-500"
              />
              <div
                className="w-8 h-8 rounded-full border-2 border-gray-300"
                style={{
                  background: generateGradientCSS(),
                }}
              >
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div className="w-1 h-3 bg-white rounded-full shadow" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 컬러 스톱 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-500">색상 포인트</p>
            <button
              onClick={addColorStop}
              className="p-1 text-primary-500 hover:bg-primary-50 rounded"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {colorStops.map((stop, index) => (
              <motion.div
                key={stop.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateColorStop(stop.id, { color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
                />
                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) => updateColorStop(stop.id, { color: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono uppercase"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={stop.position}
                    onChange={(e) => updateColorStop(stop.id, { position: parseInt(e.target.value) })}
                    className="w-14 px-2 py-2 border rounded-lg text-sm text-center"
                  />
                  <span className="text-xs text-gray-400">%</span>
                </div>
                {colorStops.length > 2 && (
                  <button
                    onClick={() => removeColorStop(stop.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CSS 출력 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">CSS 코드</p>
          <div className="relative">
            <pre className="p-3 bg-gray-100 rounded-lg text-xs overflow-x-auto font-mono">
              background: {generateGradientCSS()};
            </pre>
            <button
              onClick={copyCSS}
              className="absolute top-2 right-2 p-1.5 bg-white rounded shadow hover:bg-gray-50"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* 하단 액션 */}
      <div className="p-4 border-t flex gap-2">
        <button
          onClick={randomize}
          className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50"
        >
          <Shuffle size={16} />
          랜덤
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
          <Droplet size={16} />
          적용
        </button>
      </div>
    </div>
  );
}

