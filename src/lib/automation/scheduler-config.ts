/**
 * 스케줄러 설정 관리
 */

import { ScheduleConfig } from './scheduler';

// 전역 스케줄러 설정 저장소 (실제로는 DB 사용)
const schedules: Map<string, ScheduleConfig> = new Map();

export class SchedulerConfigManager {
  /**
   * 스케줄 저장
   */
  saveSchedule(schedule: ScheduleConfig): void {
    schedules.set(schedule.id, schedule);
  }

  /**
   * 스케줄 조회
   */
  getSchedule(id: string): ScheduleConfig | undefined {
    return schedules.get(id);
  }

  /**
   * 모든 스케줄 조회
   */
  getAllSchedules(): ScheduleConfig[] {
    return Array.from(schedules.values());
  }

  /**
   * 스케줄 삭제
   */
  deleteSchedule(id: string): boolean {
    return schedules.delete(id);
  }
}

export const schedulerConfigManager = new SchedulerConfigManager();
