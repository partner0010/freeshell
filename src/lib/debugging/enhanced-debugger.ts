/**
 * 강화된 디버깅 시스템
 * TOP10 디버깅 솔루션 통합
 * 
 * 참고: Chrome DevTools, VS Code Debugger, React DevTools,
 * Redux DevTools, React Query DevTools, Apollo DevTools,
 * Sentry, LogRocket, Bugsnag, Raygun
 */

export interface DebugTool {
  id: string;
  name: string;
  category: 'runtime' | 'performance' | 'network' | 'state' | 'error-tracking';
  enabled: boolean;
  features: string[];
}

export interface DebugSession {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  breakpoints: Breakpoint[];
  logs: DebugLog[];
  networkRequests: NetworkRequest[];
  errors: DebugError[];
  performance: PerformanceMetrics;
}

export interface Breakpoint {
  id: string;
  file: string;
  line: number;
  condition?: string;
  hitCount: number;
  enabled: boolean;
}

export interface DebugLog {
  id: string;
  timestamp: Date;
  level: 'log' | 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  stack?: string;
}

export interface NetworkRequest {
  id: string;
  timestamp: Date;
  method: string;
  url: string;
  status: number;
  duration: number;
  requestHeaders: Record<string, string>;
  responseHeaders: Record<string, string>;
  requestBody?: any;
  responseBody?: any;
  error?: string;
}

export interface DebugError {
  id: string;
  timestamp: Date;
  type: string;
  message: string;
  stack: string;
  file?: string;
  line?: number;
  column?: number;
  context?: Record<string, any>;
}

export interface PerformanceMetrics {
  renderTime: number;
  loadTime: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
}

export class EnhancedDebugger {
  private tools: DebugTool[] = [];
  private sessions: Map<string, DebugSession> = new Map();
  private currentSession: string | null = null;

  constructor() {
    this.initializeTools();
  }

  /**
   * TOP10 디버깅 도구 초기화
   */
  private initializeTools(): void {
    this.tools = [
      {
        id: 'chrome-devtools',
        name: 'Chrome DevTools',
        category: 'runtime',
        enabled: true,
        features: ['Console', 'Sources', 'Network', 'Performance', 'Memory'],
      },
      {
        id: 'vscode-debugger',
        name: 'VS Code Debugger',
        category: 'runtime',
        enabled: true,
        features: ['Breakpoints', 'Watch', 'Call Stack', 'Variables'],
      },
      {
        id: 'react-devtools',
        name: 'React DevTools',
        category: 'state',
        enabled: true,
        features: ['Component Tree', 'Props', 'State', 'Profiler'],
      },
      {
        id: 'redux-devtools',
        name: 'Redux DevTools',
        category: 'state',
        enabled: true,
        features: ['Action History', 'State Diff', 'Time Travel'],
      },
      {
        id: 'react-query-devtools',
        name: 'React Query DevTools',
        category: 'state',
        enabled: true,
        features: ['Query Status', 'Cache', 'Mutations'],
      },
      {
        id: 'sentry',
        name: 'Sentry',
        category: 'error-tracking',
        enabled: true,
        features: ['Error Tracking', 'Performance Monitoring', 'Release Tracking'],
      },
      {
        id: 'logrocket',
        name: 'LogRocket',
        category: 'error-tracking',
        enabled: true,
        features: ['Session Replay', 'Console Logs', 'Network Logs'],
      },
      {
        id: 'bugsnag',
        name: 'Bugsnag',
        category: 'error-tracking',
        enabled: true,
        features: ['Error Reporting', 'Stability Monitoring', 'Release Tracking'],
      },
      {
        id: 'lighthouse',
        name: 'Lighthouse',
        category: 'performance',
        enabled: true,
        features: ['Performance Audit', 'Accessibility', 'SEO', 'Best Practices'],
      },
      {
        id: 'webpack-bundle-analyzer',
        name: 'Webpack Bundle Analyzer',
        category: 'performance',
        enabled: true,
        features: ['Bundle Size', 'Chunk Analysis', 'Tree Shaking'],
      },
    ];
  }

  /**
   * 디버깅 세션 시작
   */
  startSession(name: string): string {
    const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const session: DebugSession = {
      id,
      name,
      startTime: new Date(),
      breakpoints: [],
      logs: [],
      networkRequests: [],
      errors: [],
      performance: {
        renderTime: 0,
        loadTime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        networkLatency: 0,
      },
    };

    this.sessions.set(id, session);
    this.currentSession = id;

    // 네트워크 요청 모니터링 시작
    this.startNetworkMonitoring();
    
    // 에러 추적 시작
    this.startErrorTracking();

    return id;
  }

