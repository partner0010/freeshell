'use client';

import React, { useState } from 'react';
import {
  Megaphone,
  Mail,
  Bell,
  Ticket,
  TrendingUp,
  Users,
  MousePointer,
  Eye,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  BarChart3,
  Calendar,
  Target,
  Zap,
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'push' | 'popup' | 'banner';
  status: 'active' | 'scheduled' | 'paused' | 'completed';
  audience: number;
  sent: number;
  opened: number;
  clicked: number;
  startDate: string;
  endDate?: string;
}

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  usageCount: number;
  usageLimit?: number;
  status: 'active' | 'expired' | 'disabled';
  expiresAt?: string;
}

export default function MarketingManagementPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'coupons' | 'automation'>('overview');

  const stats = {
    totalCampaigns: 24,
    activeCampaigns: 5,
    totalEmailsSent: 125600,
    avgOpenRate: 45.2,
    avgClickRate: 12.8,
    totalCouponsUsed: 3456,
  };

  const [campaigns] = useState<Campaign[]>([
    { id: '1', name: '12월 뉴스레터', type: 'email', status: 'completed', audience: 5600, sent: 5600, opened: 2520, clicked: 716, startDate: '2024-12-01' },
    { id: '2', name: '신규 기능 알림', type: 'push', status: 'active', audience: 8900, sent: 8900, opened: 4005, clicked: 890, startDate: '2024-12-05' },
    { id: '3', name: '블랙프라이데이 팝업', type: 'popup', status: 'completed', audience: 15000, sent: 15000, opened: 12000, clicked: 1800, startDate: '2024-11-29', endDate: '2024-12-02' },
    { id: '4', name: '연말 프로모션', type: 'email', status: 'scheduled', audience: 6200, sent: 0, opened: 0, clicked: 0, startDate: '2024-12-15' },
  ]);

  const [coupons] = useState<Coupon[]>([
    { id: '1', code: 'WELCOME20', type: 'percentage', value: 20, usageCount: 456, usageLimit: 1000, status: 'active', expiresAt: '2024-12-31' },
    { id: '2', code: 'SAVE5000', type: 'fixed', value: 5000, usageCount: 234, status: 'active', expiresAt: '2024-12-15' },
    { id: '3', code: 'BLACKFRIDAY50', type: 'percentage', value: 50, usageCount: 100, usageLimit: 100, status: 'expired' },
    { id: '4', code: 'VIP2024', type: 'percentage', value: 30, usageCount: 89, status: 'active' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-600';
      case 'scheduled': return 'bg-blue-100 text-blue-600';
      case 'paused': return 'bg-yellow-100 text-yellow-600';
      case 'completed': return 'bg-gray-100 text-gray-600';
      case 'expired': return 'bg-red-100 text-red-600';
      case 'disabled': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'push': return Bell;
      case 'popup': return Megaphone;
      case 'banner': return Target;
      default: return Mail;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">마케팅 관리</h1>
          <p className="text-gray-500 mt-1">캠페인, 쿠폰, 자동화를 관리합니다</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
          <Plus className="w-4 h-4" />
          새 캠페인
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-6 gap-4">
        {[
          { label: '전체 캠페인', value: stats.totalCampaigns, icon: Megaphone, color: 'text-purple-500' },
          { label: '진행중', value: stats.activeCampaigns, icon: Zap, color: 'text-green-500' },
          { label: '발송 이메일', value: (stats.totalEmailsSent / 1000).toFixed(0) + 'K', icon: Mail, color: 'text-blue-500' },
          { label: '평균 오픈율', value: stats.avgOpenRate + '%', icon: Eye, color: 'text-cyan-500' },
          { label: '평균 클릭률', value: stats.avgClickRate + '%', icon: MousePointer, color: 'text-orange-500' },
          { label: '쿠폰 사용', value: stats.totalCouponsUsed.toLocaleString(), icon: Ticket, color: 'text-pink-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 탭 */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'overview', label: '개요', icon: BarChart3 },
          { id: 'campaigns', label: '캠페인', icon: Megaphone },
          { id: 'coupons', label: '쿠폰', icon: Ticket },
          { id: 'automation', label: '자동화', icon: Zap },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 개요 */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          {/* 최근 캠페인 성과 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">최근 캠페인 성과</h3>
            </div>
            <div className="p-4 space-y-4">
              {campaigns.slice(0, 3).map((campaign) => {
                const TypeIcon = getCampaignTypeIcon(campaign.type);
                const openRate = campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : 0;
                const clickRate = campaign.opened > 0 ? ((campaign.clicked / campaign.opened) * 100).toFixed(1) : 0;
                return (
                  <div key={campaign.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-800">{campaign.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                        {campaign.status === 'active' ? '진행중' :
                         campaign.status === 'scheduled' ? '예약' :
                         campaign.status === 'completed' ? '완료' : '일시정지'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-800">{campaign.sent.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">발송</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-blue-600">{openRate}%</p>
                        <p className="text-xs text-gray-500">오픈율</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">{clickRate}%</p>
                        <p className="text-xs text-gray-500">클릭률</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 인기 쿠폰 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">인기 쿠폰</h3>
            </div>
            <div className="p-4 space-y-3">
              {coupons.filter((c) => c.status === 'active').slice(0, 4).map((coupon) => (
                <div key={coupon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <code className="font-bold text-primary-600">{coupon.code}</code>
                    <p className="text-sm text-gray-500">
                      {coupon.type === 'percentage' ? `${coupon.value}% 할인` : `${coupon.value.toLocaleString()}원 할인`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{coupon.usageCount}회</p>
                    {coupon.usageLimit && (
                      <p className="text-xs text-gray-500">/ {coupon.usageLimit}회</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 예정된 캠페인 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 col-span-2">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                예정된 캠페인
              </h3>
            </div>
            <div className="p-4">
              {campaigns.filter((c) => c.status === 'scheduled').length > 0 ? (
                <div className="space-y-3">
                  {campaigns.filter((c) => c.status === 'scheduled').map((campaign) => {
                    const TypeIcon = getCampaignTypeIcon(campaign.type);
                    return (
                      <div key={campaign.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <TypeIcon className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-gray-800">{campaign.name}</p>
                            <p className="text-sm text-gray-500">대상: {campaign.audience.toLocaleString()}명</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-blue-600">{campaign.startDate}</p>
                          <p className="text-xs text-gray-500">예정</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">예정된 캠페인이 없습니다</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 캠페인 탭 */}
      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">캠페인</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">유형</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">발송</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">오픈율</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">클릭률</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.map((campaign) => {
                const TypeIcon = getCampaignTypeIcon(campaign.type);
                const openRate = campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : '-';
                const clickRate = campaign.opened > 0 ? ((campaign.clicked / campaign.opened) * 100).toFixed(1) : '-';
                return (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{campaign.name}</p>
                      <p className="text-xs text-gray-500">{campaign.startDate}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {campaign.type === 'email' ? '이메일' :
                           campaign.type === 'push' ? '푸시' :
                           campaign.type === 'popup' ? '팝업' : '배너'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                        {campaign.status === 'active' ? '진행중' :
                         campaign.status === 'scheduled' ? '예약' :
                         campaign.status === 'completed' ? '완료' : '일시정지'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{campaign.sent.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">{openRate}%</td>
                    <td className="px-4 py-3 text-gray-600">{clickRate}%</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-gray-100 rounded-lg"><BarChart3 className="w-4 h-4 text-gray-500" /></button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 쿠폰 탭 */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">쿠폰 목록</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm">
              <Plus className="w-4 h-4" />
              쿠폰 생성
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">쿠폰 코드</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">할인</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">사용</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">만료</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <code className="font-bold text-primary-600">{coupon.code}</code>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value.toLocaleString()}원`}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {coupon.usageCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{coupon.expiresAt || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(coupon.status)}`}>
                      {coupon.status === 'active' ? '활성' : coupon.status === 'expired' ? '만료' : '비활성'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg"><Trash2 className="w-4 h-4 text-gray-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 자동화 탭 */}
      {activeTab === 'automation' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">마케팅 자동화</h3>
          <p className="text-gray-500 mb-4">트리거 기반 자동 이메일, 푸시 알림을 설정하세요</p>
          <button className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
            자동화 만들기
          </button>
        </div>
      )}
    </div>
  );
}

