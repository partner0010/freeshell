'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Eye,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import {
  behavioralAnalyticsSecurity,
  type UserBehavior,
  type SecurityAlert,
} from '@/lib/security/behavioral-analytics';

export function BehavioralSecurityPanel() {
  const [behaviors, setBehaviors] = useState<UserBehavior[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('user-123');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    // 시뮬레이션 데이터
    const behavior = behavioralAnalyticsSecurity.getBehavior(selectedUserId);
    if (behavior) {
      setBehaviors([behavior]);
    }
    setAlerts(behavioralAnalyticsSecurity.getAlerts());
  };

  const handleSimulateBehavior = () => {
    // 행동 패턴 시뮬레이션
    behavioralAnalyticsSecurity.updateBehavior(selectedUserId, {
      type: 'typing',
      value: Math.random() * 100,
    });
    loadData();
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">행동 분석 보안</h2>
            <p className="text-sm text-gray-500">사용자 행동 기반 보안 분석</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* 행동 분석 */}
        {behaviors.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-4">사용자 행동 분석</h3>
            {behaviors.map((behavior) => (
              <div key={behavior.userId} className="p-4 bg-white border rounded-xl mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-semibold text-gray-800">사용자: {behavior.userId}</div>
                    <div className="text-sm text-gray-600">
                      업데이트: {new Date(behavior.lastUpdated).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getRiskColor(behavior.riskScore)}`}>
                      {behavior.riskScore}
                    </div>
                    <div className="text-xs text-gray-500">위험 점수</div>
                  </div>
                </div>

                {/* 이상 항목 */}
                {behavior.anomalies.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">이상 항목</div>
                    <div className="space-y-2">
                      {behavior.anomalies.map((anomaly, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg ${
                            anomaly.severity === 'critical' || anomaly.severity === 'high'
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-yellow-50 border border-yellow-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-800">{anomaly.description}</span>
                            <span className="text-xs px-2 py-1 bg-white rounded">
                              {anomaly.severity}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            신뢰도: {(anomaly.confidence * 100).toFixed(0)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSimulateBehavior}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                >
                  행동 패턴 시뮬레이션
                </button>
              </div>
            ))}
          </section>
        )}

        {/* 보안 알림 */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4">보안 알림 ({alerts.length})</h3>
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">알림이 없습니다</div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border-2 rounded-xl ${
                    alert.severity === 'critical'
                      ? 'bg-red-50 border-red-300'
                      : alert.severity === 'high'
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-yellow-50 border-yellow-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-800">{alert.description}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        타입: {alert.type} • 사용자: {alert.userId}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      alert.severity === 'critical'
                        ? 'bg-red-200 text-red-800'
                        : alert.severity === 'high'
                        ? 'bg-orange-200 text-orange-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {alert.action}
                    </span>
                  </div>
                  {alert.evidence.length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-gray-600">증거 보기</summary>
                      <ul className="mt-2 space-y-1 text-xs">
                        {alert.evidence.map((ev, i) => (
                          <li key={i}>• {ev}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

