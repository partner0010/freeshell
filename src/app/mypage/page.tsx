'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Download,
  FileText,
  Image as ImageIcon,
  Code2,
  Mic,
  FileSignature,
  Trash2,
  Eye,
  Calendar,
  Folder,
  Filter,
} from 'lucide-react';

interface SavedItem {
  id: string;
  type: 'signature' | 'voice-memo' | 'code-analysis' | 'project';
  title: string;
  description: string;
  createdAt: Date;
  data: any;
  thumbnail?: string;
}

export default function MyPage() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'signature' | 'voice-memo' | 'code-analysis' | 'project'>('all');

  // 로컬 스토리지에서 불러오기
  React.useEffect(() => {
    const stored = localStorage.getItem('grip-saved-items');
    if (stored) {
      try {
        const items = JSON.parse(stored).map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
        setSavedItems(items);
      } catch (error) {
        console.error('Failed to load saved items:', error);
      }
    }
  }, []);

  // 로컬 스토리지에 저장
  const saveToStorage = (items: SavedItem[]) => {
    localStorage.setItem('grip-saved-items', JSON.stringify(items));
    setSavedItems(items);
  };

  // 항목 삭제
  const deleteItem = (id: string) => {
    const updated = savedItems.filter((item) => item.id !== id);
    saveToStorage(updated);
  };

  // 항목 다운로드
  const downloadItem = (item: SavedItem) => {
    const dataStr = JSON.stringify(item.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title}-${item.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 이미지로 내보내기
  const exportAsImage = (item: SavedItem) => {
    if (item.type === 'signature' && item.data.image) {
      const link = document.createElement('a');
      link.href = item.data.image;
      link.download = `${item.title}.png`;
      link.click();
    }
  };

  // 필터링된 항목
  const filteredItems = filter === 'all' 
    ? savedItems 
    : savedItems.filter((item) => item.type === filter);

  const getTypeIcon = (type: SavedItem['type']) => {
    switch (type) {
      case 'signature':
        return FileSignature;
      case 'voice-memo':
        return Mic;
      case 'code-analysis':
        return Code2;
      case 'project':
        return Folder;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: SavedItem['type']) => {
    switch (type) {
      case 'signature':
        return 'bg-blue-100 text-blue-600';
      case 'voice-memo':
        return 'bg-green-100 text-green-600';
      case 'code-analysis':
        return 'bg-purple-100 text-purple-600';
      case 'project':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">마이페이지</h1>
          <p className="text-gray-500">저장된 작업물을 관리하세요</p>
        </div>
      </div>

      {/* 필터 */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={18} className="text-gray-500" />
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter('signature')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'signature'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            전자서명
          </button>
          <button
            onClick={() => setFilter('voice-memo')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'voice-memo'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            음성 메모
          </button>
          <button
            onClick={() => setFilter('code-analysis')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'code-analysis'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            코드 분석
          </button>
          <button
            onClick={() => setFilter('project')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'project'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            프로젝트
          </button>
        </div>
      </div>

      {/* 저장된 항목 목록 */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <Save className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg mb-2">저장된 항목이 없습니다</p>
            <p className="text-gray-400 text-sm">
              전자서명, 음성 메모, 코드 분석 등을 저장하면 여기에 표시됩니다
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const Icon = getTypeIcon(item.type);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* 썸네일 */}
                  {item.thumbnail && (
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* 내용 */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{item.title}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <Calendar size={12} />
                            {item.createdAt.toLocaleDateString('ko-KR')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {/* 액션 버튼 */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadItem(item)}
                        className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <Download size={14} />
                        다운로드
                      </button>
                      {item.type === 'signature' && (
                        <button
                          onClick={() => exportAsImage(item)}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                        >
                          <ImageIcon size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm font-medium flex items-center justify-center"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

