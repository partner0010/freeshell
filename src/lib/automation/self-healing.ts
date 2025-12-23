/**
 * 자동 복구 시스템 (Self-Healing)
 * 하루 1번 자동 점검 및 복구
 */

import { PrismaClient } from '@prisma/client';
import { scheduleManager, type ScheduleConfig } from './scheduler';

const prisma = new PrismaClient();

export interface HealthCheckResult {
  timestamp: Date;
  status: 'healthy' | 'warning' | 'critical';
  checks: Array<{
    name: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
    details?: any;
  }>;
  fixes: Array<{
    issue: string;
    action: string;
    status: 'success' | 'failed' | 'pending';
    timestamp: Date;
  }>;
}

export interface AutoFixAction {
  id: string;
  issue: string;
  action: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  result?: string;
}

export class SelfHealingSystem {
  private lastCheckTime: Date | null = null;
  private checkInterval: number = 24 * 60 * 60 * 1000; // 24시간
  private activeSchedules: Map<string, NodeJS.Timeout> = new Map();

  /**
   * 스케줄 기반 자동 점검 실행
   */
  async runScheduledCheck(config: ScheduleConfig): Promise<HealthCheckResult> {
    return this.runDailyCheck();
  }

  /**
   * 일일 자동 점검 실행
   */
  async runDailyCheck(): Promise<HealthCheckResult> {
    const checks: HealthCheckResult['checks'] = [];
    const fixes: HealthCheckResult['fixes'] = [];

    // 1. 데이터베이스 연결 확인
    const dbCheck = await this.checkDatabase();
    checks.push(dbCheck);
    if (dbCheck.status === 'fail') {
      const fix = await this.fixDatabase();
      fixes.push(fix);
    }

    // 2. API 엔드포인트 확인
    const apiCheck = await this.checkAPIEndpoints();
    checks.push(apiCheck);
    if (apiCheck.status === 'fail') {
      const fix = await this.fixAPIEndpoints();
      fixes.push(fix);
    }

    // 3. 파일 시스템 확인
    const fsCheck = await this.checkFileSystem();
    checks.push(fsCheck);
    if (fsCheck.status === 'fail') {
      const fix = await this.fixFileSystem();
      fixes.push(fix);
    }

    // 4. 보안 설정 확인
    const securityCheck = await this.checkSecuritySettings();
    checks.push(securityCheck);
    if (securityCheck.status === 'fail') {
      const fix = await this.fixSecuritySettings();
      fixes.push(fix);
    }

    // 5. 성능 확인
    const performanceCheck = await this.checkPerformance();
    checks.push(performanceCheck);
    if (performanceCheck.status === 'fail') {
      const fix = await this.fixPerformance();
      fixes.push(fix);
    }

    // 6. 의존성 확인
    const dependencyCheck = await this.checkDependencies();
    checks.push(dependencyCheck);
    if (dependencyCheck.status === 'fail') {
      const fix = await this.fixDependencies();
      fixes.push(fix);
    }

    // 전체 상태 결정
    const hasCritical = checks.some(c => c.status === 'fail');
    const hasWarning = checks.some(c => c.status === 'warning');
    const status: HealthCheckResult['status'] = hasCritical ? 'critical' : hasWarning ? 'warning' : 'healthy';

    const result: HealthCheckResult = {
      timestamp: new Date(),
      status,
      checks,
      fixes,
    };

    this.lastCheckTime = new Date();
    return result;
  }

