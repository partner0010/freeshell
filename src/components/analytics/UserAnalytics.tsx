/**
 * 사용자 분석 대시보드 컴포넌트
 * 사용자 행동 추적 및 인사이트
 */

'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Clock, MousePointerClick, Eye, Activity } from 'lucide-react';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ path: string; views: number }>;
  userFlow: Array<{ step: string; users: number }>;
}

export function UserAnalytics() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [analytics] = useState<AnalyticsData>({
    pageViews: 12580,
    uniqueVisitors: 3420,
    averageSessionDuration: 245, // 초
    bounceRate: 32.5,
    topPages: [
      { path: '/', views: 4520 },
      { path: '/editor', views: 3120 },
      { path: '/creator', views: 2890 },
      { path: '/genspark', views: 2050 },
    ],
    userFlow: [
      { step: '방문', users: 1000 },
      { step: '에디터', users: 650 },
      { step: '콘텐츠 생성', users: 420 },
      { step: '완료', users: 280 },
    ],
  });

  const metrics = [
    {
      label: '페이지 뷰',
      value: analytics.pageViews.toLocaleString(),
      change: '+12.5%',
      icon: Eye,
      color: 'blue',
    },
    {
      label: '순 방문자',
      value: analytics.uniqueVisitors.toLocaleString(),
      change: '+8.3%',
      icon: Users,
      color: 'green',
    },
    {
      label: '평균 세션 시간',
      value: `${Math.floor(analytics.averageSessionDuration / 60)}분 ${analytics.averageSessionDuration % 60}초`,
      change: '+5.2%',
      icon: Clock,
      color: 'purple',
    },
    {
      label: '이탈률',
      value: `${analytics.bounceRate}%`,
      change: '-2.1%',
      icon: Activity,
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 시간 범위 선택 */}
      <div className="flex gap-2">
        {[
          { id: 'day', label: '오늘' },
          { id: 'week', label: '이번 주' },
          { id: 'month', label: '이번 달' },
        ].map((range) => (
          <button
            key={range.id}
            onClick={() => setTimeRange(range.id as any)}
            className={`px-4 py-2 rounded-lg border-2 transition-all ${
              timeRange === range.id
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* 주요 지표 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`text-${metric.color}-600`} size={24} />
                </div>
                <span className={`text-sm font-medium ${
                  metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-sm text-gray-600">{metric.label}</p>
            </div>
          );
        })}
      </div>

      {/* 인기 페이지 */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="text-purple-600" size={20} />
          인기 페이지
        </h3>
        <div className="space-y-3">
          {analytics.topPages.map((page, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{page.path}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${(page.views / analytics.topPages[0].views) * 100}%` }}
                  />
                </div>
              </div>
              <span className="ml-4 font-semibold text-gray-900">{page.views.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 사용자 플로우 */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="text-purple-600" size={20} />
          사용자 플로우
        </h3>
        <div className="space-y-4">
          {analytics.userFlow.map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-purple-600">{i + 1}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">{step.step}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${(step.users / analytics.userFlow[0].users) * 100}%` }}
                  />
                </div>
              </div>
              <span className="font-semibold text-gray-900">{step.users}명</span>
              {i < analytics.userFlow.length - 1 && (
                <div className="text-gray-400">↓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

