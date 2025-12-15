'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  GitCommit,
  GitMerge,
  Clock,
  RotateCcw,
  Eye,
  Plus,
  Check,
  X,
  ChevronRight,
  Tag,
  Archive,
} from 'lucide-react';

// 버전 히스토리 데이터
const versionHistory = [
  {
    id: 'v1.2.3',
    name: '최신 버전',
    description: '히어로 섹션 디자인 개선',
    author: '김철수',
    timestamp: '2024-03-25 14:30',
    current: true,
    changes: [
      { type: 'modified', item: '히어로 블록' },
      { type: 'added', item: 'CTA 버튼' },
    ],
  },
  {
    id: 'v1.2.2',
    name: '푸터 추가',
    description: '푸터 섹션과 소셜 링크 추가',
    author: '이영희',
    timestamp: '2024-03-25 12:15',
    current: false,
    changes: [
      { type: 'added', item: '푸터 블록' },
      { type: 'modified', item: '헤더 블록' },
    ],
  },
  {
    id: 'v1.2.1',
    name: '가격 페이지 수정',
    description: '가격 테이블 레이아웃 변경',
    author: '김철수',
    timestamp: '2024-03-24 18:45',
    current: false,
    changes: [
      { type: 'modified', item: '가격 블록' },
    ],
  },
  {
    id: 'v1.2.0',
    name: '메이저 업데이트',
    description: '전체 디자인 리뉴얼',
    author: '김철수',
    timestamp: '2024-03-23 10:00',
    current: false,
    tag: 'release',
    changes: [
      { type: 'modified', item: '전체 블록' },
      { type: 'added', item: '애니메이션' },
    ],
  },
];

// 브랜치 데이터
const branches = [
  { name: 'main', description: '메인 프로덕션 버전', current: true },
  { name: 'feature/new-header', description: '새 헤더 디자인 테스트', current: false },
  { name: 'hotfix/mobile-layout', description: '모바일 레이아웃 수정', current: false },
];

export default function VersionControlPanel() {
  const [activeTab, setActiveTab] = useState<'history' | 'branches'>('history');
  const [showCreateBranch, setShowCreateBranch] = useState(false);
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <GitBranch size={18} />
          버전 관리
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          변경 사항을 추적하고 관리하세요
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="p-4 border-b space-y-2">
        <button
          onClick={() => setShowCommitModal(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <GitCommit size={16} />
          변경사항 저장
        </button>
        <button
          onClick={() => setShowCreateBranch(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <Plus size={16} />
          새 브랜치
        </button>
      </div>

      {/* 탭 */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          히스토리
        </button>
        <button
          onClick={() => setActiveTab('branches')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'branches'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          브랜치
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'history' && (
          <div className="p-4">
            <div className="relative">
              {/* 타임라인 라인 */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

              {/* 버전 목록 */}
              <div className="space-y-4">
                {versionHistory.map((version, index) => (
                  <motion.div
                    key={version.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative pl-12 ${
                      selectedVersion === version.id ? 'bg-primary-50 -mx-4 px-4 py-2 rounded-xl' : ''
                    }`}
                  >
                    {/* 노드 */}
                    <div
                      className={`absolute left-3 w-4 h-4 rounded-full border-2 ${
                        version.current
                          ? 'bg-primary-500 border-primary-500'
                          : 'bg-white border-gray-300'
                      }`}
                    />

                    {/* 콘텐츠 */}
                    <div
                      className="cursor-pointer"
                      onClick={() => setSelectedVersion(selectedVersion === version.id ? null : version.id)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">{version.name}</span>
                        {version.tag && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            <Tag size={10} />
                            {version.tag}
                          </span>
                        )}
                        {version.current && (
                          <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                            현재
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{version.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <span>{version.author}</span>
                        <span>•</span>
                        <span>{version.timestamp}</span>
                      </div>

                      {/* 변경사항 (확장 시 표시) */}
                      <AnimatePresence>
                        {selectedVersion === version.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t"
                          >
                            <p className="text-xs font-medium text-gray-600 mb-2">변경사항:</p>
                            <ul className="space-y-1">
                              {version.changes.map((change, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs">
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      change.type === 'added' ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}
                                  />
                                  <span className="text-gray-600">
                                    {change.type === 'added' ? '추가' : '수정'}: {change.item}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <div className="flex gap-2 mt-3">
                              <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">
                                <Eye size={12} />
                                미리보기
                              </button>
                              {!version.current && (
                                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200">
                                  <RotateCcw size={12} />
                                  복원
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'branches' && (
          <div className="p-4 space-y-3">
            {branches.map((branch) => (
              <div
                key={branch.name}
                className={`p-4 rounded-xl border ${
                  branch.current ? 'border-primary-300 bg-primary-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch size={16} className={branch.current ? 'text-primary-500' : 'text-gray-400'} />
                    <span className="font-medium text-gray-800">{branch.name}</span>
                    {branch.current && (
                      <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                        현재
                      </span>
                    )}
                  </div>
                  {!branch.current && (
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1 ml-6">{branch.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 커밋 모달 */}
      <AnimatePresence>
        {showCommitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowCommitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">변경사항 저장</h2>
                <button
                  onClick={() => setShowCommitModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">버전 이름</label>
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="예: 헤더 디자인 수정"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">설명 (선택)</label>
                  <textarea
                    placeholder="변경 내용에 대한 설명..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 h-24 resize-none"
                  />
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700 mb-2">변경된 블록:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                      헤더 블록 (수정됨)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      CTA 블록 (추가됨)
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => setShowCommitModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  저장하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 브랜치 생성 모달 */}
      <AnimatePresence>
        {showCreateBranch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowCreateBranch(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">새 브랜치 만들기</h2>
                <button
                  onClick={() => setShowCreateBranch(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">브랜치 이름</label>
                  <input
                    type="text"
                    placeholder="예: feature/new-design"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">기준 브랜치</label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                    <option value="main">main (현재)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                  <textarea
                    placeholder="브랜치에 대한 설명..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 h-20 resize-none"
                  />
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateBranch(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  만들기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

