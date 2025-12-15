'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Square, Sparkles, RotateCcw, Download, Upload } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

interface ThemePreset {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  font: string;
  borderRadius: string;
}

const themePresets: ThemePreset[] = [
  {
    id: 'pastel-dream',
    name: '파스텔 드림',
    colors: {
      primary: '#8B5CF6',
      secondary: '#D4EDE1',
      accent: '#FF8A80',
      background: '#FAFBFC',
    },
    font: 'Pretendard',
    borderRadius: '16px',
  },
  {
    id: 'ocean-breeze',
    name: '오션 브리즈',
    colors: {
      primary: '#0EA5E9',
      secondary: '#BAE6FD',
      accent: '#F97316',
      background: '#F0F9FF',
    },
    font: 'Pretendard',
    borderRadius: '12px',
  },
  {
    id: 'forest-green',
    name: '포레스트 그린',
    colors: {
      primary: '#059669',
      secondary: '#D1FAE5',
      accent: '#FBBF24',
      background: '#F0FDF4',
    },
    font: 'Pretendard',
    borderRadius: '8px',
  },
  {
    id: 'sunset-glow',
    name: '선셋 글로우',
    colors: {
      primary: '#F43F5E',
      secondary: '#FEE2E2',
      accent: '#8B5CF6',
      background: '#FFF1F2',
    },
    font: 'Pretendard',
    borderRadius: '20px',
  },
  {
    id: 'midnight-dark',
    name: '미드나잇 다크',
    colors: {
      primary: '#6366F1',
      secondary: '#1E1B4B',
      accent: '#22D3EE',
      background: '#0F172A',
    },
    font: 'Pretendard',
    borderRadius: '12px',
  },
  {
    id: 'minimal-mono',
    name: '미니멀 모노',
    colors: {
      primary: '#18181B',
      secondary: '#F4F4F5',
      accent: '#EF4444',
      background: '#FFFFFF',
    },
    font: 'Pretendard',
    borderRadius: '4px',
  },
];

const fontOptions = [
  { id: 'Pretendard', name: 'Pretendard (한글)' },
  { id: 'Noto Sans KR', name: 'Noto Sans (한글)' },
  { id: 'Inter', name: 'Inter' },
  { id: 'Poppins', name: 'Poppins' },
  { id: 'Playfair Display', name: 'Playfair Display' },
  { id: 'Space Grotesk', name: 'Space Grotesk' },
];

const borderRadiusOptions = [
  { id: '0px', name: '없음', preview: 'rounded-none' },
  { id: '4px', name: '작게', preview: 'rounded-sm' },
  { id: '8px', name: '보통', preview: 'rounded' },
  { id: '12px', name: '중간', preview: 'rounded-lg' },
  { id: '16px', name: '크게', preview: 'rounded-xl' },
  { id: '24px', name: '매우 크게', preview: 'rounded-2xl' },
  { id: '9999px', name: '최대', preview: 'rounded-full' },
];

