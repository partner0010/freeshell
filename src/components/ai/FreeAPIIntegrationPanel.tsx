'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Play,
  Image,
  Music,
  FileText,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  freeAPIIntegration,
  type AIAPIProvider,
} from '@/lib/ai/free-api-integration';

export function FreeAPIIntegrationPanel() {
  const [providers, setProviders] = useState<AIAPIProvider[]>(freeAPIIntegration.getProviders());
  const [selectedProvider, setSelectedProvider] = useState<string>('huggingface');
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<'text' | 'image' | 'music' | 'emotion'>('text');
  const [result, setResult] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      let generated: any;

      switch (type) {
        case 'text':
          generated = await freeAPIIntegration.generateText(prompt, selectedProvider);
          break;
        case 'image':
          generated = await freeAPIIntegration.generateImage(prompt, selectedProvider);
          break;
        case 'music':
          generated = await freeAPIIntegration.generateMusic(prompt, selectedProvider);
          break;
        case 'emotion':
          generated = await freeAPIIntegration.analyzeEmotion(prompt, selectedProvider);
          break;
      }

      setResult({ success: true, data: generated, type });
    } catch (error) {
      setResult({ success: false, error: String(error), type });
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedProviderInfo = providers.find((p) => p.id === selectedProvider);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">무료 AI API 통합</h2>
            <p className="text-sm text-gray-500">다양한 무료 AI API 활용</p>
          </div>
        </div>

        {/* 타입 선택 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setType('text')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'text'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText size={16} className="inline mr-2" />
            텍스트
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
            이미지
          </button>
          <button
            onClick={() => setType('music')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'music'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Music size={16} className="inline mr-2" />
            음악
          </button>
          <button
            onClick={() => setType('emotion')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'emotion'
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
              지원 기능: {selectedProviderInfo.capabilities.join(', ')}
            </div>
          )}
        </div>

        {/* 프롬프트 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {type === 'text' && '생성할 텍스트'}
            {type === 'image' && '이미지 설명'}
            {type === 'music' && '음악 설명'}
            {type === 'emotion' && '분석할 텍스트'}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              type === 'text'
                ? '텍스트를 입력하세요...'
                : type === 'image'
                ? '이미지를 설명하세요...'
                : type === 'music'
                ? '음악을 설명하세요...'
                : '감정을 분석할 텍스트를 입력하세요...'
            }
            className="w-full px-4 py-3 border rounded-lg resize-none"
            rows={3}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              <Play size={20} />
              생성하기
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {result && (
          <div className={`p-4 rounded-xl border-2 ${
            result.success
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            {result.success ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="text-green-600" size={24} />
                  <span className="font-semibold text-green-800">생성 완료</span>
                </div>
                {result.type === 'text' && (
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-gray-800">{result.data}</div>
                  </div>
                )}
                {result.type === 'image' && (
                  <div className="p-3 bg-white rounded-lg">
                    <img src={result.data} alt="Generated" className="max-w-full rounded" />
                  </div>
                )}
                {result.type === 'music' && (
                  <div className="p-3 bg-white rounded-lg">
                    <audio src={result.data} controls className="w-full" />
                  </div>
                )}
                {result.type === 'emotion' && (
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-gray-800">감정: {result.data.emotion}</div>
                    <div className="text-gray-600">점수: {result.data.score}</div>
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
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">사용 가능한 무료 AI API</h3>
          <div className="grid grid-cols-2 gap-4">
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

