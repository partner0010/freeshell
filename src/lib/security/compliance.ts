/**
 * GRIP Compliance & Privacy Module
 * 규정 준수 및 개인정보 보호
 */

// ============================================
// 1. GDPR 준수
// ============================================

export interface ConsentRecord {
  userId: string;
  timestamp: number;
  consentType: ConsentType;
  granted: boolean;
  ip: string;
  userAgent: string;
}

export type ConsentType =
  | 'essential'
  | 'analytics'
  | 'marketing'
  | 'personalization'
  | 'third_party';

const consentRecords = new Map<string, ConsentRecord[]>();

/**
 * 동의 기록 저장
 */
export function recordConsent(
  userId: string,
  consentType: ConsentType,
  granted: boolean,
  ip: string,
  userAgent: string
): void {
  const records = consentRecords.get(userId) || [];
  records.push({
    userId,
    timestamp: Date.now(),
    consentType,
    granted,
    ip,
    userAgent,
  });
  consentRecords.set(userId, records);
}

/**
 * 사용자 동의 상태 확인
 */
export function hasConsent(userId: string, consentType: ConsentType): boolean {
  const records = consentRecords.get(userId);
  if (!records || records.length === 0) return false;
  
  // 가장 최근 기록 확인
  const latestRecord = records
    .filter((r) => r.consentType === consentType)
    .sort((a, b) => b.timestamp - a.timestamp)[0];
  
  return latestRecord?.granted ?? false;
}

/**
 * 동의 철회
 */
export function revokeConsent(userId: string, consentType: ConsentType, ip: string, userAgent: string): void {
  recordConsent(userId, consentType, false, ip, userAgent);
}

// ============================================
// 2. 데이터 삭제권 (Right to be Forgotten)
// ============================================

export interface DataDeletionRequest {
  requestId: string;
  userId: string;
  timestamp: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  completedAt?: number;
  deletedData: string[];
}

const deletionRequests = new Map<string, DataDeletionRequest>();

/**
 * 데이터 삭제 요청 생성
 */
export function createDataDeletionRequest(userId: string): DataDeletionRequest {
  const request: DataDeletionRequest = {
    requestId: `DEL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    timestamp: Date.now(),
    status: 'pending',
    deletedData: [],
  };
  
  deletionRequests.set(request.requestId, request);
  return request;
}

/**
 * 데이터 삭제 처리
 */
export async function processDataDeletion(requestId: string): Promise<boolean> {
  const request = deletionRequests.get(requestId);
  if (!request) return false;
  
  request.status = 'processing';
  
  try {
    // 삭제할 데이터 카테고리
    const dataCategories = [
      'personal_info',
      'usage_data',
      'preferences',
      'uploaded_files',
      'projects',
      'comments',
      'logs',
    ];
    
    for (const category of dataCategories) {
      // 실제 삭제 로직은 각 시스템에 맞게 구현
      request.deletedData.push(category);
    }
    
    request.status = 'completed';
    request.completedAt = Date.now();
    return true;
  } catch {
    request.status = 'rejected';
    return false;
  }
}

// ============================================
// 3. 데이터 이식권 (Data Portability)
// ============================================

export interface UserDataExport {
  exportId: string;
  userId: string;
  timestamp: number;
  format: 'json' | 'csv' | 'xml';
  data: {
    profile: Record<string, unknown>;
    projects: unknown[];
    settings: Record<string, unknown>;
    activityLog: unknown[];
  };
}

/**
 * 사용자 데이터 내보내기
 */
export function exportUserData(
  userId: string,
  format: 'json' | 'csv' | 'xml' = 'json'
): UserDataExport {
  // 사용자 데이터 수집 (실제로는 DB에서 가져옴)
  const exportData: UserDataExport = {
    exportId: `EXP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    timestamp: Date.now(),
    format,
    data: {
      profile: {
        // 사용자 프로필 정보
      },
      projects: [
        // 사용자 프로젝트
      ],
      settings: {
        // 사용자 설정
      },
      activityLog: [
        // 활동 기록
      ],
    },
  };
  
  return exportData;
}

