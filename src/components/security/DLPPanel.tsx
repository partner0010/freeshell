'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  FileText,
} from 'lucide-react';
import {
  dlpSystem,
  type DataLeakEvent,
} from '@/lib/security/dlp';

export function DLPPanel() {
  const [content, setContent] = useState('');
  const [scanResult, setScanResult] = useState<ReturnType<typeof dlpSystem.scanData> | null>(null);
  const [events, setEvents] = useState<DataLeakEvent[]>([]);
  const [stats, setStats] = useState(dlpSystem.getStats());

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    setEvents(dlpSystem.getEvents(50));
    setStats(dlpSystem.getStats());
  };

  const handleScan = () => {
    const result = dlpSystem.scanData(content, { location: 'user-input' });
    setScanResult(result);
    loadEvents();
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-600 rounded-xl flex items-center justify-center">
            <Eye className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">데이터 유출 방지 (DLP)</h2>
            <p className="text-sm text-gray-500">민감 정보 탐지 및 보호</p>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="검사할 내용을 입력하세요..."
            className="w-full px-4 py-3 border rounded-lg resize-none"
            rows={4}
          />
          <button
            onClick={handleScan}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <Shield size={16} />
            데이터 검사
          </button>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-xs text-gray-500">총 탐지</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
            <div className="text-xs text-gray-500">차단됨</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.warned}</div>
            <div className="text-xs text-gray-500">경고</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* 스캔 결과 */}
        {scanResult && (
          <section>
            <div className={`p-4 rounded-xl border-2 ${
              scanResult.detected
                ? 'bg-red-50 border-red-200'
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {scanResult.detected ? (
                  <AlertTriangle className="text-red-600" size={24} />
                ) : (
                  <CheckCircle2 className="text-green-600" size={24} />
                )}
                <span className="font-semibold">
                  {scanResult.detected ? '민감 정보가 감지되었습니다' : '민감 정보가 없습니다'}
                </span>
              </div>

              {scanResult.events.length > 0 && (
                <div className="space-y-2">
                  {scanResult.events.map((event) => (
                    <div key={event.id} className="p-3 bg-white rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{event.dataType}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          event.action === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {event.action === 'blocked' ? '차단됨' : '경고'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {scanResult.sanitized && (
                <div className="mt-4">
                  <div className="text-sm font-semibold mb-2">마스킹된 내용</div>
                  <div className="p-3 bg-white rounded-lg font-mono text-sm">
                    {scanResult.sanitized}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 이벤트 이력 */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4">탐지 이력</h3>
          <div className="space-y-2">
            {events.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                탐지 이벤트가 없습니다
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 border-2 rounded-xl ${
                    event.action === 'blocked' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-800">{event.dataType}</div>
                    <span className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    위치: {event.location} • {event.action === 'blocked' ? '차단됨' : '경고'}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

