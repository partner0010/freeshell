'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, TrendingUp, Book, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { recommendationEngine, type Recommendation } from '@/lib/ai/recommendation-engine';

export function AIRecommendationsPanel() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = () => {
    const recs = recommendationEngine.generateRecommendations();
    setRecommendations(recs);
  };

  const getIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'feature':
        return <Zap size={20} className="text-blue-600" />;
      case 'template':
        return <Sparkles size={20} className="text-purple-600" />;
      case 'optimization':
        return <TrendingUp size={20} className="text-green-600" />;
      case 'tutorial':
        return <Book size={20} className="text-orange-600" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">AI 추천</h2>
            <p className="text-sm text-gray-500">사용 패턴 기반 맞춤형 추천</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {recommendations.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            아직 추천할 내용이 없습니다. 기능을 사용해보세요!
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getIcon(rec.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{rec.title}</h3>
                        <Badge variant="primary" size="sm">
                          우선순위 {rec.priority}
                        </Badge>
                        <Badge variant="success" size="sm">
                          신뢰도 {(rec.confidence * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                      {rec.action && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={rec.action}
                        >
                          확인하기
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Button variant="outline" onClick={loadRecommendations} className="w-full">
            추천 새로고침
          </Button>
        </div>
      </div>
    </div>
  );
}

