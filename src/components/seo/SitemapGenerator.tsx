/**
 * 사이트맵 자동 생성 컴포넌트
 * SEO 최적화를 위한 동적 사이트맵 생성
 */

'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, RefreshCw } from 'lucide-react';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export function SitemapGenerator() {
  const [sitemap, setSitemap] = useState<string>('');
  const [urls] = useState<SitemapUrl[]>([
    { loc: '/', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 1.0 },
    { loc: '/editor', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.9 },
    { loc: '/creator', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.9 },
    { loc: '/genspark', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.9 },
    { loc: '/agents', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.8 },
    { loc: '/trends', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 0.8 },
    { loc: '/debug', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.7 },
    { loc: '/validate', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.7 },
    { loc: '/remote', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.7 },
    { loc: '/community', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 0.8 },
    { loc: '/templates', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.8 },
    { loc: '/analytics', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.7 },
    { loc: '/mypage', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.6 },
  ]);

  const generateSitemap = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://freeshell.ai';
    
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    setSitemap(sitemapXml);
  };

  useEffect(() => {
    generateSitemap();
  }, []);

  const downloadSitemap = () => {
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="text-purple-600" size={24} />
          <div>
            <h3 className="font-bold text-gray-900">사이트맵 생성기</h3>
            <p className="text-sm text-gray-600">SEO 최적화를 위한 사이트맵 자동 생성</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generateSitemap}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
          >
            <RefreshCw size={18} />
            새로고침
          </button>
          <button
            onClick={downloadSitemap}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Download size={18} />
            다운로드
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
        <pre className="whitespace-pre-wrap">{sitemap}</pre>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>총 {urls.length}개의 URL이 포함되어 있습니다.</p>
        <p className="mt-1">사이트맵을 다운로드하여 서버의 public 폴더에 저장하세요.</p>
      </div>
    </div>
  );
}

