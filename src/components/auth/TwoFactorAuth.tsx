/**
 * 2단계 인증 (2FA) 컴포넌트
 * 보안 강화를 위한 2FA 구현
 */

'use client';

import React, { useState } from 'react';
import { Shield, Smartphone, Mail, Key, CheckCircle, XCircle } from 'lucide-react';

type AuthMethod = 'totp' | 'sms' | 'email';

export function TwoFactorAuth() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('totp');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [qrCode, setQrCode] = useState('');

  const handleEnable = async () => {
    if (authMethod === 'totp') {
      // TOTP QR 코드 생성 시뮬레이션
      const secret = 'JBSWY3DPEHPK3PXP';
      const qr = `otpauth://totp/Freeshell:user@example.com?secret=${secret}&issuer=Freeshell`;
      setQrCode(qr);
    }
    setIsEnabled(true);
  };

  const handleVerify = async () => {
    // 실제로는 서버에서 검증
    if (verificationCode.length === 6) {
      setIsVerified(true);
      setTimeout(() => {
        setIsVerified(false);
        setVerificationCode('');
      }, 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <Shield className="text-green-600" size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">2단계 인증</h3>
          <p className="text-sm text-gray-600">계정 보안을 강화하세요</p>
        </div>
      </div>

      {!isEnabled ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              인증 방법 선택
            </label>
            <div className="space-y-2">
              {[
                { id: 'totp', label: '인증 앱 (TOTP)', icon: Smartphone, desc: 'Google Authenticator, Authy 등' },
                { id: 'sms', label: 'SMS', icon: Smartphone, desc: '휴대폰 번호로 인증 코드 전송' },
                { id: 'email', label: '이메일', icon: Mail, desc: '이메일로 인증 코드 전송' },
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setAuthMethod(method.id as AuthMethod)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      authMethod === method.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="text-purple-600" size={20} />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{method.label}</div>
                        <div className="text-sm text-gray-600">{method.desc}</div>
                      </div>
                      {authMethod === method.id && (
                        <CheckCircle className="text-purple-600" size={20} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleEnable}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold flex items-center justify-center gap-2"
          >
            <Shield size={20} />
            2단계 인증 활성화
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {authMethod === 'totp' && qrCode && (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-2">QR 코드를 인증 앱으로 스캔하세요</p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                  <Key className="text-gray-400" size={64} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">또는 수동으로 코드 입력: JBSWY3DPEHPK3PXP</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              인증 코드 입력
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6자리 코드"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-center text-2xl font-bold tracking-widest"
                maxLength={6}
              />
              <button
                onClick={handleVerify}
                disabled={verificationCode.length !== 6}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                확인
              </button>
            </div>
          </div>

          {isVerified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="font-semibold text-green-900">인증 완료!</p>
                <p className="text-sm text-green-700">2단계 인증이 활성화되었습니다.</p>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setIsEnabled(false);
              setVerificationCode('');
              setQrCode('');
            }}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
}

