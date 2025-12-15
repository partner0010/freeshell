import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GRIP - AI 웹사이트 빌더',
  description: 'AI와 함께 블록을 쌓듯이 나만의 웹사이트를 만들어보세요',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GRIP',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'GRIP',
    title: 'GRIP - AI 웹사이트 빌더',
    description: 'AI와 함께 블록을 쌓듯이 나만의 웹사이트를 만들어보세요',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GRIP - AI 웹사이트 빌더',
    description: 'AI와 함께 블록을 쌓듯이 나만의 웹사이트를 만들어보세요',
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
      </head>
      <body className="antialiased">
        {children}
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

