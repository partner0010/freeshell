'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plug,
  Plus,
  Play,
  Trash2,
  Edit2,
  Check,
  X,
  RefreshCw,
  Clock,
  Zap,
  Code,
  ExternalLink,
  Settings,
  AlertCircle,
  CheckCircle,
  Globe,
  Key,
  Copy,
} from 'lucide-react';

interface APIConnection {
  id: string;
  name: string;
  type: 'rest' | 'graphql' | 'webhook';
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  status: 'active' | 'error' | 'pending';
  lastSync?: string;
  syncInterval?: number;
}

interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  lastRun?: string;
  runCount: number;
}

export function APIConnector() {
  const [activeTab, setActiveTab] = useState<'connections' | 'automations' | 'logs'>('connections');
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const [connections, setConnections] = useState<APIConnection[]>([
    {
      id: '1',
      name: 'OpenAI API',
      type: 'rest',
      url: 'https://api.openai.com/v1',
      method: 'POST',
      headers: { 'Authorization': 'Bearer sk-***', 'Content-Type': 'application/json' },
      status: 'active',
      lastSync: '2024-12-05 14:30',
    },
    {
      id: '2',
      name: 'Google Sheets',
      type: 'rest',
      url: 'https://sheets.googleapis.com/v4',
      method: 'GET',
      headers: { 'Authorization': 'Bearer ya29.***' },
      status: 'active',
      lastSync: '2024-12-05 14:00',
      syncInterval: 60,
    },
    {
      id: '3',
      name: 'Slack Webhook',
      type: 'webhook',
      url: 'https://hooks.slack.com/services/***',
      method: 'POST',
      headers: {},
      status: 'pending',
    },
  ]);
  
  const [automations] = useState<Automation[]>([
    { id: '1', name: '새 사용자 환영', trigger: '새 가입', action: 'Slack 알림 발송', enabled: true, lastRun: '2024-12-05 13:45', runCount: 156 },
    { id: '2', name: '주문 완료 알림', trigger: '주문 완료', action: '이메일 발송 + 시트 업데이트', enabled: true, lastRun: '2024-12-05 14:20', runCount: 89 },
    { id: '3', name: '일일 리포트', trigger: '매일 09:00', action: 'AI 리포트 생성', enabled: false, runCount: 30 },
  ]);
  
  const [newConnection, setNewConnection] = useState({
    name: '',
    type: 'rest' as const,
    url: '',
    method: 'GET' as const,
    apiKey: '',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-600';
      case 'error':
        return 'bg-red-100 text-red-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const testConnection = async (connection: APIConnection) => {
    // 시뮬레이션
    setTestResult(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTestResult({ success: true, message: '연결 성공! 응답 시간: 123ms' });
  };

  const popularIntegrations = [
    { name: 'OpenAI', icon: '🤖', category: 'AI' },
    { name: 'Google Sheets', icon: '📊', category: 'Productivity' },
    { name: 'Slack', icon: '💬', category: 'Communication' },
    { name: 'Stripe', icon: '💳', category: 'Payment' },
    { name: 'Notion', icon: '📝', category: 'Productivity' },
    { name: 'Airtable', icon: '📋', category: 'Database' },
    { name: 'Discord', icon: '🎮', category: 'Communication' },
    { name: 'GitHub', icon: '⚫', category: 'Development' },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Plug className="w-5 h-5 text-primary-500" />
          API 연결
        </h3>
        <button
          onClick={() => setShowAddConnection(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm"
        >
          <Plus className="w-4 h-4" />
          연결
        </button>
      </div>
      
      {/* 탭 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {[
          { id: 'connections', label: '연결', icon: Plug },
          { id: 'automations', label: '자동화', icon: Zap },
          { id: 'logs', label: '로그', icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* 연결 목록 */}
      {activeTab === 'connections' && (
        <div className="space-y-3">
          {connections.map((connection) => (
            <motion.div
              key={connection.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 dark:text-white text-sm">{connection.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(connection.status)}`}>
                        {connection.status === 'active' ? '활성' : connection.status === 'error' ? '오류' : '대기'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{connection.url}</p>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => testConnection(connection)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                    title="테스트"
                  >
                    <Play className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                    <Settings className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-600">
                <span className="text-xs text-gray-500">
                  {connection.method} • {connection.type.toUpperCase()}
                </span>
                {connection.lastSync && (
                  <span className="text-xs text-gray-500">마지막 동기화: {connection.lastSync}</span>
                )}
              </div>
            </motion.div>
          ))}
          
          {/* 테스트 결과 */}
          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg ${
                testResult.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
              }`}
            >
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  {testResult.message}
                </span>
              </div>
            </motion.div>
          )}
          
          {/* 인기 통합 */}
          <div className="pt-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">인기 통합</h4>
            <div className="grid grid-cols-4 gap-2">
              {popularIntegrations.map((integration) => (
                <button
                  key={integration.name}
                  className="flex flex-col items-center p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 transition-colors"
                >
                  <span className="text-xl mb-1">{integration.icon}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{integration.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* 자동화 */}
      {activeTab === 'automations' && (
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm">
            <Zap className="w-4 h-4" />
            자동화 만들기
          </button>
          
          {automations.map((automation) => (
            <motion.div
              key={automation.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className={`w-4 h-4 ${automation.enabled ? 'text-yellow-500' : 'text-gray-400'}`} />
                    <span className="font-medium text-gray-800 dark:text-white text-sm">{automation.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {automation.trigger} → {automation.action}
                  </p>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={automation.enabled}
                    className="sr-only peer"
                    readOnly
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500" />
                </label>
              </div>
              
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-600">
                <span className="text-xs text-gray-500">{automation.runCount}회 실행됨</span>
                {automation.lastRun && (
                  <span className="text-xs text-gray-500">마지막: {automation.lastRun}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* 로그 */}
      {activeTab === 'logs' && (
        <div className="space-y-2">
          {[
            { time: '14:30:45', event: 'OpenAI API 호출 성공', status: 'success' },
            { time: '14:28:12', event: 'Google Sheets 동기화 완료', status: 'success' },
            { time: '14:25:00', event: 'Slack Webhook 연결 실패', status: 'error' },
            { time: '14:20:33', event: '자동화 "새 사용자 환영" 실행', status: 'success' },
          ].map((log, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <span className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-500 font-mono">{log.time}</span>
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{log.event}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* 연결 추가 모달 */}
      <AnimatePresence>
        {showAddConnection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddConnection(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">새 API 연결</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">이름 *</label>
                  <input
                    type="text"
                    value={newConnection.name}
                    onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="예: My API"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">타입</label>
                  <select
                    value={newConnection.type}
                    onChange={(e) => setNewConnection({ ...newConnection, type: e.target.value as 'rest' })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="rest">REST API</option>
                    <option value="graphql">GraphQL</option>
                    <option value="webhook">Webhook</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">URL *</label>
                  <input
                    type="url"
                    value={newConnection.url}
                    onChange={(e) => setNewConnection({ ...newConnection, url: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="https://api.example.com"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">API 키</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={newConnection.apiKey}
                      onChange={(e) => setNewConnection({ ...newConnection, apiKey: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      placeholder="sk-***"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddConnection(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    취소
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    연결
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default APIConnector;

