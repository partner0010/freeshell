'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  AlertCircle,
  CheckCircle,
  X,
  FileCode,
  Bug,
  Shield,
  ArrowRight,
  Download,
  Play,
  FileText,
} from 'lucide-react';

interface CodeIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  type: 'syntax' | 'logic' | 'security' | 'performance' | 'best-practice';
  file: string;
  line: number;
  column?: number;
  message: string;
  description: string;
  suggestion: string;
  code: string;
  fixedCode?: string;
}

interface CodeAnalysisResult {
  issues: CodeIssue[];
  summary: {
    total: number;
    errors: number;
    warnings: number;
    info: number;
    score: number;
  };
}

export function AICodeValidator() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<CodeAnalysisResult | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<CodeIssue | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 코드 분석 (AI 기반)
  const analyzeCode = async (code: string, fileName: string): Promise<CodeIssue[]> => {
    const issues: CodeIssue[] = [];

    // 1. 보안 취약점 검사
    const securityPatterns = [
      {
        pattern: /eval\s*\(/i,
        type: 'security' as const,
        severity: 'error' as const,
        message: 'eval() 사용은 XSS 공격에 취약합니다',
        suggestion: 'JSON.parse() 또는 안전한 파싱 방법을 사용하세요',
      },
      {
        pattern: /innerHTML\s*=/i,
        type: 'security' as const,
        severity: 'warning' as const,
        message: 'innerHTML 사용은 XSS 위험이 있습니다',
        suggestion: 'textContent 또는 DOMPurify를 사용하세요',
      },
      {
        pattern: /localStorage\.setItem.*password/i,
        type: 'security' as const,
        severity: 'error' as const,
        message: '비밀번호를 localStorage에 저장하지 마세요',
        suggestion: '서버 사이드에 안전하게 저장하거나 암호화하세요',
      },
      {
        pattern: /document\.cookie\s*=/i,
        type: 'security' as const,
        severity: 'warning' as const,
        message: '쿠키 설정 시 HttpOnly, Secure 플래그를 사용하세요',
        suggestion: 'document.cookie 대신 서버에서 Set-Cookie 헤더로 설정하세요',
      },
    ];

    const lines = code.split('\n');
    lines.forEach((line, index) => {
      securityPatterns.forEach((pattern) => {
        if (pattern.pattern.test(line)) {
          issues.push({
            id: `issue-${index}-${Math.random()}`,
            severity: pattern.severity,
            type: pattern.type,
            file: fileName,
            line: index + 1,
            message: pattern.message,
            description: pattern.message,
            suggestion: pattern.suggestion,
            code: line.trim(),
          });
        }
      });
    });

    // 2. 성능 이슈 검사
    const performancePatterns = [
      {
        pattern: /\.querySelectorAll\(/,
        type: 'performance' as const,
        severity: 'warning' as const,
        message: 'querySelectorAll은 느릴 수 있습니다',
        suggestion: 'getElementById나 getElementsByClassName을 사용하거나 결과를 캐싱하세요',
      },
      {
        pattern: /for\s*\([^)]*\.length/i,
        type: 'performance' as const,
        severity: 'info' as const,
        message: '반복문에서 length를 매번 계산합니다',
        suggestion: '길이를 변수에 저장한 후 사용하세요',
      },
    ];

    lines.forEach((line, index) => {
      performancePatterns.forEach((pattern) => {
        if (pattern.pattern.test(line)) {
          issues.push({
            id: `perf-${index}-${Math.random()}`,
            severity: pattern.severity,
            type: pattern.type,
            file: fileName,
            line: index + 1,
            message: pattern.message,
            description: pattern.message,
            suggestion: pattern.suggestion,
            code: line.trim(),
          });
        }
      });
    });

    // 3. 베스트 프랙티스 검사
    const bestPracticePatterns = [
      {
        pattern: /var\s+\w+/,
        type: 'best-practice' as const,
        severity: 'warning' as const,
        message: 'var 대신 const나 let을 사용하세요',
        suggestion: 'const 또는 let으로 변경하세요',
      },
      {
        pattern: /==\s*[^=]/,
        type: 'best-practice' as const,
        severity: 'warning' as const,
        message: '== 대신 ===를 사용하세요',
        suggestion: '엄격한 비교 연산자(===)를 사용하세요',
      },
      {
        pattern: /console\.log\(/,
        type: 'best-practice' as const,
        severity: 'info' as const,
        message: '프로덕션 코드에서 console.log를 제거하세요',
        suggestion: '디버깅 후 제거하거나 로깅 라이브러리를 사용하세요',
      },
    ];

    lines.forEach((line, index) => {
      bestPracticePatterns.forEach((pattern) => {
        if (pattern.pattern.test(line)) {
          issues.push({
            id: `bp-${index}-${Math.random()}`,
            severity: pattern.severity,
            type: pattern.type,
            file: fileName,
            line: index + 1,
            message: pattern.message,
            description: pattern.message,
            suggestion: pattern.suggestion,
            code: line.trim(),
          });
        }
      });
    });

    // 4. 구문 오류 검사 (간단한 버전)
    try {
      // JavaScript 코드 검증
      if (fileName.endsWith('.js') || fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
        // 실제로는 더 정교한 파서 사용 (ESLint, TypeScript 컴파일러 등)
        // 여기서는 기본적인 검사만
        const openBraces = (code.match(/{/g) || []).length;
        const closeBraces = (code.match(/}/g) || []).length;
        const openParens = (code.match(/\(/g) || []).length;
        const closeParens = (code.match(/\)/g) || []).length;

        if (openBraces !== closeBraces) {
          issues.push({
            id: `syntax-braces-${Math.random()}`,
            severity: 'error',
            type: 'syntax',
            file: fileName,
            line: 1,
            message: '중괄호가 맞지 않습니다',
            description: `열린 중괄호: ${openBraces}, 닫힌 중괄호: ${closeBraces}`,
            suggestion: '모든 중괄호가 올바르게 닫혔는지 확인하세요',
            code: '',
          });
        }

        if (openParens !== closeParens) {
          issues.push({
            id: `syntax-parens-${Math.random()}`,
            severity: 'error',
            type: 'syntax',
            file: fileName,
            line: 1,
            message: '괄호가 맞지 않습니다',
            description: `열린 괄호: ${openParens}, 닫힌 괄호: ${closeParens}`,
            suggestion: '모든 괄호가 올바르게 닫혔는지 확인하세요',
            code: '',
          });
        }
      }
    } catch (error) {
      issues.push({
        id: `syntax-error-${Math.random()}`,
        severity: 'error',
        type: 'syntax',
        file: fileName,
        line: 1,
        message: '구문 오류가 발견되었습니다',
        description: String(error),
        suggestion: '코드 구문을 확인하세요',
        code: '',
      });
    }

    return issues;
  };

  // 파일 선택
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  // 분석 시작
  const handleAnalyze = async () => {
    if (files.length === 0) {
      alert('분석할 파일을 선택하세요');
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      const allIssues: CodeIssue[] = [];

      for (const file of files) {
        const text = await file.text();
        const issues = await analyzeCode(text, file.name);
        allIssues.push(...issues);
      }

      const errors = allIssues.filter((i) => i.severity === 'error').length;
      const warnings = allIssues.filter((i) => i.severity === 'warning').length;
      const info = allIssues.filter((i) => i.severity === 'info').length;

      const score = Math.max(
        0,
        100 -
          errors * 10 -
          warnings * 5 -
          info * 2
      );

      setResults({
        issues: allIssues,
        summary: {
          total: allIssues.length,
          errors,
          warnings,
          info,
          score,
        },
      });
    } catch (error) {
      console.error('Analysis error:', error);
      alert('분석 중 오류가 발생했습니다');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 수정 제안 적용
  const applyFix = (issue: CodeIssue) => {
    // 실제로는 파일을 수정해야 하지만, 여기서는 예시
    alert(`수정 제안:\n${issue.suggestion}\n\n실제 파일에 적용하려면 개발 환경에서 수정하세요.`);
  };

  // 보고서 내보내기
  const exportReport = () => {
    if (!results) return;

    const report = {
      summary: results.summary,
      issues: results.issues,
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `code-analysis-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
              <Code2 className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">AI 코드 검증</h2>
              <p className="text-sm text-gray-500">코드 오류, 보안 취약점, 성능 이슈 자동 감지</p>
            </div>
          </div>
        </div>

        {/* 파일 선택 */}
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".js,.ts,.tsx,.jsx,.css,.html"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <FileCode size={18} />
            파일 선택
          </button>
          {files.length > 0 && (
            <span className="text-sm text-gray-600">{files.length}개 파일 선택됨</span>
          )}
          <button
            onClick={handleAnalyze}
            disabled={files.length === 0 || isAnalyzing}
            className="ml-auto px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                분석 중...
              </>
            ) : (
              <>
                <Play size={18} />
                분석 시작
              </>
            )}
          </button>
        </div>
      </div>

      {/* 결과 */}
      <div className="flex-1 overflow-auto p-6">
        {!results ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Code2 className="text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg mb-2">코드 분석 결과가 여기에 표시됩니다</p>
            <p className="text-gray-400 text-sm">파일을 선택하고 분석을 시작하세요</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 요약 */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="text-red-600" size={20} />
                  <span className="text-sm font-medium text-red-600">오류</span>
                </div>
                <p className="text-2xl font-bold text-red-600">{results.summary.errors}</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="text-yellow-600" size={20} />
                  <span className="text-sm font-medium text-yellow-600">경고</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600">{results.summary.warnings}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="text-blue-600" size={20} />
                  <span className="text-sm font-medium text-blue-600">정보</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{results.summary.info}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-sm font-medium text-green-600">점수</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{results.summary.score}/100</p>
              </div>
            </div>

            {/* 이슈 목록 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">발견된 이슈</h3>
                <button
                  onClick={exportReport}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Download size={16} />
                  보고서 내보내기
                </button>
              </div>

              {results.issues.map((issue) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedIssue(issue)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                    issue.severity === 'error'
                      ? 'bg-red-50 border-red-200'
                      : issue.severity === 'warning'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {issue.severity === 'error' ? (
                          <AlertCircle className="text-red-600" size={18} />
                        ) : (
                          <AlertCircle
                            className={issue.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'}
                            size={18}
                          />
                        )}
                        <span className="font-semibold text-gray-800">{issue.message}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-200 rounded text-gray-600">
                          {issue.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileText size={12} />
                          {issue.file}:{issue.line}
                        </span>
                      </div>
                      {issue.code && (
                        <pre className="mt-2 p-2 bg-gray-900 text-gray-100 text-xs rounded overflow-x-auto">
                          {issue.code}
                        </pre>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        applyFix(issue);
                      }}
                      className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 flex items-center gap-1"
                    >
                      <ArrowRight size={14} />
                      수정 적용
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 상세 패널 */}
      <AnimatePresence>
        {selectedIssue && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute top-0 right-0 bottom-0 w-96 bg-white border-l shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">이슈 상세</h3>
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">파일</label>
                  <p className="text-gray-800">{selectedIssue.file}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">위치</label>
                  <p className="text-gray-800">
                    {selectedIssue.line}번째 줄{selectedIssue.column && `, ${selectedIssue.column}번째 열`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">설명</label>
                  <p className="text-gray-800">{selectedIssue.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">수정 제안</label>
                  <p className="text-gray-800 bg-blue-50 p-3 rounded-lg">{selectedIssue.suggestion}</p>
                </div>
                {selectedIssue.code && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">문제 코드</label>
                    <pre className="mt-2 p-3 bg-gray-900 text-gray-100 text-sm rounded overflow-x-auto">
                      {selectedIssue.code}
                    </pre>
                  </div>
                )}
                {selectedIssue.fixedCode && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">수정된 코드</label>
                    <pre className="mt-2 p-3 bg-green-900 text-green-100 text-sm rounded overflow-x-auto">
                      {selectedIssue.fixedCode}
                    </pre>
                  </div>
                )}
              </div>

              <button
                onClick={() => applyFix(selectedIssue)}
                className="mt-6 w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                수정 적용하기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

