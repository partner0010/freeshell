/**
 * GDPR 및 개인정보보호 컴플라이언스 시스템
 */

export interface DataSubjectRequest {
  id: string;
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction';
  userId: string;
  timestamp: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  data?: any;
}

export interface PrivacyImpactAssessment {
  id: string;
  project: string;
  riskLevel: 'low' | 'medium' | 'high';
  dataTypes: string[];
  processingPurposes: string[];
  retentionPeriod: number;
  securityMeasures: string[];
  recommendations: string[];
}

export interface ConsentRecord {
  userId: string;
  purpose: string;
  given: boolean;
  timestamp: number;
  version: string;
  ipAddress: string;
  userAgent: string;
}

// GDPR 컴플라이언스 관리자
export class GDPRComplianceManager {
  private consentRecords: Map<string, ConsentRecord[]> = new Map();
  private dataRequests: Map<string, DataSubjectRequest> = new Map();

  // 동의 기록
  recordConsent(consent: Omit<ConsentRecord, 'timestamp'>): void {
    const records = this.consentRecords.get(consent.userId) || [];
    records.push({
      ...consent,
      timestamp: Date.now(),
    });
    this.consentRecords.set(consent.userId, records);
  }

  // 데이터 주체 권리 요청 처리
  async processDataSubjectRequest(request: Omit<DataSubjectRequest, 'id' | 'timestamp' | 'status'>): Promise<DataSubjectRequest> {
    const fullRequest: DataSubjectRequest = {
      ...request,
      id: `request-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      status: 'pending',
    };

    this.dataRequests.set(fullRequest.id, fullRequest);

    // 자동 처리
    await this.autoProcessRequest(fullRequest);

    return fullRequest;
  }

  private async autoProcessRequest(request: DataSubjectRequest): Promise<void> {
    request.status = 'processing';

    switch (request.type) {
      case 'access':
        // 데이터 접근 제공
        request.data = await this.collectUserData(request.userId);
        break;
      
      case 'erasure':
        // 데이터 삭제 (Right to be forgotten)
        await this.deleteUserData(request.userId);
        break;
      
      case 'portability':
        // 데이터 이식성 (기계가 읽을 수 있는 형식)
        request.data = await this.exportUserData(request.userId);
        break;
    }

    request.status = 'completed';
  }

  private async collectUserData(userId: string): Promise<any> {
    // 실제로는 데이터베이스에서 사용자 데이터 수집
    return {
      personalInfo: {},
      activityLogs: [],
      preferences: {},
    };
  }

  private async deleteUserData(userId: string): Promise<void> {
    // 실제로는 데이터베이스에서 사용자 데이터 삭제
    this.consentRecords.delete(userId);
  }

  private async exportUserData(userId: string): Promise<any> {
    // JSON 형식으로 데이터 내보내기
    return JSON.stringify(await this.collectUserData(userId), null, 2);
  }

  // 개인정보 영향 평가
  conductPrivacyImpactAssessment(data: Omit<PrivacyImpactAssessment, 'id' | 'riskLevel'>): PrivacyImpactAssessment {
    // 위험 수준 자동 계산
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let riskScore = 0;

    // 민감한 데이터 타입 체크
    const sensitiveTypes = ['health', 'financial', 'biometric', 'genetic'];
    if (data.dataTypes.some((type) => sensitiveTypes.some((st) => type.toLowerCase().includes(st)))) {
      riskScore += 30;
    }

    // 보유 기간 체크
    if (data.retentionPeriod > 365 * 24 * 60 * 60 * 1000) { // 1년 이상
      riskScore += 20;
    }

    // 보안 조치 체크
    if (data.securityMeasures.length < 3) {
      riskScore += 25;
    }

    if (riskScore >= 50) {
      riskLevel = 'high';
    } else if (riskScore >= 25) {
      riskLevel = 'medium';
    }

    const assessment: PrivacyImpactAssessment = {
      id: `pia-${Date.now()}`,
      ...data,
      riskLevel,
    };

    return assessment;
  }

  // 동의 기록 조회
  getConsentHistory(userId: string): ConsentRecord[] {
    return this.consentRecords.get(userId) || [];
  }

  // 요청 목록 조회
  getDataRequests(userId?: string): DataSubjectRequest[] {
    const requests = Array.from(this.dataRequests.values());
    if (userId) {
      return requests.filter((r) => r.userId === userId);
    }
    return requests;
  }
}

export const gdprManager = new GDPRComplianceManager();

