/**
 * 자막 생성 및 스타일링
 */

export interface SubtitleSegment {
  start: number; // 초 단위
  end: number;
  text: string;
}

export interface SubtitleStyle {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  position?: 'top' | 'center' | 'bottom';
  alignment?: 'left' | 'center' | 'right';
  outline?: boolean;
  outlineColor?: string;
  outlineWidth?: number;
}

/**
 * 텍스트를 자막 세그먼트로 분할
 */
export function splitTextIntoSubtitles(
  text: string,
  maxCharsPerLine: number = 40,
  maxLines: number = 2,
  duration: number = 60,
  language: string = 'ko'
): SubtitleSegment[] {
  const sentences = text.split(/[.!?]\s+/).filter((s) => s.trim().length > 0);
  const segments: SubtitleSegment[] = [];
  let currentText = '';
  let currentStart = 0;

  // 언어별 읽기 속도 (자/초)
  const readingSpeeds: Record<string, number> = {
    ko: 2.5,
    en: 3.3,
    ja: 2.3,
    'zh-CN': 2.7,
    'zh-TW': 2.7,
    es: 3.0,
    fr: 2.8,
    de: 2.75,
    pt: 2.9,
    ru: 2.6,
    ar: 2.4,
    hi: 2.5,
    th: 2.4,
    vi: 2.6,
    id: 2.7,
    tr: 2.8,
    pl: 2.7,
    nl: 2.9,
    sv: 2.8,
    no: 2.8,
    da: 2.8,
    fi: 2.6,
    cs: 2.6,
    hu: 2.7,
  };

  const charsPerSecond = readingSpeeds[language] || readingSpeeds.ko;

  sentences.forEach((sentence, index) => {
    const sentenceWithPunctuation = sentence + (index < sentences.length - 1 ? '.' : '');
    const testText = currentText
      ? `${currentText} ${sentenceWithPunctuation}`
      : sentenceWithPunctuation;

    if (testText.length <= maxCharsPerLine * maxLines) {
      currentText = testText;
    } else {
      if (currentText) {
        const segmentDuration = Math.max(2, currentText.length / charsPerSecond);
        segments.push({
          start: currentStart,
          end: currentStart + segmentDuration,
          text: currentText,
        });
        currentStart += segmentDuration;
      }
      currentText = sentenceWithPunctuation;
    }
  });

  if (currentText) {
    const segmentDuration = Math.max(2, currentText.length / charsPerSecond);
    const endTime = Math.min(currentStart + segmentDuration, duration);
    segments.push({
      start: currentStart,
      end: endTime,
      text: currentText,
    });
  }

  return optimizeSubtitleTiming(segments, duration);
}

/**
 * 자막 타이밍 최적화
 */
function optimizeSubtitleTiming(
  segments: SubtitleSegment[],
  duration: number
): SubtitleSegment[] {
  const minDuration = 1.0;
  const maxDuration = 7.0;

  return segments.map((segment) => {
    let segmentDuration = segment.end - segment.start;

    if (segmentDuration < minDuration) {
      segmentDuration = minDuration;
    } else if (segmentDuration > maxDuration) {
      segmentDuration = maxDuration;
    }

    return {
      ...segment,
      end: Math.min(segment.start + segmentDuration, duration),
    };
  });
}

/**
 * SRT 형식으로 자막 파일 생성
 */
export function generateSRT(segments: SubtitleSegment[]): string {
  let srtContent = '';

  segments.forEach((segment, index) => {
    const startTime = formatSRTTime(segment.start);
    const endTime = formatSRTTime(segment.end);
    srtContent += `${index + 1}\n`;
    srtContent += `${startTime} --> ${endTime}\n`;
    srtContent += `${segment.text}\n\n`;
  });

  return srtContent;
}

/**
 * 시간을 SRT 형식으로 변환 (HH:MM:SS,mmm)
 */
function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
}

/**
 * 자막 스타일링 (VTT 형식)
 */
export function generateStyledVTT(
  segments: SubtitleSegment[],
  style: SubtitleStyle = {}
): string {
  const {
    fontSize = 24,
    fontFamily = 'Arial',
    color = '#FFFFFF',
    backgroundColor = 'rgba(0, 0, 0, 0.7)',
    position = 'bottom',
    alignment = 'center',
    outline = true,
    outlineColor = '#000000',
    outlineWidth = 2,
  } = style;

  let vttContent = 'WEBVTT\n\n';

  // 스타일 정의
  vttContent += `STYLE
::cue {
  font-size: ${fontSize}px;
  font-family: ${fontFamily};
  color: ${color};
  background-color: ${backgroundColor};
  text-align: ${alignment};
`;

  if (outline) {
    vttContent += `  text-shadow: ${outlineWidth}px ${outlineWidth}px ${outlineWidth}px ${outlineColor};
  -webkit-text-stroke: ${outlineWidth}px ${outlineColor};
`;
  }

  vttContent += `  line-height: 1.4;
  padding: 10px;
  border-radius: 4px;
}
\n`;

  // 자막 세그먼트
  segments.forEach((segment) => {
    const startTime = formatVTTTime(segment.start);
    const endTime = formatVTTTime(segment.end);
    vttContent += `${startTime} --> ${endTime}\n`;
    vttContent += `${segment.text}\n\n`;
  });

  return vttContent;
}

/**
 * 시간을 VTT 형식으로 변환 (HH:MM:SS.mmm)
 */
function formatVTTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}

