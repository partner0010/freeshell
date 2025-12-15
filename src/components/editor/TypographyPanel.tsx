'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
  Plus,
  Check,
  Eye,
} from 'lucide-react';

const fontFamilies = [
  { name: 'Pretendard', value: 'Pretendard', category: '산세리프' },
  { name: 'Noto Sans KR', value: 'Noto Sans KR', category: '산세리프' },
  { name: 'Spoqa Han Sans', value: 'Spoqa Han Sans Neo', category: '산세리프' },
  { name: 'IBM Plex Sans KR', value: 'IBM Plex Sans KR', category: '산세리프' },
  { name: 'Nanum Gothic', value: 'Nanum Gothic', category: '산세리프' },
  { name: 'Noto Serif KR', value: 'Noto Serif KR', category: '세리프' },
  { name: 'Nanum Myeongjo', value: 'Nanum Myeongjo', category: '세리프' },
  { name: 'Gmarket Sans', value: 'GmarketSans', category: '디스플레이' },
  { name: '여기어때 잘난체', value: 'yg-jalnan', category: '디스플레이' },
];

const fontWeights = [
  { name: 'Thin', value: 100 },
  { name: 'Light', value: 300 },
  { name: 'Regular', value: 400 },
  { name: 'Medium', value: 500 },
  { name: 'SemiBold', value: 600 },
  { name: 'Bold', value: 700 },
  { name: 'ExtraBold', value: 800 },
  { name: 'Black', value: 900 },
];

interface TextStyle {
  name: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
}

const defaultStyles: TextStyle[] = [
  { name: 'Heading 1', fontFamily: 'Pretendard', fontSize: 48, fontWeight: 700, lineHeight: 1.2, letterSpacing: -0.02 },
  { name: 'Heading 2', fontFamily: 'Pretendard', fontSize: 36, fontWeight: 700, lineHeight: 1.3, letterSpacing: -0.01 },
  { name: 'Heading 3', fontFamily: 'Pretendard', fontSize: 24, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0 },
  { name: 'Body Large', fontFamily: 'Pretendard', fontSize: 18, fontWeight: 400, lineHeight: 1.6, letterSpacing: 0 },
  { name: 'Body', fontFamily: 'Pretendard', fontSize: 16, fontWeight: 400, lineHeight: 1.6, letterSpacing: 0 },
  { name: 'Small', fontFamily: 'Pretendard', fontSize: 14, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0 },
  { name: 'Caption', fontFamily: 'Pretendard', fontSize: 12, fontWeight: 500, lineHeight: 1.4, letterSpacing: 0.02 },
];

