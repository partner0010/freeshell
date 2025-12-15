'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  AlertCircle,
  Download,
  RefreshCw,
  Code2,
  Shield,
  Zap,
  Rocket,
} from 'lucide-react';
import {
  runPipeline,
  runTests,
  scanDependencies,
  type PipelineRun,
  type TestResult,
} from '@/lib/cicd/pipeline';

export function PipelinePanel() {
  const [pipelines, setPipelines] = useState<PipelineRun[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState<PipelineRun | null>(null);

  const handleRunPipeline = async () => {
    setIsRunning(true);
    try {
      const pipeline = await runPipeline({
        branch: 'main',
        commit: 'abc123',
        author: 'Developer',
      });
      setPipelines((prev) => [pipeline, ...prev]);
      setSelectedPipeline(pipeline);
    } catch (error) {
      alert(`파이프라인 실행 실패: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const results = await runTests({ type: 'all' });
      setTestResults(results);
    } catch (error) {
      alert(`테스트 실행 실패: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleScanDependencies = async () => {
    setIsRunning(true);
    try {
      const scan = await scanDependencies();
      alert(`의존성 스캔 완료: ${scan.total}개 취약점 발견`);
    } catch (error) {
      alert(`스캔 실패: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="text-green-600" size={20} />;
      case 'failed':
        return <XCircle className="text-red-600" size={20} />;
      case 'running':
        return <Loader2 className="text-blue-600 animate-spin" size={20} />;
      case 'pending':
        return <Clock className="text-gray-400" size={20} />;
      default:
        return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'running':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <GitBranch className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">CI/CD 파이프라인</h2>
              <p className="text-sm text-gray-500">자동화된 테스트, 빌드, 배포</p>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunPipeline}
            disabled={isRunning}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Play size={16} />
            파이프라인 실행
          </button>
          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Code2 size={16} />
            테스트 실행
          </button>
          <button
            onClick={handleScanDependencies}
            disabled={isRunning}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Shield size={16} />
            의존성 스캔
          </button>
        </div>
      </div>

      {/* 내용 */}
      <div className="flex-1 overflow-auto p-6">
        {/* 파이프라인 목록 */}
        {pipelines.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">파이프라인 실행 이력</h3>
            <div className="space-y-3">
              {pipelines.map((pipeline) => (
                <motion.div
                  key={pipeline.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${getStatusColor(
                    pipeline.status
                  )} ${selectedPipeline?.id === pipeline.id ? 'ring-2 ring-primary-500' : ''}`}
                  onClick={() => setSelectedPipeline(pipeline)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(pipeline.status)}
                      <div>
                        <div className="font-semibold text-gray-800">
                          {pipeline.branch} • {pipeline.commit.substring(0, 7)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(pipeline.startedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">
                        {pipeline.duration ? `${(pipeline.duration / 1000).toFixed(1)}s` : '-'}
                      </div>
                      <div className="text-xs text-gray-500">by {pipeline.author}</div>
                    </div>
                  </div>

                  {/* 스테이지 목록 */}
                  <div className="grid grid-cols-5 gap-2">
                    {pipeline.stages.map((stage) => {
                      const icons: Record<string, any> = {
                        lint: Code2,
                        test: Zap,
                        build: Rocket,
                        security: Shield,
                        deploy: GitBranch,
                      };
                      const Icon = icons[stage.id] || AlertCircle;
                      return (
                        <div
                          key={stage.id}
                          className={`p-2 rounded-lg text-center ${getStatusColor(stage.status)}`}
                        >
                          <Icon size={16} className="mx-auto mb-1" />
                          <div className="text-xs font-medium">{stage.name}</div>
                          {getStatusIcon(stage.status)}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* 선택된 파이프라인 상세 */}
        {selectedPipeline && (
          <section className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">상세 로그</h3>
            <div className="space-y-3">
              {selectedPipeline.stages.map((stage) => (
                <div key={stage.id} className="p-4 bg-white border rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(stage.status)}
                      <span className="font-semibold text-gray-800">{stage.name}</span>
                    </div>
                    {stage.duration && (
                      <span className="text-sm text-gray-500">
                        {(stage.duration / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>
                  {stage.logs && (
                    <div className="mt-2 bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
                      {stage.logs.map((log, i) => (
                        <div key={i}>{log}</div>
                      ))}
                    </div>
                  )}
                  {stage.error && (
                    <div className="mt-2 bg-red-50 border border-red-200 p-3 rounded text-sm text-red-800">
                      {stage.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 테스트 결과 */}
        {testResults.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-4">테스트 결과</h3>
            <div className="grid grid-cols-3 gap-4">
              {testResults.map((result) => (
                <div key={result.type} className="p-4 bg-white border rounded-xl">
                  <div className="font-semibold text-gray-800 mb-2 capitalize">{result.type} Tests</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">통과</span>
                      <span className="font-bold text-green-600">{result.passed}</span>
                    </div>
                    {result.failed > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">실패</span>
                        <span className="font-bold text-red-600">{result.failed}</span>
                      </div>
                    )}
                    {result.coverage && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">커버리지</span>
                        <span className="font-bold text-blue-600">{result.coverage}%</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>소요 시간</span>
                      <span>{(result.duration / 1000).toFixed(1)}s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 빈 상태 */}
        {pipelines.length === 0 && testResults.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <GitBranch className="text-gray-300 mx-auto mb-4" size={64} />
              <p className="text-gray-500 text-lg mb-2">CI/CD 파이프라인을 실행하세요</p>
              <p className="text-gray-400 text-sm">
                자동화된 테스트, 빌드, 배포를 통해 개발 워크플로우를 최적화합니다
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

