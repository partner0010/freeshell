'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  Clock,
  Users,
  FileText,
} from 'lucide-react';
import {
  rumSystem,
  type RUMAnalytics,
  type RUMSession,
} from '@/lib/monitoring/rum';

export function RUMPanel() {
  const [analytics, setAnalytics] = useState<RUMAnalytics | null>(null);
  const [sessions, setSessions] = useState<RUMSession[]>([]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // 5초마다 업데이트
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setAnalytics(rumSystem.getAnalytics());
    setSessions(rumSystem.getSessions(10));
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center">
            <Activity className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">실시간 사용자 모니터링</h2>
            <p className="text-sm text-gray-500">RUM - Core Web Vitals 추적</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {analytics ? (
          <div className="space-y-6">
            {/* Core Web Vitals */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Core Web Vitals</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white border rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">LCP</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {analytics.avgLCP.toFixed(0)}ms
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {analytics.avgLCP < 2500 ? '✓ 좋음' : analytics.avgLCP < 4000 ? '⚠ 개선 필요' : '✗ 나쁨'}
                  </div>
                </div>
                <div className="p-4 bg-white border rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">FID</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {analytics.avgFID.toFixed(0)}ms
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {analytics.avgFID < 100 ? '✓ 좋음' : analytics.avgFID < 300 ? '⚠ 개선 필요' : '✗ 나쁨'}
                  </div>
                </div>
                <div className="p-4 bg-white border rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">CLS</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {analytics.avgCLS.toFixed(3)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {analytics.avgCLS < 0.1 ? '✓ 좋음' : analytics.avgCLS < 0.25 ? '⚠ 개선 필요' : '✗ 나쁨'}
                  </div>
                </div>
              </div>
            </section>

            {/* 통계 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-4">사용자 통계</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                  <Users className="text-blue-600 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold text-blue-600">{analytics.sessions}</div>
                  <div className="text-xs text-gray-500">세션</div>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                  <FileText className="text-green-600 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold text-green-600">{analytics.pageViews}</div>
                  <div className="text-xs text-gray-500">페이지뷰</div>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                  <AlertTriangle className="text-red-600 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold text-red-600">
                    {analytics.errorRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">에러율</div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-center">
                  <Clock className="text-purple-600 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold text-purple-600">
                    {formatDuration(analytics.avgSessionDuration)}
                  </div>
                  <div className="text-xs text-gray-500">평균 세션</div>
                </div>
              </div>
            </section>

            {/* 세션 목록 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-4">최근 세션</h3>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div key={session.sessionId} className="p-4 bg-white border rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">
                          {session.sessionId.substring(0, 20)}...
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.pages.length} 페이지 • {session.events.length} 이벤트
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-700">
                          {new Date(session.startTime).toLocaleTimeString()}
                        </div>
                        {session.endTime && (
                          <div className="text-xs text-gray-500">
                            {formatDuration(session.endTime - session.startTime)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Activity className="text-gray-300 mx-auto mb-4" size={64} />
              <p className="text-gray-500 text-lg">데이터 수집 중...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

