/**
 * 숏폼 콘텐츠 생성기
 * Short-form Content Creator
 * 2025년 최신 트렌드 반영
 */

export interface ShortFormConfig {
  duration: number; // 15-60초
  aspectRatio: '9:16' | '16:9' | '1:1';
  music: {
    track: string;
    volume: number;
    fadeIn: boolean;
    fadeOut: boolean;
  };
  effects: {
    transitions: string[];
    filters: string;
    textAnimations: string[];
  };
  captions: {
    enabled: boolean;
    style: string;
    position: 'top' | 'center' | 'bottom';
  };
  hashtags: string[];
  platform: 'tiktok' | 'instagram' | 'youtube' | 'all';
}

export interface ShortFormContent {
  id: string;
  title: string;
  description: string;
  config: ShortFormConfig;
  videoUrl?: string;
  thumbnailUrl?: string;
  createdAt: number;
}

/**
 * 숏폼 콘텐츠 생성
 */
export class ShortFormCreator {
  /**
   * AI 기반 숏폼 스크립트 생성
   */
  async generateScript(topic: string, duration: number = 30): Promise<string> {
    // 실제로는 AI API 호출
    const script = `
      [0-5초] 훅: ${topic}에 대해 알고 계신가요?
      [5-15초] 문제 제시: 많은 사람들이 ${topic}에 대해 오해하고 있습니다.
      [15-25초] 해결책: 오늘은 ${topic}에 대한 진실을 알려드리겠습니다.
      [25-${duration}초] CTA: 좋아요와 팔로우 부탁드립니다!
    `;
    return script.trim();
  }

  /**
   * 트렌디한 해시태그 추천
   */
  getTrendingHashtags(topic: string): string[] {
    const baseHashtags = [
      `#${topic.replace(/\s+/g, '')}`,
      '#Shorts',
      '#Viral',
      '#Trending',
      '#FYP',
    ];

    // 트렌드에 따라 동적 추가
    const trending = ['#AI', '#Tech', '#Content', '#Creator'];
    return [...baseHashtags, ...trending];
  }

  /**
   * 최적의 포스팅 시간 추천
   */
  getOptimalPostingTimes(platform: 'tiktok' | 'instagram' | 'youtube'): number[] {
    const times: Record<string, number[]> = {
      tiktok: [9, 12, 19, 21], // 오전 9시, 정오, 오후 7시, 오후 9시
      instagram: [11, 13, 17, 20],
      youtube: [14, 18, 22],
    };
    return times[platform] || [12, 18];
  }

  /**
   * 숏폼 콘텐츠 생성
   */
  async createShortForm(
    topic: string,
    config: Partial<ShortFormConfig> = {}
  ): Promise<ShortFormContent> {
    const defaultConfig: ShortFormConfig = {
      duration: 30,
      aspectRatio: '9:16',
      music: {
        track: 'trending',
        volume: 0.7,
        fadeIn: true,
        fadeOut: true,
      },
      effects: {
        transitions: ['fade', 'slide'],
        filters: 'vibrant',
        textAnimations: ['fade-in', 'slide-up'],
      },
      captions: {
        enabled: true,
        style: 'modern',
        position: 'bottom',
      },
      hashtags: this.getTrendingHashtags(topic),
      platform: 'all',
      ...config,
    };

    const script = await this.generateScript(topic, defaultConfig.duration);

    return {
      id: `shortform-${Date.now()}`,
      title: `${topic} - 숏폼 콘텐츠`,
      description: script,
      config: defaultConfig,
      createdAt: Date.now(),
    };
  }
}

