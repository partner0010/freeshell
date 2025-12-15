/**
 * 종합 디버깅 시스템 코어
 * 브레이크포인트, 변수 추적, 콘솔 로그, AI 디버깅 등
 */

export interface Breakpoint {
  id: string;
  file: string;
  line: number;
  column?: number;
  condition?: string;
  enabled: boolean;
  hitCount: number;
}

export interface DebugVariable {
  name: string;
  value: any;
  type: string;
  scope: 'local' | 'global' | 'closure';
  modified: boolean;
}

export interface ConsoleLog {
  id: string;
  timestamp: number;
  level: 'log' | 'warn' | 'error' | 'info' | 'debug';
  message: string;
  data?: any[];
  stack?: string;
  file?: string;
  line?: number;
}

export interface DebugSession {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  breakpoints: Breakpoint[];
  logs: ConsoleLog[];
  variables: DebugVariable[];
  callStack: CallFrame[];
  status: 'running' | 'paused' | 'stopped';
}

export interface CallFrame {
  functionName: string;
  file: string;
  line: number;
  column: number;
  variables: DebugVariable[];
}

// 브레이크포인트 관리자
export class BreakpointManager {
  private breakpoints: Map<string, Breakpoint> = new Map();

  addBreakpoint(file: string, line: number, condition?: string): string {
    const id = `bp-${Date.now()}-${Math.random()}`;
    const breakpoint: Breakpoint = {
      id,
      file,
      line,
      enabled: true,
      hitCount: 0,
      condition,
    };
    this.breakpoints.set(id, breakpoint);
    this.applyBreakpoint(breakpoint);
    return id;
  }

  removeBreakpoint(id: string): void {
    const bp = this.breakpoints.get(id);
    if (bp) {
      this.removeBreakpointFromCode(bp);
      this.breakpoints.delete(id);
    }
  }

  toggleBreakpoint(id: string): void {
    const bp = this.breakpoints.get(id);
    if (bp) {
      bp.enabled = !bp.enabled;
      if (bp.enabled) {
        this.applyBreakpoint(bp);
      } else {
        this.removeBreakpointFromCode(bp);
      }
    }
  }

  checkBreakpoint(file: string, line: number, variables: Record<string, any>): boolean {
    for (const bp of this.breakpoints.values()) {
      if (bp.file === file && bp.line === line && bp.enabled) {
        if (bp.condition) {
          try {
            // 조건 평가
            const result = this.evaluateCondition(bp.condition, variables);
            if (!result) return false;
          } catch (e) {
            console.error('Breakpoint condition evaluation error:', e);
            return false;
          }
        }
        bp.hitCount++;
        return true;
      }
    }
    return false;
  }

  private evaluateCondition(condition: string, variables: Record<string, any>): boolean {
    // 안전한 조건 평가
    try {
      const func = new Function(...Object.keys(variables), `return ${condition}`);
      return func(...Object.values(variables));
    } catch {
      return true; // 조건 평가 실패 시 중단
    }
  }

  private applyBreakpoint(bp: Breakpoint): void {
    // 실제로는 코드에 디버거 문 삽입
    // 여기서는 이벤트로 처리
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('breakpoint-added', { detail: bp })
      );
    }
  }

  private removeBreakpointFromCode(bp: Breakpoint): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('breakpoint-removed', { detail: bp })
      );
    }
  }

  getAllBreakpoints(): Breakpoint[] {
    return Array.from(this.breakpoints.values());
  }
}

// 콘솔 로그 수집기
export class ConsoleLogger {
  private logs: ConsoleLog[] = [];
  private maxLogs = 1000;
  private listeners: Set<(log: ConsoleLog) => void> = new Set();

  constructor() {
    this.interceptConsole();
  }

  private interceptConsole(): void {
    if (typeof window === 'undefined') return;

    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;
    const originalDebug = console.debug;

    const createLog = (level: ConsoleLog['level'], ...args: any[]): ConsoleLog => {
      const stack = new Error().stack;
      const log: ConsoleLog = {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        level,
        message: args.map((arg) => this.serialize(arg)).join(' '),
        data: args,
        stack,
      };

      // 스택에서 파일/라인 추출
      if (stack) {
        const match = stack.match(/at.*\((.*):(\d+):(\d+)\)/);
        if (match) {
          log.file = match[1];
          log.line = parseInt(match[2]);
        }
      }

      this.addLog(log);
      return log;
    };

    console.log = (...args: any[]) => {
      createLog('log', ...args);
      originalLog.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      createLog('warn', ...args);
      originalWarn.apply(console, args);
    };

    console.error = (...args: any[]) => {
      createLog('error', ...args);
      originalError.apply(console, args);
    };

    console.info = (...args: any[]) => {
      createLog('info', ...args);
      originalInfo.apply(console, args);
    };

    console.debug = (...args: any[]) => {
      createLog('debug', ...args);
      originalDebug.apply(console, args);
    };
  }

