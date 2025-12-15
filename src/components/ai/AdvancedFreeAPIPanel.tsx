'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Image,
  Music,
  FileText,
  Mic,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import {
  advancedFreeAPIs,
  type AdvancedAIProvider,
} from '@/lib/ai/advanced-free-apis';

export function AdvancedFreeAPIPanel() {
  const [providers, setProviders] = useState<AdvancedAIProvider[]>(
    advancedFreeAPIs.getProviders()
  );
  const [selectedProvider, setSelectedProvider] = useState<string>('deepai');
  const [type, setType] = useState<'style' | 'summarize' | 'image' | 'tts' | 'sentiment'>('style');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      let processed: any;

      switch (type) {
        case 'style':
          processed = await advancedFreeAPIs.styleTransfer(input, 'artistic');
          break;
        case 'summarize':
          processed = await advancedFreeAPIs.summarizeText(input);
          break;
        case 'image':
          processed = await advancedFreeAPIs.generateStableImage(input);
          break;
        case 'tts':
          processed = await advancedFreeAPIs.textToSpeech(input);
          break;
        case 'sentiment':
          processed = await advancedFreeAPIs.analyzeSentiment(input);
          break;
      }

      setResult({ success: true, data: processed, type });
    } catch (error) {
      setResult({ success: false, error: String(error), type });
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedProviderInfo = providers.find((p) => p.id === selectedProvider);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">고급 무료 AI API</h2>
            <p className="text-sm text-gray-500">최신 무료 AI API 활용</p>
          </div>
        </div>

        {/* 타입 선택 */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setType('style')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'style'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Image size={16} className="inline mr-2" />
            스타일 변환
          </button>
          <button
            onClick={() => setType('summarize')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'summarize'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText size={16} className="inline mr-2" />
            텍스트 요약
          </button>
          <button
            onClick={() => setType('image')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'image'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Image size={16} className="inline mr-2" />
            이미지 생성
          </button>
          <button
            onClick={() => setType('tts')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'tts'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Mic size={16} className="inline mr-2" />
            음성 합성
          </button>
          <button
            onClick={() => setType('sentiment')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'sentiment'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            감정 분석
          </button>
        </div>

        {/* 프로바이더 선택 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">AI 프로바이더</label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name} {provider.freeTier.enabled && '(무료)'}
              </option>
            ))}
          </select>
          {selectedProviderInfo && (
            <div className="mt-2 text-xs text-gray-500">
              카테고리: {selectedProviderInfo.category} | 기능: {selectedProviderInfo.capabilities.join(', ')}
            </div>
          )}
        </div>

        {/* 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {type === 'style' && '이미지 URL'}
            {type === 'summarize' && '요약할 텍스트'}
            {type === 'image' && '이미지 설명'}
            {type === 'tts' && '음성으로 변환할 텍스트'}
            {type === 'sentiment' && '감정 분석할 텍스트'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              type === 'style'
                ? '이미지 URL을 입력하세요...'
                : type === 'summarize'
                ? '요약할 텍스트를 입력하세요...'
                : type === 'image'
                ? '이미지를 설명하세요...'
                : type === 'tts'
                ? '음성으로 변환할 텍스트를 입력하세요...'
                : '감정을 분석할 텍스트를 입력하세요...'
            }
            className="w-full px-4 py-3 border rounded-lg resize-none"
            rows={3}
          />
        </div>

        <button
          onClick={handleProcess}
          disabled={isProcessing || !input.trim()}
          className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              처리 중...
            </>
          ) : (
            <>
              <Play size={20} />
              처리하기
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {result && (
          <div className={`p-4 rounded-xl border-2 mb-6 ${
            result.success
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            {result.success ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="text-green-600" size={24} />
                  <span className="font-semibold text-green-800">처리 완료</span>
                </div>
                {result.type === 'image' && (
                  <div className="p-3 bg-white rounded-lg">
                    <img src={result.data} alt="Generated" className="max-w-full rounded" />
                  </div>
                )}
                {result.type === 'tts' && (
                  <div className="p-3 bg-white rounded-lg">
                    <audio src={result.data} controls className="w-full" />
                  </div>
                )}
                {result.type === 'sentiment' && (
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-gray-800">감정: {result.data.label}</div>
                    <div className="text-gray-600">점수: {result.data.score}</div>
                  </div>
                )}
                {!['image', 'tts', 'sentiment'].includes(result.type) && (
                  <div className="p-3 bg-white rounded-lg text-gray-800">
                    {result.data}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-red-600" size={24} />
                <span className="text-red-800">{result.error}</span>
              </div>
            )}
          </div>
        )}

        {/* 프로바이더 목록 */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">추가 무료 AI API</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className={`p-4 border rounded-xl ${
                  provider.id === selectedProvider
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="font-semibold text-gray-800 mb-1">{provider.name}</div>
                <div className="text-xs text-gray-600 mb-2">
                  카테고리: {provider.category}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {provider.capabilities.join(', ')}
                </div>
                {provider.freeTier.enabled && (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                    무료 사용 가능
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

