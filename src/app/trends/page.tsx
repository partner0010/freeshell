'use client';

import React from 'react';
import { Trends2025Features } from '@/components/trends/2025Features';
import { SNSTrendMonitor } from '@/components/trends/SNSTrendMonitor';
import { GlobalHeader } from '@/components/layout/GlobalHeader';

export default function TrendsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <GlobalHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
            2025년 최신 트렌드
          </h1>
          <p className="text-gray-600 text-center">
            미래지향적인 기능과 기술을 지금 바로 경험하세요
          </p>
        </div>
        
        <SNSTrendMonitor />
        <Trends2025Features />
      </div>
    </div>
  );
}

