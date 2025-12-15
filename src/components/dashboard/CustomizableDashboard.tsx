'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout, Plus, X, GripVertical } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface DashboardWidget {
  id: string;
  type: 'stats' | 'chart' | 'list' | 'activity';
  title: string;
  position: { x: number; y: number; w: number; h: number };
}

export function CustomizableDashboard() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // 저장된 위젯 불러오기
    const saved = localStorage.getItem('dashboard-widgets');
    if (saved) {
      setWidgets(JSON.parse(saved));
    } else {
      // 기본 위젯
      setWidgets([
        {
          id: 'stats-1',
          type: 'stats',
          title: '통계',
          position: { x: 0, y: 0, w: 3, h: 2 },
        },
      ]);
    }
  }, []);

  const saveLayout = () => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
  };

  const addWidget = (type: DashboardWidget['type']) => {
    const newWidget: DashboardWidget = {
      id: `${type}-${Date.now()}`,
      type,
      title: type,
      position: { x: 0, y: widgets.length * 2, w: 3, h: 2 },
    };
    setWidgets([...widgets, newWidget]);
    saveLayout();
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((w) => w.id !== id));
    saveLayout();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Layout className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">맞춤형 대시보드</h2>
              <p className="text-sm text-gray-500">원하는 위젯을 배치하세요</p>
            </div>
          </div>
          <Button
            variant={isEditing ? 'primary' : 'outline'}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? '편집 완료' : '편집 모드'}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* 위젯 그리드 */}
        <div className="grid grid-cols-12 gap-4">
          {widgets.map((widget) => (
            <motion.div
              key={widget.id}
              layout
              className={`col-span-${widget.position.w} relative ${
                isEditing ? 'cursor-move' : ''
              }`}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{widget.title}</CardTitle>
                    {isEditing && (
                      <div className="flex items-center gap-2">
                        <GripVertical className="text-gray-400 cursor-move" size={18} />
                        <button
                          onClick={() => removeWidget(widget.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    {widget.type} 위젯
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 위젯 추가 버튼 */}
        {isEditing && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">위젯 추가</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['stats', 'chart', 'list', 'activity'].map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  onClick={() => addWidget(type as DashboardWidget['type'])}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <Plus size={20} />
                  {type}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

