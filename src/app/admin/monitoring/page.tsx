'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Globe,
  Users,
  Zap,
  BarChart3,
  AlertCircle,
  Settings,
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  history: number[];
}

interface ServerStatus {
  id: string;
  name: string;
  type: 'web' | 'api' | 'database' | 'cache';
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  cpu: number;
  memory: number;
  region: string;
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  source: string;
  timestamp: string;
  resolved: boolean;
}

export default function SystemMonitoringPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'servers' | 'performance' | 'alerts'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [metrics] = useState<SystemMetric[]>([
    { name: 'CPU 사용률', value: 45, unit: '%', status: 'healthy', trend: 'stable', history: [42, 44, 46, 45, 43, 45] },
    { name: '메모리', value: 68, unit: '%', status: 'healthy', trend: 'up', history: [60, 62, 64, 66, 67, 68] },
    { name: '디스크', value: 52, unit: '%', status: 'healthy', trend: 'stable', history: [51, 51, 52, 52, 52, 52] },
    { name: '네트워크', value: 234, unit: 'Mbps', status: 'healthy', trend: 'down', history: [280, 260, 250, 245, 240, 234] },
  ]);

  const [servers] = useState<ServerStatus[]>([
    { id: '1', name: 'web-prod-01', type: 'web', status: 'online', uptime: '45일 12시간', cpu: 32, memory: 58, region: 'ap-northeast-2' },
    { id: '2', name: 'web-prod-02', type: 'web', status: 'online', uptime: '45일 12시간', cpu: 28, memory: 54, region: 'ap-northeast-2' },
    { id: '3', name: 'api-prod-01', type: 'api', status: 'online', uptime: '30일 8시간', cpu: 45, memory: 72, region: 'ap-northeast-2' },
    { id: '4', name: 'db-prod-01', type: 'database', status: 'online', uptime: '120일 4시간', cpu: 38, memory: 85, region: 'ap-northeast-2' },
    { id: '5', name: 'cache-prod-01', type: 'cache', status: 'degraded', uptime: '15일 2시간', cpu: 65, memory: 78, region: 'ap-northeast-2' },
  ]);

  const [alerts] = useState<Alert[]>([
    { id: '1', type: 'warning', message: '캐시 서버 응답 시간 증가 (평균 120ms → 250ms)', source: 'cache-prod-01', timestamp: '2024-12-05 14:30', resolved: false },
    { id: '2', type: 'info', message: '자동 백업 완료', source: 'db-prod-01', timestamp: '2024-12-05 03:00', resolved: true },
    { id: '3', type: 'error', message: 'API 요청 타임아웃 발생 (5건)', source: 'api-prod-01', timestamp: '2024-12-04 22:15', resolved: true },
    { id: '4', type: 'info', message: 'SSL 인증서 갱신 완료', source: 'web-prod-01', timestamp: '2024-12-04 12:00', resolved: true },
  ]);

  const overviewStats = {
    activeUsers: 342,
    requestsPerMin: 1250,
    avgResponseTime: 85,
    errorRate: 0.02,
    uptime: 99.98,
    storage: { used: 245, total: 500 },
  };

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'healthy':
        return 'text-green-500';
      case 'degraded':
      case 'warning':
        return 'text-yellow-500';
      case 'offline':
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'online':
      case 'healthy':
        return 'bg-green-100';
      case 'degraded':
      case 'warning':
        return 'bg-yellow-100';
      case 'offline':
      case 'critical':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getServerIcon = (type: string) => {
    switch (type) {
      case 'web': return Globe;
      case 'api': return Zap;
      case 'database': return Database;
      case 'cache': return Server;
      default: return Server;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">시스템 모니터링</h1>
          <p className="text-gray-500 mt-1">서버 상태 및 성능을 모니터링합니다</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            마지막 업데이트: {lastUpdated.toLocaleTimeString()}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="accent-primary-500"
            />
            자동 새로고침
          </label>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
            새로고침
          </button>
        </div>
      </div>

      {/* 상태 요약 */}
      <div className="flex gap-4">
        {[
          { status: 'online', count: servers.filter((s) => s.status === 'online').length, label: '정상' },
          { status: 'degraded', count: servers.filter((s) => s.status === 'degraded').length, label: '주의' },
          { status: 'offline', count: servers.filter((s) => s.status === 'offline').length, label: '오프라인' },
        ].map((item) => (
          <div key={item.status} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getStatusBg(item.status)}`}>
            <span className={`w-2 h-2 rounded-full ${getStatusColor(item.status)} bg-current`} />
            <span className="font-medium">{item.count}</span>
            <span className="text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      {/* 탭 */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'overview', label: '개요', icon: Activity },
          { id: 'servers', label: '서버', icon: Server },
          { id: 'performance', label: '성능', icon: BarChart3 },
          { id: 'alerts', label: '알림', icon: AlertTriangle, badge: alerts.filter((a) => !a.resolved).length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.badge && tab.badge > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* 개요 */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 실시간 지표 */}
          <div className="grid grid-cols-6 gap-4">
            {[
              { label: '실시간 사용자', value: overviewStats.activeUsers, icon: Users, color: 'text-blue-500' },
              { label: '요청/분', value: overviewStats.requestsPerMin.toLocaleString(), icon: Activity, color: 'text-green-500' },
              { label: '응답 시간', value: overviewStats.avgResponseTime + 'ms', icon: Zap, color: 'text-purple-500' },
              { label: '에러율', value: overviewStats.errorRate + '%', icon: AlertCircle, color: 'text-orange-500' },
              { label: '가동률', value: overviewStats.uptime + '%', icon: CheckCircle, color: 'text-cyan-500' },
              { label: '스토리지', value: `${overviewStats.storage.used}/${overviewStats.storage.total}GB`, icon: HardDrive, color: 'text-gray-500' },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-sm text-gray-500">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* 시스템 메트릭 */}
          <div className="grid grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <div key={metric.name} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">{metric.name}</span>
                  <span className={`flex items-center gap-1 text-xs ${
                    metric.trend === 'up' ? 'text-green-500' :
                    metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
                     metric.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-gray-800">
                    {metric.value}<span className="text-lg text-gray-400">{metric.unit}</span>
                  </span>
                  <span className={`w-3 h-3 rounded-full ${getStatusBg(metric.status)} ${getStatusColor(metric.status)}`} />
                </div>
                {/* 미니 차트 */}
                <div className="flex items-end gap-1 mt-3 h-8">
                  {metric.history.map((val, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary-200 rounded-t"
                      style={{ height: `${(val / 100) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 서버 탭 */}
      {activeTab === 'servers' && (
        <div className="grid grid-cols-2 gap-4">
          {servers.map((server) => {
            const TypeIcon = getServerIcon(server.type);
            return (
              <div key={server.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${getStatusBg(server.status)} flex items-center justify-center`}>
                      <TypeIcon className={`w-5 h-5 ${getStatusColor(server.status)}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{server.name}</p>
                      <p className="text-xs text-gray-500">{server.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(server.status)} bg-current animate-pulse`} />
                    <span className={`text-sm font-medium ${getStatusColor(server.status)}`}>
                      {server.status === 'online' ? '정상' : server.status === 'degraded' ? '주의' : '오프라인'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">CPU</p>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${server.cpu > 80 ? 'bg-red-500' : server.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${server.cpu}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{server.cpu}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">메모리</p>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${server.memory > 80 ? 'bg-red-500' : server.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${server.memory}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{server.memory}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">가동시간</p>
                    <p className="text-sm font-medium text-gray-800">{server.uptime}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 알림 탭 */}
      {activeTab === 'alerts' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">시스템 알림</h3>
            <button className="text-sm text-primary-600 hover:underline">모두 읽음 처리</button>
          </div>
          <div className="divide-y divide-gray-100">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 flex items-start gap-4 ${alert.resolved ? 'opacity-60' : ''}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  alert.type === 'error' ? 'bg-red-100' :
                  alert.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  {alert.type === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : alert.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{alert.message}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>{alert.source}</span>
                    <span>•</span>
                    <span>{alert.timestamp}</span>
                    {alert.resolved && (
                      <>
                        <span>•</span>
                        <span className="text-green-500">해결됨</span>
                      </>
                    )}
                  </div>
                </div>
                {!alert.resolved && (
                  <button className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-lg">
                    해결
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 성능 탭 */}
      {activeTab === 'performance' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">성능 분석</h3>
          <p className="text-gray-500">상세한 성능 메트릭과 차트가 여기에 표시됩니다</p>
        </div>
      )}
    </div>
  );
}

