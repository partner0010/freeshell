/**
 * PWA Service Worker
 * Progressive Web App 지원
 */

const CACHE_NAME = 'grip-pwa-v1';
const RUNTIME_CACHE = 'grip-runtime-v1';

// 캐싱할 정적 자원
const STATIC_ASSETS = [
  '/',
  '/editor',
  '/manifest.json',
  '/offline.html',
];

// 설치 이벤트 - 정적 자원 캐싱
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  (self as any).skipWaiting();
});

// 활성화 이벤트 - 오래된 캐시 삭제
self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  (self as any).clients.claim();
});

// Fetch 이벤트 - 네트워크 우선, 캐시 폴백 전략
self.addEventListener('fetch', (event: any) => {
  const { request } = event;
  const url = new URL(request.url);

  // API 요청은 네트워크 우선
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: '오프라인 상태입니다' }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 503,
          }
        );
      })
    );
    return;
  }

  // 정적 자원은 캐시 우선
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          // 응답 복사
          const responseToCache = response.clone();

          // 성공적인 응답만 캐시
          if (response.status === 200) {
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }

          return response;
        })
        .catch(() => {
          // 오프라인 페이지로 폴백
          if (request.destination === 'document') {
            return caches.match('/offline.html');
          }
        });
    })
  );
});

// 푸시 알림 이벤트
self.addEventListener('push', (event: any) => {
  const data = event.data?.json() || {};
  const title = data.title || '알림';
  const options = {
    body: data.body || '',
    icon: data.icon || '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
    data: data.data || {},
  };

  event.waitUntil(
    (self as any).registration.showNotification(title, options)
  );
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event: any) => {
  event.notification.close();

  event.waitUntil(
    (self as any).clients.openWindow(event.notification.data.url || '/')
  );
});

