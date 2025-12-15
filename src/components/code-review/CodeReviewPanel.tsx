'use client';

import React, { useState } from 'react';
import { Code2, AlertTriangle, CheckCircle2, Info, Lightbulb, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { aiCodeReviewer, type CodeReview, type CodeIssue } from '@/lib/code-review/ai-code-reviewer';
import { useToast } from '@/components/ui/Toast';

export function CodeReviewPanel() {
  const [code, setCode] = useState('');
  const [review, setReview] = useState<CodeReview | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const { showToast } = useToast();

  const handleReview = async () => {
    if (!code.trim()) {
      showToast('warning', '코드를 입력해주세요');
      return;
    }

    setIsReviewing(true);
    try {
      const result = await aiCodeReviewer.reviewCode(code);
      setReview(result);
      showToast('success', '코드 리뷰가 완료되었습니다');
    } catch (error) {
      showToast('error', '코드 리뷰 중 오류가 발생했습니다');
    } finally {
      setIsReviewing(false);
    }
  };

  const getSeverityIcon = (severity: CodeIssue['severity']) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'info':
        return <Info size={16} className="text-blue-500" />;
      case 'suggestion':
        return <Lightbulb size={16} className="text-purple-500" />;
    }
  };

  const getSeverityColor = (severity: CodeIssue['severity']) => {
    switch (severity) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'suggestion':
        return 'bg-purple-50 border-purple-200 text-purple-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Code2 className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">AI 코드 리뷰</h2>
            <p className="text-sm text-gray-500">코드 품질 자동 검사 및 개선 제안</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* 코드 입력 */}
        <Card>
          <CardHeader>
            <CardTitle>코드 입력</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="리뷰할 코드를 입력하세요..."
              className="w-full h-48 px-4 py-3 border rounded-lg resize-none font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button
              variant="primary"
              onClick={handleReview}
              disabled={isReviewing || !code.trim()}
              className="mt-4 w-full"
            >
              {isReviewing ? '리뷰 중...' : '코드 리뷰 실행'}
            </Button>
          </CardContent>
        </Card>

        {/* 리뷰 결과 */}
        {review && (
          <>
            {/* 점수 카드 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">코드 품질 점수</div>
                    <div className={`text-4xl font-bold ${getScoreColor(review.score)}`}>
                      {review.score}
                      <span className="text-2xl text-gray-400">/100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">이슈</div>
                    <div className="text-2xl font-bold text-gray-800">{review.issues.length}</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{review.summary}</p>
                </div>
              </CardContent>
            </Card>

            {/* 이슈 목록 */}
            {review.issues.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>발견된 이슈</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {review.issues.map((issue, index) => (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg ${getSeverityColor(issue.severity)}`}
                      >
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(issue.severity)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">라인 {issue.line}</span>
                              <Badge variant={issue.severity === 'error' ? 'error' : 'warning'} size="sm">
                                {issue.severity}
                              </Badge>
                            </div>
                            <p className="text-sm mb-1">{issue.message}</p>
                            {issue.suggestion && (
                              <p className="text-xs opacity-75 mt-1">
                                💡 제안: {issue.suggestion}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 제안사항 */}
            {review.suggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>개선 제안</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {review.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                        <Lightbulb size={16} className="text-purple-600 mt-0.5" />
                        <span className="text-sm text-purple-800">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}

