/**
 * 자동 점검 스케줄 설정 페이지
 */

'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, Repeat, Play, Pause, Trash2, Plus } from 'lucide-react';

interface ScheduleConfig {
  id: string;
  name: string;
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  interval?: number;
  time?: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
}

export default function HealthSchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleConfig[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleConfig | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const response = await fetch('/api/admin/health/schedule');
      if (response.ok) {
        const data = await response.json();
        setSchedules(data.schedules || []);
      }
    } catch (error) {
      console.error('스케줄 로드 실패:', error);
    }
  };

  const handleCreate = async (schedule: Omit<ScheduleConfig, 'id'>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/health/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule),
      });

      if (response.ok) {
        loadSchedules();
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('스케줄 생성 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/health/schedule/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });

      if (response.ok) {
        loadSchedules();
      }
    } catch (error) {
      console.error('스케줄 토글 실패:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/health/schedule/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadSchedules();
      }
    } catch (error) {
      console.error('스케줄 삭제 실패:', error);
    }
  };

  const getFrequencyLabel = (freq: string, config: ScheduleConfig) => {
    switch (freq) {
      case 'hourly':
        return `매 ${config.interval}시간마다`;
      case 'daily':
        return `매일 ${config.time}`;
      case 'weekly':
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return `매주 ${days[config.dayOfWeek || 0]}요일 ${config.time}`;
      case 'monthly':
        return `매월 ${config.dayOfMonth}일 ${config.time}`;
      default:
        return freq;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">자동 점검 스케줄</h1>
          <p className="text-gray-600 mt-1">원하는 시간에 자동 점검을 실행하세요</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} />
          새 스케줄
        </button>
      </div>

      {/* 스케줄 목록 */}
      <div className="space-y-4">
        {schedules.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">등록된 스케줄이 없습니다.</p>
            <p className="text-sm text-gray-500 mt-2">새 스케줄을 만들어 자동 점검을 시작하세요.</p>
          </div>
        ) : (
          schedules.map((schedule) => (
            <div key={schedule.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{schedule.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      schedule.enabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {schedule.enabled ? '활성' : '비활성'}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Repeat size={16} />
                      <span>{getFrequencyLabel(schedule.frequency, schedule)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>
                        시작일: {schedule.startDate.year}년 {schedule.startDate.month}월 {schedule.startDate.day}일
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(schedule.id, !schedule.enabled)}
                    className={`p-2 rounded-lg ${
                      schedule.enabled 
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {schedule.enabled ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button
                    onClick={() => setEditingSchedule(schedule)}
                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 생성/수정 모달 */}
      {(showCreateModal || editingSchedule) && (
        <ScheduleModal
          schedule={editingSchedule}
          onClose={() => {
            setShowCreateModal(false);
            setEditingSchedule(null);
          }}
          onSave={handleCreate}
          loading={loading}
        />
      )}
    </div>
  );
}

function ScheduleModal({
  schedule,
  onClose,
  onSave,
  loading,
}: {
  schedule: ScheduleConfig | null;
  onClose: () => void;
  onSave: (schedule: Omit<ScheduleConfig, 'id'>) => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState<Omit<ScheduleConfig, 'id'>>({
    name: schedule?.name || '',
    enabled: schedule?.enabled ?? true,
    frequency: schedule?.frequency || 'daily',
    interval: schedule?.interval || 1,
    time: schedule?.time || '00:00',
    dayOfWeek: schedule?.dayOfWeek || 0,
    dayOfMonth: schedule?.dayOfMonth || 1,
    startDate: schedule?.startDate || {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {schedule ? '스케줄 수정' : '새 스케줄 생성'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">빈도</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="hourly">매 N시간마다</option>
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="monthly">매월</option>
            </select>
          </div>

          {formData.frequency === 'hourly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">간격 (시간)</label>
              <input
                type="number"
                min="1"
                value={formData.interval}
                onChange={(e) => setFormData({ ...formData, interval: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          )}

          {(formData.frequency === 'daily' || formData.frequency === 'weekly' || formData.frequency === 'monthly') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          )}

          {formData.frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">요일</label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="0">일요일</option>
                <option value="1">월요일</option>
                <option value="2">화요일</option>
                <option value="3">수요일</option>
                <option value="4">목요일</option>
                <option value="5">금요일</option>
                <option value="6">토요일</option>
              </select>
            </div>
          )}

          {formData.frequency === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">일 (1-31)</label>
              <input
                type="number"
                min="1"
                max="31"
                value={formData.dayOfMonth}
                onChange={(e) => setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                min="2020"
                max="2100"
                value={formData.startDate.year}
                onChange={(e) => setFormData({
                  ...formData,
                  startDate: { ...formData.startDate, year: parseInt(e.target.value) }
                })}
                className="px-3 py-2 border rounded-lg"
                placeholder="년도"
                required
              />
              <input
                type="number"
                min="1"
                max="12"
                value={formData.startDate.month}
                onChange={(e) => setFormData({
                  ...formData,
                  startDate: { ...formData.startDate, month: parseInt(e.target.value) }
                })}
                className="px-3 py-2 border rounded-lg"
                placeholder="월"
                required
              />
              <input
                type="number"
                min="1"
                max="31"
                value={formData.startDate.day}
                onChange={(e) => setFormData({
                  ...formData,
                  startDate: { ...formData.startDate, day: parseInt(e.target.value) }
                })}
                className="px-3 py-2 border rounded-lg"
                placeholder="일"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="enabled" className="text-sm text-gray-700">활성화</label>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '저장 중...' : '저장'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
