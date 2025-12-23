/**
 * 종합 검증 페이지
 * 미구현, 미동작, 소스 오류, 보안 등 종합 검증
 */

'use client';

import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw, Download } from 'lucide-react';

interface ValidationIssue {
  id: string;
  type: 'missing' | 'error' | 'security' | 'performance' | 'accessibility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  file?: string;
  line?: number;
  message: string;
  fix?: string;
  references?: string[];
}

interface ValidationReport {
  timestamp: Date;
  totalIssues: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  issues: ValidationIssue[];
  recommendations: string[];
}

export default function ValidateAllPage() {
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [loading, setLoading] = useState(false);

  const runValidation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/validate-all', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setReport(data.report);
      }
    } catch (error) {
      console.error('검증 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runValidation();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'missing': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'security': return 'bg-purple-100 text-purple-800';
      case 'performance': return 'bg-blue-100 text-blue-800';
      case 'accessibility': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-purple-600" size={48} />
          <div className="text-gray-600">검증 중...</div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">검증 결과를 불러올 수 없습니다.</p>
        <button
          onClick={runValidation}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          다시 검증
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">종합 검증</h1>
          <p className="text-gray-600 mt-1">미구현, 미동작, 소스 오류, 보안 등 종합 검증</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runValidation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <RefreshCw size={18} />
            다시 검증
          </button>
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2">
            <Download size={18} />
            리포트 다운로드
          </button>
        </div>
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">전체 이슈</div>
          <div className="text-3xl font-bold text-gray-900">{report.totalIssues}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Critical</div>
          <div className="text-3xl font-bold text-red-600">{report.bySeverity.critical || 0}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">High</div>
          <div className="text-3xl font-bold text-orange-600">{report.bySeverity.high || 0}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">보안 이슈</div>
          <div className="text-3xl font-bold text-purple-600">{report.byType.security || 0}</div>
        </div>
      </div>

      {/* 이슈 목록 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">검증 이슈</h2>
        <div className="space-y-4">
          {report.issues.map((issue) => (
            <div key={issue.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(issue.type)}`}>
                    {issue.type === 'missing' ? '미구현' :
                     issue.type === 'error' ? '오류' :
                     issue.type === 'security' ? '보안' :
                     issue.type === 'performance' ? '성능' : '접근성'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                    {issue.severity.toUpperCase()}
                  </span>
                </div>
                {issue.file && (
                  <span className="text-xs text-gray-500 font-mono">{issue.file}</span>
                )}
              </div>
              <p className="text-gray-900 mb-2">{issue.message}</p>
              {issue.fix && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-semibold text-green-800">수정 방법:</span>
                  <p className="text-sm text-green-700 mt-1">{issue.fix}</p>
                </div>
              )}
              {issue.references && issue.references.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs font-semibold text-gray-600">참고 자료:</span>
                  <ul className="mt-1 space-y-1">
                    {issue.references.map((ref, i) => (
                      <li key={i}>
                        <a href={ref} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                          {ref}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 권장사항 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">권장사항</h2>
        <ul className="space-y-2">
          {report.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

