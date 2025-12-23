/**
 * 보안 설정 페이지
 * 2단계 인증 등 보안 기능 관리
 */

'use client';

import React from 'react';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { TwoFactorAuth } from '@/components/auth/TwoFactorAuth';
import { Shield, Lock, Key, Smartphone } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Shield className="text-green-600" size={32} />
            보안 설정
          </h1>
          <p className="text-gray-600">
            계정 보안을 강화하고 개인정보를 보호하세요
          </p>
        </div>

        <div className="space-y-6">
          {/* 2단계 인증 */}
          <TwoFactorAuth />

          {/* 보안 정보 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="text-purple-600" size={20} />
              보안 정보
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="text-gray-600" size={18} />
                  <span className="text-gray-700">마지막 비밀번호 변경</span>
                </div>
                <span className="text-gray-600">30일 전</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="text-gray-600" size={18} />
                  <span className="text-gray-700">활성 세션</span>
                </div>
                <span className="text-green-600 font-medium">1개</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

