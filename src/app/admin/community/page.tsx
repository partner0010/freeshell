'use client';

import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Flag,
  Ban,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  Trash2,
  MoreVertical,
  ThumbsUp,
  AlertTriangle,
  UserX,
  MessageCircle,
  Award,
  TrendingUp,
  Clock,
} from 'lucide-react';

interface CommunityPost {
  id: string;
  title: string;
  author: { name: string; email: string; level: number };
  category: string;
  status: 'published' | 'pending' | 'flagged' | 'removed';
  reports: number;
  likes: number;
  comments: number;
  createdAt: string;
}

interface CommunityMember {
  id: string;
  name: string;
  email: string;
  level: number;
  status: 'active' | 'warned' | 'suspended' | 'banned';
  posts: number;
  comments: number;
  reports: number;
  joinedAt: string;
  lastActive: string;
}

interface Report {
  id: string;
  type: 'post' | 'comment' | 'user';
  target: string;
  reason: string;
  reporter: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export default function CommunityManagementPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'members' | 'reports'>('overview');

  const stats = {
    totalMembers: 2456,
    activeToday: 342,
    totalPosts: 8923,
    pendingReview: 12,
    reportedContent: 5,
    bannedUsers: 23,
  };

  const [posts] = useState<CommunityPost[]>([
    { id: '1', title: 'SEO 최적화 완벽 가이드', author: { name: '김전문가', email: 'kim@example.com', level: 42 }, category: '팁 & 노하우', status: 'published', reports: 0, likes: 156, comments: 45, createdAt: '2024-12-04' },
    { id: '2', title: '부적절한 홍보 게시글', author: { name: '스팸러', email: 'spam@example.com', level: 1 }, category: '자유게시판', status: 'flagged', reports: 8, likes: 0, comments: 2, createdAt: '2024-12-05' },
    { id: '3', title: '결제 연동 질문', author: { name: '초보개발자', email: 'dev@example.com', level: 5 }, category: '질문 & 답변', status: 'pending', reports: 0, likes: 3, comments: 0, createdAt: '2024-12-05' },
    { id: '4', title: '포트폴리오 공유합니다', author: { name: '디자이너영희', email: 'design@example.com', level: 23 }, category: '작품 공유', status: 'published', reports: 0, likes: 78, comments: 19, createdAt: '2024-12-03' },
  ]);

  const [members] = useState<CommunityMember[]>([
    { id: '1', name: '김전문가', email: 'kim@example.com', level: 42, status: 'active', posts: 156, comments: 423, reports: 0, joinedAt: '2023-06-15', lastActive: '2024-12-05' },
    { id: '2', name: '스팸러', email: 'spam@example.com', level: 1, status: 'banned', posts: 12, comments: 5, reports: 15, joinedAt: '2024-12-01', lastActive: '2024-12-05' },
    { id: '3', name: '디자이너영희', email: 'design@example.com', level: 23, status: 'active', posts: 89, comments: 234, reports: 0, joinedAt: '2023-09-20', lastActive: '2024-12-04' },
    { id: '4', name: '문제유저', email: 'trouble@example.com', level: 8, status: 'warned', posts: 34, comments: 67, reports: 3, joinedAt: '2024-01-10', lastActive: '2024-12-03' },
  ]);

  const [reports] = useState<Report[]>([
    { id: '1', type: 'post', target: '부적절한 홍보 게시글', reason: '스팸/광고', reporter: '김전문가', status: 'pending', createdAt: '2024-12-05 14:30' },
    { id: '2', type: 'comment', target: '욕설이 포함된 댓글', reason: '욕설/비방', reporter: '디자이너영희', status: 'pending', createdAt: '2024-12-05 13:15' },
    { id: '3', type: 'user', target: '스팸러', reason: '반복적 광고', reporter: '여러 사용자', status: 'resolved', createdAt: '2024-12-04 16:00' },
  ]);

