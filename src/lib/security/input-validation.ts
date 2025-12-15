/**
 * 입력 검증 유틸리티
 * Input Validation Utilities
 */

import { sanitizeInput, escapeHtml } from './security-hardening';

/**
 * 입력 검증 결과
 */
export interface ValidationResult {
  isValid: boolean;
  sanitized?: string;
  errors: string[];
}

/**
 * 문자열 입력 검증
 */
export function validateStringInput(
  input: unknown,
  options: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    required?: boolean;
    sanitize?: boolean;
  } = {}
): ValidationResult {
  const errors: string[] = [];

  // 타입 검증
  if (input === null || input === undefined) {
    if (options.required) {
      errors.push('입력값이 필요합니다');
    }
    return { isValid: !options.required, errors };
  }

  if (typeof input !== 'string') {
    errors.push('문자열 형식이 아닙니다');
    return { isValid: false, errors };
  }

  let sanitized = input;

  // 길이 검증
  if (options.minLength !== undefined && sanitized.length < options.minLength) {
    errors.push(`최소 ${options.minLength}자 이상 입력해주세요`);
  }

  if (options.maxLength !== undefined && sanitized.length > options.maxLength) {
    errors.push(`최대 ${options.maxLength}자까지 입력 가능합니다`);
    sanitized = sanitized.substring(0, options.maxLength);
  }

  // 패턴 검증
  if (options.pattern && !options.pattern.test(sanitized)) {
    errors.push('입력 형식이 올바르지 않습니다');
  }

  // Sanitization
  if (options.sanitize !== false) {
    sanitized = sanitizeInput(sanitized);
  }

  return {
    isValid: errors.length === 0,
    sanitized,
    errors,
  };
}

/**
 * 이메일 검증
 */
export function validateEmail(email: unknown): ValidationResult {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return validateStringInput(email, {
    required: true,
    maxLength: 255,
    pattern: emailPattern,
    sanitize: true,
  });
}

/**
 * URL 검증
 */
export function validateURL(url: unknown): ValidationResult {
  try {
    if (typeof url !== 'string') {
      return { isValid: false, errors: ['URL 형식이 아닙니다'] };
    }

    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { isValid: false, errors: ['HTTP 또는 HTTPS 프로토콜만 허용됩니다'] };
    }

    return { isValid: true, sanitized: url, errors: [] };
  } catch {
    return { isValid: false, errors: ['유효한 URL 형식이 아닙니다'] };
  }
}

/**
 * 숫자 입력 검증
 */
export function validateNumberInput(
  input: unknown,
  options: {
    min?: number;
    max?: number;
    integer?: boolean;
    required?: boolean;
  } = {}
): ValidationResult {
  const errors: string[] = [];

  if (input === null || input === undefined) {
    if (options.required) {
      errors.push('숫자가 필요합니다');
    }
    return { isValid: !options.required, errors };
  }

  const num = typeof input === 'string' ? parseFloat(input) : Number(input);

  if (isNaN(num)) {
    errors.push('유효한 숫자가 아닙니다');
    return { isValid: false, errors };
  }

  if (options.integer && !Number.isInteger(num)) {
    errors.push('정수여야 합니다');
  }

  if (options.min !== undefined && num < options.min) {
    errors.push(`최소값은 ${options.min}입니다`);
  }

  if (options.max !== undefined && num > options.max) {
    errors.push(`최대값은 ${options.max}입니다`);
  }

  return {
    isValid: errors.length === 0,
    sanitized: num.toString(),
    errors,
  };
}

/**
 * 파일 검증
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number; // bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): ValidationResult {
  const errors: string[] = [];

  // 파일 크기 검증
  if (options.maxSize && file.size > options.maxSize) {
    const maxSizeMB = (options.maxSize / (1024 * 1024)).toFixed(2);
    errors.push(`파일 크기는 최대 ${maxSizeMB}MB까지 허용됩니다`);
  }

  // MIME 타입 검증
  if (options.allowedTypes && options.allowedTypes.length > 0) {
    if (!options.allowedTypes.includes(file.type)) {
      errors.push(`허용된 파일 타입: ${options.allowedTypes.join(', ')}`);
    }
  }

  // 확장자 검증
  if (options.allowedExtensions && options.allowedExtensions.length > 0) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !options.allowedExtensions.includes(extension)) {
      errors.push(`허용된 확장자: ${options.allowedExtensions.join(', ')}`);
    }
  }

  // 파일명 검증 (XSS 방지)
  const fileNameValidation = validateStringInput(file.name, {
    maxLength: 255,
    sanitize: true,
  });
  if (!fileNameValidation.isValid) {
    errors.push(...fileNameValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * JSON 입력 검증 및 파싱
 */
export function validateAndParseJSON(
  input: string,
  options: {
    maxDepth?: number;
    maxKeys?: number;
  } = {}
): ValidationResult & { parsed?: unknown } {
  const errors: string[] = [];

  try {
    // JSON 크기 제한 (10MB)
    if (input.length > 10 * 1024 * 1024) {
      errors.push('JSON 크기가 너무 큽니다 (최대 10MB)');
      return { isValid: false, errors };
    }

    const parsed = JSON.parse(input);

    // 깊이 검증
    if (options.maxDepth) {
      const depth = getObjectDepth(parsed);
      if (depth > options.maxDepth) {
        errors.push(`JSON 깊이가 너무 깊습니다 (최대 ${options.maxDepth}단계)`);
      }
    }

    // 키 개수 검증
    if (options.maxKeys) {
      const keyCount = countObjectKeys(parsed);
      if (keyCount > options.maxKeys) {
        errors.push(`키 개수가 너무 많습니다 (최대 ${options.maxKeys}개)`);
      }
    }

    return {
      isValid: errors.length === 0,
      parsed,
      errors,
    };
  } catch (error) {
    errors.push('유효한 JSON 형식이 아닙니다');
    return { isValid: false, errors };
  }
}

/**
 * 객체 깊이 계산
 */
function getObjectDepth(obj: unknown, current = 0): number {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return current;
  }

  let maxDepth = current;
  for (const value of Object.values(obj)) {
    const depth = getObjectDepth(value, current + 1);
    maxDepth = Math.max(maxDepth, depth);
  }

  return maxDepth;
}

/**
 * 객체 키 개수 계산
 */
function countObjectKeys(obj: unknown): number {
  if (typeof obj !== 'object' || obj === null) {
    return 0;
  }

  if (Array.isArray(obj)) {
    return obj.reduce((sum, item) => sum + countObjectKeys(item), 0);
  }

  let count = Object.keys(obj).length;
  for (const value of Object.values(obj)) {
    count += countObjectKeys(value);
  }

  return count;
}

/**
 * SQL Injection 방어
 */
export function sanitizeSQLInput(input: string): string {
  return input
    .replace(/'/g, "''") // SQL 이스케이프
    .replace(/;/g, '') // 세미콜론 제거
    .replace(/--/g, '') // 주석 제거
    .replace(/\/\*/g, '') // 블록 주석 시작 제거
    .replace(/\*\//g, ''); // 블록 주석 끝 제거
}

/**
 * Command Injection 방어
 */
export function sanitizeCommandInput(input: string): string {
  return input
    .replace(/[;&|`$(){}[\]<>]/g, '') // 명령어 구분자 제거
    .replace(/\n/g, '') // 개행 제거
    .replace(/\r/g, ''); // 캐리지 리턴 제거
}

