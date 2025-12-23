/**
 * 도움말 및 FAQ 페이지
 */

'use client';

import React, { useState } from 'react';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { InteractiveTutorial } from '@/components/help/InteractiveTutorial';
import { HelpCircle, Search, BookOpen, MessageSquare, Video, FileText } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqs: FAQ[] = [
    {
      question: 'Freeshell이란 무엇인가요?',
      answer: 'Freeshell은 AI 기반 콘텐츠 생성 플랫폼입니다. 웹페이지, 이미지, 영상, 텍스트 등을 AI의 도움으로 쉽게 생성할 수 있습니다.',
      category: '일반',
    },
    {
      question: '회원가입 없이 사용할 수 있나요?',
      answer: '네, 기본 기능은 회원가입 없이 사용할 수 있습니다. 하지만 "My Page"와 "Shorts" 기능을 사용하려면 회원가입이 필요합니다.',
      category: '계정',
    },
    {
      question: 'AI 기능은 어떻게 사용하나요?',
      answer: '에디터에서 AI 탭을 클릭하거나 메인 페이지의 AI 어시스턴트를 사용하여 텍스트, 이미지, 코드를 생성할 수 있습니다.',
      category: '기능',
    },
    {
      question: '템플릿은 어떻게 사용하나요?',
      answer: '템플릿 마켓플레이스에서 원하는 템플릿을 선택하고 "템플릿 사용하기" 버튼을 클릭하면 에디터에 적용됩니다.',
      category: '기능',
    },
    {
      question: '실시간 협업은 어떻게 하나요?',
      answer: '에디터에서 협업 탭을 열고 초대 코드를 생성하여 다른 사용자에게 공유하면 함께 작업할 수 있습니다.',
      category: '협업',
    },
    {
      question: '포인트는 어떻게 적립하나요?',
      answer: '프로젝트 생성, AI 기능 사용, 일일 로그인 등 다양한 활동을 통해 포인트를 적립할 수 있습니다.',
      category: '혜택',
    },
  ];

  const categories = ['all', '일반', '계정', '기능', '협업', '혜택'];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <HelpCircle className="text-purple-600" size={40} />
            도움말
          </h1>
          <p className="text-lg text-gray-600">
            궁금한 점을 찾아보거나 튜토리얼을 따라해보세요
          </p>
        </div>

        {/* 빠른 링크 */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: BookOpen, label: '튜토리얼', desc: '인터랙티브 가이드', color: 'blue' },
            { icon: MessageSquare, label: 'FAQ', desc: '자주 묻는 질문', color: 'purple' },
            { icon: Video, label: '비디오 가이드', desc: '영상 튜토리얼', color: 'green' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className={`w-12 h-12 bg-${item.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`text-${item.color}-600`} size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.label}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* 검색 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="질문을 검색하세요..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                selectedCategory === category
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {category === 'all' ? '전체' : category}
            </button>
          ))}
        </div>

        {/* FAQ 목록 */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <HelpCircle className="text-purple-600" size={20} />
                {faq.question}
              </h3>
              <p className="text-gray-600">{faq.answer}</p>
              <span className="inline-block mt-3 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                {faq.category}
              </span>
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Search className="mx-auto mb-4 text-gray-400" size={48} />
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 인터랙티브 튜토리얼 */}
      <InteractiveTutorial />
    </div>
  );
}

