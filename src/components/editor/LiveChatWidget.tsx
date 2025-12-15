'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  User,
  Bot,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Settings,
  Users,
  Clock,
  Star,
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatSession {
  id: string;
  visitor: string;
  email?: string;
  status: 'active' | 'waiting' | 'closed';
  startedAt: string;
  messages: number;
  rating?: number;
}

export function LiveChatWidget() {
  const [activeTab, setActiveTab] = useState<'widget' | 'conversations' | 'settings'>('widget');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '안녕하세요! GRIP에 오신 것을 환영합니다. 무엇을 도와드릴까요? 🎉',
      sender: 'bot',
      timestamp: new Date(Date.now() - 60000),
      status: 'read',
    },
  ]);
  
  const [sessions] = useState<ChatSession[]>([
    { id: '1', visitor: '방문자 #1234', email: 'visitor@example.com', status: 'active', startedAt: '5분 전', messages: 8 },
    { id: '2', visitor: '방문자 #1235', status: 'waiting', startedAt: '2분 전', messages: 1 },
    { id: '3', visitor: '김철수', email: 'kim@example.com', status: 'closed', startedAt: '1시간 전', messages: 15, rating: 5 },
  ]);
  
  const [widgetSettings, setWidgetSettings] = useState({
    position: 'bottom-right',
    primaryColor: '#8B5CF6',
    welcomeMessage: '안녕하세요! 무엇을 도와드릴까요?',
    offlineMessage: '현재 오프라인입니다. 이메일을 남겨주세요.',
    autoResponder: true,
    soundEnabled: true,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: message,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // 봇 자동 응답 시뮬레이션
    if (widgetSettings.autoResponder) {
      setTimeout(() => {
        const botResponse: Message = {
          id: `msg-${Date.now() + 1}`,
          content: '감사합니다! 잠시만 기다려주시면 담당자가 연결됩니다. 📞',
          sender: 'bot',
          timestamp: new Date(),
          status: 'delivered',
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'waiting':
        return 'bg-yellow-500';
      case 'closed':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary-500" />
          라이브 채팅
        </h3>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500">온라인</span>
          </span>
        </div>
      </div>
      
      {/* 탭 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {[
          { id: 'widget', label: '위젯', icon: MessageCircle },
          { id: 'conversations', label: '대화', icon: Users },
          { id: 'settings', label: '설정', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* 위젯 미리보기 */}
      {activeTab === 'widget' && (
        <div className="space-y-3">
          {/* 미리보기 */}
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[300px]">
            <p className="text-xs text-gray-500 mb-2">위젯 미리보기</p>
            
            {/* 채팅 버튼 */}
            {!isOpen && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="absolute bottom-4 right-4 w-14 h-14 bg-primary-500 rounded-full shadow-lg flex items-center justify-center text-white"
                style={{ backgroundColor: widgetSettings.primaryColor }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.button>
            )}
            
            {/* 채팅 창 */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="absolute bottom-4 right-4 w-72 bg-white dark:bg-gray-700 rounded-2xl shadow-2xl overflow-hidden"
                >
                  {/* 헤더 */}
                  <div
                    className="p-3 text-white flex items-center justify-between"
                    style={{ backgroundColor: widgetSettings.primaryColor }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">GRIP 지원팀</p>
                        <p className="text-xs opacity-75">보통 수 분 내 응답</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1 hover:bg-white/20 rounded"
                      >
                        {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-white/20 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {!isMinimized && (
                    <>
                      {/* 메시지 영역 */}
                      <div className="h-48 overflow-y-auto p-3 space-y-3">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                                msg.sender === 'user'
                                  ? 'bg-primary-500 text-white rounded-br-md'
                                  : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white rounded-bl-md'
                              }`}
                            >
                              {msg.content}
                              <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                                {msg.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                {msg.sender === 'user' && (
                                  msg.status === 'read' ? <CheckCheck className="w-3 h-3 inline ml-1" /> : <Check className="w-3 h-3 inline ml-1" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                      
                      {/* 입력 영역 */}
                      <div className="p-3 border-t dark:border-gray-600">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                            <Paperclip className="w-4 h-4 text-gray-400" />
                          </button>
                          <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="메시지 입력..."
                            className="flex-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-600 rounded-full focus:outline-none"
                          />
                          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                            <Smile className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={sendMessage}
                            className="p-1.5 bg-primary-500 text-white rounded-full hover:bg-primary-600"
                            style={{ backgroundColor: widgetSettings.primaryColor }}
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* 빠른 설정 */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">환영 메시지</label>
              <input
                type="text"
                value={widgetSettings.welcomeMessage}
                onChange={(e) => setWidgetSettings({ ...widgetSettings, welcomeMessage: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-500 mb-1 block">테마 색상</label>
              <div className="flex gap-2">
                {['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setWidgetSettings({ ...widgetSettings, primaryColor: color })}
                    className={`w-8 h-8 rounded-full ${widgetSettings.primaryColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 대화 목록 */}
      {activeTab === 'conversations' && (
        <div className="space-y-2">
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:border-primary-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(session.status)} rounded-full border-2 border-white dark:border-gray-700`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white text-sm">{session.visitor}</p>
                    {session.email && <p className="text-xs text-gray-500">{session.email}</p>}
                  </div>
                </div>
                {session.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">{session.rating}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-600">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {session.startedAt}
                </span>
                <span className="text-xs text-gray-500">{session.messages}개 메시지</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* 설정 */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">위젯 설정</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">위치</label>
                <select
                  value={widgetSettings.position}
                  onChange={(e) => setWidgetSettings({ ...widgetSettings, position: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                >
                  <option value="bottom-right">우측 하단</option>
                  <option value="bottom-left">좌측 하단</option>
                </select>
              </div>
              
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">자동 응답</span>
                <input
                  type="checkbox"
                  checked={widgetSettings.autoResponder}
                  onChange={(e) => setWidgetSettings({ ...widgetSettings, autoResponder: e.target.checked })}
                  className="w-4 h-4 accent-primary-500"
                />
              </label>
              
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">알림음</span>
                <input
                  type="checkbox"
                  checked={widgetSettings.soundEnabled}
                  onChange={(e) => setWidgetSettings({ ...widgetSettings, soundEnabled: e.target.checked })}
                  className="w-4 h-4 accent-primary-500"
                />
              </label>
            </div>
          </div>
          
          <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">오프라인 메시지</h4>
            <textarea
              value={widgetSettings.offlineMessage}
              onChange={(e) => setWidgetSettings({ ...widgetSettings, offlineMessage: e.target.value })}
              className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-600 dark:border-gray-500"
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveChatWidget;

