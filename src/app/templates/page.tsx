/**
 * 템플릿 마켓플레이스 페이지
 * 재사용 가능한 템플릿 라이브러리
 */

'use client';

import React from 'react';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { TemplateMarketplace } from '@/components/templates/TemplateMarketplace';

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">템플릿 마켓플레이스</h1>
          <p className="text-lg text-gray-600">
            재사용 가능한 템플릿으로 빠르게 시작하세요
          </p>
        </div>
        <TemplateMarketplace />
      </div>
    </div>
  );
}

