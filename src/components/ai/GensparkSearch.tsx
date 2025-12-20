'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Loader2, ExternalLink, FileText, Image as ImageIcon, Code } from 'lucide-react';
import { generateSparkPage, type SparkPage, type SearchQuery } from '@/lib/ai/genspark';
import { Card } from '@/components/ui/Card';

export function GensparkSearch() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sparkPage, setSparkPage] = useState<SparkPage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim() || isSearching) return;

    setIsSearching(true);
    setError(null);
    setSparkPage(null);

    try {
      const searchQuery: SearchQuery = {
        query: query.trim(),
        language: 'ko',
        maxResults: 10,
        includeImages: true,
        includeCode: true,
      };

      const page = await generateSparkPage(searchQuery);
      setSparkPage(page);
    } catch (err: any) {
      setError(err.message || '검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* 검색 입력 */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20" />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-purple-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">GENSPARK AI 검색</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  AI가 실시간으로 맞춤형 페이지를 생성합니다
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="검색어를 입력하세요..."
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isSearching || !query.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        검색 중...
                      </>
                    ) : (
                      <>
                        <Search size={20} />
                        검색
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 에러 표시 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 스파크 페이지 결과 */}
      <AnimatePresence>
        {sparkPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6"
          >
            {/* 페이지 헤더 */}
            <Card className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{sparkPage.title}</h1>
              <p className="text-sm text-gray-500">
                생성 시간: {sparkPage.generatedAt.toLocaleString('ko-KR')}
              </p>
            </Card>

            {/* 섹션들 */}
            {sparkPage.sections.map((section, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {section.type === 'text' && <FileText className="text-purple-600" size={20} />}
                  {section.type === 'image' && <ImageIcon className="text-purple-600" size={20} />}
                  {section.type === 'code' && <Code className="text-purple-600" size={20} />}
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <div className="prose max-w-none">
                  {section.type === 'list' ? (
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {section.content.split('\n').map((item, i) => (
                        <li key={i}>{item.trim()}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-700 whitespace-pre-wrap">{section.content}</div>
                  )}
                </div>
              </Card>
            ))}

            {/* 출처 */}
            {sparkPage.sources.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">참고 출처</h2>
                <div className="space-y-3">
                  {sparkPage.sources.map((source, index) => (
                    <motion.a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{source.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{source.snippet}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>관련도: {(source.relevance * 100).toFixed(0)}%</span>
                            <span>•</span>
                            <span className="text-purple-600">{source.url}</span>
                          </div>
                        </div>
                        <ExternalLink className="text-gray-400 flex-shrink-0 ml-4" size={20} />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 빈 상태 */}
      {!sparkPage && !isSearching && !error && (
        <div className="text-center py-12">
          <Sparkles className="text-gray-400 mx-auto mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">GENSPARK AI 검색</h3>
          <p className="text-gray-600">
            검색어를 입력하면 AI가 실시간으로 맞춤형 페이지를 생성합니다
          </p>
        </div>
      )}
    </div>
  );
}