export function ThemeCustomizer() {
  const { project, updateGlobalStyles } = useEditorStore();
  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'typography' | 'spacing'>('presets');

  const [customColors, setCustomColors] = useState({
    primary: project?.globalStyles.primaryColor || '#8B5CF6',
    secondary: project?.globalStyles.secondaryColor || '#D4EDE1',
  });

  const handleApplyPreset = (preset: ThemePreset) => {
    updateGlobalStyles({
      primaryColor: preset.colors.primary,
      secondaryColor: preset.colors.secondary,
      fontFamily: preset.font,
      borderRadius: preset.borderRadius,
    });
    setCustomColors({
      primary: preset.colors.primary,
      secondary: preset.colors.secondary,
    });
  };

  const handleColorChange = (key: 'primary' | 'secondary', value: string) => {
    setCustomColors(prev => ({ ...prev, [key]: value }));
    updateGlobalStyles({
      [key === 'primary' ? 'primaryColor' : 'secondaryColor']: value,
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* 탭 네비게이션 */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-4">
        {[
          { id: 'presets', icon: Sparkles, label: '프리셋' },
          { id: 'colors', icon: Palette, label: '색상' },
          { id: 'typography', icon: Type, label: '타이포' },
          { id: 'spacing', icon: Square, label: '모서리' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`
              flex-1 flex items-center justify-center gap-1 py-2 rounded-md text-xs font-medium
              transition-colors
              ${activeTab === tab.id
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* 프리셋 탭 */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">
              미리 만들어진 테마를 선택하세요
            </p>
            {themePresets.map((preset) => (
              <motion.button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white border-2 border-gray-100 rounded-xl p-4 text-left hover:border-primary-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-800">{preset.name}</span>
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: preset.colors.primary }}
                  />
                </div>
                <div className="flex gap-2">
                  {Object.values(preset.colors).map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 h-8 rounded-lg first:rounded-l-xl last:rounded-r-xl"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* 색상 탭 */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            {/* 주 색상 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주 색상 (Primary)
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                />
                <input
                  type="text"
                  value={customColors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="input-field flex-1 font-mono uppercase"
                />
              </div>
            </div>

            {/* 보조 색상 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보조 색상 (Secondary)
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customColors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                />
                <input
                  type="text"
                  value={customColors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="input-field flex-1 font-mono uppercase"
                />
              </div>
            </div>

            {/* 빠른 색상 팔레트 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                빠른 선택
              </label>
              <div className="grid grid-cols-8 gap-2">
                {[
                  '#EF4444', '#F97316', '#F59E0B', '#84CC16',
                  '#22C55E', '#14B8A6', '#06B6D4', '#0EA5E9',
                  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7',
                  '#D946EF', '#EC4899', '#F43F5E', '#18181B',
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange('primary', color)}
                    className="w-8 h-8 rounded-lg border-2 border-white shadow hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* 미리보기 */}
            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-3">미리보기</p>
              <div className="space-y-2">
                <button
                  className="px-4 py-2 text-white rounded-lg text-sm font-medium"
                  style={{ backgroundColor: customColors.primary }}
                >
                  Primary Button
                </button>
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: customColors.secondary }}
                >
                  <p className="text-sm" style={{ color: customColors.primary }}>
                    Secondary Background
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 타이포그래피 탭 */}
        {activeTab === 'typography' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              웹사이트 전체에 적용될 폰트를 선택하세요
            </p>
            {fontOptions.map((font) => (
              <button
                key={font.id}
                onClick={() => updateGlobalStyles({ fontFamily: font.id })}
                className={`
                  w-full p-4 rounded-xl text-left transition-all
                  ${project?.globalStyles.fontFamily === font.id
                    ? 'bg-primary-100 border-2 border-primary-300'
                    : 'bg-white border-2 border-gray-100 hover:border-primary-200'
                  }
                `}
              >
                <p className="font-medium text-gray-800 mb-1">{font.name}</p>
                <p
                  className="text-2xl text-gray-600"
                  style={{ fontFamily: font.id }}
                >
                  가나다라 ABCD 1234
                </p>
              </button>
            ))}
          </div>
        )}

        {/* 모서리 둥글기 탭 */}
        {activeTab === 'spacing' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              버튼과 카드의 모서리 둥글기를 선택하세요
            </p>
            <div className="grid grid-cols-2 gap-3">
              {borderRadiusOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => updateGlobalStyles({ borderRadius: option.id })}
                  className={`
                    p-4 transition-all
                    ${project?.globalStyles.borderRadius === option.id
                      ? 'bg-primary-100 border-2 border-primary-300'
                      : 'bg-white border-2 border-gray-100 hover:border-primary-200'
                    }
                  `}
                  style={{ borderRadius: option.id }}
                >
                  <div
                    className="w-full h-12 bg-gradient-to-r from-primary-400 to-primary-500 mb-2"
                    style={{ borderRadius: option.id }}
                  />
                  <p className="text-sm font-medium text-gray-700">{option.name}</p>
                  <p className="text-xs text-gray-400">{option.id}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 하단 액션 */}
      <div className="mt-4 pt-4 border-t flex gap-2">
        <button
          onClick={() => {
            updateGlobalStyles({
              primaryColor: '#8B5CF6',
              secondaryColor: '#D4EDE1',
              fontFamily: 'Pretendard',
              borderRadius: '16px',
            });
          }}
          className="flex-1 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
        >
          <RotateCcw size={14} />
          초기화
        </button>
      </div>
    </div>
  );
}

