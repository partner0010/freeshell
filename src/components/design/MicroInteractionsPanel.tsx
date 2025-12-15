'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Play, Pause, Settings, CheckCircle2 } from 'lucide-react';
import {
  microInteractionSystem,
} from '@/lib/design/micro-interactions';

export function MicroInteractionsPanel() {
  const [config, setConfig] = useState(microInteractionSystem.getConfig());
  const [isEnabled, setIsEnabled] = useState(config.enabled);

  useEffect(() => {
    microInteractionSystem.init();
  }, []);

  const handleToggle = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    microInteractionSystem.updateConfig({ enabled: newEnabled });
    setConfig(microInteractionSystem.getConfig());
  };

  const handleReduceMotion = () => {
    const newReduceMotion = !config.globalSettings.reduceMotion;
    microInteractionSystem.updateConfig({
      globalSettings: {
        ...config.globalSettings,
        reduceMotion: newReduceMotion,
      },
    });
    setConfig(microInteractionSystem.getConfig());
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Zap className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">마이크로 인터랙션</h2>
            <p className="text-sm text-gray-500">향상된 UX를 위한 인터랙션</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* 설정 */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">설정</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div className="font-semibold text-gray-800">마이크로 인터랙션 활성화</div>
                <div className="text-sm text-gray-600">버튼, 카드 등의 인터랙션 효과</div>
              </div>
              <button
                onClick={handleToggle}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isEnabled
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {isEnabled ? '활성화됨' : '비활성화됨'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div className="font-semibold text-gray-800">움직임 감소 모드</div>
                <div className="text-sm text-gray-600">접근성을 위한 애니메이션 감소</div>
              </div>
              <button
                onClick={handleReduceMotion}
                className={`px-4 py-2 rounded-lg font-medium ${
                  config.globalSettings.reduceMotion
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {config.globalSettings.reduceMotion ? '활성화됨' : '비활성화됨'}
              </button>
            </div>
          </div>
        </section>

        {/* 인터랙션 목록 */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            등록된 인터랙션 ({config.interactions.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.interactions.map((interaction) => (
              <div
                key={interaction.id}
                className="p-4 border rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{interaction.name}</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {interaction.type}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>애니메이션: {interaction.animation}</div>
                  <div>지속시간: {interaction.duration}ms</div>
                  <div>이징: {interaction.easing}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

