/**
 * 프로덕션 안전 로거
 * Production-Safe Logger
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  debug(...args: any[]): void {
    if (this.isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  }

  info(...args: any[]): void {
    if (this.isDevelopment) {
      console.info('[INFO]', ...args);
    }
  }

  warn(...args: any[]): void {
    if (this.isDevelopment || process.env.ENABLE_WARNINGS === 'true') {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args: any[]): void {
    // 에러는 항상 로깅 (프로덕션에서도)
    console.error('[ERROR]', ...args);
  }

  log(...args: any[]): void {
    if (this.isDevelopment) {
      console.log(...args);
    }
  }
}

export const logger = new Logger();

