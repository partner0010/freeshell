'use client';

import React, { useState } from 'react';
import { ShoppingBag, Search, Download, Star, Filter, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import { templateMarketplace, type Template } from '@/lib/templates/template-marketplace';
import { useToast } from '@/components/ui/Toast';

export function TemplateMarketplacePanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [templates, setTemplates] = useState<Template[]>([]);
  const { showToast } = useToast();

  React.useEffect(() => {
    loadTemplates();
  }, [searchQuery, selectedCategory]);

  const loadTemplates = () => {
    const results = templateMarketplace.searchTemplates(
      searchQuery,
      selectedCategory === 'all' ? undefined : selectedCategory
    );
    setTemplates(results);
  };

  const categories = templateMarketplace.getCategories();
  const allCategories = [{ id: 'all', name: '전체', icon: '📦', count: templates.length }, ...categories];

  const handleDownload = (template: Template) => {
    templateMarketplace.downloadTemplate(template.id);
    showToast('success', `"${template.name}" 템플릿이 적용되었습니다`);
    // 실제로는 프로젝트에 템플릿 적용 로직
  };

  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'free', label: '무료' },
    { id: 'premium', label: '프리미엄' },
  ];
  const [activeTab, setActiveTab] = useState('all');

  const filteredTemplates = templates.filter((t) => {
    if (activeTab === 'free') return t.price === 'free';
    if (activeTab === 'premium') return t.price === 'premium';
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <ShoppingBag className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">템플릿 마켓플레이스</h2>
            <p className="text-sm text-gray-500">수천 개의 전문 템플릿 탐색</p>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="템플릿 검색..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter size={18} className="mr-2" />
            필터
          </Button>
        </div>

        {/* 카테고리 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary-100 text-primary-700 font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-4">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              검색 결과가 없습니다
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} hover>
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl flex items-center justify-center">
                    <span className="text-4xl">📄</span>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{template.name}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
                      </div>
                      {template.price === 'premium' && (
                        <Badge variant="warning">프리미엄</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600">{template.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{template.downloads} 다운로드</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleDownload(template)}
                        className="flex-1"
                      >
                        <Download size={14} className="mr-1" />
                        사용
                      </Button>
                      <Button variant="outline" size="sm">
                        미리보기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 업로드 버튼 */}
      <div className="p-6 border-t">
        <Button variant="outline" className="w-full">
          <Upload size={18} className="mr-2" />
          템플릿 공유하기
        </Button>
      </div>
    </div>
  );
}

