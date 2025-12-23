/**
 * 오프라인 모드 표시기
 * PWA 오프라인 지원 강화
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, CheckCircle } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineData, setOfflineData] = useState<any[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 오프라인 데이터 로드
    if ('serviceWorker' in navigator && 'caches' in window) {
      caches.open('freeshell-cache').then((cache) => {
        cache.keys().then((keys) => {
          setOfflineData(Array.from(keys));
        });
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-yellow-500 text-white rounded-xl shadow-2xl p-4 max-w-sm">
      <div className="flex items-center gap-3">
        <WifiOff size={24} />
        <div className="flex-1">
          <h4 className="font-bold mb-1">오프라인 모드</h4>
          <p className="text-sm opacity-90">
            인터넷 연결이 없습니다. 오프라인에서 사용 가능한 기능만 이용할 수 있습니다.
          </p>
          {offlineData.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              <CheckCircle size={14} />
              <span>캐시된 데이터 {offlineData.length}개 사용 가능</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

