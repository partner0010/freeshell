'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Lock,
  RefreshCw,
  Settings,
} from 'lucide-react';
import {
  zeroTrustEngine,
  type VerificationRequest,
  type VerificationResult,
} from '@/lib/security/zero-trust';

export function ZeroTrustPanel() {
  const [request, setRequest] = useState<VerificationRequest>({
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    location: { country: 'KR', city: 'Seoul' },
  });
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const verificationResult = await zeroTrustEngine.verifyRequest(request);
      setResult(verificationResult);
    } catch (error) {
      alert(`검증 실패: ${error}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Zero Trust Security</h2>
            <p className="text-sm text-gray-500">모든 요청을 검증하는 보안 모델</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IP 주소</label>
            <input
              type="text"
              value={request.ip}
              onChange={(e) => setRequest({ ...request, ip: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                검증 중...
              </>
            ) : (
              <>
                <Eye size={16} />
                요청 검증
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {result && (
          <div className={`p-6 rounded-xl border-2 ${getRiskColor(result.riskScore)}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {result.allowed ? (
                  <CheckCircle2 className="text-green-600" size={24} />
                ) : (
                  <AlertTriangle className="text-red-600" size={24} />
                )}
                <span className="text-lg font-bold">
                  {result.allowed ? '허용됨' : '차단됨'}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">위험 점수</div>
                <div className="text-3xl font-bold">{result.riskScore}/100</div>
              </div>
            </div>

            {result.challenge && (
              <div className="p-3 bg-white/80 rounded-lg mb-4">
                <div className="text-sm font-semibold mb-1">추가 검증 필요</div>
                <div className="text-sm">
                  {result.challenge === 'mfa' && '다단계 인증 필요'}
                  {result.challenge === 'captcha' && '캡차 검증 필요'}
                  {result.challenge === 'email' && '이메일 인증 필요'}
                  {result.challenge === 'sms' && 'SMS 인증 필요'}
                </div>
              </div>
            )}

            {result.reason && (
              <div className="text-sm text-gray-700">
                <strong>사유:</strong> {result.reason}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

