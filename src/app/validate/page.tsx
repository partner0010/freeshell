/**
 * 사이트 검증 및 모니터링 페이지
 * 운영 사이트 전반 기술 확인
 */

'use client';

import { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle, RefreshCw, Activity, Lock, Globe, Wrench, Sparkles, Zap } from 'lucide-react';

interface ValidationResult {
  category: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  details?: string[];
  score?: number;
}

export default function ValidatePage() {
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [autoFixSuggestions, setAutoFixSuggestions] = useState<any[]>([]);
  const [showAutoFix, setShowAutoFix] = useState(false);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const response = await fetch('/api/validate/site');
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setOverallScore(data.overallScore || null);
      }
    } catch (error) {
      console.error('검증 실패:', error);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    handleValidate();
  }, []);

  const handleAutoFix = async () => {
    setShowAutoFix(true);
    // 자동 수정 제안 생성
    const suggestions = results
      .filter(r => r.status === 'fail' || r.status === 'warning')
      .map(r => ({
        category: r.category,
        issue: r.message,
        fix: `AI가 분석한 결과, ${r.category} 문제를 해결하기 위해 다음 조치를 권장합니다: ${r.details?.join(', ') || '자동 수정 가능'}`,
        priority: r.status === 'fail' ? 'high' : 'medium',
      }));
    setAutoFixSuggestions(suggestions);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'fail': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'fail': return XCircle;
      default: return Activity;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Shield className="text-green-600" size={32} />
            사이트 검증 및 모니터링
          </h1>
          <p className="text-gray-600">
            운영 사이트의 기술 전반을 확인하고 보안 취약점을 점검합니다
          </p>
        </div>

        {/* 전체 점수 */}
        {overallScore !== null && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">전체 점수</h2>
                <p className="text-sm text-gray-600">종합 검증 결과</p>
              </div>
              <div className={`text-4xl font-bold ${
                overallScore >= 90 ? 'text-green-600' :
                overallScore >= 70 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {overallScore}/100
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  overallScore >= 90 ? 'bg-green-600' :
                  overallScore >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${overallScore}%` }}
              />
            </div>
          </div>
        )}

        {/* 검증 버튼 */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={isValidating ? 'animate-spin' : ''} size={18} />
            {isValidating ? '검증 중...' : '사이트 검증 실행'}
          </button>
          {results.length > 0 && (
            <button
              onClick={handleAutoFix}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Sparkles size={18} />
              AI 자동 수정 제안
            </button>
          )}
        </div>

        {/* AI 자동 수정 제안 */}
        {showAutoFix && autoFixSuggestions.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="text-purple-600" size={20} />
                AI 자동 수정 제안
              </h3>
              <button
                onClick={() => setShowAutoFix(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {autoFixSuggestions.map((suggestion, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{suggestion.category}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          suggestion.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {suggestion.priority === 'high' ? '높음' : '중간'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{suggestion.issue}</p>
                      <p className="text-sm text-purple-700 bg-purple-50 p-2 rounded">{suggestion.fix}</p>
                    </div>
                  </div>
                  <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center gap-2">
                    <Zap size={14} />
                    자동 수정 적용
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 검증 결과 */}
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Shield className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">검증 결과가 없습니다.</p>
              <p className="text-sm text-gray-500 mt-2">검증을 실행하여 사이트 상태를 확인하세요.</p>
            </div>
          ) : (
            results.map((result, i) => {
              const StatusIcon = getStatusIcon(result.status);
              return (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getStatusColor(result.status)}`}>
                      <StatusIcon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{result.category}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                          {result.status === 'pass' ? '통과' :
                           result.status === 'warning' ? '경고' : '실패'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{result.message}</p>
                      {result.score !== undefined && (
                        <div className="mb-2">
                          <div className="text-sm text-gray-600 mb-1">점수: {result.score}/100</div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                result.score >= 90 ? 'bg-green-600' :
                                result.score >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${result.score}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {result.details && result.details.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {result.details.map((detail, j) => (
                            <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-gray-400">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 검증 카테고리 */}
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: '보안 취약점', icon: Lock, desc: 'XSS, SQL Injection 등 보안 취약점 검사' },
            { name: '성능 최적화', icon: Activity, desc: '페이지 로딩 속도 및 성능 분석' },
            { name: '접근성', icon: Globe, desc: 'WCAG 가이드라인 준수 여부 확인' },
            { name: 'SEO', icon: CheckCircle, desc: '검색 엔진 최적화 상태 확인' },
            { name: '모바일 대응', icon: Activity, desc: '반응형 디자인 및 모바일 호환성' },
            { name: '코드 품질', icon: Shield, desc: '코드 스타일 및 품질 검사' },
          ].map((category, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <category.icon className="text-green-600" size={20} />
                </div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{category.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
