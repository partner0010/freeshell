/**
 * GRIP Environment Variable Validator
 * 환경 변수 검증 및 보호
 */

// ============================================
// Types
// ============================================

interface EnvConfig {
  name: string;
  required: boolean;
  sensitive?: boolean;
  pattern?: RegExp;
  minLength?: number;
  defaultValue?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  masked: Record<string, string>;
}

// ============================================
// 환경 변수 설정
// ============================================

const envConfigs: EnvConfig[] = [
  // 앱 설정
  { name: 'NEXT_PUBLIC_APP_NAME', required: false, defaultValue: 'GRIP' },
  { name: 'NEXT_PUBLIC_APP_URL', required: true, pattern: /^https?:\/\// },
  { name: 'NODE_ENV', required: true },
  
  // 데이터베이스
  { name: 'DATABASE_URL', required: false, sensitive: true },
  
  // 인증
  { name: 'JWT_SECRET', required: true, sensitive: true, minLength: 32 },
  { name: 'SESSION_SECRET', required: true, sensitive: true, minLength: 32 },
  
  // 암호화
  { name: 'ENCRYPTION_KEY', required: false, sensitive: true, minLength: 32 },
  
  // API 키
  { name: 'NEXT_PUBLIC_UNSPLASH_ACCESS_KEY', required: false },
  { name: 'UNSPLASH_SECRET_KEY', required: false, sensitive: true },
  { name: 'OPENAI_API_KEY', required: false, sensitive: true, pattern: /^sk-/ },
  
  // 이메일
  { name: 'SMTP_PASSWORD', required: false, sensitive: true },
  
  // AWS
  { name: 'AWS_ACCESS_KEY_ID', required: false, sensitive: true },
  { name: 'AWS_SECRET_ACCESS_KEY', required: false, sensitive: true },
  
  // Stripe
  { name: 'STRIPE_SECRET_KEY', required: false, sensitive: true },
  { name: 'STRIPE_WEBHOOK_SECRET', required: false, sensitive: true },
  
  // 모니터링
  { name: 'SENTRY_DSN', required: false, sensitive: true },
  
  // 관리자
  { name: 'ADMIN_PASSWORD', required: false, sensitive: true, minLength: 12 },
];

// ============================================
// 검증 함수
// ============================================

/**
 * 환경 변수 검증
 */
export function validateEnv(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const masked: Record<string, string> = {};
  
  for (const config of envConfigs) {
    const value = process.env[config.name];
    
    // 필수 변수 검사
    if (config.required && !value) {
      errors.push(`필수 환경 변수 누락: ${config.name}`);
      continue;
    }
    
    // 값이 없으면 기본값 사용
    if (!value) {
      if (config.defaultValue) {
        warnings.push(`${config.name} 기본값 사용: ${config.defaultValue}`);
      }
      continue;
    }
    
    // 패턴 검사
    if (config.pattern && !config.pattern.test(value)) {
      errors.push(`${config.name} 형식이 올바르지 않습니다`);
    }
    
    // 최소 길이 검사
    if (config.minLength && value.length < config.minLength) {
      errors.push(`${config.name}은(는) 최소 ${config.minLength}자 이상이어야 합니다`);
    }
    
    // 민감한 변수 마스킹
    if (config.sensitive && value) {
      masked[config.name] = maskValue(value);
    } else if (value) {
      masked[config.name] = value;
    }
  }
  
  // 추가 보안 검사
  const additionalWarnings = checkSecuritySettings();
  warnings.push(...additionalWarnings);
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    masked,
  };
}

/**
 * 값 마스킹
 */
function maskValue(value: string): string {
  if (value.length <= 8) {
    return '*'.repeat(value.length);
  }
  return value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4);
}

/**
 * 추가 보안 설정 검사
 */
function checkSecuritySettings(): string[] {
  const warnings: string[] = [];
  
  // 프로덕션 환경 검사
  if (process.env.NODE_ENV === 'production') {
    // HTTPS 강제 확인
    if (process.env.NEXT_PUBLIC_APP_URL?.startsWith('http://')) {
      warnings.push('프로덕션에서 HTTPS 사용을 권장합니다');
    }
    
    // 디버그 모드 확인
    if (process.env.DEBUG === 'true') {
      warnings.push('프로덕션에서 DEBUG 모드가 활성화되어 있습니다');
    }
    
    // 기본 비밀번호 확인
    if (process.env.ADMIN_PASSWORD === 'change-this-password-immediately') {
      warnings.push('기본 관리자 비밀번호를 변경하세요');
    }
  }
  
  // JWT 시크릿 강도 검사
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && !/[A-Z].*[a-z].*[0-9]|[a-z].*[A-Z].*[0-9]/.test(jwtSecret)) {
    warnings.push('JWT_SECRET에 대문자, 소문자, 숫자를 포함하세요');
  }
  
  return warnings;
}

// ============================================
// 안전한 환경 변수 접근
// ============================================

/**
 * 환경 변수 안전하게 가져오기
 */
export function getEnv(name: string, defaultValue?: string): string {
  const value = process.env[name];
  
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`환경 변수 ${name}이(가) 설정되지 않았습니다`);
  }
  
  return value;
}

/**
 * 선택적 환경 변수 가져오기
 */
export function getOptionalEnv(name: string): string | undefined {
  return process.env[name];
}

/**
 * 불리언 환경 변수 가져오기
 */
export function getBoolEnv(name: string, defaultValue: boolean = false): boolean {
  const value = process.env[name];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * 숫자 환경 변수 가져오기
 */
export function getNumEnv(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (!value) return defaultValue;
  const num = parseInt(value, 10);
  return isNaN(num) ? defaultValue : num;
}

// ============================================
// 초기화
// ============================================

/**
 * 환경 변수 초기화 및 검증
 */
export function initializeEnv(): void {
  const result = validateEnv();
  
  if (!result.valid) {
    console.error('\n❌ 환경 변수 오류:');
    result.errors.forEach((err) => console.error(`  - ${err}`));
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error('환경 변수 검증 실패');
    }
  }
  
  if (result.warnings.length > 0) {
    console.warn('\n⚠️ 환경 변수 경고:');
    result.warnings.forEach((warn) => console.warn(`  - ${warn}`));
  }
  
  if (result.valid) {
    console.log('\n✅ 환경 변수 검증 완료');
  }
}

// ============================================
// Export
// ============================================

export const EnvValidator = {
  validateEnv,
  getEnv,
  getOptionalEnv,
  getBoolEnv,
  getNumEnv,
  initializeEnv,
};

export default EnvValidator;

