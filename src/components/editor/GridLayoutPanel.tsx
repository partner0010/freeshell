'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  Columns,
  Rows,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  Plus,
  Minus,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';

interface GridSettings {
  columns: number;
  rows: number;
  gap: number;
  padding: number;
  alignItems: string;
  justifyContent: string;
  showGuides: boolean;
  snapToGrid: boolean;
}

const presetLayouts = [
  { name: '2열 균등', cols: [1, 1] },
  { name: '3열 균등', cols: [1, 1, 1] },
  { name: '4열 균등', cols: [1, 1, 1, 1] },
  { name: '사이드바 좌', cols: [1, 3] },
  { name: '사이드바 우', cols: [3, 1] },
  { name: '중앙 강조', cols: [1, 2, 1] },
  { name: '카드 3열', cols: [1, 1, 1] },
  { name: '히어로', cols: [2, 1] },
];

export default function GridLayoutPanel() {
  const [settings, setSettings] = useState<GridSettings>({
    columns: 12,
    rows: 1,
    gap: 16,
    padding: 24,
    alignItems: 'stretch',
    justifyContent: 'start',
    showGuides: true,
    snapToGrid: true,
  });

  const updateSetting = (key: keyof GridSettings, value: number | string | boolean) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <LayoutGrid size={18} />
          그리드 레이아웃
        </h3>
        <p className="text-sm text-gray-500 mt-1">정교한 레이아웃을 설계하세요</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 프리셋 레이아웃 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">프리셋</p>
          <div className="grid grid-cols-4 gap-2">
            {presetLayouts.map((preset) => (
              <button
                key={preset.name}
                className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                title={preset.name}
              >
                <div className="flex gap-0.5 h-8">
                  {preset.cols.map((col, i) => (
                    <div
                      key={i}
                      className="bg-primary-200 group-hover:bg-primary-300 rounded-sm transition-colors"
                      style={{ flex: col }}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 mt-1 truncate">{preset.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 그리드 설정 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">그리드 설정</p>
          <div className="space-y-4">
            {/* 컬럼 수 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-700 flex items-center gap-2">
                  <Columns size={14} />
                  컬럼
                </label>
                <span className="text-sm font-medium text-gray-800">{settings.columns}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateSetting('columns', Math.max(1, settings.columns - 1))}
                  className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="range"
                  min={1}
                  max={24}
                  value={settings.columns}
                  onChange={(e) => updateSetting('columns', parseInt(e.target.value))}
                  className="flex-1 accent-primary-500"
                />
                <button
                  onClick={() => updateSetting('columns', Math.min(24, settings.columns + 1))}
                  className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* 간격 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-700">간격 (Gap)</label>
                <span className="text-sm font-medium text-gray-800">{settings.gap}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={64}
                value={settings.gap}
                onChange={(e) => updateSetting('gap', parseInt(e.target.value))}
                className="w-full accent-primary-500"
              />
            </div>

            {/* 패딩 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-700">패딩</label>
                <span className="text-sm font-medium text-gray-800">{settings.padding}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={96}
                value={settings.padding}
                onChange={(e) => updateSetting('padding', parseInt(e.target.value))}
                className="w-full accent-primary-500"
              />
            </div>
          </div>
        </div>

        {/* 정렬 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">정렬</p>
          
          {/* 수평 정렬 */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-2 block">수평</label>
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              {[
                { value: 'start', icon: AlignLeft },
                { value: 'center', icon: AlignCenter },
                { value: 'end', icon: AlignRight },
                { value: 'space-between', icon: AlignJustify },
              ].map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => updateSetting('justifyContent', value)}
                  className={`
                    flex-1 p-2 rounded-md transition-colors
                    ${settings.justifyContent === value 
                      ? 'bg-white shadow text-primary-600' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  <Icon size={16} className="mx-auto" />
                </button>
              ))}
            </div>
          </div>

          {/* 수직 정렬 */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">수직</label>
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              {[
                { value: 'start', icon: AlignVerticalJustifyStart },
                { value: 'center', icon: AlignVerticalJustifyCenter },
                { value: 'end', icon: AlignVerticalJustifyEnd },
              ].map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => updateSetting('alignItems', value)}
                  className={`
                    flex-1 p-2 rounded-md transition-colors
                    ${settings.alignItems === value 
                      ? 'bg-white shadow text-primary-600' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  <Icon size={16} className="mx-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 옵션 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">옵션</p>
          <div className="space-y-2">
            <button
              onClick={() => updateSetting('showGuides', !settings.showGuides)}
              className={`
                w-full flex items-center justify-between p-3 rounded-xl transition-colors
                ${settings.showGuides ? 'bg-primary-50 text-primary-700' : 'bg-gray-50 text-gray-600'}
              `}
            >
              <span className="flex items-center gap-2 text-sm">
                {settings.showGuides ? <Eye size={16} /> : <EyeOff size={16} />}
                가이드 표시
              </span>
              <span className={`w-8 h-5 rounded-full relative ${settings.showGuides ? 'bg-primary-500' : 'bg-gray-300'}`}>
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
                    settings.showGuides ? 'left-3.5' : 'left-0.5'
                  }`}
                />
              </span>
            </button>

            <button
              onClick={() => updateSetting('snapToGrid', !settings.snapToGrid)}
              className={`
                w-full flex items-center justify-between p-3 rounded-xl transition-colors
                ${settings.snapToGrid ? 'bg-primary-50 text-primary-700' : 'bg-gray-50 text-gray-600'}
              `}
            >
              <span className="flex items-center gap-2 text-sm">
                {settings.snapToGrid ? <Lock size={16} /> : <Unlock size={16} />}
                그리드에 맞추기
              </span>
              <span className={`w-8 h-5 rounded-full relative ${settings.snapToGrid ? 'bg-primary-500' : 'bg-gray-300'}`}>
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
                    settings.snapToGrid ? 'left-3.5' : 'left-0.5'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* 미리보기 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">미리보기</p>
          <div
            className="bg-gray-100 rounded-xl p-4 h-32"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${settings.columns}, 1fr)`,
              gap: `${settings.gap}px`,
              padding: `${settings.padding}px`,
              alignItems: settings.alignItems,
              justifyContent: settings.justifyContent,
            }}
          >
            {Array.from({ length: Math.min(settings.columns, 6) }).map((_, i) => (
              <div
                key={i}
                className="bg-primary-300 rounded-lg h-full min-h-[20px]"
                style={{ opacity: 0.5 + (i * 0.1) }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 하단 액션 */}
      <div className="p-4 border-t">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600">
          <RefreshCw size={16} />
          레이아웃 적용
        </button>
      </div>
    </div>
  );
}

