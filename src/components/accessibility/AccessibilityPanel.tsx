'use client';

import React, { useState, useEffect } from 'react';
import { Accessibility, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import {
  wcagComplianceSystem,
  type AccessibilityReport,
} from '@/lib/accessibility/wcag-compliance';

export function AccessibilityPanel() {
  const [report, setReport] = useState<AccessibilityReport | null>(null);

  useEffect(() => {
    analyze();
  }, []);

  const analyze = () => {
    const newReport = wcagComplianceSystem.analyzePage();
    setReport(newReport);
  };

  if (!report) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">분석 중...</div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="text-green-600" size={20} />;
      case 'fail':
        return <XCircle className="text-red-600" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-600" size={20} />;
      default:
        return null;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'AAA':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'AA':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'A':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
            <Accessibility className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">접근성 (WCAG)</h2>
            <p className="text-sm text-gray-500">WCAG 2.1 준수 상태</p>
          </div>
        </div>

        {/* 점수 */}
        <div className={`p-6 rounded-xl border-2 ${getLevelColor(report.level)}`}>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{report.score}</div>
            <div className="text-lg">점수</div>
            <div className="mt-4 text-2xl font-bold">WCAG 2.1 {report.level}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* 체크 항목 */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">준수 항목</h3>
          <div className="space-y-3">
            {report.checks.map((check) => (
              <div
                key={check.id}
                className={`p-4 border-2 rounded-xl ${
                  check.status === 'pass'
                    ? 'bg-green-50 border-green-200'
                    : check.status === 'fail'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(check.status)}
                  <div>
                    <div className="font-semibold text-gray-800">{check.criterion}</div>
                    <div className="text-sm text-gray-600">{check.description}</div>
                  </div>
                  <span className={`ml-auto text-xs px-2 py-1 rounded ${
                    check.level === 'AAA'
                      ? 'bg-purple-100 text-purple-700'
                      : check.level === 'AA'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    Level {check.level}
                  </span>
                </div>
                {check.issues.length > 0 && (
                  <div className="mt-2 text-sm text-red-600">
                    {check.issues.map((issue, i) => (
                      <div key={i}>• {issue}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 개선 제안 */}
        {report.recommendations.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-4">개선 제안</h3>
            <div className="space-y-2">
              {report.recommendations.map((rec, i) => (
                <div key={i} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                  {rec}
                </div>
              ))}
            </div>
          </section>
        )}

        <button
          onClick={analyze}
          className="mt-6 w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          다시 분석하기
        </button>
      </div>
    </div>
  );
}