  const getPostStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'flagged': return 'bg-red-100 text-red-600';
      case 'removed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getMemberStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-600';
      case 'warned': return 'bg-yellow-100 text-yellow-600';
      case 'suspended': return 'bg-orange-100 text-orange-600';
      case 'banned': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">커뮤니티 관리</h1>
          <p className="text-gray-500 mt-1">게시글, 회원, 신고를 관리합니다</p>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-6 gap-4">
        {[
          { label: '총 회원', value: stats.totalMembers.toLocaleString(), icon: Users, color: 'text-blue-500' },
          { label: '오늘 활성', value: stats.activeToday, icon: TrendingUp, color: 'text-green-500' },
          { label: '총 게시글', value: stats.totalPosts.toLocaleString(), icon: MessageSquare, color: 'text-purple-500' },
          { label: '검토 대기', value: stats.pendingReview, icon: Clock, color: 'text-yellow-500', alert: stats.pendingReview > 0 },
          { label: '신고된 콘텐츠', value: stats.reportedContent, icon: Flag, color: 'text-red-500', alert: stats.reportedContent > 0 },
          { label: '차단 회원', value: stats.bannedUsers, icon: Ban, color: 'text-gray-500' },
        ].map((stat, index) => (
          <div key={index} className={`bg-white rounded-xl p-4 shadow-sm border ${stat.alert ? 'border-red-200' : 'border-gray-100'}`}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-sm text-gray-500">{stat.label}</span>
              {stat.alert && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 탭 */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'overview', label: '개요', icon: TrendingUp },
          { id: 'posts', label: '게시글', icon: MessageSquare },
          { id: 'members', label: '회원', icon: Users },
          { id: 'reports', label: '신고', icon: Flag, badge: stats.reportedContent },
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
              <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* 개요 */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          {/* 검토 대기 게시글 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                검토 대기
              </h3>
              <button className="text-sm text-primary-600 hover:underline">모두 보기</button>
            </div>
            <div className="p-4 space-y-3">
              {posts.filter((p) => p.status === 'pending').map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{post.title}</p>
                    <p className="text-xs text-gray-500">{post.author.name} • {post.createdAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-green-100 rounded-lg text-green-600">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-100 rounded-lg text-red-600">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {posts.filter((p) => p.status === 'pending').length === 0 && (
                <p className="text-center text-gray-500 py-4">검토 대기 중인 게시글이 없습니다</p>
              )}
            </div>
          </div>

          {/* 최근 신고 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Flag className="w-4 h-4 text-red-500" />
                최근 신고
              </h3>
              <button className="text-sm text-primary-600 hover:underline">모두 보기</button>
            </div>
            <div className="p-4 space-y-3">
              {reports.filter((r) => r.status === 'pending').map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{report.target}</p>
                    <p className="text-xs text-gray-500">{report.reason} • {report.reporter}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 문제 회원 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                주의 필요 회원
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {members.filter((m) => m.status === 'warned' || m.reports > 0).map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{member.name}</p>
                      <p className="text-xs text-gray-500">신고 {member.reports}회 • Lv.{member.level}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getMemberStatusColor(member.status)}`}>
                    {member.status === 'warned' ? '경고' : member.status === 'suspended' ? '정지' : member.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 빠른 작업 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">빠른 작업</h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {[
                { label: '게시글 검토', icon: MessageSquare, count: stats.pendingReview },
                { label: '신고 처리', icon: Flag, count: stats.reportedContent },
                { label: '회원 관리', icon: Users, count: null },
                { label: '차단 목록', icon: Ban, count: stats.bannedUsers },
              ].map((action, index) => (
                <button
                  key={index}
                  className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <action.icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">{action.label}</span>
                  {action.count !== null && (
                    <span className="ml-auto px-2 py-0.5 bg-gray-200 rounded-full text-xs">{action.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 게시글 탭 */}
      {activeTab === 'posts' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="게시글 검색..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
              <option>전체 상태</option>
              <option>게시됨</option>
              <option>검토 대기</option>
              <option>신고됨</option>
            </select>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">제목</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">작성자</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">카테고리</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">반응</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{post.title}</p>
                    <p className="text-xs text-gray-500">{post.createdAt}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-800">{post.author.name}</p>
                    <p className="text-xs text-gray-500">Lv.{post.author.level}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{post.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPostStatusColor(post.status)}`}>
                      {post.status === 'published' ? '게시됨' :
                       post.status === 'pending' ? '검토 대기' :
                       post.status === 'flagged' ? '신고됨' : '삭제됨'}
                    </span>
                    {post.reports > 0 && (
                      <span className="ml-2 text-xs text-red-500">신고 {post.reports}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {post.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.comments}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4 text-gray-500" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg"><Trash2 className="w-4 h-4 text-gray-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 회원 탭 */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="회원 검색..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
              <option>전체 상태</option>
              <option>활성</option>
              <option>경고</option>
              <option>정지</option>
              <option>차단</option>
            </select>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">회원</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">레벨</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">활동</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">신고</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">Lv.{member.level}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <p>게시글 {member.posts} / 댓글 {member.comments}</p>
                    <p className="text-xs">최근 활동: {member.lastActive}</p>
                  </td>
                  <td className="px-4 py-3">
                    {member.reports > 0 ? (
                      <span className="text-red-500 font-medium">{member.reports}회</span>
                    ) : (
                      <span className="text-gray-400">없음</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getMemberStatusColor(member.status)}`}>
                      {member.status === 'active' ? '활성' :
                       member.status === 'warned' ? '경고' :
                       member.status === 'suspended' ? '정지' : '차단'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4 text-gray-500" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg"><Ban className="w-4 h-4 text-gray-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 신고 탭 */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">유형</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">대상</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">사유</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">신고자</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                <th className="w-32"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {report.type === 'post' ? '게시글' : report.type === 'comment' ? '댓글' : '회원'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{report.target}</td>
                  <td className="px-4 py-3 text-gray-600">{report.reason}</td>
                  <td className="px-4 py-3 text-gray-600">{report.reporter}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      report.status === 'resolved' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {report.status === 'pending' ? '대기' : report.status === 'resolved' ? '처리됨' : '기각'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {report.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">조치</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">기각</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

