/**
 * 소스 코드 보안 감사 시스템
 * 정적 코드 분석 및 보안 취약점 검사
 */

export interface CodeAuditResult {
  file: string;
  line: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  issue: string;
  description: string;
  recommendation: string;
  cwe?: string;
  owasp?: string;
}

// 보안 패턴 검색
const securityPatterns = [
  {
    pattern: /eval\s*\(/gi,
    severity: 'critical' as const,
    issue: 'eval() 사용',
    description: 'eval() 함수는 XSS 공격에 취약합니다',
    recommendation: 'eval() 대신 JSON.parse() 또는 안전한 파싱 방법을 사용하세요',
    cwe: 'CWE-95',
    owasp: 'A03:2021-Injection',
  },
  {
    pattern: /innerHTML\s*=/gi,
    severity: 'high' as const,
    issue: 'innerHTML 직접 할당',
    description: 'innerHTML에 사용자 입력을 직접 할당하면 XSS 공격에 취약합니다',
    recommendation: 'textContent 또는 DOMPurify를 사용하세요',
    cwe: 'CWE-79',
    owasp: 'A03:2021-Injection',
  },
  {
    pattern: /dangerouslySetInnerHTML/gi,
    severity: 'high' as const,
    issue: 'dangerouslySetInnerHTML 사용',
    description: 'React의 dangerouslySetInnerHTML은 XSS 위험이 있습니다',
    recommendation: 'DOMPurify로 sanitize 후 사용하세요',
    cwe: 'CWE-79',
    owasp: 'A03:2021-Injection',
  },
  {
    pattern: /localStorage\.(getItem|setItem)\s*\([^)]*\)/gi,
    severity: 'medium' as const,
    issue: 'localStorage 민감 정보 저장',
    description: 'localStorage에 민감한 정보를 저장하면 XSS 공격 시 노출될 수 있습니다',
    recommendation: '민감한 정보는 암호화하거나 세션 스토리지 사용을 고려하세요',
    cwe: 'CWE-922',
    owasp: 'A02:2021-Cryptographic Failures',
  },
  {
    pattern: /console\.(log|warn|error|debug)\s*\(/gi,
    severity: 'low' as const,
    issue: 'console 사용',
    description: '프로덕션 코드에 console이 남아있으면 정보가 노출될 수 있습니다',
    recommendation: '프로덕션 빌드 전 console 제거 또는 환경변수로 제어하세요',
    cwe: 'CWE-200',
    owasp: 'A01:2021-Broken Access Control',
  },
  {
    pattern: /process\.env\.([A-Z_]+)/gi,
    severity: 'high' as const,
    issue: '환경변수 직접 노출',
    description: '클라이언트 사이드에서 환경변수를 직접 사용하면 노출될 수 있습니다',
    recommendation: '환경변수는 서버 사이드에서만 사용하거나 마스킹하세요',
    cwe: 'CWE-200',
    owasp: 'A01:2021-Broken Access Control',
  },
  {
    pattern: /document\.cookie\s*=/gi,
    severity: 'medium' as const,
    issue: '쿠키 직접 조작',
    description: '쿠키를 직접 조작하면 보안 속성을 설정하기 어렵습니다',
    recommendation: 'HttpOnly, Secure, SameSite 속성을 설정하세요',
    cwe: 'CWE-614',
    owasp: 'A02:2021-Cryptographic Failures',
  },
  {
    pattern: /fetch\s*\(\s*["'](https?:\/\/[^"']+)["']/gi,
    severity: 'medium' as const,
    issue: '외부 URL 직접 호출',
    description: '외부 URL을 직접 호출하면 SSRF 공격에 취약할 수 있습니다',
    recommendation: 'URL 화이트리스트 검증을 추가하세요',
    cwe: 'CWE-918',
    owasp: 'A10:2021-Server-Side Request Forgery',
  },
  {
    pattern: /setTimeout\s*\(\s*[^,)]+,\s*0\s*\)/gi,
    severity: 'low' as const,
    issue: '비동기 처리 최적화',
    description: 'setTimeout(fn, 0) 대신 더 효율적인 방법을 사용할 수 있습니다',
    recommendation: 'requestAnimationFrame 또는 Promise.resolve()를 고려하세요',
  },
  {
    pattern: /\/\*[\s\S]*?\*\/|\/\/.*/g,
    severity: 'info' as const,
    issue: '주석 내 민감 정보',
    description: '주석에 API 키나 비밀번호가 있을 수 있습니다',
    recommendation: '주석을 검토하여 민감 정보를 제거하세요',
    cwe: 'CWE-200',
  },
];

// 소스 코드 감사
export function auditSourceCode(sourceCode: string, filename: string): CodeAuditResult[] {
  const results: CodeAuditResult[] = [];
  const lines = sourceCode.split('\n');

  securityPatterns.forEach((pattern) => {
    const matches = sourceCode.matchAll(pattern.pattern);
    
    for (const match of matches) {
      if (!match.index) continue;
      
      // 라인 번호 계산
      const lineNumber = sourceCode.substring(0, match.index).split('\n').length;
      const lineContent = lines[lineNumber - 1]?.trim() || '';

      results.push({
        file: filename,
        line: lineNumber,
        severity: pattern.severity,
        issue: pattern.issue,
        description: pattern.description,
        recommendation: pattern.recommendation,
        cwe: pattern.cwe,
        owasp: pattern.owasp,
      });
    }
  });

  return results;
}

// 전체 프로젝트 감사
export async function auditProject(
  files: Array<{ path: string; content: string }>
): Promise<{
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  results: CodeAuditResult[];
}> {
  const allResults: CodeAuditResult[] = [];

  files.forEach((file) => {
    const results = auditSourceCode(file.content, file.path);
    allResults.push(...results);
  });

  const summary = {
    total: allResults.length,
    critical: allResults.filter((r) => r.severity === 'critical').length,
    high: allResults.filter((r) => r.severity === 'high').length,
    medium: allResults.filter((r) => r.severity === 'medium').length,
    low: allResults.filter((r) => r.severity === 'low').length,
    results: allResults,
  };

  return summary;
}

// 취약점 점수 계산 (0-100, 높을수록 안전)
export function calculateSecurityScore(auditResult: {
  critical: number;
  high: number;
  medium: number;
  low: number;
}): number {
  const weights = {
    critical: 20,
    high: 10,
    medium: 5,
    low: 1,
  };

  const totalPenalty =
    auditResult.critical * weights.critical +
    auditResult.high * weights.high +
    auditResult.medium * weights.medium +
    auditResult.low * weights.low;

  const score = Math.max(0, 100 - totalPenalty);
  return Math.round(score);
}

