/**
 * 코드 보호 및 보안 강화 유틸리티
 * 
 * 주의: 완전한 코드 보호는 불가능하지만, 
 * 최소한의 보안 조치를 강화할 수 있습니다.
 */

/**
 * 민감한 정보 마스킹
 */
export function maskSensitiveData(data: string): string {
  if (!data || data.length < 4) return '****';
  return data.slice(0, 2) + '*'.repeat(data.length - 4) + data.slice(-2);
}

/**
 * API 키 검증 (형식만 확인)
 */
export function validateApiKeyFormat(key: string): boolean {
  if (!key || key.length < 10) return false;
  // 기본적인 형식 검증만 수행 (실제 키는 검증하지 않음)
  return /^[a-zA-Z0-9_-]+$/.test(key);
}

/**
 * 클라이언트 사이드에서 민감한 정보 제거
 */
export function sanitizeForClient(data: any): any {
  if (typeof data !== 'object' || data === null) return data;
  
  const sensitiveKeys = ['password', 'secret', 'token', 'apiKey', 'api_key', 'accessToken'];
  const sanitized = { ...data };
  
  for (const key of sensitiveKeys) {
    if (key in sanitized) {
      sanitized[key] = '[REDACTED]';
    }
  }
  
  return sanitized;
}

/**
 * 코드 난독화 헬퍼 (기본적인 문자열 변환)
 * 주의: 완전한 보호는 아니지만, 기본적인 난독화는 가능
 */
export function obfuscateString(str: string): string {
  // Base64 인코딩 (역변환 가능하므로 완전한 보호는 아님)
  return Buffer.from(str).toString('base64');
}

/**
 * 디코딩 (개발용)
 */
export function deobfuscateString(str: string): string {
  try {
    return Buffer.from(str, 'base64').toString('utf-8');
  } catch {
    return str;
  }
}

/**
 * 환경 변수 검증
 */
export function validateEnvironmentVariables(): {
  valid: boolean;
  missing: string[];
  warnings: string[];
} {
  const required = [
    'NEXTAUTH_SECRET',
  ];
  
  const recommended = [
    'OPENAI_API_KEY',
    'HUGGINGFACE_API_KEY',
    'DATABASE_URL',
  ];
  
  const missing: string[] = [];
  const warnings: string[] = [];
  
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  
  for (const key of recommended) {
    if (!process.env[key]) {
      warnings.push(key);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * 서버 사이드 전용 함수 체크
 */
export function assertServerSide(): void {
  if (typeof window !== 'undefined') {
    throw new Error('This function can only be called on the server side');
  }
}

/**
 * 클라이언트 사이드 전용 함수 체크
 */
export function assertClientSide(): void {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on the client side');
  }
}

