'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Code, FileJson, Copy, Check, FileCode, Globe, Loader2 } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { Block } from '@/types';

type ExportFormat = 'html' | 'json' | 'react';

export function ExportPanel() {
  const { project, getCurrentPage } = useEditorStore();
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('html');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const currentPage = getCurrentPage();

  const generateHTML = (): string => {
    if (!currentPage || !project) return '';

    const blocksHtml = currentPage.blocks.map(block => generateBlockHTML(block)).join('\n\n');

    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentPage.settings.title}</title>
  <meta name="description" content="${currentPage.settings.description}">
  ${currentPage.settings.ogImage ? `<meta property="og:image" content="${currentPage.settings.ogImage}">` : ''}
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
  <style>
    body { font-family: 'Pretendard', sans-serif; }
    .btn-primary {
      background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
      color: white;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 500;
      transition: all 0.3s;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
    }
  </style>
</head>
<body class="bg-gray-50">
${blocksHtml}
</body>
</html>`;
  };

  const generateBlockHTML = (block: Block): string => {
    const content = block.content as Record<string, unknown>;
    
    switch (block.type) {
      case 'hero':
        return `  <!-- Hero Section -->
  <section class="py-24 px-6 bg-gradient-to-br from-purple-100 via-blue-100 to-green-100">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">${content.title}</h1>
      <p class="text-xl text-gray-600 mb-8">${content.subtitle}</p>
      ${content.buttonText ? `<a href="${content.buttonLink || '#'}" class="btn-primary inline-block">${content.buttonText}</a>` : ''}
    </div>
  </section>`;

      case 'header':
        const menuItems = content.menuItems as Array<{ label: string; link: string }>;
        return `  <!-- Header -->
  <header class="py-4 px-6 bg-white shadow-sm">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="text-2xl font-bold text-purple-600">${content.logo}</div>
      <nav class="hidden md:flex items-center gap-8">
        ${menuItems?.map(item => `<a href="${item.link}" class="text-gray-600 hover:text-purple-500">${item.label}</a>`).join('\n        ')}
      </nav>
      <button class="btn-primary text-sm py-2">시작하기</button>
    </div>
  </header>`;

      case 'features':
        const featureItems = content.items as Array<{ icon: string; title: string; description: string }>;
        return `  <!-- Features Section -->
  <section class="py-16 px-6 bg-white">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">${content.title}</h2>
      <div class="grid md:grid-cols-3 gap-8">
        ${featureItems?.map(item => `
        <div class="bg-gray-50 rounded-2xl p-8 text-center">
          <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
            <!-- Icon: ${item.icon} -->
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">${item.title}</h3>
          <p class="text-gray-600">${item.description}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>`;

      case 'cta':
        return `  <!-- CTA Section -->
  <section class="py-16 px-6 bg-gradient-to-r from-pink-100 to-orange-100">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">${content.title}</h2>
      <p class="text-gray-600 mb-8 text-lg">${content.description}</p>
      <a href="${content.buttonLink}" class="btn-primary inline-block">${content.buttonText}</a>
    </div>
  </section>`;

      case 'footer':
        return `  <!-- Footer -->
  <footer class="py-12 px-6 bg-gray-900 text-white">
    <div class="max-w-6xl mx-auto text-center">
      <div class="text-2xl font-bold mb-4">${content.logo}</div>
      <p class="text-gray-400 mb-8">${content.description}</p>
      <p class="text-gray-500">${content.copyright}</p>
    </div>
  </footer>`;

      case 'stats':
        const statItems = content.items as Array<{ value: string; label: string }>;
        return `  <!-- Stats Section -->
  <section class="py-12 px-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        ${statItems?.map(item => `
        <div>
          <div class="text-4xl md:text-5xl font-bold mb-2">${item.value}</div>
          <div class="text-white/80">${item.label}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>`;

      default:
        return `  <!-- ${block.type} Block -->
  <section class="py-8 px-6">
    <div class="max-w-4xl mx-auto">
      <!-- ${block.type} content -->
    </div>
  </section>`;
    }
  };

  const generateJSON = (): string => {
    if (!project) return '';
    return JSON.stringify(project, null, 2);
  };

  const generateReact = (): string => {
    if (!currentPage) return '';

    return `// Generated React Component
import React from 'react';

export default function ${currentPage.name.replace(/\s+/g, '')}Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ${currentPage.blocks.length} blocks */}
      ${currentPage.blocks.map(block => `
      {/* ${block.type} */}`).join('')}
    </div>
  );
}

// Note: This is a basic structure. 
// Copy individual block components from the editor for full functionality.
`;
  };

  const getExportContent = (): string => {
    switch (activeFormat) {
      case 'html':
        return generateHTML();
      case 'json':
        return generateJSON();
      case 'react':
        return generateReact();
      default:
        return '';
    }
  };

  const handleCopy = async () => {
    const content = getExportContent();
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setIsExporting(true);
    const content = getExportContent();
    const extensions = { html: 'html', json: 'json', react: 'tsx' };
    const mimeTypes = { html: 'text/html', json: 'application/json', react: 'text/typescript' };
    
    const blob = new Blob([content], { type: mimeTypes[activeFormat] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPage?.name || 'page'}.${extensions[activeFormat]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 포맷 선택 */}
      <div className="flex gap-2 mb-4">
        {[
          { id: 'html', icon: Globe, label: 'HTML' },
          { id: 'json', icon: FileJson, label: 'JSON' },
          { id: 'react', icon: FileCode, label: 'React' },
        ].map((format) => (
          <button
            key={format.id}
            onClick={() => setActiveFormat(format.id as ExportFormat)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2 rounded-lg
              transition-all text-sm font-medium
              ${activeFormat === format.id
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <format.icon size={16} />
            {format.label}
          </button>
        ))}
      </div>

      {/* 미리보기 */}
      <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
          <span className="text-xs text-gray-400">
            {activeFormat === 'html' && 'index.html'}
            {activeFormat === 'json' && 'project.json'}
            {activeFormat === 'react' && 'Page.tsx'}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white rounded"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? '복사됨!' : '복사'}
          </button>
        </div>
        <pre className="p-4 text-xs text-gray-300 overflow-auto h-[calc(100%-40px)] font-mono">
          <code>{getExportContent()}</code>
        </pre>
      </div>

      {/* 다운로드 버튼 */}
      <div className="mt-4 space-y-2">
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isExporting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Download size={18} />
          )}
          {isExporting ? '내보내는 중...' : '다운로드'}
        </button>
        
        <p className="text-xs text-gray-500 text-center">
          {activeFormat === 'html' && 'Tailwind CSS가 포함된 완전한 HTML 파일'}
          {activeFormat === 'json' && '프로젝트 데이터를 JSON으로 저장'}
          {activeFormat === 'react' && 'React 컴포넌트 기본 구조'}
        </p>
      </div>
    </div>
  );
}

