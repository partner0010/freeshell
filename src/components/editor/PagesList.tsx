'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, File, MoreVertical, Pencil, Trash2, Check, X } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

export function PagesList() {
  const { project, currentPageId, setCurrentPage, addPage, updatePage, deletePage } = useEditorStore();
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showNewPageInput, setShowNewPageInput] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  if (!project) return null;

  const handleStartEdit = (pageId: string, currentName: string) => {
    setEditingPageId(pageId);
    setEditingName(currentName);
  };

  const handleSaveEdit = () => {
    if (editingPageId && editingName.trim()) {
      updatePage(editingPageId, { name: editingName.trim() });
    }
    setEditingPageId(null);
    setEditingName('');
  };

  const handleAddPage = () => {
    if (newPageName.trim()) {
      addPage(newPageName.trim());
      setNewPageName('');
      setShowNewPageInput(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">페이지</h3>
        <button
          onClick={() => setShowNewPageInput(true)}
          className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* 새 페이지 입력 */}
      {showNewPageInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddPage();
                if (e.key === 'Escape') setShowNewPageInput(false);
              }}
              placeholder="페이지 이름"
              className="input-field flex-1"
              autoFocus
            />
            <button
              onClick={handleAddPage}
              disabled={!newPageName.trim()}
              className="p-2 text-green-500 hover:bg-green-50 rounded-lg disabled:opacity-50"
            >
              <Check size={20} />
            </button>
            <button
              onClick={() => setShowNewPageInput(false)}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}

      {/* 페이지 목록 */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {project.pages.map((page) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`
              group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
              ${currentPageId === page.id
                ? 'bg-primary-100 text-primary-700'
                : 'hover:bg-gray-100'
              }
            `}
            onClick={() => !editingPageId && setCurrentPage(page.id)}
          >
            <File size={18} className="shrink-0" />
            
            {editingPageId === page.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') setEditingPageId(null);
                  }}
                  className="flex-1 px-2 py-1 text-sm bg-white border rounded"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveEdit();
                  }}
                  className="p-1 text-green-500 hover:bg-green-50 rounded"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <>
                <span className="flex-1 font-medium truncate">{page.name}</span>
                <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(page.id, page.name);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded"
                  >
                    <Pencil size={14} />
                  </button>
                  {project.pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('이 페이지를 삭제하시겠습니까?')) {
                          deletePage(page.id);
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* 페이지 정보 */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-gray-500">
          총 {project.pages.length}개 페이지
        </p>
      </div>
    </div>
  );
}

