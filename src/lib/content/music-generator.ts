/**
 * AI 음악 생성기
 * AI Music Generator
 * 2025년 최신 음악 생성 트렌드 반영 (Suno, Udio 등)
 */

export interface MusicConfig {
  genre: 'pop' | 'rock' | 'electronic' | 'jazz' | 'classical' | 'hip-hop' | 'ambient';
  mood: 'energetic' | 'calm' | 'happy' | 'sad' | 'dramatic' | 'romantic';
  duration: number; // 초 단위
  tempo: 'slow' | 'medium' | 'fast';
  instruments: string[];
  vocals: boolean;
  lyrics?: string;
  style: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  url?: string;
  duration: number;
  genre: string;
  mood: string;
  metadata: {
    bpm: number;
    key: string;
    instruments: string[];
  };
  createdAt: number;
}

/**
 * AI 음악 생성기
 */
export class MusicGenerator {
  /**
   * 음악 제목 생성
   */
  generateTitle(genre: string, mood: string): string {
    const titles: Record<string, Record<string, string[]>> = {
      pop: {
        energetic: ['Upbeat Pop', 'Energy Boost', 'Feel Good'],
        calm: ['Chill Pop', 'Relaxing Vibes', 'Smooth Pop'],
      },
      electronic: {
        energetic: ['Electronic Pulse', 'Dance Beat', 'Synth Wave'],
        calm: ['Ambient Electronic', 'Chill Electronic', 'Soft Synth'],
      },
    };

    const genreTitles = titles[genre]?.[mood] || ['Generated Track'];
    return genreTitles[Math.floor(Math.random() * genreTitles.length)];
  }

  /**
   * 음악 생성
   */
  async generateMusic(config: MusicConfig): Promise<MusicTrack> {
    const title = this.generateTitle(config.genre, config.mood);
    
    // 실제로는 Suno, Udio 등의 AI 음악 생성 API 호출
    // 또는 Replicate, Hugging Face의 음악 생성 모델 사용

    const bpm = this.getBPM(config.tempo);
    const key = this.getRandomKey();

    return {
      id: `music-${Date.now()}`,
      title,
      duration: config.duration,
      genre: config.genre,
      mood: config.mood,
      metadata: {
        bpm,
        key,
        instruments: config.instruments,
      },
      createdAt: Date.now(),
    };
  }

  /**
   * BPM 계산
   */
  private getBPM(tempo: 'slow' | 'medium' | 'fast'): number {
    const bpmMap = {
      slow: 60,
      medium: 120,
      fast: 180,
    };
    return bpmMap[tempo] + Math.floor(Math.random() * 20) - 10;
  }

  /**
   * 랜덤 키 생성
   */
  private getRandomKey(): string {
    const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const modes = ['major', 'minor'];
    const key = keys[Math.floor(Math.random() * keys.length)];
    const mode = modes[Math.floor(Math.random() * modes.length)];
    return `${key} ${mode}`;
  }

  /**
   * 장르별 추천 설정
   */
  getRecommendedConfig(genre: string): Partial<MusicConfig> {
    const recommendations: Record<string, Partial<MusicConfig>> = {
      pop: {
        tempo: 'medium',
        instruments: ['piano', 'guitar', 'drums', 'bass'],
        vocals: true,
      },
      electronic: {
        tempo: 'fast',
        instruments: ['synthesizer', 'drum machine', 'bass'],
        vocals: false,
      },
      ambient: {
        tempo: 'slow',
        instruments: ['pad', 'strings', 'atmosphere'],
        vocals: false,
      },
    };

    return recommendations[genre] || {};
  }
}

