'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TestTube,
  Play,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileCode,
  TrendingUp,
} from 'lucide-react';
import {
  automatedTestingSystem,
  type TestSuite,
} from '@/lib/testing/automated-testing';

export function AutomatedTestingPanel() {
  const [selectedType, setSelectedType] = useState<'unit' | 'integration' | 'e2e' | 'visual'>('unit');
  const [isRunning, setIsRunning] = useState(false);
  const [suites, setSuites] = useState<TestSuite[]>([]);
  const [selectedSuite, setSelectedSuite] = useState<TestSuite | null>(null);

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      let suite: TestSuite;

      switch (selectedType) {
        case 'unit':
          suite = await automatedTestingSystem.runUnitTests('function test() {}');
          break;
        case 'integration':
          suite = await automatedTestingSystem.runIntegrationTests([]);
          break;
        case 'e2e':
          suite = await automatedTestingSystem.runE2ETests([
            { name: 'Login Flow', steps: ['Navigate', 'Enter credentials', 'Submit'] },
          ]);
          break;
        case 'visual':
          suite = await automatedTestingSystem.runVisualRegressionTests('https://example.com', ['homepage']);
          break;
      }

      setSuites((prev) => [suite, ...prev]);
      setSelectedSuite(suite);
    } catch (error) {
      alert(`테스트 실패: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-600 rounded-xl flex items-center justify-center">
            <TestTube className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">자동화 테스팅</h2>
            <p className="text-sm text-gray-500">Unit, Integration, E2E, Visual 테스트</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="flex-1 px-4 py-2 border rounded-lg"
            >
              <option value="unit">Unit Tests</option>
              <option value="integration">Integration Tests</option>
              <option value="e2e">E2E Tests</option>
              <option value="visual">Visual Regression Tests</option>
            </select>
            <button
              onClick={handleRunTests}
              disabled={isRunning}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  실행 중...
                </>
              ) : (
                <>
                  <Play size={20} />
                  테스트 실행
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {suites.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <TestTube className="text-gray-300 mx-auto mb-4" size={64} />
              <p className="text-gray-500 text-lg mb-2">테스트를 실행하세요</p>
              <p className="text-gray-400 text-sm">
                다양한 테스트 유형을 선택하여 실행할 수 있습니다
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 테스트 스위트 목록 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-4">테스트 스위트</h3>
              <div className="space-y-3">
                {suites.map((suite) => (
                  <div
                    key={suite.id}
                    onClick={() => setSelectedSuite(suite)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedSuite?.id === suite.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-800">{suite.name}</div>
                        <div className="text-sm text-gray-500">{suite.type}</div>
                      </div>
                      <div className="text-right">
                        {suite.status === 'passed' ? (
                          <CheckCircle2 className="text-green-600" size={24} />
                        ) : suite.status === 'failed' ? (
                          <XCircle className="text-red-600" size={24} />
                        ) : (
                          <RefreshCw className="text-yellow-600 animate-spin" size={24} />
                        )}
                        {suite.coverage && (
                          <div className="text-xs text-gray-500 mt-1">
                            {suite.coverage}% coverage
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 선택된 스위트 상세 */}
            {selectedSuite && (
              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-4">테스트 결과</h3>
                
                {selectedSuite.coverage && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-blue-800">코드 커버리지</span>
                      <span className="text-2xl font-bold text-blue-600">{selectedSuite.coverage}%</span>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {selectedSuite.tests.map((test) => (
                    <div
                      key={test.id}
                      className={`p-4 border-2 rounded-xl ${
                        test.status === 'passed'
                          ? 'bg-green-50 border-green-200'
                          : test.status === 'failed'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-800">{test.name}</div>
                        {test.status === 'passed' ? (
                          <CheckCircle2 className="text-green-600" size={20} />
                        ) : test.status === 'failed' ? (
                          <XCircle className="text-red-600" size={20} />
                        ) : null}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{test.description}</div>
                      
                      {test.assertions.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {test.assertions.map((assertion, i) => (
                            <div
                              key={i}
                              className={`text-xs p-2 rounded ${
                                assertion.passed ? 'bg-green-100' : 'bg-red-100'
                              }`}
                            >
                              {assertion.passed ? '✓' : '✗'} {assertion.expected}
                            </div>
                          ))}
                        </div>
                      )}

                      {test.error && (
                        <div className="mt-3 p-2 bg-red-100 rounded text-sm text-red-800">
                          {test.error}
                        </div>
                      )}
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

