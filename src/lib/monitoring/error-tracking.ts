/**
 * 에러 트래킹 및 모니터링 시스템
 * Error Tracking & Monitoring System
 */

export type ErrorSeverity = 'critical' | 'error' | 'warning' | 'info';

export interface ErrorEvent {
  id: string;
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  url?: string;
  userAgent?: string;
  userId?: string;
  timestamp: Date;
  context?: Record<string, any>;
  resolved?: boolean;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
}

/**
 * 에러 트래커
 */
export class ErrorTracker {
  private errors: ErrorEvent[] = [];
  private metrics: PerformanceMetric[] = [];
  private maxErrors = 1000;

  /**
   * 에러 기록
   */
  captureError(
    error: Error | string,
    severity: ErrorSeverity = 'error',
    context?: Record<string, unknown>
  ): ErrorEvent {
    const errorEvent: ErrorEvent = {
      id: `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message: typeof error === 'string' ? error : error.message,
      stack: error instanceof Error ? error.stack : undefined,
      severity,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      timestamp: new Date(),
      context,
      resolved: false,
    };

    this.errors.unshift(errorEvent);
    
    // 최대 개수 제한
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // 실제로는 Sentry, LogRocket 등에 전송
    this.sendToExternalService(errorEvent);

    return errorEvent;
  }

  /**
   * 성능 메트릭 기록
   */
  recordMetric(
    name: string,
    value: number,
    unit: string = 'ms',
    tags?: Record<string, string>
  ): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      tags,
    };

    this.metrics.unshift(metric);

    // 최대 개수 제한
    if (this.metrics.length > this.maxErrors) {
      this.metrics = this.metrics.slice(0, this.maxErrors);
    }
  }

  /**
   * 에러 해결 처리
   */
  resolveError(errorId: string): void {
    const error = this.errors.find(e => e.id === errorId);
    if (error) {
      error.resolved = true;
    }
  }

  /**
   * 에러 목록 가져오기
   */
  getErrors(limit: number = 100, severity?: ErrorSeverity): ErrorEvent[] {
    let filtered = this.errors;
    
    if (severity) {
      filtered = filtered.filter(e => e.severity === severity);
    }

    return filtered.slice(0, limit);
  }

  /**
   * 성능 메트릭 가져오기
   */
  getMetrics(limit: number = 100, name?: string): PerformanceMetric[] {
    let filtered = this.metrics;

    if (name) {
      filtered = filtered.filter(m => m.name === name);
    }

    return filtered.slice(0, limit);
  }

  /**
   * 에러 통계
   */
  getErrorStats(): {
    total: number;
    bySeverity: Record<ErrorSeverity, number>;
    unresolved: number;
  } {
    const bySeverity: Record<ErrorSeverity, number> = {
      critical: 0,
      error: 0,
      warning: 0,
      info: 0,
    };

    this.errors.forEach(error => {
      bySeverity[error.severity]++;
    });

    return {
      total: this.errors.length,
      bySeverity,
      unresolved: this.errors.filter(e => !e.resolved).length,
    };
  }

  /**
   * 외부 서비스로 전송 (시뮬레이션)
   */
  private sendToExternalService(error: ErrorEvent): void {
    // 실제로는 Sentry, LogRocket 등에 전송
    console.log('[Error Tracker]', error);
  }
}

export const errorTracker = new ErrorTracker();

