'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Play,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Download,
  Target,
} from 'lucide-react';
import {
  penetrationTestingSystem,
  type PenTest,
} from '@/lib/security/penetration-testing';

export function PenetrationTestPanel() {
  const [target, setTarget] = useState('https://example.com');
  const [testName, setTestName] = useState('종합 침투 테스트');
  const [isRunning, setIsRunning] = useState(false);
  const [tests, setTests] = useState<PenTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<PenTest | null>(null);

  const handleRunTest = async () => {
    setIsRunning(true);
    try {
      const test = await penetrationTestingSystem.runPenTest({
        target,
        name: testName,
      });
      setTests((prev) => [test, ...prev]);
      setSelectedTest(test);
    } catch (error) {
      alert(`테스트 실패: ${error}`);
    } finally {
      setIsRunning(false);
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
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-orange-600 rounded-xl flex items-center justify-center">
            <Target className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">침투 테스트</h2>
            <p className="text-sm text-gray-500">자동화된 보안 침투 테스트</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">테스트 이름</label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-4 py-3 border rounded-lg"
            />
            <button
              onClick={handleRunTest}
              disabled={isRunning || !target.trim()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  테스트 중...
                </>
              ) : (
                <>
                  <Play size={20} />
                  테스트 시작
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {tests.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Target className="text-gray-300 mx-auto mb-4" size={64} />
              <p className="text-gray-500 text-lg mb-2">침투 테스트를 시작하세요</p>
              <p className="text-gray-400 text-sm">
                자동화된 보안 침투 테스트로 취약점을 발견합니다
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 테스트 목록 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-4">테스트 이력</h3>
              <div className="space-y-3">
                {tests.map((test) => (
                  <div
                    key={test.id}
                    onClick={() => setSelectedTest(test)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedTest?.id === test.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-800">{test.name}</div>
                        <div className="text-sm text-gray-500">{test.target}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">
                          {test.status === 'completed' ? '완료' : test.status === 'running' ? '진행중' : '실패'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {test.completedAt
                            ? `${((test.completedAt - test.startedAt) / 1000).toFixed(1)}s`
                            : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 선택된 테스트 상세 */}
            {selectedTest && (
              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-4">테스트 결과</h3>

                {/* 요약 */}
                <div className="grid grid-cols-5 gap-4 mb-6">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{selectedTest.summary.critical}</div>
                    <div className="text-xs text-gray-500">Critical</div>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">{selectedTest.summary.high}</div>
                    <div className="text-xs text-gray-500">High</div>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">{selectedTest.summary.medium}</div>
                    <div className="text-xs text-gray-500">Medium</div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedTest.summary.low}</div>
                    <div className="text-xs text-gray-500">Low</div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedTest.summary.passed}</div>
                    <div className="text-xs text-gray-500">Passed</div>
                  </div>
                </div>

                {/* 발견 사항 */}
                <div className="space-y-3">
                  {selectedTest.findings.map((finding) => (
                    <div
                      key={finding.id}
                      className={`p-5 border-2 rounded-xl ${getSeverityColor(finding.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 mb-1">{finding.title}</div>
                          <div className="text-sm text-gray-600 mb-2">{finding.description}</div>
                          {finding.cwe && (
                            <div className="text-xs text-gray-500">
                              CWE: {finding.cwe} {finding.cvss && `• CVSS: ${finding.cvss}`}
                            </div>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                          {finding.severity}
                        </span>
                      </div>

                      <div className="bg-white/80 rounded-lg p-3 mb-3">
                        <div className="text-xs font-semibold text-gray-700 mb-1">증거</div>
                        <div className="text-sm font-mono text-gray-800">{finding.evidence}</div>
                      </div>

                      <div className="mb-3">
                        <div className="text-xs font-semibold text-gray-700 mb-1">영향</div>
                        <div className="text-sm text-gray-800">{finding.impact}</div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-gray-700 mb-1">수정 방법</div>
                        <div className="text-sm text-gray-800">{finding.remediation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

