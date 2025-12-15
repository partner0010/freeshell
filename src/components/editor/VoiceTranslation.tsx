'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Languages,
  X,
  Maximize2,
  Minimize2,
  Move,
  FileText,
  Download,
  Save,
} from 'lucide-react';

interface VoiceMemo {
  id: string;
  text: string;
  originalText?: string;
  originalLanguage: string;
  translatedLanguage: string;
  timestamp: number;
  x: number;
  y: number;
  opacity: number;
  position: 'relative' | 'fixed';
}

interface VoiceTranslationProps {
  onSave?: (memos: VoiceMemo[]) => void;
  onExport?: (memos: VoiceMemo[]) => void;
}

export function VoiceTranslation({ onSave, onExport }: VoiceTranslationProps) {
  const [isListening, setIsListening] = useState(false);
  const [inputLanguage, setInputLanguage] = useState<string>('ko-KR');
  const [outputLanguage, setOutputLanguage] = useState<string>('en-US');
  const [memos, setMemos] = useState<VoiceMemo[]>([]);
  const [currentMemo, setCurrentMemo] = useState<VoiceMemo | null>(null);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [draggedMemo, setDraggedMemo] = useState<{ x: number; y: number } | null>(null);
  const [opacity, setOpacity] = useState(0.8);
  const [isExpanded, setIsExpanded] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Web Speech API 초기화
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Speech Recognition (음성 인식)
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = inputLanguage;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          handleTranslation(finalTranscript.trim());
        } else if (interimTranscript) {
          // 실시간 미리보기
          if (currentMemo) {
            setCurrentMemo({
              ...currentMemo,
              text: interimTranscript,
            });
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start(); // 계속 듣기
        }
      };

      recognitionRef.current = recognition;
    }

    // Speech Synthesis (음성 합성)
    synthesisRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [inputLanguage, isListening]);

  // 번역 함수 (실제로는 API 호출 필요)
  const handleTranslation = async (text: string) => {
    try {
      // 실제로는 Google Translate API, Papago API 등을 사용
      // 여기서는 시뮬레이션
      const translatedText = await translateText(text, inputLanguage, outputLanguage);

      const newMemo: VoiceMemo = {
        id: `memo-${Date.now()}`,
        text: translatedText,
        originalText: text,
        originalLanguage: inputLanguage,
        translatedLanguage: outputLanguage,
        timestamp: Date.now(),
        x: window.innerWidth / 2 - 150,
        y: window.innerHeight / 2,
        opacity: opacity,
        position: 'fixed',
      };

      setMemos((prev) => [...prev, newMemo]);
      setCurrentMemo(null);

      // TTS로 읽기 (선택사항)
      if (synthesisRef.current) {
        const utterance = new SpeechSynthesisUtterance(translatedText);
        utterance.lang = outputLanguage;
        synthesisRef.current.speak(utterance);
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  // 번역 API 호출
  const translateText = async (
    text: string,
    from: string,
    to: string
  ): Promise<string> => {
    try {
      // Google Translate API 또는 Papago API 사용
      // 여기서는 클라이언트 사이드 번역 시뮬레이션
      // 실제로는 서버 API 엔드포인트를 통해 호출해야 함
      
      // 간단한 번역 시뮬레이션 (실제로는 API 호출)
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          source: from.split('-')[0],
          target: to.split('-')[0],
        }),
      }).catch(() => null);

      if (response?.ok) {
        const data = await response.json();
        return data.translatedText || text;
      }

      // API 호출 실패 시 원본 텍스트 반환
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  // 음성 인식 시작/중지
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = inputLanguage;
      recognitionRef.current.start();
      setIsListening(true);

      // 새 메모 시작
      setCurrentMemo({
        id: `current-${Date.now()}`,
        text: '',
        originalLanguage: inputLanguage,
        translatedLanguage: outputLanguage,
        timestamp: Date.now(),
        x: window.innerWidth / 2 - 150,
        y: window.innerHeight / 2,
        opacity: opacity,
        position: 'fixed',
      });
    }
  };

  // 메모 드래그 시작
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, memoId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(memoId);
    const point = getPointFromEvent(e);
    if (point) {
      const memo = memos.find((m) => m.id === memoId);
      if (memo) {
        setDraggedMemo({ x: point.x - memo.x, y: point.y - memo.y });
      }
    }
  };

  // 메모 드래그 중
  useEffect(() => {
    if (!isDragging) return;

    const handleDrag = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;

      if (clientX !== undefined && clientY !== undefined && draggedMemo) {
        setMemos((prev) =>
          prev.map((memo) =>
            memo.id === isDragging
              ? {
                  ...memo,
                  x: clientX - draggedMemo.x,
                  y: clientY - draggedMemo.y,
                }
              : memo
          )
        );
      }
    };

    const handleDragEnd = () => {
      setIsDragging(null);
      setDraggedMemo(null);
    };

    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDrag);
    window.addEventListener('touchend', handleDragEnd);

    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, draggedMemo]);

  // 이벤트 포인트 가져오기
  const getPointFromEvent = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
    return { x: clientX, y: clientY };
  };

  // 메모 삭제
  const deleteMemo = (id: string) => {
    setMemos((prev) => prev.filter((m) => m.id !== id));
  };

  // 메모 불투명도 조절
  const updateMemoOpacity = (id: string, newOpacity: number) => {
    setMemos((prev) =>
      prev.map((m) => (m.id === id ? { ...m, opacity: newOpacity } : m))
    );
  };

  // 전체 메모 저장
  const handleSave = () => {
    if (onSave) {
      onSave(memos);
    }
  };

  // 메모 내보내기
  const handleExport = () => {
    if (onExport) {
      onExport(memos);
    } else {
      // 기본 내보내기 (JSON)
      const dataStr = JSON.stringify(memos, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `voice-memos-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const languages = [
    { code: 'ko-KR', name: '한국어' },
    { code: 'en-US', name: '영어' },
    { code: 'ja-JP', name: '일본어' },
    { code: 'zh-CN', name: '중국어' },
    { code: 'es-ES', name: '스페인어' },
    { code: 'fr-FR', name: '프랑스어' },
    { code: 'de-DE', name: '독일어' },
  ];

  return (
    <>
      {/* 음성 인식 컨트롤 패널 */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`fixed ${isExpanded ? 'bottom-4 left-4 right-4' : 'bottom-4 right-4'} z-[150] bg-white rounded-xl shadow-2xl border max-w-md`}
      >
        {/* 헤더 */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="text-primary-600" size={20} />
            <h3 className="font-bold text-gray-800">음성 번역 메모</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        {/* 컨트롤 */}
        <div className="p-4 space-y-3">
          {/* 언어 선택 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">입력 언어</label>
              <select
                value={inputLanguage}
                onChange={(e) => setInputLanguage(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                disabled={isListening}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">출력 언어</label>
              <select
                value={outputLanguage}
                onChange={(e) => setOutputLanguage(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 불투명도 */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              메모 불투명도: {Math.round(opacity * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => {
                const newOpacity = Number(e.target.value);
                setOpacity(newOpacity);
                setMemos((prev) => prev.map((m) => ({ ...m, opacity: newOpacity })));
              }}
              className="w-full"
            />
          </div>

          {/* 음성 인식 버튼 */}
          <button
            onClick={toggleListening}
            className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              isListening
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isListening ? (
              <>
                <MicOff size={20} />
                음성 인식 중지
              </>
            ) : (
              <>
                <Mic size={20} />
                음성 인식 시작
              </>
            )}
          </button>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
            >
              <Save size={16} />
              저장
            </button>
            <button
              onClick={handleExport}
              className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
            >
              <Download size={16} />
              내보내기
            </button>
          </div>
        </div>
      </motion.div>

      {/* 현재 인식 중인 메모 */}
      <AnimatePresence>
        {currentMemo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: currentMemo.opacity, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: currentMemo.position,
              left: currentMemo.x,
              top: currentMemo.y,
              zIndex: 1000,
            }}
            className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 shadow-lg max-w-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-gray-800">{currentMemo.text || '듣는 중...'}</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 저장된 메모들 */}
      {memos.map((memo) => (
        <motion.div
          key={memo.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: memo.opacity, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: memo.position,
            left: memo.x,
            top: memo.y,
            zIndex: 999,
          }}
          className="bg-white border-2 border-primary-300 rounded-lg p-3 shadow-lg max-w-xs cursor-move"
          onMouseDown={(e) => handleDragStart(e, memo.id)}
          onTouchStart={(e) => handleDragStart(e, memo.id)}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Move size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500">
                {new Date(memo.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <button
              onClick={() => deleteMemo(memo.id)}
              className="p-1 hover:bg-red-100 rounded text-red-600"
            >
              <X size={14} />
            </button>
          </div>
          {memo.originalText && (
            <p className="text-xs text-gray-500 mb-1 italic">({memo.originalText})</p>
          )}
          <p className="text-sm text-gray-800">{memo.text}</p>
          <div className="mt-2 pt-2 border-t flex items-center gap-2">
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={memo.opacity}
              onChange={(e) => updateMemoOpacity(memo.id, Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs text-gray-500">{Math.round(memo.opacity * 100)}%</span>
          </div>
        </motion.div>
      ))}
    </>
  );
}

