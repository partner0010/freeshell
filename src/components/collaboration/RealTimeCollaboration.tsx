/**
 * 실시간 협업 컴포넌트
 * 여러 사용자가 동시에 작업할 수 있는 기능
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, MessageSquare, Video, Mic, MicOff, VideoOff } from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  cursor: { x: number; y: number };
  isActive: boolean;
}

export function RealTimeCollaboration() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ user: string; message: string; time: Date }>>([]);

  // 실시간 협업자 목록 시뮬레이션
  useEffect(() => {
    const mockCollaborators: Collaborator[] = [
      { id: '1', name: '사용자 1', avatar: '👤', cursor: { x: 100, y: 200 }, isActive: true },
      { id: '2', name: '사용자 2', avatar: '👤', cursor: { x: 300, y: 150 }, isActive: true },
    ];
    setCollaborators(mockCollaborators);
  }, []);

  const handleInvite = () => {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    alert(`초대 코드: ${inviteCode}\n이 코드를 공유하여 협업을 시작하세요.`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="text-purple-600" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">실시간 협업</h3>
            <p className="text-sm text-gray-600">{collaborators.length}명 참여 중</p>
          </div>
        </div>
        <button
          onClick={handleInvite}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <UserPlus size={18} />
          초대
        </button>
      </div>

      {/* 협업자 목록 */}
      <div className="space-y-2 mb-6">
        {collaborators.map((collaborator) => (
          <div
            key={collaborator.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-lg">
              {collaborator.avatar}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{collaborator.name}</p>
              <p className="text-xs text-gray-500">작업 중...</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${collaborator.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
          </div>
        ))}
      </div>

      {/* 통신 컨트롤 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsMicOn(!isMicOn)}
          className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
            isMicOn
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
          }`}
        >
          {isMicOn ? <Mic size={18} className="inline mr-2" /> : <MicOff size={18} className="inline mr-2" />}
          {isMicOn ? '음성 켜짐' : '음성 꺼짐'}
        </button>
        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
            isVideoOn
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
          }`}
        >
          {isVideoOn ? <Video size={18} className="inline mr-2" /> : <VideoOff size={18} className="inline mr-2" />}
          {isVideoOn ? '화상 켜짐' : '화상 꺼짐'}
        </button>
      </div>

      {/* 채팅 */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="text-gray-600" size={18} />
          <h4 className="font-semibold text-gray-900">협업 채팅</h4>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto mb-2">
          {chatMessages.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">메시지가 없습니다.</p>
          ) : (
            chatMessages.map((msg, i) => (
              <div key={i} className="mb-2">
                <p className="text-xs text-gray-600">{msg.user}: {msg.message}</p>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="메시지 입력..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            전송
          </button>
        </div>
      </div>
    </div>
  );
}

