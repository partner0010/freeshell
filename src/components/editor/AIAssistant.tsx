'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Lightbulb, Wand2, Code, Layout, Palette, Loader2 } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { Block } from '@/types';
import { uuidv4 } from '@/utils/uuid';
import { blockTemplates } from '@/data/block-templates';

const quickPrompts = [
  { icon: Layout, label: '랜딩페이지 만들기', prompt: '기업용 랜딩 페이지 섹션들을 만들어줘' },
  { icon: Palette, label: '디자인 개선', prompt: '현재 페이지의 디자인을 더 모던하게 개선해줘' },
  { icon: Code, label: '포트폴리오', prompt: '개발자 포트폴리오 페이지 구조를 만들어줘' },
  { icon: Lightbulb, label: '아이디어 추천', prompt: '이 페이지에 추가하면 좋을 섹션을 추천해줘' },
];

export function AIAssistant() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { aiMessages, addAiMessage, isAiLoading, setAiLoading, addBlock, getCurrentPage } = useEditorStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages]);

  const generateBlocksFromPrompt = (prompt: string): Block[] => {
    const loweredPrompt = prompt.toLowerCase();
    const blocks: Block[] = [];

    // 랜딩페이지 관련
    if (loweredPrompt.includes('랜딩') || loweredPrompt.includes('landing')) {
      const templates = ['header', 'hero', 'features', 'testimonials', 'pricing', 'cta', 'footer'];
      templates.forEach(type => {
        const template = blockTemplates.find(t => t.type === type);
        if (template) {
          blocks.push({
            id: uuidv4(),
            type: template.type,
            content: JSON.parse(JSON.stringify(template.defaultContent)),
            styles: JSON.parse(JSON.stringify(template.defaultStyles)),
          });
        }
      });
    }
    // 포트폴리오 관련
    else if (loweredPrompt.includes('포트폴리오') || loweredPrompt.includes('portfolio')) {
      const templates = ['header', 'hero', 'features', 'stats', 'contact', 'footer'];
      templates.forEach(type => {
        const template = blockTemplates.find(t => t.type === type);
        if (template) {
          blocks.push({
            id: uuidv4(),
            type: template.type,
            content: JSON.parse(JSON.stringify(template.defaultContent)),
            styles: JSON.parse(JSON.stringify(template.defaultStyles)),
          });
        }
      });
    }
    // 소개 페이지
    else if (loweredPrompt.includes('소개') || loweredPrompt.includes('about')) {
      const templates = ['header', 'hero', 'text', 'features', 'testimonials', 'footer'];
      templates.forEach(type => {
        const template = blockTemplates.find(t => t.type === type);
        if (template) {
          blocks.push({
            id: uuidv4(),
            type: template.type,
            content: JSON.parse(JSON.stringify(template.defaultContent)),
            styles: JSON.parse(JSON.stringify(template.defaultStyles)),
          });
        }
      });
    }
    // 기본: 추천 섹션들
    else {
      const templates = ['hero', 'features', 'cta'];
      templates.forEach(type => {
        const template = blockTemplates.find(t => t.type === type);
        if (template) {
          blocks.push({
            id: uuidv4(),
            type: template.type,
            content: JSON.parse(JSON.stringify(template.defaultContent)),
            styles: JSON.parse(JSON.stringify(template.defaultStyles)),
          });
        }
      });
    }

    return blocks;
  };

  const getAIResponse = (prompt: string): string => {
    const loweredPrompt = prompt.toLowerCase();

    if (loweredPrompt.includes('랜딩') || loweredPrompt.includes('landing')) {
      return '네! 기업용 랜딩 페이지에 필요한 섹션들을 추가했어요 🎉\n\n추가된 섹션:\n• 헤더 - 로고와 네비게이션\n• 히어로 섹션 - 메인 타이틀과 CTA\n• 특징 섹션 - 서비스 특징 소개\n• 후기 섹션 - 고객 후기\n• 가격표 - 요금제 비교\n• CTA 배너 - 행동 유도\n• 푸터 - 하단 정보\n\n각 블록을 클릭해서 내용을 수정할 수 있어요!';
    }
    if (loweredPrompt.includes('포트폴리오') || loweredPrompt.includes('portfolio')) {
      return '개발자 포트폴리오 페이지 구조를 만들었어요 💼\n\n추가된 섹션:\n• 헤더 - 네비게이션\n• 히어로 - 자기소개\n• 특징 - 기술 스택\n• 통계 - 프로젝트 실적\n• 연락처 - 문의 폼\n• 푸터\n\n프로젝트 갤러리나 블로그 섹션을 추가하면 더 좋을 것 같아요!';
    }
    if (loweredPrompt.includes('디자인') || loweredPrompt.includes('개선')) {
      return '디자인 개선을 위한 팁을 드릴게요 ✨\n\n1. 여백을 넉넉히 - 답답함 해소\n2. 색상 통일 - 파스텔 톤 유지\n3. 타이포그래피 - 제목과 본문 크기 대비\n4. 시각적 계층 - 중요한 것 강조\n\n왼쪽 스타일 패널에서 각 블록의 스타일을 조절해보세요!';
    }
    if (loweredPrompt.includes('추천') || loweredPrompt.includes('아이디어')) {
      const currentPage = getCurrentPage();
      const blockCount = currentPage?.blocks.length || 0;
      
      if (blockCount === 0) {
        return '아직 페이지가 비어있네요! 💡\n\n먼저 기본 구조부터 만들어볼까요?\n• "랜딩페이지 만들기" - 기업 홍보용\n• "포트폴리오 만들기" - 개인 포트폴리오\n• "소개 페이지 만들기" - 회사 소개\n\n원하는 것을 말씀해주세요!';
      }
      return '현재 페이지에 추가하면 좋을 섹션들이에요 💡\n\n• FAQ 섹션 - 자주 묻는 질문\n• 통계 섹션 - 숫자로 보여주는 성과\n• 팀 소개 - 팀원 프로필\n• 비디오 섹션 - 소개 영상\n• 갤러리 - 포트폴리오 이미지\n\n왼쪽 블록 패널에서 원하는 블록을 추가해보세요!';
    }

    return '요청하신 내용을 반영했어요! 🎨\n\n추가된 블록들을 확인해보세요. 각 블록을 클릭하면 내용을 수정할 수 있고, 드래그해서 순서를 바꿀 수도 있어요.\n\n더 필요한 게 있으면 말씀해주세요!';
  };

  const handleSubmit = async (prompt: string) => {
    if (!prompt.trim() || isAiLoading) return;

    addAiMessage({ role: 'user', content: prompt });
    setInput('');
    setAiLoading(true);

    // 시뮬레이션된 AI 응답 (실제로는 API 호출)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const blocks = generateBlocksFromPrompt(prompt);
    blocks.forEach((block) => addBlock(block));

    const response = getAIResponse(prompt);
    addAiMessage({ role: 'assistant', content: response });
    setAiLoading(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
          <Sparkles className="text-white" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">AI 어시스턴트</h3>
          <p className="text-xs text-gray-500">원하는 것을 설명해보세요</p>
        </div>
      </div>

      {/* 빠른 프롬프트 */}
      {aiMessages.length === 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-3">빠른 시작</p>
          <div className="grid grid-cols-2 gap-2">
            {quickPrompts.map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSubmit(item.prompt)}
                className="flex items-center gap-2 p-3 bg-pastel-lavender/50 hover:bg-pastel-lavender rounded-xl text-left transition-colors"
              >
                <item.icon size={18} className="text-primary-500 shrink-0" />
                <span className="text-sm text-gray-700">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        <AnimatePresence>
          {aiMessages.map((message, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[85%] rounded-2xl px-4 py-3
                  ${message.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'ai-chat-bubble'
                  }
                `}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isAiLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="ai-chat-bubble flex items-center gap-2">
              <Loader2 className="animate-spin text-primary-500" size={18} />
              <span className="text-sm text-gray-600">생각 중...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(input);
            }
          }}
          placeholder="원하는 페이지를 설명해보세요..."
          className="input-field pr-12"
          disabled={isAiLoading}
        />
        <button
          onClick={() => handleSubmit(input)}
          disabled={!input.trim() || isAiLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-500 hover:bg-primary-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

