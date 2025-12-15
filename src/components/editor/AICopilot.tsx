'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Wand2,
  Palette,
  Type,
  Image,
  Code,
  Zap,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  X,
  MessageSquare,
  Layout,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';

// AI 프롬프트 템플릿
const promptTemplates = [
  { id: 'design', icon: Palette, label: '디자인 개선', prompt: '이 섹션의 디자인을 더 현대적으로 개선해줘' },
  { id: 'content', icon: Type, label: '콘텐츠 작성', prompt: '이 섹션에 적합한 텍스트를 작성해줘' },
  { id: 'layout', icon: Layout, label: '레이아웃 추천', prompt: '이 페이지에 적합한 레이아웃을 추천해줘' },
  { id: 'seo', icon: TrendingUp, label: 'SEO 최적화', prompt: '이 페이지의 SEO를 개선해줘' },
  { id: 'code', icon: Code, label: '코드 생성', prompt: '이 컴포넌트를 React 코드로 변환해줘' },
];

// AI 응답 히스토리
const chatHistory = [
  {
    id: 1,
    type: 'user',
    message: '히어로 섹션을 더 매력적으로 만들어줘',
    timestamp: '14:30',
  },
  {
    id: 2,
    type: 'ai',
    message: '히어로 섹션을 개선하기 위해 다음을 제안합니다:\n\n1. 그라디언트 배경 추가\n2. 애니메이션 효과 적용\n3. CTA 버튼 강조\n4. 서브헤드라인 추가',
    timestamp: '14:30',
    suggestions: [
      { type: 'action', label: '그라디언트 적용', icon: Palette },
      { type: 'action', label: '애니메이션 추가', icon: Zap },
      { type: 'action', label: 'CTA 강조', icon: Wand2 },
    ],
  },
];

// AI 자동완성 제안
const autoSuggestions = [
  '배경색을 파스텔 톤으로 변경',
  '글꼴 크기를 더 크게',
  '여백을 더 넓게',
  '그림자 효과 추가',
  '반응형 레이아웃 적용',
];

export default function AICopilot() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(chatHistory);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 사용자 메시지 추가
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        type: 'user',
        message: input,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');
    setIsLoading(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'ai',
          message: '요청하신 내용을 분석했습니다. 다음과 같이 적용할 수 있습니다:\n\n• 스타일 조정이 완료되었습니다\n• 변경사항을 미리보기에서 확인해보세요',
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            { type: 'action', label: '적용하기', icon: Check },
            { type: 'action', label: '다시 생성', icon: RefreshCw },
          ],
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  const handleTemplateClick = (template: typeof promptTemplates[0]) => {
    setInput(template.prompt);
  };

  const handleCopyCode = () => {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b bg-gradient-to-r from-primary-500 to-purple-500 text-white">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles size={18} />
          AI 코파일럿
        </h3>
        <p className="text-sm text-white/80 mt-1">
          AI와 대화하며 웹사이트를 만들어보세요
        </p>
      </div>

      {/* 빠른 프롬프트 */}
      <div className="p-4 border-b">
        <p className="text-xs font-medium text-gray-500 mb-2">빠른 명령어</p>
        <div className="flex flex-wrap gap-2">
          {promptTemplates.slice(0, 4).map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <template.icon size={12} />
              {template.label}
            </button>
          ))}
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] ${
                msg.type === 'user'
                  ? 'bg-primary-500 text-white rounded-2xl rounded-br-md'
                  : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md'
              } px-4 py-3`}
            >
              {msg.type === 'ai' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center">
                    <Sparkles size={12} className="text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">AI 코파일럿</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-line">{msg.message}</p>
              
              {/* AI 제안 액션 */}
              {msg.type === 'ai' && msg.suggestions && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
                  {msg.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
                    >
                      <suggestion.icon size={12} />
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              )}

              <span className={`text-xs mt-2 block ${msg.type === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                {msg.timestamp}
              </span>
            </div>
          </motion.div>
        ))}

        {/* 로딩 상태 */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles size={12} className="text-white" />
                </div>
                <span className="text-xs font-medium text-gray-500">생각 중...</span>
              </div>
              <div className="flex gap-1 mt-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* AI 인사이트 */}
      <div className="p-4 border-t bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lightbulb size={16} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">AI 제안</p>
            <p className="text-xs text-gray-600 mt-1">
              현재 페이지에 CTA 섹션을 추가하면 전환율이 약 15% 향상될 수 있습니다.
            </p>
            <button className="mt-2 text-xs text-primary-600 hover:underline">
              CTA 섹션 추가하기 →
            </button>
          </div>
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="p-4 border-t bg-white">
        {/* 자동완성 제안 */}
        <AnimatePresence>
          {input && showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-3 p-2 bg-gray-50 rounded-xl"
            >
              <p className="text-xs text-gray-500 mb-2 px-2">자동완성 제안</p>
              {autoSuggestions
                .filter((s) => s.includes(input))
                .slice(0, 3)
                .map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(suggestion);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg"
                  >
                    {suggestion}
                  </button>
                ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="AI에게 요청해보세요..."
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 pr-10"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <Wand2 size={18} />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2 text-center">
          AI가 생성한 내용은 참고용이며, 검토 후 사용해주세요
        </p>
      </div>
    </div>
  );
}

