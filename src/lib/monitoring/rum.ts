/**
 * 실시간 사용자 모니터링 (RUM)
 * Real User Monitoring
 */

export interface RUMMetric {
  id: string;
  timestamp: number;
  page: string;
  userId?: string;
  sessionId: string;
  
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  
  // Performance Metrics
  ttfb?: number; // Time to First Byte
  fcp?: number; // First Contentful Paint
  domContentLoaded?: number;
  loadComplete?: number;
  
  // User Experience
  userAgent: string;
  viewport: { width: number; height: number };
  connection?: string;
  
  // Errors
  errors: RUMError[];
  
  // Navigation
  navigationType?: string;
  referrer?: string;
}

export interface RUMError {
  message: string;
  stack?: string;
  url: string;
  line?: number;
  column?: number;
  timestamp: number;
}

export interface RUMSession {
  sessionId: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  pages: string[];
  events: RUMEvent[];
  metrics: RUMMetric[];
}

export interface RUMEvent {
  type: 'click' | 'scroll' | 'input' | 'navigation' | 'error';
  target?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface RUMAnalytics {
  sessions: number;
  pageViews: number;
  avgLCP: number;
  avgFID: number;
  avgCLS: number;
  errorRate: number;
  bounceRate: number;
  avgSessionDuration: number;
}

// RUM 시스템
export class RUMSystem {
  private metrics: Map<string, RUMMetric> = new Map();
  private sessions: Map<string, RUMSession> = new Map();
  private currentSession?: RUMSession;

  constructor() {
    this.initializeRUM();
  }

  private initializeRUM(): void {
    if (typeof window === 'undefined') return;

    // Performance Observer 설정
    if ('PerformanceObserver' in window) {
      // LCP 측정
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.recordMetric({ lcp: lastEntry.renderTime || lastEntry.loadTime });
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID 측정
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric({ fid: entry.processingStart - entry.startTime });
        });
      }).observe({ entryTypes: ['first-input'] });

      // CLS 측정
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.recordMetric({ cls: clsValue });
          }
        });
      }).observe({ entryTypes: ['layout-shift'] });
    }

    // 에러 수집
    window.addEventListener('error', (event) => {
      this.recordError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        line: event.lineno,
        column: event.colno,
        timestamp: Date.now(),
      });
    });

    // 페이지 언로드 시 세션 종료
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  // 메트릭 기록
  recordMetric(metric: Partial<RUMMetric>): void {
    if (!this.currentSession) {
      this.startSession();
    }

    const fullMetric: RUMMetric = {
      id: `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      page: window.location.pathname,
      sessionId: this.currentSession!.sessionId,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      errors: [],
      ...metric,
    };

    this.metrics.set(fullMetric.id, fullMetric);
    this.currentSession!.metrics.push(fullMetric);
  }

  // 에러 기록
  recordError(error: RUMError): void {
    if (!this.currentSession) {
      this.startSession();
    }

    const latestMetric = Array.from(this.metrics.values())
      .filter((m) => m.sessionId === this.currentSession!.sessionId)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    if (latestMetric) {
      latestMetric.errors.push(error);
    }
  }

  // 이벤트 기록
  recordEvent(event: RUMEvent): void {
    if (!this.currentSession) {
      this.startSession();
    }

    this.currentSession!.events.push(event);
  }

  // 세션 시작
  startSession(userId?: string): void {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.currentSession = {
      sessionId,
      userId,
      startTime: Date.now(),
      pages: [window.location.pathname],
      events: [],
      metrics: [],
    };
    this.sessions.set(sessionId, this.currentSession);
  }

  // 세션 종료
  endSession(): void {
    if (this.currentSession) {
      this.currentSession.endTime = Date.now();
    }
  }

  // 분석 데이터 생성
  getAnalytics(timeRange?: { start: number; end: number }): RUMAnalytics {
    const sessions = Array.from(this.sessions.values());
    const metrics = Array.from(this.metrics.values());

    const filteredMetrics = timeRange
      ? metrics.filter((m) => m.timestamp >= timeRange.start && m.timestamp <= timeRange.end)
      : metrics;

    const lcpValues = filteredMetrics.map((m) => m.lcp).filter((v) => v !== undefined) as number[];
    const fidValues = filteredMetrics.map((m) => m.fid).filter((v) => v !== undefined) as number[];
    const clsValues = filteredMetrics.map((m) => m.cls).filter((v) => v !== undefined) as number[];

    const totalErrors = filteredMetrics.reduce((sum, m) => sum + m.errors.length, 0);
    const totalPageViews = filteredMetrics.length;

    return {
      sessions: sessions.length,
      pageViews: totalPageViews,
      avgLCP: lcpValues.length > 0 ? lcpValues.reduce((a, b) => a + b, 0) / lcpValues.length : 0,
      avgFID: fidValues.length > 0 ? fidValues.reduce((a, b) => a + b, 0) / fidValues.length : 0,
      avgCLS: clsValues.length > 0 ? clsValues.reduce((a, b) => a + b, 0) / clsValues.length : 0,
      errorRate: totalPageViews > 0 ? (totalErrors / totalPageViews) * 100 : 0,
      bounceRate: 0, // 계산 필요
      avgSessionDuration: 0, // 계산 필요
    };
  }

  getSessions(limit?: number): RUMSession[] {
    const sessions = Array.from(this.sessions.values());
    sessions.sort((a, b) => b.startTime - a.startTime);
    return limit ? sessions.slice(0, limit) : sessions;
  }

  getMetrics(limit?: number): RUMMetric[] {
    const metrics = Array.from(this.metrics.values());
    metrics.sort((a, b) => b.timestamp - a.timestamp);
    return limit ? metrics.slice(0, limit) : metrics;
  }
}

export const rumSystem = new RUMSystem();
if (typeof window !== 'undefined') {
  rumSystem.startSession();
}

