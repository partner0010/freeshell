'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Plus, Search, Copy, Check, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface License {
  id: string;
  licenseKey: string;
  tier: string;
  status: string;
  userId: string | null;
  expiresAt: string | null;
  maxDevices: number;
  issuedAt: string;
}

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [newLicense, setNewLicense] = useState({
    tier: 'pro',
    expiresAt: '',
    maxDevices: 1,
  });
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    loadLicenses();
  }, []);

  const loadLicenses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/licenses');
      if (response.ok) {
        const data = await response.json();
        setLicenses(data.licenses || []);
      }
    } catch (error) {
      console.error('라이선스 로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/license/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLicense),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '라이선스 생성 실패');
      }

      alert(`라이선스가 생성되었습니다!\n\n라이선스 키: ${data.license.licenseKey}`);
      setShowGenerate(false);
      setNewLicense({ tier: 'pro', expiresAt: '', maxDevices: 1 });
      loadLicenses();
    } catch (error: any) {
      alert(`라이선스 생성 실패: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'pro':
        return 'bg-yellow-100 text-yellow-700';
      case 'enterprise':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'expired':
        return 'bg-red-100 text-red-700';
      case 'revoked':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">라이선스 관리</h1>
          <p className="text-gray-500 mt-1">구독 라이선스를 생성하고 관리하세요</p>
        </div>
        <Button onClick={() => setShowGenerate(true)} className="flex items-center gap-2">
          <Plus size={18} />
          라이선스 생성
        </Button>
      </div>

      {/* 라이선스 생성 모달 */}
      {showGenerate && (
        <Card>
          <CardHeader>
            <CardTitle>새 라이선스 생성</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                구독 티어
              </label>
              <select
                value={newLicense.tier}
                onChange={(e) => setNewLicense({ ...newLicense, tier: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="free">무료</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                만료일 (선택사항)
              </label>
              <input
                type="date"
                value={newLicense.expiresAt}
                onChange={(e) => setNewLicense({ ...newLicense, expiresAt: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                최대 기기 수
              </label>
              <input
                type="number"
                value={newLicense.maxDevices}
                onChange={(e) => setNewLicense({ ...newLicense, maxDevices: parseInt(e.target.value) || 1 })}
                min="1"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleGenerate} disabled={isLoading} className="flex-1">
                {isLoading ? '생성 중...' : '생성'}
              </Button>
              <Button onClick={() => setShowGenerate(false)} variant="outline">
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 라이선스 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>라이선스 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">로딩 중...</div>
          ) : licenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">라이선스가 없습니다.</div>
          ) : (
            <div className="space-y-4">
              {licenses.map((license) => (
                <div
                  key={license.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-semibold">{license.licenseKey}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTierColor(license.tier)}`}>
                        {license.tier.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(license.status)}`}>
                        {license.status === 'active' ? '활성' : license.status === 'expired' ? '만료' : '비활성'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-x-4">
                      <span>기기 수: {license.maxDevices}</span>
                      {license.expiresAt && (
                        <span>만료: {new Date(license.expiresAt).toLocaleDateString('ko-KR')}</span>
                      )}
                      {license.userId && <span className="text-purple-600">할당됨</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(license.licenseKey, license.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="복사"
                  >
                    {copied === license.id ? (
                      <Check className="text-green-600" size={18} />
                    ) : (
                      <Copy className="text-gray-600" size={18} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

