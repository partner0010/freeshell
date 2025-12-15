'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Eye,
} from 'lucide-react';
import {
  anomalyDetectionSystem,
  type Anomaly,
} from '@/lib/ai/anomaly-detection';

export function AnomalyDetectionPanel() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [isLearning, setIsLearning] = useState(false);

  useEffect(() => {
    loadAnomalies();
  }, []);

  const loadAnomalies = () => {
    setAnomalies(anomalyDetectionSystem.getAnomalies(50));
  };

  const handleLearnBaseline = async () => {
    setIsLearning(true);
    try {
      // 베이스라인 학습 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      anomalyDetectionSystem.learnBaseline({
        userId: 'user-123',
        events: Array.from({ length: 100 }, (_, i) => ({
          timestamp: Date.now() - i * 60000,
          endpoint: `/api/data/${i % 10}`,
          responseTime: 100 + Math.random() * 50,
        })),
      });

      alert('베이스라인 학습 완료');
    } catch (error) {
      alert(`학습 실패: ${error}`);
    } finally {
      setIsLearning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center">
              <Brain className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">AI 이상 탐지</h2>
              <p className="text-sm text-gray-500">머신러닝 기반 이상 행위 탐지</p>
            </div>
          </div>
          <button
            onClick={handleLearnBaseline}
            disabled={isLearning}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLearning ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                학습 중...
              </>
            ) : (
              <>
                <TrendingUp size={16} />
                베이스라인 학습
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {anomalies.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Brain className="text-gray-300 mx-auto mb-4" size={64} />
              <p className="text-gray-500 text-lg mb-2">이상 활동이 감지되지 않았습니다</p>
              <p className="text-gray-400 text-sm">
                AI가 정상 패턴을 학습하여 이상을 탐지합니다
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <div
                key={anomaly.id}
                className={`p-5 border-2 rounded-xl ${getSeverityColor(anomaly.severity)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={20} />
                      <span className="font-semibold text-gray-800">{anomaly.description}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      신뢰도: {anomaly.confidence}%
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-medium ${getSeverityColor(anomaly.severity)}`}>
                    {anomaly.severity}
                  </span>
                </div>

                {/* 메트릭 비교 */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-white/80 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">정상 기준</div>
                    <div className="text-lg font-bold">{anomaly.metrics.baseline.toFixed(2)}</div>
                  </div>
                  <div className="p-3 bg-white/80 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">현재 값</div>
                    <div className="text-lg font-bold flex items-center gap-2">
                      {anomaly.metrics.current.toFixed(2)}
                      {anomaly.metrics.current > anomaly.metrics.baseline ? (
                        <TrendingUp className="text-red-600" size={16} />
                      ) : (
                        <TrendingDown className="text-green-600" size={16} />
                      )}
                    </div>
                  </div>
                </div>

                {/* 권장사항 */}
                <div className="mt-4">
                  <div className="text-sm font-semibold mb-2">권장사항</div>
                  <ul className="space-y-1">
                    {anomaly.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <Eye size={14} className="mt-0.5 shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs text-gray-500 mt-4">
                  탐지 시간: {new Date(anomaly.detectedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

