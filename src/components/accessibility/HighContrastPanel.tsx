'use client';

import React, { useState, useEffect } from 'react';
import { Contrast, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { HighContrastToggle } from './HighContrastToggle';

export function HighContrastPanel() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('high-contrast');
    setIsEnabled(saved === 'true');
  }, []);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <Contrast className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">고대비 모드</h2>
            <p className="text-sm text-gray-500">저시력 사용자를 위한 고대비 모드</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>고대비 모드 설정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-800">고대비 모드</div>
                  <div className="text-sm text-gray-600">
                    색상 대비를 높여 가독성을 향상시킵니다
                  </div>
                </div>
                <HighContrastToggle />
              </div>

              {isEnabled && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <CheckCircle2 size={20} />
                    <span className="font-semibold">고대비 모드 활성화됨</span>
                  </div>
                  <p className="text-sm text-green-700">
                    화면의 모든 요소가 고대비로 표시됩니다.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">고대비 모드 효과</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 텍스트와 배경의 대비 증가</li>
                  <li>• 색상 구분 강화</li>
                  <li>• 경계선 명확화</li>
                  <li>• 저시력 사용자 가독성 향상</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

