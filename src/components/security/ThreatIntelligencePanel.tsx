'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Search,
  RefreshCw,
  TrendingUp,
  Globe,
  Shield,
} from 'lucide-react';
import {
  threatIntelligenceSystem,
  type ThreatIndicator,
} from '@/lib/security/threat-intelligence';

export function ThreatIntelligencePanel() {
  const [indicators, setIndicators] = useState<ThreatIndicator[]>([]);
  const [stats, setStats] = useState(threatIntelligenceSystem.getThreatStats());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadIndicators();
  }, []);

  const loadIndicators = () => {
    setIndicators(threatIntelligenceSystem.getAllIndicators(100));
    setStats(threatIntelligenceSystem.getThreatStats());
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      loadIndicators();
      return;
    }
    const results = threatIntelligenceSystem.searchIOCs(searchQuery);
    setIndicators(results);
  };

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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center">
              <Globe className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">위협 인텔리전스</h2>
              <p className="text-sm text-gray-500">IOCs 및 위협 지표 관리</p>
            </div>
          </div>
          <button
            onClick={loadIndicators}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <RefreshCw size={16} />
            새로고침
          </button>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-xs text-gray-500">총 지표</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{stats.bySeverity.critical || 0}</div>
            <div className="text-xs text-gray-500">Critical</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.bySeverity.high || 0}</div>
            <div className="text-xs text-gray-500">High</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.recent}</div>
            <div className="text-xs text-gray-500">최근 24h</div>
          </div>
        </div>

        {/* 검색 */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="IP, 도메인, 해시로 검색..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            검색
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-3">
          {indicators.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              위협 지표가 없습니다
            </div>
          ) : (
            indicators.map((indicator) => (
              <div
                key={indicator.id}
                className={`p-4 border-2 rounded-xl ${getSeverityColor(indicator.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-800">{indicator.value}</div>
                    <div className="text-sm text-gray-600 mt-1">{indicator.threatType}</div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(indicator.severity)}`}>
                      {indicator.severity}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      신뢰도: {indicator.confidence}%
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{indicator.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>소스: {indicator.source}</span>
                  <span>마지막 발견: {new Date(indicator.lastSeen).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