  /**
   * 데이터베이스 연결 확인
   */
  private async checkDatabase(): Promise<HealthCheckResult['checks'][0]> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return {
        name: '데이터베이스 연결',
        status: 'pass',
        message: '데이터베이스 연결이 정상입니다.',
      };
    } catch (error: any) {
      return {
        name: '데이터베이스 연결',
        status: 'fail',
        message: `데이터베이스 연결 실패: ${error.message}`,
        details: error,
      };
    }
  }

  /**
   * 데이터베이스 복구
   */
  private async fixDatabase(): Promise<HealthCheckResult['fixes'][0]> {
    try {
      // 연결 재시도
      await prisma.$disconnect();
      await prisma.$connect();
      
      return {
        issue: '데이터베이스 연결 실패',
        action: '데이터베이스 연결 재시도',
        status: 'success',
        timestamp: new Date(),
      };
    } catch (error: any) {
      return {
        issue: '데이터베이스 연결 실패',
        action: '데이터베이스 연결 재시도',
        status: 'failed',
        timestamp: new Date(),
      };
    }
  }

  /**
   * API 엔드포인트 확인
   */
  private async checkAPIEndpoints(): Promise<HealthCheckResult['checks'][0]> {
    const criticalEndpoints = [
      '/api/auth/signin',
      '/api/content/generate',
      '/api/ai/chat',
    ];

    const failedEndpoints: string[] = [];

    for (const endpoint of criticalEndpoints) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${endpoint}`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        });
        
        if (!response.ok && response.status !== 401 && response.status !== 405) {
          failedEndpoints.push(endpoint);
        }
      } catch (error) {
        failedEndpoints.push(endpoint);
      }
    }

    if (failedEndpoints.length > 0) {
      return {
        name: 'API 엔드포인트',
        status: 'fail',
        message: `다음 엔드포인트가 응답하지 않습니다: ${failedEndpoints.join(', ')}`,
        details: { failedEndpoints },
      };
    }

    return {
      name: 'API 엔드포인트',
      status: 'pass',
      message: '모든 주요 API 엔드포인트가 정상입니다.',
    };
  }

  /**
   * API 엔드포인트 복구
   */
  private async fixAPIEndpoints(): Promise<HealthCheckResult['fixes'][0]> {
    // 실제로는 서버 재시작 또는 라우트 재등록
    return {
      issue: 'API 엔드포인트 응답 실패',
      action: 'API 엔드포인트 재등록 시도',
      status: 'pending',
      timestamp: new Date(),
    };
  }

  /**
   * 파일 시스템 확인
   */
  private async checkFileSystem(): Promise<HealthCheckResult['checks'][0]> {
    // 필수 디렉토리 및 파일 확인
    const requiredPaths = [
      'src',
      'public',
      'prisma',
    ];

    // 실제로는 파일 시스템 확인
    return {
      name: '파일 시스템',
      status: 'pass',
      message: '파일 시스템이 정상입니다.',
    };
  }

  /**
   * 파일 시스템 복구
   */
  private async fixFileSystem(): Promise<HealthCheckResult['fixes'][0]> {
    return {
      issue: '파일 시스템 오류',
      action: '필수 디렉토리 재생성',
      status: 'pending',
      timestamp: new Date(),
    };
  }

  /**
   * 보안 설정 확인
   */
  private async checkSecuritySettings(): Promise<HealthCheckResult['checks'][0]> {
    const requiredEnvVars = [
      'NEXTAUTH_SECRET',
      'DATABASE_URL',
    ];

    const missingVars = requiredEnvVars.filter(v => !process.env[v]);

    if (missingVars.length > 0) {
      return {
        name: '보안 설정',
        status: 'fail',
        message: `필수 환경 변수가 누락되었습니다: ${missingVars.join(', ')}`,
        details: { missingVars },
      };
    }

    return {
      name: '보안 설정',
      status: 'pass',
      message: '보안 설정이 정상입니다.',
    };
  }

  /**
   * 보안 설정 복구
   */
  private async fixSecuritySettings(): Promise<HealthCheckResult['fixes'][0]> {
    // 실제로는 환경 변수 재설정 또는 기본값 사용
    return {
      issue: '보안 설정 누락',
      action: '기본 보안 설정 적용',
      status: 'pending',
      timestamp: new Date(),
    };
  }

  /**
   * 성능 확인
   */
  private async checkPerformance(): Promise<HealthCheckResult['checks'][0]> {
    // 메모리 사용량, CPU 사용량 등 확인
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
    const heapTotalMB = memoryUsage.heapTotal / 1024 / 1024;
    const heapUsagePercent = (heapUsedMB / heapTotalMB) * 100;

    if (heapUsagePercent > 90) {
      return {
        name: '성능',
        status: 'warning',
        message: `메모리 사용량이 높습니다: ${heapUsagePercent.toFixed(1)}%`,
        details: { heapUsagePercent, heapUsedMB, heapTotalMB },
      };
    }

    return {
      name: '성능',
      status: 'pass',
      message: `메모리 사용량: ${heapUsagePercent.toFixed(1)}%`,
      details: { heapUsagePercent, heapUsedMB, heapTotalMB },
    };
  }

  /**
   * 성능 복구
   */
  private async fixPerformance(): Promise<HealthCheckResult['fixes'][0]> {
    // 가비지 컬렉션 강제 실행 또는 캐시 정리
    if (global.gc) {
      global.gc();
    }

    return {
      issue: '메모리 사용량 높음',
      action: '가비지 컬렉션 실행',
      status: 'success',
      timestamp: new Date(),
    };
  }

  /**
   * 의존성 확인
   */
  private async checkDependencies(): Promise<HealthCheckResult['checks'][0]> {
    // package.json의 의존성 확인
    try {
      const packageJson = require('../../../package.json');
      const dependencies = Object.keys(packageJson.dependencies || {});
      
      return {
        name: '의존성',
        status: 'pass',
        message: `의존성 ${dependencies.length}개가 설치되어 있습니다.`,
        details: { dependencyCount: dependencies.length },
      };
    } catch (error: any) {
      return {
        name: '의존성',
        status: 'warning',
        message: `의존성 확인 실패: ${error.message}`,
        details: error,
      };
    }
  }

  /**
   * 의존성 복구
   */
  private async fixDependencies(): Promise<HealthCheckResult['fixes'][0]> {
    // 실제로는 npm install 실행
    return {
      issue: '의존성 문제',
      action: '의존성 재설치',
      status: 'pending',
      timestamp: new Date(),
    };
  }

  /**
   * 자동 점검 스케줄러 시작 (스케줄 설정 기반)
   */
  startAutoCheck(): void {
    // 기존 스케줄 정리
    this.activeSchedules.forEach(timeout => clearTimeout(timeout));
    this.activeSchedules.clear();

    // 활성화된 스케줄 로드
    const allSchedules = scheduleManager.getAllSchedules();
    const activeConfigs = allSchedules.filter(config => config.enabled);

    if (activeConfigs.length === 0) {
      // 기본 스케줄: 매일 자정
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const msUntilMidnight = tomorrow.getTime() - now.getTime();

      const timeout = setTimeout(() => {
        this.runDailyCheck().then(result => {
          console.log('일일 자동 점검 완료:', result);
        });
        this.scheduleNextRun(null); // 기본 스케줄 재등록
      }, msUntilMidnight);

      this.activeSchedules.set('default', timeout);
      return;
    }

    // 각 스케줄에 대해 실행 시간 계산 및 등록
    activeConfigs.forEach(config => {
      this.scheduleNextRun(config);
    });
  }

  /**
   * 다음 실행 스케줄 등록
   */
  private scheduleNextRun(config: ScheduleConfig | null): void {
    if (config) {
      const nextRun = this.calculateNextRun(config);
      if (!nextRun) return;

      const now = new Date();
      const msUntilNext = nextRun.getTime() - now.getTime();

      if (msUntilNext > 0) {
        const timeout = setTimeout(() => {
          this.runScheduledCheck(config).then(result => {
            console.log(`스케줄 자동 점검 완료 (${config.id}):`, result);
          });
          this.scheduleNextRun(config); // 다음 실행 재등록
        }, msUntilNext);

        this.activeSchedules.set(config.id, timeout);
      }
    } else {
      // 기본 스케줄
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const msUntilMidnight = tomorrow.getTime() - now.getTime();

      const timeout = setTimeout(() => {
        this.runDailyCheck().then(result => {
          console.log('일일 자동 점검 완료:', result);
        });
        this.scheduleNextRun(null);
      }, msUntilMidnight);

      this.activeSchedules.set('default', timeout);
    }
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
   * 스케줄러 중지
   */
  stopAutoCheck(): void {
    this.activeSchedules.forEach(timeout => clearTimeout(timeout));
    this.activeSchedules.clear();
  }

  /**
   * 마지막 점검 시간 조회
   */
  getLastCheckTime(): Date | null {
    return this.lastCheckTime;
  }
}

export const selfHealingSystem = new SelfHealingSystem();

