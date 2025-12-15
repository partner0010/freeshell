'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  Sparkles,
  Eye,
  Brain,
  Zap,
  Layers,
  Cpu,
  Code2,
  Palette,
  Globe,
  ArrowRight,
  Check,
  Lock,
} from 'lucide-react';

interface FutureFeature {
  id: string;
  name: string;
  description: string;
  category: 'ai' | 'ar' | 'vr' | 'blockchain' | 'quantum' | 'iot';
  status: 'available' | 'beta' | 'coming-soon';
  icon: any;
  benefits: string[];
  techStack: string[];
}

export function AIFutureFeatures() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const features: FutureFeature[] = [
    {
      id: 'ai-visual-builder',
      name: 'AI 비주얼 빌더',
      description: '자연어로 설명하면 AI가 자동으로 UI를 생성합니다',
      category: 'ai',
      status: 'available',
      icon: Sparkles,
      benefits: [
        '자연어로 UI 생성',
        '실시간 프리뷰',
        '자동 반응형 최적화',
      ],
      techStack: ['GPT-4 Vision', 'Stable Diffusion', 'React'],
    },
    {
      id: 'ar-preview',
      name: 'AR 실시간 프리뷰',
      description: '모바일 AR로 실제 환경에서 디자인을 확인합니다',
      category: 'ar',
      status: 'beta',
      icon: Eye,
      benefits: [
        '실제 환경에서 미리보기',
        '공간감 있는 디자인 검증',
        'QR 코드로 즉시 공유',
      ],
      techStack: ['WebXR', 'Three.js', 'MediaPipe'],
    },
    {
      id: 'ai-codegen',
      name: 'AI 코드 생성기',
      description: '디자인을 분석하여 완전한 프로덕션 코드를 생성합니다',
      category: 'ai',
      status: 'available',
      icon: Code2,
      benefits: [
        '디자인 → 코드 자동 변환',
        '다중 프레임워크 지원',
        '최적화된 코드 생성',
      ],
      techStack: ['Claude', 'GPT-4', 'TypeScript'],
    },
    {
      id: 'brain-computer',
      name: '브레인-컴퓨터 인터페이스',
      description: '생각만으로 디자인을 조작하는 실험적 기능',
      category: 'ai',
      status: 'coming-soon',
      icon: Brain,
      benefits: [
        '생각으로 제어',
        '접근성 혁신',
        '새로운 UX 패러다임',
      ],
      techStack: ['EEG', 'ML', 'Neural Networks'],
    },
    {
      id: 'blockchain-versioning',
      name: '블록체인 버전 관리',
      description: '디자인의 모든 변경사항을 블록체인에 기록합니다',
      category: 'blockchain',
      status: 'beta',
      icon: Lock,
      benefits: [
        '불변성 보장',
        '디자인 원본 증명',
        '분산 저장',
      ],
      techStack: ['IPFS', 'Ethereum', 'Web3'],
    },
    {
      id: 'quantum-optimization',
      name: '양자 최적화',
      description: '양자 컴퓨팅으로 디자인 레이아웃을 최적화합니다',
      category: 'quantum',
      status: 'coming-soon',
      icon: Cpu,
      benefits: [
        '초고속 최적화',
        '복잡한 레이아웃 해결',
        'AI 모델 훈련 가속',
      ],
      techStack: ['Qiskit', 'IBM Quantum', 'TensorFlow Quantum'],
    },
    {
      id: 'iot-integration',
      name: 'IoT 디바이스 통합',
      description: '실제 IoT 디바이스에서 디자인을 테스트합니다',
      category: 'iot',
      status: 'beta',
      icon: Globe,
      benefits: [
        '실제 디바이스 테스트',
        '원격 제어',
        '데이터 수집',
      ],
      techStack: ['MQTT', 'WebSocket', 'Raspberry Pi'],
    },
    {
      id: 'neural-design',
      name: '뉴럴 디자인 시스템',
      description: 'AI가 학습한 사용자 패턴으로 자동 디자인합니다',
      category: 'ai',
      status: 'available',
      icon: Layers,
      benefits: [
        '개인화된 디자인',
        '변환율 최적화',
        '자동 A/B 테스트',
      ],
      techStack: ['TensorFlow', 'PyTorch', 'MLflow'],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'beta':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'coming-soon':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return '사용 가능';
      case 'beta':
        return '베타';
      case 'coming-soon':
        return '출시 예정';
      default:
        return '';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
            <Rocket className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">미래 지향 기능</h2>
            <p className="text-sm text-gray-500">차세대 기술을 활용한 혁신적인 기능</p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
          <p className="text-sm text-cyan-800">
            <Rocket size={16} className="inline mr-2" />
            이 플랫폼만의 차별화된 미래 기술 기능들을 경험해보세요
          </p>
        </div>
      </div>

      {/* 기능 목록 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${
                  selectedFeature === feature.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-primary-300'
                }`}
                onClick={() => setSelectedFeature(feature.id === selectedFeature ? null : feature.id)}
              >
                <div className="flex items-start gap-4">
                  {/* 아이콘 */}
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="text-white" size={24} />
                  </div>

                  {/* 내용 */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-800">{feature.name}</h3>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                              feature.status
                            )}`}
                          >
                            {getStatusLabel(feature.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                      </div>
                    </div>

                    {/* 확장된 정보 */}
                    {selectedFeature === feature.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3 mt-3 pt-3 border-t border-gray-200"
                      >
                        {/* 장점 */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <Check size={14} className="text-green-600" />
                            주요 장점
                          </h4>
                          <ul className="space-y-1">
                            {feature.benefits.map((benefit, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                <ArrowRight size={14} className="text-primary-500 shrink-0 mt-0.5" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 기술 스택 */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <Zap size={14} className="text-yellow-600" />
                            기술 스택
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {feature.techStack.map((tech, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* 액션 버튼 */}
                        {feature.status === 'available' && (
                          <button className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center justify-center gap-2 transition-colors">
                            <Zap size={16} />
                            활성화하기
                          </button>
                        )}
                        {feature.status === 'beta' && (
                          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 transition-colors">
                            <Eye size={16} />
                            베타 테스트 참여
                          </button>
                        )}
                        {feature.status === 'coming-soon' && (
                          <div className="mt-4 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm text-center">
                            출시 예정일: 2024 Q2
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

