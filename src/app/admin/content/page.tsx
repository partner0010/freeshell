'use client';

import React, { useState } from 'react';
import {
  FileText,
  Image,
  Video,
  File,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Upload,
  FolderOpen,
  MoreVertical,
  Check,
  X,
  Calendar,
  User,
  Globe,
  Lock,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'page' | 'post' | 'media' | 'file';
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  author: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  size?: string;
  url?: string;
}

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<'pages' | 'posts' | 'media' | 'files'>('pages');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [content] = useState<ContentItem[]>([
    { id: '1', title: '홈페이지', type: 'page', status: 'published', author: '관리자', createdAt: '2024-11-01', updatedAt: '2024-12-05', views: 15420, url: '/' },
    { id: '2', title: '서비스 소개', type: 'page', status: 'published', author: '관리자', createdAt: '2024-11-01', updatedAt: '2024-12-03', views: 8950, url: '/services' },
    { id: '3', title: '가격 정책', type: 'page', status: 'draft', author: '김편집', createdAt: '2024-12-01', updatedAt: '2024-12-05', views: 0, url: '/pricing' },
    { id: '4', title: '12월 업데이트 안내', type: 'post', status: 'published', author: '관리자', createdAt: '2024-12-01', updatedAt: '2024-12-01', views: 2340 },
    { id: '5', title: 'SEO 최적화 가이드', type: 'post', status: 'scheduled', author: '이작가', createdAt: '2024-12-05', updatedAt: '2024-12-05', views: 0 },
    { id: '6', title: 'hero-banner.jpg', type: 'media', status: 'published', author: '김디자인', createdAt: '2024-11-20', updatedAt: '2024-11-20', views: 5600, size: '2.4 MB' },
    { id: '7', title: 'product-demo.mp4', type: 'media', status: 'published', author: '박영상', createdAt: '2024-11-25', updatedAt: '2024-11-25', views: 1890, size: '45.2 MB' },
    { id: '8', title: '이용약관.pdf', type: 'file', status: 'published', author: '관리자', createdAt: '2024-10-15', updatedAt: '2024-12-01', views: 890, size: '156 KB' },
  ]);

  const stats = {
    totalPages: 12,
    totalPosts: 45,
    totalMedia: 234,
    totalFiles: 28,
    storageUsed: '2.4 GB',
    storageLimit: '10 GB',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-600';
      case 'draft': return 'bg-gray-100 text-gray-600';
      case 'scheduled': return 'bg-blue-100 text-blue-600';
      case 'archived': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return Globe;
      case 'post': return FileText;
      case 'media': return Image;
      case 'file': return File;
      default: return FileText;
    }
  };

  const filteredContent = content.filter((item) => {
    const matchesTab = 
      (activeTab === 'pages' && item.type === 'page') ||
      (activeTab === 'posts' && item.type === 'post') ||
      (activeTab === 'media' && item.type === 'media') ||
      (activeTab === 'files' && item.type === 'file');
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesTab && matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredContent.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">콘텐츠 관리</h1>
          <p className="text-gray-500 mt-1">페이지, 게시글, 미디어, 파일을 관리합니다</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
          <Plus className="w-4 h-4" />
          새 콘텐츠
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-6 gap-4">
        {[
          { label: '페이지', value: stats.totalPages, icon: Globe, color: 'text-blue-500' },
          { label: '게시글', value: stats.totalPosts, icon: FileText, color: 'text-green-500' },
          { label: '미디어', value: stats.totalMedia, icon: Image, color: 'text-purple-500' },
          { label: '파일', value: stats.totalFiles, icon: File, color: 'text-orange-500' },
          { label: '사용중', value: stats.storageUsed, icon: FolderOpen, color: 'text-cyan-500' },
          { label: '전체', value: stats.storageLimit, icon: Upload, color: 'text-gray-500' },
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

      {/* 스토리지 바 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">스토리지 사용량</span>
          <span className="text-sm font-medium text-gray-800">{stats.storageUsed} / {stats.storageLimit}</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" style={{ width: '24%' }} />
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'pages', label: '페이지', icon: Globe, count: stats.totalPages },
          { id: 'posts', label: '게시글', icon: FileText, count: stats.totalPosts },
          { id: 'media', label: '미디어', icon: Image, count: stats.totalMedia },
          { id: 'files', label: '파일', icon: File, count: stats.totalFiles },
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
            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* 필터 및 검색 */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="콘텐츠 검색..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg"
        >
          <option value="all">전체 상태</option>
          <option value="published">게시됨</option>
          <option value="draft">임시저장</option>
          <option value="scheduled">예약</option>
          <option value="archived">보관</option>
        </select>
        {selectedItems.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{selectedItems.length}개 선택</span>
            <button className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 콘텐츠 테이블 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 accent-primary-500"
                />
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">제목</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">작성자</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">수정일</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">조회</th>
              <th className="w-20 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredContent.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 accent-primary-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.title}</p>
                        {item.url && <p className="text-xs text-gray-500">{item.url}</p>}
                        {item.size && <p className="text-xs text-gray-500">{item.size}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                      {item.status === 'published' ? '게시됨' : 
                       item.status === 'draft' ? '임시저장' : 
                       item.status === 'scheduled' ? '예약' : '보관'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.author}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.updatedAt}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.views.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="보기">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="편집">
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="더보기">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

