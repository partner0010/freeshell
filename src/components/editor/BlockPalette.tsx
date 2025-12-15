'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { blockTemplates } from '@/data/block-templates';
import { advancedBlockTemplates } from '@/data/advanced-blocks';

// 기본 블록과 고급 블록 합치기
const allBlockTemplates = [...blockTemplates, ...advancedBlockTemplates];

const getBlocksByCategory = (category: string) => {
  return allBlockTemplates.filter(template => template.category === category);
};
import { useEditorStore } from '@/store/editor-store';
import { Block, BlockTemplate } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const categories = [
  { id: 'layout', name: '레이아웃', icon: 'Layout' },
  { id: 'content', name: '콘텐츠', icon: 'FileText' },
  { id: 'media', name: '미디어', icon: 'Image' },
  { id: 'commerce', name: '커머스', icon: 'ShoppingBag' },
  { id: 'utility', name: '유틸리티', icon: 'Settings' },
] as const;

export function BlockPalette() {
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]['id']>('layout');
  const [searchQuery, setSearchQuery] = useState('');
  const { addBlock } = useEditorStore();

  const filteredBlocks = searchQuery
    ? allBlockTemplates.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : getBlocksByCategory(activeCategory);

  const handleAddBlock = (template: BlockTemplate) => {
    const newBlock: Block = {
      id: uuidv4(),
      type: template.type,
      content: JSON.parse(JSON.stringify(template.defaultContent)),
      styles: JSON.parse(JSON.stringify(template.defaultStyles)),
    };
    addBlock(newBlock);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 검색 */}
      <div className="relative mb-4">
        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="블록 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* 카테고리 탭 */}
      {!searchQuery && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const IconComponent = Icons[cat.icon as keyof typeof Icons] as React.ComponentType<{ size?: number }>;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                  transition-all duration-200
                  ${activeCategory === cat.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:bg-gray-100'
                  }
                `}
              >
                {IconComponent && <IconComponent size={16} />}
                {cat.name}
              </button>
            );
          })}
        </div>
      )}

      {/* 블록 목록 */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={searchQuery || activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 gap-3"
          >
            {filteredBlocks.map((template) => {
              const IconComponent = Icons[template.icon as keyof typeof Icons] as React.ComponentType<{ className?: string; size?: number }>;
              return (
                <motion.button
                  key={template.type}
                  onClick={() => handleAddBlock(template)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    flex flex-col items-center gap-2 p-4
                    bg-white rounded-xl border-2 border-surface-border
                    hover:border-primary-300 hover:shadow-soft
                    transition-all duration-200 text-left
                  "
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-pastel-lavender to-pastel-sky rounded-lg flex items-center justify-center">
                    {IconComponent && <IconComponent className="text-primary-600" size={20} />}
                  </div>
                  <div className="w-full text-center">
                    <p className="font-medium text-gray-800 text-sm">{template.name}</p>
                    <p className="text-xs text-gray-400 truncate">{template.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filteredBlocks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Icons.Package size={48} className="mb-4" />
            <p>검색 결과가 없습니다</p>
          </div>
        )}
      </div>

      {/* 드래그 힌트 */}
      <div className="mt-4 p-3 bg-pastel-mint/50 rounded-xl">
        <p className="text-xs text-gray-600 flex items-center gap-2">
          <Icons.Info size={14} />
          클릭하여 블록을 추가하세요
        </p>
      </div>
    </div>
  );
}

