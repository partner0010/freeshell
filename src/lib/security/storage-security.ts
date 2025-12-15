/**
 * 스토리지 보안 유틸리티
 * Secure Storage Utilities (localStorage, sessionStorage)
 */

import { logger } from '../utils/logger';

/**
 * 안전한 localStorage 저장
 */
export function secureSetItem(key: string, value: string): void {
  try {
    // 키 검증 (XSS 방지)
    const sanitizedKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
    if (sanitizedKey !== key) {
      throw new Error('Invalid storage key');
    }

    // 값 검증
    if (typeof value !== 'string') {
      throw new Error('Storage value must be a string');
    }

    // 크기 제한 (10MB)
    if (value.length > 10 * 1024 * 1024) {
      throw new Error('Storage value too large');
    }

    // 민감한 정보 확인 (간단한 체크)
    const sensitivePatterns = [
      /password/i,
      /token/i,
      /secret/i,
      /api[_-]?key/i,
      /private[_-]?key/i,
    ];

    const isSensitive = sensitivePatterns.some(pattern => pattern.test(key));
    if (isSensitive) {
      logger.warn(`Warning: Storing potentially sensitive data in localStorage: ${key}`);
      // 실제로는 암호화 저장 권장
    }

    localStorage.setItem(sanitizedKey, value);
  } catch (error) {
    logger.error('Error storing data in localStorage:', error);
    throw error;
  }
}

/**
 * 안전한 localStorage 조회
 */
export function secureGetItem(key: string): string | null {
  try {
    const sanitizedKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
    return localStorage.getItem(sanitizedKey);
  } catch (error) {
    logger.error('Error reading from localStorage:', error);
    return null;
  }
}

/**
 * 안전한 sessionStorage 저장
 */
export function secureSessionSetItem(key: string, value: string): void {
  try {
    const sanitizedKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
    if (sanitizedKey !== key) {
      throw new Error('Invalid storage key');
    }

    if (typeof value !== 'string') {
      throw new Error('Storage value must be a string');
    }

    if (value.length > 10 * 1024 * 1024) {
      throw new Error('Storage value too large');
    }

    sessionStorage.setItem(sanitizedKey, value);
  } catch (error) {
    logger.error('Error storing data in sessionStorage:', error);
    throw error;
  }
}

/**
 * 안전한 sessionStorage 조회
 */
export function secureSessionGetItem(key: string): string | null {
  try {
    const sanitizedKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
    return sessionStorage.getItem(sanitizedKey);
  } catch (error) {
    logger.error('Error reading from sessionStorage:', error);
    return null;
  }
}

/**
 * 암호화된 스토리지 저장 (간단한 Base64, 실제로는 암호화 라이브러리 사용 권장)
 */
export function secureEncryptedSetItem(key: string, value: string): void {
  try {
    // 실제 환경에서는 crypto-js 같은 라이브러리로 암호화
    const encoded = btoa(unescape(encodeURIComponent(value)));
    secureSetItem(key, encoded);
  } catch (error) {
    logger.error('Error encrypting and storing data:', error);
    throw error;
  }
}

/**
 * 암호화된 스토리지 조회
 */
export function secureEncryptedGetItem(key: string): string | null {
  try {
    const encoded = secureGetItem(key);
    if (!encoded) return null;
    
    // 실제 환경에서는 crypto-js 같은 라이브러리로 복호화
    return decodeURIComponent(escape(atob(encoded)));
  } catch (error) {
    logger.error('Error decrypting and reading data:', error);
    return null;
  }
}

/**
 * 스토리지 데이터 제거
 */
export function secureRemoveItem(key: string): void {
  try {
    const sanitizedKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
    localStorage.removeItem(sanitizedKey);
    sessionStorage.removeItem(sanitizedKey);
  } catch (error) {
    logger.error('Error removing storage item:', error);
  }
}

/**
 * 모든 스토리지 데이터 제거 (로그아웃 등)
 */
export function secureClearStorage(): void {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (error) {
    logger.error('Error clearing storage:', error);
  }
}

