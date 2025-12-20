'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, ArrowRight, Video, Image, FileText, 
  Globe, Zap, PlayCircle, Camera, Mic, Film, 
  Type, Palette, Rocket, Brain, Search, Code,
  Wand2, Layers, Zap as Lightning, MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { GlobalHeader } from '@/components/layout/GlobalHeader';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <GlobalHeader />

      {/* 히어로 섹션 - AI 사이트 스타일 */}
      <section className="pt-16 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
              <Sparkles size={14} />
              무료 AI 도구 모음
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            AI로 모든 것을<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
              더 쉽게
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            텍스트, 이미지, 영상, 음성까지. AI의 모든 기능을 한 곳에서 무료로 사용하세요
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link 
              href="/auth/signup" 
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <span>무료로 시작하기</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/genspark" 
              className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-lg hover:border-purple-500 hover:text-purple-600 transition-all"
            >
              AI 검색 체험
            </Link>
          </motion.div>

          {/* 빠른 액세스 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { icon: Video, label: '영상 생성', href: '/creator', color: 'from-purple-500 to-pink-500' },
              { icon: Image, label: '이미지 생성', href: '/editor', color: 'from-pink-500 to-red-500' },
              { icon: FileText, label: '텍스트 생성', href: '/editor', color: 'from-blue-500 to-cyan-500' },
              { icon: Search, label: 'AI 검색', href: '/genspark', color: 'from-green-500 to-emerald-500' },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <item.icon className="text-white" size={24} />
                </div>
                <div className="text-sm font-semibold text-gray-900">{item.label}</div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 주요 기능 섹션 - AI 사이트 스타일 */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              모든 AI 기능을 한 곳에서
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              회원가입 없이 바로 사용할 수 있는 무료 AI 도구들
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Video,
                title: '영상 생성',
                description: '텍스트나 이미지로 영상을 자동 생성합니다',
                href: '/creator',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: Image,
                title: '이미지 생성',
                description: 'AI로 원하는 이미지를 생성합니다',
                href: '/editor',
                color: 'from-pink-500 to-red-500',
              },
              {
                icon: FileText,
                title: '텍스트 생성',
                description: '블로그, 글쓰기, 번역 등 텍스트 작업을 도와줍니다',
                href: '/editor',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Search,
                title: 'AI 검색',
                description: 'GENSPARK AI로 더 똑똑한 검색을 경험하세요',
                href: '/genspark',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: Mic,
                title: '음성 생성',
                description: '자연스러운 AI 음성으로 나레이션을 만듭니다',
                href: '/creator',
                color: 'from-indigo-500 to-purple-500',
              },
              {
                icon: Code,
                title: '코드 생성',
                description: 'AI가 코드를 작성하고 최적화해줍니다',
                href: '/editor',
                color: 'from-orange-500 to-yellow-500',
              },
            ].map((feature, i) => (
              <Link
                key={i}
                href={feature.href}
                className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                <div className="mt-4 flex items-center text-purple-600 text-sm font-medium group-hover:gap-2 transition-all">
                  <span>사용하기</span>
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 작동 방식 - 간단하게 */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              간단한 3단계
            </h2>
            <p className="text-lg text-gray-600">
              회원가입 없이 바로 시작하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: '도구 선택', desc: '원하는 AI 도구를 선택하세요', icon: Layers },
              { step: 2, title: '작업 시작', desc: '간단한 입력으로 AI가 작업을 시작합니다', icon: Zap },
              { step: 3, title: '결과 확인', desc: '생성된 결과를 바로 확인하고 사용하세요', icon: Rocket },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-lg text-white/90 mb-8">
              회원가입 없이 무료로 모든 AI 기능을 사용할 수 있습니다
            </p>
            <Link 
              href="/auth/signup" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
            >
              <Sparkles size={20} />
              <span>무료로 시작하기</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-12 px-4 sm:px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <span className="font-bold text-xl">Freeshell</span>
            </div>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <Link href="/admin" className="hover:text-white transition-colors">관리자</Link>
              <a href="#" className="hover:text-white transition-colors">이용약관</a>
              <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            © 2024 Freeshell. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
