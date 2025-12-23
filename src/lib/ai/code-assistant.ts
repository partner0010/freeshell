/**
 * 코드 어시스턴트 - Cursor 스타일 개발 언어 지원
 * 다양한 프로그래밍 언어 감지 및 특화 답변
 */

export interface CodeContext {
  language?: string;
  framework?: string;
  task?: string;
  code?: string;
  error?: string;
}

export interface CodeResponse {
  code?: string;
  explanation?: string;
  language?: string;
  suggestions?: string[];
  relatedConcepts?: string[];
}

// 지원하는 프로그래밍 언어 목록
export const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust',
  'php', 'ruby', 'swift', 'kotlin', 'dart', 'html', 'css', 'scss', 'sql',
  'bash', 'shell', 'powershell', 'json', 'yaml', 'xml', 'markdown',
  'react', 'vue', 'angular', 'nextjs', 'nodejs', 'express', 'nestjs',
  'django', 'flask', 'fastapi', 'spring', 'laravel', 'rails'
];

// 프레임워크 및 라이브러리
export const FRAMEWORKS = {
  frontend: ['react', 'vue', 'angular', 'nextjs', 'nuxt', 'svelte', 'remix'],
  backend: ['express', 'nestjs', 'fastapi', 'django', 'flask', 'spring', 'laravel', 'rails'],
  mobile: ['react-native', 'flutter', 'swift', 'kotlin'],
  database: ['prisma', 'sequelize', 'typeorm', 'mongoose', 'sqlalchemy'],
  testing: ['jest', 'vitest', 'cypress', 'playwright', 'pytest'],
  styling: ['tailwind', 'styled-components', 'emotion', 'sass', 'less'],
};

/**
 * 메시지에서 프로그래밍 언어 감지
 */
export function detectLanguage(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  // 언어별 키워드 매칭
  const languageKeywords: Record<string, string[]> = {
    javascript: ['javascript', 'js', 'node', 'nodejs', 'es6', 'esnext'],
    typescript: ['typescript', 'ts', 'tsx'],
    python: ['python', 'py', 'django', 'flask', 'fastapi'],
    react: ['react', 'jsx', 'reactjs', 'hooks', 'component'],
    nextjs: ['nextjs', 'next.js', 'next', 'vercel'],
    vue: ['vue', 'vuejs', 'nuxt', 'nuxtjs'],
    angular: ['angular', 'angularjs'],
    nodejs: ['node', 'nodejs', 'express', 'nestjs'],
    java: ['java', 'spring', 'springboot'],
    csharp: ['c#', 'csharp', '.net', 'dotnet', 'asp.net'],
    go: ['go', 'golang'],
    rust: ['rust', 'rustlang'],
    php: ['php', 'laravel', 'symfony'],
    ruby: ['ruby', 'rails', 'rubyonrails'],
    swift: ['swift', 'ios', 'swiftui'],
    kotlin: ['kotlin', 'android'],
    dart: ['dart', 'flutter'],
    html: ['html', 'html5'],
    css: ['css', 'css3', 'scss', 'sass', 'less', 'tailwind'],
    sql: ['sql', 'mysql', 'postgresql', 'mongodb'],
  };

  for (const [lang, keywords] of Object.entries(languageKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return lang;
    }
  }

  return null;
}

/**
 * 코드 생성 프롬프트 생성
 */
export function generateCodePrompt(message: string, context?: CodeContext): string {
  const language = context?.language || detectLanguage(message) || 'javascript';
  const framework = context?.framework;
  
  let prompt = `다음 요청에 대해 ${language}로 코드를 작성해주세요:\n\n`;
  
  if (framework) {
    prompt += `프레임워크: ${framework}\n`;
  }
  
  if (context?.error) {
    prompt += `에러 메시지: ${context.error}\n`;
    prompt += `이 에러를 해결하는 코드를 작성해주세요.\n\n`;
  }
  
  if (context?.code) {
    prompt += `기존 코드:\n\`\`\`${language}\n${context.code}\n\`\`\`\n\n`;
  }
  
  prompt += `요청: ${message}\n\n`;
  prompt += `다음 형식으로 답변해주세요:\n`;
  prompt += `1. 완전한 코드 예제\n`;
  prompt += `2. 코드 설명\n`;
  prompt += `3. 주요 개념 설명\n`;
  prompt += `4. 추가 개선 사항 제안`;
  
  return prompt;
}

/**
 * 코드 설명 프롬프트 생성
 */
export function generateExplanationPrompt(code: string, language: string): string {
  return `다음 ${language} 코드를 자세히 설명해주세요:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n다음 항목을 포함해주세요:\n1. 코드의 전체적인 목적\n2. 각 부분의 역할\n3. 사용된 주요 개념\n4. 실행 흐름\n5. 개선 가능한 부분`;
}

/**
 * 디버깅 프롬프트 생성
 */
export function generateDebuggingPrompt(error: string, code: string, language: string): string {
  return `다음 ${language} 코드에서 발생한 에러를 해결해주세요:\n\n에러 메시지:\n${error}\n\n코드:\n\`\`\`${language}\n${code}\n\`\`\`\n\n다음 항목을 포함해주세요:\n1. 에러 원인 분석\n2. 해결 방법\n3. 수정된 코드\n4. 예방 방법`;
}

/**
 * 최신 기술 트렌드 반영
 */
export function getLatestTrends(language: string): string[] {
  const trends: Record<string, string[]> = {
    javascript: [
      'ES2024 최신 기능 활용',
      'TypeScript로 타입 안정성 확보',
      'React Server Components',
      'Next.js 14 App Router',
      'Vite 빌드 도구',
    ],
    typescript: [
      'TypeScript 5.x 최신 기능',
      '타입 안전성 강화',
      '제네릭 활용',
      '유니온 타입과 인터섹션 타입',
    ],
    react: [
      'React 19 최신 기능',
      'Server Components',
      'Suspense와 Streaming',
      'useTransition, useDeferredValue',
      'React Compiler',
    ],
    nextjs: [
      'Next.js 14 App Router',
      'Server Actions',
      'Route Handlers',
      'Metadata API',
      'Image Optimization',
    ],
    python: [
      'Python 3.12 최신 기능',
      '타입 힌팅',
      '비동기 프로그래밍 (asyncio)',
      'FastAPI 고성능 API',
      'Pydantic 데이터 검증',
    ],
  };

  return trends[language] || [];
}

/**
 * 코드 리뷰 프롬프트 생성
 */
export function generateCodeReviewPrompt(code: string, language: string): string {
  return `다음 ${language} 코드를 리뷰해주세요:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n다음 관점에서 평가해주세요:\n1. 코드 품질 (가독성, 유지보수성)\n2. 성능 최적화\n3. 보안 이슈\n4. 베스트 프랙티스 준수 여부\n5. 개선 제안`;
}

/**
 * 테스트 코드 생성 프롬프트
 */
export function generateTestPrompt(code: string, language: string, framework?: string): string {
  const testFramework = framework || (language === 'javascript' || language === 'typescript' ? 'jest' : 'pytest');
  
  return `다음 ${language} 코드에 대한 테스트 코드를 ${testFramework}로 작성해주세요:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n다음 항목을 포함해주세요:\n1. 단위 테스트\n2. 통합 테스트\n3. 엣지 케이스 테스트\n4. 테스트 커버리지 고려`;
}

