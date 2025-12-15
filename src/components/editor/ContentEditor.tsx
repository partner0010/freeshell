'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Type, Image, Link, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { Block, HeroContent, TextContent, HeaderContent, FeaturesContent, CTAContent, ContactContent } from '@/types';

export function ContentEditor() {
  const { selectedBlockId, getBlockById, updateBlock, selectBlock } = useEditorStore();
  const selectedBlock = selectedBlockId ? getBlockById(selectedBlockId) : null;

  if (!selectedBlock) return null;

  const handleContentChange = (key: string, value: unknown) => {
    updateBlock(selectedBlock.id, {
      content: { ...selectedBlock.content, [key]: value },
    });
  };

  const handleClose = () => selectBlock(null);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed right-0 top-16 bottom-0 w-96 bg-white shadow-2xl border-l z-50"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold text-gray-800">콘텐츠 편집</h3>
            <p className="text-sm text-gray-500 capitalize">{selectedBlock.type}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* 콘텐츠 폼 */}
        <div className="p-4 overflow-y-auto h-[calc(100%-80px)]">
          <ContentForm block={selectedBlock} onChange={handleContentChange} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface ContentFormProps {
  block: Block;
  onChange: (key: string, value: unknown) => void;
}

function ContentForm({ block, onChange }: ContentFormProps) {
  switch (block.type) {
    case 'hero':
      return <HeroForm content={block.content as HeroContent} onChange={onChange} />;
    case 'text':
      return <TextForm content={block.content as TextContent} onChange={onChange} />;
    case 'header':
      return <HeaderForm content={block.content as HeaderContent} onChange={onChange} />;
    case 'cta':
      return <CTAForm content={block.content as CTAContent} onChange={onChange} />;
    default:
      return <GenericForm content={block.content as Record<string, unknown>} onChange={onChange} />;
  }
}

function HeroForm({ content, onChange }: { content: HeroContent; onChange: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
        <input
          type="text"
          value={content.title}
          onChange={(e) => onChange('title', e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">부제목</label>
        <textarea
          value={content.subtitle}
          onChange={(e) => onChange('subtitle', e.target.value)}
          className="input-field min-h-[100px] resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">버튼 텍스트</label>
        <input
          type="text"
          value={content.buttonText || ''}
          onChange={(e) => onChange('buttonText', e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">버튼 링크</label>
        <input
          type="text"
          value={content.buttonLink || ''}
          onChange={(e) => onChange('buttonLink', e.target.value)}
          className="input-field"
          placeholder="https://"
        />
      </div>
    </div>
  );
}

function TextForm({ content, onChange }: { content: TextContent; onChange: (k: string, v: unknown) => void }) {
  const variants = [
    { value: 'paragraph', label: '본문' },
    { value: 'heading1', label: '제목 1' },
    { value: 'heading2', label: '제목 2' },
    { value: 'heading3', label: '제목 3' },
    { value: 'quote', label: '인용구' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">스타일</label>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.value}
              onClick={() => onChange('variant', v.value)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${content.variant === v.value
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
        <textarea
          value={content.content}
          onChange={(e) => onChange('content', e.target.value)}
          className="input-field min-h-[200px] resize-none"
        />
      </div>
    </div>
  );
}

function HeaderForm({ content, onChange }: { content: HeaderContent; onChange: (k: string, v: unknown) => void }) {
  const handleMenuChange = (index: number, field: 'label' | 'link', value: string) => {
    const newItems = [...content.menuItems];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange('menuItems', newItems);
  };

  const addMenuItem = () => {
    onChange('menuItems', [...content.menuItems, { label: '새 메뉴', link: '#' }]);
  };

  const removeMenuItem = (index: number) => {
    const newItems = content.menuItems.filter((_, i) => i !== index);
    onChange('menuItems', newItems);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">로고 텍스트</label>
        <input
          type="text"
          value={content.logo}
          onChange={(e) => onChange('logo', e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">메뉴 항목</label>
        <div className="space-y-2">
          {content.menuItems.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleMenuChange(i, 'label', e.target.value)}
                className="input-field flex-1"
                placeholder="메뉴 이름"
              />
              <input
                type="text"
                value={item.link}
                onChange={(e) => handleMenuChange(i, 'link', e.target.value)}
                className="input-field flex-1"
                placeholder="링크"
              />
              <button
                onClick={() => removeMenuItem(i)}
                className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
          ))}
          <button
            onClick={addMenuItem}
            className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors"
          >
            + 메뉴 추가
          </button>
        </div>
      </div>
    </div>
  );
}

function CTAForm({ content, onChange }: { content: CTAContent; onChange: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
        <input
          type="text"
          value={content.title}
          onChange={(e) => onChange('title', e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
        <textarea
          value={content.description}
          onChange={(e) => onChange('description', e.target.value)}
          className="input-field min-h-[100px] resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">버튼 텍스트</label>
        <input
          type="text"
          value={content.buttonText}
          onChange={(e) => onChange('buttonText', e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">버튼 링크</label>
        <input
          type="text"
          value={content.buttonLink}
          onChange={(e) => onChange('buttonLink', e.target.value)}
          className="input-field"
          placeholder="https://"
        />
      </div>
    </div>
  );
}

function GenericForm({ content, onChange }: { content: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  const editableKeys = Object.keys(content).filter(
    (key) => typeof content[key] === 'string' || typeof content[key] === 'number'
  );

  return (
    <div className="space-y-4">
      {editableKeys.map((key) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          {typeof content[key] === 'string' && (content[key] as string).length > 50 ? (
            <textarea
              value={content[key] as string}
              onChange={(e) => onChange(key, e.target.value)}
              className="input-field min-h-[100px] resize-none"
            />
          ) : (
            <input
              type={typeof content[key] === 'number' ? 'number' : 'text'}
              value={content[key] as string | number}
              onChange={(e) => onChange(key, e.target.value)}
              className="input-field"
            />
          )}
        </div>
      ))}
      {editableKeys.length === 0 && (
        <p className="text-gray-400 text-center py-8">
          이 블록은 직접 편집할 수 없습니다
        </p>
      )}
    </div>
  );
}

