'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, MousePointer2, Sparkles } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { BlockItem } from './BlockItem';

export function Canvas() {
  const {
    getCurrentPage,
    moveBlock,
    setDragging,
    isPreviewMode,
    selectBlock,
    setSidebarTab,
  } = useEditorStore();

  const currentPage = getCurrentPage();
  const blocks = currentPage?.blocks || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = () => {
    setDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDragging(false);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      moveBlock(oldIndex, newIndex);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectBlock(null);
    }
  };

  if (isPreviewMode) {
    return (
      <div className="min-h-screen bg-white w-full preview-container">
        {blocks.length === 0 ? (
          <div className="flex items-center justify-center min-h-screen text-center">
            <div>
              <p className="text-gray-400 text-lg mb-2">콘텐츠가 없습니다</p>
              <p className="text-gray-300 text-sm">블록을 추가하여 시작하세요</p>
            </div>
          </div>
        ) : (
          <div>
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className="preview-block-item"
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <BlockItem block={block} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="canvas-area p-8 relative"
        onClick={handleCanvasClick}
      >
        {blocks.length === 0 ? (
          <EmptyCanvasState onAddBlock={() => setSidebarTab('blocks')} />
        ) : (
          <SortableContext
            items={blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              <AnimatePresence>
                {blocks.map((block, index) => (
                  <BlockItem key={block.id} block={block} index={index} />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        )}

        {/* 빈 영역 드롭 인디케이터 */}
        {blocks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 border-2 border-dashed border-primary-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all"
            onClick={() => setSidebarTab('blocks')}
          >
            <Plus className="mx-auto text-primary-400 mb-2" size={24} />
            <p className="text-primary-500 font-medium">새 블록 추가</p>
          </motion.div>
        )}
      </div>
    </DndContext>
  );
}

function EmptyCanvasState({ onAddBlock }: { onAddBlock: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[500px] text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-pastel-lavender via-pastel-sky to-pastel-mint rounded-3xl flex items-center justify-center mb-6 animate-float">
        <Sparkles className="text-primary-500" size={48} />
      </div>
      <h3 className="text-2xl font-display font-bold text-gray-800 mb-3">
        웹사이트 만들기 시작!
      </h3>
      <p className="text-gray-500 mb-8 max-w-md">
        왼쪽 패널에서 블록을 선택하여 추가하거나,
        AI에게 원하는 페이지를 설명해보세요.
      </p>
      <div className="flex gap-4">
        <button
          onClick={onAddBlock}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          블록 추가하기
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <MousePointer2 size={20} />
          AI에게 요청하기
        </button>
      </div>
    </motion.div>
  );
}

