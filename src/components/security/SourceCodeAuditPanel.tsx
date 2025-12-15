'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  RefreshCw,
  Download,
  TrendingUp,
} from 'lucide-react';
import { auditProject, calculateSecurityScore, type CodeAuditResult } from '@/lib/security/source-code-audit';

export function SourceCodeAuditPanel() {
  const [isScanning, setIsScanning] = useState(false);
  const [auditResults, setAuditResults] = useState<CodeAuditResult[]>([]);
  const [summary, setSummary] = useState<{
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  } | null>(null);

  const scanProject = async () => {
    setIsScanning(true);

    // 실제로는 파일 시스템에서 파일들을 읽어옴
    // 여기서는 시뮬레이션
    const mockFiles = [
      { path: 'src/app/page.tsx', content: 'const api = process.env.API_KEY; console.log("test");' },
      { path: 'src/components/editor.tsx', content: 'element.innerHTML = userInput;' },
    ];

    const result = await auditProject(mockFiles);
    setSummary(result);
    setAuditResults(result.results);
    setIsScanning(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const securityScore = summary ? calculateSecurityScore(summary) : null;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-orange-600 rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">소스 코드 보안 감사</h2>
              <p className="text-sm text-gray-500">정적 코드 분석 및 취약점 검사</p>
            </div>
          </div>
          <button
            onClick={scanProject}
            disabled={isScanning}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw size={16} className={isScanning ? 'animate-spin' : ''} />
            스캔 시작
          </button>
        </div>

        {/* 보안 점수 */}
        {securityScore !== null && (
          <div className="p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">보안 점수</div>
                <div className="text-3xl font-bold text-primary-600">{securityScore}/100</div>
              </div>
              <div className="flex items-center gap-4">
                {summary && (
                  <>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">{summary.critical}</div>
                      <div className="text-xs text-gray-500">Critical</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{summary.high}</div>
                      <div className="text-xs text-gray-500">High</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">{summary.medium}</div>
                      <div className="text-xs text-gray-500">Medium</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 결과 */}
      <div className="flex-1 overflow-auto p-6">
        {isScanning ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-500">코드 분석 중...</p>
            </div>
          </div>
        ) : auditResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileCode className="text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg mb-2">코드 스캔을 시작하세요</p>
            <p className="text-gray-400 text-sm">
              프로젝트의 모든 소스 코드를 분석하여 보안 취약점을 검사합니다
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {auditResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 border-2 rounded-xl ${getSeverityColor(result.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">{result.issue}</span>
                      <span className="px-2 py-0.5 bg-white/50 rounded text-xs font-medium">
                        {result.severity}
                      </span>
                      {result.cwe && (
                        <span className="px-2 py-0.5 bg-white/50 rounded text-xs font-medium">
                          {result.cwe}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-700 mb-2">{result.description}</div>
                    <div className="text-xs text-gray-600 font-mono mb-2">
                      {result.file}:{result.line}
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 rounded-lg p-3 mt-3">
                  <div className="text-xs font-semibold text-gray-700 mb-1">권장사항</div>
                  <p className="text-sm text-gray-800">{result.recommendation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

