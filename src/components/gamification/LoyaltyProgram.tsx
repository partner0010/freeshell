/**
 * 로열티 프로그램 컴포넌트
 * 사용자 참여도 향상을 위한 게임화 요소
 */

'use client';

import React, { useState } from 'react';
import { Trophy, Star, Gift, Zap, Crown, Award, TrendingUp, Calendar } from 'lucide-react';

interface LoyaltyTier {
  name: string;
  level: number;
  pointsRequired: number;
  benefits: string[];
  color: string;
  icon: any;
}

export function LoyaltyProgram() {
  const [userPoints] = useState(1250);
  const [userLevel] = useState(5);
  const [streakDays] = useState(7);

  const tiers: LoyaltyTier[] = [
    {
      name: '브론즈',
      level: 1,
      pointsRequired: 0,
      benefits: ['기본 기능 사용', '커뮤니티 참여'],
      color: 'orange',
      icon: Award,
    },
    {
      name: '실버',
      level: 2,
      pointsRequired: 500,
      benefits: ['프리미엄 템플릿 10% 할인', '우선 지원'],
      color: 'gray',
      icon: Star,
    },
    {
      name: '골드',
      level: 3,
      pointsRequired: 1000,
      benefits: ['프리미엄 템플릿 20% 할인', '무제한 저장 공간'],
      color: 'yellow',
      icon: Trophy,
    },
    {
      name: '플래티넘',
      level: 4,
      pointsRequired: 2000,
      benefits: ['모든 프리미엄 기능', '전용 고객 지원'],
      color: 'purple',
      icon: Crown,
    },
  ];

  const currentTier = tiers.find(tier => userPoints >= tier.pointsRequired && userPoints < (tiers[tier.level]?.pointsRequired || Infinity)) || tiers[0];
  const nextTier = tiers.find(tier => tier.level === currentTier.level + 1);

  const progressToNextTier = nextTier
    ? ((userPoints - currentTier.pointsRequired) / (nextTier.pointsRequired - currentTier.pointsRequired)) * 100
    : 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 bg-${currentTier.color}-100 rounded-lg flex items-center justify-center`}>
          <currentTier.icon className={`text-${currentTier.color}-600`} size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">로열티 프로그램</h3>
          <p className="text-sm text-gray-600">현재 등급: {currentTier.name}</p>
        </div>
      </div>

      {/* 현재 등급 정보 */}
      <div className={`bg-gradient-to-r from-${currentTier.color}-50 to-${currentTier.color}-100 rounded-lg p-4 mb-6`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">현재 포인트</p>
            <p className="text-3xl font-bold text-gray-900">{userPoints.toLocaleString()} P</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">연속 출석</p>
            <p className="text-2xl font-bold text-gray-900">{streakDays}일</p>
          </div>
        </div>

        {nextTier && (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-700">다음 등급: {nextTier.name}</span>
              <span className="text-gray-600">{nextTier.pointsRequired - userPoints} P 남음</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-${nextTier.color}-500 h-2 rounded-full transition-all`}
                style={{ width: `${Math.min(progressToNextTier, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 등급별 혜택 */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">등급별 혜택</h4>
        <div className="space-y-2">
          {currentTier.benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <Gift className="text-green-600" size={16} />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 등급 목록 */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900 mb-3">전체 등급</h4>
        {tiers.map((tier) => {
          const TierIcon = tier.icon;
          const isUnlocked = userPoints >= tier.pointsRequired;
          const isCurrent = tier.level === currentTier.level;

          return (
            <div
              key={tier.level}
              className={`p-3 rounded-lg border-2 ${
                isCurrent
                  ? `border-${tier.color}-500 bg-${tier.color}-50`
                  : isUnlocked
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TierIcon
                    className={`${
                      isCurrent
                        ? `text-${tier.color}-600`
                        : isUnlocked
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}
                    size={20}
                  />
                  <div>
                    <p className={`font-medium ${isCurrent ? 'text-gray-900' : 'text-gray-700'}`}>
                      {tier.name} (레벨 {tier.level})
                    </p>
                    <p className="text-xs text-gray-600">{tier.pointsRequired.toLocaleString()} P 필요</p>
                  </div>
                </div>
                {isCurrent && (
                  <span className={`px-2 py-1 bg-${tier.color}-100 text-${tier.color}-700 text-xs rounded font-medium`}>
                    현재 등급
                  </span>
                )}
                {!isCurrent && isUnlocked && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                    달성 완료
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 일일 미션 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="text-blue-600" size={18} />
          <h4 className="font-semibold text-blue-900">오늘의 미션</h4>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">프로젝트 1개 생성</span>
            <span className="text-blue-600 font-medium">+50 P</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-800">AI 기능 3회 사용</span>
            <span className="text-blue-600 font-medium">+30 P</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-800">커뮤니티 게시글 작성</span>
            <span className="text-blue-600 font-medium">+20 P</span>
          </div>
        </div>
      </div>
    </div>
  );
}

