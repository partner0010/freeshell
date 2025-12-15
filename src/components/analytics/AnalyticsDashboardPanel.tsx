'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, Eye, Clock, Target, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { analyticsDashboard, type AnalyticsData, type AnalyticsMetric } from '@/lib/analytics/analytics-dashboard';

export function AnalyticsDashboardPanel() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const analyticsData = await analyticsDashboard.getAnalyticsData(timeRange);
      setData(analyticsData);
      const calculatedMetrics = analyticsDashboard.calculateMetrics(analyticsData);
      setMetrics(calculatedMetrics);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'day', label: '일간' },
    { id: 'week', label: '주간' },
    { id: 'month', label: '월간' },
    { id: 'year', label: '연간' },
  ];

  if (isLoading || !data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">분석 대시보드</h2>
            <p className="text-sm text-gray-500">통합 웹사이트 분석 및 통계</p>
          </div>
        </div>
        <Tabs tabs={tabs} activeTab={timeRange} onChange={(tab) => setTimeRange(tab as typeof timeRange)} />
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* 메트릭 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{metric.name}</span>
                  {metric.trend === 'up' ? (
                    <TrendingUp size={16} className="text-green-500" />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown size={16} className="text-red-500" />
                  ) : null}
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {typeof metric.value === 'number' && metric.value > 1000
                    ? (metric.value / 1000).toFixed(1) + 'K'
                    : metric.value}
                </div>
                <div
                  className={`text-xs ${
                    metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.change >= 0 ? '+' : ''}
                  {metric.change.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 방문자 통계 */}
        <Card>
          <CardHeader>
            <CardTitle>방문자 통계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Users className="mx-auto mb-2 text-blue-500" size={32} />
                <div className="text-2xl font-bold text-gray-800">{data.visitors.total}</div>
                <div className="text-sm text-gray-500">총 방문자</div>
              </div>
              <div className="text-center">
                <Users className="mx-auto mb-2 text-green-500" size={32} />
                <div className="text-2xl font-bold text-gray-800">{data.visitors.unique}</div>
                <div className="text-sm text-gray-500">신규 방문자</div>
              </div>
              <div className="text-center">
                <Users className="mx-auto mb-2 text-purple-500" size={32} />
                <div className="text-2xl font-bold text-gray-800">{data.visitors.returning}</div>
                <div className="text-sm text-gray-500">재방문자</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 디바이스 분포 */}
        <Card>
          <CardHeader>
            <CardTitle>디바이스 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor size={20} className="text-blue-500" />
                  <span>데스크톱</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(data.devices.desktop / (data.devices.desktop + data.devices.mobile + data.devices.tablet)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{data.devices.desktop}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone size={20} className="text-green-500" />
                  <span>모바일</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(data.devices.mobile / (data.devices.desktop + data.devices.mobile + data.devices.tablet)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{data.devices.mobile}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tablet size={20} className="text-purple-500" />
                  <span>태블릿</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{
                        width: `${(data.devices.tablet / (data.devices.desktop + data.devices.mobile + data.devices.tablet)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{data.devices.tablet}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 유입 경로 */}
        <Card>
          <CardHeader>
            <CardTitle>유입 경로</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.referrers.map((referrer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{referrer.source}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (referrer.visitors /
                              data.referrers.reduce((sum, r) => sum + r.visitors, 0)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-16 text-right">
                      {referrer.visitors}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

