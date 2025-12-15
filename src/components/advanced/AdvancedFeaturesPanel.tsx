'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Shield,
  Brain,
  Zap,
  Globe,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import {
  predictiveAnalytics,
  type Recommendation,
} from '@/lib/analytics/predictive-analytics';
import {
  quantumSafeEncryption,
  type EncryptionKey,
} from '@/lib/security/quantum-safe-encryption';
import {
  aiAgentSystem,
  type AIAgent,
} from '@/lib/ai/ai-agents';
import {
  edgeComputingSystem,
  type EdgeNode,
} from '@/lib/efficiency/edge-computing';

export function AdvancedFeaturesPanel() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'security' | 'ai' | 'edge'>('analytics');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [keys, setKeys] = useState<EncryptionKey[]>([]);
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [nodes, setNodes] = useState<EdgeNode[]>([]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = () => {
    switch (activeTab) {
      case 'analytics':
        setRecommendations(predictiveAnalytics.getPersonalizedRecommendations('user-123'));
        break;
      case 'security':
        setKeys(quantumSafeEncryption.getKeys());
        break;
      case 'ai':
        setAgents(aiAgentSystem.getAgents());
        break;
      case 'edge':
        setNodes(edgeComputingSystem.getNodes());
        break;
    }
  };

  const handleGenerateKey = () => {
    const key = quantumSafeEncryption.generateKey('post-quantum');
    setKeys([...keys, key]);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">고급 기능</h2>
            <p className="text-sm text-gray-500">예측 분석, 양자 안전 암호화, AI 에이전트, Edge Computing</p>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Brain size={16} className="inline mr-2" />
            예측 분석
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'security'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Shield size={16} className="inline mr-2" />
            양자 안전
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'ai'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Brain size={16} className="inline mr-2" />
            AI 에이전트
          </button>
          <button
            onClick={() => setActiveTab('edge')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'edge'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Globe size={16} className="inline mr-2" />
            Edge Computing
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* 예측 분석 */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">개인화 추천</h3>
            {recommendations.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                추천이 없습니다
              </div>
            ) : (
              recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-4 border-2 rounded-xl ${
                    rec.impact === 'high'
                      ? 'bg-red-50 border-red-200'
                      : rec.impact === 'medium'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">{rec.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{rec.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">{rec.score}</div>
                      <div className="text-xs text-gray-500">점수</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 양자 안전 암호화 */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">암호화 키</h3>
              <button
                onClick={handleGenerateKey}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
              >
                새 키 생성
              </button>
            </div>
            {keys.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                암호화 키가 없습니다
              </div>
            ) : (
              keys.map((key) => (
                <div key={key.id} className="p-4 bg-white border rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">{key.algorithm}</span>
                    <CheckCircle2 className="text-green-600" size={20} />
                  </div>
                  <div className="text-sm text-gray-600">
                    생성일: {new Date(key.createdAt).toLocaleString()}
                  </div>
                  {key.expiresAt && (
                    <div className="text-sm text-gray-600">
                      만료일: {new Date(key.expiresAt).toLocaleString()}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* AI 에이전트 */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">AI 에이전트</h3>
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`p-4 border-2 rounded-xl ${
                  agent.status === 'working'
                    ? 'bg-blue-50 border-blue-200'
                    : agent.status === 'error'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-800">{agent.name}</div>
                    <div className="text-sm text-gray-600">{agent.role}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded ${
                      agent.status === 'working'
                        ? 'bg-blue-100 text-blue-700'
                        : agent.status === 'error'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {agent.status}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  작업: {agent.tasks.length}개
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edge Computing */}
        {activeTab === 'edge' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Edge 노드</h3>
            {nodes.map((node) => (
              <div key={node.id} className="p-4 bg-white border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-800">{node.location}</div>
                    <div className="text-sm text-gray-600">{node.region}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">{node.latency}ms</div>
                    <div className="text-xs text-gray-500">지연시간</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>로드: {(node.load * 100).toFixed(0)}%</span>
                  <span>용량: {node.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

