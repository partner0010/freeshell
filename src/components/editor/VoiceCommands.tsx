'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  Settings,
  HelpCircle,
  Check,
  X,
  Loader2,
  ChevronRight,
} from 'lucide-react';

interface VoiceCommand {
  command: string;
  description: string;
  example: string;
}

const voiceCommands: VoiceCommand[] = [
  { command: '블록 추가', description: '새 블록을 추가합니다', example: '"히어로 블록 추가해줘"' },
  { command: '색상 변경', description: '배경색이나 텍스트 색상을 변경합니다', example: '"배경색 파란색으로 바꿔줘"' },
  { command: '텍스트 수정', description: '선택된 텍스트를 수정합니다', example: '"제목을 환영합니다로 바꿔줘"' },
  { command: '블록 삭제', description: '선택된 블록을 삭제합니다', example: '"이 블록 삭제해줘"' },
  { command: '블록 복제', description: '선택된 블록을 복제합니다', example: '"이거 복사해줘"' },
  { command: '실행 취소', description: '마지막 작업을 취소합니다', example: '"취소해줘"' },
  { command: '미리보기', description: '미리보기 모드를 켭니다', example: '"미리보기 보여줘"' },
  { command: '저장', description: '프로젝트를 저장합니다', example: '"저장해줘"' },
];

export default function VoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [commandStatus, setCommandStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [showHelp, setShowHelp] = useState(false);
  const [language, setLanguage] = useState<'ko-KR' | 'en-US'>('ko-KR');

  // 음성 인식 지원 여부 확인
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    }
  }, []);

  // 음성 인식 시작/중지
  const toggleListening = useCallback(() => {
    if (!isSupported) return;

    if (isListening) {
      setIsListening(false);
      setTranscript('');
    } else {
      setIsListening(true);
      setTranscript('');
      setCommandStatus('idle');

      // Web Speech API 사용 (실제 구현)
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const result = event.results[0];
        const text = result[0].transcript;
        setTranscript(text);

        if (result.isFinal) {
          processCommand(text);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setCommandStatus('error');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  }, [isListening, isSupported, language]);

  // 명령어 처리
  const processCommand = async (text: string) => {
    setCommandStatus('processing');
    setLastCommand(text);

    // 명령어 매칭 (간단한 예시)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('추가') || lowerText.includes('add')) {
      // 블록 추가 로직
      setCommandStatus('success');
    } else if (lowerText.includes('삭제') || lowerText.includes('delete')) {
      // 삭제 로직
      setCommandStatus('success');
    } else if (lowerText.includes('저장') || lowerText.includes('save')) {
      // 저장 로직
      setCommandStatus('success');
    } else if (lowerText.includes('취소') || lowerText.includes('undo')) {
      // 실행 취소
      setCommandStatus('success');
    } else {
      setCommandStatus('error');
    }

    setTimeout(() => setCommandStatus('idle'), 3000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b bg-gradient-to-r from-green-500 to-teal-500">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Mic size={18} />
          음성 명령
        </h3>
        <p className="text-sm text-white/80 mt-1">말로 웹사이트를 편집하세요</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {!isSupported && (
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm">
            ⚠️ 이 브라우저는 음성 인식을 지원하지 않습니다. Chrome을 사용해주세요.
          </div>
        )}

        {/* 마이크 버튼 */}
        <div className="flex flex-col items-center py-8">
          <motion.button
            onClick={toggleListening}
            disabled={!isSupported}
            animate={{
              scale: isListening ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: isListening ? Infinity : 0,
            }}
            className={`
              w-32 h-32 rounded-full flex items-center justify-center
              transition-all shadow-lg
              ${isListening
                ? 'bg-gradient-to-br from-red-500 to-pink-500'
                : 'bg-gradient-to-br from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isListening ? (
              <MicOff size={48} className="text-white" />
            ) : (
              <Mic size={48} className="text-white" />
            )}
          </motion.button>
          
          <p className="text-gray-500 mt-4">
            {isListening ? '듣고 있습니다...' : '마이크를 클릭하세요'}
          </p>

          {/* 음성 파형 애니메이션 */}
          {isListening && (
            <div className="flex items-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [16, 32, 16],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  className="w-2 bg-green-500 rounded-full"
                />
              ))}
            </div>
          )}
        </div>

        {/* 인식된 텍스트 */}
        {transcript && (
          <div className="bg-gray-100 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">인식된 음성:</p>
            <p className="text-gray-800 font-medium">"{transcript}"</p>
          </div>
        )}

        {/* 명령 상태 */}
        <AnimatePresence>
          {commandStatus !== 'idle' && lastCommand && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl flex items-center gap-3 ${
                commandStatus === 'processing' ? 'bg-blue-50' :
                commandStatus === 'success' ? 'bg-green-50' :
                'bg-red-50'
              }`}
            >
              {commandStatus === 'processing' && (
                <>
                  <Loader2 className="text-blue-500 animate-spin" size={20} />
                  <span className="text-blue-700">명령 처리 중...</span>
                </>
              )}
              {commandStatus === 'success' && (
                <>
                  <Check className="text-green-500" size={20} />
                  <span className="text-green-700">명령이 실행되었습니다</span>
                </>
              )}
              {commandStatus === 'error' && (
                <>
                  <X className="text-red-500" size={20} />
                  <span className="text-red-700">명령을 인식하지 못했습니다</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 언어 설정 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">언어</p>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('ko-KR')}
              className={`flex-1 py-2 rounded-lg text-sm ${
                language === 'ko-KR'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              🇰🇷 한국어
            </button>
            <button
              onClick={() => setLanguage('en-US')}
              className={`flex-1 py-2 rounded-lg text-sm ${
                language === 'en-US'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              🇺🇸 English
            </button>
          </div>
        </div>

        {/* 명령어 도움말 */}
        <div>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100"
          >
            <span className="flex items-center gap-2 text-sm text-gray-700">
              <HelpCircle size={16} />
              사용 가능한 명령어
            </span>
            <ChevronRight
              size={16}
              className={`text-gray-400 transition-transform ${showHelp ? 'rotate-90' : ''}`}
            />
          </button>
          
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-2"
              >
                {voiceCommands.map((cmd, i) => (
                  <div key={i} className="p-3 bg-white rounded-lg border">
                    <p className="font-medium text-gray-800 text-sm">{cmd.command}</p>
                    <p className="text-xs text-gray-500">{cmd.description}</p>
                    <p className="text-xs text-primary-600 mt-1">{cmd.example}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

