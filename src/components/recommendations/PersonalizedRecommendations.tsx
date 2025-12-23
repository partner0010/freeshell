/**
 * 맞춤형 추천 시스템 컴포넌트
 * 사용자 행동 분석 기반 개인화 추천
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Clock, Heart, Zap } from 'lucide-react';
import Link from 'next/link';

interface Recommendation {
  id: string;
  type: 'feature' | 'content' | 'tool';
  title: string;
  description: string;
  href: string;
  reason: string;
  icon: any;
  score: number;
}

export function PersonalizedRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    // 사용자 행동 분석 기반 추천 생성 (실제로는 API에서 받아옴)
    const userRecommendations: Recommendation[] = [
      {
        id: '1',
        type: 'feature',
        title: 'AI 코드 생성',
        description: '최근 코드 관련 작업을 많이 하셨네요. AI 코드 생성 기능을 추천합니다.',
        href: '/editor',
        reason: '코딩 활동 기반',
        icon: Zap,
        score: 95,
      },
      {
        id: '2',
        type: 'content',
        title: '콘텐츠 생성',
        description: '비슷한 주제의 콘텐츠를 생성해보세요.',
        href: '/creator',
        reason: '관심 주제 분석',
        icon: TrendingUp,
        score: 88,
      },
      {
        id: '3',
        type: 'tool',
        title: '디버깅 도구',
        description: '코드 오류를 빠르게 찾아보세요.',
        href: '/debug',
        reason: '최근 사용 패턴',
        icon: Clock,
        score: 82,
      },
    ];
    setRecommendations(userRecommendations);
  }, []);

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-purple-600" size={20} />
        <h3 className="font-bold text-gray-900">맞춤형 추천</h3>
      </div>
      <div className="space-y-3">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <Link
              key={rec.id}
              href={rec.href}
              className="block p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="text-purple-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                    <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                      {rec.score}% 일치
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{rec.description}</p>
                  <p className="text-xs text-gray-500">{rec.reason}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