// ============================================
// 4. 개인정보 익명화
// ============================================

/**
 * 이메일 익명화
 */
export function anonymizeEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***@***.***';
  
  const anonymizedLocal = local.charAt(0) + '***' + local.charAt(local.length - 1);
  const [domainName, tld] = domain.split('.');
  const anonymizedDomain = domainName.charAt(0) + '***';
  
  return `${anonymizedLocal}@${anonymizedDomain}.${tld || '***'}`;
}

/**
 * 전화번호 익명화
 */
export function anonymizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '***-****-****';
  
  return `***-****-${digits.slice(-4)}`;
}

/**
 * 이름 익명화
 */
export function anonymizeName(name: string): string {
  if (name.length <= 1) return '*';
  return name.charAt(0) + '*'.repeat(name.length - 1);
}

/**
 * IP 주소 익명화
 */
export function anonymizeIp(ip: string): string {
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.xxx.xxx`;
  }
  // IPv6
  const ipv6Parts = ip.split(':');
  if (ipv6Parts.length > 2) {
    return `${ipv6Parts[0]}:${ipv6Parts[1]}:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx`;
  }
  return 'xxx.xxx.xxx.xxx';
}

// ============================================
// 5. 데이터 보존 정책
// ============================================

export interface DataRetentionPolicy {
  category: string;
  retentionPeriod: number; // 일 단위
  legalBasis: string;
  autoDelete: boolean;
}

const retentionPolicies: DataRetentionPolicy[] = [
  {
    category: 'user_accounts',
    retentionPeriod: 365 * 3, // 3년
    legalBasis: '계약 이행',
    autoDelete: false,
  },
  {
    category: 'access_logs',
    retentionPeriod: 90,
    legalBasis: '보안 및 법적 의무',
    autoDelete: true,
  },
  {
    category: 'analytics_data',
    retentionPeriod: 365,
    legalBasis: '정당한 이익',
    autoDelete: true,
  },
  {
    category: 'marketing_data',
    retentionPeriod: 365 * 2, // 2년
    legalBasis: '동의',
    autoDelete: true,
  },
  {
    category: 'backup_data',
    retentionPeriod: 30,
    legalBasis: '보안 및 법적 의무',
    autoDelete: true,
  },
  {
    category: 'support_tickets',
    retentionPeriod: 365,
    legalBasis: '계약 이행',
    autoDelete: false,
  },
];

/**
 * 데이터 보존 정책 조회
 */
export function getRetentionPolicy(category: string): DataRetentionPolicy | undefined {
  return retentionPolicies.find((p) => p.category === category);
}

/**
 * 만료된 데이터 확인
 */
export function isDataExpired(category: string, createdAt: number): boolean {
  const policy = getRetentionPolicy(category);
  if (!policy) return false;
  
  const expirationDate = createdAt + policy.retentionPeriod * 24 * 60 * 60 * 1000;
  return Date.now() > expirationDate;
}

// ============================================
// 6. 개인정보 영향 평가 (PIA)
// ============================================

export interface PrivacyImpactAssessment {
  assessmentId: string;
  projectName: string;
  timestamp: number;
  dataTypes: string[];
  risks: Array<{
    description: string;
    likelihood: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigations: string[];
  }>;
  overallRisk: 'low' | 'medium' | 'high';
  approved: boolean;
}

/**
 * 프라이버시 영향 평가 수행
 */
export function performPrivacyImpactAssessment(
  projectName: string,
  dataTypes: string[]
): PrivacyImpactAssessment {
  const risks: PrivacyImpactAssessment['risks'] = [];
  
  // 민감한 데이터 타입 확인
  const sensitiveTypes = ['email', 'phone', 'address', 'payment', 'health', 'biometric'];
  const hasSensitiveData = dataTypes.some((type) => sensitiveTypes.includes(type));
  
  if (hasSensitiveData) {
    risks.push({
      description: '민감한 개인정보 처리',
      likelihood: 'medium',
      impact: 'high',
      mitigations: [
        '데이터 암호화 적용',
        '접근 권한 최소화',
        '감사 로그 활성화',
      ],
    });
  }
  
  // 대량 데이터 처리 확인
  if (dataTypes.length > 5) {
    risks.push({
      description: '다양한 데이터 유형 처리',
      likelihood: 'medium',
      impact: 'medium',
      mitigations: [
        '데이터 최소화 원칙 적용',
        '용도별 데이터 분리',
      ],
    });
  }
  
  // 전체 위험도 계산
  const highRisks = risks.filter((r) => r.impact === 'high').length;
  const overallRisk = highRisks > 0 ? 'high' : risks.length > 2 ? 'medium' : 'low';
  
  return {
    assessmentId: `PIA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    projectName,
    timestamp: Date.now(),
    dataTypes,
    risks,
    overallRisk,
    approved: overallRisk !== 'high',
  };
}

