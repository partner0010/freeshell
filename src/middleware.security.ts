/**
 * 보안 헤더 미들웨어
 * Security Headers Middleware
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getNextJSecurityHeaders } from '@/lib/security/security-headers';

/**
 * 보안 헤더를 추가한 응답 생성
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  const headers = getNextJSecurityHeaders();
  
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * 보안 미들웨어 함수
 * Next.js middleware에서 사용
 */
export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

