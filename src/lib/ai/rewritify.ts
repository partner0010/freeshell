/**
 * Rewritify AI 통합
 * AI 생성 텍스트를 자연스럽고 인간적인 문장으로 변환
 */

export interface RewritifyOptions {
  language?: string;
  tone?: 'formal' | 'casual' | 'professional' | 'creative';
  avoidAIDetection?: boolean;
}

/**
 * 텍스트를 인간화된 문장으로 변환
 */
export async function humanizeText(
  text: string,
  options: RewritifyOptions = {}
): Promise<string> {
  try {
    // 실제 Rewritify API 호출 (현재는 시뮬레이션)
    // 실제 구현 시: https://api.rewritify.ai/v1/humanize 엔드포인트 사용
    
    const { tone = 'professional', avoidAIDetection = true } = options;
    
    // 시뮬레이션: 텍스트를 더 자연스럽게 변환
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // 간단한 변환 로직 (실제로는 API 호출)
    let humanized = text;
    
    // AI 감지 회피를 위한 변환
    if (avoidAIDetection) {
      // 반복적인 패턴 제거
      humanized = humanized.replace(/\b(또한|그리고|또한|그리고)\b/gi, (match, offset) => {
        return offset % 2 === 0 ? match : '';
      });
      
      // 더 자연스러운 표현으로 변경
      humanized = humanized.replace(/입니다\./g, '입니다.');
      humanized = humanized.replace(/합니다\./g, '합니다.');
    }
    
    return humanized;
  } catch (error: any) {
    console.error('Rewritify 변환 오류:', error);
    return text; // 실패 시 원본 반환
  }
}

/**
 * 여러 텍스트를 일괄 변환
 */
export async function humanizeBatch(
  texts: string[],
  options: RewritifyOptions = {}
): Promise<string[]> {
  return Promise.all(texts.map((text) => humanizeText(text, options)));
}

