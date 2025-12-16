'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  MessageCircle,
  Send,
  X,
  Crown,
  Edit3,
  Eye,
  Check,
  Copy,
  Video,
  Phone,
  MoreVertical,
  Circle,
} from 'lucide-react';

// 협업자 데이터
const collaborators = [
  { id: 1, name: '김철수', email: 'kim@example.com', avatar: '김', role: 'owner', status: 'online', cursor: { x: 250, y: 150 }, color: '#8B5CF6' },
  { id: 2, name: '이영희', email: 'lee@example.com', avatar: '이', role: 'editor', status: 'online', cursor: { x: 400, y: 300 }, color: '#22C55E' },
  { id: 3, name: '박민수', email: 'park@example.com', avatar: '박', role: 'viewer', status: 'away', cursor: null, color: '#F59E0B' },
];

// 채팅 메시지
const chatMessages = [
  { id: 1, user: '이영희', message: '헤더 디자인 수정했어요!', time: '14:32' },
  { id: 2, user: '김철수', message: '좋아요, 색상 조금 더 밝게 할까요?', time: '14:33' },
  { id: 3, user: '이영희', message: '네 그게 좋겠어요 👍', time: '14:34' },
];

const roleLabels: Record<string, { label: string; icon: React.ComponentType<any> }> = {
  owner: { label: '소유자', icon: Crown },
  editor: { label: '편집자', icon: Edit3 },
  viewer: { label: '뷰어', icon: Eye },
};

export default function CollaborationPanel() {
  const [activeTab, setActiveTab] = useState<'team' | 'chat'>('team');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(chatMessages);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        user: '나',
        message: newMessage,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewMessage('');
  };

  const onlineCount = collaborators.filter(c => c.status === 'online').length;

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Users size={18} />
          실시간 협업
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {onlineCount}명 온라인
        </p>
      </div>

      {/* 탭 */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('team')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'team'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          팀원
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'chat'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          채팅
          <span className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'team' && (
          <div className="p-4 space-y-4">
            {/* 초대 버튼 */}
            <button
              onClick={() => setShowInviteModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary-300 hover:text-primary-500 transition-colors"
            >
              <UserPlus size={18} />
              팀원 초대하기
            </button>

            {/* 협업자 목록 */}
            <div className="space-y-2">
              {collaborators.map((collab) => {
                const RoleIcon = roleLabels[collab.role].icon;
                return (
                  <div
                    key={collab.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    {/* 아바타 */}
                    <div className="relative">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: collab.color }}
                      >
                        {collab.avatar}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          collab.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                      />
                    </div>

                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800 truncate">{collab.name}</span>
                        {collab.role === 'owner' && (
                          <Crown size={14} className="text-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <RoleIcon size={12} />
                        {roleLabels[collab.role].label}
                        <span>•</span>
                        <span>{collab.status === 'online' ? '활동 중' : '자리 비움'}</span>
                      </div>
                    </div>

                    {/* 액션 */}
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* 빠른 통화 */}
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-3">빠른 소통</p>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                  <Video size={18} />
                  화상 회의
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                  <Phone size={18} />
                  음성 통화
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            {/* 메시지 목록 */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.user === '나' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-600">{msg.user}</span>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                  </div>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl ${
                      msg.user === '나'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            {/* 입력 */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="메시지 입력..."
                  className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 초대 모달 */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">팀원 초대</h2>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">역할</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    <option value="editor">편집자 - 편집 가능</option>
                    <option value="viewer">뷰어 - 보기만 가능</option>
                  </select>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700 mb-2">또는 링크 공유</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="https://grip.app/invite/abc123"
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border rounded-lg text-sm text-gray-600"
                    />
                    <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  초대 보내기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

