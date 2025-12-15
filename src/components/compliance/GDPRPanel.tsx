'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Shield,
  Download,
  Trash2,
  Eye,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import {
  gdprManager,
  type DataSubjectRequest,
} from '@/lib/compliance/gdpr';

export function GDPRPanel() {
  const [requestType, setRequestType] = useState<DataSubjectRequest['type']>('access');
  const [userId, setUserId] = useState('');
  const [requests, setRequests] = useState<DataSubjectRequest[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmitRequest = async () => {
    if (!userId.trim()) {
      alert('사용자 ID를 입력하세요');
      return;
    }

    setIsProcessing(true);
    try {
      const request = await gdprManager.processDataSubjectRequest({
        type: requestType,
        userId,
      });
      setRequests((prev) => [request, ...prev]);
      setUserId('');
    } catch (error) {
      alert(`요청 처리 실패: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getRequestTypeLabel = (type: DataSubjectRequest['type']) => {
    switch (type) {
      case 'access':
        return '데이터 접근';
      case 'erasure':
        return '삭제 요청';
      case 'portability':
        return '데이터 이식';
      case 'rectification':
        return '정정 요청';
      case 'restriction':
        return '처리 제한';
      default:
        return type;
    }
  };

  const getStatusColor = (status: DataSubjectRequest['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'processing':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'rejected':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">GDPR 컴플라이언스</h2>
            <p className="text-sm text-gray-500">개인정보보호 규정 준수 관리</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">요청 유형</label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value as DataSubjectRequest['type'])}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="access">데이터 접근 (Right of Access)</option>
              <option value="erasure">삭제 요청 (Right to be Forgotten)</option>
              <option value="portability">데이터 이식 (Data Portability)</option>
              <option value="rectification">정정 요청 (Right to Rectification)</option>
              <option value="restriction">처리 제한 (Right to Restriction)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사용자 ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="user-123"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={handleSubmitRequest}
            disabled={isProcessing}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                처리 중...
              </>
            ) : (
              <>
                <FileText size={16} />
                요청 제출
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">요청 이력</h3>
        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              요청이 없습니다
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className={`p-4 border-2 rounded-xl ${getStatusColor(req.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{getRequestTypeLabel(req.type)}</div>
                  <span className="text-xs px-2 py-1 bg-white rounded">
                    {req.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  사용자: {req.userId}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(req.timestamp).toLocaleString()}
                </div>
                {req.data && (
                  <details className="mt-3">
                    <summary className="text-xs cursor-pointer">데이터 보기</summary>
                    <pre className="mt-2 text-xs bg-white p-2 rounded overflow-x-auto">
                      {typeof req.data === 'string' ? req.data : JSON.stringify(req.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

