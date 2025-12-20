/**
 * 배경음악 관리
 */

export interface MusicTrack {
  id: string;
  name: string;
  url: string;
  genre: string[];
  mood: string[];
  duration: number;
  bpm?: number;
  license: 'free' | 'royalty-free' | 'creative-commons';
}

/**
 * 무료 배경음악 라이브러리
 * 실제로는 사용자가 음악 파일을 업로드하거나 무료 음악 사이트에서 가져올 수 있음
 */
const FREE_MUSIC_LIBRARY: MusicTrack[] = [
  {
    id: 'upbeat-1',
    name: 'Upbeat Corporate',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: ['corporate', 'business', 'tech'],
    mood: ['upbeat', 'energetic', 'positive'],
    duration: 180,
    bpm: 120,
    license: 'free',
  },
  {
    id: 'calm-1',
    name: 'Calm Ambient',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: ['ambient', 'relaxing'],
    mood: ['calm', 'peaceful', 'meditative'],
    duration: 240,
    bpm: 60,
    license: 'free',
  },
  {
    id: 'dramatic-1',
    name: 'Dramatic Cinematic',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: ['cinematic', 'dramatic'],
    mood: ['dramatic', 'intense', 'epic'],
    duration: 200,
    bpm: 90,
    license: 'free',
  },
];

/**
 * 콘텐츠 분위기에 맞는 배경음악 선택
 */
export function selectBackgroundMusic(
  contentType: string,
  mood: string = 'neutral',
  duration: number = 60
): MusicTrack | null {
  const matchingTracks = FREE_MUSIC_LIBRARY.filter((track) => {
    const matchesGenre = track.genre.some((g) =>
      contentType.toLowerCase().includes(g.toLowerCase())
    );
    const matchesMood = track.mood.some((m) =>
      mood.toLowerCase().includes(m.toLowerCase())
    );
    return matchesGenre || matchesMood;
  });

  if (matchingTracks.length === 0) {
    // 기본 트랙 반환
    return FREE_MUSIC_LIBRARY[0];
  }

  // 가장 적합한 트랙 선택
  return matchingTracks[Math.floor(Math.random() * matchingTracks.length)];
}

/**
 * 배경음악 URL 가져오기
 */
export function getBackgroundMusicUrl(
  contentType: string,
  mood?: string,
  duration?: number
): string {
  const track = selectBackgroundMusic(contentType, mood, duration);
  return track?.url || '';
}

/**
 * 배경음악 옵션
 */
export interface BackgroundMusicOptions {
  volume?: number; // 0.0 ~ 1.0
  fadeIn?: number; // 초 단위
  fadeOut?: number; // 초 단위
  loop?: boolean;
}

/**
 * 배경음악 설정 생성
 */
export function createBackgroundMusicConfig(
  track: MusicTrack | null,
  options: BackgroundMusicOptions = {}
): {
  url: string;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  loop: boolean;
} {
  return {
    url: track?.url || '',
    volume: options.volume || 0.3,
    fadeIn: options.fadeIn || 1,
    fadeOut: options.fadeOut || 1,
    loop: options.loop !== false,
  };
}

