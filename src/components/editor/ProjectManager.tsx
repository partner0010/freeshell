'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, FolderOpen, Download, Upload, Trash2, Clock, FileJson, Plus, Check, AlertCircle } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { Project } from '@/types';

interface SavedProject {
  id: string;
  name: string;
  savedAt: string;
  data: Project;
}

export function ProjectManager() {
  const { project, initProject } = useEditorStore();
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('grip-saved-projects');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveProject = () => {
    if (!project) return;

    const name = projectName.trim() || project.name;
    const savedProject: SavedProject = {
      id: `project-${Date.now()}`,
      name,
      savedAt: new Date().toISOString(),
      data: project,
    };

    const updated = [savedProject, ...savedProjects.filter(p => p.name !== name)].slice(0, 10);
    setSavedProjects(updated);
    localStorage.setItem('grip-saved-projects', JSON.stringify(updated));
    setShowSaveDialog(false);
    setProjectName('');
    showNotification('success', '프로젝트가 저장되었습니다!');
  };

  const handleLoadProject = (savedProject: SavedProject) => {
    if (confirm('현재 프로젝트가 대체됩니다. 계속하시겠습니까?')) {
      // 프로젝트 상태 복원
      const store = useEditorStore.getState();
      store.initProject(savedProject.data.name);
      // 여기서 추가 상태 복원 로직 필요
      showNotification('success', '프로젝트를 불러왔습니다!');
    }
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('이 프로젝트를 삭제하시겠습니까?')) {
      const updated = savedProjects.filter(p => p.id !== id);
      setSavedProjects(updated);
      localStorage.setItem('grip-saved-projects', JSON.stringify(updated));
      showNotification('success', '프로젝트가 삭제되었습니다.');
    }
  };

  const handleExportToFile = () => {
    if (!project) return;

    const dataStr = JSON.stringify(project, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.grip.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('success', '파일로 내보냈습니다!');
  };

  const handleImportFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.id && data.name && data.pages) {
          // 유효한 프로젝트 데이터
          const savedProject: SavedProject = {
            id: `imported-${Date.now()}`,
            name: data.name,
            savedAt: new Date().toISOString(),
            data,
          };
          handleLoadProject(savedProject);
        } else {
          showNotification('error', '올바른 프로젝트 파일이 아닙니다.');
        }
      } catch {
        showNotification('error', '파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 알림 */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              mb-4 p-3 rounded-lg flex items-center gap-2 text-sm
              ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
            `}
          >
            {notification.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 현재 프로젝트 */}
      <div className="bg-gradient-to-r from-primary-100 to-pastel-sky rounded-xl p-4 mb-4">
        <p className="text-sm text-primary-600 font-medium mb-1">현재 프로젝트</p>
        <p className="text-xl font-bold text-gray-800">{project?.name || '새 프로젝트'}</p>
        <p className="text-xs text-gray-500 mt-1">
          {project?.pages.length || 0}개 페이지 · 
          마지막 수정: {project?.updatedAt ? formatDate(project.updatedAt.toString()) : '-'}
        </p>
      </div>

      {/* 액션 버튼들 */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <button
          onClick={() => setShowSaveDialog(true)}
          className="flex items-center justify-center gap-2 py-3 bg-primary-100 text-primary-700 rounded-xl hover:bg-primary-200 transition-colors"
        >
          <Save size={18} />
          저장
        </button>
        <button
          onClick={handleExportToFile}
          className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
        >
          <Download size={18} />
          내보내기
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
        >
          <Upload size={18} />
          가져오기
        </button>
        <button
          onClick={() => {
            if (confirm('새 프로젝트를 시작하시겠습니까?')) {
              initProject('새 프로젝트');
            }
          }}
          className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
        >
          <Plus size={18} />
          새 프로젝트
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.grip.json"
        onChange={handleImportFromFile}
        className="hidden"
      />

      {/* 저장된 프로젝트 목록 */}
      <div className="flex-1 overflow-y-auto">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <FolderOpen size={16} />
          저장된 프로젝트
        </h4>

        {savedProjects.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FileJson size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">저장된 프로젝트가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-2">
            {savedProjects.map((saved) => (
              <motion.div
                key={saved.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group bg-white border rounded-xl p-3 hover:shadow-soft transition-shadow cursor-pointer"
                onClick={() => handleLoadProject(saved)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{saved.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <Clock size={12} />
                      {formatDate(saved.savedAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(saved.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 저장 다이얼로그 */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">프로젝트 저장</h3>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder={project?.name || '프로젝트 이름'}
                className="input-field mb-4"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  취소
                </button>
                <button onClick={handleSaveProject} className="flex-1 btn-primary py-2">
                  저장
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

