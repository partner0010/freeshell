/**
 * 사이트 검증 및 모니터링 페이지
 * URL 또는 파일을 업로드하여 사이트 검증 수행
 */

'use client';

import { useState } from 'react';
import { Shield, Upload, Link as LinkIcon, CheckCircle, AlertTriangle, XCircle, RefreshCw, Loader2, X, FileText, Sparkles, Zap, Lock, Globe, Wrench } from 'lucide-react';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { motion } from 'framer-motion';

interface ValidationResult {
  category: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  details?: string[];
  score?: number;
}

export default function ValidatePage() {
  const [inputType, setInputType] = useState<'url' | 'file'>('url');
  const [url, setUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setFileContent(content);
      };
      reader.readAsText(file);
    }
  };

  const handleValidate = async () => {
    if (inputType === 'url' && !url.trim()) {
      alert('URL을 입력하세요.');
      return;
    }
    if (inputType === 'file' && !uploadedFile) {
      alert('파일을 업로드하세요.');
      return;
    }

    setIsValidating(true);
    setResults([]);
    setOverallScore(null);

    try {
      const response = await fetch('/api/validate/site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: inputType,
          url: inputType === 'url' ? url : undefined,
          content: inputType === 'file' ? fileContent : undefined,
          fileName: inputType === 'file' ? uploadedFile?.name : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setOverallScore(data.overallScore || null);
      } else {
        const error = await response.json();
        setResults([{
          category: '오류',
          status: 'fail',
          message: error.error || '검증 중 오류가 발생했습니다.',
        }]);
      }
    } catch (error: any) {
      setResults([{
        category: '오류',
        status: 'fail',
        message: `검증 실패: ${error.message}`,
      }]);
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'fail': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'fail': return XCircle;
      default: return Shield;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <GlobalHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                사이트 검증 및 모니터링
              </h1>
              <p className="text-gray-600 mt-1">
                URL 또는 파일을 업로드하여 사이트를 검증하고 보안 취약점을 점검하세요
              </p>
            </div>
          </div>
        </motion.div>

        {/* 입력 방식 선택 */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 mb-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                setInputType('url');
                setUrl('');
                setUploadedFile(null);
                setFileContent('');
                setResults([]);
                setOverallScore(null);
              }}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
                inputType === 'url'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <LinkIcon className="inline mr-2" size={20} />
              URL 입력
            </button>
            <button
              onClick={() => {
                setInputType('file');
                setUrl('');
                setUploadedFile(null);
                setFileContent('');
                setResults([]);
                setOverallScore(null);
              }}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
                inputType === 'file'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Upload className="inline mr-2" size={20} />
              파일 업로드
            </button>
          </div>

          {/* URL 입력 */}
          {inputType === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  사이트 URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                />
              </div>
            </div>
          )}

          {/* 파일 업로드 */}
          {inputType === 'file' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  사이트 파일 업로드
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".html,.css,.js,.ts,.jsx,.tsx,.json"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <Upload className="text-gray-400" size={40} />
                    <div>
                      <span className="text-green-600 font-semibold">클릭하여 파일 선택</span>
                      <span className="text-gray-600"> 또는 드래그 앤 드롭</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      지원 형식: .html, .css, .js, .ts, .jsx, .tsx, .json
                    </p>
                  </label>
                </div>
                {uploadedFile && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="text-green-600" size={20} />
                      <div>
                        <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUploadedFile(null);
                        setFileContent('');
                      }}
                      className="p-2 text-gray-500 hover:text-red-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 검증 버튼 */}
          <button
            onClick={handleValidate}
            disabled={isValidating || (inputType === 'url' && !url.trim()) || (inputType === 'file' && !uploadedFile)}
            className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isValidating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                검증 중...
              </>
            ) : (
              <>
                <Shield size={20} />
                사이트 검증 실행
              </>
            )}
          </button>
        </div>

        {/* 전체 점수 */}
        {overallScore !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">전체 점수</h2>
                <p className="text-sm text-gray-600">종합 검증 결과</p>
              </div>
              <div className={`text-4xl sm:text-5xl font-bold ${
                overallScore >= 90 ? 'text-green-600' :
                overallScore >= 70 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {overallScore}/100
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  overallScore >= 90 ? 'bg-green-600' :
                  overallScore >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${overallScore}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* 검증 결과 */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mb-8"
          >
            {results.map((result, i) => {
              const StatusIcon = getStatusIcon(result.status);
              return (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 border-2">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getStatusColor(result.status)}`}>
                      <StatusIcon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{result.category}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                          {result.status === 'pass' ? '통과' :
                           result.status === 'warning' ? '경고' : '실패'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{result.message}</p>
                      {result.score !== undefined && (
                        <div className="mb-2">
                          <div className="text-sm text-gray-600 mb-1">점수: {result.score}/100</div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                result.score >= 90 ? 'bg-green-600' :
                                result.score >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${result.score}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {result.details && result.details.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {result.details.map((detail, j) => (
                            <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-gray-400">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* 검증 카테고리 안내 */}
        {results.length === 0 && !isValidating && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: '보안 취약점', icon: Lock, desc: 'XSS, SQL Injection 등 보안 취약점 검사' },
              { name: '성능 최적화', icon: Zap, desc: '페이지 로딩 속도 및 성능 분석' },
              { name: '접근성', icon: Globe, desc: 'WCAG 가이드라인 준수 여부 확인' },
              { name: 'SEO', icon: CheckCircle, desc: '검색 엔진 최적화 상태 확인' },
              { name: '모바일 대응', icon: Wrench, desc: '반응형 디자인 및 모바일 호환성' },
              { name: '코드 품질', icon: Shield, desc: '코드 스타일 및 품질 검사' },
            ].map((category, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <category.icon className="text-green-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{category.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