export default function TypographyPanel() {
  const [selectedStyle, setSelectedStyle] = useState<string>('Body');
  const [customStyles, setCustomStyles] = useState<TextStyle[]>(defaultStyles);
  const [showFontPicker, setShowFontPicker] = useState(false);
  
  // 현재 선택된 스타일
  const currentStyle = customStyles.find(s => s.name === selectedStyle) || customStyles[4];
  
  const updateStyle = (updates: Partial<TextStyle>) => {
    setCustomStyles(customStyles.map(s =>
      s.name === selectedStyle ? { ...s, ...updates } : s
    ));
  };

  const addCustomStyle = () => {
    const newStyle: TextStyle = {
      name: `Custom ${customStyles.length + 1}`,
      fontFamily: 'Pretendard',
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: 0,
    };
    setCustomStyles([...customStyles, newStyle]);
    setSelectedStyle(newStyle.name);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Type size={18} />
          타이포그래피
        </h3>
        <p className="text-sm text-gray-500 mt-1">폰트와 텍스트 스타일을 관리하세요</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 스타일 선택 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-500">텍스트 스타일</p>
            <button
              onClick={addCustomStyle}
              className="p-1 text-primary-500 hover:bg-primary-50 rounded"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {customStyles.map((style) => (
              <button
                key={style.name}
                onClick={() => setSelectedStyle(style.name)}
                className={`
                  w-full p-3 rounded-xl text-left transition-all
                  ${selectedStyle === style.name
                    ? 'bg-primary-50 border-2 border-primary-300'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: style.fontFamily,
                      fontSize: Math.min(style.fontSize, 24),
                      fontWeight: style.fontWeight,
                    }}
                  >
                    {style.name}
                  </span>
                  <span className="text-xs text-gray-400">{style.fontSize}px</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 미리보기 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">미리보기</p>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p
              style={{
                fontFamily: currentStyle.fontFamily,
                fontSize: currentStyle.fontSize,
                fontWeight: currentStyle.fontWeight,
                lineHeight: currentStyle.lineHeight,
                letterSpacing: `${currentStyle.letterSpacing}em`,
              }}
            >
              블록을 쌓듯이 웹사이트를 만드세요
            </p>
          </div>
        </div>

        {/* 폰트 패밀리 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">폰트</p>
          <div className="relative">
            <button
              onClick={() => setShowFontPicker(!showFontPicker)}
              className="w-full flex items-center justify-between px-4 py-3 border rounded-xl hover:bg-gray-50"
            >
              <span style={{ fontFamily: currentStyle.fontFamily }}>
                {fontFamilies.find(f => f.value === currentStyle.fontFamily)?.name || currentStyle.fontFamily}
              </span>
              <ChevronDown size={16} className={`transition-transform ${showFontPicker ? 'rotate-180' : ''}`} />
            </button>
            
            {showFontPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-10 w-full mt-2 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto"
              >
                {Object.entries(
                  fontFamilies.reduce((acc, font) => {
                    if (!acc[font.category]) acc[font.category] = [];
                    acc[font.category].push(font);
                    return acc;
                  }, {} as Record<string, typeof fontFamilies>)
                ).map(([category, fonts]) => (
                  <div key={category}>
                    <div className="px-4 py-2 text-xs font-medium text-gray-400 bg-gray-50">
                      {category}
                    </div>
                    {fonts.map((font) => (
                      <button
                        key={font.value}
                        onClick={() => {
                          updateStyle({ fontFamily: font.value });
                          setShowFontPicker(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                        style={{ fontFamily: font.value }}
                      >
                        {font.name}
                        {currentStyle.fontFamily === font.value && (
                          <Check size={16} className="text-primary-500" />
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* 폰트 크기 */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-700">크기</label>
            <span className="text-sm font-medium text-gray-800">{currentStyle.fontSize}px</span>
          </div>
          <input
            type="range"
            min={10}
            max={96}
            value={currentStyle.fontSize}
            onChange={(e) => updateStyle({ fontSize: parseInt(e.target.value) })}
            className="w-full accent-primary-500"
          />
        </div>

        {/* 폰트 굵기 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">굵기</p>
          <div className="grid grid-cols-4 gap-1">
            {fontWeights.map((weight) => (
              <button
                key={weight.value}
                onClick={() => updateStyle({ fontWeight: weight.value })}
                className={`
                  py-2 px-1 rounded text-xs transition-colors
                  ${currentStyle.fontWeight === weight.value
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                  }
                `}
                style={{ fontWeight: weight.value }}
              >
                {weight.value}
              </button>
            ))}
          </div>
        </div>

        {/* 줄 높이 */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-700">줄 높이</label>
            <span className="text-sm font-medium text-gray-800">{currentStyle.lineHeight}</span>
          </div>
          <input
            type="range"
            min={1}
            max={2.5}
            step={0.1}
            value={currentStyle.lineHeight}
            onChange={(e) => updateStyle({ lineHeight: parseFloat(e.target.value) })}
            className="w-full accent-primary-500"
          />
        </div>

        {/* 자간 */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-700">자간</label>
            <span className="text-sm font-medium text-gray-800">{currentStyle.letterSpacing}em</span>
          </div>
          <input
            type="range"
            min={-0.1}
            max={0.2}
            step={0.01}
            value={currentStyle.letterSpacing}
            onChange={(e) => updateStyle({ letterSpacing: parseFloat(e.target.value) })}
            className="w-full accent-primary-500"
          />
        </div>

        {/* 텍스트 스타일 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">스타일</p>
          <div className="flex gap-2">
            <button className="flex-1 p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
              <Bold size={18} className="mx-auto" />
            </button>
            <button className="flex-1 p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
              <Italic size={18} className="mx-auto" />
            </button>
            <button className="flex-1 p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
              <Underline size={18} className="mx-auto" />
            </button>
          </div>
        </div>

        {/* 정렬 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">정렬</p>
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {[AlignLeft, AlignCenter, AlignRight, AlignJustify].map((Icon, i) => (
              <button
                key={i}
                className="flex-1 p-2 rounded-md hover:bg-white transition-colors"
              >
                <Icon size={18} className="mx-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 */}
      <div className="p-4 border-t">
        <button className="w-full flex items-center justify-center gap-2 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600">
          <Check size={16} />
          스타일 적용
        </button>
      </div>
    </div>
  );
}

