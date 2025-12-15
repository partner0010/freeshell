/**
 * 안전한 Fetch 유틸리티
 * Secure Fetch Utilities
 */

import { validateURL } from './input-validation';

/**
 * 안전한 Fetch 옵션
 */
export interface SecureFetchOptions extends RequestInit {
  timeout?: number;
  allowedOrigins?: string[];
  requireHTTPS?: boolean;
}

/**
 * 타임아웃 지원 Fetch
 */
async function fetchWithTimeout(
  url: string,
  options: SecureFetchOptions = {},
  timeout: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

/**
 * 안전한 Fetch
 */
export async function secureFetch(
  url: string,
  options: SecureFetchOptions = {}
): Promise<Response> {
  // URL 검증
  const urlValidation = validateURL(url);
  if (!urlValidation.isValid) {
    throw new Error(`Invalid URL: ${urlValidation.errors.join(', ')}`);
  }

  const parsedUrl = new URL(url);

  // HTTPS 요구사항 확인
  if (options.requireHTTPS !== false && parsedUrl.protocol !== 'https:') {
    throw new Error('Only HTTPS URLs are allowed');
  }

  // 허용된 Origin 확인
  if (options.allowedOrigins && options.allowedOrigins.length > 0) {
    const isAllowed = options.allowedOrigins.some(origin => 
      parsedUrl.origin === origin || parsedUrl.origin.endsWith(origin)
    );
    if (!isAllowed) {
      throw new Error(`Origin '${parsedUrl.origin}' is not allowed`);
    }
  }

  // 기본 보안 헤더 추가
  const secureHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...options.headers,
  };

  // 타임아웃 기본값 (30초)
  const timeout = options.timeout || 30000;

  return fetchWithTimeout(url, {
    ...options,
    headers: secureHeaders,
  }, timeout);
}

/**
 * 안전한 JSON Fetch
 */
export async function secureJSONFetch<T = unknown>(
  url: string,
  options: SecureFetchOptions = {}
): Promise<T> {
  const response = await secureFetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Response is not JSON');
  }

  // JSON 크기 제한 확인
  const contentLength = response.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    throw new Error('Response too large (max 10MB)');
  }

  const text = await response.text();
  
  // JSON 파싱 (검증 포함)
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    throw new Error('Invalid JSON response');
  }
}

