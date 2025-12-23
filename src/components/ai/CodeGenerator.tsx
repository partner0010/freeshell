/**
 * AI 코드 생성 컴포넌트 (커서 스타일)
 * 소스 코드 개발 기능
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Copy, Download, Play, Sparkles, Loader2, CheckCircle } from 'lucide-react';

interface CodeSnippet {
  language: string;
  code: string;
  filename?: string;
}

export function CodeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState<CodeSnippet[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedCode([]);

    try {
      const response = await fetch('/api/ai/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('코드 생성 실패');
      }

      const data = await response.json();
      setGeneratedCode(data.code || []);
    } catch (error: any) {
      console.error('코드 생성 오류:', error);
      alert(`코드 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = (code: CodeSnippet) => {
    const blob = new Blob([code.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = code.filename || `code.${code.language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Code className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI 코드 생성</h3>
            <p className="text-sm text-gray-500">원하는 기능을 설명하면 코드를 생성해드립니다</p>
          </div>
        </div>

        {/* 입력 영역 */}
        <div className="mb-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="예: React로 사용자 로그인 폼을 만들어줘"
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleGenerate();
              }
            }}
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Ctrl/Cmd + Enter로 생성
            </p>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>생성 중...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>코드 생성</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 생성된 코드 */}
        {generatedCode.length > 0 && (
          <div className="space-y-4">
            {generatedCode.map((snippet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* 코드 헤더 */}
                <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Code size={16} className="text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      {snippet.filename || `code.${snippet.language}`}
                    </span>
                    <span className="text-xs text-gray-500">({snippet.language})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(snippet.code, index)}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      title="복사"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle className="text-green-600" size={18} />
                      ) : (
                        <Copy className="text-gray-600" size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDownload(snippet)}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      title="다운로드"
                    >
                      <Download className="text-gray-600" size={18} />
                    </button>
                  </div>
                </div>

                {/* 코드 내용 */}
                <div className="bg-gray-900 p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-100 font-mono">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 예시 프롬프트 */}
        {generatedCode.length === 0 && !isGenerating && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-semibold text-gray-700 mb-2">예시 프롬프트:</p>
            <div className="space-y-2">
              {[
                'React로 Todo 앱 만들기',
                'Node.js Express API 서버 생성',
                'TypeScript로 유틸리티 함수 작성',
                'Tailwind CSS로 반응형 카드 컴포넌트',
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(example)}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-white hover:text-purple-600 rounded-lg transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

