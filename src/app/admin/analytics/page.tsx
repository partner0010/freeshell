'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
  MousePointer,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// 국가별 방문자 데이터
const countryData = [
  { country: '대한민국', visitors: 45230, percentage: 65 },
  { country: '미국', visitors: 12450, percentage: 18 },
  { country: '일본', visitors: 5670, percentage: 8 },
  { country: '중국', visitors: 3240, percentage: 5 },
  { country: '기타', visitors: 2780, percentage: 4 },
];

// 디바이스별 데이터
const deviceData = [
  { device: 'Desktop', icon: Monitor, percentage: 58, color: 'bg-blue-500' },
  { device: 'Mobile', icon: Smartphone, percentage: 35, color: 'bg-green-500' },
  { device: 'Tablet', icon: Tablet, percentage: 7, color: 'bg-purple-500' },
];

// 인기 페이지
const topPages = [
  { page: '/landing/saas', views: 45230, avgTime: '2:34' },
  { page: '/portfolio/developer', views: 32100, avgTime: '3:12' },
  { page: '/business/corporate', views: 28450, avgTime: '1:58' },
  { page: '/ecommerce/store', views: 21340, avgTime: '4:23' },
  { page: '/blog/personal', views: 18920, avgTime: '2:45' },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">분석</h1>
          <p className="text-gray-500 mt-1">플랫폼 성과를 분석하세요</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-white border rounded-lg text-sm"
          >
            <option value="7d">최근 7일</option>
            <option value="30d">최근 30일</option>
            <option value="90d">최근 90일</option>
            <option value="1y">올해</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
            <Download size={18} />
            보고서 다운로드
          </button>
        </div>
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '총 방문자', value: '284,532', change: '+12.5%', trend: 'up', icon: Users },
          { label: '페이지뷰', value: '1.2M', change: '+8.3%', trend: 'up', icon: Eye },
          { label: '평균 체류 시간', value: '4:32', change: '+15.2%', trend: 'up', icon: Clock },
          { label: '이탈률', value: '32.4%', change: '-5.1%', trend: 'up', icon: MousePointer },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <stat.icon className="text-primary-600" size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 방문자 추이 차트 */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">방문자 추이</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-primary-500 rounded-full" />
                방문자
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full" />
                신규 방문자
              </span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {['월', '화', '수', '목', '금', '토', '일'].map((day, i) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col gap-1">
                  <div
                    className="w-full bg-primary-500 rounded-t"
                    style={{ height: `${Math.random() * 150 + 50}px` }}
                  />
                  <div
                    className="w-full bg-green-500 rounded-b"
                    style={{ height: `${Math.random() * 50 + 20}px` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 디바이스 분포 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">디바이스 분포</h2>
          <div className="space-y-4">
            {deviceData.map((device) => (
              <div key={device.device}>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <device.icon size={16} />
                    {device.device}
                  </span>
                  <span className="text-sm font-medium text-gray-800">{device.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${device.color} rounded-full transition-all`}
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 원형 차트 시뮬레이션 */}
          <div className="mt-8 flex justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                <circle cx="64" cy="64" r="56" stroke="#3B82F6" strokeWidth="12" fill="none" strokeDasharray="204 352" />
                <circle cx="64" cy="64" r="56" stroke="#22C55E" strokeWidth="12" fill="none" strokeDasharray="123 352" strokeDashoffset="-204" />
                <circle cx="64" cy="64" r="56" stroke="#A855F7" strokeWidth="12" fill="none" strokeDasharray="25 352" strokeDashoffset="-327" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 국가별 방문자 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">국가별 방문자</h2>
            <Globe className="text-gray-400" size={20} />
          </div>
          <div className="space-y-4">
            {countryData.map((country) => (
              <div key={country.country} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{country.country}</span>
                    <span className="text-sm text-gray-500">{country.visitors.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-800 w-12 text-right">
                  {country.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 인기 페이지 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">인기 페이지</h2>
            <button className="text-primary-500 text-sm hover:underline">전체 보기</button>
          </div>
          <div className="space-y-4">
            {topPages.map((page, i) => (
              <div key={page.page} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{page.page}</p>
                  <p className="text-xs text-gray-500">평균 체류: {page.avgTime}</p>
                </div>
                <span className="text-sm text-gray-600">{page.views.toLocaleString()} 뷰</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

