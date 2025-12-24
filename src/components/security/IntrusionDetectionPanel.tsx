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
  getBlockedIPs,
  type IntrusionAlert,
} from '@/lib/security/intrusion-detection';
import { getSecurityEvents } from '@/lib/security/security-monitor';

export function IntrusionDetectionPanel() {
  const [alerts, setAlerts] = useState<IntrusionAlert[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<string[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    loadData();
    // 주기적으로 데이터 새로고침
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      // 보안 이벤트에서 침입 관련 이벤트 가져오기
      const events = getSecurityEvents({ 
        type: 'intrusion', 
        limit: 50 
      });
      
      // IntrusionAlert 형식으로 변환
      const intrusionAlerts: IntrusionAlert[] = events.map(event => ({
        type: event.details.type || 'suspicious_activity',
        severity: event.severity,
        ip: event.source,
        userAgent: event.details.userAgent || 'unknown',
        path: event.details.path || 'unknown',
        timestamp: event.timestamp,
        details: event.details.details || '',
        blocked: event.details.blocked || false,
      }));
      
      setAlerts(intrusionAlerts);
      setBlockedIPs(getBlockedIPs());
    } catch (error) {
      console.error('Failed to load intrusion data:', error);
    }
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
              alerts.map((alert, index) => (
                <div
                  key={`${alert.ip}-${alert.timestamp.getTime()}-${index}`}
                  className={`p-4 border-2 rounded-xl ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <div className="font-semibold text-gray-800">{alert.details}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {alert.ip} → {alert.path}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {alert.userAgent}
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
                </div>
              ))
            )}
          </div>
        </section>

        {/* 차단된 IP */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4">차단된 IP ({blockedIPs.length})</h3>
          <div className="space-y-3">
            {blockedIPs.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                차단된 IP가 없습니다
              </div>
            ) : (
              blockedIPs.map((ip) => (
                <div
                  key={ip}
                  className="p-4 bg-white border rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-800">{ip}</div>
                    <span className="px-2 py-1 bg-red-200 text-red-700 rounded text-xs">
                      차단됨
                    </span>
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

