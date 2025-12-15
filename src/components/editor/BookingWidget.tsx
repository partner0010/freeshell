'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Settings,
  Plus,
  Trash2,
} from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export function BookingWidget() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'bookings' | 'services' | 'settings'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      name: '김철수',
      email: 'kim@example.com',
      phone: '010-1234-5678',
      date: '2024-12-06',
      time: '14:00',
      service: '1시간 상담',
      status: 'confirmed',
    },
    {
      id: '2',
      name: '이영희',
      email: 'lee@example.com',
      phone: '010-2345-6789',
      date: '2024-12-07',
      time: '10:00',
      service: '30분 미팅',
      status: 'pending',
    },
  ]);
  
  const [services, setServices] = useState<Service[]>([
    { id: '1', name: '30분 미팅', duration: 30, price: 0 },
    { id: '2', name: '1시간 상담', duration: 60, price: 50000 },
    { id: '3', name: '2시간 워크샵', duration: 120, price: 150000 },
  ]);
  
  const [timeSlots] = useState<TimeSlot[]>([
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:00', available: false },
    { time: '12:00', available: false },
    { time: '13:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: false },
    { time: '17:00', available: true },
  ]);
  
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    notes: '',
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (number | null)[] = [];
    
    // 이전 달 빈 칸
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // 이번 달 날짜
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const selectDay = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    setSelectedTime(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          예약 시스템
        </h3>
      </div>
      
      {/* 탭 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {[
          { id: 'calendar', label: '캘린더', icon: Calendar },
          { id: 'bookings', label: '예약', icon: Clock },
          { id: 'services', label: '서비스', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* 캘린더 */}
      {activeTab === 'calendar' && (
        <div className="space-y-3">
          {/* 월 네비게이션 */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="font-medium text-gray-800 dark:text-white">
              {formatDate(currentMonth)}
            </span>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* 요일 */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div key={day} className="text-xs text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* 날짜 */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((day, index) => (
              <button
                key={index}
                onClick={() => day && selectDay(day)}
                disabled={!day}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded-lg transition-colors
                  ${!day ? 'invisible' : ''}
                  ${isSelected(day!) ? 'bg-primary-500 text-white' : ''}
                  ${isToday(day!) && !isSelected(day!) ? 'bg-primary-100 text-primary-600' : ''}
                  ${!isSelected(day!) && !isToday(day!) ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' : ''}
                `}
              >
                {day}
              </button>
            ))}
          </div>
          
          {/* 시간 선택 */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`
                    px-3 py-2 text-sm rounded-lg transition-colors
                    ${selectedTime === slot.time ? 'bg-primary-500 text-white' : ''}
                    ${!slot.available ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed line-through' : ''}
                    ${slot.available && selectedTime !== slot.time ? 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-primary-300' : ''}
                  `}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
          
          {/* 예약 폼 */}
          {selectedTime && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-600"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">이름 *</label>
                  <input
                    type="text"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">전화번호 *</label>
                  <input
                    type="tel"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 mb-1 block">이메일 *</label>
                <input
                  type="email"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-500 mb-1 block">서비스 *</label>
                <select
                  value={bookingForm.service}
                  onChange={(e) => setBookingForm({ ...bookingForm, service: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">선택</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} ({service.duration}분) - {service.price.toLocaleString()}원
                    </option>
                  ))}
                </select>
              </div>
              
              <button className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                예약하기
              </button>
            </motion.div>
          )}
        </div>
      )}
      
      {/* 예약 목록 */}
      {activeTab === 'bookings' && (
        <div className="space-y-2">
          {bookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 dark:text-white text-sm">{booking.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                      {booking.status === 'confirmed' ? '확정' : booking.status === 'pending' ? '대기' : '취소'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {booking.date} {booking.time} • {booking.service}
                  </p>
                  <p className="text-xs text-gray-500">{booking.email}</p>
                </div>
                
                <div className="flex gap-1">
                  {booking.status === 'pending' && (
                    <>
                      <button className="p-1.5 hover:bg-green-50 dark:hover:bg-green-900/20 rounded text-green-500">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* 서비스 */}
      {activeTab === 'services' && (
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-600 dark:text-gray-400">
            <Plus className="w-4 h-4" />
            서비스 추가
          </button>
          
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white text-sm">{service.name}</h4>
                <p className="text-xs text-gray-500">
                  {service.duration}분 • {service.price.toLocaleString()}원
                </p>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                  <Settings className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingWidget;

