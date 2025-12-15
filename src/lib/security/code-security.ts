/**
 * GRIP Code Security Module
 * 소스코드 보안 시스템
 */

import { logSecurityEvent, detectSqlInjection } from './index';

// ============================================
// 1. 코드 인젝션 방어
// ============================================

/**
 * JavaScript 코드 인젝션 감지
 */
export function detectCodeInjection(input: string): {
  detected: boolean;
  type?: string;
  pattern?: string;
} {
  const patterns = [
    // eval 사용
    { pattern: /eval\s*\(/i, type: 'eval_injection' },
    // Function 생성자
    { pattern: /new\s+Function\s*\(/i, type: 'function_constructor' },
    // setTimeout/setInterval with string
    { pattern: /setTimeout\s*\(\s*['"`]/i, type: 'timer_injection' },
    { pattern: /setInterval\s*\(\s*['"`]/i, type: 'timer_injection' },
    // document.write
    { pattern: /document\.write\s*\(/i, type: 'document_write' },
    // innerHTML
    { pattern: /\.innerHTML\s*=/i, type: 'innerHTML_injection' },
    // outerHTML
    { pattern: /\.outerHTML\s*=/i, type: 'outerHTML_injection' },
    // script 태그
    { pattern: /<script[\s>]/i, type: 'script_injection' },
    // 이벤트 핸들러
    { pattern: /on\w+\s*=/i, type: 'event_handler_injection' },
    // prototype pollution
    { pattern: /__proto__/i, type: 'prototype_pollution' },
    { pattern: /constructor\s*\[\s*['"`]prototype['"`]\s*\]/i, type: 'prototype_pollution' },
  ];
  
  for (const { pattern, type } of patterns) {
    if (pattern.test(input)) {
      logSecurityEvent({
        type: 'xss_attempt',
        details: { injectionType: type, pattern: pattern.toString() },
      });
      return { detected: true, type, pattern: pattern.toString() };
    }
  }
  
  return { detected: false };
}

/**
 * 템플릿 인젝션 감지
 */
export function detectTemplateInjection(input: string): boolean {
  const patterns = [
    // Server-side template injection patterns
    /\{\{.*\}\}/,
    /\{%.*%\}/,
    /<%= .* %>/,
    /\$\{.*\}/,
  ];
  
  return patterns.some((p) => p.test(input));
}

/**
 * 경로 탐색 공격 감지
 */
export function detectPathTraversal(path: string): boolean {
  const patterns = [
    /\.\.\//,
    /\.\.\\/,
    /%2e%2e%2f/i,
    /%2e%2e%5c/i,
    /\.\.%2f/i,
    /\.\.%5c/i,
  ];
  
  if (patterns.some((p) => p.test(path))) {
    logSecurityEvent({
      type: 'suspicious_activity',
      details: { type: 'path_traversal', path },
    });
    return true;
  }
  
  return false;
}

// ============================================
// 2. 코드 샌드박싱
// ============================================

/**
 * 안전한 코드 실행 (샌드박스)
 */
export function executeSandboxed(code: string): { result: unknown; error?: string } {
  // 위험한 패턴 검사
  const injection = detectCodeInjection(code);
  if (injection.detected) {
    return { result: undefined, error: `Blocked: ${injection.type}` };
  }
  
  try {
    // 제한된 환경에서 실행
    const safeGlobals = {
      console: { log: () => {}, warn: () => {}, error: () => {} },
      Math,
      JSON,
      Date,
      String,
      Number,
      Boolean,
      Array,
      Object,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
    };
    
    // 위험한 전역 객체 제거
    const blockedGlobals = [
      'eval', 'Function', 'fetch', 'XMLHttpRequest',
      'document', 'window', 'self', 'globalThis',
      'process', 'require', 'module', 'exports',
    ];
    
    const wrappedCode = `
      "use strict";
      ${blockedGlobals.map((g) => `var ${g} = undefined;`).join('\n')}
      ${code}
    `;
    
    // eslint-disable-next-line no-new-func
    const fn = new Function(...Object.keys(safeGlobals), wrappedCode);
    const result = fn(...Object.values(safeGlobals));
    
    return { result };
  } catch (error) {
    return { result: undefined, error: String(error) };
  }
}

// ============================================
// 3. 민감 정보 탐지
// ============================================

interface SensitiveDataMatch {
  type: string;
  value: string;
  masked: string;
}

/**
 * 민감 정보 패턴
 */
const sensitivePatterns = [
  // API 키
  { type: 'api_key', pattern: /(?:api[_-]?key|apikey)['":\s]*(['"]?)([a-zA-Z0-9_-]{20,})\1/gi },
  // 비밀번호
  { type: 'password', pattern: /(?:password|passwd|pwd)['":\s]*(['"]?)([^\s'"]{6,})\1/gi },
  // 비밀 키
  { type: 'secret', pattern: /(?:secret|private[_-]?key)['":\s]*(['"]?)([a-zA-Z0-9_-]{20,})\1/gi },
  // 토큰
  { type: 'token', pattern: /(?:token|auth|bearer)['":\s]*(['"]?)([a-zA-Z0-9_.-]{20,})\1/gi },
  // 이메일
  { type: 'email', pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
  // 전화번호
  { type: 'phone', pattern: /(?:\+82|0)[-.\s]?10[-.\s]?\d{4}[-.\s]?\d{4}/g },
  // 주민등록번호
  { type: 'ssn_kr', pattern: /\d{6}[-\s]?[1-4]\d{6}/g },
  // 신용카드
  { type: 'credit_card', pattern: /\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}/g },
  // AWS 키
  { type: 'aws_key', pattern: /AKIA[0-9A-Z]{16}/g },
  // GitHub 토큰
  { type: 'github_token', pattern: /ghp_[a-zA-Z0-9]{36}/g },
  // JWT
  { type: 'jwt', pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g },
];

/**
 * 민감 정보 탐지
 */
export function detectSensitiveData(content: string): SensitiveDataMatch[] {
  const matches: SensitiveDataMatch[] = [];
  
  for (const { type, pattern } of sensitivePatterns) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      const value = match[2] || match[0];
      matches.push({
        type,
        value,
        masked: maskSensitiveData(value),
      });
    }
  }
  
  if (matches.length > 0) {
    logSecurityEvent({
      type: 'suspicious_activity',
      details: { type: 'sensitive_data_found', count: matches.length },
    });
  }
  
  return matches;
}

/**
 * 민감 정보 마스킹
 */
export function maskSensitiveData(value: string): string {
  if (value.length <= 8) {
    return '*'.repeat(value.length);
  }
  return value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4);
}

/**
 * 코드에서 민감 정보 자동 제거
 */
export function sanitizeCode(code: string): string {
  let sanitized = code;
  
  for (const { pattern } of sensitivePatterns) {
    sanitized = sanitized.replace(pattern, (match) => '*'.repeat(match.length));
  }
  
  return sanitized;
}

// ============================================
// 4. 의존성 취약점 검사
// ============================================

interface Vulnerability {
  package: string;
  version: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  fixedIn?: string;
  cve?: string;
}

// 알려진 취약점 데이터베이스 (실제로는 외부 API 사용)
const knownVulnerabilities: Record<string, Vulnerability[]> = {
  'lodash': [
    {
      package: 'lodash',
      version: '<4.17.21',
      severity: 'high',
      description: 'Prototype Pollution',
      fixedIn: '4.17.21',
      cve: 'CVE-2021-23337',
    },
  ],
  'axios': [
    {
      package: 'axios',
      version: '<0.21.1',
      severity: 'high',
      description: 'Server-Side Request Forgery',
      fixedIn: '0.21.1',
      cve: 'CVE-2020-28168',
    },
  ],
};

/**
 * 의존성 취약점 검사
 */
export function checkDependencyVulnerabilities(
  dependencies: Record<string, string>
): Vulnerability[] {
  const vulnerabilities: Vulnerability[] = [];
  
  for (const [pkg, version] of Object.entries(dependencies)) {
    const knownVulns = knownVulnerabilities[pkg];
    if (knownVulns) {
      for (const vuln of knownVulns) {
        // 간단한 버전 비교 (실제로는 semver 사용)
        if (version.includes(vuln.version.replace('<', '').replace('>', ''))) {
          vulnerabilities.push({
            ...vuln,
            version: version,
          });
        }
      }
    }
  }
  
  return vulnerabilities;
}

// ============================================
// 5. 코드 품질 보안 검사
// ============================================

interface SecurityIssue {
  type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  line?: number;
  column?: number;
}

/**
 * 코드 보안 검사
 */
export function auditCode(code: string): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // eval 사용 검사
    if (/eval\s*\(/.test(line)) {
      issues.push({
        type: 'dangerous_function',
        severity: 'critical',
        message: 'eval() 사용은 보안 위험을 초래합니다',
        line: lineNum,
      });
    }
    
    // innerHTML 사용 검사
    if (/\.innerHTML\s*=/.test(line)) {
      issues.push({
        type: 'xss_risk',
        severity: 'warning',
        message: 'innerHTML 사용 시 XSS 위험이 있습니다. textContent를 사용하세요',
        line: lineNum,
      });
    }
    
    // 하드코딩된 비밀 검사
    if (/(?:password|secret|key|token)\s*=\s*['"][^'"]+['"]/i.test(line)) {
      issues.push({
        type: 'hardcoded_secret',
        severity: 'critical',
        message: '하드코딩된 비밀 정보가 감지되었습니다',
        line: lineNum,
      });
    }
    
    // console.log 검사 (프로덕션)
    if (/console\.(log|debug|info)/.test(line)) {
      issues.push({
        type: 'debug_code',
        severity: 'info',
        message: '프로덕션 코드에서 console 문을 제거하세요',
        line: lineNum,
      });
    }
    
    // SQL 인젝션 위험
    if (detectSqlInjection(line)) {
      issues.push({
        type: 'sql_injection_risk',
        severity: 'critical',
        message: 'SQL 인젝션 위험이 있는 패턴이 감지되었습니다',
        line: lineNum,
      });
    }
    
    // 안전하지 않은 정규식
    if (/new\s+RegExp\s*\([^)]*\$/.test(line)) {
      issues.push({
        type: 'regex_dos',
        severity: 'warning',
        message: '동적 RegExp 생성은 ReDoS 공격에 취약할 수 있습니다',
        line: lineNum,
      });
    }
    
    // HTTP 사용
    if (/http:\/\/(?!localhost)/.test(line)) {
      issues.push({
        type: 'insecure_protocol',
        severity: 'warning',
        message: 'HTTPS 대신 HTTP를 사용하고 있습니다',
        line: lineNum,
      });
    }
  });
  
  return issues;
}

// ============================================
// Export
// ============================================

export const CodeSecurity = {
  detectCodeInjection,
  detectTemplateInjection,
  detectPathTraversal,
  executeSandboxed,
  detectSensitiveData,
  maskSensitiveData,
  sanitizeCode,
  checkDependencyVulnerabilities,
  auditCode,
};

export default CodeSecurity;

