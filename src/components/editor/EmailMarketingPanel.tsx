'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Send,
  Users,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Settings,
  FileText,
  Sparkles,
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent' | 'sending';
  recipients: number;
  sentAt?: string;
  scheduledFor?: string;
  stats?: {
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
}

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  addedAt: string;
  tags: string[];
}

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
}

export function EmailMarketingPanel() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'subscribers' | 'templates' | 'automations'>('campaigns');
  const [showComposer, setShowComposer] = useState(false);
  
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: '12월 뉴스레터',
      subject: '이번 달 새로운 기능을 확인하세요!',
      status: 'sent',
      recipients: 2500,
      sentAt: '2024-12-01',
      stats: {
        delivered: 2450,
        opened: 1225,
        clicked: 367,
        bounced: 50,
        unsubscribed: 12,
      },
    },
    {
      id: '2',
      name: '신규 가입자 환영',
      subject: 'GRIP에 오신 것을 환영합니다!',
      status: 'scheduled',
      recipients: 150,
      scheduledFor: '2024-12-06 09:00',
    },
    {
      id: '3',
      name: '블랙프라이데이 프로모션',
      subject: '🎉 50% 할인 - 오늘만!',
      status: 'draft',
      recipients: 0,
    },
  ]);
  
  const [subscribers] = useState<Subscriber[]>([
    { id: '1', email: 'kim@example.com', name: '김철수', status: 'active', addedAt: '2024-11-01', tags: ['VIP', '뉴스레터'] },
    { id: '2', email: 'lee@example.com', name: '이영희', status: 'active', addedAt: '2024-11-15', tags: ['뉴스레터'] },
    { id: '3', email: 'park@example.com', status: 'unsubscribed', addedAt: '2024-10-01', tags: [] },
  ]);
  
  const [templates] = useState<EmailTemplate[]>([
    { id: '1', name: '뉴스레터', category: '마케팅', thumbnail: '📰' },
    { id: '2', name: '환영 이메일', category: '자동화', thumbnail: '👋' },
    { id: '3', name: '프로모션', category: '마케팅', thumbnail: '🎉' },
    { id: '4', name: '제품 업데이트', category: '알림', thumbnail: '🚀' },
  ]);
  
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    template: '',
  });

  const stats = {
    totalSubscribers: 2580,
    activeSubscribers: 2450,
    avgOpenRate: 45.2,
    avgClickRate: 12.8,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-600';
      case 'scheduled':
        return 'bg-blue-100 text-blue-600';
      case 'sending':
        return 'bg-yellow-100 text-yellow-600';
      case 'draft':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary-500" />
          이메일 마케팅
        </h3>
        <button
          onClick={() => setShowComposer(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm"
        >
          <Plus className="w-4 h-4" />
          새 캠페인
        </button>
      </div>
      
      {/* 통계 요약 */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: '총 구독자', value: stats.totalSubscribers.toLocaleString(), icon: Users, color: 'text-blue-500' },
          { label: '활성 구독자', value: stats.activeSubscribers.toLocaleString(), icon: CheckCircle, color: 'text-green-500' },
          { label: '평균 오픈율', value: stats.avgOpenRate + '%', icon: Eye, color: 'text-purple-500' },
          { label: '평균 클릭률', value: stats.avgClickRate + '%', icon: BarChart3, color: 'text-orange-500' },
        ].map((stat, index) => (
          <div
            key={index}
            className="p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center gap-1">
              <stat.icon className={`w-3 h-3 ${stat.color}`} />
              <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
            <p className="font-bold text-gray-800 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>
      
      {/* 탭 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {[
          { id: 'campaigns', label: '캠페인' },
          { id: 'subscribers', label: '구독자' },
          { id: 'templates', label: '템플릿' },
          { id: 'automations', label: '자동화' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 px-2 py-1.5 rounded-md text-xs transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* 캠페인 */}
      {activeTab === 'campaigns' && (
        <div className="space-y-2">
          {campaigns.map((campaign) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                      {campaign.status === 'sent' ? '발송됨' : campaign.status === 'scheduled' ? '예약' : campaign.status === 'sending' ? '발송중' : '임시저장'}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-800 dark:text-white text-sm">{campaign.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 truncate">{campaign.subject}</p>
                </div>
              </div>
              
              {campaign.stats && (
                <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {((campaign.stats.opened / campaign.stats.delivered) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">오픈율</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {((campaign.stats.clicked / campaign.stats.delivered) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">클릭률</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{campaign.stats.bounced}</p>
                    <p className="text-xs text-gray-500">반송</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{campaign.stats.unsubscribed}</p>
                    <p className="text-xs text-gray-500">수신거부</p>
                  </div>
                </div>
              )}
              
              {campaign.scheduledFor && (
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  예정: {campaign.scheduledFor}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
      
      {/* 구독자 */}
      {activeTab === 'subscribers' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="이메일 검색..."
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <button className="p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
              <Filter className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-2">
            {subscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-white text-sm">{subscriber.email}</p>
                  {subscriber.name && <p className="text-xs text-gray-500">{subscriber.name}</p>}
                  <div className="flex gap-1 mt-1">
                    {subscriber.tags.map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  subscriber.status === 'active' ? 'bg-green-100 text-green-600' :
                  subscriber.status === 'unsubscribed' ? 'bg-gray-100 text-gray-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {subscriber.status === 'active' ? '활성' : subscriber.status === 'unsubscribed' ? '수신거부' : '반송'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 템플릿 */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-2 gap-2">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:border-primary-300"
            >
              <div className="text-4xl text-center mb-2">{template.thumbnail}</div>
              <h4 className="font-medium text-gray-800 dark:text-white text-sm text-center">{template.name}</h4>
              <p className="text-xs text-gray-500 text-center">{template.category}</p>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* 자동화 */}
      {activeTab === 'automations' && (
        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-br from-primary-50 to-pastel-lavender dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary-500" />
              <h4 className="font-medium text-gray-800 dark:text-white">이메일 자동화</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              트리거 기반 자동 이메일을 설정하세요
            </p>
            <button className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm">
              자동화 만들기
            </button>
          </div>
          
          {[
            { name: '환영 시리즈', trigger: '가입 시', emails: 3, active: true },
            { name: '장바구니 알림', trigger: '장바구니 이탈 1시간 후', emails: 1, active: true },
            { name: '비활성 사용자', trigger: '30일 미접속', emails: 2, active: false },
          ].map((automation, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white text-sm">{automation.name}</h4>
                <p className="text-xs text-gray-500">{automation.trigger} • {automation.emails}개 이메일</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={automation.active}
                  className="sr-only peer"
                  readOnly
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500" />
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmailMarketingPanel;

