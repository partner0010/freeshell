/**
 * 성능 벤치마크 시스템
 * Performance Benchmarking System
 */

export interface BenchmarkResult {
  name: string;
  duration: number;
  memory?: number;
  timestamp: Date;
  tags?: Record<string, string>;
}

export interface PerformanceReport {
  id: string;
  name: string;
  results: BenchmarkResult[];
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  timestamp: Date;
}

/**
 * 성능 벤치마커
 */
export class PerformanceBenchmark {
  private reports: PerformanceReport[] = [];

  /**
   * 함수 성능 측정
   */
  async measureFunction<T>(
    name: string,
    fn: () => Promise<T> | T,
    iterations: number = 1
  ): Promise<{ result: T; benchmark: BenchmarkResult }> {
    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();

    let result: T;
    const durations: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const iterStart = performance.now();
      result = await fn();
      durations.push(performance.now() - iterStart);
    }

    const endTime = performance.now();
    const endMemory = this.getMemoryUsage();
    const duration = endTime - startTime;
    const memory = endMemory - startMemory;

    const benchmark: BenchmarkResult = {
      name,
      duration,
      memory,
      timestamp: new Date(),
      tags: {
        iterations: iterations.toString(),
        avgDuration: (duration / iterations).toFixed(2),
      },
    };

    return { result: result!, benchmark };
  }

  /**
   * 컴포넌트 렌더링 성능 측정
   */
  async measureComponentRender(
    componentName: string,
    renderFn: () => void
  ): Promise<BenchmarkResult> {
    const startTime = performance.now();
    
    renderFn();
    
    // 렌더링 완료 대기
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    const duration = performance.now() - startTime;

    return {
      name: `component-render-${componentName}`,
      duration,
      timestamp: new Date(),
    };
  }

  /**
   * 페이지 로드 성능 측정
   */
  async measurePageLoad(): Promise<BenchmarkResult> {
    if (typeof window === 'undefined') {
      throw new Error('Page load measurement requires browser environment');
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      name: 'page-load',
      duration: navigation.loadEventEnd - navigation.fetchStart,
      timestamp: new Date(),
      tags: {
        domContentLoaded: (navigation.domContentLoadedEventEnd - navigation.fetchStart).toFixed(2),
        firstPaint: (navigation.responseStart - navigation.fetchStart).toFixed(2),
      },
    };
  }

  /**
   * 메모리 사용량 가져오기
   */
  private getMemoryUsage(): number {
    if (typeof (performance as any).memory !== 'undefined') {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * 성능 리포트 생성
   */
  createReport(name: string, results: BenchmarkResult[]): PerformanceReport {
    const durations = results.map(r => r.duration);
    
    const report: PerformanceReport = {
      id: `report-${Date.now()}`,
      name,
      results,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      timestamp: new Date(),
    };

    this.reports.push(report);
    return report;
  }

  /**
   * 리포트 가져오기
   */
  getReports(): PerformanceReport[] {
    return this.reports;
  }
}

export const performanceBenchmark = new PerformanceBenchmark();

