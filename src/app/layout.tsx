import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from './providers'
import { StructuredData } from '@/components/seo/StructuredData'

export const metadata: Metadata = {
  title: 'Freeshell - AI 통합 콘텐츠 생성 솔루션',
  description: 'AI로 만드는 수익형 콘텐츠. 숏폼, 영상, 이미지, 전자책, 글쓰기까지 완전 자동화',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Freeshell',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Freeshell',
    title: 'Freeshell - AI 통합 콘텐츠 생성 솔루션',
    description: 'AI로 만드는 수익형 콘텐츠. 숏폼, 영상, 이미지, 전자책, 글쓰기까지 완전 자동화',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freeshell - AI 통합 콘텐츠 생성 솔루션',
    description: 'AI로 만드는 수익형 콘텐츠. 숏폼, 영상, 이미지, 전자책, 글쓰기까지 완전 자동화',
  },
}

export const viewport: Viewport = {
  themeColor: '#8B5CF6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="robots" href="/robots.txt" />
        {/* 구조화된 데이터 */}
        <StructuredData type="Organization" data={{}} />
        <StructuredData type="WebSite" data={{}} />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      // ServiceWorker 등록 성공
                      if (process.env.NODE_ENV === 'development') {
                        console.log('ServiceWorker 등록 성공:', registration.scope);
                      }
                    },
                    function(err) {
                      // ServiceWorker 등록 실패 (에러 로깅만)
                      if (process.env.NODE_ENV === 'development') {
                        console.error('ServiceWorker 등록 실패:', err);
                      }
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}

