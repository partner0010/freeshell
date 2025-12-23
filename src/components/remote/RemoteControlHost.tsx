/**
 * 원격 제어 호스트 (원격 지원 받는 쪽)
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, Copy, X, Shield, CheckCircle, 
  MessageSquare, FileText, Settings, Mic, MicOff,
  Camera, CameraOff, Users, Lock
} from 'lucide-react';
import { WebRTCRemoteControl } from '@/lib/remote/webrtc';

interface RemoteControlHostProps {
  connectionCode: string;
  sessionId: string | null;
  onDisconnect: () => void;
  onCopyCode: () => void;
}

export function RemoteControlHost({
  connectionCode,
  sessionId,
  onDisconnect,
  onCopyCode,
}: RemoteControlHostProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [remoteUser, setRemoteUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ from: 'me' | 'remote'; text: string; time: Date }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [allowControl, setAllowControl] = useState(false);
  const [allowFileTransfer, setAllowFileTransfer] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const webrtcRef = useRef<WebRTCRemoteControl | null>(null);

  // 화면 공유 시작
  useEffect(() => {
    const startScreenShare = async () => {
      try {
        webrtcRef.current = new WebRTCRemoteControl();
        
        // 화면 공유 시작
        const stream = await webrtcRef.current.startScreenShare();
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }

        // Peer Connection 생성
        const pc = webrtcRef.current.createPeerConnection();
        
        // Data Channel 수신
        pc.ondatachannel = (event) => {
          const channel = event.channel;
          channel.onmessage = (e) => {
            try {
              const data = JSON.parse(e.data);
              
              if (data.type === 'chat') {
                setMessages(prev => [...prev, {
                  from: 'remote',
                  text: data.message,
                  time: new Date(data.timestamp),
                }]);
              } else if (data.type === 'mouse' && allowControl) {
                // 마우스 이벤트 처리 (실제로는 원격 마우스 제어)
                console.log('마우스 이벤트:', data);
              } else if (data.type === 'keyboard' && allowControl) {
                // 키보드 이벤트 처리 (실제로는 원격 키보드 제어)
                console.log('키보드 이벤트:', data);
              }
            } catch (error) {
              console.error('메시지 파싱 오류:', error);
            }
          };
        };

        // Answer 생성 및 전송 (Offer 수신 후)
        // 실제로는 시그널링 서버를 통해 Offer를 받아야 함
        setTimeout(() => {
          setIsConnected(true);
          setRemoteUser('원격 지원자');
        }, 2000);
      } catch (error) {
        console.error('화면 공유 실패:', error);
        alert('화면 공유 권한이 필요합니다.');
      }
    };

    if (sessionId) {
      startScreenShare();
    }

    return () => {
      if (webrtcRef.current) {
        webrtcRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [sessionId, allowControl]);

  // 메시지 전송
  const sendMessage = () => {
    if (!inputMessage.trim() || !webrtcRef.current) return;
    
    webrtcRef.current.sendChatMessage(inputMessage);
    
    const newMessage = {
      from: 'me' as const,
      text: inputMessage,
      time: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  // 원격 제어 허용/거부
  const toggleControl = () => {
    if (!allowControl) {
      const confirmed = confirm('원격 제어를 허용하시겠습니까? 상대방이 마우스와 키보드를 제어할 수 있습니다.');
      if (confirmed) {
        setAllowControl(true);
      }
    } else {
      setAllowControl(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* 헤더 */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-white font-semibold">
              {isConnected ? '연결됨' : '연결 대기 중...'}
            </span>
          </div>
          {remoteUser && (
            <div className="flex items-center gap-2 text-gray-300">
              <Users size={16} />
              <span>{remoteUser}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* 연결 코드 표시 */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg">
            <span className="text-gray-300 text-sm">연결 코드:</span>
            <span className="text-white font-bold text-lg tracking-widest">{connectionCode}</span>
            <button
              onClick={onCopyCode}
              className="p-1 hover:bg-gray-600 rounded transition-colors"
              title="복사"
            >
              <Copy className="text-gray-300" size={16} />
            </button>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="설정"
          >
            <Settings className="text-gray-300" size={20} />
          </button>
          
          <button
            onClick={onDisconnect}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <X size={18} />
            <span>연결 종료</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 메인 화면 공유 영역 */}
        <div className="flex-1 relative bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
          
          {/* 연결 대기 오버레이 */}
          {!isConnected && (
            <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white text-lg mb-2">원격 지원자 연결 대기 중...</p>
                <p className="text-gray-400 text-sm">연결 코드를 상대방에게 공유하세요</p>
                <div className="mt-4 px-6 py-3 bg-gray-800 rounded-lg inline-block">
                  <p className="text-white font-bold text-2xl tracking-widest">{connectionCode}</p>
                </div>
              </div>
            </div>
          )}

          {/* 원격 제어 상태 표시 */}
          {isConnected && (
            <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-black/70 rounded-lg">
              {allowControl ? (
                <>
                  <CheckCircle className="text-green-500" size={18} />
                  <span className="text-white text-sm">원격 제어 활성화</span>
                </>
              ) : (
                <>
                  <Lock className="text-yellow-500" size={18} />
                  <span className="text-white text-sm">원격 제어 비활성화</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* 사이드바 */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* 설정 패널 */}
          {showSettings && (
            <div className="p-4 border-b border-gray-700 bg-gray-750">
              <h3 className="text-white font-semibold mb-4">설정</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">화질</label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                  >
                    <option value="low">낮음 (빠름)</option>
                    <option value="medium">보통</option>
                    <option value="high">높음 (느림)</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 text-sm">원격 제어 허용</label>
                  <button
                    onClick={toggleControl}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      allowControl ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      allowControl ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 text-sm">파일 전송 허용</label>
                  <button
                    onClick={() => setAllowFileTransfer(!allowFileTransfer)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      allowFileTransfer ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      allowFileTransfer ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 채팅 */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-700 flex items-center gap-2">
              <MessageSquare className="text-gray-300" size={20} />
              <h3 className="text-white font-semibold">채팅</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.from === 'me'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-200'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.time.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="메시지 입력..."
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  전송
                </button>
              </div>
            </div>
          </div>

          {/* 보안 정보 */}
          <div className="p-4 border-t border-gray-700 bg-gray-750">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-green-500" size={18} />
              <span className="text-white text-sm font-semibold">보안 보장</span>
            </div>
            <p className="text-gray-400 text-xs">
              모든 통신은 암호화되어 안전하게 전송됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

