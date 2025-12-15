'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Plus,
  Check,
  ChevronRight,
  Languages,
  Wand2,
  Copy,
  Trash2,
  Settings,
  RefreshCw,
} from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isDefault: boolean;
  progress: number; // 번역 진행률
}

const availableLanguages = [
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
];

export default function LanguagePanel() {
  const [languages, setLanguages] = useState<Language[]>([
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', isDefault: true, progress: 100 },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', isDefault: false, progress: 85 },
  ]);
  const [selectedLang, setSelectedLang] = useState<string>('ko');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const addLanguage = (lang: typeof availableLanguages[0]) => {
    if (languages.some(l => l.code === lang.code)) return;
    setLanguages([...languages, { ...lang, isDefault: false, progress: 0 }]);
    setShowAddModal(false);
  };

  const removeLanguage = (code: string) => {
    if (languages.find(l => l.code === code)?.isDefault) return;
    setLanguages(languages.filter(l => l.code !== code));
  };

  const setDefaultLanguage = (code: string) => {
    setLanguages(languages.map(l => ({ ...l, isDefault: l.code === code })));
  };

  const autoTranslate = async (targetCode: string) => {
    setIsTranslating(true);
    // 실제로는 번역 API 호출
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLanguages(languages.map(l => 
      l.code === targetCode ? { ...l, progress: 100 } : l
    ));
    setIsTranslating(false);
  };

  const unusedLanguages = availableLanguages.filter(
    al => !languages.some(l => l.code === al.code)
  );

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Globe size={18} />
          다국어 지원
        </h3>
        <p className="text-sm text-gray-500 mt-1">웹사이트를 여러 언어로 제공하세요</p>
      </div>

      {/* 언어 추가 버튼 */}
      <div className="p-4">
        <button
          onClick={() => setShowAddModal(true)}
          disabled={unusedLanguages.length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl text-gray-500 hover:border-primary-300 hover:text-primary-500 transition-colors disabled:opacity-50"
        >
          <Plus size={18} />
          언어 추가
        </button>
      </div>

      {/* 언어 목록 */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2">
        {languages.map((lang) => (
          <motion.div
            key={lang.code}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              bg-white rounded-xl border p-4 cursor-pointer transition-all
              ${selectedLang === lang.code ? 'ring-2 ring-primary-300' : 'hover:shadow-md'}
            `}
            onClick={() => setSelectedLang(lang.code)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{lang.nativeName}</span>
                    {lang.isDefault && (
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">기본</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{lang.name}</span>
                </div>
              </div>
              <ChevronRight
                size={18}
                className={`text-gray-400 transition-transform ${selectedLang === lang.code ? 'rotate-90' : ''}`}
              />
            </div>

            {/* 번역 진행률 */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">번역 진행률</span>
                <span className={`font-medium ${lang.progress === 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {lang.progress}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${lang.progress === 100 ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: `${lang.progress}%` }}
                />
              </div>
            </div>

            {/* 확장된 옵션 */}
            <AnimatePresence>
              {selectedLang === lang.code && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t"
                >
                  <div className="flex flex-wrap gap-2">
                    {!lang.isDefault && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setDefaultLanguage(lang.code); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                      >
                        <Check size={14} />
                        기본으로 설정
                      </button>
                    )}
                    {lang.progress < 100 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); autoTranslate(lang.code); }}
                        disabled={isTranslating}
                        className="flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-sm hover:bg-primary-200 disabled:opacity-50"
                      >
                        {isTranslating ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : (
                          <Wand2 size={14} />
                        )}
                        AI 자동 번역
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                    >
                      <Copy size={14} />
                      복제
                    </button>
                    {!lang.isDefault && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeLanguage(lang.code); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                      >
                        <Trash2 size={14} />
                        삭제
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* AI 번역 팁 */}
      <div className="p-4 border-t bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Languages size={16} className="text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">AI 자동 번역</p>
            <p className="text-xs text-gray-600 mt-1">
              AI가 콘텐츠를 자동으로 번역합니다. 번역 후 검수를 권장합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 언어 추가 모달 */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">언어 추가</h2>
              </div>
              <div className="p-4 max-h-80 overflow-y-auto">
                <div className="space-y-2">
                  {unusedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => addLanguage(lang)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{lang.nativeName}</p>
                        <p className="text-xs text-gray-500">{lang.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

