'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FolderKanban,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Activity,
  Zap,
} from 'lucide-react';

// 통계 카드 데이터
const stats = [
  {
    title: '총 사용자',
    value: '12,847',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: '활성 프로젝트',
    value: '3,429',
    change: '+8.2%',
    trend: 'up',
    icon: FolderKanban,
    color: 'from-green-500 to-green-600',
  },
  {
    title: '월간 수익',
    value: '₩45.2M',
    change: '+23.1%',
    trend: 'up',
    icon: CreditCard,
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: '전환율',
    value: '4.28%',
    change: '-0.3%',
    trend: 'down',
    icon: TrendingUp,
    color: 'from-orange-500 to-orange-600',
  },
];

// 최근 활동 데이터
const recentActivities = [
  { id: 1, user: '김철수', action: '새 프로젝트 생성', project: '랜딩 페이지', time: '2분 전' },
  { id: 2, user: '이영희', action: 'Pro 플랜 업그레이드', project: '-', time: '15분 전' },
  { id: 3, user: '박민수', action: '템플릿 다운로드', project: 'SaaS 랜딩', time: '32분 전' },
  { id: 4, user: '정지원', action: '웹사이트 게시', project: '포트폴리오', time: '1시간 전' },
  { id: 5, user: '최현우', action: '회원 가입', project: '-', time: '2시간 전' },
];

// 인기 템플릿 데이터
const popularTemplates = [
  { name: 'SaaS 랜딩', downloads: 1234, growth: 15 },
  { name: '포트폴리오', downloads: 987, growth: 8 },
  { name: '기업 소개', downloads: 756, growth: 12 },
  { name: '이커머스', downloads: 654, growth: -3 },
  { name: '블로그', downloads: 543, growth: 5 },
];

// 트래픽 소스 데이터
const trafficSources = [
  { source: '직접 접속', value: 45, color: 'bg-blue-500' },
  { source: '검색 엔진', value: 30, color: 'bg-green-500' },
  { source: '소셜 미디어', value: 15, color: 'bg-purple-500' },
  { source: '레퍼럴', value: 10, color: 'bg-orange-500' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">대시보드</h1>
          <p className="text-gray-500 mt-1">GRIP 플랫폼 전체 현황을 확인하세요</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-4 py-2 bg-white border rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-300">
            <option>최근 7일</option>
            <option>최근 30일</option>
            <option>최근 90일</option>
            <option>올해</option>
          </select>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span>{stat.change}</span>
                  <span className="text-gray-400">vs 지난달</span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 방문자 차트 */}
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
                가입자
              </span>
            </div>
          </div>
          {/* 차트 플레이스홀더 */}
          <div className="h-64 bg-gradient-to-b from-primary-50 to-transparent rounded-xl flex items-end justify-between px-4 pb-4">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className="w-8 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all hover:from-primary-600"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-400">{i + 1}월</span>
              </div>
            ))}
          </div>
        </div>

        {/* 트래픽 소스 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">트래픽 소스</h2>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{source.source}</span>
                  <span className="text-sm font-medium text-gray-800">{source.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${source.color} rounded-full transition-all`}
                    style={{ width: `${source.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* 빠른 통계 */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mb-1">
                <Eye size={14} />
                페이지뷰
              </div>
              <p className="text-xl font-bold text-gray-800">284K</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mb-1">
                <Clock size={14} />
                체류 시간
              </div>
              <p className="text-xl font-bold text-gray-800">4:32</p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 활동 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">최근 활동</h2>
            <button className="text-primary-500 text-sm hover:underline">전체 보기</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {activity.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">{activity.user}</span>님이 {activity.action}
                    {activity.project !== '-' && (
                      <span className="text-primary-500"> ({activity.project})</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
                <Activity size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* 인기 템플릿 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">인기 템플릿</h2>
            <button className="text-primary-500 text-sm hover:underline">전체 보기</button>
          </div>
          <div className="space-y-4">
            {popularTemplates.map((template, i) => (
              <div key={template.name} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-pastel-lavender to-pastel-sky rounded-xl flex items-center justify-center text-primary-600 font-bold">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800">{template.name}</p>
                  <p className="text-xs text-gray-400">{template.downloads.toLocaleString()} 다운로드</p>
                </div>
                <div className={`flex items-center gap-1 text-sm ${template.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {template.growth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(template.growth)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 실시간 현황 */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">실시간 현황</h2>
            <p className="text-white/70 text-sm">현재 플랫폼 사용 현황</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm">Live</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <div>
            <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
              <Users size={16} />
              접속자
            </div>
            <p className="text-3xl font-bold">247</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
              <MousePointer size={16} />
              활성 세션
            </div>
            <p className="text-3xl font-bold">189</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
              <Zap size={16} />
              요청/초
            </div>
            <p className="text-3xl font-bold">1.2K</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
              <Globe size={16} />
              서버 상태
            </div>
            <p className="text-3xl font-bold">99.9%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

