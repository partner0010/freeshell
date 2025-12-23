/**
 * 자동 점검 및 복구 페이지
 */

'use client';

import { useEffect, useState } from 'react';
import { Activity, CheckCircle, XCircle, AlertTriangle, RefreshCw, Play, Settings } from 'lucide-react';
import Link from 'next/link';

interface HealthCheckResult {
  timestamp: Date;
  status: 'healthy' | 'warning' | 'critical';
  checks: Array<{
    name: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
  }>;
  fixes: Array<{
    issue: string;
    action: string;
    status: 'success' | 'failed' | 'pending';
    timestamp: Date;
  }>;
}

export default function HealthCheckPage() {
  const [result, setResult] = useState<HealthCheckResult | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLastCheck();
  }, []);

  const loadLastCheck = async () => {
    try {
      const response = await fetch('/api/admin/health-check');
      if (response.ok) {
        const data = await response.json();
        setLastCheck(data.lastCheck ? new Date(data.lastCheck) : null);
      }
    } catch (error) {
      console.error('마지막 점검 시간 로드 실패:', error);
    }
  };

  const runCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/health-check?run=true');
      if (response.ok) {
        const data = await response.json();
        setResult(data.result);
        setLastCheck(new Date());
      }
    } catch (error) {
      console.error('점검 실행 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-50';
      case 'fail': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">자동 점검 및 복구</h1>
          <p className="text-gray-600 mt-1">하루 1번 자동 점검 및 복구 시스템</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/health/schedule"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <Settings size={18} />
            스케줄 설정
          </Link>
          <button
            onClick={runCheck}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={18} />
                점검 중...
              </>
            ) : (
              <>
                <Play size={18} />
                지금 점검 실행
              </>
            )}
          </button>
        </div>
      </div>

      {lastCheck && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            마지막 점검: {lastCheck.toLocaleString('ko-KR')}
          </p>
        </div>
      )}

      {result && (
        <>
          {/* 전체 상태 */}
          <div className={`rounded-xl p-6 ${
            result.status === 'healthy' ? 'bg-green-50 border border-green-200' :
            result.status === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {result.status === 'healthy' ? (
                <CheckCircle className="text-green-600" size={32} />
              ) : result.status === 'warning' ? (
                <AlertTriangle className="text-yellow-600" size={32} />
              ) : (
                <XCircle className="text-red-600" size={32} />
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  시스템 상태: {
                    result.status === 'healthy' ? '정상' :
                    result.status === 'warning' ? '주의' : '위험'
                  }
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  점검 시간: {new Date(result.timestamp).toLocaleString('ko-KR')}
                </p>
              </div>
            </div>
          </div>

          {/* 점검 결과 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">점검 결과</h3>
            <div className="space-y-3">
              {result.checks.map((check, i) => (
                <div key={i} className="flex items-start gap-3 p-4 border rounded-lg">
                  {check.status === 'pass' ? (
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  ) : check.status === 'fail' ? (
                    <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  ) : (
                    <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900">{check.name}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(check.status)}`}>
                        {check.status === 'pass' ? '통과' :
                         check.status === 'fail' ? '실패' : '경고'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{check.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 복구 조치 */}
          {result.fixes.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">자동 복구 조치</h3>
              <div className="space-y-3">
                {result.fixes.map((fix, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-semibold text-gray-900">{fix.issue}</span>
                        <span className="ml-2 text-sm text-gray-600">→ {fix.action}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        fix.status === 'success' ? 'bg-green-100 text-green-800' :
                        fix.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {fix.status === 'success' ? '성공' :
                         fix.status === 'failed' ? '실패' : '대기 중'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(fix.timestamp).toLocaleString('ko-KR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!result && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Activity className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">아직 점검이 실행되지 않았습니다.</p>
          <p className="text-sm text-gray-500 mt-2">"지금 점검 실행" 버튼을 클릭하여 시작하세요.</p>
        </div>
      )}
    </div>
  );
}

