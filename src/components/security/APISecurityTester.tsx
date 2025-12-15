'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Play,
  RefreshCw,
  Download,
  FileCode,
} from 'lucide-react';
import {
  apiSecurityTester,
  OWASP_API_TESTS,
  type APITestResult,
} from '@/lib/security/api-security-tester';

export function APISecurityTester() {
  const [baseUrl, setBaseUrl] = useState('https://api.example.com');
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<APITestResult[]>([]);

  const handleRunTests = async () => {
    setIsTesting(true);
    try {
      const testResults = await apiSecurityTester.runTests(baseUrl, []);
      setResults(testResults);
    } catch (error) {
      alert(`테스트 실패: ${error}`);
    } finally {
      setIsTesting(false);
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

  const totalVulnerabilities = results.reduce(
    (sum, r) => sum + r.vulnerabilities.length,
    0
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-orange-600 rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">API 보안 테스팅</h2>
              <p className="text-sm text-gray-500">OWASP API Top 10 기반 보안 테스트</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://api.example.com"
            className="flex-1 px-4 py-3 border rounded-lg"
          />
          <button
            onClick={handleRunTests}
            disabled={isTesting || !baseUrl.trim()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isTesting ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                테스트 중...
              </>
            ) : (
              <>
                <Play size={20} />
                테스트 실행
              </>
            )}
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-800">
                발견된 취약점: {totalVulnerabilities}개
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {results.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileCode className="text-gray-300 mx-auto mb-4" size={64} />
              <p className="text-gray-500 text-lg mb-2">API 보안 테스트를 실행하세요</p>
              <p className="text-gray-400 text-sm">
                OWASP API Top 10 취약점을 자동으로 검사합니다
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {OWASP_API_TESTS.map((test, testIndex) => {
              const testResults = results.filter((r) =>
                test.testCases.some((tc) => tc.id === r.testId)
              );
              const vulns = testResults.flatMap((r) => r.vulnerabilities);

              return (
                <div key={test.id} className="p-5 border rounded-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{test.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-medium ${getSeverityColor(test.severity)}`}>
                      {test.severity}
                    </span>
                  </div>

                  {vulns.length > 0 && (
                    <div className="space-y-3 mt-4">
                      {vulns.map((vuln, i) => (
                        <div
                          key={i}
                          className={`p-4 border-2 rounded-lg ${getSeverityColor(vuln.severity)}`}
                        >
                          <div className="font-semibold mb-2">{vuln.description}</div>
                          <div className="text-sm mb-2">엔드포인트: {vuln.endpoint}</div>
                          <div className="text-sm mb-2">증거: {vuln.evidence}</div>
                          <div className="mt-3 p-3 bg-white/80 rounded">
                            <div className="text-xs font-semibold mb-1">수정 방법</div>
                            <div className="text-sm">{vuln.remediation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {vulns.length === 0 && (
                    <div className="flex items-center gap-2 text-green-600 mt-4">
                      <CheckCircle2 size={20} />
                      <span className="text-sm">취약점이 발견되지 않았습니다</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

