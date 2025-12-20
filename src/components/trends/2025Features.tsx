'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Zap, Mic, Box, Globe, Cpu, Code, Workflow,
  TrendingUp, Shield, Eye, Brain, Rocket
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface TrendFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'ai' | 'ui' | 'performance' | 'security';
  status: 'available' | 'beta' | 'coming-soon';
  enabled: boolean;
}

const features: TrendFeature[] = [
  {
    id: 'ai-agents',
    name: 'AI 에이전트 자동화',
    description: '자동으로 작업을 수행하는 AI 에이전트 시스템',
    icon: Brain,
    category: 'ai',
    status: 'available',
    enabled: true,
  },
  {
    id: 'voice-interface',
    name: '음성 인터페이스',
    description: '음성 명령으로 모든 기능을 제어',
    icon: Mic,
    category: 'ui',
    status: 'available',
    enabled: true,
  },
  {
    id: '3d-effects',
    name: '3D 효과',
    description: 'WebGL을 활용한 3D 인터페이스',
    icon: Box,
    category: 'ui',
    status: 'beta',
    enabled: false,
  },
  {
    id: 'edge-computing',
    name: '엣지 컴퓨팅',
    description: '사용자 근처에서 빠른 처리',
    icon: Globe,
    category: 'performance',
    status: 'coming-soon',
    enabled: false,
  },
  {
    id: 'server-components',
    name: '서버 컴포넌트',
    description: 'Next.js 15 서버 컴포넌트 최적화',
    icon: Cpu,
    category: 'performance',
    status: 'available',
    enabled: true,
  },
  {
    id: 'ai-code-gen',
    name: 'AI 코드 생성',
    description: '자연어로 코드를 생성하고 최적화',
    icon: Code,
    category: 'ai',
    status: 'available',
    enabled: true,
  },
  {
    id: 'automation',
    name: '자동화 워크플로우',
    description: '복잡한 작업을 자동으로 실행',
    icon: Workflow,
    category: 'ai',
    status: 'available',
    enabled: true,
  },
  {
    id: 'real-time-analytics',
    name: '실시간 분석',
    description: '사용자 행동을 실시간으로 분석',
    icon: TrendingUp,
    category: 'performance',
    status: 'beta',
    enabled: false,
  },
  {
    id: 'privacy-enhanced',
    name: '프라이버시 강화',
    description: '제로 지식 암호화 및 로컬 처리',
    icon: Shield,
    category: 'security',
    status: 'coming-soon',
    enabled: false,
  },
  {
    id: 'multimodal-ai',
    name: '멀티모달 AI',
    description: '텍스트, 이미지, 음성을 동시에 처리',
    icon: Eye,
    category: 'ai',
    status: 'available',
    enabled: true,
  },
];

export function Trends2025Features() {
  const [enabledFeatures, setEnabledFeatures] = useState<Set<string>>(
    new Set(features.filter(f => f.enabled).map(f => f.id))
  );

  const toggleFeature = (id: string) => {
    const newSet = new Set(enabledFeatures);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setEnabledFeatures(newSet);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="success">사용 가능</Badge>;
      case 'beta':
        return <Badge variant="warning">베타</Badge>;
      case 'coming-soon':
        return <Badge variant="info">준비 중</Badge>;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai':
        return 'from-purple-500 to-pink-500';
      case 'ui':
        return 'from-blue-500 to-cyan-500';
      case 'performance':
        return 'from-green-500 to-emerald-500';
      case 'security':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">2025년 최신 트렌드</h2>
        <p className="text-gray-600">미래지향적인 기능들을 지금 바로 사용하세요</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isEnabled = enabledFeatures.has(feature.id);
          
          return (
            <motion.div
              key={feature.id}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Card className={`h-full cursor-pointer transition-all ${
                isEnabled ? 'border-purple-300 shadow-lg' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(feature.category)} rounded-xl flex items-center justify-center`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    {getStatusBadge(feature.status)}
                  </div>
                  <CardTitle className="text-lg">{feature.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                  <button
                    onClick={() => toggleFeature(feature.id)}
                    disabled={feature.status === 'coming-soon'}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                      isEnabled
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${feature.status === 'coming-soon' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isEnabled ? '활성화됨' : '활성화'}
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <Rocket className="text-purple-600" size={24} />
          <h3 className="text-xl font-bold text-gray-900">미래를 준비하세요</h3>
        </div>
        <p className="text-gray-700 mb-4">
          Freeshell은 2025년 최신 트렌드를 반영하여 지속적으로 업데이트됩니다.
          AI 에이전트, 음성 인터페이스, 3D 효과 등 미래지향적인 기능들을 먼저 경험하세요.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">10+</div>
            <div className="text-sm text-gray-600">최신 기능</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-gray-600">자동 업데이트</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">100%</div>
            <div className="text-sm text-gray-600">미래지향적</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">∞</div>
            <div className="text-sm text-gray-600">무한 가능성</div>
          </div>
        </div>
      </div>
    </div>
  );
}

