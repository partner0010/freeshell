'use client';

import React, { useState, useEffect } from 'react';
import { Search, Command, FileText, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { globalSearchEngine, type SearchResult } from '@/lib/search/global-search';

export function GlobalSearchPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // 검색 인덱스 초기화
    globalSearchEngine.indexItems([
      {
        id: 'cmd-1',
        type: 'command',
        title: '새 블록 추가',
        description: '새로운 블록을 캔버스에 추가합니다',
        keywords: ['블록', '추가', 'new', 'block'],
      },
      {
        id: 'menu-1',
        type: 'menu',
        title: 'AI 디자인',
        description: 'AI 기반 디자인 제안',
        keywords: ['AI', '디자인', '제안', 'design'],
      },
      {
        id: 'file-1',
        type: 'file',
        title: 'main.tsx',
        description: '메인 컴포넌트 파일',
        keywords: ['main', 'component', 'tsx'],
      },
    ]);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = globalSearchEngine.search(query);
      setResults(searchResults);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'command':
        return <Command size={16} className="text-blue-500" />;
      case 'menu':
        return <Sparkles size={16} className="text-purple-500" />;
      case 'file':
        return <FileText size={16} className="text-green-500" />;
      case 'template':
        return <Layers size={16} className="text-orange-500" />;
      default:
        return <Search size={16} className="text-gray-400" />;
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'command':
        return '명령어';
      case 'menu':
        return '메뉴';
      case 'file':
        return '파일';
      case 'template':
        return '템플릿';
      default:
        return '콘텐츠';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="전체 검색... (명령어, 메뉴, 파일 등)"
            className="pl-10"
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {query.trim() ? (
          results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result, index) => (
                <Card
                  key={result.id}
                  hover
                  className={`cursor-pointer transition-colors ${
                    index === selectedIndex ? 'ring-2 ring-primary-500' : ''
                  }`}
                  onClick={() => result.action?.()}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(result.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800">{result.title}</span>
                          <Badge variant="outline" size="sm">
                            {getTypeLabel(result.type)}
                          </Badge>
                        </div>
                        {result.description && (
                          <p className="text-sm text-gray-500">{result.description}</p>
                        )}
                        {result.path && (
                          <p className="text-xs text-gray-400 mt-1">{result.path}</p>
                        )}
                      </div>
                      <ArrowRight size={16} className="text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              검색 결과가 없습니다
            </div>
          )
        ) : (
          <div className="text-center py-12 text-gray-400">
            검색어를 입력하세요
          </div>
        )}
      </div>
    </div>
  );
}

