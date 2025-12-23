/**
 * 사용자 분석 페이지
 * 사용자 행동 추적 및 인사이트
 */

'use client';

import React from 'react';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { UserAnalytics } from '@/components/analytics/UserAnalytics';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">사용자 분석</h1>
          <p className="text-lg text-gray-600">
            사용자 행동을 분석하고 인사이트를 얻으세요
          </p>
        </div>
        <UserAnalytics />
      </div>
    </div>
  );
}

