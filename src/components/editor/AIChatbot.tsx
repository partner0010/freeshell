'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  links?: { label: string; url: string }[];
}

const quickActions = [
  '블록 추가 방법',
  '스타일 변경하기',
  '페이지 내보내기',
  '템플릿 사용법',
  'AI 기능 활용',
  '협업 설정',
];

const botResponses: Record<string, string> = {
  '블록 추가 방법': '블록을 추가하려면 왼쪽 사이드바의 "블록" 탭에서 원하는 블록을 캔버스로 드래그하세요. 또는 Ctrl+K를 눌러 커맨드 팔레트에서 "블록 추가"를 검색할 수 있습니다.',
  '스타일 변경하기': '블록을 선택한 후 "스타일" 탭에서 배경색, 패딩, 정렬 등을 변경할 수 있습니다. 전체 테마는 "테마" 탭에서 관리할 수 있어요.',
  '페이지 내보내기': '"내보내기" 탭에서 HTML, CSS, JSON 또는 React 코드로 내보낼 수 있습니다. 용도에 맞는 형식을 선택하세요.',
  '템플릿 사용법': '프로젝트 패널에서 템플릿 갤러리를 열어 다양한 템플릿을 확인할 수 있습니다. 원하는 템플릿을 클릭하면 바로 적용됩니다.',
  'AI 기능 활용': 'AI 코파일럿을 사용하면 자연어로 웹사이트를 수정할 수 있어요. "AI" 탭에서 원하는 내용을 입력해보세요.',
  '협업 설정': '"협업" 탭에서 팀원을 초대하고 실시간으로 함께 작업할 수 있습니다. 권한 설정도 가능해요.',
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '안녕하세요! GRIP 도우미입니다. 무엇을 도와드릴까요?',
      timestamp: new Date(),
      suggestions: quickActions.slice(0, 3),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string = input) => {
    if (!content.trim()) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // 봇 응답 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));

    const botContent = botResponses[content] || 
      `"${content}"에 대해 찾아보고 있어요. 더 자세한 도움이 필요하시면 support@grip.app으로 문의해주세요!`;

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: botContent,
      timestamp: new Date(),
      suggestions: quickActions.slice(Math.floor(Math.random() * 3), Math.floor(Math.random() * 3) + 3),
      links: content.includes('내보내기') ? [
        { label: '내보내기 가이드', url: '#' },
      ] : undefined,
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
      >
        <MessageCircle size={24} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
          1
        </span>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`
        fixed z-50 bg-white rounded-2xl shadow-2xl overflow-hidden
        ${isMinimized 
          ? 'bottom-6 right-6 w-72' 
          : 'bottom-6 right-6 w-96 h-[500px]'
        }
      `}
    >
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={20} />
          </div>
          <div>
            <p className="font-semibold">GRIP 도우미</p>
            <p className="text-xs text-white/80">항상 도움드릴 준비가 되어 있어요</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/20 rounded-lg"
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* 메시지 영역 */}
          <div className="h-[340px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-1' : 'order-2'}`}>
                  {msg.type === 'bot' && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center">
                        <Bot size={12} className="text-white" />
                      </div>
                      <span className="text-xs text-gray-500">GRIP 도우미</span>
                    </div>
                  )}
                  <div
                    className={`
                      px-4 py-3 rounded-2xl
                      ${msg.type === 'user'
                        ? 'bg-primary-500 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                      }
                    `}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>

                  {/* 링크 */}
                  {msg.links && (
                    <div className="mt-2 space-y-1">
                      {msg.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          className="flex items-center gap-1 text-xs text-primary-500 hover:underline"
                        >
                          <ExternalLink size={12} />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* 제안 버튼 */}
                  {msg.suggestions && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="px-3 py-1 bg-white border rounded-full text-xs text-gray-600 hover:bg-gray-50"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 피드백 (봇 메시지만) */}
                  {msg.type === 'bot' && (
                    <div className="mt-2 flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-green-500 rounded">
                        <ThumbsUp size={14} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-500 rounded">
                        <ThumbsDown size={14} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <Copy size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* 타이핑 인디케이터 */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Bot size={12} className="text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

