'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Timer,
  Calendar,
  Clock,
  Palette,
  Check,
  RotateCw,
  Eye,
} from 'lucide-react';

type CountdownStyle = 'classic' | 'flip' | 'minimal' | 'neon' | 'gradient';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const countdownStyles = [
  { id: 'classic', name: '클래식', preview: '박스형 숫자' },
  { id: 'flip', name: '플립', preview: '플립 애니메이션' },
  { id: 'minimal', name: '미니멀', preview: '심플한 숫자' },
  { id: 'neon', name: '네온', preview: '네온 글로우' },
  { id: 'gradient', name: '그라디언트', preview: '그라디언트 배경' },
];

export default function CountdownTimer() {
  const [targetDate, setTargetDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [style, setStyle] = useState<CountdownStyle>('classic');
  const [showDays, setShowDays] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [primaryColor, setPrimaryColor] = useState('#8B5CF6');
  const [backgroundColor, setBackgroundColor] = useState('#1F2937');
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [title, setTitle] = useState('할인 종료까지');
  const [expiredMessage, setExpiredMessage] = useState('이벤트가 종료되었습니다');

  // 카운트다운 계산
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - Date.now();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const TimeUnit = ({ value, label }: { value: number; label: string }) => {
    const renderByStyle = () => {
      switch (style) {
        case 'flip':
          return (
            <div className="relative">
              <motion.div
                key={value}
                initial={{ rotateX: -90 }}
                animate={{ rotateX: 0 }}
                className="text-4xl font-bold text-white px-4 py-3 rounded-lg"
                style={{ backgroundColor: primaryColor }}
              >
                {formatNumber(value)}
              </motion.div>
            </div>
          );
        case 'minimal':
          return (
            <div className="text-center">
              <span className="text-5xl font-light" style={{ color: primaryColor }}>
                {formatNumber(value)}
              </span>
            </div>
          );
        case 'neon':
          return (
            <div
              className="text-4xl font-bold px-4 py-3 rounded-lg"
              style={{
                color: primaryColor,
                textShadow: `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}, 0 0 30px ${primaryColor}`,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            >
              {formatNumber(value)}
            </div>
          );
        case 'gradient':
          return (
            <div
              className="text-4xl font-bold text-white px-4 py-3 rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${backgroundColor})`,
              }}
            >
              {formatNumber(value)}
            </div>
          );
        default: // classic
          return (
            <div
              className="text-4xl font-bold text-white px-4 py-3 rounded-lg"
              style={{ backgroundColor: primaryColor }}
            >
              {formatNumber(value)}
            </div>
          );
      }
    };

    return (
      <div className="flex flex-col items-center gap-1">
        {renderByStyle()}
        {showLabels && (
          <span className="text-xs text-gray-500 uppercase">{label}</span>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Timer size={18} />
          카운트다운 타이머
        </h3>
        <p className="text-sm text-gray-500 mt-1">긴박감을 주는 타이머를 추가하세요</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 미리보기 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">미리보기</p>
          <div className="p-6 rounded-xl text-center" style={{ backgroundColor }}>
            <p className="text-white text-sm mb-4">{title}</p>
            <div className="flex justify-center items-center gap-3">
              {showDays && <TimeUnit value={timeLeft.days} label="일" />}
              <span className="text-2xl text-white/50">:</span>
              <TimeUnit value={timeLeft.hours} label="시간" />
              <span className="text-2xl text-white/50">:</span>
              <TimeUnit value={timeLeft.minutes} label="분" />
              <span className="text-2xl text-white/50">:</span>
              <TimeUnit value={timeLeft.seconds} label="초" />
            </div>
          </div>
        </div>

        {/* 목표 날짜/시간 */}
        <div>
          <label className="text-sm text-gray-700 mb-2 block flex items-center gap-2">
            <Calendar size={14} />
            목표 날짜/시간
          </label>
          <input
            type="datetime-local"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>

        {/* 제목 & 만료 메시지 */}
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-700 mb-2 block">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-2 block">만료 메시지</label>
            <input
              type="text"
              value={expiredMessage}
              onChange={(e) => setExpiredMessage(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        </div>

        {/* 스타일 선택 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">스타일</p>
          <div className="grid grid-cols-5 gap-2">
            {countdownStyles.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id as CountdownStyle)}
                className={`p-2 rounded-xl border-2 text-center ${
                  style === s.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-xs text-gray-700">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 색상 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-700 mb-2 block">주요 색상</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-2 block">배경 색상</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* 옵션 */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={showDays}
              onChange={(e) => setShowDays(e.target.checked)}
              className="rounded text-primary-500"
            />
            <span className="text-sm text-gray-700">일(Days) 표시</span>
          </label>
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="rounded text-primary-500"
            />
            <span className="text-sm text-gray-700">라벨 표시</span>
          </label>
        </div>
      </div>

      {/* 적용 버튼 */}
      <div className="p-4 border-t">
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600">
          <Check size={18} />
          타이머 적용
        </button>
      </div>
    </div>
  );
}

