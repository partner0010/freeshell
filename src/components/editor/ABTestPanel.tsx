'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Split,
  Plus,
  Play,
  Pause,
  BarChart2,
  Users,
  Target,
  ChevronRight,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  MousePointer,
} from 'lucide-react';

interface ABTest {
  id: string;
  name: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: {
    id: string;
    name: string;
    traffic: number;
    visitors: number;
    conversions: number;
  }[];
  startDate?: string;
  endDate?: string;
  goal: string;
}

const mockTests: ABTest[] = [
  {
    id: '1',
    name: 'CTA 버튼 색상 테스트',
    status: 'running',
    goal: 'click',
    startDate: '2024-03-20',
    variants: [
      { id: 'a', name: '원본 (파란색)', traffic: 50, visitors: 1234, conversions: 89 },
      { id: 'b', name: '변형 (초록색)', traffic: 50, visitors: 1256, conversions: 112 },
    ],
  },
  {
    id: '2',
    name: '히어로 헤드라인 테스트',
    status: 'completed',
    goal: 'signup',
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    variants: [
      { id: 'a', name: '짧은 헤드라인', traffic: 50, visitors: 5432, conversions: 234 },
      { id: 'b', name: '긴 헤드라인', traffic: 50, visitors: 5489, conversions: 312 },
    ],
  },
];

const statusConfig = {
  draft: { color: 'bg-gray-100 text-gray-700', label: '초안', icon: Clock },
  running: { color: 'bg-green-100 text-green-700', label: '실행 중', icon: Play },
  paused: { color: 'bg-yellow-100 text-yellow-700', label: '일시정지', icon: Pause },
  completed: { color: 'bg-blue-100 text-blue-700', label: '완료', icon: CheckCircle },
};

export default function ABTestPanel() {
  const [tests, setTests] = useState(mockTests);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const calculateWinner = (test: ABTest) => {
    const rates = test.variants.map(v => ({
      ...v,
      rate: v.visitors > 0 ? (v.conversions / v.visitors) * 100 : 0,
    }));
    return rates.reduce((prev, curr) => curr.rate > prev.rate ? curr : prev);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Split size={18} />
          A/B 테스트
        </h3>
        <p className="text-sm text-gray-500 mt-1">버전을 비교하고 최적화하세요</p>
      </div>

      {/* 새 테스트 버튼 */}
      <div className="p-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl text-gray-500 hover:border-primary-300 hover:text-primary-500 transition-colors"
        >
          <Plus size={18} />
          새 A/B 테스트
        </button>
      </div>

      {/* 테스트 목록 */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3">
        {tests.map((test) => {
          const StatusIcon = statusConfig[test.status].icon;
          const winner = test.status === 'completed' ? calculateWinner(test) : null;

          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                bg-white rounded-xl border p-4 cursor-pointer transition-all
                ${selectedTest === test.id ? 'ring-2 ring-primary-300' : 'hover:shadow-md'}
              `}
              onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-800">{test.name}</h4>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${statusConfig[test.status].color}`}>
                    <StatusIcon size={10} />
                    {statusConfig[test.status].label}
                  </span>
                </div>
                <ChevronRight
                  size={18}
                  className={`text-gray-400 transition-transform ${selectedTest === test.id ? 'rotate-90' : ''}`}
                />
              </div>

              {/* 간단한 통계 */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">방문자</p>
                  <p className="font-semibold text-gray-800">
                    {test.variants.reduce((sum, v) => sum + v.visitors, 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">전환</p>
                  <p className="font-semibold text-gray-800">
                    {test.variants.reduce((sum, v) => sum + v.conversions, 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">전환율</p>
                  <p className="font-semibold text-gray-800">
                    {((test.variants.reduce((sum, v) => sum + v.conversions, 0) / 
                       test.variants.reduce((sum, v) => sum + v.visitors, 0)) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* 상세 정보 (확장) */}
              <AnimatePresence>
                {selectedTest === test.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t"
                  >
                    <p className="text-xs font-medium text-gray-500 mb-3">변형별 성과</p>
                    {test.variants.map((variant) => {
                      const rate = variant.visitors > 0 ? (variant.conversions / variant.visitors) * 100 : 0;
                      const isWinner = winner?.id === variant.id;
                      
                      return (
                        <div
                          key={variant.id}
                          className={`p-3 rounded-lg mb-2 ${isWinner ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-700 flex items-center gap-2">
                              {variant.name}
                              {isWinner && <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">승자</span>}
                            </span>
                            <span className="text-sm text-gray-500">{variant.traffic}% 트래픽</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-gray-600">
                              <Eye size={12} />
                              {variant.visitors.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1 text-gray-600">
                              <MousePointer size={12} />
                              {variant.conversions.toLocaleString()}
                            </span>
                            <span className={`flex items-center gap-1 ${isWinner ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                              <TrendingUp size={12} />
                              {rate.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex gap-2 mt-3">
                      {test.status === 'running' && (
                        <button className="flex-1 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm hover:bg-yellow-200">
                          일시정지
                        </button>
                      )}
                      {test.status === 'paused' && (
                        <button className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200">
                          재개
                        </button>
                      )}
                      <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                        상세 분석
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* 테스트 생성 모달 */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">새 A/B 테스트</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">테스트 이름</label>
                  <input
                    type="text"
                    placeholder="예: CTA 버튼 색상 테스트"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">목표</label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                    <option value="click">클릭률</option>
                    <option value="signup">회원가입</option>
                    <option value="purchase">구매</option>
                    <option value="pageview">페이지뷰</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">트래픽 분배</label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">원본</label>
                      <input type="number" defaultValue={50} className="w-full px-3 py-2 border rounded-lg text-center" />
                    </div>
                    <span className="text-gray-400">:</span>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">변형</label>
                      <input type="number" defaultValue={50} className="w-full px-3 py-2 border rounded-lg text-center" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  취소
                </button>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  테스트 시작
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

