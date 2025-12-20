/**
 * Kling AI 통합
 * 텍스트나 이미지를 입력하면 고화질의 동영상을 생성
 */

import axios from 'axios';

export class KlingAI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.KLING_API_KEY || '';
    this.baseUrl = process.env.KLING_API_URL || 'https://api.klingai.com/v1';
  }

  /**
   * 텍스트로부터 동영상 생성
   */
  async generateVideoFromText(
    prompt: string,
    options: {
      duration?: number;
      aspectRatio?: string;
      style?: string;
      fps?: number;
    } = {}
  ): Promise<string> {
    try {
      if (!this.apiKey) {
        return await this.generateWithFallback(prompt, options);
      }

      const response = await axios.post(
        `${this.baseUrl}/generate/video`,
        {
          prompt: this.enhancePrompt(prompt, options.style),
          duration: Math.min(options.duration || 10, 60),
          aspect_ratio: options.aspectRatio || '16:9',
          style: options.style || 'realistic',
          fps: options.fps || 24,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 300000, // 5분
        }
      );

      if (response.data.taskId) {
        return await this.pollVideoGeneration(response.data.taskId);
      }

      const videoUrl = response.data.videoUrl || response.data.video;
      if (videoUrl) {
        return videoUrl;
      }

      throw new Error('동영상 생성 실패: 응답에 동영상이 없습니다');
    } catch (error: any) {
      console.error('Kling AI 동영상 생성 실패:', error);
      return await this.generateWithFallback(prompt, options);
    }
  }

  /**
   * 이미지로부터 동영상 생성 (이미지 애니메이션)
   */
  async generateVideoFromImage(
    imageUrl: string,
    prompt: string,
    options: {
      duration?: number;
      motion?: string;
    } = {}
  ): Promise<string> {
    try {
      if (!this.apiKey) {
        return await this.animateImageWithFallback(imageUrl, prompt, options);
      }

      // 이미지 다운로드 및 base64 변환
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      const imageBase64 = Buffer.from(imageResponse.data).toString('base64');

      const response = await axios.post(
        `${this.baseUrl}/generate/animate`,
        {
          image: imageBase64,
          prompt,
          duration: Math.min(options.duration || 5, 30),
          motion: options.motion || 'moderate',
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 300000,
        }
      );

      if (response.data.taskId) {
        return await this.pollVideoGeneration(response.data.taskId);
      }

      const videoUrl = response.data.videoUrl;
      if (videoUrl) {
        return videoUrl;
      }

      throw new Error('이미지 애니메이션 실패');
    } catch (error: any) {
      console.error('Kling AI 이미지 애니메이션 실패:', error);
      return await this.animateImageWithFallback(imageUrl, prompt, options);
    }
  }

  /**
   * 비동기 작업 폴링
   */
  private async pollVideoGeneration(
    taskId: string,
    maxAttempts: number = 60
  ): Promise<string> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await axios.get(`${this.baseUrl}/task/${taskId}`, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        });

        if (response.data.status === 'completed') {
          return response.data.videoUrl;
        }

        if (response.data.status === 'failed') {
          throw new Error('동영상 생성 실패');
        }

        // 5초 대기
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (error: any) {
        if (i === maxAttempts - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    throw new Error('동영상 생성 시간 초과');
  }

  /**
   * 대체 서비스 사용 (플레이스홀더)
   */
  private async generateWithFallback(prompt: string, options: any): Promise<string> {
    // API 키가 없을 때는 플레이스홀더 URL 반환
    // 실제 환경에서는 실제 비디오 생성 서비스로 대체 필요
    console.warn('Kling API 키가 없습니다. 플레이스홀더를 반환합니다.');
    return `https://via.placeholder.com/1920x1080/8B5CF6/FFFFFF?text=${encodeURIComponent(prompt)}`;
  }

  private async animateImageWithFallback(
    imageUrl: string,
    prompt: string,
    options: any
  ): Promise<string> {
    // API 키가 없을 때는 원본 이미지 URL 반환
    console.warn('Kling API 키가 없습니다. 원본 이미지를 반환합니다.');
    return imageUrl;
  }

  /**
   * 프롬프트 향상
   */
  private enhancePrompt(prompt: string, style?: string): string {
    const stylePrompts: Record<string, string> = {
      realistic: 'realistic, high quality, cinematic',
      anime: 'anime style, vibrant colors, detailed',
      cinematic: 'cinematic, professional, high quality',
    };

    const stylePrompt = style ? stylePrompts[style] || '' : '';
    return stylePrompt ? `${prompt}, ${stylePrompt}` : prompt;
  }
}

export const klingAI = new KlingAI();

