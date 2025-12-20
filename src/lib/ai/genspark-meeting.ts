/**
 * GENSPARK AI Meeting Notes
 * 회의 내용을 자동으로 전문적인 노트로 변환
 */

export interface MeetingNote {
  id: string;
  title: string;
  date: Date;
  duration: number; // 초 단위
  participants: string[];
  summary: string;
  keyPoints: string[];
  actionItems: ActionItem[];
  transcript: string;
  tags: string[];
}

export interface ActionItem {
  task: string;
  assignee: string;
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
}

/**
 * 회의 음성을 텍스트로 변환하고 노트 생성
 */
export async function generateMeetingNotes(
  audioUrl: string | File,
  options: {
    language?: string;
    includeTranscript?: boolean;
    includeActionItems?: boolean;
  } = {}
): Promise<MeetingNote> {
  // 실제로는 음성 인식 API를 사용하지만, 현재는 시뮬레이션
  const transcript = await transcribeAudio(audioUrl);
  const notes = await processTranscript(transcript, options);

  return notes;
}

/**
 * 음성 텍스트 변환 (시뮬레이션)
 */
async function transcribeAudio(audioUrl: string | File): Promise<string> {
  // 실제로는 음성 인식 API (예: OpenAI Whisper, Google Speech-to-Text) 사용
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return `
안녕하세요, 오늘 회의를 시작하겠습니다.
첫 번째 안건은 프로젝트 일정에 대한 것입니다.
다음 주까지 첫 번째 마일스톤을 완료해야 합니다.
김철수님이 담당하시고, 이번 주 금요일까지 진행 상황을 공유해주세요.
두 번째 안건은 디자인 리뷰입니다.
새로운 UI 디자인이 완료되었고, 다음 주 월요일에 최종 검토를 진행하겠습니다.
마지막으로, 다음 회의는 2주 후로 예정되어 있습니다.
  `.trim();
}

/**
 * 텍스트를 회의 노트로 처리
 */
async function processTranscript(
  transcript: string,
  options: {
    includeTranscript?: boolean;
    includeActionItems?: boolean;
  }
): Promise<MeetingNote> {
  // 실제로는 GPT-4나 Claude를 사용하여 회의 노트 생성
  await new Promise((resolve) => setTimeout(resolve, 500));

  const keyPoints = extractKeyPoints(transcript);
  const actionItems = options.includeActionItems !== false 
    ? extractActionItems(transcript)
    : [];

  return {
    id: `meeting-${Date.now()}`,
    title: extractTitle(transcript),
    date: new Date(),
    duration: estimateDuration(transcript),
    participants: extractParticipants(transcript),
    summary: generateSummary(transcript),
    keyPoints,
    actionItems,
    transcript: options.includeTranscript !== false ? transcript : '',
    tags: extractTags(transcript),
  };
}

/**
 * 제목 추출
 */
function extractTitle(transcript: string): string {
  const lines = transcript.split('\n').filter((l) => l.trim());
  if (lines.length > 0) {
    return lines[0].substring(0, 100);
  }
  return '회의 노트';
}

/**
 * 핵심 포인트 추출
 */
function extractKeyPoints(transcript: string): string[] {
  // 간단한 추출 로직 (실제로는 AI 사용)
  const sentences = transcript.split(/[.!?]\s+/).filter((s) => s.trim());
  return sentences
    .filter((s) => s.length > 20 && s.length < 200)
    .slice(0, 5)
    .map((s) => s.trim());
}

/**
 * 액션 아이템 추출
 */
function extractActionItems(transcript: string): ActionItem[] {
  const actionItems: ActionItem[] = [];
  
  // "해야 합니다", "담당", "완료" 등의 키워드로 액션 아이템 찾기
  const patterns = [
    /([가-힣\s]+)님이?\s+([가-힣\s]+)을?\s+(해야|완료|담당)/g,
    /([가-힣\s]+)까지\s+([가-힣\s]+)을?\s+(완료|제출|공유)/g,
  ];

  patterns.forEach((pattern) => {
    const matches = transcript.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[2]) {
        actionItems.push({
          task: match[2].trim(),
          assignee: match[1].trim(),
          priority: 'medium',
        });
      }
    }
  });

  return actionItems.slice(0, 5);
}

/**
 * 참석자 추출
 */
function extractParticipants(transcript: string): string[] {
  // 이름 패턴 찾기 (실제로는 더 정교한 로직 필요)
  const namePattern = /([가-힣]{2,4})님/g;
  const matches = transcript.matchAll(namePattern);
  const participants = new Set<string>();

  for (const match of matches) {
    if (match[1]) {
      participants.add(match[1]);
    }
  }

  return Array.from(participants);
}

/**
 * 요약 생성
 */
function generateSummary(transcript: string): string {
  const sentences = transcript.split(/[.!?]\s+/).filter((s) => s.trim());
  const summary = sentences.slice(0, 3).join('. ');
  return summary + (sentences.length > 3 ? '...' : '');
}

/**
 * 태그 추출
 */
function extractTags(transcript: string): string[] {
  const keywords = ['프로젝트', '일정', '디자인', '리뷰', '마일스톤', '회의'];
  const foundTags: string[] = [];

  keywords.forEach((keyword) => {
    if (transcript.includes(keyword)) {
      foundTags.push(keyword);
    }
  });

  return foundTags;
}

/**
 * 회의 시간 추정
 */
function estimateDuration(transcript: string): number {
  // 평균 읽기 속도: 200자/분
  const charsPerMinute = 200;
  const minutes = transcript.length / charsPerMinute;
  return Math.ceil(minutes * 60); // 초 단위
}

