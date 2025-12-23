/**
 * AI 보안 대시보드
 * 실시간 위협 감지 및 데이터 유출 모니터링
 */

'use client';

import { useEffect, useState } from 'react';
import { GlobalHeader } from '@/components/layout/GlobalHeader';

interface SecurityLog {
  id: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  endpoint: string;
  method: string;
  threatType?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  action: 'blocked' | 'monitored' | 'allowed';
  details: Record<string, any>;
  dataAccessed?: string[];
  dataLeaked?: string[];
}

interface ThreatStats {
  total: number;
  bySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  byThreatType: Record<string, number>;
  byAction: {
    blocked: number;
    monitored: number;
    allowed: number;
  };
  recent: number;
}

interface DataBreachReport {
  id: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cause: string;
  affectedData: string[];
  affectedUsers: number;
  detectionMethod: string;
  status: 'investigating' | 'contained' | 'resolved';
  remediation: string[];
  logs: SecurityLog[];
}

export default function SecurityDashboard() {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [stats, setStats] = useState<ThreatStats | null>(null);
  const [breaches, setBreaches] = useState<DataBreachReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
    // 30초마다 자동 새로고침
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [logsRes, statsRes, breachesRes] = await Promise.all([
        fetch('/api/security/logs?limit=100'),
        fetch('/api/security/threats'),
        fetch('/api/security/breaches'),
      ]);

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData.logs || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (breachesRes.ok) {
        const breachesData = await breachesRes.json();
        setBreaches(breachesData.reports || []);
      }
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'blocked') return log.action === 'blocked';
    if (selectedFilter === 'critical') return log.severity === 'critical';
    return log.threatType === selectedFilter;
  });

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'blocked': return 'text-red-600 bg-red-100';
      case 'monitored': return 'text-yellow-600 bg-yellow-100';
      case 'allowed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI 보안 대시보드
          </h1>
          <p className="text-gray-600">
            실시간 위협 감지 및 데이터 유출 모니터링
          </p>
        </div>

        {/* 통계 카드 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">전체 위협</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500 mt-1">최근 1시간: {stats.recent}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">차단된 요청</div>
              <div className="text-3xl font-bold text-red-600">{stats.byAction.blocked}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Critical 위협</div>
              <div className="text-3xl font-bold text-red-600">{stats.bySeverity.critical}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">모니터링 중</div>
              <div className="text-3xl font-bold text-yellow-600">{stats.byAction.monitored}</div>
            </div>
          </div>
        )}

        {/* 데이터 유출 보고서 */}
        {breaches.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">데이터 유출 보고서</h2>
            </div>
            <div className="p-6">
              {breaches.map((breach) => (
                <div key={breach.id} className="mb-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getSeverityColor(breach.severity)}`}>
                        {breach.severity.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">
                        {new Date(breach.timestamp).toLocaleString('ko-KR')}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      breach.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      breach.status === 'contained' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {breach.status === 'investigating' ? '조사 중' :
                       breach.status === 'contained' ? '차단됨' : '해결됨'}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="font-medium text-gray-900 mb-1">원인:</div>
                    <div className="text-sm text-gray-700">{breach.cause}</div>
                  </div>
                  <div className="mb-2">
                    <div className="font-medium text-gray-900 mb-1">유출된 데이터:</div>
                    <div className="flex flex-wrap gap-2">
                      {breach.affectedData.map((data, idx) => (
                        <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                          {data}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="font-medium text-gray-900 mb-1">대응 방안:</div>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {breach.remediation.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 보안 로그 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">보안 로그</h2>
              <div className="flex gap-2">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="all">전체</option>
                  <option value="blocked">차단됨</option>
                  <option value="critical">Critical</option>
                  <option value="sql_injection">SQL Injection</option>
                  <option value="xss">XSS</option>
                  <option value="ddos">DDoS</option>
                  <option value="data_exfiltration">데이터 유출</option>
                </select>
                <button
                  onClick={loadData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  새로고침
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">시간</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP 주소</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">엔드포인트</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">위협 유형</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">심각도</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">조치</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상세</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.timestamp).toLocaleString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.method} {log.endpoint}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.threatType || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.severity && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(log.severity)}`}>
                          {log.severity.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                        {log.action === 'blocked' ? '차단됨' :
                         log.action === 'monitored' ? '모니터링' : '허용됨'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.dataLeaked && log.dataLeaked.length > 0 && (
                        <div className="text-red-600">
                          유출: {log.dataLeaked.join(', ')}
                        </div>
                      )}
                      {log.dataAccessed && log.dataAccessed.length > 0 && (
                        <div className="text-blue-600">
                          접근: {log.dataAccessed.join(', ')}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLogs.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                로그가 없습니다
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