  private serialize(value: any): string {
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }
    return String(value);
  }

  private addLog(log: ConsoleLog): void {
    this.logs.push(log);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    this.listeners.forEach((listener) => listener(log));
  }

  subscribe(listener: (log: ConsoleLog) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getLogs(filter?: { level?: ConsoleLog['level']; search?: string }): ConsoleLog[] {
    let filtered = this.logs;
    if (filter?.level) {
      filtered = filtered.filter((log) => log.level === filter.level);
    }
    if (filter?.search) {
      const search = filter.search.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(search) ||
          log.file?.toLowerCase().includes(search)
      );
    }
    return filtered;
  }

  clear(): void {
    this.logs = [];
  }
}

// AI 기반 버그 수정
export async function aiFixBug(
  code: string,
  error: string,
  context: string
): Promise<{
  fixedCode: string;
  explanation: string;
  confidence: number;
}> {
  // 실제로는 무료 AI API 호출 (Hugging Face, Replicate, OpenRouter 등)
  // 여기서는 시뮬레이션

  // Hugging Face API 예시
  try {
    // const response = await fetch('https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-Instruct-hf', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': 'Bearer YOUR_TOKEN',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     inputs: `Fix this bug in the following code:\n\nError: ${error}\n\nCode:\n\`\`\`javascript\n${code}\n\`\`\`\n\nContext: ${context}`,
    //   }),
    // });

    // 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      fixedCode: code.replace(/eval\(/g, 'JSON.parse('), // 예시
      explanation: 'eval() 함수를 JSON.parse()로 변경하여 보안 취약점을 수정했습니다.',
      confidence: 0.85,
    };
  } catch (error) {
    throw new Error(`AI fix failed: ${error}`);
  }
}

// 네트워크 요청 디버깅
export class NetworkDebugger {
  private requests: Array<{
    id: string;
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: any;
    response?: any;
    status?: number;
    duration?: number;
    timestamp: number;
  }> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.interceptFetch();
    }
  }

  private interceptFetch(): void {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      const method = init?.method || 'GET';
      const id = `req-${Date.now()}-${Math.random()}`;
      const startTime = Date.now();

      const request = {
        id,
        url,
        method,
        headers: (init?.headers as Record<string, string>) || {},
        body: init?.body,
        timestamp: startTime,
      };

      try {
        const response = await originalFetch(input, init);
        const endTime = Date.now();
        const responseData = await response.clone().json().catch(() => null);

        const completeRequest = {
          ...request,
          status: response.status,
          duration: endTime - startTime,
          response: responseData,
        };

        this.requests.push(completeRequest);
        if (this.requests.length > 100) {
          this.requests.shift();
        }

        return response;
      } catch (error) {
        const completeRequest = {
          ...request,
          status: 0,
          duration: Date.now() - startTime,
          response: { error: String(error) },
        };
        this.requests.push(completeRequest);
        throw error;
      }
    };
  }

  getRequests(): typeof this.requests {
    return this.requests;
  }

  clear(): void {
    this.requests = [];
  }
}

// 디버깅 세션 관리자
export class DebugSessionManager {
  private sessions: Map<string, DebugSession> = new Map();
  private currentSession: string | null = null;

  createSession(name: string): string {
    const id = `session-${Date.now()}-${Math.random()}`;
    const session: DebugSession = {
      id,
      name,
      startTime: Date.now(),
      breakpoints: [],
      logs: [],
      variables: [],
      callStack: [],
      status: 'running',
    };
    this.sessions.set(id, session);
    this.currentSession = id;
    return id;
  }

  stopSession(id: string): void {
    const session = this.sessions.get(id);
    if (session) {
      session.status = 'stopped';
      session.endTime = Date.now();
    }
  }

  getSession(id: string): DebugSession | undefined {
    return this.sessions.get(id);
  }

  getCurrentSession(): DebugSession | null {
    if (!this.currentSession) return null;
    return this.sessions.get(this.currentSession) || null;
  }

  getAllSessions(): DebugSession[] {
    return Array.from(this.sessions.values());
  }

  deleteSession(id: string): void {
    this.sessions.delete(id);
    if (this.currentSession === id) {
      this.currentSession = null;
    }
  }
}

// 싱글톤 인스턴스
export const breakpointManager = new BreakpointManager();
export const consoleLogger = new ConsoleLogger();
export const networkDebugger = new NetworkDebugger();
export const debugSessionManager = new DebugSessionManager();

