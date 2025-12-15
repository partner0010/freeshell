'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  MoreVertical,
  Send,
  Paperclip,
  Tag,
  Star,
  TrendingUp,
  Users,
  Inbox,
  Archive,
  RefreshCw,
} from 'lucide-react';

interface Ticket {
  id: string;
  number: string;
  subject: string;
  description: string;
  customer: { name: string; email: string };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'pending' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  messages: number;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  views: number;
  helpful: number;
}

export default function SupportCenterPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tickets' | 'faq' | 'canned'>('overview');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const stats = {
    totalTickets: 156,
    openTickets: 23,
    avgResponseTime: '2.5시간',
    satisfactionRate: 94,
    resolvedToday: 12,
    newToday: 8,
  };

  const [tickets] = useState<Ticket[]>([
    { id: '1', number: 'TKT-2024-0156', subject: '결제 오류 - 카드 결제가 안됩니다', description: '카드 결제 시 오류가 발생합니다...', customer: { name: '김고객', email: 'kim@example.com' }, priority: 'high', status: 'open', category: '결제', createdAt: '2024-12-05 14:30', updatedAt: '2024-12-05 14:30', messages: 1 },
    { id: '2', number: 'TKT-2024-0155', subject: '템플릿 편집 문의', description: '템플릿 수정 방법을 알고 싶습니다', customer: { name: '이사용자', email: 'lee@example.com' }, priority: 'medium', status: 'in_progress', category: '기능', assignee: '박상담', createdAt: '2024-12-05 11:20', updatedAt: '2024-12-05 13:45', messages: 3 },
    { id: '3', number: 'TKT-2024-0154', subject: '회원 탈퇴 요청', description: '계정 탈퇴를 원합니다', customer: { name: '박탈퇴', email: 'park@example.com' }, priority: 'low', status: 'pending', category: '계정', createdAt: '2024-12-05 09:15', updatedAt: '2024-12-05 10:00', messages: 2 },
    { id: '4', number: 'TKT-2024-0153', subject: '긴급! 사이트가 안열립니다', description: '제 웹사이트가 접속이 안됩니다', customer: { name: '최긴급', email: 'choi@example.com' }, priority: 'urgent', status: 'resolved', category: '기술', assignee: '김기술', createdAt: '2024-12-04 22:30', updatedAt: '2024-12-05 01:15', messages: 8 },
    { id: '5', number: 'TKT-2024-0152', subject: '요금제 변경 문의', description: '프리미엄 요금제로 업그레이드하고 싶습니다', customer: { name: '정업그레이드', email: 'jung@example.com' }, priority: 'medium', status: 'closed', category: '결제', assignee: '박상담', createdAt: '2024-12-04 15:00', updatedAt: '2024-12-04 16:30', messages: 4 },
  ]);

  const [faqs] = useState<FAQ[]>([
    { id: '1', question: '결제는 어떻게 하나요?', answer: '설정 > 결제에서 카드를 등록하실 수 있습니다...', category: '결제', views: 1250, helpful: 89 },
    { id: '2', question: '템플릿은 어떻게 변경하나요?', answer: '에디터에서 템플릿 갤러리를 열어 선택할 수 있습니다...', category: '기능', views: 980, helpful: 76 },
    { id: '3', question: '도메인 연결 방법', answer: 'DNS 설정에서 CNAME 레코드를 추가해주세요...', category: '기술', views: 856, helpful: 92 },
    { id: '4', question: '회원 탈퇴는 어떻게 하나요?', answer: '설정 > 계정 > 탈퇴하기에서 진행하실 수 있습니다...', category: '계정', views: 654, helpful: 45 },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-600';
      case 'high': return 'bg-orange-100 text-orange-600';
      case 'medium': return 'bg-yellow-100 text-yellow-600';
      case 'low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'in_progress': return 'bg-purple-100 text-purple-600';
      case 'resolved': return 'bg-green-100 text-green-600';
      case 'closed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">지원 센터</h1>
          <p className="text-gray-500 mt-1">고객 문의 및 FAQ를 관리합니다</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
          <Plus className="w-4 h-4" />
          티켓 생성
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-6 gap-4">
        {[
          { label: '전체 티켓', value: stats.totalTickets, icon: Inbox, color: 'text-blue-500' },
          { label: '미해결', value: stats.openTickets, icon: AlertCircle, color: 'text-orange-500', alert: true },
          { label: '평균 응답', value: stats.avgResponseTime, icon: Clock, color: 'text-purple-500' },
          { label: '만족도', value: stats.satisfactionRate + '%', icon: Star, color: 'text-yellow-500' },
          { label: '오늘 해결', value: stats.resolvedToday, icon: CheckCircle, color: 'text-green-500' },
          { label: '오늘 신규', value: stats.newToday, icon: Plus, color: 'text-cyan-500' },
        ].map((stat, index) => (
          <div key={index} className={`bg-white rounded-xl p-4 shadow-sm border ${stat.alert ? 'border-orange-200' : 'border-gray-100'}`}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-sm text-gray-500">{stat.label}</span>
              {stat.alert && <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />}
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 탭 */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'overview', label: '개요', icon: TrendingUp },
          { id: 'tickets', label: '티켓', icon: MessageSquare, badge: stats.openTickets },
          { id: 'faq', label: 'FAQ', icon: HelpCircle },
          { id: 'canned', label: '템플릿 답변', icon: Archive },
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
            {tab.badge && tab.badge > 0 && (
              <span className="px-2 py-0.5 bg-orange-500 text-white rounded-full text-xs">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* 개요 */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          {/* 긴급 티켓 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                긴급/높음 우선순위
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {tickets.filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'closed').map((ticket) => (
                <div key={ticket.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{ticket.number}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority === 'urgent' ? '긴급' : '높음'}
                    </span>
                  </div>
                  <p className="font-medium text-gray-800 text-sm line-clamp-1">{ticket.subject}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{ticket.customer.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                      {ticket.status === 'open' ? '접수' :
                       ticket.status === 'in_progress' ? '처리중' :
                       ticket.status === 'pending' ? '대기' : ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 티켓 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">최근 티켓</h3>
              <button className="text-sm text-primary-600 hover:underline">모두 보기</button>
            </div>
            <div className="p-4 space-y-3">
              {tickets.slice(0, 4).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{ticket.subject}</p>
                    <p className="text-xs text-gray-500">{ticket.customer.name} • {ticket.createdAt}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                    {ticket.status === 'open' ? '접수' :
                     ticket.status === 'in_progress' ? '처리중' :
                     ticket.status === 'pending' ? '대기' :
                     ticket.status === 'resolved' ? '해결' : '종료'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 카테고리별 통계 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">카테고리별 문의</h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                { name: '결제', count: 45, percentage: 29 },
                { name: '기능', count: 38, percentage: 24 },
                { name: '기술', count: 35, percentage: 22 },
                { name: '계정', count: 28, percentage: 18 },
                { name: '기타', count: 10, percentage: 7 },
              ].map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{category.name}</span>
                    <span className="text-sm font-medium text-gray-800">{category.count}건</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 담당자별 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">담당자 현황</h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                { name: '박상담', open: 5, resolved: 23, rating: 4.8 },
                { name: '김기술', open: 3, resolved: 18, rating: 4.9 },
                { name: '이지원', open: 7, resolved: 15, rating: 4.6 },
              ].map((agent) => (
                <div key={agent.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{agent.name}</p>
                      <p className="text-xs text-gray-500">처리중 {agent.open} / 해결 {agent.resolved}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{agent.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 티켓 탭 */}
      {activeTab === 'tickets' && !selectedTicket && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="티켓 검색..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
              <option>전체 상태</option>
              <option>접수</option>
              <option>처리중</option>
              <option>대기</option>
              <option>해결</option>
            </select>
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
              <option>전체 우선순위</option>
              <option>긴급</option>
              <option>높음</option>
              <option>보통</option>
              <option>낮음</option>
            </select>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">티켓</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">고객</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">카테고리</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">우선순위</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">담당자</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-500">{ticket.number}</p>
                    <p className="font-medium text-gray-800 line-clamp-1">{ticket.subject}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-800">{ticket.customer.name}</p>
                    <p className="text-xs text-gray-500">{ticket.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{ticket.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority === 'urgent' ? '긴급' :
                       ticket.priority === 'high' ? '높음' :
                       ticket.priority === 'medium' ? '보통' : '낮음'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                      {ticket.status === 'open' ? '접수' :
                       ticket.status === 'in_progress' ? '처리중' :
                       ticket.status === 'pending' ? '대기' :
                       ticket.status === 'resolved' ? '해결' : '종료'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{ticket.assignee || '-'}</td>
                  <td className="px-4 py-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 티켓 상세 */}
      {activeTab === 'tickets' && selectedTicket && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <button onClick={() => setSelectedTicket(null)} className="text-sm text-primary-600 hover:underline">
              ← 목록으로
            </button>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">{selectedTicket.number}</p>
                  <h2 className="text-xl font-bold text-gray-800">{selectedTicket.subject}</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedTicket.status)}`}>
                  {selectedTicket.status === 'open' ? '접수' :
                   selectedTicket.status === 'in_progress' ? '처리중' :
                   selectedTicket.status === 'pending' ? '대기' :
                   selectedTicket.status === 'resolved' ? '해결' : '종료'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{selectedTicket.description}</p>
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-medium text-gray-800 mb-4">대화 내역</h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">{selectedTicket.description}</p>
                      <p className="text-xs text-gray-400 mt-2">{selectedTicket.customer.name} • {selectedTicket.createdAt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="답변을 입력하세요..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                />
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </button>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  전송
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h4 className="font-medium text-gray-800 mb-4">티켓 정보</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">고객</span>
                  <span className="text-gray-800">{selectedTicket.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">이메일</span>
                  <span className="text-gray-800">{selectedTicket.customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">카테고리</span>
                  <span className="text-gray-800">{selectedTicket.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">우선순위</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">담당자</span>
                  <select className="text-gray-800 border rounded px-2 py-1 text-sm">
                    <option>{selectedTicket.assignee || '미배정'}</option>
                    <option>박상담</option>
                    <option>김기술</option>
                    <option>이지원</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h4 className="font-medium text-gray-800 mb-4">빠른 작업</h4>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-lg">✅ 해결 완료</button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-lg">⏸️ 대기 상태로</button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-lg text-red-600">🗑️ 티켓 삭제</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ 탭 */}
      {activeTab === 'faq' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">FAQ 관리</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm">
              <Plus className="w-4 h-4" />
              FAQ 추가
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded mb-2 inline-block">{faq.category}</span>
                    <h4 className="font-medium text-gray-800">{faq.question}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{faq.answer}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>조회 {faq.views}</span>
                      <span>👍 {faq.helpful}</span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 템플릿 답변 탭 */}
      {activeTab === 'canned' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">템플릿 답변</h3>
          <p className="text-gray-500">자주 사용하는 답변 템플릿을 관리합니다</p>
        </div>
      )}
    </div>
  );
}

