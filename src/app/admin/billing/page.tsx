'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Download,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
  Zap,
  Building,
} from 'lucide-react';

// 구독 데이터
const subscriptionsData = [
  { id: 1, user: '김철수', email: 'kim@example.com', plan: 'Pro', amount: 29000, status: 'active', startDate: '2024-01-15', nextBilling: '2024-04-15' },
  { id: 2, user: '이영희', email: 'lee@example.com', plan: 'Enterprise', amount: 99000, status: 'active', startDate: '2024-02-01', nextBilling: '2024-05-01' },
  { id: 3, user: '박민수', email: 'park@example.com', plan: 'Pro', amount: 29000, status: 'cancelled', startDate: '2024-01-20', nextBilling: '-' },
  { id: 4, user: '정지원', email: 'jung@example.com', plan: 'Enterprise', amount: 99000, status: 'active', startDate: '2023-11-10', nextBilling: '2024-04-10' },
  { id: 5, user: '최현우', email: 'choi@example.com', plan: 'Pro', amount: 29000, status: 'past_due', startDate: '2024-03-01', nextBilling: '2024-04-01' },
];

// 결제 내역
const paymentsData = [
  { id: 1, user: '김철수', amount: 29000, plan: 'Pro', date: '2024-03-15', status: 'completed', method: 'card' },
  { id: 2, user: '이영희', amount: 99000, plan: 'Enterprise', date: '2024-03-01', status: 'completed', method: 'card' },
  { id: 3, user: '정지원', amount: 99000, plan: 'Enterprise', date: '2024-03-10', status: 'completed', method: 'transfer' },
  { id: 4, user: '최현우', amount: 29000, plan: 'Pro', date: '2024-03-01', status: 'failed', method: 'card' },
];

const planIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Free: Users,
  Pro: Zap,
  Enterprise: Building,
};

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-700', label: '활성' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-700', label: '취소됨' },
  past_due: { bg: 'bg-red-100', text: 'text-red-700', label: '미결제' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: '완료' },
  failed: { bg: 'bg-red-100', text: 'text-red-700', label: '실패' },
};

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'payments'>('subscriptions');
  const [searchQuery, setSearchQuery] = useState('');

  // 통계
  const stats = {
    mrr: 45200000, // 월간 반복 수익
    activeSubscriptions: subscriptionsData.filter(s => s.status === 'active').length,
    churnRate: 2.4,
    avgRevenue: 58000,
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">결제 / 구독</h1>
          <p className="text-gray-500 mt-1">구독 및 결제를 관리하세요</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
          <Download size={18} />
          보고서 다운로드
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">월간 반복 수익 (MRR)</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">₩{(stats.mrr / 1000000).toFixed(1)}M</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                <ArrowUpRight size={16} />
                <span>+15.3%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <DollarSign className="text-white" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">활성 구독</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.activeSubscriptions}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                <ArrowUpRight size={16} />
                <span>+8.2%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <CreditCard className="text-white" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">이탈률</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.churnRate}%</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-red-500">
                <ArrowDownRight size={16} />
                <span>-0.5%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">평균 수익/사용자</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">₩{stats.avgRevenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                <ArrowUpRight size={16} />
                <span>+12.1%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Crown className="text-white" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 탭 */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="border-b">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'subscriptions'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              구독 관리
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'payments'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              결제 내역
            </button>
          </div>
        </div>

        {/* 검색 */}
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="사용자 검색..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        </div>

        {/* 구독 테이블 */}
        {activeTab === 'subscriptions' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">사용자</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">플랜</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">금액</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">상태</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">시작일</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">다음 결제</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subscriptionsData.map((sub) => {
                  const PlanIcon = planIcons[sub.plan] || Users;
                  return (
                    <motion.tr
                      key={sub.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-800">{sub.user}</p>
                          <p className="text-sm text-gray-500">{sub.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2 text-sm">
                          <PlanIcon size={16} className="text-primary-500" />
                          {sub.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        ₩{sub.amount.toLocaleString()}/월
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[sub.status].bg} ${statusColors[sub.status].text}`}>
                          {statusColors[sub.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{sub.startDate}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{sub.nextBilling}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Eye size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 결제 내역 테이블 */}
        {activeTab === 'payments' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">사용자</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">플랜</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">금액</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">결제 방법</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">날짜</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paymentsData.map((payment) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">{payment.user}</td>
                    <td className="px-6 py-4 text-gray-600">{payment.plan}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">₩{payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {payment.method === 'card' ? '카드' : '계좌이체'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{payment.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[payment.status].bg} ${statusColors[payment.status].text}`}>
                        {statusColors[payment.status].label}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 페이지네이션 */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-600">총 {activeTab === 'subscriptions' ? subscriptionsData.length : paymentsData.length}건</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="px-4 py-2 bg-primary-500 text-white rounded-lg">1</button>
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

