/**
 * 완전 자동화 파이프라인
 * 주제 → 대본 → 이미지 → 음성 → 영상 → 자막 → 배경음악 → SEO → 배포
 */

import { nanobanaAI } from '@/lib/ai/nanobana';
import { klingAI } from '@/lib/ai/kling';
import { superToneAI } from '@/lib/ai/superTone';
import { splitTextIntoSubtitles, generateSRT, generateStyledVTT, type SubtitleStyle } from '@/lib/video/subtitles';
import { selectBackgroundMusic, createBackgroundMusicConfig, type BackgroundMusicOptions } from '@/lib/video/backgroundMusic';
import { translateText as translateTextFunc } from '@/lib/multilingual/generator';
import { humanizeText } from '@/lib/ai/rewritify';
import { generateWithHuggingFace, generateImageWithStableDiffusion } from '@/lib/ai/huggingface';
import { generateImageWithReplicate, generateVideoWithReplicate } from '@/lib/ai/replicate';
import { agentManager } from '@/lib/ai/agents';

export interface PipelineOptions {
  topic: string;
  language?: string;
  duration?: number; // 초 단위
  multilingual?: boolean;
  languages?: string[];
  includeSubtitles?: boolean;
  subtitleStyle?: SubtitleStyle;
  includeBackgroundMusic?: boolean;
  backgroundMusicOptions?: BackgroundMusicOptions;
  seoOptimize?: boolean;
  autoDeploy?: boolean;
}

export interface PipelineResult {
  script: string;
  images: string[];
  audioUrl: string;
  videoUrl: string;
  subtitles?: string;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
    tags: string[];
  };
  deployed?: boolean;
  subtitlesVTT?: string;
  backgroundMusic?: {
    url: string;
    volume: number;
    fadeIn: number;
    fadeOut: number;
    loop: boolean;
  };
  multilingualVersions?: Record<string, {
    script: string;
    seo: {
      title: string;
      description: string;
      keywords: string[];
    };
  }>;
}

/**
 * 완전 자동화 파이프라인 실행
 */
export async function runAutomationPipeline(
  options: PipelineOptions
): Promise<PipelineResult> {
  const {
    topic,
    language = 'ko',
    duration = 600, // 기본 10분
    multilingual = false,
    languages = [],
    includeSubtitles = true,
    includeBackgroundMusic = true,
    seoOptimize = true,
    autoDeploy = false,
  } = options;

  // 1. 대본 생성
  let script: string;
  try {
    script = await generateScript(topic, language);
  } catch (error: any) {
    console.error('대본 생성 실패:', error);
    // 기본 대본 생성
    script = `${topic}에 대한 내용입니다. 이 주제는 매우 흥미롭고 유익한 정보를 제공합니다.`;
  }

  // 2. 이미지 생성 (여러 장)
  const imageCount = Math.ceil(duration / 60); // 1분당 1장
  const images: string[] = [];
  try {
    const imagePromises = Array.from({ length: Math.min(imageCount, 10) }).map((_, i) =>
      nanobanaAI.generateCharacter(
        `${topic} - 장면 ${i + 1}`,
        'anime',
        { width: 1920, height: 1080 }
      ).catch((error) => {
        console.error(`이미지 ${i + 1} 생성 실패:`, error);
        return `https://via.placeholder.com/1920x1080/8B5CF6/FFFFFF?text=${encodeURIComponent(topic)}`;
      })
    );
    images.push(...(await Promise.all(imagePromises)));
  } catch (error: any) {
    console.error('이미지 생성 실패:', error);
    images.push(`https://via.placeholder.com/1920x1080/8B5CF6/FFFFFF?text=${encodeURIComponent(topic)}`);
  }

  // 3. 음성 생성
  let audioUrl: string;
  try {
    audioUrl = await superToneAI.generateNarration(script, language);
  } catch (error: any) {
    console.error('음성 생성 실패:', error);
    audioUrl = ''; // 음성 없이 진행
  }

  // 4. 영상 생성
  let videoUrl: string;
  try {
    videoUrl = await klingAI.generateVideoFromText(script, {
      duration: Math.min(duration, 3600),
      aspectRatio: '16:9',
    });
  } catch (error: any) {
    console.error('영상 생성 실패:', error);
    videoUrl = images[0] || `https://via.placeholder.com/1920x1080/8B5CF6/FFFFFF?text=${encodeURIComponent(topic)}`;
  }

  // 5. 자막 생성 (옵션)
  let subtitles: string | undefined;
  let subtitlesVTT: string | undefined;
  if (includeSubtitles) {
    const subtitleSegments = splitTextIntoSubtitles(script, 40, 2, duration, language);
    subtitles = generateSRT(subtitleSegments);
    subtitlesVTT = generateStyledVTT(subtitleSegments, options.subtitleStyle || {
      fontSize: 24,
      color: '#FFFFFF',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      position: 'bottom',
      alignment: 'center',
      outline: true,
    });
  }

  // 6. 배경음악 설정 (옵션)
  let backgroundMusic: ReturnType<typeof createBackgroundMusicConfig> | undefined;
  if (includeBackgroundMusic) {
    const track = selectBackgroundMusic('video', 'neutral', duration);
    backgroundMusic = createBackgroundMusicConfig(track, options.backgroundMusicOptions);
  }

  // 7. SEO 최적화 (옵션)
  let seo: PipelineResult['seo'];
  if (seoOptimize) {
    seo = await optimizeSEO(topic, script);
  }

  // 8. 배포 (옵션)
  let deployed = false;
  if (autoDeploy) {
    deployed = await deployToPlatforms(videoUrl, seo);
  }

  // 9. 다국어 생성 (옵션)
  const multilingualVersions: Record<string, any> = {};
  if (multilingual && languages.length > 0) {
    for (const lang of languages) {
      if (lang === language) continue; // 원본 언어는 스킵
      
      try {
        const translatedScript = await translateTextFunc(script, language, lang);
        const translatedSEO = seo ? {
          title: await translateTextFunc(seo.title, language, lang),
          description: await translateTextFunc(seo.description, language, lang),
          keywords: seo.keywords ? await Promise.all(
            seo.keywords.map(kw => translateTextFunc(kw, language, lang))
          ) : [],
        } : {
          title: '',
          description: '',
          keywords: [],
        };
        
        multilingualVersions[lang] = {
          script: translatedScript,
          seo: translatedSEO,
        };
      } catch (error) {
        console.warn(`다국어 생성 실패 (${lang}):`, error);
      }
    }
  }

  return {
    script,
    images,
    audioUrl,
    videoUrl,
    subtitles,
    subtitlesVTT,
    backgroundMusic,
    seo,
    deployed,
    multilingualVersions: Object.keys(multilingualVersions).length > 0 ? multilingualVersions : undefined,
  };
}

