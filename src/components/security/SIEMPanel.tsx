'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  FileText,
  Filter,
  Download,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import {
  siemSystem,
  type SecurityEvent,
  type ForensicAnalysis,
} from '@/lib/security/siem-forensic';

export function SIEMPanel() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [analysis, setAnalysis] = useState<ForensicAnalysis | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    setEvents(siemSystem.getEvents(100));
  };

  const handleAnalyze = () => {
    if (!selectedEvent) return;
    const forensic = siemSystem.analyzeForensics([selectedEvent.id]);
    setAnalysis(forensic);
  };

  const filteredEvents = events.filter((e) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      e.source.toLowerCase().includes(query) ||
      e.target.toLowerCase().includes(query) ||
      e.action.toLowerCase().includes(query) ||
      e.user?.toLowerCase().includes(query)
    );
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-xl flex items-center justify-center">
              <Search className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">SIEM & 포렌식</h2>
              <p className="text-sm text-gray-500">보안 이벤트 분석 및 조사</p>
            </div>
          </div>
          <button
            onClick={loadEvents}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <RefreshCw size={16} />
            새로고침
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="이벤트 검색..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* 이벤트 목록 */}
          <div className="col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4">보안 이벤트 ({filteredEvents.length})</h3>
            <div className="space-y-2">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => {
                    setSelectedEvent(event);
                    setAnalysis(null);
                  }}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedEvent?.id === event.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${getSeverityColor(event.severity)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-800">{event.action}</div>
                    <span className="text-xs px-2 py-1 bg-white rounded">
                      {event.severity}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {event.source} → {event.target}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(event.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 상세 정보 */}
          <div>
            {selectedEvent && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">이벤트 상세</h3>
                  <div className="p-4 bg-white border rounded-xl space-y-2">
                    <div>
                      <div className="text-xs text-gray-500">타입</div>
                      <div className="font-medium">{selectedEvent.type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">소스</div>
                      <div className="font-medium">{selectedEvent.source}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">타겟</div>
                      <div className="font-medium">{selectedEvent.target}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">사용자</div>
                      <div className="font-medium">{selectedEvent.user || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">결과</div>
                      <div className="font-medium">{selectedEvent.result}</div>
                    </div>
                    <button
                      onClick={handleAnalyze}
                      className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      포렌식 분석
                    </button>
                  </div>
                </div>

                {analysis && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">포렌식 분석</h3>
                    <div className="p-4 bg-white border rounded-xl space-y-4">
                      <div>
                        <div className="text-sm font-semibold mb-2">발견 사항</div>
                        <ul className="space-y-1">
                          {analysis.findings.map((finding, i) => (
                            <li key={i} className="text-sm text-gray-700">• {finding}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm font-semibold mb-2">권장사항</div>
                        <ul className="space-y-1">
                          {analysis.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-gray-700">• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

