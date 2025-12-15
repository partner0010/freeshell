'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { pageTemplates, templateCategories, generateBlocksFromTemplate, PageTemplate } from '@/data/templates';
import { useEditorStore } from '@/store/editor-store';

interface TemplateGalleryProps {
  onClose: () => void;
}

export function TemplateGallery({ onClose }: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addBlock, getCurrentPage } = useEditorStore();

  const filteredTemplates = pageTemplates.filter(template => {
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (template: PageTemplate) => {
    const currentPage = getCurrentPage();
    const blocks = generateBlocksFromTemplate(template);
    
    // 기존 블록이 있으면 확인
    if (currentPage && currentPage.blocks.length > 0) {
      if (!confirm('현재 페이지의 내용이 대체됩니다. 계속하시겠습니까?')) {
        return;
      }
    }

    // 블록 추가
    blocks.forEach((block, index) => {
      setTimeout(() => addBlock(block), index * 100);
    });

    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-800">템플릿 선택</h2>
            <p className="text-gray-500 mt-1">미리 디자인된 템플릿으로 빠르게 시작하세요</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
          >
            <Icons.X size={24} />
          </button>
        </div>

        <div className="flex h-[calc(90vh-100px)]">
          {/* 사이드바 - 카테고리 */}
          <div className="w-56 border-r p-4 overflow-y-auto">
            {/* 검색 */}
            <div className="relative mb-4">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="템플릿 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 text-sm"
              />
            </div>

            {/* 카테고리 목록 */}
            <div className="space-y-1">
              {templateCategories.map((cat) => {
                const IconComponent = Icons[cat.icon as keyof typeof Icons] as React.ComponentType<{ size?: number }>;
                const count = cat.id === 'all' 
                  ? pageTemplates.length 
                  : pageTemplates.filter(t => t.category === cat.id).length;
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg text-left
                      transition-colors
                      ${activeCategory === cat.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      {IconComponent && <IconComponent size={18} />}
                      {cat.name}
                    </span>
                    <span className="text-sm text-gray-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 템플릿 그리드 */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* 추천 템플릿 */}
            {activeCategory === 'all' && !searchQuery && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Icons.Star className="text-yellow-500" size={20} />
                  추천 템플릿
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {pageTemplates.filter(t => t.featured).map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onSelect={handleSelectTemplate}
                      featured
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 전체 템플릿 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {activeCategory === 'all' ? '모든 템플릿' : templateCategories.find(c => c.id === activeCategory)?.name}
              </h3>
              
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredTemplates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onSelect={handleSelectTemplate}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <Icons.Package size={48} className="mb-4" />
                  <p>검색 결과가 없습니다</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface TemplateCardProps {
  template: PageTemplate;
  onSelect: (template: PageTemplate) => void;
  featured?: boolean;
}

function TemplateCard({ template, onSelect, featured }: TemplateCardProps) {
  const categoryInfo = templateCategories.find(c => c.id === template.category);
  const CategoryIcon = categoryInfo ? Icons[categoryInfo.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }> : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={`
        group relative bg-white rounded-2xl overflow-hidden cursor-pointer
        border-2 transition-all duration-300
        ${featured ? 'border-primary-200 shadow-soft' : 'border-gray-100 hover:border-primary-200 hover:shadow-soft'}
      `}
      onClick={() => onSelect(template)}
    >
      {/* 썸네일 */}
      <div className="aspect-[4/3] bg-gradient-to-br from-pastel-lavender via-pastel-sky to-pastel-mint relative overflow-hidden">
        {/* 블록 미리보기 시뮬레이션 */}
        <div className="absolute inset-4 bg-white/80 rounded-xl shadow-sm p-3 space-y-2">
          {template.blocks.slice(0, 4).map((blockType, i) => (
            <div
              key={i}
              className={`
                rounded-lg
                ${blockType === 'header' ? 'h-3 bg-gray-200' : ''}
                ${blockType === 'hero' ? 'h-12 bg-gradient-to-r from-primary-100 to-primary-200' : ''}
                ${blockType === 'features' ? 'h-8 bg-gray-100' : ''}
                ${blockType === 'footer' ? 'h-3 bg-gray-300' : ''}
                ${!['header', 'hero', 'features', 'footer'].includes(blockType) ? 'h-6 bg-gray-100' : ''}
              `}
            />
          ))}
        </div>

        {/* 추천 배지 */}
        {featured && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full flex items-center gap-1">
            <Icons.Star size={12} />
            추천
          </div>
        )}

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/10 transition-colors flex items-center justify-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className="opacity-0 group-hover:opacity-100 btn-primary text-sm transition-opacity"
          >
            이 템플릿 사용
          </motion.button>
        </div>
      </div>

      {/* 정보 */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          {CategoryIcon && <CategoryIcon size={14} className="text-gray-400" />}
          <span className="text-xs text-gray-400">{categoryInfo?.name}</span>
        </div>
        <h4 className="font-semibold text-gray-800">{template.name}</h4>
        <p className="text-sm text-gray-500 mt-1">{template.description}</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-gray-400">{template.blocks.length}개 섹션</span>
        </div>
      </div>
    </motion.div>
  );
}

