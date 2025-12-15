'use client';

import React, { useState } from 'react';
import { Shield, CheckCircle2, AlertTriangle, Copy } from 'lucide-react';
import {
  contentSecurityPolicySystem,
  type SecurityHeaders,
} from '@/lib/security/content-security-policy';

export function CSPanel() {
  const [csp, setCsp] = useState(contentSecurityPolicySystem.generateCSP());
  const [headers, setHeaders] = useState<SecurityHeaders>(contentSecurityPolicySystem.generateSecurityHeaders(csp));
  const [validation, setValidation] = useState(contentSecurityPolicySystem.validateCSP(csp));

  const handleRegenerate = () => {
    const newCsp = contentSecurityPolicySystem.generateCSP();
    setCsp(newCsp);
    setHeaders(contentSecurityPolicySystem.generateSecurityHeaders(newCsp));
    setValidation(contentSecurityPolicySystem.validateCSP(newCsp));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('복사되었습니다!');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Content Security Policy</h2>
            <p className="text-sm text-gray-500">보안 헤더 강화</p>
          </div>
        </div>

        {/* 검증 결과 */}
        <div className={`p-4 rounded-xl border-2 ${
          validation.valid
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {validation.valid ? (
              <CheckCircle2 className="text-green-600" size={24} />
            ) : (
              <AlertTriangle className="text-red-600" size={24} />
            )}
            <span className="font-semibold">
              {validation.valid ? 'CSP가 유효합니다' : 'CSP에 문제가 있습니다'}
            </span>
          </div>
          {validation.errors.length > 0 && (
            <div className="text-sm text-red-600 mt-2">
              {validation.errors.map((error, i) => (
                <div key={i}>• {error}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* CSP */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Content Security Policy</h3>
            <button
              onClick={handleRegenerate}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
            >
              재생성
            </button>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border">
            <div className="flex items-start justify-between gap-4">
              <code className="text-sm text-gray-800 flex-1 break-all">{csp}</code>
              <button
                onClick={() => handleCopy(csp)}
                className="p-2 hover:bg-gray-200 rounded"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* 보안 헤더 */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4">보안 헤더</h3>
          <div className="space-y-3">
            {Object.entries(headers).map(([key, value]) => (
              <div key={key} className="p-4 border rounded-xl">
                <div className="font-semibold text-gray-800 mb-2">{key}</div>
                <div className="flex items-start justify-between gap-4">
                  <code className="text-sm text-gray-600 flex-1 break-all">
                    {String(value)}
                  </code>
                  <button
                    onClick={() => handleCopy(String(value))}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