  /**
   * 디버깅 세션 종료
   */
  stopSession(id: string): void {
    const session = this.sessions.get(id);
    if (session) {
      session.endTime = new Date();
      this.stopNetworkMonitoring();
      this.stopErrorTracking();
      
      if (this.currentSession === id) {
        this.currentSession = null;
      }
    }
  }

  /**
   * 브레이크포인트 추가
   */
  addBreakpoint(file: string, line: number, condition?: string): Breakpoint {
    if (!this.currentSession) {
      throw new Error('활성 세션이 없습니다.');
    }

    const session = this.sessions.get(this.currentSession);
    if (!session) {
      throw new Error('세션을 찾을 수 없습니다.');
    }

    const breakpoint: Breakpoint = {
      id: `bp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      line,
      condition,
      hitCount: 0,
      enabled: true,
    };

    session.breakpoints.push(breakpoint);
    return breakpoint;
  }

  /**
   * 브레이크포인트 제거
   */
  removeBreakpoint(sessionId: string, breakpointId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const index = session.breakpoints.findIndex(bp => bp.id === breakpointId);
    if (index === -1) return false;

    session.breakpoints.splice(index, 1);
    return true;
  }

  /**
   * 로그 추가
   */
  addLog(level: DebugLog['level'], message: string, data?: any): void {
    if (!this.currentSession) return;

    const session = this.sessions.get(this.currentSession);
    if (!session) return;

    const log: DebugLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      message,
      data,
    };

    session.logs.push(log);
  }

  /**
   * 네트워크 요청 추가
   */
  addNetworkRequest(request: Omit<NetworkRequest, 'id' | 'timestamp'>): void {
    if (!this.currentSession) return;

    const session = this.sessions.get(this.currentSession);
    if (!session) return;

    const networkRequest: NetworkRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...request,
    };

    session.networkRequests.push(networkRequest);
  }

  /**
   * 에러 추가
   */
  addError(error: Omit<DebugError, 'id' | 'timestamp'>): void {
    if (!this.currentSession) return;

    const session = this.sessions.get(this.currentSession);
    if (!session) return;

    const debugError: DebugError = {
      id: `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...error,
    };

    session.errors.push(debugError);
  }

  /**
   * 네트워크 모니터링 시작
   */
  private startNetworkMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Fetch API 인터셉터
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      let url: string;
      if (typeof args[0] === 'string') {
        url = args[0];
      } else if (args[0] instanceof URL) {
        url = args[0].href;
      } else if (args[0] instanceof Request) {
        url = args[0].url;
      } else {
        url = String(args[0]);
      }
      const method = args[1]?.method || 'GET';

      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;

        this.addNetworkRequest({
          method,
          url,
          status: response.status,
          duration,
          requestHeaders: args[1]?.headers as any || {},
          responseHeaders: {} as any,
          requestBody: args[1]?.body,
        });

        return response;
      } catch (error: any) {
        const duration = performance.now() - startTime;
        
        this.addNetworkRequest({
          method,
          url,
          status: 0,
          duration,
          requestHeaders: args[1]?.headers as any || {},
          responseHeaders: {} as any,
          error: error.message,
        });

        throw error;
      }
    };
  }

  /**
   * 네트워크 모니터링 중지
   */
  private stopNetworkMonitoring(): void {
    // 원래 fetch로 복원 (실제로는 더 정교한 관리 필요)
  }

  /**
   * 에러 추적 시작
   */
  private startErrorTracking(): void {
    if (typeof window === 'undefined') return;

    // 전역 에러 핸들러
    window.addEventListener('error', (event) => {
      this.addError({
        type: 'Error',
        message: event.message,
        stack: event.error?.stack || '',
        file: event.filename,
        line: event.lineno,
        column: event.colno,
      });
    });

    // Promise rejection 핸들러
    window.addEventListener('unhandledrejection', (event) => {
      this.addError({
        type: 'UnhandledRejection',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack || '',
      });
    });
  }

  /**
   * 에러 추적 중지
   */
  private stopErrorTracking(): void {
    // 이벤트 리스너 제거 (실제로는 더 정교한 관리 필요)
  }

  /**
   * 세션 조회
   */
  getSession(id: string): DebugSession | undefined {
    return this.sessions.get(id);
  }

  /**
   * 모든 세션 조회
   */
  getAllSessions(): DebugSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * 현재 세션 조회
   */
  getCurrentSession(): DebugSession | null {
    if (!this.currentSession) return null;
    return this.sessions.get(this.currentSession) || null;
  }

  /**
   * 도구 조회
   */
  getTools(): DebugTool[] {
    return this.tools;
  }
}

export const enhancedDebugger = new EnhancedDebugger();
