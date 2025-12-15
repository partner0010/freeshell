'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, Copy, Trash2, Settings, Lock, Unlock } from 'lucide-react';
import { Block } from '@/types';
import { useEditorStore } from '@/store/editor-store';
import { BlockRenderer } from './BlockRenderer';

interface BlockItemProps {
  block: Block;
  index: number;
}

export function BlockItem({ block, index }: BlockItemProps) {
  const {
    selectedBlockId,
    hoveredBlockId,
    selectBlock,
    hoverBlock,
    deleteBlock,
    duplicateBlock,
    updateBlock,
    isPreviewMode,
  } = useEditorStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedBlockId === block.id;
  const isHovered = hoveredBlockId === block.id;

  if (isPreviewMode) {
    return <BlockRenderer block={block} isPreview />;
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={`
        relative group
        ${isDragging ? 'z-50 shadow-glow scale-105' : ''}
        ${isSelected ? 'ring-2 ring-primary-400 ring-offset-2' : ''}
        ${isHovered && !isSelected ? 'ring-2 ring-primary-200 ring-offset-1' : ''}
        transition-all duration-200
      `}
      onClick={() => selectBlock(block.id)}
      onMouseEnter={() => hoverBlock(block.id)}
      onMouseLeave={() => hoverBlock(null)}
    >
      {/* 블록 컨트롤 */}
      <div
        className={`
          absolute -left-12 top-1/2 -translate-y-1/2
          flex flex-col gap-1 p-1 bg-white rounded-xl shadow-soft
          opacity-0 group-hover:opacity-100 transition-opacity
          ${isDragging ? 'opacity-0' : ''}
        `}
      >
        <button
          {...attributes}
          {...listeners}
          className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg cursor-grab active:cursor-grabbing"
          title="드래그하여 이동"
        >
          <GripVertical size={16} />
        </button>
      </div>

      {/* 블록 액션 버튼들 */}
      <div
        className={`
          absolute -right-12 top-1/2 -translate-y-1/2
          flex flex-col gap-1 p-1 bg-white rounded-xl shadow-soft
          opacity-0 group-hover:opacity-100 transition-opacity
          ${isDragging ? 'opacity-0' : ''}
        `}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            duplicateBlock(block.id);
          }}
          className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg"
          title="복제"
        >
          <Copy size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            updateBlock(block.id, { locked: !block.locked });
          }}
          className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg"
          title={block.locked ? '잠금 해제' : '잠금'}
        >
          {block.locked ? <Lock size={16} /> : <Unlock size={16} />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteBlock(block.id);
          }}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
          title="삭제"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* 블록 타입 라벨 */}
      <div
        className={`
          absolute -top-3 left-4 px-2 py-0.5
          text-xs font-medium text-primary-600 bg-primary-100 rounded-full
          opacity-0 group-hover:opacity-100 transition-opacity
          ${isDragging ? 'opacity-0' : ''}
        `}
      >
        {block.type}
      </div>

      {/* 블록 콘텐츠 */}
      <div className={`
        relative overflow-hidden rounded-xl
        ${block.locked ? 'pointer-events-none opacity-80' : ''}
      `}>
        <BlockRenderer block={block} />
        
        {/* 잠금 오버레이 */}
        {block.locked && (
          <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center">
            <Lock className="text-gray-400" size={24} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

