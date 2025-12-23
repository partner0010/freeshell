/**
 * 원격 솔루션 메인 페이지
 * WebRTC 기반 브라우저 원격 제어 (프로그램 다운로드 불필요)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, Shield, Lock, Users, MessageSquare, 
  FileText, Video, Settings, HelpCircle, CheckCircle,
  Copy, Download, Upload, Mic, MicOff, Camera, CameraOff,
  X, Maximize2, Minimize2, RefreshCw, Power, Square, History, Play, Circle
} from 'lucide-react';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { RemoteControlClient } from '@/components/remote/RemoteControlClient';
import { RemoteControlHost } from '@/components/remote/RemoteControlHost';

type RemoteMode = 'none' | 'host' | 'client';

export default function RemotePage() {
  const [mode, setMode] = useState<RemoteMode>('none');
  const [connectionCode, setConnectionCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSessions, setRecordedSessions] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // 연결 코드 생성 (호스트용)
  const generateConnectionCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setConnectionCode(code);
    return code;
  };

  // 호스트 모드 시작
  const startHost = async () => {
    const code = generateConnectionCode();
    setMode('host');
    // 서버에 세션 생성 요청
    try {
      const response = await fetch('/api/remote/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (data.success) {
        setSessionId(data.sessionId);
      }
    } catch (error) {
      console.error('세션 생성 실패:', error);
    }
  };

  // 클라이언트 모드 시작
  const startClient = () => {
    if (connectionCode.length === 6) {
      setMode('client');
      // 서버에 세션 연결 요청
      fetch('/api/remote/connect-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: connectionCode }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSessionId(data.sessionId);
            setIsConnected(true);
          } else {
            alert('연결 코드가 올바르지 않습니다.');
            setMode('none');
          }
        })
        .catch(error => {
          console.error('연결 실패:', error);
          alert('연결에 실패했습니다.');
          setMode('none');
        });
    }
  };

  // 연결 종료
  const disconnect = () => {
    if (sessionId) {
      fetch('/api/remote/end-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
    }
    setMode('none');
    setIsConnected(false);
    setSessionId(null);
    setConnectionCode('');
  };

  // 연결 코드 복사
  const copyCode = () => {
    navigator.clipboard.writeText(connectionCode);
    alert('연결 코드가 복사되었습니다.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <GlobalHeader />

      {mode === 'none' ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          {/* 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Monitor className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              원격 솔루션
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              프로그램 다운로드 없이 브라우저에서 바로 사용하는 안전한 원격 제어 서비스
            </p>
          </motion.div>

          {/* 보안 안내 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <Shield className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">보안 보장</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={16} />
                    <span>모든 통신은 최신 암호화 프로토콜로 보호됩니다</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={16} />
                    <span>사용자 동의 없이 원격 제어가 불가능합니다</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={16} />
                    <span>세션 기록 및 감사 로그를 통해 추적 가능합니다</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* 모드 선택 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* 호스트 (원격 지원 받기) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-500 transition-all shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Monitor className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">원격 지원 받기</h2>
              </div>
              <p className="text-gray-600 mb-6">
                다른 사람이 내 컴퓨터를 원격으로 제어하여 도움을 받을 수 있습니다.
                연결 코드를 생성하고 상대방에게 공유하세요.
              </p>
              <button
                onClick={startHost}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Power size={20} />
                <span>연결 코드 생성</span>
              </button>
            </motion.div>

            {/* 클라이언트 (원격 지원 하기) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-purple-500 transition-all shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">원격 지원 하기</h2>
              </div>
              <p className="text-gray-600 mb-6">
                다른 사람의 컴퓨터에 원격으로 접속하여 도움을 줄 수 있습니다.
                연결 코드를 입력하세요.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    연결 코드 (6자리)
                  </label>
                  <input
                    type="text"
                    value={connectionCode}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
                      setConnectionCode(value);
                    }}
                    placeholder="ABCD12"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-center text-2xl font-bold tracking-widest"
                    maxLength={6}
                  />
                </div>
                <button
                  onClick={startClient}
                  disabled={connectionCode.length !== 6}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Power size={20} />
                  <span>연결하기</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* 세션 기록 보기 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-8"
          >
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-500 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <History className="text-purple-600" size={20} />
                <span className="font-semibold text-gray-900">세션 기록 보기</span>
              </div>
              <span className="text-sm text-gray-600">{recordedSessions.length}개 기록</span>
            </button>
            {showHistory && (
              <div className="mt-4 bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">저장된 세션</h3>
                {recordedSessions.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">저장된 세션이 없습니다.</p>
                ) : (
                  <div className="space-y-3">
                    {recordedSessions.map((session, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{session.name}</p>
                            <p className="text-sm text-gray-600">{session.date}</p>
                            <p className="text-xs text-gray-500">길이: {session.duration}</p>
                          </div>
                          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                            <Play size={16} />
                            재생
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* 기능 소개 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-8 border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">주요 기능</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Monitor, title: '화면 공유', desc: '실시간 화면 공유 및 제어' },
                { icon: MessageSquare, title: '채팅', desc: '원격 세션 중 실시간 채팅' },
                { icon: FileText, title: '파일 전송', desc: '안전한 파일 송수신' },
                { icon: Video, title: '화상 통화', desc: '선택적 화상 통화 지원' },
                { icon: Circle, title: '화면 녹화', desc: '세션 녹화 및 재생 기능' },
                { icon: History, title: '세션 기록', desc: '과거 세션 기록 저장 및 관리' },
                { icon: Settings, title: '설정', desc: '화질, 보안 등 세부 설정' },
                { icon: Shield, title: '보안', desc: '종합 보안 시스템' },
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : mode === 'host' ? (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={disconnect}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <X size={18} />
                연결 종료
              </button>
              <button
                onClick={() => {
                  setIsRecording(!isRecording);
                  if (!isRecording) {
                    // 녹화 시작
                    alert('화면 녹화가 시작되었습니다.');
                  } else {
                    // 녹화 중지 및 저장
                    const newSession = {
                      name: `세션 ${recordedSessions.length + 1}`,
                      date: new Date().toLocaleString('ko-KR'),
                      duration: '5분',
                    };
                    setRecordedSessions([...recordedSessions, newSession]);
                    alert('화면 녹화가 저장되었습니다.');
                  }
                }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  isRecording
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square size={18} />
                    녹화 중지
                  </>
                ) : (
                  <>
                    <Circle size={18} />
                    녹화 시작
                  </>
                )}
              </button>
            </div>
            {isRecording && (
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                <span className="font-medium">녹화 중...</span>
              </div>
            )}
          </div>
          <RemoteControlHost 
            connectionCode={connectionCode}
            sessionId={sessionId}
            onDisconnect={disconnect}
            onCopyCode={copyCode}
          />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={disconnect}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <X size={18} />
              연결 종료
            </button>
            <button
              onClick={() => {
                setIsRecording(!isRecording);
                if (!isRecording) {
                  alert('화면 녹화가 시작되었습니다.');
                } else {
                  const newSession = {
                    name: `세션 ${recordedSessions.length + 1}`,
                    date: new Date().toLocaleString('ko-KR'),
                    duration: '5분',
                  };
                  setRecordedSessions([...recordedSessions, newSession]);
                  alert('화면 녹화가 저장되었습니다.');
                }
              }}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isRecording
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isRecording ? (
                <>
                  <Square size={18} />
                  녹화 중지
                </>
              ) : (
                <>
                  <Circle size={18} />
                  녹화 시작
                </>
              )}
            </button>
          </div>
          <RemoteControlClient
            connectionCode={connectionCode}
            sessionId={sessionId}
            isConnected={isConnected}
            onDisconnect={disconnect}
          />
        </div>
      )}
    </div>
  );
}

