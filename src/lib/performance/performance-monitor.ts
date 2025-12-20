/**
 * 성능 모니터링 시스템
 * Performance Monitoring System
 * 2025년 최신 성능 최적화 트렌드 반영
 */

export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  cumulativeLayoutShift: number;
  fileSize: number;
  requestCount: number;
  cacheHitRate: number;
}

export interface PerformanceReport {
  score: number; // 0-100
  metrics: PerformanceMetrics;
  recommendations: string[];
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

/**
 * 성능 모니터
 */
export class PerformanceMonitor {
  /**
   * 성능 메트릭 수집
   */
  collectMetrics(): PerformanceMetrics {
    if (typeof window === 'undefined') {
      return {
        loadTime: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        timeToInteractive: 0,
        totalBlockingTime: 0,
        cumulativeLayoutShift: 0,
        fileSize: 0,
        requestCount: 0,
        cacheHitRate: 0,
      };
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
    const lcp = performance.getEntriesByType('largest-contentful-paint')[0] as any;

    return {
      loadTime: navigation.loadEventEnd - navigation.fetchStart,
      firstContentfulPaint: fcp ? fcp.startTime : 0,
      largestContentfulPaint: lcp ? lcp.renderTime || lcp.loadTime : 0,
      timeToInteractive: navigation.domInteractive - navigation.fetchStart,
      totalBlockingTime: 0, // 실제로는 계산 필요
      cumulativeLayoutShift: 0, // 실제로는 계산 필요
      fileSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
      requestCount: resources.length,
      cacheHitRate: resources.filter(r => r.transferSize === 0).length / resources.length,
    };
  }

  /**
   * 성능 리포트 생성
   */
  generateReport(metrics: PerformanceMetrics): PerformanceReport {
    const recommendations: string[] = [];
    let score = 100;

    // 로딩 시간 체크
    if (metrics.loadTime > 3000) {
      score -= 20;
      recommendations.push('로딩 시간이 3초를 초과합니다. 이미지 최적화 및 코드 스플리팅을 고려하세요.');
    } else if (metrics.loadTime > 2000) {
      score -= 10;
      recommendations.push('로딩 시간을 개선할 여지가 있습니다.');
    }

    // FCP 체크
    if (metrics.firstContentfulPaint > 1800) {
      score -= 15;
      recommendations.push('First Contentful Paint가 느립니다. CSS 최적화를 고려하세요.');
    }

    // LCP 체크
    if (metrics.largestContentfulPaint > 2500) {
      score -= 15;
      recommendations.push('Largest Contentful Paint가 느립니다. 이미지 최적화 및 프리로딩을 고려하세요.');
    }

    // 파일 크기 체크
    if (metrics.fileSize > 5 * 1024 * 1024) { // 5MB
      score -= 10;
      recommendations.push('전체 파일 크기가 큽니다. 압축 및 최적화를 고려하세요.');
    }

    // 캐시 히트율 체크
    if (metrics.cacheHitRate < 0.5) {
      score -= 10;
      recommendations.push('캐시 히트율이 낮습니다. 캐싱 전략을 개선하세요.');
    }

    score = Math.max(0, score);

    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (score >= 90) grade = 'A';
    else if (score >= 75) grade = 'B';
    else if (score >= 60) grade = 'C';
    else if (score >= 40) grade = 'D';
    else grade = 'F';

    return {
      score,
      metrics,
      recommendations,
      grade,
    };
  }

  /**
   * 실시간 성능 모니터링
   */
  startMonitoring(callback: (report: PerformanceReport) => void): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const interval = setInterval(() => {
      const metrics = this.collectMetrics();
      const report = this.generateReport(metrics);
      callback(report);
    }, 5000); // 5초마다 체크

    return () => clearInterval(interval);
  }
}

