/**
 * 환경 변수 보안
 * Environment Variable Security
 */

/**
 * 안전한 환경 변수 조회
 */
export function getSecureEnv(key: string, defaultValue?: string): string {
  if (typeof window !== 'undefined') {
    // 클라이언트 사이드에서는 환경 변수 접근 제한
    throw new Error(`Environment variable '${key}' cannot be accessed on client side`);
  }

  const value = process.env[key];

  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Required environment variable '${key}' is not set`);
  }

  // 민감한 환경 변수는 마스킹하여 로그에 노출 방지
  const sensitiveKeys = [
    'API_KEY',
    'SECRET',
    'PASSWORD',
    'TOKEN',
    'PRIVATE_KEY',
    'DATABASE_URL',
  ];

  const isSensitive = sensitiveKeys.some(sensitive => 
    key.toUpperCase().includes(sensitive)
  );

  if (isSensitive && process.env.NODE_ENV === 'production') {
    // 프로덕션에서는 민감한 값 로깅 금지
  }

  return value;
}

/**
 * 환경 변수 존재 확인
 */
export function hasEnv(key: string): boolean {
  if (typeof window !== 'undefined') {
    return false;
  }

  return !!process.env[key];
}

/**
 * 안전한 환경 변수 조회 (클라이언트 사이드용)
 * Next.js public 환경 변수만 접근 가능
 */
export function getPublicEnv(key: string, defaultValue?: string): string {
  // Next.js는 NEXT_PUBLIC_ 접두사가 있는 환경 변수만 클라이언트에서 접근 가능
  if (!key.startsWith('NEXT_PUBLIC_')) {
    throw new Error(`Environment variable '${key}' must have NEXT_PUBLIC_ prefix for client-side access`);
  }

  const value = process.env[key];

  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Required environment variable '${key}' is not set`);
  }

  return value;
}

