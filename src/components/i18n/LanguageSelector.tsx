/**
 * 언어 선택 컴포넌트
 * 다국어 지원 UI
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { i18n, type Locale } from '@/lib/i18n';

const languages: { code: Locale; name: string; flag: string }[] = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export function LanguageSelector() {
  const [currentLocale, setCurrentLocale] = useState<Locale>(i18n.getLocale());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentLocale(i18n.getLocale());
  }, []);

  const handleLanguageChange = (locale: Locale) => {
    i18n.setLocale(locale);
    setCurrentLocale(locale);
    setIsOpen(false);
    // 페이지 새로고침으로 언어 변경 적용
    window.location.reload();
  };

  const currentLanguage = languages.find(lang => lang.code === currentLocale);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        aria-label="언어 선택"
      >
        <Globe size={18} />
        <span className="hidden sm:inline">{currentLanguage?.flag} {currentLanguage?.name}</span>
        <span className="sm:hidden">{currentLanguage?.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          <div className="p-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  currentLocale === lang.code
                    ? 'bg-purple-50 text-purple-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="flex-1 font-medium">{lang.name}</span>
                {currentLocale === lang.code && (
                  <Check size={16} className="text-purple-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

