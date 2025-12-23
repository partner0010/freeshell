/**
 * 회원 혜택 페이지
 * 다양한 혜택 제공
 */

'use client';

import { useState } from 'react';
import { Gift, Star, Crown, Zap, Shield, Cloud, Code, Image, Video, FileText, Users, TrendingUp, Trophy, Award, Target, Flame, Sparkles, Coins, Medal, Badge } from 'lucide-react';
import { LoyaltyProgram } from '@/components/gamification/LoyaltyProgram';

interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'storage' | 'features' | 'support' | 'exclusive';
  tier: 'free' | 'premium' | 'pro';
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any;
  earned: boolean;
  progress?: number;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  tier: 'free' | 'premium' | 'pro';
}

export default function BenefitsPage() {
  const [selectedTier, setSelectedTier] = useState<'free' | 'premium' | 'pro'>('premium');
  const [userPoints, setUserPoints] = useState(1250);
  const [userLevel, setUserLevel] = useState(5);
  const [activeTab, setActiveTab] = useState<'benefits' | 'points' | 'badges' | 'leaderboard' | 'loyalty'>('benefits');
  
  // 배지 데이터
  const badges: Badge[] = [
    { id: '1', name: '첫 걸음', description: '첫 프로젝트 생성', icon: Star, earned: true },
    { id: '2', name: '코딩 마스터', description: '100개 코드 생성', icon: Code, earned: true, progress: 100 },
    { id: '3', name: 'AI 탐험가', description: 'AI 기능 50회 사용', icon: Sparkles, earned: false, progress: 65 },
    { id: '4', name: '협업 전문가', description: '팀 프로젝트 10개 생성', icon: Users, earned: false, progress: 40 },
    { id: '5', name: '콘텐츠 크리에이터', description: '콘텐츠 100개 생성', icon: Video, earned: false, progress: 75 },
    { id: '6', name: '트렌드 세터', description: '트렌드 분석 30회', icon: TrendingUp, earned: false, progress: 20 },
  ];

  // 리더보드 데이터
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, username: 'AI마스터', points: 15200, tier: 'pro' },
    { rank: 2, username: '코딩킹', points: 12800, tier: 'pro' },
    { rank: 3, username: '크리에이터', points: 11200, tier: 'premium' },
    { rank: 4, username: '디자이너', points: 9800, tier: 'premium' },
    { rank: 5, username: '개발자', points: 8500, tier: 'premium' },
  ];

  const benefits: Benefit[] = [
    {
      id: '1',
      title: '무제한 저장 공간',
      description: '모든 제작물을 무제한으로 저장하고 관리하세요',
      icon: Cloud,
      category: 'storage',
      tier: 'premium',
    },
    {
      id: '2',
      title: '우선 지원',
      description: '고객 지원 요청 시 우선 처리',
      icon: Shield,
      category: 'support',
      tier: 'premium',
    },
    {
      id: '3',
      title: '고급 AI 기능',
      description: '프리미엄 AI 모델 및 고급 기능 사용',
      icon: Zap,
      category: 'features',
      tier: 'pro',
    },
    {
      id: '4',
      title: '비공개 프로젝트',
      description: '프로젝트를 비공개로 설정하여 보호',
      icon: Shield,
      category: 'features',
      tier: 'premium',
    },
    {
      id: '5',
      title: 'API 접근',
      description: '프로그래밍 방식으로 플랫폼 기능 사용',
      icon: Code,
      category: 'features',
      tier: 'pro',
    },
    {
      id: '6',
      title: '우선 배치',
      description: 'AI 생성 작업 우선 처리',
      icon: TrendingUp,
      category: 'features',
      tier: 'pro',
    },
    {
      id: '7',
      title: '전용 템플릿',
      description: '프리미엄 전용 템플릿 및 리소스',
      icon: Crown,
      category: 'exclusive',
      tier: 'pro',
    },
    {
      id: '8',
      title: '팀 협업',
      description: '팀 프로젝트 및 협업 기능',
      icon: Users,
      category: 'features',
      tier: 'pro',
    },
  ];

  const filteredBenefits = benefits.filter(b => {
    if (selectedTier === 'free') return false;
    if (selectedTier === 'premium') return b.tier === 'premium' || b.tier === 'pro';
    return b.tier === 'pro';
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 - 포인트 및 레벨 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Gift className="text-purple-600" size={32} />
                회원 혜택
              </h1>
              <p className="text-gray-600">
                다양한 혜택을 통해 더 많은 기능을 이용하세요
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Coins className="text-yellow-500" size={20} />
                    <span className="text-2xl font-bold text-gray-900">{userPoints.toLocaleString()}</span>
                  </div>
                  <span className="text-xs text-gray-500">포인트</span>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="text-purple-500" size={20} />
                    <span className="text-2xl font-bold text-gray-900">Lv.{userLevel}</span>
                  </div>
                  <span className="text-xs text-gray-500">레벨</span>
                </div>
              </div>
            </div>
          </div>

          {/* 탭 메뉴 */}
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { id: 'benefits', label: '혜택', icon: Gift },
              { id: 'points', label: '포인트', icon: Coins },
              { id: 'badges', label: '배지', icon: Medal },
              { id: 'leaderboard', label: '리더보드', icon: Trophy },
              { id: 'loyalty', label: '로열티', icon: Crown },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} className="inline mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 포인트 탭 */}
        {activeTab === 'points' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">포인트 적립 방법</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { action: '프로젝트 생성', points: '+50', icon: FileText },
                  { action: 'AI 기능 사용', points: '+10', icon: Sparkles },
                  { action: '콘텐츠 공유', points: '+30', icon: Video },
                  { action: '일일 로그인', points: '+20', icon: Target },
                  { action: '리뷰 작성', points: '+15', icon: Star },
                  { action: '친구 초대', points: '+100', icon: Users },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon size={20} />
                          <span className="font-medium">{item.action}</span>
                        </div>
                        <span className="font-bold text-lg">{item.points}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-4">포인트 사용 내역</h3>
              <div className="space-y-3">
                {[
                  { date: '2025-01-15', action: '프리미엄 템플릿 구매', points: -200 },
                  { date: '2025-01-14', action: '프로젝트 생성', points: +50 },
                  { date: '2025-01-13', action: '일일 로그인', points: +20 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.action}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                    <span className={`font-bold ${item.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.points > 0 ? '+' : ''}{item.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 배지 탭 */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.id}
                    className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all ${
                      badge.earned
                        ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50'
                        : 'border-gray-200 opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center ${
                          badge.earned
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                            : 'bg-gray-200'
                        }`}
                      >
                        <Icon
                          className={badge.earned ? 'text-white' : 'text-gray-400'}
                          size={32}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{badge.name}</h3>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                      </div>
                      {badge.earned && (
                        <Badge className="text-yellow-500" size={24} />
                      )}
                    </div>
                    {!badge.earned && badge.progress !== undefined && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">진행률</span>
                          <span className="font-medium">{badge.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                            style={{ width: `${badge.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 리더보드 탭 */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-500" size={24} />
                이번 달 리더보드
              </h3>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-4 p-4 rounded-lg ${
                      entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      entry.rank === 1 ? 'bg-yellow-400 text-white' :
                      entry.rank === 2 ? 'bg-gray-300 text-white' :
                      entry.rank === 3 ? 'bg-orange-400 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {entry.rank}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{entry.username}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          entry.tier === 'pro' ? 'bg-orange-100 text-orange-800' :
                          entry.tier === 'premium' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.tier === 'pro' ? '프로' : entry.tier === 'premium' ? '프리미엄' : '무료'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="text-yellow-500" size={20} />
                      <span className="font-bold text-gray-900">{entry.points.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 혜택 탭 */}
        {activeTab === 'benefits' && (
          <>
        {/* 플랜 선택 */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { tier: 'free' as const, name: '무료', price: '₩0' },
            { tier: 'premium' as const, name: '프리미엄', price: '₩9,900' },
            { tier: 'pro' as const, name: '프로', price: '₩29,900' },
          ].map((plan) => (
            <button
              key={plan.tier}
              onClick={() => setSelectedTier(plan.tier)}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedTier === plan.tier
                  ? plan.tier === 'free'
                    ? 'border-gray-500 bg-gray-50'
                    : plan.tier === 'premium'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                <div className="text-2xl font-bold text-gray-900 mb-2">{plan.price}</div>
                <div className="text-sm text-gray-600">/월</div>
              </div>
            </button>
          ))}
        </div>

        {/* 혜택 목록 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Icon className="text-purple-600" size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900">{benefit.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{benefit.description}</p>
                <div className="mt-3">
                  <span className={`text-xs px-2 py-1 rounded ${
                    benefit.tier === 'premium' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {benefit.tier === 'premium' ? '프리미엄' : '프로'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 업그레이드 CTA */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">더 많은 혜택을 받으세요</h2>
          <p className="mb-4 opacity-90">프리미엄 또는 프로 플랜으로 업그레이드하세요</p>
          <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100">
            업그레이드하기
          </button>
        </div>
          </>
        )}

        {/* 로열티 탭 */}
        {activeTab === 'loyalty' && (
          <LoyaltyProgram />
        )}
      </div>
    </div>
  );
}
