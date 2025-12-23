/**
 * AI 학습 및 제안 페이지
 * 최신 기술 트렌드 확인 및 적용
 */

'use client';

import { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, XCircle, Clock, Download, RefreshCw } from 'lucide-react';

interface AdminProposal {
  id: string;
  task: {
    id: string;
    category: string;
    title: string;
    description: string;
    priority: string;
    estimatedImpact: string;
    estimatedEffort: string;
  };
  proposal: {
    what: string;
    why: string;
    how: string;
    benefits: string[];
    risks: string[];
    timeline: string;
  };
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'modified';
  adminResponse?: {
    decision: string;
    feedback: string;
    timestamp: Date;
  };
}

export default function LearningPage() {
  const [proposals, setProposals] = useState<AdminProposal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      const response = await fetch('/api/admin/learning/proposals');
      if (response.ok) {
        const data = await response.json();
        setProposals(data.proposals || []);
      }
    } catch (error) {
      console.error('제안 로드 실패:', error);
    }
  };

  const handleLearn = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/learning/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'learn' }),
      });

      if (response.ok) {
        const data = await response.json();
        setProposals(data.proposals || []);
        alert('최신 기술을 학습하고 제안을 생성했습니다.');
      }
    } catch (error) {
      console.error('학습 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (proposalId: string, decision: 'approve' | 'reject' | 'modify', feedback?: string) => {
    try {
      const response = await fetch('/api/admin/learning/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'respond',
          proposalId,
          decision,
          feedback,
        }),
      });

      if (response.ok) {
        loadProposals();
      }
    } catch (error) {
      console.error('응답 실패:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI 학습 및 제안</h1>
          <p className="text-gray-600 mt-1">최신 기술 트렌드 확인 및 적용</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLearn}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700 disabled:opacity-50"
          >
            <Sparkles size={18} />
            {loading ? '학습 중...' : '최신 기술 학습'}
          </button>
          <button
            onClick={loadProposals}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
          >
            <RefreshCw size={18} />
            새로고침
          </button>
        </div>
      </div>

      {/* 제안 목록 */}
      <div className="space-y-4">
        {proposals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Sparkles className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">아직 제안이 없습니다.</p>
            <p className="text-sm text-gray-500 mt-2">"최신 기술 학습" 버튼을 클릭하여 시작하세요.</p>
          </div>
        ) : (
          proposals.map((proposal) => (
            <div key={proposal.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      proposal.task.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      proposal.task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      proposal.task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {proposal.task.priority.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">{proposal.task.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{proposal.task.title}</h3>
                  <p className="text-gray-600 mt-1">{proposal.task.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                  proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  proposal.status === 'modified' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {proposal.status === 'pending' ? '대기 중' :
                   proposal.status === 'approved' ? '승인됨' :
                   proposal.status === 'rejected' ? '거부됨' : '수정됨'}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">무엇을?</h4>
                  <p className="text-sm text-gray-600">{proposal.proposal.what}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">왜?</h4>
                  <p className="text-sm text-gray-600">{proposal.proposal.why}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">어떻게?</h4>
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap bg-gray-50 p-2 rounded">
                    {proposal.proposal.how}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">타임라인</h4>
                  <p className="text-sm text-gray-600">{proposal.proposal.timeline}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">혜택</h4>
                <ul className="space-y-1">
                  {proposal.proposal.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {proposal.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleRespond(proposal.id, 'approve', '승인합니다.')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    승인
                  </button>
                  <button
                    onClick={() => handleRespond(proposal.id, 'reject', '거부합니다.')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <XCircle size={18} />
                    거부
                  </button>
                  <button
                    onClick={() => {
                      const feedback = prompt('수정 사항을 입력하세요:');
                      if (feedback) {
                        handleRespond(proposal.id, 'modify', feedback);
                      }
                    }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2"
                  >
                    <Clock size={18} />
                    수정 요청
                  </button>
                </div>
              )}

              {proposal.adminResponse && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">관리자 응답:</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      proposal.adminResponse.decision === 'approve' ? 'bg-green-100 text-green-800' :
                      proposal.adminResponse.decision === 'reject' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {proposal.adminResponse.decision === 'approve' ? '승인' :
                       proposal.adminResponse.decision === 'reject' ? '거부' : '수정'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{proposal.adminResponse.feedback}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(proposal.adminResponse.timestamp).toLocaleString('ko-KR')}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

