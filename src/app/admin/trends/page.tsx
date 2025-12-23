/**
 * 트렌드 제안 관리 페이지
 * 자동으로 수집된 최신 기술 트렌드 제안 관리
 */

'use client';

import { useEffect, useState } from 'react';

interface TrendSuggestion {
  id: string;
  category: 'feature' | 'technology' | 'security' | 'performance' | 'uiux' | 'ai' | 'integration';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  sourceUrl: string;
  confidence: number;
  estimatedImpact: 'low' | 'medium' | 'high';
  estimatedEffort: 'low' | 'medium' | 'high';
  relatedTechnologies: string[];
  implementationNotes?: string;
  createdAt: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'implemented';
  adminNotes?: string;
}

export default function TrendsPage() {
  const [suggestions, setSuggestions] = useState<TrendSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [collecting, setCollecting] = useState(false);
  const [filter, setFilter] = useState<{
    category?: string;
    priority?: string;
    status?: string;
  }>({});

  useEffect(() => {
    loadSuggestions();
    // 5분마다 자동 새로고침
    const interval = setInterval(loadSuggestions, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [filter]);

  const loadSuggestions = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.priority) params.append('priority', filter.priority);
      if (filter.status) params.append('status', filter.status);
      params.append('limit', '100');

      const response = await fetch(`/api/trends/suggestions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const collectTrends = async () => {
    setCollecting(true);
    try {
      const response = await fetch('/api/trends/collect', { method: 'POST' });
      if (response.ok) {
        await loadSuggestions();
        alert('트렌드 수집이 완료되었습니다!');
      }
    } catch (error) {
      console.error('Failed to collect trends:', error);
      alert('트렌드 수집에 실패했습니다.');
    } finally {
      setCollecting(false);
    }
  };

  const updateStatus = async (id: string, status: TrendSuggestion['status'], notes?: string) => {
    try {
      const response = await fetch('/api/trends/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, adminNotes: notes }),
      });

      if (response.ok) {
        await loadSuggestions();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai': return 'bg-purple-100 text-purple-800';
      case 'security': return 'bg-red-100 text-red-800';
      case 'performance': return 'bg-green-100 text-green-800';
      case 'uiux': return 'bg-pink-100 text-pink-800';
      case 'integration': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 자동 트렌드 학습 시스템
          </h1>
          <p className="text-gray-600">
            최신 기술 트렌드를 자동으로 학습하고 제안합니다
          </p>
        </div>
        <button
          onClick={collectTrends}
          disabled={collecting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {collecting ? '수집 중...' : '지금 수집하기'}
        </button>
      </div>

      {/* 필터 */}
      <div className="mb-6 flex gap-4">
        <select
          value={filter.category || ''}
          onChange={(e) => setFilter({ ...filter, category: e.target.value || undefined })}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">모든 카테고리</option>
          <option value="ai">AI</option>
          <option value="security">보안</option>
          <option value="performance">성능</option>
          <option value="uiux">UI/UX</option>
          <option value="integration">통합</option>
          <option value="technology">기술</option>
          <option value="feature">기능</option>
        </select>

        <select
          value={filter.priority || ''}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value || undefined })}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">모든 우선순위</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={filter.status || ''}
          onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">모든 상태</option>
          <option value="pending">대기 중</option>
          <option value="reviewing">검토 중</option>
          <option value="approved">승인됨</option>
          <option value="rejected">거부됨</option>
          <option value="implemented">구현됨</option>
        </select>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">전체 제안</div>
          <div className="text-2xl font-bold">{suggestions.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">대기 중</div>
          <div className="text-2xl font-bold text-yellow-600">
            {suggestions.filter(s => s.status === 'pending').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">High Priority</div>
          <div className="text-2xl font-bold text-red-600">
            {suggestions.filter(s => s.priority === 'high' || s.priority === 'critical').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">구현됨</div>
          <div className="text-2xl font-bold text-green-600">
            {suggestions.filter(s => s.status === 'implemented').length}
          </div>
        </div>
      </div>

      {/* 제안 목록 */}
      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{suggestion.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                    {suggestion.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(suggestion.category)}`}>
                    {suggestion.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{suggestion.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>출처: {suggestion.source}</span>
                  <span>신뢰도: {suggestion.confidence}%</span>
                  <span>영향: {suggestion.estimatedImpact}</span>
                  <span>노력: {suggestion.estimatedEffort}</span>
                </div>
                {suggestion.relatedTechnologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {suggestion.relatedTechnologies.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="ml-4">
                <a
                  href={suggestion.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  원문 보기 →
                </a>
              </div>
            </div>

            {suggestion.implementationNotes && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <div className="text-sm font-medium text-gray-700 mb-1">구현 노트:</div>
                <div className="text-sm text-gray-600 whitespace-pre-line">
                  {suggestion.implementationNotes}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">상태:</span>
              <select
                value={suggestion.status}
                onChange={(e) => updateStatus(suggestion.id, e.target.value as any)}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="pending">대기 중</option>
                <option value="reviewing">검토 중</option>
                <option value="approved">승인됨</option>
                <option value="rejected">거부됨</option>
                <option value="implemented">구현됨</option>
              </select>
              <span className="text-xs text-gray-500 ml-4">
                {new Date(suggestion.createdAt).toLocaleString('ko-KR')}
              </span>
            </div>
          </div>
        ))}

        {suggestions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            제안이 없습니다. "지금 수집하기" 버튼을 클릭하여 트렌드를 수집하세요.
          </div>
        )}
      </div>
    </div>
  );
}

