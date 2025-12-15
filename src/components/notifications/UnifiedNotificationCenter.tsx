'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Settings, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function UnifiedNotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      priority: 'medium',
      title: '작업 완료',
      message: '웹사이트가 성공적으로 생성되었습니다',
      timestamp: Date.now() - 1000 * 60 * 5,
      read: false,
    },
    {
      id: '2',
      type: 'warning',
      priority: 'high',
      title: '성능 경고',
      message: '번들 크기가 2MB를 초과했습니다',
      timestamp: Date.now() - 1000 * 60 * 30,
      read: false,
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter(
    (n) => filter === 'all' || n.type === filter
  );

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const typeColors = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-96 bg-white border rounded-xl shadow-xl z-50 max-h-[600px] flex flex-col"
          >
            {/* 헤더 */}
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">알림</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllAsRead}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="모두 읽음으로 표시"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* 필터 */}
            <div className="p-2 border-b flex gap-2">
              {(['all', 'info', 'success', 'warning', 'error'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                    filter === type
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? '전체' : type}
                </button>
              ))}
            </div>

            {/* 알림 목록 */}
            <div className="flex-1 overflow-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  알림이 없습니다
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        notification.read ? 'opacity-60' : ''
                      } ${typeColors[notification.type]}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{notification.title}</span>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{notification.message}</p>
                          <span className="text-xs text-gray-400 mt-1">
                            {new Date(notification.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="p-1 hover:bg-black/10 rounded"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="p-2 border-t">
              <button className="w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-lg flex items-center justify-center gap-2">
                <Settings size={14} />
                알림 설정
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

