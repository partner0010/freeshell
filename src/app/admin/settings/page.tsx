'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
  Key,
  Palette,
  Save,
  RefreshCw,
  Check,
  AlertTriangle,
  Server,
  Zap,
} from 'lucide-react';

const settingsSections = [
  { id: 'general', label: '일반', icon: Settings },
  { id: 'appearance', label: '외관', icon: Palette },
  { id: 'notifications', label: '알림', icon: Bell },
  { id: 'security', label: '보안', icon: Shield },
  { id: 'email', label: '이메일', icon: Mail },
  { id: 'api', label: 'API', icon: Key },
  { id: 'database', label: '데이터베이스', icon: Database },
  { id: 'system', label: '시스템', icon: Server },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">설정</h1>
          <p className="text-gray-500 mt-1">플랫폼 설정을 관리하세요</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          {saved ? <Check size={18} /> : <Save size={18} />}
          {saved ? '저장됨!' : '변경사항 저장'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 사이드 네비게이션 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm h-fit">
          <nav className="space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors
                  ${activeSection === section.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <section.icon size={18} />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 설정 콘텐츠 */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm space-y-6"
            >
              <h2 className="text-lg font-semibold text-gray-800">일반 설정</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">사이트 이름</label>
                  <input type="text" defaultValue="GRIP" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">사이트 설명</label>
                  <textarea defaultValue="AI 기반 웹사이트 빌더" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 h-24 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">기본 언어</label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                    <option value="ko">한국어</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">타임존</label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                    <option value="Asia/Seoul">Asia/Seoul (KST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm space-y-6"
            >
              <h2 className="text-lg font-semibold text-gray-800">알림 설정</h2>
              
              <div className="space-y-4">
                {[
                  { label: '새 사용자 가입 알림', desc: '새로운 사용자가 가입하면 알림을 받습니다' },
                  { label: '결제 알림', desc: '결제 관련 이벤트 발생 시 알림을 받습니다' },
                  { label: '시스템 오류 알림', desc: '시스템 오류 발생 시 즉시 알림을 받습니다' },
                  { label: '주간 보고서', desc: '매주 월요일 주간 보고서를 받습니다' },
                  { label: '마케팅 인사이트', desc: '마케팅 관련 인사이트와 팁을 받습니다' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium text-gray-800">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm space-y-6"
            >
              <h2 className="text-lg font-semibold text-gray-800">보안 설정</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <Shield size={18} />
                    <span className="font-medium">보안 상태: 양호</span>
                  </div>
                  <p className="text-sm text-green-600">모든 보안 설정이 권장 사항을 충족합니다.</p>
                </div>

                {[
                  { label: '2단계 인증 필수', desc: '관리자 로그인 시 2단계 인증을 요구합니다', enabled: true },
                  { label: '비밀번호 정책', desc: '강력한 비밀번호 정책을 적용합니다', enabled: true },
                  { label: '세션 타임아웃', desc: '30분 비활성 시 자동 로그아웃', enabled: true },
                  { label: 'IP 화이트리스트', desc: '특정 IP에서만 관리자 접근 허용', enabled: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium text-gray-800">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'system' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* 시스템 상태 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">시스템 상태</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <Server size={18} />
                      <span className="font-medium">서버</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">정상</p>
                    <p className="text-sm text-green-600">가동률 99.9%</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                      <Database size={18} />
                      <span className="font-medium">데이터베이스</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">정상</p>
                    <p className="text-sm text-blue-600">응답시간 12ms</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-2 text-purple-700 mb-2">
                      <Zap size={18} />
                      <span className="font-medium">CDN</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">정상</p>
                    <p className="text-sm text-purple-600">캐시 적중률 94%</p>
                  </div>
                </div>
              </div>

              {/* 유지보수 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">유지보수</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">캐시 삭제</p>
                      <p className="text-sm text-gray-500">시스템 캐시를 삭제합니다</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                      <RefreshCw size={16} />
                      삭제
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">데이터베이스 백업</p>
                      <p className="text-sm text-gray-500">마지막 백업: 2시간 전</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                      <Database size={16} />
                      백업
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 다른 섹션들... */}
          {!['general', 'notifications', 'security', 'system'].includes(activeSection) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {settingsSections.find(s => s.id === activeSection)?.label} 설정
              </h2>
              <p className="text-gray-500">이 섹션의 설정을 구성하세요.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

