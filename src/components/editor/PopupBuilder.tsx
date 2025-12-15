'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  X,
  Clock,
  MousePointer,
  ArrowDown,
  Eye,
  Settings,
  Plus,
  Trash2,
  Check,
  Image,
  Type,
  Mail,
} from 'lucide-react';

type TriggerType = 'time' | 'scroll' | 'exit' | 'click';
type PopupPosition = 'center' | 'bottom' | 'top' | 'bottom-right' | 'bottom-left';

interface PopupConfig {
  id: string;
  name: string;
  trigger: TriggerType;
  triggerValue: number; // seconds for time, percentage for scroll
  position: PopupPosition;
  title: string;
  content: string;
  buttonText: string;
  buttonUrl: string;
  showOnce: boolean;
  delay: number;
  backgroundColor: string;
  textColor: string;
}

const triggerTypes = [
  { type: 'time' as const, icon: Clock, label: '시간 기반', description: '페이지 로드 후 N초' },
  { type: 'scroll' as const, icon: ArrowDown, label: '스크롤', description: '페이지의 N% 스크롤 시' },
  { type: 'exit' as const, icon: MousePointer, label: '이탈 의도', description: '마우스가 창 밖으로' },
  { type: 'click' as const, icon: MousePointer, label: '클릭', description: '특정 요소 클릭 시' },
];

const positionOptions = [
  { value: 'center', label: '중앙' },
  { value: 'bottom', label: '하단 전체' },
  { value: 'top', label: '상단 전체' },
  { value: 'bottom-right', label: '우측 하단' },
  { value: 'bottom-left', label: '좌측 하단' },
];

