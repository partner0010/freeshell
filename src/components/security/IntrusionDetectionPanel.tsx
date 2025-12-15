'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Eye,
  XCircle,
} from 'lucide-react';
import {
  idsSystem,
  type IntrusionAlert,
  type BehaviorPattern,
} from '@/lib/security/intrusion-detection';

export function IntrusionDetectionPanel() {
  const [alerts, setAlerts] = useState<IntrusionAlert[]>([]);
  const [patterns, setPatterns] = useState<BehaviorPattern[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    const unsubscribe = idsSystem.subscribe((alert) => {
      setAlerts((prev) => [alert, ...prev]);
    });

    loadData();

    return () => unsubscribe();
  }, []);

  const loadData = () => {
    setAlerts(idsSystem.getAlerts(50));
    setPatterns(idsSystem.getBehaviorPatterns());
  };

  const handleStartMonitoring = () => {
    setIsMonitoring(true);
    // 실제로는 네트워크 요청을 모니터링
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'brute-force':
      case 'sql-injection':
      case 'xss':
      case 'dos':
        return <AlertTriangle className="text-red-600" size={20} />;
      default:
        return <Eye className="text-yellow-600" size={20} />;
    }
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
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">침입 탐지 시스템</h2>
              <p className="text-sm text-gray-500">실시간 위협 탐지 및 차단</p>
            </div>
          </div>
          <button
            onClick={handleStartMonitoring}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              isMonitoring
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isMonitoring ? (
              <>
                <CheckCircle2 size={16} />
                모니터링 중
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                모니터링 시작
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* 알림 */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4">보안 알림 ({alerts.length})</h3>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                알림이 없습니다
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border-2 rounded-xl ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <div className="font-semibold text-gray-800">{alert.description}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {alert.source} → {alert.target}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.blocked && (
                        <span className="px-2 py-1 bg-red-200 text-red-700 rounded text-xs">
                          차단됨
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                  {alert.evidence.length > 0 && (
                    <details className="mt-3">
                      <summary className="text-xs cursor-pointer">증거 보기</summary>
                      <ul className="mt-2 space-y-1 text-xs">
                        {alert.evidence.map((ev, i) => (
                          <li key={i}>• {ev}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* 행동 패턴 */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4">의심스러운 행동 패턴</h3>
          <div className="space-y-3">
            {patterns.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                패턴이 없습니다
              </div>
            ) : (
              patterns
                .filter((p) => p.riskScore > 30)
                .sort((a, b) => b.riskScore - a.riskScore)
                .map((pattern) => (
                  <div
                    key={pattern.ip}
                    className="p-4 bg-white border rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-gray-800">{pattern.ip}</div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">{pattern.riskScore}</div>
                        <div className="text-xs text-gray-500">위험 점수</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">요청 수</div>
                        <div className="font-medium">{pattern.requestCount}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">에러 수</div>
                        <div className="font-medium">{pattern.errorCount}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">마지막 활동</div>
                        <div className="font-medium">
                          {new Date(pattern.lastSeen).toLocaleTimeString()}
                        </div>
                      </div>
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

