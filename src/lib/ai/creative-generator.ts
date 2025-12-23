/**
 * 나노바나나 스타일 창의적 콘텐츠 생성기
 * 독특하고 창의적인 아이디어, 콘텐츠, 코드 생성
 */

export interface CreativePrompt {
  type: 'idea' | 'code' | 'content' | 'design' | 'story';
  topic: string;
  style?: 'funny' | 'serious' | 'creative' | 'minimal' | 'elaborate';
  constraints?: string[];
}

export interface CreativeOutput {
  title: string;
  content: string;
  ideas: string[];
  variations: string[];
  tags: string[];
}

/**
 * 창의적인 아이디어 생성
 */
export function generateCreativeIdeas(prompt: CreativePrompt): CreativeOutput {
  const { type, topic, style = 'creative' } = prompt;

  const ideas: string[] = [];
  const variations: string[] = [];
  const tags: string[] = [];

  switch (type) {
    case 'idea':
      ideas.push(...generateIdeas(topic, style));
      break;
    case 'code':
      ideas.push(...generateCodeIdeas(topic, style));
      break;
    case 'content':
      ideas.push(...generateContentIdeas(topic, style));
      break;
    case 'design':
      ideas.push(...generateDesignIdeas(topic, style));
      break;
    case 'story':
      ideas.push(...generateStoryIdeas(topic, style));
      break;
  }

  // 변형 아이디어 생성
  variations.push(...generateVariations(ideas));

  // 태그 생성
  tags.push(...generateTags(topic, type));

  return {
    title: `${topic}에 대한 창의적인 ${type} 아이디어`,
    content: ideas.join('\n\n'),
    ideas,
    variations,
    tags,
  };
}

/**
 * 일반 아이디어 생성
 */
function generateIdeas(topic: string, style: string): string[] {
  const ideas: string[] = [];

  if (style === 'funny') {
    ideas.push(
      `🤪 ${topic}를 완전히 뒤집어보기 - 역발상 아이디어`,
      `🎭 ${topic}를 게임처럼 만들기 - 재미있는 인터랙션`,
      `🎪 ${topic}를 서커스처럼 화려하게 - 과장된 표현`,
    );
  } else if (style === 'creative') {
    ideas.push(
      `✨ ${topic}를 3D 인터랙티브로 만들기`,
      `🎨 ${topic}를 아트 갤러리처럼 디자인하기`,
      `🌟 ${topic}를 우주 테마로 꾸미기`,
      `🎵 ${topic}에 음악과 애니메이션 추가하기`,
    );
  } else {
    ideas.push(
      `💡 ${topic}를 모던하고 미니멀하게`,
      `🚀 ${topic}를 빠르고 효율적으로`,
      `📱 ${topic}를 모바일 퍼스트로`,
    );
  }

  return ideas;
}

/**
 * 코드 아이디어 생성
 */
function generateCodeIdeas(topic: string, style: string): string[] {
  const ideas: string[] = [];

  ideas.push(
    `💻 ${topic}를 함수형 프로그래밍으로 구현`,
    `⚡ ${topic}를 비동기 처리로 최적화`,
    `🎯 ${topic}를 타입 안전하게 TypeScript로 작성`,
    `🔧 ${topic}를 모듈화하여 재사용 가능하게`,
    `🎨 ${topic}를 애니메이션과 인터랙션으로 풍부하게`,
  );

  if (style === 'creative') {
    ideas.push(
      `✨ ${topic}를 WebGL로 3D 시각화`,
      `🎵 ${topic}에 Web Audio API로 사운드 추가`,
      `🌈 ${topic}를 파티클 효과로 화려하게`,
    );
  }

  return ideas;
}

/**
 * 콘텐츠 아이디어 생성
 */
function generateContentIdeas(topic: string, style: string): string[] {
  const ideas: string[] = [];

  ideas.push(
    `📝 ${topic}에 대한 스토리텔링 접근`,
    `🎬 ${topic}를 영화처럼 시각적으로 표현`,
    `📚 ${topic}를 교육 콘텐츠로 재구성`,
    `🎮 ${topic}를 게임화하여 재미있게`,
  );

  if (style === 'funny') {
    ideas.push(
      `😂 ${topic}를 유머러스하게 풀어내기`,
      `🎭 ${topic}를 패러디로 재해석`,
    );
  }

  return ideas;
}

