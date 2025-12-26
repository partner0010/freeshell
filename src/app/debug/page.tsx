/**
 * 디버깅 솔루션 페이지
 * URL 또는 파일을 업로드하여 자체 디버깅 수행
 */

'use client';

import { useState } from 'react';
import { Bug, Upload, Link as LinkIcon, FileCode, AlertCircle, CheckCircle, Loader2, X, FileText, Code, Terminal, Activity, XCircle } from 'lucide-react';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { motion } from 'framer-motion';

interface DebugResult {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  location?: string;
  suggestion?: string;
}

export default function DebugPage() {
  const [inputType, setInputType] = useState<'url' | 'file'>('url');
  const [url, setUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<DebugResult[]>([]);
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

  const handleAnalyze = async () => {
    if (inputType === 'url' && !url.trim()) {
      alert('URL을 입력하세요.');
      return;
    }
    if (inputType === 'file' && !uploadedFile) {
      alert('파일을 업로드하세요.');
      return;
    }

    setIsAnalyzing(true);
    setResults([]);

    try {
      const response = await fetch('/api/debug/analyze', {
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
      } else {
        const error = await response.json();
        setResults([{
          type: 'error',
          message: error.error || '디버깅 중 오류가 발생했습니다.',
        }]);
      }
    } catch (error: any) {
      setResults([{
        type: 'error',
        message: `디버깅 실패: ${error.message}`,
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="text-red-600" size={20} />;
      case 'warning': return <AlertCircle className="text-yellow-600" size={20} />;
      case 'success': return <CheckCircle className="text-green-600" size={20} />;
      default: return <FileCode className="text-blue-600" size={20} />;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-50 border-red-200 text-red-900';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'success': return 'bg-green-50 border-green-200 text-green-900';
      default: return 'bg-blue-50 border-blue-200 text-blue-900';
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Bug className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                디버깅 솔루션
              </h1>
              <p className="text-gray-600 mt-1">
                URL 또는 파일을 업로드하여 코드를 분석하고 디버깅하세요
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
              }}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
                inputType === 'url'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
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
              }}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
                inputType === 'file'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                />
              </div>
            </div>
          )}

          {/* 파일 업로드 */}
          {inputType === 'file' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  코드 파일 업로드
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".js,.ts,.jsx,.tsx,.html,.css,.json,.py,.java,.cpp,.c"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <Upload className="text-gray-400" size={40} />
                    <div>
                      <span className="text-orange-600 font-semibold">클릭하여 파일 선택</span>
                      <span className="text-gray-600"> 또는 드래그 앤 드롭</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      지원 형식: .js, .ts, .jsx, .tsx, .html, .css, .json, .py, .java, .cpp, .c
                    </p>
                  </label>
                </div>
                {uploadedFile && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="text-orange-600" size={20} />
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

          {/* 분석 버튼 */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (inputType === 'url' && !url.trim()) || (inputType === 'file' && !uploadedFile)}
            className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                분석 중...
              </>
            ) : (
              <>
                <Bug size={20} />
                디버깅 시작
              </>
            )}
          </button>
        </div>

        {/* 결과 표시 */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Code size={24} />
              디버깅 결과
            </h2>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${getResultColor(result.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getResultIcon(result.type)}
                    <div className="flex-1">
                      <p className="font-medium mb-1">{result.message}</p>
                      {result.location && (
                        <p className="text-sm opacity-75 mb-2">
                          위치: {result.location}
                        </p>
                      )}
                      {result.suggestion && (
                        <div className="mt-2 p-3 bg-white/50 rounded-lg">
                          <p className="text-sm font-medium mb-1">💡 제안:</p>
                          <p className="text-sm">{result.suggestion}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 안내 */}
        {results.length === 0 && !isAnalyzing && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Activity size={20} />
              디버깅 기능 안내
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                <span>URL을 입력하면 해당 사이트의 코드를 분석합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                <span>파일을 업로드하면 코드의 오류, 경고, 최적화 제안을 제공합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                <span>JavaScript, TypeScript, Python, Java, C++ 등 다양한 언어를 지원합니다</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
