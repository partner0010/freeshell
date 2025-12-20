'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { GensparkSearch } from '@/components/ai/GensparkSearch';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { AdBanner } from '@/components/ads/AdBanner';

export default function GensparkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <GlobalHeader />

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="text-purple-600" size={32} />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900">
              GENSPARK AI 검색
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI가 실시간으로 맞춤형 페이지를 생성하여 정보를 제공합니다
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <GensparkSearch />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">광고</h3>
                <AdBanner position="sidebar" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

