'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Flag,
  Check,
  X,
  Filter,
  Search,
  MoreVertical,
  User,
  Image,
  Settings,
  BarChart3,
} from 'lucide-react';

interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  notHelpful: number;
  verified: boolean;
  images?: string[];
  reply?: string;
  status: 'published' | 'pending' | 'rejected';
}

export function ReviewRatingSystem() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'analytics' | 'settings'>('reviews');
  const [filter, setFilter] = useState('all');
  
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      author: '김철수',
      rating: 5,
      title: '정말 훌륭한 서비스입니다!',
      content: '웹사이트를 만드는 것이 이렇게 쉬울 줄 몰랐습니다. AI 기능이 특히 인상적이에요.',
      date: '2024-12-03',
      helpful: 24,
      notHelpful: 2,
      verified: true,
      status: 'published',
      reply: '소중한 리뷰 감사합니다! 앞으로도 더 좋은 서비스로 보답하겠습니다.',
    },
    {
      id: '2',
      author: '이영희',
      rating: 4,
      title: '사용하기 편리해요',
      content: '전반적으로 만족스럽습니다. 다만 몇 가지 기능이 더 추가되면 좋겠어요.',
      date: '2024-12-01',
      helpful: 15,
      notHelpful: 1,
      verified: true,
      status: 'published',
    },
    {
      id: '3',
      author: '박민수',
      rating: 5,
      title: '최고의 웹빌더',
      content: '다른 서비스들도 써봤지만 GRIP이 가장 좋습니다.',
      date: '2024-11-28',
      helpful: 8,
      notHelpful: 0,
      verified: false,
      status: 'pending',
    },
  ]);

  const stats = {
    averageRating: 4.7,
    totalReviews: 156,
    ratingDistribution: [
      { stars: 5, count: 98, percentage: 63 },
      { stars: 4, count: 35, percentage: 22 },
      { stars: 3, count: 15, percentage: 10 },
      { stars: 2, count: 5, percentage: 3 },
      { stars: 1, count: 3, percentage: 2 },
    ],
  };

  const [widgetSettings, setWidgetSettings] = useState({
    showAverage: true,
    showDistribution: true,
    allowImages: true,
    requireVerification: false,
    autoApprove: false,
    minLength: 10,
  });

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClass = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'rejected':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          리뷰 시스템
        </h3>
      </div>
      
      {/* 평균 평점 요약 */}
      <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-800 dark:text-white">{stats.averageRating}</p>
            {renderStars(Math.round(stats.averageRating), 'md')}
            <p className="text-xs text-gray-500 mt-1">{stats.totalReviews}개 리뷰</p>
          </div>
          
          <div className="flex-1 space-y-1">
            {stats.ratingDistribution.map((dist) => (
              <div key={dist.stars} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-3">{dist.stars}</span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8">{dist.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 탭 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {[
          { id: 'reviews', label: '리뷰', icon: MessageCircle },
          { id: 'analytics', label: '분석', icon: BarChart3 },
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
      
      {/* 리뷰 목록 */}
      {activeTab === 'reviews' && (
        <div className="space-y-3">
          {/* 필터 */}
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border rounded-lg px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">전체</option>
              <option value="published">게시됨</option>
              <option value="pending">대기</option>
              <option value="5">5점</option>
              <option value="4">4점</option>
              <option value="3">3점 이하</option>
            </select>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="검색..."
                className="w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          
          {/* 리뷰 목록 */}
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 dark:text-white text-sm">{review.author}</span>
                      {review.verified && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-600 rounded text-xs">
                          <Check className="w-3 h-3" />
                          인증됨
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(review.status)}`}>
                    {review.status === 'published' ? '게시' : review.status === 'pending' ? '대기' : '거부'}
                  </span>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <h4 className="font-medium text-gray-800 dark:text-white text-sm mt-3">{review.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{review.content}</p>
              
              {review.reply && (
                <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-600 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-1">관리자 답변</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{review.reply}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                    <ThumbsUp className="w-3 h-3" />
                    {review.helpful}
                  </button>
                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                    <ThumbsDown className="w-3 h-3" />
                    {review.notHelpful}
                  </button>
                </div>
                
                <div className="flex gap-1">
                  {review.status === 'pending' && (
                    <>
                      <button className="p-1.5 hover:bg-green-50 dark:hover:bg-green-900/20 rounded text-green-500">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-gray-500">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* 분석 */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '이번 달 리뷰', value: '23', change: '+15%' },
              { label: '평균 평점', value: '4.7', change: '+0.2' },
              { label: '응답률', value: '85%', change: '+5%' },
              { label: '추천율', value: '92%', change: '+3%' },
            ].map((stat, index) => (
              <div key={index} className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500">{stat.label}</p>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-gray-800 dark:text-white">{stat.value}</span>
                  <span className="text-xs text-green-500">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">키워드 분석</h4>
            <div className="flex flex-wrap gap-2">
              {['사용하기 쉬움', 'AI 기능', '빠른 속도', '디자인', '가격 대비 좋음', '고객 지원'].map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* 설정 */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">위젯 설정</h4>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">평균 평점 표시</span>
                <input
                  type="checkbox"
                  checked={widgetSettings.showAverage}
                  onChange={(e) => setWidgetSettings({ ...widgetSettings, showAverage: e.target.checked })}
                  className="w-4 h-4 accent-primary-500"
                />
              </label>
              
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">분포 그래프 표시</span>
                <input
                  type="checkbox"
                  checked={widgetSettings.showDistribution}
                  onChange={(e) => setWidgetSettings({ ...widgetSettings, showDistribution: e.target.checked })}
                  className="w-4 h-4 accent-primary-500"
                />
              </label>
              
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">이미지 첨부 허용</span>
                <input
                  type="checkbox"
                  checked={widgetSettings.allowImages}
                  onChange={(e) => setWidgetSettings({ ...widgetSettings, allowImages: e.target.checked })}
                  className="w-4 h-4 accent-primary-500"
                />
              </label>
              
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">자동 승인</span>
                <input
                  type="checkbox"
                  checked={widgetSettings.autoApprove}
                  onChange={(e) => setWidgetSettings({ ...widgetSettings, autoApprove: e.target.checked })}
                  className="w-4 h-4 accent-primary-500"
                />
              </label>
              
              <div>
                <label className="text-xs text-gray-500 mb-1 block">최소 글자 수</label>
                <input
                  type="number"
                  value={widgetSettings.minLength}
                  onChange={(e) => setWidgetSettings({ ...widgetSettings, minLength: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewRatingSystem;

