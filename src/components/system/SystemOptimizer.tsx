'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  FileText,
  Bell,
  Book,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  databaseQueryOptimizer,
  type QueryAnalysis,
  type DatabaseStats,
} from '@/lib/database/query-optimizer';
import {
  comprehensiveAuditSystem,
  type AuditLog,
} from '@/lib/logging/comprehensive-audit';
import {
  multiChannelNotificationSystem,
  type Notification,
} from '@/lib/notifications/multi-channel';
import {
  interactiveDocumentationSystem,
  type Documentation,
} from '@/lib/documentation/interactive-docs';

export function SystemOptimizer() {
  const [activeTab, setActiveTab] = useState<'database' | 'logging' | 'notifications' | 'docs'>('database');
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [slowQueries, setSlowQueries] = useState<QueryAnalysis[]>([]);
  const [auditStats, setAuditStats] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [docs, setDocs] = useState<Documentation[]>([]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const loadData = () => {
    switch (activeTab) {
      case 'database':
        setDbStats(databaseQueryOptimizer.getStats());
        setSlowQueries(databaseQueryOptimizer.getSlowQueries());
        break;
      case 'logging':
        setAuditStats(comprehensiveAuditSystem.getStats());
        break;
      case 'notifications':
        setNotifications(multiChannelNotificationSystem.getUserNotifications('user-123', true));
        break;
      case 'docs':
        setDocs(interactiveDocumentationSystem.getByCategory('기본'));
        break;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">시스템 최적화</h2>
            <p className="text-sm text-gray-500">데이터베이스, 로깅, 알림, 문서화</p>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'database'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Database size={16} className="inline mr-2" />
            데이터베이스
          </button>
          <button
            onClick={() => setActiveTab('logging')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'logging'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText size={16} className="inline mr-2" />
            로깅
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bell size={16} className="inline mr-2" />
            알림
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'docs'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Book size={16} className="inline mr-2" />
            문서화
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* 데이터베이스 */}
        {activeTab === 'database' && dbStats && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <div className="text-2xl font-bold text-blue-600">{dbStats.totalQueries}</div>
                <div className="text-xs text-gray-500">총 쿼리</div>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                <div className="text-2xl font-bold text-red-600">{dbStats.slowQueries}</div>
                <div className="text-xs text-gray-500">느린 쿼리</div>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                <div className="text-2xl font-bold text-green-600">
                  {dbStats.avgExecutionTime.toFixed(0)}ms
                </div>
                <div className="text-xs text-gray-500">평균 실행시간</div>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-center">
                <div className="text-2xl font-bold text-purple-600">{dbStats.cacheHitRate}%</div>
                <div className="text-xs text-gray-500">캐시 히트율</div>
              </div>
            </div>

            {slowQueries.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">느린 쿼리</h3>
                <div className="space-y-3">
                  {slowQueries.slice(0, 5).map((query) => (
                    <div key={query.query} className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">실행시간: {query.executionTime}ms</span>
                        <span className="text-sm text-gray-600">점수: {query.score}/100</span>
                      </div>
                      <div className="text-sm font-mono text-gray-700 mb-2">{query.query.substring(0, 100)}...</div>
                      {query.suggestions.length > 0 && (
                        <div className="mt-2">
                          {query.suggestions.map((s, i) => (
                            <div key={i} className="text-xs text-gray-600">• {s.description}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 로깅 */}
        {activeTab === 'logging' && auditStats && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <div className="text-2xl font-bold text-blue-600">{auditStats.total}</div>
                <div className="text-xs text-gray-500">총 로그</div>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                <div className="text-2xl font-bold text-green-600">{auditStats.recent}</div>
                <div className="text-xs text-gray-500">최근 24h</div>
              </div>
            </div>
          </div>
        )}

        {/* 알림 */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">알림 ({notifications.length})</h3>
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-400">알림이 없습니다</div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="p-4 bg-white border rounded-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">{notif.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{notif.message}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      notif.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      notif.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {notif.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 문서화 */}
        {activeTab === 'docs' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">문서</h3>
            {docs.map((doc) => (
              <div key={doc.id} className="p-4 bg-white border rounded-xl">
                <div className="font-semibold text-gray-800">{doc.title}</div>
                <div className="text-sm text-gray-600 mt-1">{doc.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

