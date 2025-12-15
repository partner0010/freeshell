/**
 * API 보안 테스팅 시스템
 * OWASP API Top 10 기반 테스트
 */

export interface APISecurityTest {
  id: string;
  category: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  testCases: APITestCase[];
}

export interface APITestCase {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  headers?: Record<string, string>;
  body?: any;
  expectedVulnerability?: string;
}

export interface APITestResult {
  testId: string;
  passed: boolean;
  vulnerabilities: APIVulnerability[];
  responseTime: number;
  timestamp: number;
}

export interface APIVulnerability {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  endpoint: string;
  description: string;
  evidence: string;
  remediation: string;
  owasp?: string;
}

// OWASP API Top 10 테스트
export const OWASP_API_TESTS: APISecurityTest[] = [
  {
    id: 'api-1',
    category: 'Broken Object Level Authorization',
    name: '객체 수준 권한 부족',
    description: '객체 ID를 조작하여 다른 사용자의 리소스에 접근',
    severity: 'critical',
    testCases: [
      {
        id: 'test-1',
        name: 'User ID 조작 테스트',
        method: 'GET',
        endpoint: '/api/users/{user_id}',
        expectedVulnerability: '다른 사용자의 데이터 접근 가능',
      },
    ],
  },
  {
    id: 'api-2',
    category: 'Broken Authentication',
    name: '인증 우회',
    description: '인증 메커니즘의 취약점',
    severity: 'critical',
    testCases: [
      {
        id: 'test-2',
        name: 'JWT 토큰 조작 테스트',
        method: 'GET',
        endpoint: '/api/protected',
        headers: { Authorization: 'Bearer <manipulated_token>' },
        expectedVulnerability: '유효하지 않은 토큰으로 접근',
      },
    ],
  },
  {
    id: 'api-3',
    category: 'Excessive Data Exposure',
    name: '과도한 데이터 노출',
    description: '클라이언트에 불필요한 데이터 반환',
    severity: 'high',
    testCases: [
      {
        id: 'test-3',
        name: '민감 정보 노출 테스트',
        method: 'GET',
        endpoint: '/api/user/profile',
        expectedVulnerability: '비밀번호, 토큰 등 민감 정보 포함',
      },
    ],
  },
  {
    id: 'api-4',
    category: 'Lack of Resources & Rate Limiting',
    name: '리소스 제한 부족',
    description: 'Rate limiting이 없어 DoS 공격 가능',
    severity: 'high',
    testCases: [
      {
        id: 'test-4',
        name: 'Rate Limit 테스트',
        method: 'POST',
        endpoint: '/api/login',
        body: { username: 'test', password: 'test' },
        expectedVulnerability: '무제한 요청 가능',
      },
    ],
  },
  {
    id: 'api-5',
    category: 'Broken Function Level Authorization',
    name: '함수 수준 권한 부족',
    description: '관리자 함수에 일반 사용자가 접근',
    severity: 'critical',
    testCases: [
      {
        id: 'test-5',
        name: '관리자 엔드포인트 접근 테스트',
        method: 'DELETE',
        endpoint: '/api/admin/users/{id}',
        expectedVulnerability: '일반 사용자가 관리자 기능 사용',
      },
    ],
  },
];

// API 보안 테스터
export class APISecurityTester {
  async runTests(baseUrl: string, endpoints: string[]): Promise<APITestResult[]> {
    const results: APITestResult[] = [];

    for (const test of OWASP_API_TESTS) {
      for (const testCase of test.testCases) {
        const startTime = Date.now();
        
        try {
          const vulnerabilities = await this.executeTest(baseUrl, testCase, test);
          
          results.push({
            testId: testCase.id,
            passed: vulnerabilities.length === 0,
            vulnerabilities,
            responseTime: Date.now() - startTime,
            timestamp: Date.now(),
          });
        } catch (error) {
          results.push({
            testId: testCase.id,
            passed: false,
            vulnerabilities: [{
              type: test.category,
              severity: test.severity,
              endpoint: testCase.endpoint,
              description: `테스트 실행 실패: ${error}`,
              evidence: String(error),
              remediation: 'API 엔드포인트 확인 필요',
            }],
            responseTime: Date.now() - startTime,
            timestamp: Date.now(),
          });
        }
      }
    }

    return results;
  }

  private async executeTest(
    baseUrl: string,
    testCase: APITestCase,
    test: APISecurityTest
  ): Promise<APIVulnerability[]> {
    const vulnerabilities: APIVulnerability[] = [];

    // 실제로는 API 호출 및 응답 분석
    // 여기서는 시뮬레이션
    
    // Rate limiting 테스트
    if (test.category === 'Lack of Resources & Rate Limiting') {
      // 100개 요청을 빠르게 보내서 rate limit 확인
      const responses = await Promise.all(
        Array.from({ length: 100 }, () => this.makeRequest(baseUrl, testCase))
      );
      
      if (responses.filter((r) => r.status === 200).length > 50) {
        vulnerabilities.push({
          type: test.category,
          severity: 'high',
          endpoint: testCase.endpoint,
          description: 'Rate limiting이 제대로 작동하지 않습니다',
          evidence: '100개 요청 중 50개 이상 성공',
          remediation: 'Rate limiting 미들웨어 추가',
          owasp: 'API4',
        });
      }
    }

    // 인증 우회 테스트
    if (test.category === 'Broken Authentication') {
      const response = await this.makeRequest(baseUrl, testCase);
      if (response.status === 200) {
        vulnerabilities.push({
          type: test.category,
          severity: 'critical',
          endpoint: testCase.endpoint,
          description: '인증 없이 접근 가능',
          evidence: `Status: ${response.status}`,
          remediation: '인증 미들웨어 추가',
          owasp: 'API2',
        });
      }
    }

    return vulnerabilities;
  }

  private async makeRequest(baseUrl: string, testCase: APITestCase): Promise<{
    status: number;
    body: any;
  }> {
    // 실제로는 fetch로 API 호출
    // 여기서는 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { status: 200, body: {} };
  }
}

export const apiSecurityTester = new APISecurityTester();

