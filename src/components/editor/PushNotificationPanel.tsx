'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  BellRing,
  Send,
  Users,
  Clock,
  Settings,
  Plus,
  Trash2,
  Edit2,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Globe,
  Target,
} from 'lucide-react';

interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  url?: string;
  status: 'draft' | 'scheduled' | 'sent';
  sentAt?: string;
  scheduledFor?: string;
  stats?: {
    sent: number;
    delivered: number;
    clicked: number;
  };
}

interface Subscriber {
  id: string;
  endpoint: string;
  createdAt: string;
  lastActive: string;
  device: 'desktop' | 'mobile';
  browser: string;
}

export function PushNotificationPanel() {
  const [activeTab, setActiveTab] = useState<'send' | 'history' | 'subscribers' | 'settings'>('send');
  const [pushSupported, setPushSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [notification, setNotification] = useState({
    title: '',
    body: '',
    icon: '',
    url: '',
    scheduledFor: '',
  });
  
  const [notifications] = useState<PushNotification[]>([
    {
      id: '1',
      title: '새로운 기능 출시!',
      body: 'AI 이미지 생성 기능이 추가되었습니다.',
      status: 'sent',
      sentAt: '2024-12-04 14:30',
      stats: { sent: 1250, delivered: 1180, clicked: 245 },
    },
    {
      id: '2',
      title: '주간 업데이트',
      body: '이번 주 새로운 템플릿을 확인하세요.',
      status: 'scheduled',
      scheduledFor: '2024-12-06 10:00',
    },
  ]);
  
  const [subscribers] = useState<Subscriber[]>([
    { id: '1', endpoint: 'https://fcm.googleapis.com/***', createdAt: '2024-11-20', lastActive: '2024-12-05', device: 'desktop', browser: 'Chrome' },
    { id: '2', endpoint: 'https://updates.push.services.mozilla.com/***', createdAt: '2024-11-25', lastActive: '2024-12-04', device: 'mobile', browser: 'Firefox' },
  ]);

  useEffect(() => {
    // Push API 지원 여부 확인
    if ('PushManager' in window && 'serviceWorker' in navigator) {
      setPushSupported(true);
      
      // 권한 상태 확인
      if (Notification.permission === 'granted') {
        setPushEnabled(true);
      }
    }
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushEnabled(true);
        
        // 테스트 알림 표시
        new Notification('GRIP 알림 활성화됨!', {
          body: '이제 중요한 업데이트를 받을 수 있습니다.',
          icon: '/icon-192x192.png',
        });
      }
    } catch (error) {
      console.error('푸시 알림 권한 요청 실패:', error);
    }
  };

  const sendNotification = async () => {
    if (!notification.title || !notification.body) return;
    
    // 실제로는 서버로 전송하여 FCM/웹 푸시로 발송
    console.log('푸시 알림 발송:', notification);
    
    // 로컬 테스트용
    if (pushEnabled && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon || '/icon-192x192.png',
      });
    }
    
    // 폼 초기화
    setNotification({ title: '', body: '', icon: '', url: '', scheduledFor: '' });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <BellRing className="w-5 h-5 text-primary-500" />
          푸시 알림
        </h3>
        
        {pushSupported && (
          <span className={`px-2 py-0.5 rounded-full text-xs ${pushEnabled ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
            {pushEnabled ? '활성화됨' : '비활성화'}
          </span>
        )}
      </div>
      
      {/* 푸시 지원 안내 */}
      {!pushSupported && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
            <div className="text-sm text-yellow-700 dark:text-yellow-400">
              이 브라우저는 푸시 알림을 지원하지 않습니다.
            </div>
          </div>
        </div>
      )}
      
      {/* 권한 요청 */}
      {pushSupported && !pushEnabled && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={requestPermission}
          className="w-full p-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg flex items-center justify-center gap-2"
        >
          <Bell className="w-4 h-4" />
          푸시 알림 활성화
        </motion.button>
      )}
      
      {/* 탭 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {[
          { id: 'send', label: '발송', icon: Send },
          { id: 'history', label: '내역', icon: Clock },
          { id: 'subscribers', label: '구독자', icon: Users },
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
      
      {/* 발송 */}
      {activeTab === 'send' && (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">제목 *</label>
            <input
              type="text"
              value={notification.title}
              onChange={(e) => setNotification({ ...notification, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="알림 제목"
              maxLength={50}
            />
            <p className="text-xs text-gray-400 mt-1">{notification.title.length}/50</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">내용 *</label>
            <textarea
              value={notification.body}
              onChange={(e) => setNotification({ ...notification, body: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="알림 내용"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-gray-400 mt-1">{notification.body.length}/200</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">클릭 시 이동 URL</label>
            <input
              type="url"
              value={notification.url}
              onChange={(e) => setNotification({ ...notification, url: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="https://example.com/page"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">예약 발송</label>
            <input
              type="datetime-local"
              value={notification.scheduledFor}
              onChange={(e) => setNotification({ ...notification, scheduledFor: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          {/* 미리보기 */}
          {notification.title && (
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 mb-2">미리보기</p>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-white text-sm truncate">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">{notification.body}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={sendNotification}
              disabled={!notification.title || !notification.body}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {notification.scheduledFor ? '예약 발송' : '즉시 발송'}
            </button>
          </div>
        </div>
      )}
      
      {/* 내역 */}
      {activeTab === 'history' && (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 dark:text-white text-sm truncate">
                      {notif.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      notif.status === 'sent' ? 'bg-green-100 text-green-600' :
                      notif.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {notif.status === 'sent' ? '발송됨' : notif.status === 'scheduled' ? '예약됨' : '임시저장'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{notif.body}</p>
                </div>
              </div>
              
              {notif.stats && (
                <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{notif.stats.sent}</p>
                    <p className="text-xs text-gray-500">발송</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{notif.stats.delivered}</p>
                    <p className="text-xs text-gray-500">도달</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{notif.stats.clicked}</p>
                    <p className="text-xs text-gray-500">클릭</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-primary-500">
                      {((notif.stats.clicked / notif.stats.delivered) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">CTR</p>
                  </div>
                </div>
              )}
              
              {notif.scheduledFor && (
                <p className="text-xs text-gray-500 mt-2">
                  예정: {notif.scheduledFor}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
      
      {/* 구독자 */}
      {activeTab === 'subscribers' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
              <Users className="w-5 h-5 text-primary-500 mx-auto" />
              <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">{subscribers.length}</p>
              <p className="text-xs text-gray-500">총 구독자</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
              <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
              <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">
                {subscribers.filter((s) => s.lastActive === '2024-12-05').length}
              </p>
              <p className="text-xs text-gray-500">오늘 활성</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {subscribers.map((sub) => (
              <div
                key={sub.id}
                className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {sub.device === 'desktop' ? (
                      <Globe className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Smartphone className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">{sub.browser}</span>
                  </div>
                  <span className="text-xs text-gray-500">{sub.lastActive}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 설정 */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">VAPID 키 설정</h4>
            <p className="text-xs text-gray-500 mb-2">
              웹 푸시를 위한 VAPID 키를 설정하세요.
            </p>
            <input
              type="text"
              placeholder="Public Key"
              className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-gray-600 dark:border-gray-500 mb-2"
            />
            <input
              type="text"
              placeholder="Private Key (서버용)"
              className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-gray-600 dark:border-gray-500"
            />
          </div>
          
          <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">알림 설정</h4>
            
            <label className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">배지 표시</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary-500" />
            </label>
            
            <label className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">소리 재생</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary-500" />
            </label>
            
            <label className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">진동</span>
              <input type="checkbox" className="w-4 h-4 accent-primary-500" />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default PushNotificationPanel;

