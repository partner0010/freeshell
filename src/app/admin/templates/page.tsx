'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Star,
  Copy,
  MoreVertical,
  Layout,
  TrendingUp,
  Users,
} from 'lucide-react';

// 템플릿 데이터
const templatesData = [
  { id: 1, name: 'SaaS 랜딩', category: 'landing', downloads: 1234, rating: 4.8, status: 'active', featured: true, createdAt: '2024-01-15' },
  { id: 2, name: '개발자 포트폴리오', category: 'portfolio', downloads: 987, rating: 4.6, status: 'active', featured: true, createdAt: '2024-01-20' },
  { id: 3, name: '기업 소개', category: 'business', downloads: 756, rating: 4.5, status: 'active', featured: false, createdAt: '2024-02-01' },
  { id: 4, name: '이커머스 스토어', category: 'ecommerce', downloads: 654, rating: 4.7, status: 'active', featured: true, createdAt: '2024-02-10' },
  { id: 5, name: '개인 블로그', category: 'blog', downloads: 543, rating: 4.3, status: 'active', featured: false, createdAt: '2024-02-15' },
  { id: 6, name: '스타트업 피칭', category: 'startup', downloads: 432, rating: 4.9, status: 'draft', featured: false, createdAt: '2024-03-01' },
];

const categoryLabels: Record<string, string> = {
  landing: '랜딩페이지',
  portfolio: '포트폴리오',
  business: '비즈니스',
  ecommerce: '이커머스',
  blog: '블로그',
  startup: '스타트업',
};

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTemplates = templatesData.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: templatesData.length,
    featured: templatesData.filter(t => t.featured).length,
    totalDownloads: templatesData.reduce((sum, t) => sum + t.downloads, 0),
    avgRating: (templatesData.reduce((sum, t) => sum + t.rating, 0) / templatesData.length).toFixed(1),
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">템플릿 관리</h1>
          <p className="text-gray-500 mt-1">템플릿을 생성하고 관리하세요</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <Plus size={18} />
          새 템플릿
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Layout className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">전체 템플릿</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">추천 템플릿</p>
              <p className="text-2xl font-bold text-gray-800">{stats.featured}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Download className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">총 다운로드</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalDownloads.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">평균 평점</p>
              <p className="text-2xl font-bold text-gray-800">{stats.avgRating}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="템플릿 검색..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <option value="all">모든 카테고리</option>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 템플릿 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden group"
          >
            {/* 썸네일 */}
            <div className="aspect-[16/10] bg-gradient-to-br from-pastel-lavender via-pastel-sky to-pastel-mint relative">
              {template.featured && (
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                  <Star size={12} />
                  추천
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100">
                  <Eye size={18} />
                </button>
                <button className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100">
                  <Edit size={18} />
                </button>
                <button className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-50 text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* 정보 */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{template.name}</h3>
                  <p className="text-sm text-gray-500">{categoryLabels[template.category]}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  template.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {template.status === 'active' ? '활성' : '초안'}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Download size={14} />
                    {template.downloads.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" />
                    {template.rating}
                  </span>
                </div>
                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 템플릿 생성 모달 */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">새 템플릿 만들기</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">템플릿 이름</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" placeholder="예: 마케팅 랜딩 페이지" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                  <textarea className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 h-24 resize-none" placeholder="템플릿에 대한 설명..." />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                  <label htmlFor="featured" className="text-sm text-gray-700">추천 템플릿으로 등록</label>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  취소
                </button>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  만들기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

