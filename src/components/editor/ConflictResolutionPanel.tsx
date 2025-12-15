'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitMerge,
  AlertTriangle,
  CheckCircle2,
  X,
  RefreshCw,
  Users,
} from 'lucide-react';
import {
  conflictResolutionSystem,
  type Conflict,
  type Resolution,
} from '@/lib/collaboration/conflict-resolution';

export function ConflictResolutionPanel() {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setConflicts(conflictResolutionSystem.getConflicts());
    setResolutions(conflictResolutionSystem.getResolutions());
  };

  const handleResolve = (conflictId: string, strategy: 'mine' | 'theirs' | 'merge') => {
    try {
      const resolution = conflictResolutionSystem.autoResolve(conflictId, strategy);
      loadData();
      alert('충돌이 해결되었습니다');
    } catch (error) {
      alert(`해결 실패: ${error}`);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center">
            <GitMerge className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">충돌 해결</h2>
            <p className="text-sm text-gray-500">실시간 협업 충돌 관리</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* 활성 충돌 */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            활성 충돌 ({conflicts.length})
          </h3>
          {conflicts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              충돌이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {conflicts.map((conflict) => (
                <div
                  key={conflict.id}
                  className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-gray-800">{conflict.path}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        사용자: {conflict.userId} • 버전: {conflict.version}
                      </div>
                    </div>
                    <AlertTriangle className="text-yellow-600" size={24} />
                  </div>

                  <div className="p-3 bg-white rounded-lg mb-3">
                    <div className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
                      {conflict.content.substring(0, 200)}
                      {conflict.content.length > 200 && '...'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolve(conflict.id, 'mine')}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      내 변경사항 사용
                    </button>
                    <button
                      onClick={() => handleResolve(conflict.id, 'theirs')}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      다른 사람 변경사항 사용
                    </button>
                    <button
                      onClick={() => handleResolve(conflict.id, 'merge')}
                      className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center gap-1"
                    >
                      <GitMerge size={14} />
                      자동 병합
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 해결된 충돌 */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            해결된 충돌 ({resolutions.length})
          </h3>
          {resolutions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              해결된 충돌이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {resolutions.map((resolution) => (
                <div
                  key={resolution.conflictId}
                  className="p-4 bg-green-50 border border-green-200 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">
                        충돌 #{resolution.conflictId.substring(0, 8)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        전략: {resolution.strategy} • {new Date(resolution.resolvedAt).toLocaleString()}
                      </div>
                    </div>
                    <CheckCircle2 className="text-green-600" size={24} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

