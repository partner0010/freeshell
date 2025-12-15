'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface ChatMessage {
  id: string;
  user: 'user' | 'ai' | 'system';
  message: string;
  timestamp: number;
}

export function RealtimeChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'system',
      message: '채팅이 시작되었습니다',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      user: 'user',
      message: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        user: 'ai',
        message: `"${input}"에 대한 응답입니다. 실제로는 AI가 답변을 생성합니다.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <MessageCircle className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">실시간 채팅</h2>
            <p className="text-sm text-gray-500">팀원과 실시간으로 소통하세요</p>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.user === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.user === 'user'
                    ? 'bg-primary-500'
                    : msg.user === 'ai'
                    ? 'bg-green-500'
                    : 'bg-gray-400'
                }`}
              >
                {msg.user === 'user' ? (
                  <User size={16} className="text-white" />
                ) : msg.user === 'ai' ? (
                  <Bot size={16} className="text-white" />
                ) : (
                  <MessageCircle size={16} className="text-white" />
                )}
              </div>
              <div
                className={`max-w-[70%] ${
                  msg.user === 'user' ? 'text-right' : ''
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    msg.user === 'user'
                      ? 'bg-primary-500 text-white'
                      : msg.user === 'ai'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gray-200 text-gray-600 text-center'
                  }`}
                >
                  {msg.message}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-lg">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="p-6 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="메시지를 입력하세요..."
            className="flex-1"
          />
          <Button variant="primary" onClick={handleSend} disabled={!input.trim()}>
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

