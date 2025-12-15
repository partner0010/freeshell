/**
 * API 보안 유틸리티
 * API Security Utilities
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateStringInput, validateNumberInput, validateFile, validateAndParseJSON } from './input-validation';

/**
 * API 요청 검증 결과
 */
export interface APIValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: Record<string, unknown>;
}

/**
 * API 요청 본문 검증
 */
export async function validateAPIRequest(
  request: NextRequest,
  schema: {
    body?: Record<string, {
      type: 'string' | 'number' | 'boolean' | 'object' | 'file';
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      min?: number;
      max?: number;
    }>;
    query?: Record<string, {
      type: 'string' | 'number' | 'boolean';
      required?: boolean;
      pattern?: RegExp;
    }>;
  }
): Promise<APIValidationResult> {
  const errors: string[] = [];
  const sanitized: Record<string, unknown> = {};

  try {
    // Query 파라미터 검증
    if (schema.query) {
      const searchParams = request.nextUrl.searchParams;
      for (const [key, rules] of Object.entries(schema.query)) {
        const value = searchParams.get(key);

        if (rules.required && !value) {
          errors.push(`Query parameter '${key}' is required`);
          continue;
        }

        if (value) {
          if (rules.type === 'string') {
            const result = validateStringInput(value, {
              pattern: rules.pattern,
              sanitize: true,
            });
            if (!result.isValid) {
              errors.push(...result.errors.map(e => `${key}: ${e}`));
            } else {
              sanitized[key] = result.sanitized;
            }
          } else if (rules.type === 'number') {
            const result = validateNumberInput(value);
            if (!result.isValid) {
              errors.push(...result.errors.map(e => `${key}: ${e}`));
            } else {
              sanitized[key] = parseFloat(result.sanitized || value);
            }
          } else if (rules.type === 'boolean') {
            sanitized[key] = value === 'true';
          }
        }
      }
    }

    // Body 검증
    if (schema.body && request.method !== 'GET') {
      const contentType = request.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const body = await request.json();
        
        for (const [key, rules] of Object.entries(schema.body)) {
          const value = body[key];

          if (rules.required && (value === undefined || value === null)) {
            errors.push(`Body parameter '${key}' is required`);
            continue;
          }

          if (value !== undefined && value !== null) {
            if (rules.type === 'string') {
              const result = validateStringInput(value, {
                minLength: rules.minLength,
                maxLength: rules.maxLength,
                pattern: rules.pattern,
                sanitize: true,
              });
              if (!result.isValid) {
                errors.push(...result.errors.map(e => `${key}: ${e}`));
              } else {
                sanitized[key] = result.sanitized;
              }
            } else if (rules.type === 'number') {
              const result = validateNumberInput(value, {
                min: rules.min,
                max: rules.max,
              });
              if (!result.isValid) {
                errors.push(...result.errors.map(e => `${key}: ${e}`));
              } else {
                sanitized[key] = parseFloat(result.sanitized || String(value));
              }
            } else if (rules.type === 'boolean') {
              sanitized[key] = Boolean(value);
            } else if (rules.type === 'object') {
              // 객체는 재귀적으로 검증 (간단한 버전)
              if (typeof value === 'object' && !Array.isArray(value)) {
                sanitized[key] = value;
              } else {
                errors.push(`${key} must be an object`);
              }
            }
          }
        }
      } else if (contentType.includes('multipart/form-data')) {
        // FormData 처리 (파일 포함)
        const formData = await request.formData();
        
        for (const [key, rules] of Object.entries(schema.body)) {
          const value = formData.get(key);

          if (rules.required && !value) {
            errors.push(`Form field '${key}' is required`);
            continue;
          }

          if (value) {
            if (rules.type === 'file' && value instanceof File) {
              const result = validateFile(value, {
                maxSize: 10 * 1024 * 1024, // 10MB
              });
              if (!result.isValid) {
                errors.push(...result.errors.map(e => `${key}: ${e}`));
              } else {
                sanitized[key] = value;
              }
            } else if (rules.type === 'string') {
              const result = validateStringInput(value.toString(), {
                minLength: rules.minLength,
                maxLength: rules.maxLength,
                pattern: rules.pattern,
                sanitize: true,
              });
              if (!result.isValid) {
                errors.push(...result.errors.map(e => `${key}: ${e}`));
              } else {
                sanitized[key] = result.sanitized;
              }
            }
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized: Object.keys(sanitized).length > 0 ? sanitized : undefined,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [`Request validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
}

/**
 * API 응답에 보안 헤더 추가
 */
export function addAPISecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // CORS 정책 (필요시 조정)
  if (!response.headers.has('Access-Control-Allow-Origin')) {
    response.headers.set('Access-Control-Allow-Origin', '*'); // 실제 환경에서는 특정 도메인으로 제한
  }
  
  return response;
}

/**
 * API 에러 응답 생성
 */
export function createAPIErrorResponse(
  message: string,
  status: number = 400,
  errors?: string[]
): NextResponse {
  const response = NextResponse.json(
    {
      success: false,
      error: message,
      errors: errors || [],
      timestamp: new Date().toISOString(),
    },
    { status }
  );

  return addAPISecurityHeaders(response);
}

/**
 * API 성공 응답 생성
 */
export function createAPISuccessResponse(
  data: unknown,
  status: number = 200
): NextResponse {
  const response = NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );

  return addAPISecurityHeaders(response);
}

