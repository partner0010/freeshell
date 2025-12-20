'use client';

import React from 'react';
import { AdSense } from './AdSense';

interface AdBannerProps {
  position: 'top' | 'bottom' | 'sidebar' | 'inline';
  className?: string;
}

export function AdBanner({ position, className }: AdBannerProps) {
  const adSlots: Record<string, string> = {
    top: '1234567890', // 실제 광고 슬롯 ID로 변경 필요
    bottom: '1234567890',
    sidebar: '1234567890',
    inline: '1234567890',
  };

  const formats: Record<string, 'auto' | 'rectangle' | 'vertical' | 'horizontal'> = {
    top: 'horizontal',
    bottom: 'horizontal',
    sidebar: 'vertical',
    inline: 'auto',
  };

  return (
    <div className={className}>
      <AdSense
        adSlot={adSlots[position]}
        adFormat={formats[position]}
        className="w-full"
        style={{
          minHeight: position === 'sidebar' ? '250px' : position === 'inline' ? '90px' : '100px',
        }}
      />
    </div>
  );
}

