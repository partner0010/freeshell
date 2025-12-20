'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, CheckCircle, XCircle, Copy, Loader2, Zap, Crown, Building } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface LicenseInfo {
  tier: string;
  expiresAt: string | null;
  maxDevices: number;
  features: any;
}

export function LicenseManager() {
  const { data: session } = useSession();
  const [licenseKey, setLicenseKey] = useState('');
  const [appliedLicense, setAppliedLicense] = useState<LicenseInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadUserLicense();
  }, [session]);

  const loadUserLicense = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch('/api/license/user');
      if (response.ok) {
        const data = await response.json();
        if (data.license) {
          setAppliedLicense(data.license);
        }
      }
    } catch (error) {
      console.error('라이선스 로드 오류:', error);
    }
  };

  const handleApplyLicense = async () => {
    if (!licenseKey.trim()) {
      setError('라이선스 키를 입력하세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/license/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: licenseKey.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '라이선스 적용 실패');
      }

      setAppliedLicense(data.license);
      setLicenseKey('');
      alert('라이선스가 성공적으로 적용되었습니다!');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'pro':
        return <Zap className="text-yellow-500" size={20} />;
      case 'enterprise':
        return <Building className="text-purple-500" size={20} />;
      default:
        return <Crown className="text-gray-400" size={20} />;
    }
  };

  const getTierName = (tier: string) => {
    switch (tier) {
      case 'free':
        return '무료';
      case 'pro':
        return 'Pro';
      case 'enterprise':
        return 'Enterprise';
      default:
        return tier;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key size={24} />
            라이선스 관리
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 현재 라이선스 정보 */}
          {appliedLicense ? (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getTierIcon(appliedLicense.tier)}
                  <div>
                    <h3 className="font-bold text-lg">{getTierName(appliedLicense.tier)} 구독</h3>
                    <p className="text-sm text-gray-600">
                      {appliedLicense.expiresAt
                        ? `만료일: ${new Date(appliedLicense.expiresAt).toLocaleDateString('ko-KR')}`
                        : '무기한'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-sm font-medium text-green-700">활성</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">최대 기기 수</p>
                  <p className="font-semibold">{appliedLicense.maxDevices}개</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">상태</p>
                  <p className="font-semibold text-green-600">사용 중</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
              <p className="text-gray-600 mb-2">적용된 라이선스가 없습니다.</p>
              <p className="text-sm text-gray-500">라이선스 키를 입력하여 구독을 활성화하세요.</p>
            </div>
          )}

          {/* 라이선스 키 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              라이선스 키
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                maxLength={19}
              />
              <Button
                onClick={handleApplyLicense}
                disabled={isLoading || !licenseKey.trim()}
                className="px-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    적용 중...
                  </>
                ) : (
                  '적용'
                )}
              </Button>
            </div>
            {error && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                <XCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* 라이선스 안내 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">라이선스 구독 안내</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 무료: 기본 기능 사용 가능</li>
              <li>• Pro: 고급 기능 + 광고 제거</li>
              <li>• Enterprise: 모든 기능 + 우선 지원</li>
              <li>• 라이선스 키는 관리자에게 문의하세요</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

