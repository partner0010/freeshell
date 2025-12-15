'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Eye,
  Search,
  Filter,
  Plus,
  Pin,
  Award,
  Clock,
  Tag,
  ChevronRight,
  Heart,
  Share2,
  Bookmark,
  MoreHorizontal,
  CheckCircle,
  Star,
  TrendingUp,
  MessageCircle,
  User,
  Image,
  Send,
  Flag,
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    level: number;
    badge?: string;
  };
  category: string;
  tags: string[];
  createdAt: string;
  views: number;
  likes: number;
  comments: number;
  isPinned?: boolean;
  isSolved?: boolean;
  isHot?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  postCount: number;
  color: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  isAccepted?: boolean;
}

export function CommunityForum() {
  const [activeTab, setActiveTab] = useState<'feed' | 'categories' | 'members' | 'create'>('feed');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [sortBy, setSortBy] = useState('latest');
  
  const [categories] = useState<Category[]>([
    { id: '1', name: '공지사항', icon: '📢', description: '공식 공지 및 업데이트', postCount: 24, color: 'bg-red-100 text-red-600' },
    { id: '2', name: '팁 & 노하우', icon: '💡', description: '유용한 팁과 튜토리얼', postCount: 156, color: 'bg-yellow-100 text-yellow-600' },
    { id: '3', name: '질문 & 답변', icon: '❓', description: '질문하고 답변 받기', postCount: 342, color: 'bg-blue-100 text-blue-600' },
    { id: '4', name: '작품 공유', icon: '🎨', description: '만든 사이트 자랑하기', postCount: 89, color: 'bg-purple-100 text-purple-600' },
    { id: '5', name: '기능 요청', icon: '🚀', description: '새 기능 제안하기', postCount: 67, color: 'bg-green-100 text-green-600' },
    { id: '6', name: '자유게시판', icon: '💬', description: '자유로운 대화', postCount: 234, color: 'bg-gray-100 text-gray-600' },
  ]);
  
  const [posts] = useState<Post[]>([
    {
      id: '1',
      title: '🔥 12월 대규모 업데이트 안내',
      content: '안녕하세요! 이번 12월 업데이트에서 추가된 기능들을 소개합니다...',
      author: { name: 'GRIP 팀', level: 99, badge: '👑 운영자' },
      category: '공지사항',
      tags: ['공지', '업데이트'],
      createdAt: '2024-12-05',
      views: 1250,
      likes: 89,
      comments: 23,
      isPinned: true,
    },
    {
      id: '2',
      title: 'SEO 최적화 완벽 가이드 (2024년 버전)',
      content: '검색엔진 최적화를 위한 모든 팁을 정리했습니다...',
      author: { name: '김전문가', level: 42, badge: '🏆 전문가' },
      category: '팁 & 노하우',
      tags: ['SEO', '가이드', '튜토리얼'],
      createdAt: '2024-12-04',
      views: 890,
      likes: 156,
      comments: 45,
      isHot: true,
    },
    {
      id: '3',
      title: '결제 연동이 안 되는데 도와주세요 😭',
      content: 'Stripe 연동 중인데 계속 에러가 발생합니다...',
      author: { name: '초보개발자', level: 5 },
      category: '질문 & 답변',
      tags: ['결제', 'Stripe', '도움요청'],
      createdAt: '2024-12-05',
      views: 67,
      likes: 3,
      comments: 8,
      isSolved: true,
    },
    {
      id: '4',
      title: '내가 만든 포트폴리오 사이트 공유합니다!',
      content: 'GRIP으로 3일 만에 완성한 포트폴리오입니다...',
      author: { name: '디자이너영희', level: 23, badge: '🎨 아티스트' },
      category: '작품 공유',
      tags: ['포트폴리오', '디자인'],
      createdAt: '2024-12-03',
      views: 456,
      likes: 78,
      comments: 19,
    },
    {
      id: '5',
      title: '다국어 자동 번역 기능이 있으면 좋겠어요',
      content: '글로벌 사이트를 만들고 싶은데 번역 기능이...',
      author: { name: '글로벌민수', level: 15 },
      category: '기능 요청',
      tags: ['번역', '다국어', '기능요청'],
      createdAt: '2024-12-02',
      views: 234,
      likes: 45,
      comments: 12,
    },
  ]);
  
  const [comments] = useState<Comment[]>([
    { id: 'c1', author: '도움이', content: 'API 키를 확인해보셨나요? 환경변수 설정이 잘못됐을 수 있어요.', createdAt: '2시간 전', likes: 12, isAccepted: true },
    { id: 'c2', author: '경험자', content: '저도 같은 문제 겪었는데 webhook URL 설정 후 해결됐어요!', createdAt: '1시간 전', likes: 5 },
  ]);
  
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
  });

  const topMembers = [
    { name: '김전문가', level: 42, badge: '🏆', posts: 156, likes: 2340 },
    { name: '디자이너영희', level: 23, badge: '🎨', posts: 89, likes: 1560 },
    { name: '개발자철수', level: 31, badge: '💻', posts: 123, likes: 1890 },
  ];

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.color || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-500" />
          커뮤니티
        </h3>
        <button
          onClick={() => setActiveTab('create')}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm"
        >
          <Plus className="w-4 h-4" />
          글쓰기
        </button>
      </div>
      
      {/* 통계 */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: '게시글', value: '912', icon: MessageSquare },
          { label: '회원', value: '2.4k', icon: Users },
          { label: '댓글', value: '5.6k', icon: MessageCircle },
          { label: '좋아요', value: '12k', icon: Heart },
        ].map((stat, index) => (
          <div
            key={index}
            className="p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-center"
          >
            <stat.icon className="w-4 h-4 text-primary-500 mx-auto mb-1" />
            <p className="font-bold text-gray-800 dark:text-white text-sm">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
      
      {/* 탭 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {[
          { id: 'feed', label: '피드', icon: MessageSquare },
          { id: 'categories', label: '카테고리', icon: Tag },
          { id: 'members', label: '멤버', icon: Users },
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
      
      {/* 피드 */}
      {activeTab === 'feed' && !selectedPost && (
        <div className="space-y-3">
          {/* 검색 및 정렬 */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="검색..."
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
              <option value="views">조회순</option>
            </select>
          </div>
          
          {/* 게시글 목록 */}
          <div className="space-y-2">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelectedPost(post)}
                className={`p-3 bg-white dark:bg-gray-700 rounded-lg border cursor-pointer hover:border-primary-300 transition-colors ${
                  post.isPinned ? 'border-primary-200 dark:border-primary-700' : 'border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* 아바타 */}
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author.name.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* 상단 태그 */}
                    <div className="flex items-center gap-2 mb-1">
                      {post.isPinned && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-primary-100 text-primary-600 text-xs rounded">
                          <Pin className="w-3 h-3" />
                          고정
                        </span>
                      )}
                      {post.isHot && (
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded">🔥 인기</span>
                      )}
                      {post.isSolved && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-600 text-xs rounded">
                          <CheckCircle className="w-3 h-3" />
                          해결됨
                        </span>
                      )}
                      <span className={`px-1.5 py-0.5 ${getCategoryColor(post.category)} text-xs rounded`}>
                        {post.category}
                      </span>
                    </div>
                    
                    {/* 제목 */}
                    <h4 className="font-medium text-gray-800 dark:text-white text-sm line-clamp-1">
                      {post.title}
                    </h4>
                    
                    {/* 작성자 정보 */}
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="font-medium">{post.author.name}</span>
                      {post.author.badge && <span>{post.author.badge}</span>}
                      <span>Lv.{post.author.level}</span>
                      <span>•</span>
                      <span>{post.createdAt}</span>
                    </div>
                    
                    {/* 통계 */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* 게시글 상세 */}
      {activeTab === 'feed' && selectedPost && (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedPost(null)}
            className="text-sm text-primary-600 hover:underline"
          >
            ← 목록으로
          </button>
          
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              {selectedPost.title}
            </h2>
            
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-600">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                {selectedPost.author.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white text-sm">
                  {selectedPost.author.name}
                  {selectedPost.author.badge && <span className="ml-1">{selectedPost.author.badge}</span>}
                </p>
                <p className="text-xs text-gray-500">{selectedPost.createdAt} • 조회 {selectedPost.views}</p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{selectedPost.content}</p>
            
            <div className="flex items-center gap-2 mb-4">
              {selectedPost.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-xs rounded">
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-600">
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-500">
                <ThumbsUp className="w-4 h-4" />
                좋아요 {selectedPost.likes}
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-500">
                <Bookmark className="w-4 h-4" />
                북마크
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-500">
                <Share2 className="w-4 h-4" />
                공유
              </button>
            </div>
          </div>
          
          {/* 댓글 */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 dark:text-white">댓글 {comments.length}개</h4>
            
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`p-3 bg-white dark:bg-gray-700 rounded-lg border ${
                  comment.isAccepted ? 'border-green-300 dark:border-green-700' : 'border-gray-200 dark:border-gray-600'
                }`}
              >
                {comment.isAccepted && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded w-fit mb-2">
                    <CheckCircle className="w-3 h-3" />
                    채택된 답변
                  </span>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white text-sm">{comment.author}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{comment.content}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>{comment.createdAt}</span>
                  <button className="flex items-center gap-1 hover:text-primary-500">
                    <ThumbsUp className="w-3 h-3" />
                    {comment.likes}
                  </button>
                </div>
              </div>
            ))}
            
            {/* 댓글 입력 */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="댓글을 입력하세요..."
                className="flex-1 px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 카테고리 */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02 }}
              className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:border-primary-300"
              onClick={() => {
                setSelectedCategory(category.id);
                setActiveTab('feed');
              }}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <h4 className="font-medium text-gray-800 dark:text-white text-sm">{category.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{category.description}</p>
              <p className="text-xs text-primary-500 mt-2">{category.postCount}개 게시글</p>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* 멤버 */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-primary-50 to-pastel-lavender dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl">
            <h4 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-500" />
              이번 주 TOP 기여자
            </h4>
            <div className="space-y-3">
              {topMembers.map((member, index) => (
                <div key={member.name} className="flex items-center gap-3">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    'bg-orange-300 text-orange-900'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-white text-sm">
                      {member.badge} {member.name}
                    </p>
                    <p className="text-xs text-gray-500">Lv.{member.level} • {member.posts}글 • {member.likes}좋아요</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-medium text-gray-800 dark:text-white mb-3">레벨 시스템</h4>
            <div className="space-y-2 text-sm">
              {[
                { level: '1-10', badge: '🌱 새싹', desc: '활동 시작' },
                { level: '11-25', badge: '🌿 성장', desc: '10개 글 작성' },
                { level: '26-50', badge: '🌳 나무', desc: '전문가 답변' },
                { level: '51+', badge: '🏆 마스터', desc: '100개 좋아요' },
              ].map((tier) => (
                <div key={tier.level} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-600 last:border-0">
                  <div>
                    <span className="font-medium">{tier.badge}</span>
                    <span className="text-gray-500 ml-2">Lv.{tier.level}</span>
                  </div>
                  <span className="text-xs text-gray-500">{tier.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* 글쓰기 */}
      {activeTab === 'create' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-medium text-gray-800 dark:text-white mb-4">새 글 작성</h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">카테고리 *</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                >
                  <option value="">선택</option>
                  {categories.slice(1).map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">제목 *</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                  placeholder="제목을 입력하세요"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">내용 *</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 min-h-[150px]"
                  placeholder="내용을 입력하세요"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">태그</label>
                <input
                  type="text"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                  placeholder="쉼표로 구분 (예: 디자인, 튜토리얼)"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab('feed')}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  취소
                </button>
                <button className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  게시하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunityForum;

