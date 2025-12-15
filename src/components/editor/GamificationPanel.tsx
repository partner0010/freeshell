'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Star,
  Zap,
  Target,
  Award,
  Flame,
  Crown,
  Medal,
  Gift,
  TrendingUp,
  CheckCircle,
  Lock,
  Sparkles,
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  progress: number;
  total: number;
  unlocked: boolean;
  xp: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Level {
  level: number;
  name: string;
  minXp: number;
  maxXp: number;
  color: string;
}

const levels: Level[] = [
  { level: 1, name: '초보자', minXp: 0, maxXp: 100, color: 'from-gray-400 to-gray-500' },
  { level: 2, name: '입문자', minXp: 100, maxXp: 300, color: 'from-green-400 to-green-500' },
  { level: 3, name: '중급자', minXp: 300, maxXp: 600, color: 'from-blue-400 to-blue-500' },
  { level: 4, name: '숙련자', minXp: 600, maxXp: 1000, color: 'from-purple-400 to-purple-500' },
  { level: 5, name: '전문가', minXp: 1000, maxXp: 1500, color: 'from-yellow-400 to-yellow-500' },
  { level: 6, name: '마스터', minXp: 1500, maxXp: 2500, color: 'from-orange-400 to-red-500' },
  { level: 7, name: '그랜드마스터', minXp: 2500, maxXp: 5000, color: 'from-pink-400 to-purple-500' },
];

const achievements: Achievement[] = [
  { id: '1', name: '첫 발걸음', description: '첫 번째 블록을 추가하세요', icon: Zap, progress: 1, total: 1, unlocked: true, xp: 10, rarity: 'common' },
  { id: '2', name: '빌더', description: '10개의 블록을 추가하세요', icon: Target, progress: 10, total: 10, unlocked: true, xp: 50, rarity: 'common' },
  { id: '3', name: '디자이너', description: '5가지 스타일을 적용하세요', icon: Star, progress: 3, total: 5, unlocked: false, xp: 30, rarity: 'common' },
  { id: '4', name: 'AI 마법사', description: 'AI 기능을 10번 사용하세요', icon: Sparkles, progress: 7, total: 10, unlocked: false, xp: 100, rarity: 'rare' },
  { id: '5', name: '협업왕', description: '팀원 5명을 초대하세요', icon: Trophy, progress: 2, total: 5, unlocked: false, xp: 150, rarity: 'rare' },
  { id: '6', name: '퍼펙트', description: '접근성 100점을 달성하세요', icon: Award, progress: 0, total: 1, unlocked: false, xp: 200, rarity: 'epic' },
  { id: '7', name: '연속 출석', description: '7일 연속 접속하세요', icon: Flame, progress: 5, total: 7, unlocked: false, xp: 100, rarity: 'rare' },
  { id: '8', name: '전설의 빌더', description: '100개의 프로젝트를 완성하세요', icon: Crown, progress: 12, total: 100, unlocked: false, xp: 500, rarity: 'legendary' },
];

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-500',
  epic: 'from-purple-400 to-purple-500',
  legendary: 'from-yellow-400 to-orange-500',
};

const rarityLabels = {
  common: '일반',
  rare: '희귀',
  epic: '영웅',
  legendary: '전설',
};

export default function GamificationPanel() {
  const [currentXp, setCurrentXp] = useState(450);
  const [streak, setStreak] = useState(5);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);

  // 현재 레벨 계산
  const currentLevel = levels.find(l => currentXp >= l.minXp && currentXp < l.maxXp) || levels[levels.length - 1];
  const nextLevel = levels[levels.indexOf(currentLevel) + 1];
  const progressToNext = nextLevel 
    ? ((currentXp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100
    : 100;

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXpEarned = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Trophy size={18} />
          성취 & 보상
        </h3>
        <p className="text-sm text-gray-500 mt-1">활동하고 보상을 획득하세요</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 레벨 & 경험치 */}
        <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center`}>
                <Crown size={28} />
              </div>
              <div>
                <p className="text-white/70 text-xs">현재 레벨</p>
                <p className="text-2xl font-bold">{currentLevel.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">Lv.{currentLevel.level}</p>
            </div>
          </div>
          
          {/* 경험치 바 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">경험치</span>
              <span>{currentXp} / {nextLevel?.minXp || currentLevel.maxXp} XP</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            {nextLevel && (
              <p className="text-xs text-white/70 text-center">
                다음 레벨까지 {nextLevel.minXp - currentXp} XP
              </p>
            )}
          </div>
        </div>

        {/* 연속 출석 */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <Flame size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">연속 출석</p>
                <p className="text-2xl font-bold text-gray-800">{streak}일</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">다음 보상</p>
              <p className="text-sm font-medium text-orange-600">+50 XP</p>
            </div>
          </div>
          {/* 출석 달력 미니 */}
          <div className="flex gap-1 mt-4 justify-center">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                  i < streak
                    ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white'
                    : 'bg-white border text-gray-400'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <Medal className="mx-auto text-yellow-500 mb-1" size={24} />
            <p className="text-xl font-bold text-gray-800">{unlockedCount}</p>
            <p className="text-xs text-gray-500">획득한 뱃지</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <Zap className="mx-auto text-blue-500 mb-1" size={24} />
            <p className="text-xl font-bold text-gray-800">{totalXpEarned}</p>
            <p className="text-xs text-gray-500">획득한 XP</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <TrendingUp className="mx-auto text-green-500 mb-1" size={24} />
            <p className="text-xl font-bold text-gray-800">32</p>
            <p className="text-xs text-gray-500">완성 프로젝트</p>
          </div>
        </div>

        {/* 업적 목록 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-500">업적</p>
            <span className="text-xs text-gray-400">{unlockedCount}/{achievements.length}</span>
          </div>
          <div className="space-y-2">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => achievement.unlocked && setShowAchievement(achievement)}
                className={`
                  p-3 rounded-xl border cursor-pointer transition-all
                  ${achievement.unlocked 
                    ? 'bg-white border-gray-200 hover:shadow-md' 
                    : 'bg-gray-50 border-gray-100 opacity-60'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${achievement.unlocked 
                      ? `bg-gradient-to-br ${rarityColors[achievement.rarity]}` 
                      : 'bg-gray-200'
                    }
                  `}>
                    {achievement.unlocked ? (
                      <achievement.icon size={20} className="text-white" />
                    ) : (
                      <Lock size={16} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800 text-sm">{achievement.name}</p>
                      <span className={`px-1.5 py-0.5 text-[10px] rounded-full bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white`}>
                        {rarityLabels[achievement.rarity]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{achievement.description}</p>
                    {!achievement.unlocked && (
                      <div className="mt-1">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-400 rounded-full"
                            style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {achievement.progress}/{achievement.total}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-primary-600">+{achievement.xp} XP</p>
                    {achievement.unlocked && (
                      <CheckCircle size={16} className="text-green-500 ml-auto mt-1" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 업적 상세 모달 */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${rarityColors[showAchievement.rarity]} flex items-center justify-center mb-4`}>
                <showAchievement.icon size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{showAchievement.name}</h3>
              <p className="text-gray-500 mt-2">{showAchievement.description}</p>
              <div className="mt-4 inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium">
                +{showAchievement.xp} XP 획득!
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

