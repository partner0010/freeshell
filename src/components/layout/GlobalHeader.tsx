'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Menu, X, Search, 
  Video, FileText, Zap, Monitor, Bug, Shield, Accessibility, Users, HelpCircle, FileSignature
} from 'lucide-react';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { LanguageSelector } from '@/components/i18n/LanguageSelector';
import type { Notification } from '@/components/notifications/NotificationCenter';

export function GlobalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAccessibility, setShowAccessibility] = useState(false);

  useEffect(() => {
    // 예시 알림 (실제로는 서버에서 받아옴)
    const exampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'info',
        title: '새로운 기능이 추가되었습니다!',
        message: 'AI 채팅에 음성 입력 기능이 추가되었습니다.',
        timestamp: new Date(),
        read: false,
      },
    ];
    setNotifications(exampleNotifications);
  }, []);

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const mainMenu = [
    { href: '/editor', label: '에디터', icon: FileText, category: '생성' },
    { href: '/creator', label: '콘텐츠 생성', icon: Video, category: '생성' },
    { href: '/genspark', label: 'AI 검색', icon: Search, category: '검색' },
    { href: '/agents', label: 'AI 에이전트', icon: Zap, category: '자동화' },
    { href: '/signature', label: '전자서명', icon: FileSignature, category: '비즈니스' },
    { href: '/trends', label: '최신 트렌드', icon: Sparkles, category: '기능' },
    { href: '/community', label: '커뮤니티', icon: Users, category: '소통' },
    { href: '/help', label: '도움말', icon: HelpCircle, category: '지원' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="font-display font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Freeshell
            </span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-1">
            {mainMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all font-medium text-sm"
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* 우측 액션 */}
          <div className="flex items-center gap-3">
            {/* 언어 선택 */}
            <LanguageSelector />

            {/* 접근성 메뉴 */}
            <button
              onClick={() => setShowAccessibility(!showAccessibility)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
              aria-label="접근성 설정"
            >
              <Accessibility size={18} />
            </button>

            {/* 알림 센터 */}
            <NotificationCenter
              notifications={notifications}
              onDismiss={handleDismiss}
              onRead={handleRead}
              onClearAll={handleClearAll}
            />

            {/* 검색 버튼 */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
              aria-label="검색"
            >
              <Search size={18} />
            </button>

            {/* 디버깅 메뉴 */}
            <Link
              href="/debug"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all font-medium text-sm"
            >
              <Bug size={18} />
              <span>디버깅</span>
            </Link>

            {/* 사이트 검증 메뉴 */}
            <Link
              href="/validate"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all font-medium text-sm"
            >
              <Shield size={18} />
              <span>사이트 검증</span>
            </Link>

            {/* 원격 솔루션 메뉴 */}
            <Link
              href="/remote"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium text-sm"
            >
              <Monitor size={18} />
              <span>원격 솔루션</span>
            </Link>

            {/* 시작하기 버튼 */}
            <Link
              href="/auth/signin"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm"
            >
              <Zap size={16} />
              로그인
            </Link>

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
              aria-label="메뉴"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <nav className="px-4 py-4 space-y-1">
              {mainMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all font-medium"
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link
                href="/debug"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all font-medium"
              >
                <Bug size={20} />
                <span>디버깅</span>
              </Link>
              <Link
                href="/validate"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all font-medium"
              >
                <Shield size={20} />
                <span>사이트 검증</span>
              </Link>
              <Link
                href="/remote"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium"
              >
                <Monitor size={20} />
                <span>원격 솔루션</span>
              </Link>
              <Link
                href="/editor"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold mt-2"
              >
                <Zap size={20} />
                <span>시작하기</span>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 검색 모달 */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <Search className="text-gray-400" size={24} />
                <input
                  type="text"
                  placeholder="검색어를 입력하세요..."
                  className="flex-1 text-lg outline-none border-none"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="text-sm text-gray-500">
                GENSPARK AI 검색으로 이동하려면{' '}
                <Link href="/genspark" className="text-purple-600 hover:underline">
                  여기를 클릭하세요
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

