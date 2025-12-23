/**
 * 전역 알림 센터 컴포넌트
 * 실시간 알림 표시 및 관리
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationCenterProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationCenter({ 
  notifications, 
  onDismiss, 
  onRead, 
  onClearAll 
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-600" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-600" size={20} />;
      default:
        return <Info className="text-blue-600" size={20} />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        aria-label="알림"
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
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">알림</h3>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    모두 지우기
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[500px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="mx-auto mb-2 text-gray-400" size={32} />
                  <p>알림이 없습니다</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 border-l-4 ${getBgColor(notification.type)} ${
                        !notification.read ? 'bg-opacity-100' : 'bg-opacity-50'
                      } hover:bg-opacity-100 transition-all cursor-pointer`}
                      onClick={() => {
                        if (!notification.read) {
                          onRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500">
                                {notification.timestamp.toLocaleTimeString('ko-KR')}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDismiss(notification.id);
                              }}
                              className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          {notification.action && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.action?.onClick();
                              }}
                              className="mt-2 px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700"
                            >
                              {notification.action.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

