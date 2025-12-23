/**
 * 종합 검증 시스템
 * 미구현, 미동작, 소스 오류, 보안 등 종합 검증
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface ValidationIssue {
  id: string;
  type: 'missing' | 'error' | 'security' | 'performance' | 'accessibility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  file?: string;
  line?: number;
  message: string;
  fix?: string;
  references?: string[];
}

export interface ValidationReport {
  timestamp: Date;
  totalIssues: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  issues: ValidationIssue[];
  recommendations: string[];
}

export class ComprehensiveValidator {
  /**
   * 종합 검증 실행
   */
  async validateAll(): Promise<ValidationReport> {
    const issues: ValidationIssue[] = [];

    // 1. 미구현 기능 확인
    issues.push(...await this.checkMissingFeatures());

    // 2. 소스 오류 확인
    issues.push(...await this.checkSourceErrors());

    // 3. 보안 취약점 확인
    issues.push(...await this.checkSecurityVulnerabilities());

    // 4. 성능 이슈 확인
    issues.push(...await this.checkPerformanceIssues());

    // 5. 접근성 이슈 확인
    issues.push(...await this.checkAccessibilityIssues());

    // 통계 계산
    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};

    for (const issue of issues) {
      byType[issue.type] = (byType[issue.type] || 0) + 1;
      bySeverity[issue.severity] = (bySeverity[issue.severity] || 0) + 1;
    }

    // 권장사항 생성
    const recommendations = this.generateRecommendations(issues);

    return {
      timestamp: new Date(),
      totalIssues: issues.length,
      byType,
      bySeverity,
      issues,
      recommendations,
    };
  }

  /**
   * 미구현 기능 확인
   */
  private async checkMissingFeatures(): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];

    // 필수 API 엔드포인트 확인
    const requiredAPIs = [
      '/api/ai/chat',
      '/api/content/generate',
      '/api/validate/site',
      '/api/debug/ai-fix',
      '/api/admin/health/schedule',
      '/api/admin/security/report',
      '/api/admin/learning/proposals',
    ];

    for (const api of requiredAPIs) {
      const filePath = join(process.cwd(), 'src', 'app', api, 'route.ts');
      if (!existsSync(filePath)) {
        issues.push({
          id: `missing-${api}`,
          type: 'missing',
          severity: 'high',
          file: filePath,
          message: `필수 API 엔드포인트가 없습니다: ${api}`,
          fix: `${api} 엔드포인트를 구현하세요.`,
        });
      }
    }

    // 필수 컴포넌트 확인
    const requiredComponents = [
      'src/components/ai/ChatGPTLikeSearch.tsx',
      'src/components/ai/CodeGenerator.tsx',
      'src/components/debugging/ComprehensiveDebugger.tsx',
      'src/components/remote/RemoteControlHost.tsx',
      'src/components/remote/RemoteControlClient.tsx',
    ];

    for (const component of requiredComponents) {
      const filePath = join(process.cwd(), component);
      if (!existsSync(filePath)) {
        issues.push({
          id: `missing-${component}`,
          type: 'missing',
          severity: 'high',
          file: filePath,
          message: `필수 컴포넌트가 없습니다: ${component}`,
          fix: `${component} 컴포넌트를 구현하세요.`,
        });
      }
    }

    return issues;
  }

  /**
   * 소스 오류 확인
   */
  private async checkSourceErrors(): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];

    // TypeScript 설정 확인
    const tsconfigPath = join(process.cwd(), 'tsconfig.json');
    if (!existsSync(tsconfigPath)) {
      issues.push({
        id: 'missing-tsconfig',
        type: 'error',
        severity: 'critical',
        file: tsconfigPath,
        message: 'tsconfig.json이 없습니다.',
        fix: 'tsconfig.json 파일을 생성하세요.',
      });
    }

    // package.json 확인
    const packageJsonPath = join(process.cwd(), 'package.json');
    if (!existsSync(packageJsonPath)) {
      issues.push({
        id: 'missing-package-json',
        type: 'error',
        severity: 'critical',
        file: packageJsonPath,
        message: 'package.json이 없습니다.',
        fix: 'package.json 파일을 생성하세요.',
      });
    }

    return issues;
  }

  /**
   * 보안 취약점 확인
   */
  private async checkSecurityVulnerabilities(): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];

    // 환경 변수 확인
    const requiredEnvVars = ['NEXTAUTH_SECRET', 'DATABASE_URL'];
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        issues.push({
          id: `missing-env-${envVar}`,
          type: 'security',
          severity: 'critical',
          message: `필수 환경 변수가 설정되지 않았습니다: ${envVar}`,
          fix: `${envVar} 환경 변수를 설정하세요.`,
        });
      }
    }

    // HTTPS 확인
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_BASE_URL?.startsWith('https://')) {
      issues.push({
        id: 'no-https',
        type: 'security',
        severity: 'critical',
        message: '프로덕션 환경에서 HTTPS를 사용해야 합니다.',
        fix: 'SSL 인증서를 설치하고 HTTPS를 활성화하세요.',
      });
    }

    return issues;
  }

  /**
   * 성능 이슈 확인
   */
  private async checkPerformanceIssues(): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];

    // 이미지 최적화 확인
    issues.push({
      id: 'image-optimization',
      type: 'performance',
      severity: 'medium',
      message: '이미지 최적화를 적용하세요.',
      fix: 'Next.js Image 컴포넌트를 사용하고 WebP 형식을 지원하세요.',
    });

    // 코드 스플리팅 확인
    issues.push({
      id: 'code-splitting',
      type: 'performance',
      severity: 'medium',
      message: '코드 스플리팅을 활용하세요.',
      fix: '동적 import를 사용하여 번들 크기를 줄이세요.',
    });

    return issues;
  }

  /**
   * 접근성 이슈 확인
   */
  private async checkAccessibilityIssues(): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];

    issues.push({
      id: 'accessibility-audit',
      type: 'accessibility',
      severity: 'medium',
      message: '접근성 감사를 정기적으로 수행하세요.',
      fix: 'aXe 또는 WAVE를 사용하여 접근성을 검사하세요.',
    });

    return issues;
  }

  /**
   * 권장사항 생성
   */
  private generateRecommendations(issues: ValidationIssue[]): string[] {
    const recommendations: string[] = [];

    const criticalIssues = issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      recommendations.push(`${criticalIssues.length}개의 Critical 이슈를 즉시 해결하세요.`);
    }

    const securityIssues = issues.filter(i => i.type === 'security');
    if (securityIssues.length > 0) {
      recommendations.push('보안 취약점을 우선적으로 해결하세요.');
    }

    const missingFeatures = issues.filter(i => i.type === 'missing');
    if (missingFeatures.length > 0) {
      recommendations.push(`${missingFeatures.length}개의 미구현 기능을 구현하세요.`);
    }

    recommendations.push('정기적인 코드 리뷰를 수행하세요.');
    recommendations.push('자동화된 테스트를 추가하세요.');
    recommendations.push('성능 모니터링을 설정하세요.');

    return recommendations;
  }
}

export const comprehensiveValidator = new ComprehensiveValidator();

