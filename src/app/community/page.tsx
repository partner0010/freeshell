/**
 * 커뮤니티 포럼 페이지
 */

'use client';

import React from 'react';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { CommunityForum } from '@/components/community/CommunityForum';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">커뮤니티</h1>
          <p className="text-lg text-gray-600">
            사용자들과 지식을 공유하고 소통하세요
          </p>
        </div>
        <CommunityForum />
      </div>
    </div>
  );
}

