'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Play,
  RefreshCw,
  X,
  Plus,
} from 'lucide-react';
import {
  wafSystem,
  type WAFRequest,
  type WAFRule,
} from '@/lib/security/waf';

export function WAFPanel() {
  const [rules, setRules] = useState<WAFRule[]>(wafSystem.getRules());
  const [testRequest, setTestRequest] = useState<Partial<WAFRequest>>({
    ip: '192.168.1.100',
    method: 'GET',
    path: '/api/users',
    userAgent: 'Mozilla/5.0...',
  });
  const [testResult, setTestResult] = useState<ReturnType<typeof wafSystem.inspectRequest> | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    try {
      const result = await wafSystem.inspectRequest(testRequest as WAFRequest);
      setTestResult(result);
    } catch (error) {
      alert(`테스트 실패: ${error}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleToggleRule = (ruleId: string) => {
    const rule = rules.find((r) => r.id === ruleId);
    if (rule) {
      rule.enabled = !rule.enabled;
      wafSystem.addRule(rule);
      setRules([...rules]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">WAF</h2>
            <p className="text-sm text-gray-500">웹 애플리케이션 방화벽</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* 규칙 목록 */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4">보안 규칙</h3>
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 bg-white border rounded-xl flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{rule.name}</span>
                    {rule.enabled ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                        활성
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                        비활성
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{rule.condition}</div>
                </div>
                <button
                  onClick={() => handleToggleRule(rule.id)}
                  className={`p-2 rounded ${
                    rule.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {rule.enabled ? <CheckCircle2 size={20} /> : <X size={20} />}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 요청 테스트 */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4">요청 테스트</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IP 주소</label>
              <input
                type="text"
                value={testRequest.ip}
                onChange={(e) => setTestRequest({ ...testRequest, ip: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">경로</label>
              <input
                type="text"
                value={testRequest.path}
                onChange={(e) => setTestRequest({ ...testRequest, path: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <button
              onClick={handleTest}
              disabled={isTesting}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  테스트 중...
                </>
              ) : (
                <>
                  <Play size={16} />
                  요청 검사
                </>
              )}
            </button>

            {testResult && (
              <div
                className={`p-4 rounded-xl border-2 ${
                  testResult.allowed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {testResult.allowed ? (
                    <CheckCircle2 className="text-green-600" size={24} />
                  ) : (
                    <AlertTriangle className="text-red-600" size={24} />
                  )}
                  <span className="font-semibold">
                    {testResult.allowed ? '허용됨' : '차단됨'}
                  </span>
                </div>
                {testResult.reason && (
                  <div className="text-sm text-gray-700">{testResult.reason}</div>
                )}
                {testResult.challenge && (
                  <div className="text-sm text-gray-700 mt-2">
                    추가 검증 필요: {testResult.challenge}
                  </div>
                )}
                {testResult.matchedRules.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm font-semibold mb-1">매칭된 규칙</div>
                    <div className="text-sm text-gray-600">
                      {testResult.matchedRules.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

