'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { History, RotateCcw, RotateCw, Clock, Trash2, Plus, Edit, Move, Copy } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

interface HistoryEntry {
  id: string;
  action: 'add' | 'delete' | 'edit' | 'move' | 'duplicate' | 'style';
  blockType?: string;
  timestamp: Date;
  description: string;
}

export function HistoryPanel() {
  const { history, historyIndex, undo, redo } = useEditorStore();

  // 히스토리 항목 생성 (데모용)
  const historyEntries: HistoryEntry[] = history.map((_, i) => ({
    id: `history-${i}`,
    action: ['add', 'edit', 'move', 'delete', 'style'][Math.floor(Math.random() * 5)] as HistoryEntry['action'],
    blockType: ['hero', 'header', 'features', 'cta', 'footer'][Math.floor(Math.random() * 5)],
    timestamp: new Date(Date.now() - (history.length - i) * 60000),
    description: getActionDescription(
      ['add', 'edit', 'move', 'delete', 'style'][Math.floor(Math.random() * 5)] as HistoryEntry['action'],
      ['hero', 'header', 'features', 'cta', 'footer'][Math.floor(Math.random() * 5)]
    ),
  }));

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const getActionIcon = (action: HistoryEntry['action']) => {
    switch (action) {
      case 'add':
        return Plus;
      case 'delete':
        return Trash2;
      case 'edit':
        return Edit;
      case 'move':
        return Move;
      case 'duplicate':
        return Copy;
      case 'style':
        return Edit;
      default:
        return Clock;
    }
  };

  const getActionColor = (action: HistoryEntry['action']) => {
    switch (action) {
      case 'add':
        return 'text-green-500 bg-green-50';
      case 'delete':
        return 'text-red-500 bg-red-50';
      case 'edit':
        return 'text-blue-500 bg-blue-50';
      case 'move':
        return 'text-purple-500 bg-purple-50';
      case 'duplicate':
        return 'text-orange-500 bg-orange-50';
      case 'style':
        return 'text-pink-500 bg-pink-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
          <History className="text-white" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">히스토리</h3>
          <p className="text-xs text-gray-500">변경 이력 관리</p>
        </div>
      </div>

      {/* Undo/Redo 버튼 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`
            flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm transition-colors
            ${canUndo 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-gray-50 text-gray-300 cursor-not-allowed'
            }
          `}
        >
          <RotateCcw size={16} />
          실행 취소
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`
            flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm transition-colors
            ${canRedo 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-gray-50 text-gray-300 cursor-not-allowed'
            }
          `}
        >
          <RotateCw size={16} />
          다시 실행
        </button>
      </div>

      {/* 히스토리 타임라인 */}
      <div className="flex-1 overflow-y-auto">
        {historyEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Clock size={48} className="mb-4 opacity-50" />
            <p className="text-sm">변경 이력이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-1">
            {historyEntries.map((entry, i) => {
              const Icon = getActionIcon(entry.action);
              const colorClass = getActionColor(entry.action);
              const isCurrent = i === historyIndex;
              const isPast = i < historyIndex;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`
                    relative flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors
                    ${isCurrent ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50'}
                    ${isPast ? 'opacity-50' : ''}
                  `}
                >
                  {/* 타임라인 라인 */}
                  {i < historyEntries.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200" />
                  )}

                  {/* 아이콘 */}
                  <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${colorClass}`}>
                    <Icon size={12} />
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {entry.description}
                    </p>
                    <p className="text-xs text-gray-400">{formatTime(entry.timestamp)}</p>
                  </div>

                  {/* 현재 위치 표시 */}
                  {isCurrent && (
                    <span className="text-xs text-primary-600 font-medium">현재</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 통계 */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between text-sm text-gray-500">
          <span>총 {history.length}개 변경</span>
          <span>현재 위치: {historyIndex + 1}</span>
        </div>
      </div>
    </div>
  );
}

function getActionDescription(action: HistoryEntry['action'], blockType?: string): string {
  const blockName = blockType ? getBlockName(blockType) : '블록';
  
  switch (action) {
    case 'add':
      return `${blockName} 추가됨`;
    case 'delete':
      return `${blockName} 삭제됨`;
    case 'edit':
      return `${blockName} 내용 수정`;
    case 'move':
      return `${blockName} 위치 변경`;
    case 'duplicate':
      return `${blockName} 복제됨`;
    case 'style':
      return `${blockName} 스타일 변경`;
    default:
      return '변경됨';
  }
}

function getBlockName(type: string): string {
  const names: Record<string, string> = {
    hero: '히어로',
    header: '헤더',
    footer: '푸터',
    features: '기능 소개',
    cta: 'CTA',
    pricing: '가격표',
    testimonials: '후기',
    contact: '연락처',
    text: '텍스트',
    image: '이미지',
  };
  return names[type] || type;
}

