'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, History, Clock, X, Download, Eye } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

interface PreviewSnapshot {
  id: string;
  timestamp: number;
  name: string;
  thumbnail?: string;
  data: {
    blocks: any[];
    viewport: string;
    styles: Record<string, any>;
  };
}

export function PreviewSnapshot() {
  const { project, getCurrentPage } = useEditorStore();
  const [snapshots, setSnapshots] = useState<PreviewSnapshot[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const captureSnapshot = () => {
    const currentPage = getCurrentPage();
    if (!currentPage || !project) return;

    const snapshot: PreviewSnapshot = {
      id: `snap-${Date.now()}`,
      timestamp: Date.now(),
      name: `스냅샷 ${new Date().toLocaleTimeString()}`,
      data: {
        blocks: JSON.parse(JSON.stringify(currentPage.blocks)),
        viewport: 'desktop',
        styles: JSON.parse(JSON.stringify(project.globalStyles || {})),
      },
    };

    // 썸네일 생성 (실제로는 canvas를 사용하여 생성)
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#8B5CF6';
        ctx.font = '16px Arial';
        ctx.fillText(project.name, 20, 30);
        ctx.fillText(`${currentPage.blocks.length} blocks`, 20, 60);
        snapshot.thumbnail = canvas.toDataURL();
      }
    } catch (err) {
      console.error('Thumbnail generation failed:', err);
    }

    setSnapshots((prev) => [snapshot, ...prev].slice(0, 10)); // 최대 10개
  };

  const restoreSnapshot = (snapshot: PreviewSnapshot) => {
    // 실제로는 store의 상태를 복원해야 함
    console.log('Restoring snapshot:', snapshot);
    // TODO: 실제 복원 로직 구현
  };

  const deleteSnapshot = (id: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
  };

  const exportSnapshot = (snapshot: PreviewSnapshot) => {
    const dataStr = JSON.stringify(snapshot.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `snapshot-${snapshot.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* 스냅샷 버튼 */}
      <button
        onClick={captureSnapshot}
        className="fixed bottom-24 right-6 z-50 w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
        title="스냅샷 캡처"
      >
        <Camera size={20} />
      </button>

      {/* 히스토리 버튼 */}
      <button
        onClick={() => setShowHistory(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
        title="스냅샷 히스토리"
      >
        <History size={20} />
        {snapshots.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {snapshots.length}
          </span>
        )}
      </button>

      {/* 히스토리 패널 */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <History className="text-primary-600" size={24} />
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">스냅샷 히스토리</h2>
                    <p className="text-sm text-gray-500">{snapshots.length}개의 스냅샷</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              {/* 스냅샷 목록 */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
                {snapshots.length === 0 ? (
                  <div className="text-center py-12">
                    <Camera className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500">스냅샷이 없습니다</p>
                    <p className="text-sm text-gray-400 mt-2">
                      카메라 버튼을 눌러 현재 상태를 저장하세요
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {snapshots.map((snapshot) => (
                      <motion.div
                        key={snapshot.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-50 rounded-xl overflow-hidden border-2 border-transparent hover:border-primary-300 transition-all cursor-pointer group"
                        onClick={() => restoreSnapshot(snapshot)}
                      >
                        {/* 썸네일 */}
                        <div className="aspect-video bg-white relative overflow-hidden">
                          {snapshot.thumbnail ? (
                            <img
                              src={snapshot.thumbnail}
                              alt={snapshot.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                              <Eye className="text-primary-400" size={32} />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                exportSnapshot(snapshot);
                              }}
                              className="p-1.5 bg-white rounded-lg shadow-md hover:bg-gray-100"
                              title="내보내기"
                            >
                              <Download size={14} className="text-gray-600" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSnapshot(snapshot.id);
                              }}
                              className="p-1.5 bg-white rounded-lg shadow-md hover:bg-red-100"
                              title="삭제"
                            >
                              <X size={14} className="text-red-600" />
                            </button>
                          </div>
                        </div>

                        {/* 정보 */}
                        <div className="p-3">
                          <p className="font-medium text-gray-800 text-sm mb-1">{snapshot.name}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={12} />
                            <span>
                              {new Date(snapshot.timestamp).toLocaleString('ko-KR', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {snapshot.data.blocks.length}개 블록
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

