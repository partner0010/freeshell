/**
 * 관리자 페이지 기능 옵션 확장
 * 온라인 조사 기반 다양한 옵션 제공
 */

export interface AdminFeatureOption {
  id: string;
  feature: string;
  category: 'security' | 'monitoring' | 'analytics' | 'automation' | 'user-management';
  option: string;
  description: string;
  value: any;
  type: 'toggle' | 'select' | 'number' | 'text' | 'date' | 'time';
  options?: Array<{ label: string; value: any }>;
  min?: number;
  max?: number;
  enabled: boolean;
  source: string;
}

export class AdminOptionsEnhancer {
  private options: AdminFeatureOption[] = [];

  constructor() {
    this.initializeOptions();
  }

  /**
   * 옵션 초기화 (온라인 조사 기반)
   */
  private initializeOptions(): void {
    this.options = [
      // 보안 관련 옵션
      {
        id: 'security-1',
        feature: '보안 보고서',
        category: 'security',
        option: '보고서 생성 주기',
        description: '보안 보고서를 생성하는 주기',
        value: 'daily',
        type: 'select',
        options: [
          { label: '매시간', value: 'hourly' },
          { label: '매일', value: 'daily' },
          { label: '매주', value: 'weekly' },
          { label: '매월', value: 'monthly' },
        ],
        enabled: true,
        source: '일반적인 모니터링 트렌드',
      },
      {
        id: 'security-2',
        feature: '보안 보고서',
        category: 'security',
        option: '자동 이메일 알림',
        description: '보고서 생성 시 관리자에게 이메일로 알림',
        value: true,
        type: 'toggle',
        enabled: true,
        source: '업계 표준',
      },
      {
        id: 'security-3',
        feature: '보안 보고서',
        category: 'security',
        option: '위협 심각도 필터',
        description: '보고서에 포함할 최소 위협 심각도',
        value: 'medium',
        type: 'select',
        options: [
          { label: '모든 위협', value: 'low' },
          { label: 'Medium 이상', value: 'medium' },
          { label: 'High 이상', value: 'high' },
          { label: 'Critical만', value: 'critical' },
        ],
        enabled: true,
        source: '보안 모니터링 베스트 프랙티스',
      },
      
      // 모니터링 관련 옵션
      {
        id: 'monitoring-1',
        feature: '시스템 모니터링',
        category: 'monitoring',
        option: '실시간 업데이트 주기',
        description: '모니터링 데이터를 업데이트하는 주기 (초)',
        value: 5,
        type: 'number',
        min: 1,
        max: 60,
        enabled: true,
        source: '실시간 모니터링 트렌드',
      },
      {
        id: 'monitoring-2',
        feature: '시스템 모니터링',
        category: 'monitoring',
        option: '알림 임계값',
        description: '알림을 보낼 CPU 사용률 임계값 (%)',
        value: 80,
        type: 'number',
        min: 50,
        max: 100,
        enabled: true,
        source: '클라우드 모니터링 표준',
      },
      
      // 분석 관련 옵션
      {
        id: 'analytics-1',
        feature: '분석',
        category: 'analytics',
        option: '데이터 보관 기간',
        description: '분석 데이터를 보관하는 기간 (일)',
        value: 90,
        type: 'number',
        min: 7,
        max: 365,
        enabled: true,
        source: '데이터 분석 베스트 프랙티스',
      },
      {
        id: 'analytics-2',
        feature: '분석',
        category: 'analytics',
        option: '자동 리포트 생성',
        description: '주기적으로 리포트를 자동 생성',
        value: true,
        type: 'toggle',
        enabled: true,
        source: '비즈니스 인텔리전스 트렌드',
      },
      
      // 자동화 관련 옵션
      {
        id: 'automation-1',
        feature: 'AI 학습 제안',
        category: 'automation',
        option: '학습 주기',
        description: '최신 기술을 학습하는 주기',
        value: 'weekly',
        type: 'select',
        options: [
          { label: '매일', value: 'daily' },
          { label: '매주', value: 'weekly' },
          { label: '매월', value: 'monthly' },
        ],
        enabled: true,
        source: 'AI 자동화 트렌드',
      },
      {
        id: 'automation-2',
        feature: 'AI 학습 제안',
        category: 'automation',
        option: '자동 적용',
        description: '낮은 우선순위 제안을 자동으로 적용',
        value: false,
        type: 'toggle',
        enabled: true,
        source: '자동화 베스트 프랙티스',
      },
      
      // 사용자 관리 관련 옵션
      {
        id: 'user-1',
        feature: '사용자 관리',
        category: 'user-management',
        option: '자동 승인',
        description: '신규 사용자를 자동으로 승인',
        value: false,
        type: 'toggle',
        enabled: true,
        source: '사용자 온보딩 트렌드',
      },
      {
        id: 'user-2',
        feature: '사용자 관리',
        category: 'user-management',
        option: '이메일 인증 필수',
        description: '회원가입 시 이메일 인증 필수',
        value: true,
        type: 'toggle',
        enabled: true,
        source: '보안 베스트 프랙티스',
      },
    ];
  }

  /**
   * 기능별 옵션 조회
   */
  getOptionsByFeature(feature: string): AdminFeatureOption[] {
    return this.options.filter(o => o.feature === feature && o.enabled);
  }

  /**
   * 카테고리별 옵션 조회
   */
  getOptionsByCategory(category: AdminFeatureOption['category']): AdminFeatureOption[] {
    return this.options.filter(o => o.category === category && o.enabled);
  }

  /**
   * 모든 옵션 조회
   */
  getAllOptions(): AdminFeatureOption[] {
    return this.options.filter(o => o.enabled);
  }

  /**
   * 옵션 업데이트
   */
  updateOption(id: string, value: any): boolean {
    const option = this.options.find(o => o.id === id);
    if (!option) return false;
    
    option.value = value;
    return true;
  }
}

export const adminOptionsEnhancer = new AdminOptionsEnhancer();