/**
 * 대본 생성 (OpenAI GPT-4)
 */
async function generateScript(
  topic: string,
  language: string
): Promise<string> {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error('OpenAI API 키가 필요합니다');
  }

  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: openaiApiKey });

  const prompt = `다음 주제에 대한 전문적이고 매력적인 대본을 ${language}로 작성해주세요.

주제: ${topic}

요구사항:
- 흥미롭고 유익한 내용
- 자연스러운 말투
- 시각적 요소를 고려한 설명
- 적절한 길이 (약 10분 분량)`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a professional scriptwriter. Write engaging, informative scripts in ${language}.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: 2000,
    temperature: 0.7,
  });

  return response.choices[0].message.content || '';
}


/**
 * SEO 최적화
 */
async function optimizeSEO(
  topic: string,
  script: string
): Promise<PipelineResult['seo']> {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    return {
      title: topic,
      description: script.substring(0, 160),
      keywords: extractKeywords(topic + ' ' + script),
      tags: extractKeywords(topic),
    };
  }

  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: openaiApiKey });

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are an SEO expert. Generate optimized titles, descriptions, keywords, and tags.',
      },
      {
        role: 'user',
        content: `주제: ${topic}\n\n대본: ${script.substring(0, 500)}\n\n위 콘텐츠에 대한 SEO 최적화된 제목, 설명, 키워드, 태그를 생성해주세요.`,
      },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  const content = response.choices[0].message.content || '';
  const lines = content.split('\n').filter((line) => line.trim());

  return {
    title: extractValue(lines, '제목') || topic,
    description: extractValue(lines, '설명') || script.substring(0, 160),
    keywords: extractKeywords(topic + ' ' + script),
    tags: extractKeywords(topic),
  };
}

/**
 * 값 추출 헬퍼
 */
function extractValue(lines: string[], label: string): string | null {
  const line = lines.find((l) => l.includes(label));
  if (!line) return null;
  return line.split(':').slice(1).join(':').trim();
}

/**
 * 키워드 추출
 */
function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .filter((w) => !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'].includes(w));
  return [...new Set(words)].slice(0, 10);
}

/**
 * 플랫폼 배포
 */
async function deployToPlatforms(
  videoUrl: string,
  seo?: PipelineResult['seo']
): Promise<boolean> {
  // TODO: YouTube, TikTok 등 플랫폼에 자동 업로드
  // 현재는 플레이스홀더
  console.log('배포 준비:', { videoUrl, seo });
  return false;
}

