/**
 * 코드 검증 및 테스트 유틸리티
 * Code Validation & Testing Utilities
 */

export interface ValidationResult {
  file: string;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  passed: boolean;
}

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
  rule?: string;
}

export interface ValidationWarning {
  line: number;
  column: number;
  message: string;
  suggestion?: string;
}

/**
 * 코드 검증기
 */
export class CodeValidator {
  /**
   * TypeScript 문법 검증 (시뮬레이션)
   */
  async validateTypeScript(code: string, fileName: string): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // 기본 검증 규칙들
    this.checkCommonIssues(code, fileName, errors, warnings);

    return {
      file: fileName,
      errors,
      warnings,
      passed: errors.length === 0,
    };
  }

  /**
   * React 컴포넌트 검증
   */
  async validateReactComponent(code: string, fileName: string): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // React 관련 검증
    if (code.includes('useEffect') && !code.includes('useEffect')) {
      warnings.push({
        line: this.findLine(code, 'useEffect'),
        column: 0,
        message: 'useEffect dependency array should be properly defined',
        suggestion: 'Ensure all dependencies are included in the dependency array',
      });
    }

    if (code.includes('useState') && code.match(/useState/g)?.length > 10) {
      warnings.push({
        line: 0,
        column: 0,
        message: 'Too many useState hooks - consider using useReducer',
        suggestion: 'Refactor to use useReducer for complex state management',
      });
    }

    // 키 검증
    if (code.includes('.map(') && !code.includes('key=')) {
      errors.push({
        line: this.findLine(code, '.map('),
        column: 0,
        message: 'Missing key prop in map function',
        severity: 'error',
        rule: 'react/jsx-key',
      });
    }

    this.checkCommonIssues(code, fileName, errors, warnings);

    return {
      file: fileName,
      errors,
      warnings,
      passed: errors.length === 0,
    };
  }

  /**
   * 공통 이슈 검증
   */
  private checkCommonIssues(
    code: string,
    fileName: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // console.log 검사
      if (line.includes('console.log') && !line.includes('//')) {
        warnings.push({
          line: lineNumber,
          column: line.indexOf('console.log'),
          message: 'console.log should be removed in production',
          suggestion: 'Use proper logging library or remove console.log statements',
        });
      }

      // TODO/FIXME 검사
      if (line.match(/\b(TODO|FIXME|XXX|HACK)\b/i)) {
        warnings.push({
          line: lineNumber,
          column: 0,
          message: `Found ${line.match(/\b(TODO|FIXME|XXX|HACK)\b/i)?.[0]} comment`,
          suggestion: 'Address TODO/FIXME comments before production',
        });
      }

      // 에러 처리 검사
      if (line.includes('try {') && !code.includes('catch')) {
        warnings.push({
          line: lineNumber,
          column: 0,
          message: 'try block without catch or finally',
          suggestion: 'Add proper error handling',
        });
      }

      // 보안 이슈 검사
      if (line.includes('eval(') || line.includes('Function(')) {
        errors.push({
          line: lineNumber,
          column: line.indexOf('eval') || line.indexOf('Function'),
          message: 'Use of eval() or Function() constructor is dangerous',
          severity: 'error',
          rule: 'no-eval',
        });
      }

      if (line.includes('innerHTML') && !line.includes('sanitize')) {
        warnings.push({
          line: lineNumber,
          column: line.indexOf('innerHTML'),
          message: 'innerHTML usage without sanitization',
          suggestion: 'Use textContent or sanitize HTML to prevent XSS',
        });
      }
    });
  }

  /**
   * 라인 번호 찾기
   */
  private findLine(code: string, searchString: string): number {
    const lines = code.split('\n');
    const index = lines.findIndex(line => line.includes(searchString));
    return index >= 0 ? index + 1 : 0;
  }

  /**
   * 전체 프로젝트 검증 (시뮬레이션)
   */
  async validateProject(files: string[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (const file of files) {
      // 실제로는 파일을 읽어서 검증
      const code = ''; // 파일 읽기
      const result = await this.validateTypeScript(code, file);
      results.push(result);
    }

    return results;
  }
}

export const codeValidator = new CodeValidator();

