/**
 * 컨테이너 보안 시스템
 * Docker, Kubernetes 보안 검사
 */

export interface ContainerImage {
  name: string;
  tag: string;
  digest?: string;
  vulnerabilities: ContainerVulnerability[];
  riskScore: number;
}

export interface ContainerVulnerability {
  id: string;
  package: string;
  version: string;
  cve: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  fixedIn?: string;
}

export interface KubernetesSecurity {
  namespace: string;
  pods: PodSecurity[];
  services: ServiceSecurity[];
  ingress: IngressSecurity[];
  issues: SecurityIssue[];
}

export interface PodSecurity {
  name: string;
  namespace: string;
  securityContext?: {
    runAsNonRoot?: boolean;
    readOnlyRootFilesystem?: boolean;
    capabilities?: string[];
  };
  vulnerabilities: ContainerVulnerability[];
}

export interface ServiceSecurity {
  name: string;
  type: string;
  exposed: boolean;
  riskLevel: 'high' | 'medium' | 'low';
}

export interface IngressSecurity {
  name: string;
  hosts: string[];
  tls: boolean;
  issues: string[];
}

export interface SecurityIssue {
  type: 'misconfiguration' | 'vulnerability' | 'exposure';
  severity: 'critical' | 'high' | 'medium' | 'low';
  resource: string;
  description: string;
  remediation: string;
}

// 컨테이너 보안 스캐너
export class ContainerSecurityScanner {
  // 이미지 취약점 스캔
  async scanImage(imageName: string): Promise<ContainerImage> {
    // 실제로는 Trivy, Clair, Snyk 등의 도구 사용
    // 여기서는 시뮬레이션

    const vulnerabilities: ContainerVulnerability[] = [
      {
        id: 'cve-2024-1234',
        package: 'openssl',
        version: '1.1.1',
        cve: 'CVE-2024-1234',
        severity: 'high',
        description: 'OpenSSL 취약점',
        fixedIn: '1.1.1a',
      },
      {
        id: 'cve-2024-5678',
        package: 'nginx',
        version: '1.18.0',
        cve: 'CVE-2024-5678',
        severity: 'medium',
        description: 'Nginx 보안 취약점',
        fixedIn: '1.20.0',
      },
    ];

    const riskScore = this.calculateRiskScore(vulnerabilities);

    return {
      name: imageName.split(':')[0],
      tag: imageName.split(':')[1] || 'latest',
      vulnerabilities,
      riskScore,
    };
  }

  // Kubernetes 보안 검사
  async scanKubernetes(config: any): Promise<KubernetesSecurity> {
    const issues: SecurityIssue[] = [];

    // 보안 컨텍스트 검사
    if (!config.securityContext?.runAsNonRoot) {
      issues.push({
        type: 'misconfiguration',
        severity: 'high',
        resource: 'Pod',
        description: 'Pod가 root로 실행되고 있습니다',
        remediation: 'securityContext.runAsNonRoot: true 설정',
      });
    }

    // 읽기 전용 파일시스템 검사
    if (!config.securityContext?.readOnlyRootFilesystem) {
      issues.push({
        type: 'misconfiguration',
        severity: 'medium',
        resource: 'Pod',
        description: '루트 파일시스템이 읽기-쓰기 모드입니다',
        remediation: 'securityContext.readReadOnlyRootFilesystem: true 설정',
      });
    }

    // 불필요한 capabilities 검사
    if (config.securityContext?.capabilities?.includes('SYS_ADMIN')) {
      issues.push({
        type: 'misconfiguration',
        severity: 'critical',
        resource: 'Pod',
        description: '불필요한 권한이 부여되어 있습니다',
        remediation: '불필요한 capabilities 제거',
      });
    }

    return {
      namespace: config.metadata?.namespace || 'default',
      pods: [],
      services: [],
      ingress: [],
      issues,
    };
  }

  private calculateRiskScore(vulnerabilities: ContainerVulnerability[]): number {
    const weights = {
      critical: 30,
      high: 20,
      medium: 10,
      low: 5,
    };

    const totalPenalty = vulnerabilities.reduce((sum, vuln) => {
      return sum + (weights[vuln.severity] || 0);
    }, 0);

    return Math.max(0, 100 - totalPenalty);
  }

  // 이미지 하드닝 권장사항
  generateHardeningRecommendations(image: ContainerImage): string[] {
    const recommendations: string[] = [];

    if (image.vulnerabilities.length > 0) {
      recommendations.push('이미지를 최신 버전으로 업데이트하세요');
      recommendations.push('취약점이 있는 패키지를 제거하거나 업데이트하세요');
    }

    recommendations.push('최소 권한 원칙 적용');
    recommendations.push('불필요한 패키지 제거');
    recommendations.push('멀티스테이지 빌드 사용');
    recommendations.push('non-root 사용자로 실행');

    return recommendations;
  }
}

export const containerSecurityScanner = new ContainerSecurityScanner();

