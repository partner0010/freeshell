/**
 * 활동 로그 및 감사 추적
 * Activity Log & Audit Trail
 */

export type ActivityType = 
  | 'user-login' | 'user-logout' | 'user-create' | 'user-update' | 'user-delete'
  | 'file-create' | 'file-update' | 'file-delete' | 'file-download'
  | 'project-create' | 'project-update' | 'project-delete'
  | 'deployment-start' | 'deployment-complete' | 'deployment-failed'
  | 'setting-change' | 'permission-change'
  | 'api-call' | 'error';

export interface ActivityLog {
  id: string;
  type: ActivityType;
  action: string;
  userId: string;
  userName: string;
  resource?: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

// 활동 로그 시스템
export class ActivityLogSystem {
  private logs: ActivityLog[] = [];

  // 로그 기록
  logActivity(
    type: ActivityType,
    action: string,
    userId: string,
    userName: string,
    options?: {
      resource?: string;
      resourceId?: string;
      ipAddress?: string;
      userAgent?: string;
      metadata?: Record<string, any>;
    }
  ): ActivityLog {
    const log: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      action,
      userId,
      userName,
      resource: options?.resource,
      resourceId: options?.resourceId,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
      metadata: options?.metadata,
      timestamp: new Date(),
    };

    this.logs.push(log);
    // 최근 1000개만 유지
    if (this.logs.length > 1000) {
      this.logs.shift();
    }

    return log;
  }

  // 로그 조회
  getLogs(filters?: {
    type?: ActivityType;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    resource?: string;
  }): ActivityLog[] {
    let results = [...this.logs];

    if (filters?.type) {
      results = results.filter(log => log.type === filters.type);
    }

    if (filters?.userId) {
      results = results.filter(log => log.userId === filters.userId);
    }

    if (filters?.startDate) {
      results = results.filter(log => log.timestamp >= filters.startDate!);
    }

    if (filters?.endDate) {
      results = results.filter(log => log.timestamp <= filters.endDate!);
    }

    if (filters?.resource) {
      results = results.filter(log => log.resource === filters.resource);
    }

    return results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // 통계
  getStats(): {
    totalLogs: number;
    byType: Record<string, number>;
    byUser: Record<string, number>;
    recentActivity: ActivityLog[];
  } {
    const byType: Record<string, number> = {};
    const byUser: Record<string, number> = {};

    this.logs.forEach(log => {
      byType[log.type] = (byType[log.type] || 0) + 1;
      byUser[log.userId] = (byUser[log.userId] || 0) + 1;
    });

    return {
      totalLogs: this.logs.length,
      byType,
      byUser,
      recentActivity: this.logs.slice(-10).reverse(),
    };
  }

  // 로그 내보내기
  exportLogs(format: 'json' | 'csv'): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    }

    // CSV 형식
    const headers = ['ID', 'Type', 'Action', 'User', 'Resource', 'Timestamp'];
    const rows = this.logs.map(log => [
      log.id,
      log.type,
      log.action,
      log.userName,
      log.resource || '',
      log.timestamp.toISOString(),
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

export const activityLogSystem = new ActivityLogSystem();

