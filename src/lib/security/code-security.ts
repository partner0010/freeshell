/**
 * 코드 보안 검사 시스템
 * Code Security Scanner
 * 2025년 최신 보안 트렌드 반영
 */

export interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'vulnerability' | 'injection' | 'xss' | 'csrf' | 'auth' | 'data';
  file: string;
  line: number;
  message: string;
  recommendation: string;
}

export interface SecurityReport {
  totalIssues: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  issues: SecurityIssue[];
  score: number; // 0-100
}

/**
 * 코드 보안 스캐너
 */
export class CodeSecurityScanner {
  /**
   * SQL Injection 취약점 검사
   */
  scanSQLInjection(code: string, file: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      // 직접 문자열 연결 패턴 검사
      if (line.match(/query.*\+.*['"]/i) || line.match(/query.*\$\{/i)) {
        issues.push({
          severity: 'critical',
          type: 'injection',
          file,
          line: index + 1,
          message: 'SQL Injection 취약점 발견',
          recommendation: '파라미터화된 쿼리 또는 ORM 사용',
        });
      }
    });

    return issues;
  }

  /**
   * XSS 취약점 검사
   */
  scanXSS(code: string, file: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      // innerHTML 직접 사용 검사
      if (line.match(/innerHTML\s*=/i) && !line.match(/sanitize/i)) {
        issues.push({
          severity: 'high',
          type: 'xss',
          file,
          line: index + 1,
          message: 'XSS 취약점 발견',
          recommendation: 'DOMPurify 또는 React의 자동 이스케이프 사용',
        });
      }
    });

    return issues;
  }

  /**
   * 인증/인가 취약점 검사
   */
  scanAuth(code: string, file: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      // 하드코딩된 비밀번호/토큰 검사
      if (line.match(/password\s*=\s*['"][^'"]+['"]/i) || 
          line.match(/secret\s*=\s*['"][^'"]+['"]/i) ||
          line.match(/api[_-]?key\s*=\s*['"][^'"]+['"]/i)) {
        issues.push({
          severity: 'critical',
          type: 'auth',
          file,
          line: index + 1,
          message: '하드코딩된 인증 정보 발견',
          recommendation: '환경 변수 또는 보안 저장소 사용',
        });
      }
    });

    return issues;
  }

  /**
   * 전체 코드 스캔
   */
  scanCode(code: string, file: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [
      ...this.scanSQLInjection(code, file),
      ...this.scanXSS(code, file),
      ...this.scanAuth(code, file),
    ];

    return issues;
  }

  /**
   * 보안 리포트 생성
   */
  generateReport(issues: SecurityIssue[]): SecurityReport {
    const critical = issues.filter(i => i.severity === 'critical').length;
    const high = issues.filter(i => i.severity === 'high').length;
    const medium = issues.filter(i => i.severity === 'medium').length;
    const low = issues.filter(i => i.severity === 'low').length;

    // 점수 계산 (100점 만점, 취약점이 많을수록 감점)
    let score = 100;
    score -= critical * 20;
    score -= high * 10;
    score -= medium * 5;
    score -= low * 1;
    score = Math.max(0, score);

    return {
      totalIssues: issues.length,
      critical,
      high,
      medium,
      low,
      issues,
      score,
    };
  }
}
