'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Play, Save, RotateCcw, AlertCircle, CheckCircle, Copy, Check } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

const defaultCSS = `/* 커스텀 CSS를 여기에 작성하세요 */

/* 예시: 모든 버튼에 그림자 추가 */
.btn-primary {
  box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
}

/* 예시: 호버 효과 */
.block-item:hover {
  transform: translateY(-2px);
}

/* 예시: 커스텀 애니메이션 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
`;

const cssSnippets = [
  {
    name: '그라데이션 텍스트',
    code: `.gradient-text {
  background: linear-gradient(135deg, #8B5CF6, #EC4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}`,
  },
  {
    name: '글래스모피즘',
    code: `.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}`,
  },
  {
    name: '네온 글로우',
    code: `.neon-glow {
  box-shadow: 
    0 0 5px #8B5CF6,
    0 0 10px #8B5CF6,
    0 0 20px #8B5CF6;
}`,
  },
  {
    name: '부드러운 스크롤',
    code: `html {
  scroll-behavior: smooth;
}`,
  },
  {
    name: '이미지 호버 줌',
    code: `.img-zoom {
  overflow: hidden;
}
.img-zoom img {
  transition: transform 0.3s ease;
}
.img-zoom:hover img {
  transform: scale(1.1);
}`,
  },
];

export function CustomCSSPanel() {
  const [css, setCSS] = useState(defaultCSS);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // CSS 유효성 검사
  const validateCSS = (cssText: string) => {
    try {
      // 간단한 유효성 검사
      const style = document.createElement('style');
      style.textContent = cssText;
      document.head.appendChild(style);
      document.head.removeChild(style);
      setIsValid(true);
      setErrorMessage('');
      return true;
    } catch (e) {
      setIsValid(false);
      setErrorMessage('CSS 문법 오류가 있습니다');
      return false;
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      validateCSS(css);
    }, 500);
    return () => clearTimeout(debounce);
  }, [css]);

  const handleSave = () => {
    if (validateCSS(css)) {
      // 커스텀 CSS 저장 로직
      localStorage.setItem('grip-custom-css', css);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleReset = () => {
    if (confirm('기본 CSS로 초기화하시겠습니까?')) {
      setCSS(defaultCSS);
    }
  };

  const handleCopySnippet = (snippet: typeof cssSnippets[0]) => {
    navigator.clipboard.writeText(snippet.code);
    setCopiedSnippet(snippet.name);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleInsertSnippet = (snippet: typeof cssSnippets[0]) => {
    setCSS(prev => `${prev}\n\n/* ${snippet.name} */\n${snippet.code}`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
          <Code className="text-white" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">커스텀 CSS</h3>
          <p className="text-xs text-gray-500">고급 스타일 커스터마이징</p>
        </div>
      </div>

      {/* 상태 표시 */}
      <div className={`
        flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-sm
        ${isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
      `}>
        {isValid ? (
          <>
            <CheckCircle size={16} />
            CSS 문법이 유효합니다
          </>
        ) : (
          <>
            <AlertCircle size={16} />
            {errorMessage}
          </>
        )}
      </div>

      {/* CSS 에디터 */}
      <div className="flex-1 relative mb-4">
        <textarea
          value={css}
          onChange={(e) => setCSS(e.target.value)}
          className="w-full h-full p-4 bg-gray-900 text-gray-100 font-mono text-sm rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          spellCheck={false}
          placeholder="/* 커스텀 CSS 입력 */"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">CSS</span>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`
            flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm transition-colors
            ${isValid 
              ? 'bg-primary-500 text-white hover:bg-primary-600' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isSaved ? <Check size={16} /> : <Save size={16} />}
          {isSaved ? '저장됨!' : '저장'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* 스니펫 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">빠른 삽입</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {cssSnippets.map((snippet) => (
            <div
              key={snippet.name}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <span className="text-sm text-gray-700">{snippet.name}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleCopySnippet(snippet)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
                  title="복사"
                >
                  {copiedSnippet === snippet.name ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <button
                  onClick={() => handleInsertSnippet(snippet)}
                  className="px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded"
                >
                  삽입
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

