/**
 * 작업 스케줄러
 * Task Scheduler
 */

export type ScheduleType = 'once' | 'daily' | 'weekly' | 'monthly' | 'cron';

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface ScheduledTask {
  id: string;
  name: string;
  description?: string;
  scheduleType: ScheduleType;
  schedule: string; // cron expression or date/time
  action: string; // action to execute
  status: TaskStatus;
  lastRun?: Date;
  nextRun?: Date;
  runCount: number;
  errorCount: number;
  enabled: boolean;
  createdAt: Date;
}

// 작업 스케줄러
export class TaskScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();

  // 작업 생성
  createTask(
    name: string,
    scheduleType: ScheduleType,
    schedule: string,
    action: string,
    description?: string
  ): ScheduledTask {
    const task: ScheduledTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      scheduleType,
      schedule,
      action,
      status: 'pending',
      runCount: 0,
      errorCount: 0,
      enabled: true,
      createdAt: new Date(),
    };

    task.nextRun = this.calculateNextRun(task);
    this.tasks.set(task.id, task);
    return task;
  }

  // 다음 실행 시간 계산
  private calculateNextRun(task: ScheduledTask): Date {
    const now = new Date();
    const next = new Date(now);

    switch (task.scheduleType) {
      case 'once':
        next.setTime(new Date(task.schedule).getTime());
        break;
      case 'daily':
        next.setDate(next.getDate() + 1);
        next.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'cron':
        // 간단한 cron 파싱 (실제로는 더 복잡한 파서 필요)
        next.setMinutes(next.getMinutes() + 5); // 예시
        break;
    }

    return next;
  }

  // 작업 실행 (시뮬레이션)
  async executeTask(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task || !task.enabled) return;

    task.status = 'running';
    task.lastRun = new Date();

    try {
      // 실제 작업 실행 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      task.status = 'completed';
      task.runCount++;
      task.nextRun = this.calculateNextRun(task);
    } catch (error) {
      task.status = 'failed';
      task.errorCount++;
    }
  }

  // 작업 가져오기
  getTask(id: string): ScheduledTask | undefined {
    return this.tasks.get(id);
  }

  // 모든 작업 가져오기
  getAllTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values());
  }

  // 작업 활성화/비활성화
  toggleTask(id: string): void {
    const task = this.tasks.get(id);
    if (task) {
      task.enabled = !task.enabled;
    }
  }
}

export const taskScheduler = new TaskScheduler();

