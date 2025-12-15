'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Users,
  CreditCard,
  Lock,
  Unlock,
  Plus,
  Edit2,
  Trash2,
  Check,
  Star,
  Zap,
  Shield,
  Eye,
  EyeOff,
  Settings,
  BarChart3,
  DollarSign,
} from 'lucide-react';

interface MembershipTier {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  color: string;
  popular?: boolean;
  memberCount: number;
}

interface Member {
  id: string;
  name: string;
  email: string;
  tier: string;
  status: 'active' | 'cancelled' | 'past_due';
  joinedAt: string;
  nextBilling?: string;
}

interface ProtectedContent {
  id: string;
  name: string;
  type: 'page' | 'block' | 'file';
  requiredTier: string;
  views: number;
}

export function MembershipPanel() {
  const [activeTab, setActiveTab] = useState<'tiers' | 'members' | 'content' | 'settings'>('tiers');
  const [showAddTier, setShowAddTier] = useState(false);
  
  const [tiers, setTiers] = useState<MembershipTier[]>([
    {
      id: '1',
      name: 'Free',
      price: 0,
      interval: 'monthly',
      features: ['기본 콘텐츠 접근', '커뮤니티 포럼'],
      color: 'bg-gray-500',
      memberCount: 1250,
    },
    {
      id: '2',
      name: 'Pro',
      price: 9900,
      interval: 'monthly',
      features: ['모든 콘텐츠 접근', '프리미엄 템플릿', '우선 지원', '광고 제거'],
      color: 'bg-blue-500',
      popular: true,
      memberCount: 450,
    },
    {
      id: '3',
      name: 'Enterprise',
      price: 29900,
      interval: 'monthly',
      features: ['Pro의 모든 기능', '전용 매니저', 'API 접근', '화이트라벨'],
      color: 'bg-purple-500',
      memberCount: 85,
    },
  ]);
  
  const [members] = useState<Member[]>([
    { id: '1', name: '김철수', email: 'kim@example.com', tier: 'Pro', status: 'active', joinedAt: '2024-10-15', nextBilling: '2025-01-15' },
    { id: '2', name: '이영희', email: 'lee@example.com', tier: 'Enterprise', status: 'active', joinedAt: '2024-11-01', nextBilling: '2025-02-01' },
    { id: '3', name: '박민수', email: 'park@example.com', tier: 'Pro', status: 'past_due', joinedAt: '2024-09-20' },
  ]);
  
  const [protectedContent] = useState<ProtectedContent[]>([
    { id: '1', name: '고급 튜토리얼 섹션', type: 'page', requiredTier: 'Pro', views: 1250 },
    { id: '2', name: '프리미엄 템플릿 갤러리', type: 'block', requiredTier: 'Pro', views: 890 },
    { id: '3', name: 'API 문서', type: 'page', requiredTier: 'Enterprise', views: 234 },
  ]);
  
  const [newTier, setNewTier] = useState({
    name: '',
    price: '',
    interval: 'monthly' as const,
    features: '',
  });

  const stats = {
    totalRevenue: 4850000,
    activeMembers: 1785,
    churnRate: 2.5,
    avgLifetimeValue: 125000,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-600';
      case 'cancelled':
        return 'bg-gray-100 text-gray-600';
      case 'past_due':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  const handleAddTier = () => {
    if (!newTier.name || !newTier.price) return;
    
    const tier: MembershipTier = {
      id: `tier-${Date.now()}`,
      name: newTier.name,
      price: parseInt(newTier.price),
      interval: newTier.interval,
      features: newTier.features.split('\n').filter((f) => f.trim()),
      color: 'bg-primary-500',
      memberCount: 0,
    };
    
    setTiers([...tiers, tier]);
    setNewTier({ name: '', price: '', interval: 'monthly', features: '' });
    setShowAddTier(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          멤버십
        </h3>
      </div>
      
      {/* 통계 */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: '총 수익', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'text-green-500' },
          { label: '활성 회원', value: stats.activeMembers.toLocaleString(), icon: Users, color: 'text-blue-500' },
          { label: '이탈률', value: stats.churnRate + '%', icon: BarChart3, color: 'text-red-500' },
          { label: '평균 LTV', value: formatCurrency(stats.avgLifetimeValue), icon: Star, color: 'text-yellow-500' },
        ].map((stat, index) => (
          <div
            key={index}
            className="p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center gap-1">
              <stat.icon className={`w-3 h-3 ${stat.color}`} />
              <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
            <p className="font-bold text-gray-800 dark:text-white text-sm">{stat.value}</p>
          </div>
        ))}
      </div>
      
      {/* 탭 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {[
          { id: 'tiers', label: '등급', icon: Crown },
          { id: 'members', label: '회원', icon: Users },
          { id: 'content', label: '콘텐츠', icon: Lock },
          { id: 'settings', label: '설정', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* 등급 관리 */}
      {activeTab === 'tiers' && (
        <div className="space-y-3">
          <button
            onClick={() => setShowAddTier(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm"
          >
            <Plus className="w-4 h-4" />
            등급 추가
          </button>
          
          {tiers.map((tier) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 bg-white dark:bg-gray-700 rounded-xl border-2 ${
                tier.popular ? 'border-primary-300' : 'border-gray-200 dark:border-gray-600'
              } relative`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                  인기
                </span>
              )}
              
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 ${tier.color} rounded-full`} />
                    <h4 className="font-bold text-gray-800 dark:text-white">{tier.name}</h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                    {tier.price === 0 ? '무료' : formatCurrency(tier.price)}
                    {tier.price > 0 && (
                      <span className="text-sm font-normal text-gray-500">
                        /{tier.interval === 'monthly' ? '월' : '년'}
                      </span>
                    )}
                  </p>
                </div>
                <span className="text-sm text-gray-500">{tier.memberCount}명</span>
              </div>
              
              <ul className="mt-4 space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 dark:border-gray-500">
                  <Edit2 className="w-3 h-3" />
                  편집
                </button>
                {tier.price > 0 && (
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20">
                    <Trash2 className="w-3 h-3" />
                    삭제
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* 회원 관리 */}
      {activeTab === 'members' && (
        <div className="space-y-2">
          {members.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 dark:text-white text-sm">{member.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(member.status)}`}>
                      {member.status === 'active' ? '활성' : member.status === 'past_due' ? '연체' : '취소'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded text-xs font-medium">
                  {member.tier}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-600">
                <span className="text-xs text-gray-500">가입: {member.joinedAt}</span>
                {member.nextBilling && (
                  <span className="text-xs text-gray-500">다음 결제: {member.nextBilling}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* 보호된 콘텐츠 */}
      {activeTab === 'content' && (
        <div className="space-y-3">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              💡 특정 콘텐츠를 멤버십 등급에 따라 제한할 수 있습니다.
            </p>
          </div>
          
          {protectedContent.map((content) => (
            <div
              key={content.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white text-sm">{content.name}</p>
                  <p className="text-xs text-gray-500">
                    {content.type === 'page' ? '페이지' : content.type === 'block' ? '블록' : '파일'} • {content.views} 조회
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs">
                {content.requiredTier}+
              </span>
            </div>
          ))}
          
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-600 dark:text-gray-400">
            <Plus className="w-4 h-4" />
            콘텐츠 보호 추가
          </button>
        </div>
      )}
      
      {/* 설정 */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">결제 설정</h4>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">무료 체험 기간</span>
                <select className="text-sm border rounded px-2 py-1 dark:bg-gray-600 dark:border-gray-500">
                  <option>없음</option>
                  <option>7일</option>
                  <option>14일</option>
                  <option>30일</option>
                </select>
              </label>
              
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">자동 갱신</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary-500" />
              </label>
              
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">연체 유예 기간</span>
                <select className="text-sm border rounded px-2 py-1 dark:bg-gray-600 dark:border-gray-500">
                  <option>3일</option>
                  <option>7일</option>
                  <option>14일</option>
                </select>
              </label>
            </div>
          </div>
          
          <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">알림</h4>
            
            <div className="space-y-2">
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">환영 이메일</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary-500" />
              </label>
              
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">결제 알림</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary-500" />
              </label>
              
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">만료 예정 알림</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary-500" />
              </label>
            </div>
          </div>
        </div>
      )}
      
      {/* 등급 추가 모달 */}
      <AnimatePresence>
        {showAddTier && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddTier(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">새 멤버십 등급</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">등급명 *</label>
                  <input
                    type="text"
                    value={newTier.name}
                    onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="예: Premium"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">가격 (원) *</label>
                    <input
                      type="number"
                      value={newTier.price}
                      onChange={(e) => setNewTier({ ...newTier, price: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      placeholder="9900"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">결제 주기</label>
                    <select
                      value={newTier.interval}
                      onChange={(e) => setNewTier({ ...newTier, interval: e.target.value as 'monthly' | 'yearly' })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="monthly">월간</option>
                      <option value="yearly">연간</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">기능 (줄바꿈으로 구분)</label>
                  <textarea
                    value={newTier.features}
                    onChange={(e) => setNewTier({ ...newTier, features: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    rows={4}
                    placeholder="프리미엄 콘텐츠 접근&#10;광고 제거&#10;우선 지원"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddTier(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleAddTier}
                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    추가
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MembershipPanel;

