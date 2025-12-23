/**
 * 원격 제어 클라이언트 (원격 지원 하는 쪽)
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, X, MessageSquare, FileText, 
  Download, Upload, Settings, MousePointer2,
  Keyboard, Maximize2, RefreshCw, ZoomIn, ZoomOut
} from 'lucide-react';
import { WebRTCRemoteControl } from '@/lib/remote/webrtc';

interface RemoteControlClientProps {
  connectionCode: string;
  sessionId: string | null;
  isConnected: boolean;
  onDisconnect: () => void;
}

export function RemoteControlClient({
  connectionCode,
  sessionId,
  isConnected,
  onDisconnect,
}: RemoteControlClientProps) {
  const [messages, setMessages] = useState<Array<{ from: 'me' | 'remote'; text: string; time: Date }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [hasControl, setHasControl] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showFileTransfer, setShowFileTransfer] = useState(false);
  const remoteScreenRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const webrtcRef = useRef<WebRTCRemoteControl | null>(null);

  // WebRTC 연결 초기화
  useEffect(() => {
    if (isConnected && sessionId) {
      webrtcRef.current = new WebRTCRemoteControl();
      
      // Peer Connection 생성
      const pc = webrtcRef.current.createPeerConnection();
      
      // 원격 스트림 수신
      pc.ontrack = (event) => {
        if (videoRef.current && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

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
            }
          } catch (error) {
            console.error('메시지 파싱 오류:', error);
          }
        };
      };

      // Offer 생성 및 전송
      webrtcRef.current.createOffer().then(offer => {
        fetch('/api/remote/signal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            type: 'offer',
            from: 'client',
            to: 'host',
            data: offer,
          }),
        });
      });
    }

    return () => {
      if (webrtcRef.current) {
        webrtcRef.current.close();
      }
    };
  }, [isConnected, sessionId]);

  // 마우스 이벤트 처리 (원격 제어)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hasControl || !isConnected || !webrtcRef.current) return;
    
    const rect = remoteScreenRef.current?.getBoundingClientRect();
    if (rect && videoRef.current) {
      const video = videoRef.current;
      const x = ((e.clientX - rect.left) / rect.width) * video.videoWidth;
      const y = ((e.clientY - rect.top) / rect.height) * video.videoHeight;
      
      webrtcRef.current.sendMouseEvent({
        type: 'move',
        x,
        y,
      });
    }
  };

  const handleMouseClick = (e: React.MouseEvent) => {
    if (!hasControl || !isConnected || !webrtcRef.current) return;
    
    const button = e.button === 0 ? 0 : e.button === 2 ? 2 : 1;
    webrtcRef.current.sendMouseEvent({
      type: 'click',
      x: 0,
      y: 0,
      button,
    });
  };

  // 키보드 이벤트 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!hasControl || !isConnected || !webrtcRef.current) return;
    
    webrtcRef.current.sendKeyboardEvent({
      type: 'keypress',
      key: e.key,
      code: e.code,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      metaKey: e.metaKey,
    });
  };

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

  // 파일 전송
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && webrtcRef.current) {
      webrtcRef.current.sendFile(file);
      alert(`파일 "${file.name}" 전송이 시작되었습니다.`);
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
              {isConnected ? '연결됨' : '연결 중...'}
            </span>
          </div>
          <span className="text-gray-400 text-sm">연결 코드: {connectionCode}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="축소"
          >
            <ZoomOut className="text-gray-300" size={20} />
          </button>
          <span className="text-gray-300 text-sm">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="확대"
          >
            <ZoomIn className="text-gray-300" size={20} />
          </button>
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="새로고침"
          >
            <RefreshCw className="text-gray-300" size={20} />
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
        {/* 메인 원격 화면 영역 */}
        <div 
          ref={remoteScreenRef}
          className="flex-1 relative bg-black overflow-auto"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseClick}
          onContextMenu={(e) => {
            e.preventDefault();
            handleMouseClick(e);
          }}
          tabIndex={0}
          onKeyPress={handleKeyPress}
          style={{ cursor: hasControl ? 'crosshair' : 'default' }}
        >
          {isConnected ? (
            <div className="w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="max-w-full max-h-full"
                style={{ transform: `scale(${zoom / 100})` }}
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white text-lg">원격 화면 연결 중...</p>
              </div>
            </div>
          )}

          {/* 제어 상태 표시 */}
          {isConnected && (
            <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-black/70 rounded-lg">
              {hasControl ? (
                <>
                  <MousePointer2 className="text-green-500" size={18} />
                  <span className="text-white text-sm">원격 제어 활성화</span>
                </>
              ) : (
                <>
                  <Keyboard className="text-yellow-500" size={18} />
                  <span className="text-white text-sm">원격 제어 대기 중</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* 사이드바 */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* 제어 패널 */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold mb-4">원격 제어</h3>
            <div className="space-y-3">
              <button
                onClick={() => setHasControl(!hasControl)}
                className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  hasControl
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <MousePointer2 size={18} />
                <span>{hasControl ? '제어 중지' : '제어 시작'}</span>
              </button>
              
              <div className="text-xs text-gray-400">
                {hasControl
                  ? '마우스와 키보드로 원격 컴퓨터를 제어할 수 있습니다.'
                  : '원격 제어를 시작하려면 버튼을 클릭하세요. 상대방의 허가가 필요할 수 있습니다.'}
              </div>
            </div>
          </div>

          {/* 파일 전송 */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <FileText size={18} />
                파일 전송
              </h3>
              <button
                onClick={() => setShowFileTransfer(!showFileTransfer)}
                className="text-gray-400 hover:text-white"
              >
                {showFileTransfer ? '접기' : '펼치기'}
              </button>
            </div>
            
            {showFileTransfer && (
              <div className="space-y-2">
                <label className="block">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer flex items-center justify-center gap-2 text-gray-300">
                    <Upload size={18} />
                    <span>파일 업로드</span>
                  </div>
                </label>
                <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center gap-2 text-gray-300">
                  <Download size={18} />
                  <span>파일 다운로드</span>
                </button>
              </div>
            )}
          </div>

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
        </div>
      </div>
    </div>
  );
}
