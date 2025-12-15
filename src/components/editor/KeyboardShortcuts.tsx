'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Command, Keyboard } from 'lucide-react';

interface KeyboardShortcutsProps {
  onClose: () => void;
}

const shortcuts = [
  {
    category: '기본 조작',
    items: [
      { keys: ['Ctrl', 'Z'], description: '실행 취소 (Undo)' },
      { keys: ['Ctrl', 'Y'], description: '다시 실행 (Redo)' },
      { keys: ['Ctrl', 'S'], description: '프로젝트 저장' },
      { keys: ['Ctrl', 'C'], description: '블록 복사' },
      { keys: ['Ctrl', 'V'], description: '블록 붙여넣기' },
      { keys: ['Delete'], description: '선택된 블록 삭제' },
    ],
  },
  {
    category: '블록 편집',
    items: [
      { keys: ['Enter'], description: '블록 편집 모드 진입' },
      { keys: ['Escape'], description: '선택 해제 / 편집 취소' },
      { keys: ['↑'], description: '이전 블록 선택' },
      { keys: ['↓'], description: '다음 블록 선택' },
      { keys: ['Ctrl', 'D'], description: '블록 복제' },
    ],
  },
  {
    category: '뷰 전환',
    items: [
      { keys: ['Ctrl', 'P'], description: '미리보기 토글' },
      { keys: ['Ctrl', '1'], description: '데스크톱 뷰' },
      { keys: ['Ctrl', '2'], description: '태블릿 뷰' },
      { keys: ['Ctrl', '3'], description: '모바일 뷰' },
    ],
  },
  {
    category: '패널',
    items: [
      { keys: ['Ctrl', 'B'], description: '블록 패널 열기' },
      { keys: ['Ctrl', 'E'], description: '스타일 패널 열기' },
      { keys: ['Ctrl', 'I'], description: 'AI 어시스턴트 열기' },
      { keys: ['Ctrl', '/'], description: '도움말 열기' },
    ],
  },
];

export function KeyboardShortcuts({ onClose }: KeyboardShortcutsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
              <Keyboard className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-gray-800">키보드 단축키</h2>
              <p className="text-sm text-gray-500">빠른 작업을 위한 단축키 모음</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* 단축키 목록 */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          <div className="grid md:grid-cols-2 gap-8">
            {shortcuts.map((section, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  {section.category}
                </h3>
                <div className="space-y-3">
                  {section.items.map((shortcut, j) => (
                    <div
                      key={j}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-gray-700">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, k) => (
                          <React.Fragment key={k}>
                            <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono text-gray-600 shadow-sm">
                              {key === 'Ctrl' && (
                                <span className="flex items-center gap-0.5">
                                  <Command size={12} />
                                </span>
                              )}
                              {key !== 'Ctrl' && key}
                            </kbd>
                            {k < shortcut.keys.length - 1 && (
                              <span className="text-gray-400 text-xs">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-4 border-t bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            Mac에서는 <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Ctrl</kbd>를 
            <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs ml-1">⌘ Cmd</kbd>로 대체하세요
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

