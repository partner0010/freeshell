'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Twitter, Instagram, Youtube, Hash, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface TrendAnalysis {
  trendingTopics: string[];
  popularHashtags: string[];
  emergingKeywords: string[];
  contentSuggestions: string[];
  bestPostingTimes: number[];
}

export function SNSTrendMonitor() {
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTrends();
    // 1시간마다 자동 업데이트
    const interval = setInterval(loadTrends, 3600000);
    return () => clearInterval(interval);
  }, []);

  const loadTrends = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/trends/sns');
      const data = await response.json();
      if (data.success) {
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('트렌드 로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (hour: number): string => {
    return `${hour}시`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-purple-600" size={24} />
              SNS 트렌드 모니터링
            </CardTitle>
            <button
              onClick={loadTrends}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm"
            >
              {isLoading ? '로딩 중...' : '새로고침'}
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 트렌딩 토픽 */}
          {analysis?.trendingTopics && analysis.trendingTopics.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Twitter size={18} />
                트렌딩 토픽
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.trendingTopics.map((topic, index) => (
                  <Badge key={index} variant="primary" className="text-sm">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 인기 해시태그 */}
          {analysis?.popularHashtags && analysis.popularHashtags.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Hash size={18} />
                인기 해시태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.popularHashtags.map((hashtag, index) => (
                  <Badge key={index} variant="info" className="text-sm">
                    {hashtag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 신규 키워드 */}
          {analysis?.emergingKeywords && analysis.emergingKeywords.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp size={18} />
                신규 키워드
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.emergingKeywords.map((keyword, index) => (
                  <Badge key={index} variant="success" className="text-sm">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 콘텐츠 제안 */}
          {analysis?.contentSuggestions && analysis.contentSuggestions.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">콘텐츠 제안</h3>
              <ul className="space-y-2">
                {analysis.contentSuggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 최적 포스팅 시간 */}
          {analysis?.bestPostingTimes && analysis.bestPostingTimes.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Clock size={18} />
                최적 포스팅 시간
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.bestPostingTimes.map((time, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {formatTime(time)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

