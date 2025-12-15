'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MousePointer2,
  Eye,
  Scroll,
  Clock,
  BarChart3,
  Play,
  Pause,
  Download,
  Calendar,
  Filter,
  Maximize2,
  Target,
  Activity,
} from 'lucide-react';

interface ClickData {
  x: number;
  y: number;
  count: number;
  element?: string;
}

interface ScrollData {
  depth: number;
  percentage: number;
  avgTime: number;
}

interface SessionRecording {
  id: string;
  date: string;
  duration: string;
  pages: number;
  device: string;
  country: string;
}

export function HeatmapAnalytics() {
  const [activeView, setActiveView] = useState<'click' | 'scroll' | 'move' | 'recordings'>('click');
  const [dateRange, setDateRange] = useState('7d');
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 시뮬레이션된 클릭 데이터
  const [clickData] = useState<ClickData[]>([
    { x: 50, y: 30, count: 245, element: 'CTA 버튼' },
    { x: 80, y: 15, count: 180, element: '네비게이션 메뉴' },
    { x: 30, y: 60, count: 120, element: '이미지 갤러리' },
    { x: 70, y: 80, count: 95, element: '푸터 링크' },
    { x: 20, y: 45, count: 75, element: '사이드바' },
  ]);
  
  // 스크롤 깊이 데이터
  const [scrollData] = useState<ScrollData[]>([
    { depth: 25, percentage: 98, avgTime: 5 },
    { depth: 50, percentage: 75, avgTime: 12 },
    { depth: 75, percentage: 45, avgTime: 25 },
    { depth: 100, percentage: 20, avgTime: 45 },
  ]);
  
  // 세션 녹화
  const [recordings] = useState<SessionRecording[]>([
    { id: '1', date: '2024-12-05 14:30', duration: '3:45', pages: 5, device: 'Desktop', country: 'KR' },
    { id: '2', date: '2024-12-05 13:15', duration: '2:12', pages: 3, device: 'Mobile', country: 'US' },
    { id: '3', date: '2024-12-05 11:00', duration: '5:30', pages: 8, device: 'Tablet', country: 'JP' },
  ]);
  
  // 통계
  const stats = {
    totalClicks: 1250,
    avgScrollDepth: 62,
    avgSessionTime: '2:34',
    bounceRate: 35,
  };

  // 히트맵 렌더링
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 캔버스 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 배경
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 간단한 페이지 레이아웃 그리기
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // 헤더
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(10, 10, canvas.width - 20, 30);
    
    // 히트 포인트 그리기
    if (activeView === 'click') {
      clickData.forEach((point) => {
        const x = (point.x / 100) * (canvas.width - 20) + 10;
        const y = (point.y / 100) * (canvas.height - 20) + 10;
        const radius = Math.min(30, Math.max(10, point.count / 10));
        
        // 그라디언트 원
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const intensity = Math.min(1, point.count / 200);
        gradient.addColorStop(0, `rgba(255, 0, 0, ${intensity})`);
        gradient.addColorStop(0.5, `rgba(255, 165, 0, ${intensity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (activeView === 'scroll') {
      // 스크롤 깊이 시각화
      scrollData.forEach((data, index) => {
        const y = (data.depth / 100) * (canvas.height - 20) + 10;
        const width = (data.percentage / 100) * (canvas.width - 20);
        
        ctx.fillStyle = `rgba(59, 130, 246, ${data.percentage / 100})`;
        ctx.fillRect(10, y - 5, width, 10);
        
        ctx.fillStyle = '#333';
        ctx.font = '10px sans-serif';
        ctx.fillText(`${data.percentage}%`, width + 15, y + 3);
      });
    }
  }, [activeView, clickData, scrollData]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary-500" />
          히트맵 분석
        </h3>
        
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="text-xs border rounded-lg px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="1d">오늘</option>
          <option value="7d">7일</option>
          <option value="30d">30일</option>
          <option value="90d">90일</option>
        </select>
      </div>
      
      {/* 통계 요약 */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: '총 클릭', value: stats.totalClicks.toLocaleString(), icon: MousePointer2, color: 'text-blue-500' },
          { label: '평균 스크롤', value: stats.avgScrollDepth + '%', icon: Scroll, color: 'text-green-500' },
          { label: '평균 체류', value: stats.avgSessionTime, icon: Clock, color: 'text-purple-500' },
          { label: '이탈률', value: stats.bounceRate + '%', icon: Target, color: 'text-red-500' },
        ].map((stat, index) => (
          <div
            key={index}
            className="p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center gap-1">
              <stat.icon className={`w-3 h-3 ${stat.color}`} />
              <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
            <p className="font-bold text-gray-800 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>
      
      {/* 뷰 선택 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {[
          { id: 'click', label: '클릭맵', icon: MousePointer2 },
          { id: 'scroll', label: '스크롤', icon: Scroll },
          { id: 'move', label: '마우스', icon: Target },
          { id: 'recordings', label: '녹화', icon: Eye },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id as typeof activeView)}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs transition-colors ${
              activeView === view.id
                ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
            }`}
          >
            <view.icon className="w-3.5 h-3.5" />
            {view.label}
          </button>
        ))}
      </div>
      
      {/* 히트맵 캔버스 */}
      {activeView !== 'recordings' && (
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={300}
            height={200}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600"
          />
          
          <button className="absolute top-2 right-2 p-1 bg-white/80 dark:bg-gray-800/80 rounded hover:bg-white dark:hover:bg-gray-800">
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}
      
      {/* 클릭 상세 */}
      {activeView === 'click' && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">인기 클릭 영역</h4>
          {clickData.slice(0, 5).map((click, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{click.element}</span>
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">{click.count}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* 스크롤 상세 */}
      {activeView === 'scroll' && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">스크롤 깊이</h4>
          {scrollData.map((data, index) => (
            <div
              key={index}
              className="p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{data.depth}% 지점</span>
                <span className="text-xs font-semibold text-gray-800 dark:text-white">{data.percentage}% 도달</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-full transition-all"
                  style={{ width: `${data.percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">평균 체류: {data.avgTime}초</p>
            </div>
          ))}
        </div>
      )}
      
      {/* 세션 녹화 */}
      {activeView === 'recordings' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">최근 녹화</h4>
            <span className="text-xs text-gray-500">{recordings.length}개</span>
          </div>
          
          {recordings.map((recording) => (
            <motion.div
              key={recording.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{recording.date}</p>
                    <p className="text-xs text-gray-500">{recording.duration} • {recording.pages}페이지</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded">
                    {recording.device}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{recording.country}</p>
                </div>
              </div>
            </motion.div>
          ))}
          
          <p className="text-xs text-center text-gray-500">
            💡 녹화를 보려면 재생 버튼을 클릭하세요
          </p>
        </div>
      )}
      
      {/* 내보내기 */}
      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <Download className="w-4 h-4" />
        <span className="text-sm">리포트 내보내기</span>
      </button>
    </div>
  );
}

export default HeatmapAnalytics;