/**
 * 디자인 아이디어 생성
 */
function generateDesignIdeas(topic: string, style: string): string[] {
  const ideas: string[] = [];

  ideas.push(
    `🎨 ${topic}를 그라데이션과 글래스모피즘으로`,
    `🌈 ${topic}를 다크모드와 라이트모드 지원`,
    `✨ ${topic}를 네오모피즘 스타일로`,
    `🚀 ${topic}를 미래지향적인 UI/UX로`,
  );

  if (style === 'minimal') {
    ideas.push(
      `⚪ ${topic}를 초미니멀 디자인으로`,
      `📐 ${topic}를 그리드 시스템으로 정돈`,
    );
  }

  return ideas;
}

/**
 * 스토리 아이디어 생성
 */
function generateStoryIdeas(topic: string, style: string): string[] {
  const ideas: string[] = [];

  ideas.push(
    `📖 ${topic}를 영웅의 여정 구조로`,
    `🎭 ${topic}를 3막 구조로 구성`,
    `✨ ${topic}를 반전이 있는 스토리로`,
    `🌟 ${topic}를 감동적인 메시지로`,
  );

  return ideas;
}

/**
 * 변형 아이디어 생성
 */
function generateVariations(ideas: string[]): string[] {
  const variations: string[] = [];

  ideas.forEach((idea, index) => {
    if (index < 3) {
      variations.push(
        `${idea} (간단한 버전)`,
        `${idea} (고급 버전)`,
        `${idea} (실험적 버전)`,
      );
    }
  });

  return variations;
}

/**
 * 태그 생성
 */
function generateTags(topic: string, type: string): string[] {
  const tags: string[] = [topic, type];

  if (type === 'code') {
    tags.push('프로그래밍', '개발', '코딩');
  } else if (type === 'design') {
    tags.push('디자인', 'UI/UX', '시각화');
  } else if (type === 'content') {
    tags.push('콘텐츠', '마케팅', '스토리텔링');
  }

  return tags;
}

/**
 * 나노바나나 스타일 프롬프트 생성
 */
export function generateNanobananaPrompt(userInput: string): string {
  const lowerInput = userInput.toLowerCase();
  
  // 창의적 키워드 감지
  const creativeKeywords = [
    '창의적', '독특한', '신기한', '재미있는', '특별한',
    'creative', 'unique', 'funny', 'special', 'amazing',
    '아이디어', 'idea', '생각', '제안'
  ];

  const isCreative = creativeKeywords.some(keyword => lowerInput.includes(keyword));

  if (isCreative) {
    return `나노바나나처럼 창의적이고 독특한 아이디어를 제안해주세요:\n\n${userInput}\n\n다음 형식으로 답변해주세요:\n1. 핵심 아이디어 (3-5개)\n2. 각 아이디어의 특징\n3. 구현 방법\n4. 예상 효과\n5. 추가 변형 아이디어`;
  }

  return userInput;
}

/**
 * 코드 자동 완성 제안
 */
export function suggestCodeCompletion(partialCode: string, language: string): string[] {
  const suggestions: string[] = [];

  if (language === 'javascript' || language === 'typescript') {
    if (partialCode.includes('const') && !partialCode.includes('=')) {
      suggestions.push('변수 할당이 필요합니다');
    }
    if (partialCode.includes('function') && !partialCode.includes('{')) {
      suggestions.push('함수 본문을 추가하세요');
    }
    if (partialCode.includes('if') && !partialCode.includes('{')) {
      suggestions.push('조건문 본문을 추가하세요');
    }
  }

  return suggestions;
}

/**
 * 코드 오류 감지 및 수정 제안
 */
export function detectAndFixErrors(code: string, language: string): {
  errors: Array<{ line: number; message: string; suggestion: string }>;
} {
  const errors: Array<{ line: number; message: string; suggestion: string }> = [];

  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    // 기본적인 오류 감지
    if (language === 'javascript' || language === 'typescript') {
      if (line.includes('==') && !line.includes('===')) {
        errors.push({
          line: index + 1,
          message: '느슨한 동등 연산자 사용',
          suggestion: '=== 또는 !== 사용 권장',
        });
      }
      if (line.includes('var ')) {
        errors.push({
          line: index + 1,
          message: 'var 사용',
          suggestion: 'const 또는 let 사용 권장',
        });
      }
    }
  });

  return { errors };
}