export default function PopupBuilder() {
  const [popups, setPopups] = useState<PopupConfig[]>([
    {
      id: '1',
      name: '뉴스레터 팝업',
      trigger: 'time',
      triggerValue: 5,
      position: 'center',
      title: '뉴스레터 구독하기',
      content: '최신 소식과 혜택을 받아보세요!',
      buttonText: '구독하기',
      buttonUrl: '#',
      showOnce: true,
      delay: 0,
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
    },
  ]);
  const [selectedPopup, setSelectedPopup] = useState<string | null>(popups[0]?.id || null);
  const [showPreview, setShowPreview] = useState(false);

  const currentPopup = popups.find(p => p.id === selectedPopup);

  const addPopup = () => {
    const newPopup: PopupConfig = {
      id: Date.now().toString(),
      name: `팝업 ${popups.length + 1}`,
      trigger: 'time',
      triggerValue: 5,
      position: 'center',
      title: '새 팝업',
      content: '내용을 입력하세요',
      buttonText: '확인',
      buttonUrl: '#',
      showOnce: false,
      delay: 0,
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
    };
    setPopups([...popups, newPopup]);
    setSelectedPopup(newPopup.id);
  };

  const updatePopup = (id: string, updates: Partial<PopupConfig>) => {
    setPopups(popups.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePopup = (id: string) => {
    setPopups(popups.filter(p => p.id !== id));
    if (selectedPopup === id) {
      setSelectedPopup(popups[0]?.id || null);
    }
  };

  const getPositionStyle = (position: PopupPosition) => {
    switch (position) {
      case 'center': return 'items-center justify-center';
      case 'bottom': return 'items-end justify-center';
      case 'top': return 'items-start justify-center';
      case 'bottom-right': return 'items-end justify-end p-4';
      case 'bottom-left': return 'items-end justify-start p-4';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Layers size={18} />
          팝업 빌더
        </h3>
        <p className="text-sm text-gray-500 mt-1">효과적인 팝업을 만드세요</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 팝업 목록 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-500">팝업 목록</p>
            <button onClick={addPopup} className="p-1 text-primary-500 hover:bg-primary-50 rounded">
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {popups.map((popup) => (
              <div
                key={popup.id}
                onClick={() => setSelectedPopup(popup.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedPopup === popup.id
                    ? 'border-primary-300 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{popup.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {triggerTypes.find(t => t.type === popup.trigger)?.label}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deletePopup(popup.id); }}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {currentPopup && (
          <>
            {/* 미리보기 버튼 */}
            <button
              onClick={() => setShowPreview(true)}
              className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Eye size={16} />
              미리보기
            </button>

            {/* 기본 설정 */}
            <div className="space-y-4">
              <p className="text-xs font-medium text-gray-500">기본 설정</p>
              <input
                type="text"
                value={currentPopup.name}
                onChange={(e) => updatePopup(currentPopup.id, { name: e.target.value })}
                placeholder="팝업 이름"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>

            {/* 트리거 */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-3">트리거</p>
              <div className="grid grid-cols-2 gap-2">
                {triggerTypes.map((trigger) => (
                  <button
                    key={trigger.type}
                    onClick={() => updatePopup(currentPopup.id, { trigger: trigger.type })}
                    className={`p-3 rounded-xl border-2 text-left ${
                      currentPopup.trigger === trigger.type
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <trigger.icon size={18} className="mb-1 text-gray-600" />
                    <p className="text-sm font-medium text-gray-700">{trigger.label}</p>
                    <p className="text-xs text-gray-500">{trigger.description}</p>
                  </button>
                ))}
              </div>
              
              {(currentPopup.trigger === 'time' || currentPopup.trigger === 'scroll') && (
                <div className="mt-3">
                  <label className="text-sm text-gray-700">
                    {currentPopup.trigger === 'time' ? '시간 (초)' : '스크롤 위치 (%)'}
                  </label>
                  <input
                    type="number"
                    value={currentPopup.triggerValue}
                    onChange={(e) => updatePopup(currentPopup.id, { triggerValue: parseInt(e.target.value) })}
                    className="w-full mt-1 px-4 py-2 border rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* 위치 */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">위치</p>
              <select
                value={currentPopup.position}
                onChange={(e) => updatePopup(currentPopup.id, { position: e.target.value as PopupPosition })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {positionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* 콘텐츠 */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-500">콘텐츠</p>
              <input
                type="text"
                value={currentPopup.title}
                onChange={(e) => updatePopup(currentPopup.id, { title: e.target.value })}
                placeholder="제목"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <textarea
                value={currentPopup.content}
                onChange={(e) => updatePopup(currentPopup.id, { content: e.target.value })}
                placeholder="내용"
                className="w-full px-4 py-2 border rounded-lg h-20 resize-none"
              />
              <input
                type="text"
                value={currentPopup.buttonText}
                onChange={(e) => updatePopup(currentPopup.id, { buttonText: e.target.value })}
                placeholder="버튼 텍스트"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* 옵션 */}
            <div>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentPopup.showOnce}
                  onChange={(e) => updatePopup(currentPopup.id, { showOnce: e.target.checked })}
                  className="rounded text-primary-500"
                />
                <span className="text-sm text-gray-700">한 번만 표시</span>
              </label>
            </div>
          </>
        )}
      </div>

      {/* 팝업 미리보기 모달 */}
      <AnimatePresence>
        {showPreview && currentPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 bg-black/50 flex ${getPositionStyle(currentPopup.position)}`}
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`bg-white rounded-2xl shadow-xl p-6 max-w-md ${
                currentPopup.position === 'bottom' || currentPopup.position === 'top'
                  ? 'w-full rounded-none'
                  : ''
              }`}
              style={{
                backgroundColor: currentPopup.backgroundColor,
                color: currentPopup.textColor,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold mb-2">{currentPopup.title}</h3>
              <p className="text-gray-600 mb-4">{currentPopup.content}</p>
              <button className="w-full py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600">
                {currentPopup.buttonText}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 적용 버튼 */}
      <div className="p-4 border-t">
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600">
          <Check size={18} />
          팝업 저장
        </button>
      </div>
    </div>
  );
}

