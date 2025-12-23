/**
 * 템플릿 마켓플레이스 컴포넌트
 * 재사용 가능한 템플릿 라이브러리
 */

'use client';

import React, { useState } from 'react';
import { Search, Download, Star, Eye, Code, Image, Video, FileText, Filter } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'code' | 'design' | 'content' | 'video';
  rating: number;
  downloads: number;
  preview: string;
  tags: string[];
  free: boolean;
}

export function TemplateMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [templates] = useState<Template[]>([
    {
      id: '1',
      name: 'React Todo 앱',
      description: '완전한 React Todo 애플리케이션 템플릿',
      category: 'code',
      rating: 4.8,
      downloads: 1250,
      preview: '/templates/react-todo.png',
      tags: ['React', 'TypeScript', 'Todo'],
      free: true,
    },
    {
      id: '2',
      name: '랜딩 페이지 디자인',
      description: '모던한 랜딩 페이지 템플릿',
      category: 'design',
      rating: 4.9,
      downloads: 2100,
      preview: '/templates/landing.png',
      tags: ['Design', 'Landing', 'Modern'],
      free: true,
    },
    {
      id: '3',
      name: '블로그 포스트 템플릿',
      description: 'SEO 최적화된 블로그 포스트 템플릿',
      category: 'content',
      rating: 4.7,
      downloads: 890,
      preview: '/templates/blog.png',
      tags: ['Blog', 'SEO', 'Content'],
      free: true,
    },
    {
      id: '4',
      name: '프로모션 영상 템플릿',
      description: '동영상 편집용 프로모션 템플릿',
      category: 'video',
      rating: 4.6,
      downloads: 650,
      preview: '/templates/video.png',
      tags: ['Video', 'Promotion', 'Marketing'],
      free: false,
    },
  ]);

  const categories = [
    { id: 'all', name: '전체', icon: Filter },
    { id: 'code', name: '코드', icon: Code },
    { id: 'design', name: '디자인', icon: Image },
    { id: 'content', name: '콘텐츠', icon: FileText },
    { id: 'video', name: '영상', icon: Video },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* 검색 및 필터 */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="템플릿 검색..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedCategory === category.id
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={18} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 템플릿 그리드 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <div className="text-4xl">
                {template.category === 'code' && <Code size={48} className="text-purple-600" />}
                {template.category === 'design' && <Image size={48} className="text-purple-600" />}
                {template.category === 'content' && <FileText size={48} className="text-purple-600" />}
                {template.category === 'video' && <Video size={48} className="text-purple-600" />}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900">{template.name}</h3>
                {!template.free && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">
                    프리미엄
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span>{template.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download size={16} />
                  <span>{template.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>미리보기</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {template.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                <Download size={18} />
                템플릿 사용하기
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Search className="mx-auto mb-4 text-gray-400" size={48} />
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}

