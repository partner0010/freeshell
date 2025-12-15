'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Undo2, Redo2, Eye, EyeOff, Monitor, Tablet, Smartphone,
  Download, Share2, Settings, Sparkles, Save, Layout, 
  HelpCircle, ChevronDown
} from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { ViewportSize } from './ViewportSelector';

interface ToolbarProps {
  onOpenTemplates?: () => void;
  viewport?: ViewportSize;
  onViewportChange?: (viewport: ViewportSize) => void;
}

export function Toolbar({ onOpenTemplates, viewport = 'desktop', onViewportChange }: ToolbarProps) {
  const { 
    undo, redo, 
    isPreviewMode, setPreviewMode,
    project,
    historyIndex,
    history,
  } = useEditorStore();

  const [showProjectMenu, setShowProjectMenu] = useState(false);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const viewports = [
    { id: 'desktop' as const, icon: Monitor, label: '데스크톱', width: '100%' },
    { id: 'tablet' as const, icon: Tablet, label: '태블릿', width: '768px' },
    { id: 'mobile' as const, icon: Smartphone, label: '모바일', width: '375px' },
  ];

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      {/* 좌측: 프로젝트 정보 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
            <Sparkles className="text-white" size={20} />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowProjectMenu(!showProjectMenu)}
              className="flex items-center gap-1 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors"
            >
              <div>
                <h1 className="font-display font-bold text-gray-800 text-left">
                  {project?.name || 'GRIP'}
                </h1>
                <p className="text-xs text-gray-500 text-left">AI 웹사이트 빌더</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {/* 프로젝트 메뉴 */}
            {showProjectMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-2 z-50"
              >
                <button
                  onClick={() => {
                    setShowProjectMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  프로젝트 이름 변경
                </button>
                <button
                  onClick={() => {
                    setShowProjectMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  프로젝트 설정
                </button>
                <hr className="my-2" />
                <button
                  onClick={() => {
                    setShowProjectMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  프로젝트 삭제
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* 템플릿 버튼 */}
        {onOpenTemplates && (
          <button
            onClick={onOpenTemplates}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Layout size={16} />
            템플릿
          </button>
        )}
      </div>

      {/* 중앙: 주요 액션 */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 px-2 border-r">
          <ToolbarButton
            icon={Undo2}
            onClick={undo}
            disabled={!canUndo}
            tooltip="실행 취소 (Ctrl+Z)"
          />
          <ToolbarButton
            icon={Redo2}
            onClick={redo}
            disabled={!canRedo}
            tooltip="다시 실행 (Ctrl+Y)"
          />
        </div>

        {/* 뷰포트 */}
        <div className="flex items-center gap-1 px-2 border-r">
          {viewports.map((vp) => (
            <ToolbarButton
              key={vp.id}
              icon={vp.icon}
              onClick={() => onViewportChange?.(vp.id)}
              active={viewport === vp.id}
              tooltip={vp.label}
            />
          ))}
        </div>

        {/* 미리보기 */}
        <ToolbarButton
          icon={isPreviewMode ? EyeOff : Eye}
          onClick={() => setPreviewMode(!isPreviewMode)}
          active={isPreviewMode}
          tooltip={isPreviewMode ? '편집 모드' : '미리보기'}
          className="px-4"
        >
          <span className="ml-2 text-sm">
            {isPreviewMode ? '편집' : '미리보기'}
          </span>
        </ToolbarButton>
      </div>

      {/* 우측: 저장/내보내기 */}
      <div className="flex items-center gap-3">
        <ToolbarButton icon={Save} tooltip="저장 (Ctrl+S)" />
        <ToolbarButton icon={HelpCircle} tooltip="도움말" />
        
        <div className="w-px h-6 bg-gray-200" />
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary text-sm py-2"
        >
          게시하기
        </motion.button>
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  tooltip?: string;
  className?: string;
  children?: React.ReactNode;
}

function ToolbarButton({ 
  icon: Icon, 
  onClick, 
  disabled, 
  active, 
  tooltip,
  className = '',
  children,
}: ToolbarButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`
        flex items-center p-2 rounded-lg transition-colors
        ${active 
          ? 'bg-primary-100 text-primary-600' 
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <Icon size={18} />
      {children}
    </motion.button>
  );
}
