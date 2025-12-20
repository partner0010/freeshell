'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

export function AdSense({ adSlot, adFormat = 'auto', style, className }: AdSenseProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  if (!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID) {
    // 개발 환경에서는 광고 대신 플레이스홀더 표시
    return (
      <div
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}
        style={{ minHeight: '250px', ...style }}
      >
        <div className="text-center text-gray-400">
          <p className="text-sm">광고 영역</p>
          <p className="text-xs mt-1">Google AdSense ID 설정 필요</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      <ins
        className={`adsbygoogle ${className}`}
        style={{ display: 'block', ...style }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </>
  );
}

// 검색 결과 페이지용 광고
export function SearchAdSense() {
  return (
    <div className="my-8">
      <AdSense
        adSlot="1234567890" // 실제 광고 슬롯 ID로 변경 필요
        adFormat="auto"
        className="w-full"
        style={{ minHeight: '100px' }}
      />
    </div>
  );
}

// 사이드바 광고
export function SidebarAdSense() {
  return (
    <div className="sticky top-4">
      <AdSense
        adSlot="1234567890" // 실제 광고 슬롯 ID로 변경 필요
        adFormat="vertical"
        className="w-full"
        style={{ minHeight: '250px' }}
      />
    </div>
  );
}

// 콘텐츠 사이 광고
export function InContentAdSense() {
  return (
    <div className="my-12">
      <AdSense
        adSlot="1234567890" // 실제 광고 슬롯 ID로 변경 필요
        adFormat="horizontal"
        className="w-full"
        style={{ minHeight: '90px' }}
      />
    </div>
  );
}

