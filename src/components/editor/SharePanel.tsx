'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Link, Copy, Check, ExternalLink, QrCode, Mail, MessageCircle, Twitter, Facebook, Linkedin } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

export function SharePanel() {
  const { project } = useEditorStore();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // 데모용 URL (실제로는 서버에서 생성)
  const previewUrl = `https://grip.app/preview/${project?.id || 'demo'}`;
  const shareUrl = `https://grip.app/s/${project?.id || 'demo'}`;

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-[#1DA1F2] hover:bg-[#1a8cd8]',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('내가 만든 웹사이트를 확인해보세요!')}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] hover:bg-[#166fe5]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2] hover:bg-[#095196]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      url: `mailto:?subject=${encodeURIComponent('내가 만든 웹사이트')}&body=${encodeURIComponent(`확인해보세요: ${shareUrl}`)}`,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
          <Share2 className="text-white" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">공유하기</h3>
          <p className="text-xs text-gray-500">웹사이트를 공유하세요</p>
        </div>
      </div>

      {/* 미리보기 링크 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          미리보기 링크
        </label>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 overflow-hidden">
            <Link size={16} className="shrink-0 text-gray-400" />
            <span className="truncate">{previewUrl}</span>
          </div>
          <button
            onClick={() => handleCopy(previewUrl)}
            className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* 공유 링크 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          공유 링크 (짧은 URL)
        </label>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 overflow-hidden">
            <Link size={16} className="shrink-0 text-gray-400" />
            <span className="truncate">{shareUrl}</span>
          </div>
          <button
            onClick={() => handleCopy(shareUrl)}
            className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* QR 코드 */}
      <div className="mb-6">
        <button
          onClick={() => setShowQR(!showQR)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <span className="flex items-center gap-2 text-gray-700">
            <QrCode size={18} />
            QR 코드
          </span>
          <span className="text-sm text-primary-500">
            {showQR ? '숨기기' : '보기'}
          </span>
        </button>
        
        {showQR && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 flex justify-center"
          >
            <div className="p-4 bg-white rounded-xl shadow-soft">
              {/* QR 코드 플레이스홀더 */}
              <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <QrCode size={64} className="text-gray-400" />
              </div>
              <p className="text-center text-xs text-gray-500 mt-2">
                스캔하여 미리보기
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* 소셜 공유 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          소셜 미디어에 공유
        </label>
        <div className="grid grid-cols-4 gap-2">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                flex flex-col items-center gap-1 p-3 rounded-xl text-white transition-colors
                ${social.color}
              `}
            >
              <social.icon size={20} />
              <span className="text-xs">{social.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* 임베드 코드 */}
      <div className="mt-6 pt-6 border-t">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          임베드 코드
        </label>
        <div className="relative">
          <textarea
            readOnly
            value={`<iframe src="${previewUrl}" width="100%" height="600" frameborder="0"></iframe>`}
            className="w-full p-3 bg-gray-900 text-gray-300 text-xs font-mono rounded-lg resize-none h-20"
          />
          <button
            onClick={() => handleCopy(`<iframe src="${previewUrl}" width="100%" height="600" frameborder="0"></iframe>`)}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white rounded"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

