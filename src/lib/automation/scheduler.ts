/**
 * 자동 점검 스케줄러 시스템
 * 관리자가 원하는 시간에 자동 점검 실행
 */

export interface ScheduleConfig {
  id: string;
  name: string;
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  interval?: number; // hourly일 때 몇 시간마다
  time?: string; // HH:mm 형식
  dayOfWeek?: number; // 0-6 (일-토), weekly일 때
  dayOfMonth?: number; // 1-31, monthly일 때
  startDate: {
    year: number;
    month: number; // 1-12
    day: number; // 1-31
  };
  createdAt: Date;
  updatedAt: Date;
}

export class ScheduleManager {
  private schedules: Map<string, NodeJS.Timeout> = new Map();
  private configs: ScheduleConfig[] = [];

  /**
   * 스케줄 생성
   */
  createSchedule(config: Omit<ScheduleConfig, 'id' | 'createdAt' | 'updatedAt'>): ScheduleConfig {
    const schedule: ScheduleConfig = {
      ...config,
      id: `schedule-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.configs.push(schedule);
    
    if (schedule.enabled) {
      this.startSchedule(schedule);
    }

    return schedule;
  }

  /**
   * 스케줄 업데이트
   */
  updateSchedule(id: string, updates: Partial<ScheduleConfig>): ScheduleConfig | null {
    const index = this.configs.findIndex(s => s.id === id);
    if (index === -1) return null;

    const schedule = { ...this.configs[index], ...updates, updatedAt: new Date() };
    this.configs[index] = schedule;

    // 기존 타이머 제거
    if (this.schedules.has(id)) {
      clearInterval(this.schedules.get(id)!);
      this.schedules.delete(id);
    }

    // 새로 시작
    if (schedule.enabled) {
      this.startSchedule(schedule);
    }

    return schedule;
  }

  /**
   * 스케줄 삭제
   */
  deleteSchedule(id: string): boolean {
    const index = this.configs.findIndex(s => s.id === id);
    if (index === -1) return false;

    // 타이머 제거
    if (this.schedules.has(id)) {
      clearInterval(this.schedules.get(id)!);
      this.schedules.delete(id);
    }

    this.configs.splice(index, 1);
    return true;
  }

  /**
   * 스케줄 시작
   */
  private startSchedule(config: ScheduleConfig): void {
    const nextRun = this.calculateNextRun(config);
    if (!nextRun) return;

    const msUntilNext = nextRun.getTime() - Date.now();
    if (msUntilNext < 0) return; // 이미 지난 시간

    const timeout = setTimeout(() => {
      this.executeSchedule(config);
      this.scheduleNextRun(config);
    }, msUntilNext);

    this.schedules.set(config.id, timeout as any);
  }

  /**
   * 다음 실행 시간 계산
   */
  private calculateNextRun(config: ScheduleConfig): Date | null {
    const now = new Date();
    const startDate = new Date(
      config.startDate.year,
      config.startDate.month - 1,
      config.startDate.day
    );

    // 시작일이 미래면 시작일로 설정
    if (startDate > now) {
      if (config.time) {
        const [hours, minutes] = config.time.split(':').map(Number);
        startDate.setHours(hours, minutes, 0, 0);
      }
      return startDate;
    }

    switch (config.frequency) {
      case 'hourly':
        if (!config.interval) return null;
        const nextHour = new Date(now);
        nextHour.setHours(nextHour.getHours() + config.interval);
        nextHour.setMinutes(0, 0, 0);
        return nextHour;

      case 'daily':
        if (!config.time) return null;
        const [hours, minutes] = config.time.split(':').map(Number);
        const nextDay = new Date(now);
        nextDay.setHours(hours, minutes, 0, 0);
        if (nextDay <= now) {
          nextDay.setDate(nextDay.getDate() + 1);
        }
        return nextDay;

      case 'weekly':
        if (!config.time || config.dayOfWeek === undefined) return null;
        const [wHours, wMinutes] = config.time.split(':').map(Number);
        const nextWeek = new Date(now);
        const currentDay = nextWeek.getDay();
        let daysUntilNext = (config.dayOfWeek - currentDay + 7) % 7;
        if (daysUntilNext === 0 && nextWeek.getHours() * 60 + nextWeek.getMinutes() >= wHours * 60 + wMinutes) {
          daysUntilNext = 7;
        }
        nextWeek.setDate(nextWeek.getDate() + daysUntilNext);
        nextWeek.setHours(wHours, wMinutes, 0, 0);
        return nextWeek;

      case 'monthly':
        if (!config.time || !config.dayOfMonth) return null;
        const [mHours, mMinutes] = config.time.split(':').map(Number);
        const nextMonth = new Date(now);
        nextMonth.setDate(config.dayOfMonth);
        nextMonth.setHours(mHours, mMinutes, 0, 0);
        if (nextMonth <= now) {
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          nextMonth.setDate(config.dayOfMonth);
        }
        return nextMonth;

      default:
        return null;
    }
  }

  /**
   * 다음 실행 스케줄링
   */
  private scheduleNextRun(config: ScheduleConfig): void {
    if (!config.enabled) return;

    const nextRun = this.calculateNextRun(config);
    if (!nextRun) return;

    const msUntilNext = nextRun.getTime() - Date.now();
    if (msUntilNext < 0) {
      // 이미 지난 시간이면 즉시 실행
      this.executeSchedule(config);
      this.scheduleNextRun(config);
      return;
    }

    const timeout = setTimeout(() => {
      this.executeSchedule(config);
      this.scheduleNextRun(config);
    }, msUntilNext);

    this.schedules.set(config.id, timeout as any);
  }

  /**
   * 스케줄 실행
   */
  private async executeSchedule(config: ScheduleConfig): Promise<void> {
    try {
      // 실제로는 self-healing 시스템 호출
      const { selfHealingSystem } = await import('./self-healing');
      await selfHealingSystem.runDailyCheck();
      console.log(`스케줄 실행 완료: ${config.name} (${config.id})`);
    } catch (error) {
      console.error(`스케줄 실행 실패: ${config.name}`, error);
    }
  }

  /**
   * 모든 스케줄 조회
   */
  getAllSchedules(): ScheduleConfig[] {
    return [...this.configs];
  }

  /**
   * 스케줄 조회
   */
  getSchedule(id: string): ScheduleConfig | null {
    return this.configs.find(s => s.id === id) || null;
  }

  /**
   * 스케줄 활성화/비활성화
   */
  toggleSchedule(id: string, enabled: boolean): ScheduleConfig | null {
    return this.updateSchedule(id, { enabled });
  }
}

export const scheduleManager = new ScheduleManager();
