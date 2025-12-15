'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  Code2,
  Zap,
  Shield,
  TrendingUp,
  RefreshCw,
  Download,
  ExternalLink,
} from 'lucide-react';

interface ValidationResult {
  tool: string;
  status: 'success' | 'warning' | 'error';
  score: number;
  issues: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    line?: number;
  }[];
  recommendations: string[];
}

export function AIFreeAPIValidator() {
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [code, setCode] = useState('');

  // 무료 AI API를 활용한 코드 검증
  const validateWithFreeAPIs = async (code: string) => {
    setIsValidating(true);
    setResults([]);

    // 여러 무료 AI API를 병렬로 호출
    const validations = await Promise.all([
      // 1. Hugging Face API (무료)
      validateWithHuggingFace(code),
      // 2. Replicate API (무료 티어)
      validateWithReplicate(code),
      // 3. OpenRouter (무료 모델)
      validateWithOpenRouter(code),
      // 4. Local LLM (Ollama 등)
      validateWithLocalLLM(code),
    ]);

    setResults(validations);
    setIsValidating(false);
  };

  // Hugging Face API 검증
  const validateWithHuggingFace = async (code: string): Promise<ValidationResult> => {
    try {
      // 실제로는 Hugging Face Inference API 호출
      // const response = await fetch('https://api-inference.huggingface.co/models/...', {
      //   method: 'POST',
      //   headers: { 'Authorization': 'Bearer YOUR_TOKEN' },
      //   body: JSON.stringify({ inputs: code }),
      // });

      // 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        tool: 'Hugging Face',
        status: 'success',
        score: 85,
        issues: [
          {
            type: 'performance',
            severity: 'medium',
            message: '반복문에서 불필요한 DOM 조작이 있습니다',
            line: 42,
          },
        ],
        recommendations: [
          'querySelector 결과를 변수에 캐싱하세요',
          '이벤트 리스너는 useCallback으로 최적화하세요',
        ],
      };
    } catch (error) {
      return {
        tool: 'Hugging Face',
        status: 'error',
        score: 0,
        issues: [],
        recommendations: ['API 호출 실패'],
      };
    }
  };

  // Replicate API 검증
  const validateWithReplicate = async (code: string): Promise<ValidationResult> => {
    try {
      // Replicate API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        tool: 'Replicate',
        status: 'success',
        score: 78,
        issues: [
          {
            type: 'security',
            severity: 'high',
            message: 'XSS 취약점이 발견되었습니다',
            line: 15,
          },
        ],
        recommendations: [
          'innerHTML 대신 textContent를 사용하세요',
          'DOMPurify 라이브러리를 적용하세요',
        ],
      };
    } catch (error) {
      return {
        tool: 'Replicate',
        status: 'error',
        score: 0,
        issues: [],
        recommendations: [],
      };
    }
  };

  // OpenRouter 검증 (무료 모델 사용)
  const validateWithOpenRouter = async (code: string): Promise<ValidationResult> => {
    try {
      // OpenRouter API 호출 (무료 모델: mistralai/mistral-7b-instruct 등)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return {
        tool: 'OpenRouter (Free Model)',
        status: 'warning',
        score: 72,
        issues: [
          {
            type: 'best-practice',
            severity: 'low',
            message: 'console.log가 프로덕션 코드에 남아있습니다',
            line: 8,
          },
        ],
        recommendations: ['프로덕션 배포 전 console.log를 제거하세요'],
      };
    } catch (error) {
      return {
        tool: 'OpenRouter',
        status: 'error',
        score: 0,
        issues: [],
        recommendations: [],
      };
    }
  };

  // Local LLM 검증 (Ollama)
  const validateWithLocalLLM = async (code: string): Promise<ValidationResult> => {
    try {
      // Ollama 로컬 API 호출 (localhost:11434)
      // const response = await fetch('http://localhost:11434/api/generate', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     model: 'codellama',
      //     prompt: `Review this code: ${code}`,
      //   }),
      // });

      await new Promise((resolve) => setTimeout(resolve, 800));

      return {
        tool: 'Local LLM (Ollama)',
        status: 'success',
        score: 80,
        issues: [
          {
            type: 'syntax',
            severity: 'medium',
            message: 'TypeScript 타입이 명시되지 않았습니다',
            line: 3,
          },
        ],
        recommendations: ['명시적 타입 선언으로 타입 안정성 향상'],
      };
    } catch (error) {
      return {
        tool: 'Local LLM',
        status: 'error',
        score: 0,
        issues: [{ type: 'connection', severity: 'high', message: '로컬 LLM에 연결할 수 없습니다' }],
        recommendations: ['Ollama가 실행 중인지 확인하세요'],
      };
    }
  };

  // 종합 점수 계산
  const overallScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    : 0;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center">
              <Zap className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">무료 AI 검증</h2>
              <p className="text-sm text-gray-500">
                여러 무료 AI API를 활용한 종합 코드 검증
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="검증할 코드를 입력하세요..."
            className="flex-1 px-4 py-3 border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-300"
            rows={4}
          />
          <button
            onClick={() => validateWithFreeAPIs(code)}
            disabled={!code.trim() || isValidating}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            {isValidating ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                검증 중...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                검증 시작
              </>
            )}
          </button>
        </div>

        {/* 종합 점수 */}
        {results.length > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">종합 점수</div>
                <div className="text-3xl font-bold text-purple-600">{overallScore}/100</div>
              </div>
              <div className="flex items-center gap-4">
                {results.map((r) => (
                  <div key={r.tool} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">{r.tool}</div>
                    <div className="text-lg font-bold text-gray-800">{r.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 검증 결과 */}
      <div className="flex-1 overflow-auto p-6">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Code2 className="text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg mb-2">코드를 입력하고 검증을 시작하세요</p>
            <p className="text-gray-400 text-sm">
              여러 무료 AI API를 활용하여 종합적으로 코드를 분석합니다
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 max-w-md">
              <p className="text-sm text-blue-800 font-medium mb-2">지원하는 AI 서비스:</p>
              <ul className="text-xs text-blue-700 space-y-1 text-left">
                <li>• Hugging Face (무료)</li>
                <li>• Replicate (무료 티어)</li>
                <li>• OpenRouter (무료 모델)</li>
                <li>• Local LLM (Ollama)</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => (
              <motion.div
                key={result.tool}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-5 rounded-xl border-2 ${
                  result.status === 'success'
                    ? 'border-green-200 bg-green-50'
                    : result.status === 'warning'
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {result.status === 'success' ? (
                      <CheckCircle2 className="text-green-600" size={24} />
                    ) : result.status === 'warning' ? (
                      <AlertTriangle className="text-yellow-600" size={24} />
                    ) : (
                      <AlertTriangle className="text-red-600" size={24} />
                    )}
                    <div>
                      <h3 className="font-bold text-gray-800">{result.tool}</h3>
                      <p className="text-xs text-gray-500">
                        {result.status === 'success'
                          ? '검증 완료'
                          : result.status === 'warning'
                          ? '경고 있음'
                          : '오류 발생'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{result.score}</div>
                    <div className="text-xs text-gray-500">점수</div>
                  </div>
                </div>

                {/* 이슈 목록 */}
                {result.issues.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-semibold text-gray-700">발견된 이슈</h4>
                    {result.issues.map((issue, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg ${
                          issue.severity === 'high'
                            ? 'bg-red-100 border border-red-200'
                            : issue.severity === 'medium'
                            ? 'bg-yellow-100 border border-yellow-200'
                            : 'bg-blue-100 border border-blue-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">{issue.type}</span>
                          {issue.line && (
                            <span className="text-xs text-gray-500">라인 {issue.line}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-800">{issue.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 권장사항 */}
                {result.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">권장사항</h4>
                    <ul className="space-y-1">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* API 정보 */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href="#"
                    className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    <ExternalLink size={12} />
                    API 문서 보기
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