// ============================================
// 7. 쿠키 동의 관리
// ============================================

export interface CookieConsent {
  necessary: boolean; // 항상 true
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

/**
 * 쿠키 동의 배너 설정
 */
export function getCookieConsentConfig() {
  return {
    categories: [
      {
        id: 'necessary',
        name: '필수 쿠키',
        description: '웹사이트의 기본 기능에 필요한 쿠키입니다.',
        required: true,
      },
      {
        id: 'analytics',
        name: '분석 쿠키',
        description: '웹사이트 사용 방식을 이해하는 데 도움이 되는 쿠키입니다.',
        required: false,
      },
      {
        id: 'marketing',
        name: '마케팅 쿠키',
        description: '관련성 있는 광고를 표시하는 데 사용되는 쿠키입니다.',
        required: false,
      },
      {
        id: 'personalization',
        name: '개인화 쿠키',
        description: '맞춤형 경험을 제공하는 데 사용되는 쿠키입니다.',
        required: false,
      },
    ],
    legalText: {
      privacyPolicy: '/privacy',
      cookiePolicy: '/cookies',
      termsOfService: '/terms',
    },
  };
}

// ============================================
// 8. 접근 로그 기록
// ============================================

export interface AccessLog {
  logId: string;
  timestamp: number;
  userId?: string;
  action: string;
  resource: string;
  ip: string;
  userAgent: string;
  success: boolean;
  details?: Record<string, unknown>;
}

const accessLogs: AccessLog[] = [];

/**
 * 접근 로그 기록
 */
export function logAccess(log: Omit<AccessLog, 'logId' | 'timestamp'>): void {
  accessLogs.push({
    ...log,
    logId: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  });
  
  // 최대 10000개 유지
  if (accessLogs.length > 10000) {
    accessLogs.shift();
  }
}

/**
 * 접근 로그 조회
 */
export function getAccessLogs(filter?: {
  userId?: string;
  action?: string;
  startTime?: number;
  endTime?: number;
  success?: boolean;
}): AccessLog[] {
  let filtered = [...accessLogs];
  
  if (filter?.userId) {
    filtered = filtered.filter((log) => log.userId === filter.userId);
  }
  if (filter?.action) {
    filtered = filtered.filter((log) => log.action === filter.action);
  }
  if (filter?.startTime) {
    filtered = filtered.filter((log) => log.timestamp >= filter.startTime!);
  }
  if (filter?.endTime) {
    filtered = filtered.filter((log) => log.timestamp <= filter.endTime!);
  }
  if (filter?.success !== undefined) {
    filtered = filtered.filter((log) => log.success === filter.success);
  }
  
  return filtered;
}

// ============================================
// Export
// ============================================

export const Compliance = {
  // Consent
  recordConsent,
  hasConsent,
  revokeConsent,
  
  // Data Deletion
  createDataDeletionRequest,
  processDataDeletion,
  
  // Data Export
  exportUserData,
  
  // Anonymization
  anonymizeEmail,
  anonymizePhone,
  anonymizeName,
  anonymizeIp,
  
  // Retention
  getRetentionPolicy,
  isDataExpired,
  
  // PIA
  performPrivacyImpactAssessment,
  
  // Cookie
  getCookieConsentConfig,
  
  // Access Log
  logAccess,
  getAccessLogs,
};

export default Compliance;

