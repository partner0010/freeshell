/**
 * 라이선스 및 법적 검토 시스템
 * 오픈소스 라이선스 호환성 및 특허 이슈 체크
 */

export interface LicenseInfo {
  name: string;
  version: string;
  license: string;
  licenseType: 'MIT' | 'Apache-2.0' | 'GPL' | 'BSD' | 'LGPL' | 'Proprietary' | 'Other';
  copyright?: string;
  homepage?: string;
  repository?: string;
  patentRisks?: string[];
  commercialUse: boolean;
  modification: boolean;
  distribution: boolean;
  privateUse: boolean;
  liability: string;
  warranty: string;
}

export interface PatentCheck {
  feature: string;
  riskLevel: 'none' | 'low' | 'medium' | 'high';
  description: string;
  recommendations: string[];
  relatedPatents?: string[];
}

// 주요 오픈소스 라이선스 정보
export const commonLicenses: LicenseInfo[] = [
  {
    name: 'React',
    version: '^18.0.0',
    license: 'MIT',
    licenseType: 'MIT',
    commercialUse: true,
    modification: true,
    distribution: true,
    privateUse: true,
    liability: 'No liability',
    warranty: 'No warranty',
  },
  {
    name: 'Next.js',
    version: '^14.0.0',
    license: 'MIT',
    licenseType: 'MIT',
    commercialUse: true,
    modification: true,
    distribution: true,
    privateUse: true,
    liability: 'No liability',
    warranty: 'No warranty',
  },
  {
    name: 'Framer Motion',
    version: '^10.0.0',
    license: 'MIT',
    licenseType: 'MIT',
    commercialUse: true,
    modification: true,
    distribution: true,
    privateUse: true,
    liability: 'No liability',
    warranty: 'No warranty',
  },
];

// 특허 위험 체크
export const patentRisks: PatentCheck[] = [
  {
    feature: 'Drag and Drop Interface',
    riskLevel: 'low',
    description: '일반적인 드래그 앤 드롭 기능은 특허 보호를 받지 않습니다.',
    recommendations: [
      '표준 HTML5 Drag and Drop API 사용',
      '기존 라이브러리 활용 (MIT/Apache 라이선스)',
    ],
  },
  {
    feature: 'AI Code Generation',
    riskLevel: 'medium',
    description: 'AI 코드 생성 기능은 일부 특허가 있을 수 있습니다.',
    recommendations: [
      '오픈소스 AI 모델 사용 (GPT, Llama 등)',
      '자체 학습 모델 개발 시 특허 검색 필수',
      '법률 전문가 상담 권장',
    ],
  },
  {
    feature: 'Voice Recognition',
    riskLevel: 'low',
    description: 'Web Speech API는 브라우저 표준입니다.',
    recommendations: [
      'Web Speech API 활용 (표준)',
      '서드파티 라이브러리는 라이선스 확인',
    ],
  },
  {
    feature: 'Electronic Signature',
    riskLevel: 'medium',
    description: '전자서명 기술에는 특허가 있을 수 있습니다.',
    recommendations: [
      '국제 표준 알고리즘 사용 (PKI, RSA)',
      '특허 검색 후 구현 방식 결정',
      '특허 무효화 선례 확인',
    ],
  },
  {
    feature: 'Blockchain Integration',
    riskLevel: 'low',
    description: '블록체인 기술 자체는 오픈소스입니다.',
    recommendations: [
      '이더리움, IPFS 등 오픈소스 프로토콜 사용',
      '특정 구현 방식의 특허 확인',
    ],
  },
];

// 라이선스 호환성 체크
export function checkLicenseCompatibility(licenses: string[]): {
  compatible: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // GPL과 상용 라이선스 충돌 체크
  if (licenses.includes('GPL') && licenses.some((l) => !['MIT', 'Apache-2.0', 'BSD', 'LGPL'].includes(l))) {
    issues.push('GPL 라이선스는 상용 라이선스와 호환되지 않을 수 있습니다.');
    recommendations.push('LGPL 라이선스로 변경 고려 또는 GPL 의존성 제거');
  }

  // 모든 라이선스가 상업적 사용 허용하는지 체크
  const commercialUseAllowed = ['MIT', 'Apache-2.0', 'BSD', 'ISC'].every((l) =>
    licenses.includes(l)
  );
  if (!commercialUseAllowed) {
    issues.push('일부 라이선스는 상업적 사용에 제한이 있을 수 있습니다.');
    recommendations.push('라이선스 약관을 자세히 검토하세요');
  }

  return {
    compatible: issues.length === 0,
    issues,
    recommendations,
  };
}

// 종합 법적 검토 리포트 생성
export function generateLegalAuditReport(): {
  licenses: LicenseInfo[];
  patentChecks: PatentCheck[];
  compatibility: ReturnType<typeof checkLicenseCompatibility>;
  recommendations: string[];
} {
  const allLicenses = commonLicenses.map((l) => l.license);
  const compatibility = checkLicenseCompatibility(allLicenses);

  const recommendations = [
    '모든 오픈소스 의존성의 라이선스를 명시하세요',
    'THIRD_PARTY_LICENSES.md 파일에 모든 라이선스 정보를 기록하세요',
    '상업적 배포 전 법률 전문가 검토를 권장합니다',
    '특허 검색을 정기적으로 수행하세요',
    '라이선스 위반 시 법적 책임이 발생할 수 있으므로 주의하세요',
  ];

  return {
    licenses: commonLicenses,
    patentChecks: patentRisks,
    compatibility,
    recommendations,
  };
}

// 라이선스 파일 생성 헬퍼
export function generateLicenseFile(projectName: string, copyrightYear: string): string {
  return `
${projectName}
Copyright (c) ${copyrightYear}

이 프로젝트는 다음 오픈소스 라이선스를 사용합니다:

MIT License:
- React
- Next.js
- Framer Motion
- 기타 MIT 라이선스 패키지

Apache License 2.0:
- 기타 Apache 라이선스 패키지

각 패키지의 라이선스는 node_modules 폴더의 해당 패키지 디렉토리에서 확인할 수 있습니다.

THIRD_PARTY_LICENSES.md 파일에서 모든 오픈소스 의존성의 라이선스를 확인하실 수 있습니다.
  `.trim();
}

