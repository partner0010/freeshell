'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Image,
  Wand2,
  RefreshCw,
  Download,
  Check,
  Loader2,
  Settings,
  Palette,
  Maximize2,
  Square,
  RectangleHorizontal,
  RectangleVertical,
} from 'lucide-react';

const stylePresets = [
  { id: 'realistic', name: '사실적', preview: '📷' },
  { id: 'illustration', name: '일러스트', preview: '🎨' },
  { id: '3d', name: '3D 렌더', preview: '🧊' },
  { id: 'anime', name: '애니메이션', preview: '🎌' },
  { id: 'minimalist', name: '미니멀', preview: '⬜' },
  { id: 'vintage', name: '빈티지', preview: '📜' },
  { id: 'watercolor', name: '수채화', preview: '🎨' },
  { id: 'neon', name: '네온', preview: '🌈' },
];

const aspectRatios = [
  { id: '1:1', name: '정사각형', icon: Square, size: '1024x1024' },
  { id: '16:9', name: '가로', icon: RectangleHorizontal, size: '1792x1024' },
  { id: '9:16', name: '세로', icon: RectangleVertical, size: '1024x1792' },
];

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

export default function AIImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const promptSuggestions = [
    '현대적인 사무실 인테리어, 밝은 조명',
    '아름다운 해변 석양, 야자수 실루엣',
    '미니멀한 제품 사진, 흰색 배경',
    '추상적인 기하학적 패턴, 파스텔 색상',
    '친근한 팀 협업 일러스트레이션',
  ];

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // 실제로는 AI API 호출
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 더미 결과
    const newImage: GeneratedImage = {
      id: Date.now().toString(),
      url: `https://picsum.photos/seed/${Date.now()}/800/600`,
      prompt: prompt,
    };
    
    setGeneratedImages([newImage, ...generatedImages]);
    setIsGenerating(false);
  };

  const applyImage = () => {
    if (selectedImage) {
      console.log('Apply image:', selectedImage);
      // 선택된 블록에 이미지 적용
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles size={18} />
          AI 이미지 생성
        </h3>
        <p className="text-sm text-white/80 mt-1">텍스트로 이미지를 만들어보세요</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 프롬프트 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이미지 설명
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="원하는 이미지를 설명해주세요..."
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 h-24 resize-none"
          />
          
          {/* 제안 프롬프트 */}
          <div className="mt-2 flex flex-wrap gap-1">
            {promptSuggestions.slice(0, 3).map((suggestion, i) => (
              <button
                key={i}
                onClick={() => setPrompt(suggestion)}
                className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200"
              >
                {suggestion.substring(0, 20)}...
              </button>
            ))}
          </div>
        </div>

        {/* 스타일 선택 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">스타일</p>
          <div className="grid grid-cols-4 gap-2">
            {stylePresets.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`
                  p-3 rounded-xl border-2 transition-all text-center
                  ${selectedStyle === style.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <span className="text-2xl">{style.preview}</span>
                <p className="text-xs text-gray-600 mt-1">{style.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 비율 선택 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">비율</p>
          <div className="flex gap-2">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => setAspectRatio(ratio.id)}
                className={`
                  flex-1 p-3 rounded-xl border-2 transition-all text-center
                  ${aspectRatio === ratio.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <ratio.icon size={24} className="mx-auto text-gray-600" />
                <p className="text-xs text-gray-600 mt-1">{ratio.name}</p>
                <p className="text-[10px] text-gray-400">{ratio.size}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 생성 버튼 */}
        <button
          onClick={generateImage}
          disabled={!prompt.trim() || isGenerating}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              <Wand2 size={18} />
              이미지 생성
            </>
          )}
        </button>

        {/* 생성된 이미지 */}
        {generatedImages.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-3">생성된 이미지</p>
            <div className="grid grid-cols-2 gap-2">
              {generatedImages.map((img) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`
                    relative aspect-square rounded-xl overflow-hidden cursor-pointer
                    ${selectedImage === img.id ? 'ring-4 ring-primary-500' : ''}
                  `}
                  onClick={() => setSelectedImage(img.id)}
                >
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-opacity flex gap-2">
                      <button className="p-2 bg-white rounded-full shadow">
                        <Maximize2 size={16} />
                      </button>
                      <button className="p-2 bg-white rounded-full shadow">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                  {selectedImage === img.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 로딩 스켈레톤 */}
        {isGenerating && (
          <div className="grid grid-cols-2 gap-2">
            <div className="aspect-square rounded-xl bg-gray-200 animate-pulse" />
          </div>
        )}
      </div>

      {/* 적용 버튼 */}
      {selectedImage && (
        <div className="p-4 border-t">
          <button
            onClick={applyImage}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600"
          >
            <Check size={18} />
            이미지 적용
          </button>
        </div>
      )}
    </div>
  );
}

