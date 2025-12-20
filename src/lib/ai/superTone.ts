/**
 * SUPERTONE AI 통합
 * 자연스러운 나레이션 생성
 */

import axios from 'axios';

export class SuperToneAI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.SUPERTONE_API_KEY || '';
    this.baseUrl = process.env.SUPERTONE_API_URL || 'https://api.supertone.ai/v1';
  }

  /**
   * 나레이션 생성
   */
  async generateNarration(
    text: string,
    language: string = 'ko',
    voiceId?: string,
    options: {
      speed?: number;
      pitch?: number;
      emotion?: string;
    } = {}
  ): Promise<string> {
    try {
      if (!this.apiKey) {
        return await this.generateWithFallback(text, language, voiceId, options);
      }

      const response = await axios.post(
        `${this.baseUrl}/generate/narration`,
        {
          text,
          language,
          voice_id: voiceId || this.getDefaultVoiceId(language),
          speed: options.speed || 1.0,
          pitch: options.pitch || 1.0,
          emotion: options.emotion || 'neutral',
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 120000, // 2분
        }
      );

      if (response.data.taskId) {
        return await this.pollNarrationGeneration(response.data.taskId);
      }

      const audioUrl = response.data.audioUrl || response.data.audio;
      if (audioUrl) {
        return audioUrl;
      }

      throw new Error('나레이션 생성 실패: 응답에 오디오가 없습니다');
    } catch (error: any) {
      console.error('SUPERTONE AI 나레이션 생성 실패:', error);
      return await this.generateWithFallback(text, language, voiceId, options);
    }
  }

  /**
   * 비동기 작업 폴링
   */
  private async pollNarrationGeneration(
    taskId: string,
    maxAttempts: number = 30
  ): Promise<string> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await axios.get(`${this.baseUrl}/task/${taskId}`, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        });

        if (response.data.status === 'completed') {
          return response.data.audioUrl;
        }

        if (response.data.status === 'failed') {
          throw new Error('나레이션 생성 실패');
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (error: any) {
        if (i === maxAttempts - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    throw new Error('나레이션 생성 시간 초과');
  }

  /**
   * 대체 서비스 사용 (OpenAI TTS 등)
   */
  private async generateWithFallback(
    text: string,
    language: string,
    voiceId?: string,
    options?: any
  ): Promise<string> {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error('나레이션 생성 API를 사용할 수 없습니다');
    }

    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: openaiApiKey });

    const voiceMap: Record<string, 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'> = {
      ko: 'nova',
      en: 'alloy',
      ja: 'nova',
      'zh-CN': 'nova',
    };

    const voice = voiceMap[language] || 'nova';

    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice,
      input: text,
    });

    // 오디오 파일 저장 및 URL 반환
    const buffer = Buffer.from(await response.arrayBuffer());
    // 실제로는 파일로 저장하고 URL 반환해야 함
    // 현재는 데이터 URL로 반환
    return `data:audio/mp3;base64,${buffer.toString('base64')}`;
  }

  /**
   * 기본 음성 ID 가져오기
   */
  private getDefaultVoiceId(language: string): string {
    const voiceMap: Record<string, string> = {
      ko: 'korean-female-1',
      en: 'english-male-1',
      ja: 'japanese-female-1',
      'zh-CN': 'chinese-female-1',
    };

    return voiceMap[language] || 'korean-female-1';
  }
}

export const superToneAI = new SuperToneAI();

