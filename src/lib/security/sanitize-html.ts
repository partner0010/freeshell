/**
 * HTML Sanitization 유틸리티
 * 안전한 HTML 생성 및 검증
 */

import { escapeHtml } from './security-hardening';

/**
 * 허용된 HTML 태그 및 속성
 */
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'a', 'img', 'div', 'span', 'blockquote', 'code', 'pre',
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'title', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
  div: ['class'],
  span: ['class'],
  table: ['class', 'border'],
  td: ['class', 'colspan', 'rowspan'],
  th: ['class', 'colspan', 'rowspan'],
};

/**
 * URL 검증
 */
function isValidURL(url: string): boolean {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
    const parsed = new URL(url, origin);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * HTML 태그 sanitize
 */
function sanitizeAttribute(name: string, value: string, tag: string): string {
  // href 속성 검증
  if (name === 'href' && tag === 'a') {
    if (!isValidURL(value)) {
      return '#';
    }
    // 외부 링크에 rel 추가 (sanitizeHTML에서 처리)
    if (value.startsWith('http')) {
      return value;
    }
    return value;
  }

  // src 속성 검증
  if (name === 'src' && tag === 'img') {
    if (!isValidURL(value)) {
      return '';
    }
    return value;
  }

  // 이벤트 핸들러 제거
  if (name.startsWith('on')) {
    return '';
  }

  // javascript: 제거
  if (value.toLowerCase().startsWith('javascript:')) {
    return '';
  }

  return escapeHtml(value);
}

/**
 * HTML sanitize
 */
export function sanitizeHTML(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const walk = (node: Node): void => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      // 허용되지 않은 태그 제거
      if (!ALLOWED_TAGS.includes(tagName)) {
        // 내용은 유지하고 태그만 제거
        const parent = element.parentNode;
        while (element.firstChild) {
          parent?.insertBefore(element.firstChild, element);
        }
        parent?.removeChild(element);
        return;
      }

      // 속성 sanitize
      const allowedAttrs = ALLOWED_ATTRIBUTES[tagName] || [];
      const attributes = Array.from(element.attributes);
      
      attributes.forEach((attr) => {
        if (!allowedAttrs.includes(attr.name)) {
          element.removeAttribute(attr.name);
        } else {
          const sanitized = sanitizeAttribute(attr.name, attr.value, tagName);
          if (sanitized) {
            element.setAttribute(attr.name, sanitized);
          } else {
            element.removeAttribute(attr.name);
          }
        }
      });

      // 외부 링크에 rel 추가
      if (tagName === 'a' && element.getAttribute('href')?.startsWith('http')) {
        const href = element.getAttribute('href');
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        if (href && origin && !href.startsWith(origin)) {
          element.setAttribute('rel', 'noopener noreferrer');
          element.setAttribute('target', '_blank');
        }
      }
    }

    // 자식 노드 재귀 처리
    const children = Array.from(node.childNodes);
    children.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE || child.nodeType === Node.TEXT_NODE) {
        walk(child);
      }
    });
  };

  walk(doc.body);

  return doc.body.innerHTML;
}

/**
 * 안전한 dangerouslySetInnerHTML을 위한 래퍼
 */
export function createSafeHTML(html: string): { __html: string } {
  return {
    __html: sanitizeHTML(html),
  };
}

