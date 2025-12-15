'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, ArrowRight, Blocks, Wand2, Zap, Globe, Palette, Code,
  Users, GitBranch, Shield, LayoutDashboard, Bot, Smartphone
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="font-display font-bold text-xl text-gray-800">GRIP</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-primary-500 transition-colors">기능</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary-500 transition-colors">사용법</a>
            <a href="#pricing" className="text-gray-600 hover:text-primary-500 transition-colors">가격</a>
            <Link href="/admin" className="text-gray-600 hover:text-primary-500 transition-colors">관리자</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <LayoutDashboard size={16} />
              Admin
            </Link>
            <Link href="/editor" className="btn-primary text-sm py-2">
              무료로 시작하기
            </Link>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pastel-lavender via-pastel-sky to-pastel-mint opacity-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-30 animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-teal rounded-full blur-3xl opacity-20 animate-pulse-slow animation-delay-500" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full text-primary-600 text-sm font-medium mb-8">
              <Wand2 size={16} />
              AI 기반 웹사이트 빌더
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold text-gray-900 mb-6 leading-tight"
          >
            블록을 쌓듯이<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
              웹사이트를 만드세요
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            코딩 없이 드래그 앤 드롭으로 원하는 웹사이트를 만들고,
            AI의 도움으로 콘텐츠와 디자인을 완성하세요.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/editor" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
              무료로 시작하기
              <ArrowRight size={20} />
            </Link>
            <button className="btn-secondary text-lg px-8 py-4">
              데모 보기
            </button>
          </motion.div>
        </div>

        {/* 프리뷰 이미지 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-6xl mx-auto mt-16 relative"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border">
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm text-gray-500">GRIP Editor</span>
              </div>
            </div>
            <div className="h-[500px] bg-gradient-to-br from-surface-light to-pastel-lavender/30 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-pastel-lavender via-pastel-sky to-pastel-mint rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float">
                  <Blocks className="text-primary-500" size={48} />
                </div>
                <p className="text-gray-500 font-medium">드래그 앤 드롭 에디터 미리보기</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 기능 섹션 */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              강력한 기능들
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              누구나 쉽게 전문적인 웹사이트를 만들 수 있도록
              다양한 기능을 제공합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Blocks,
                title: '블록 기반 편집',
                description: '다양한 블록을 드래그 앤 드롭으로 조합하여 원하는 레이아웃을 만드세요.',
                color: 'from-pastel-lavender to-pastel-sky',
              },
              {
                icon: Bot,
                title: 'AI 코파일럿',
                description: 'AI와 대화하며 웹사이트를 만들고, 자동으로 콘텐츠와 디자인을 생성하세요.',
                color: 'from-pastel-rose to-pastel-peach',
              },
              {
                icon: Users,
                title: '실시간 협업',
                description: '팀원들과 실시간으로 협업하며 함께 웹사이트를 만들어보세요.',
                color: 'from-pastel-mint to-pastel-sage',
              },
              {
                icon: GitBranch,
                title: '버전 관리',
                description: '모든 변경사항을 추적하고, 언제든 이전 버전으로 돌아갈 수 있습니다.',
                color: 'from-pastel-cream to-pastel-peach',
              },
              {
                icon: Smartphone,
                title: 'PWA 지원',
                description: '앱처럼 설치하고 오프라인에서도 작업할 수 있습니다.',
                color: 'from-pastel-sky to-pastel-mint',
              },
              {
                icon: Shield,
                title: '관리자 대시보드',
                description: '사용자, 프로젝트, 결제를 한 곳에서 관리하는 강력한 관리 도구.',
                color: 'from-pastel-lilac to-pastel-lavender',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-card hover:shadow-soft transition-shadow"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="text-primary-600" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24 px-6 bg-gradient-to-r from-pastel-lavender via-pastel-sky to-pastel-mint">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-gray-700 mb-10">
            무료로 시작하고, 언제든지 업그레이드하세요.
          </p>
          <Link href="/editor" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
            무료로 만들기
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <span className="font-display font-bold text-xl">GRIP</span>
            </div>
            <div className="flex items-center gap-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">이용약관</a>
              <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-white transition-colors">문의하기</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            © 2024 GRIP. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

