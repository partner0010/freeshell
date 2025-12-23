/**
 * 보안 보고서 페이지
 * AI 방어 로그 및 조치사항 보고서
 */

'use client';

import { useEffect, useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle, Download, RefreshCw } from 'lucide-react';

interface SecurityReport {
  id: string;
  timestamp: Date;
  period: 'daily' | 'weekly' | 'monthly';
  summary: {
    totalThreats: number;
    blockedThreats: number;
    criticalThreats: number;
    dataBreaches: number;
    systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  };
  threats: Array<{
    type: string;
    count: number;
    severity: string;
    action: string;
  }>;
  recommendations: string[];
  trends: Array<{
    id: string;
    title: string;
    description: string;
    severity: string;
    applied: boolean;
  }>;
  aiActions: Array<{
    action: string;
    timestamp: Date;
    result: 'success' | 'failed' | 'pending';
    details: string;
  }>;
}

export default function SecurityReportPage() {
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const response = await fetch('/api/admin/security/report?period=daily');
      if (response.ok) {
        const data = await response.json();
        setReport(data.report);
      }
    } catch (error) {
      console.error('보고서 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTrend = async (trendId: string) => {
    try {
      const response = await fetch('/api/admin/security/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'apply_trend', trendId }),
      });

      if (response.ok) {
        alert('보안 트렌드가 적용되었습니다.');
        loadReport();
      }
    } catch (error) {
      console.error('트렌드 적용 실패:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>;
  }

  if (!report) {
    return <div className="text-center py-12">보고서를 불러올 수 없습니다.</div>;
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">보안 보고서</h1>
          <p className="text-gray-600 mt-1">AI 방어 로그 및 조치사항</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadReport}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
          >
            <RefreshCw size={18} />
            새로고침
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
            <Download size={18} />
            다운로드
          </button>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">전체 위협</div>
          <div className="text-3xl font-bold text-gray-900">{report.summary.totalThreats}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">차단된 위협</div>
          <div className="text-3xl font-bold text-green-600">{report.summary.blockedThreats}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Critical 위협</div>
          <div className="text-3xl font-bold text-red-600">{report.summary.criticalThreats}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">시스템 건강도</div>
          <div className={`text-lg font-bold px-3 py-1 rounded-lg inline-block mt-2 ${getHealthColor(report.summary.systemHealth)}`}>
            {report.summary.systemHealth === 'excellent' ? '우수' :
             report.summary.systemHealth === 'good' ? '양호' :
             report.summary.systemHealth === 'warning' ? '주의' : '위험'}
          </div>
        </div>
      </div>

      {/* AI 자동 조치 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield size={24} />
          AI 자동 조치 내역
        </h2>
        <div className="space-y-3">
          {report.aiActions.map((action, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {action.result === 'success' ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : action.result === 'failed' ? (
                    <XCircle className="text-red-600" size={20} />
                  ) : (
                    <AlertTriangle className="text-yellow-600" size={20} />
                  )}
                  <span className="font-semibold text-gray-900">{action.action}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(action.timestamp).toLocaleString('ko-KR')}
                </span>
              </div>
              <p className="text-sm text-gray-600">{action.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 보안 트렌드 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">최신 보안 트렌드</h2>
        <div className="space-y-3">
          {report.trends.map((trend) => (
            <div key={trend.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{trend.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{trend.description}</p>
                </div>
                {!trend.applied && (
                  <button
                    onClick={() => handleApplyTrend(trend.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    적용
                  </button>
                )}
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                trend.severity === 'critical' ? 'bg-red-100 text-red-800' :
                trend.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {trend.severity.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 권장사항 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">보안 권장사항</h2>
        <ul className="space-y-2">
          {report.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={18} />
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

