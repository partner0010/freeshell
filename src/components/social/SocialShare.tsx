/**
 * 소셜 공유 컴포넌트
 * 다양한 소셜 미디어로 콘텐츠 공유
 */

'use client';

import React from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function SocialShare({ 
  url = typeof window !== 'undefined' ? window.location.href : '', 
  title = 'Freeshell - AI로 모든 것을 더 쉽게',
  description = '무료 AI 도구로 더 쉽게 작업하세요',
  className = ''
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareData = {
    title,
    text: description,
    url,
  };

  const handleShare = async (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('링크 복사 실패:', error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('공유 실패:', error);
        }
      }
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
        <button
          onClick={handleNativeShare}
          className="p-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
          title="공유"
        >
          <Share2 size={18} />
        </button>
      )}
      <button
        onClick={() => handleShare('facebook')}
        className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
        title="Facebook 공유"
      >
        <Facebook size={18} />
      </button>
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors"
        title="Twitter 공유"
      >
        <Twitter size={18} />
      </button>
      <button
        onClick={() => handleShare('linkedin')}
        className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
        title="LinkedIn 공유"
      >
        <Linkedin size={18} />
      </button>
      <button
        onClick={handleCopyLink}
        className={`p-2 rounded-lg transition-colors ${
          copied 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        title="링크 복사"
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
      </button>
    </div>
  );
}

