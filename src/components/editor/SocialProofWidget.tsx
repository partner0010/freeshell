'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Users,
  ShoppingCart,
  Star,
  Eye,
  MapPin,
  Clock,
  Check,
  Plus,
  Trash2,
  Play,
  Pause,
  Settings,
} from 'lucide-react';

type NotificationType = 'purchase' | 'signup' | 'review' | 'visitor' | 'custom';

interface SocialProof {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  location?: string;
  time: string;
  avatar?: string;
}

const notificationTypes = [
  { type: 'purchase' as const, icon: ShoppingCart, label: '구매', color: 'bg-green-500' },
  { type: 'signup' as const, icon: Users, label: '가입', color: 'bg-blue-500' },
  { type: 'review' as const, icon: Star, label: '리뷰', color: 'bg-yellow-500' },
  { type: 'visitor' as const, icon: Eye, label: '방문자', color: 'bg-purple-500' },
  { type: 'custom' as const, icon: Bell, label: '커스텀', color: 'bg-gray-500' },
];

const sampleNotifications: SocialProof[] = [
  { id: '1', type: 'purchase', title: '김**님', message: '프리미엄 플랜을 구매했습니다', location: '서울', time: '2분 전' },
  { id: '2', type: 'signup', title: '이**님', message: '새로 가입했습니다', location: '부산', time: '5분 전' },
  { id: '3', type: 'review', title: '박**님', message: '⭐⭐⭐⭐⭐ 최고의 서비스!', location: '인천', time: '10분 전' },
  { id: '4', type: 'visitor', title: '현재', message: '127명이 이 페이지를 보고 있습니다', time: '실시간' },
];

export default function SocialProofWidget() {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState<'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'>('bottom-left');
  const [displayDuration, setDisplayDuration] = useState(5);
  const [delayBetween, setDelayBetween] = useState(3);

  // 자동 순환
  useEffect(() => {
    if (!isPlaying || notifications.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, (displayDuration + delayBetween) * 1000);

    return () => clearInterval(interval);
  }, [isPlaying, notifications.length, displayDuration, delayBetween]);

  const currentNotification = notifications[currentIndex];
  const typeConfig = notificationTypes.find(t => t.type === currentNotification?.type);

  const addNotification = () => {
    const newNotification: SocialProof = {
      id: Date.now().toString(),
      type: 'custom',
      title: '새 알림',
      message: '메시지를 입력하세요',
      time: '방금 전',
    };
    setNotifications([...notifications, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const updateNotification = (id: string, updates: Partial<SocialProof>) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const positionStyles = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Bell size={18} />
          소셜 프루프
        </h3>
        <p className="text-sm text-gray-500 mt-1">실시간 활동 알림으로 신뢰도를 높이세요</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 미리보기 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">미리보기</p>
          <div className="relative h-40 bg-gray-100 rounded-xl overflow-hidden">
            <AnimatePresence mode="wait">
              {currentNotification && (
                <motion.div
                  key={currentNotification.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className={`absolute ${positionStyles[position]} max-w-[250px]`}
                >
                  <div className="bg-white rounded-xl shadow-lg p-3 flex items-start gap-3">
                    <div className={`w-10 h-10 ${typeConfig?.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {typeConfig && <typeConfig.icon size={18} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm">{currentNotification.title}</p>
                      <p className="text-xs text-gray-600 truncate">{currentNotification.message}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                        {currentNotification.location && (
                          <span className="flex items-center gap-0.5">
                            <MapPin size={10} />
                            {currentNotification.location}
                          </span>
                        )}
                        <span className="flex items-center gap-0.5">
                          <Clock size={10} />
                          {currentNotification.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 컨트롤 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isPlaying ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? '일시정지' : '재생'}
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {currentIndex + 1} / {notifications.length}
          </div>
        </div>

        {/* 위치 선택 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">위치</p>
          <div className="grid grid-cols-2 gap-2">
            {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => setPosition(pos)}
                className={`p-3 rounded-xl border-2 text-sm ${
                  position === pos
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {pos === 'top-left' && '↖ 상단 좌측'}
                {pos === 'top-right' && '↗ 상단 우측'}
                {pos === 'bottom-left' && '↙ 하단 좌측'}
                {pos === 'bottom-right' && '↘ 하단 우측'}
              </button>
            ))}
          </div>
        </div>

        {/* 타이밍 */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-gray-500">타이밍</p>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-700">표시 시간</label>
              <span className="text-sm font-medium text-gray-800">{displayDuration}초</span>
            </div>
            <input
              type="range"
              min={3}
              max={10}
              value={displayDuration}
              onChange={(e) => setDisplayDuration(parseInt(e.target.value))}
              className="w-full accent-primary-500"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-700">간격</label>
              <span className="text-sm font-medium text-gray-800">{delayBetween}초</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={delayBetween}
              onChange={(e) => setDelayBetween(parseInt(e.target.value))}
              className="w-full accent-primary-500"
            />
          </div>
        </div>

        {/* 알림 목록 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-500">알림 목록</p>
            <button onClick={addNotification} className="p-1 text-primary-500 hover:bg-primary-50 rounded">
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {notifications.map((notification, index) => {
              const config = notificationTypes.find(t => t.type === notification.type);
              return (
                <div
                  key={notification.id}
                  className={`p-3 rounded-xl border ${
                    currentIndex === index ? 'border-primary-300 bg-primary-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <select
                      value={notification.type}
                      onChange={(e) => updateNotification(notification.id, { type: e.target.value as NotificationType })}
                      className="w-24 px-2 py-1 border rounded text-xs"
                    >
                      {notificationTypes.map((type) => (
                        <option key={type.type} value={type.type}>{type.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={notification.title}
                      onChange={(e) => updateNotification(notification.id, { title: e.target.value })}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                      placeholder="제목"
                    />
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={notification.message}
                    onChange={(e) => updateNotification(notification.id, { message: e.target.value })}
                    className="w-full mt-2 px-2 py-1 border rounded text-sm"
                    placeholder="메시지"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 적용 버튼 */}
      <div className="p-4 border-t">
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600">
          <Check size={18} />
          소셜 프루프 적용
        </button>
      </div>
    </div>
  );
}

