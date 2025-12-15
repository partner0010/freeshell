'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Square, Layers, Maximize } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

const colorPresets = [
  { name: '라벤더', value: '#E8E0F0', class: 'bg-pastel-lavender' },
  { name: '민트', value: '#D4EDE1', class: 'bg-pastel-mint' },
  { name: '피치', value: '#FCDEDE', class: 'bg-pastel-peach' },
  { name: '스카이', value: '#D6EAF8', class: 'bg-pastel-sky' },
  { name: '크림', value: '#FDF6E3', class: 'bg-pastel-cream' },
  { name: '로즈', value: '#F5D7E3', class: 'bg-pastel-rose' },
  { name: '세이지', value: '#D5E5D5', class: 'bg-pastel-sage' },
  { name: '라일락', value: '#E8D5E8', class: 'bg-pastel-lilac' },
  { name: '화이트', value: '#FFFFFF', class: 'bg-white' },
  { name: '다크', value: '#1F2937', class: 'bg-gray-800' },
];

const paddingOptions = [
  { label: '없음', value: 'p-0' },
  { label: '작게', value: 'py-4 px-6' },
  { label: '보통', value: 'py-8 px-6' },
  { label: '크게', value: 'py-16 px-6' },
  { label: '매우 크게', value: 'py-24 px-6' },
];

const alignmentOptions = [
  { label: '왼쪽', value: 'left', icon: 'AlignLeft' },
  { label: '가운데', value: 'center', icon: 'AlignCenter' },
  { label: '오른쪽', value: 'right', icon: 'AlignRight' },
];

const widthOptions = [
  { label: '전체', value: 'full' },
  { label: '컨테이너', value: 'container' },
  { label: '좁게', value: 'narrow' },
];

export function StylePanel() {
  const { selectedBlockId, getBlockById, updateBlock, project, updateGlobalStyles } = useEditorStore();
  const selectedBlock = selectedBlockId ? getBlockById(selectedBlockId) : null;

  if (!selectedBlock) {
    return (
      <div className="h-full flex flex-col">
        <GlobalStylesPanel />
      </div>
    );
  }

  const handleStyleChange = (key: string, value: string) => {
    updateBlock(selectedBlock.id, {
      styles: { ...selectedBlock.styles, [key]: value },
    });
  };

  return (
    <div className="h-full overflow-y-auto space-y-6">
      {/* 선택된 블록 정보 */}
      <div className="bg-gradient-to-r from-primary-100 to-pastel-sky rounded-xl p-4">
        <p className="text-sm text-primary-600 font-medium">선택된 블록</p>
        <p className="text-lg font-semibold text-gray-800 capitalize">{selectedBlock.type}</p>
      </div>

      {/* 배경색 */}
      <div>
        <h4 className="flex items-center gap-2 font-medium text-gray-700 mb-3">
          <Palette size={18} />
          배경색
        </h4>
        <div className="grid grid-cols-5 gap-2">
          {colorPresets.map((color) => (
            <button
              key={color.value}
              onClick={() => handleStyleChange('backgroundColor', color.class)}
              className={`
                w-10 h-10 rounded-xl border-2 transition-all
                ${color.class}
                ${selectedBlock.styles.backgroundColor === color.class
                  ? 'border-primary-500 scale-110 shadow-soft'
                  : 'border-transparent hover:scale-105'
                }
              `}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* 여백 */}
      <div>
        <h4 className="flex items-center gap-2 font-medium text-gray-700 mb-3">
          <Square size={18} />
          여백
        </h4>
        <div className="flex flex-wrap gap-2">
          {paddingOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStyleChange('padding', option.value)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${selectedBlock.styles.padding === option.value
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 정렬 */}
      <div>
        <h4 className="flex items-center gap-2 font-medium text-gray-700 mb-3">
          <Type size={18} />
          정렬
        </h4>
        <div className="flex gap-2">
          {alignmentOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStyleChange('alignment', option.value)}
              className={`
                flex-1 py-3 rounded-lg text-sm font-medium transition-all
                ${selectedBlock.styles.alignment === option.value
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 너비 */}
      <div>
        <h4 className="flex items-center gap-2 font-medium text-gray-700 mb-3">
          <Maximize size={18} />
          너비
        </h4>
        <div className="flex gap-2">
          {widthOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStyleChange('width', option.value)}
              className={`
                flex-1 py-3 rounded-lg text-sm font-medium transition-all
                ${selectedBlock.styles.width === option.value
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function GlobalStylesPanel() {
  const { project, updateGlobalStyles } = useEditorStore();

  if (!project) return null;

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-pastel-lavender rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Layers className="text-primary-500" size={32} />
        </div>
        <h3 className="font-semibold text-gray-800 mb-2">블록을 선택하세요</h3>
        <p className="text-sm text-gray-500">
          캔버스에서 블록을 클릭하여 스타일을 편집할 수 있습니다
        </p>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-700 mb-4">전역 스타일</h4>
        
        {/* 주 색상 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">주 색상</label>
          <div className="grid grid-cols-5 gap-2">
            {['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'].map((color) => (
              <button
                key={color}
                onClick={() => updateGlobalStyles({ primaryColor: color })}
                className={`
                  w-10 h-10 rounded-xl border-2 transition-all
                  ${project.globalStyles.primaryColor === color
                    ? 'border-gray-800 scale-110'
                    : 'border-transparent hover:scale-105'
                  }
                `}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* 모서리 둥글기 */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">모서리 둥글기</label>
          <div className="flex gap-2">
            {['8px', '12px', '16px', '20px', '24px'].map((radius) => (
              <button
                key={radius}
                onClick={() => updateGlobalStyles({ borderRadius: radius })}
                className={`
                  flex-1 py-2 border-2 transition-all text-sm
                  ${project.globalStyles.borderRadius === radius
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                  }
                `}
                style={{ borderRadius: radius }}
              >
                {parseInt(radius)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

