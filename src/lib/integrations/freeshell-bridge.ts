/**
 * FREESHELL 통합 브릿지
 * FREESHELL Integration Bridge
 */

import { eventBus } from '@/lib/core/event-bus';

export interface FreeshellContent {
  id: string;
  type: 'video' | 'image' | 'text' | 'music' | 'ebook';
  title: string;
  content: any;
  url?: string;
  createdAt: number;
}

export interface FreeshellTask {
  id: string;
  type: 'generate-video' | 'generate-image' | 'generate-text' | 'generate-music' | 'generate-ebook';
  input: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: FreeshellContent;
}

// FREESHELL 통합 브릿지
export class FreeshellBridge {
  private baseUrl: string;
  private contents: Map<string, FreeshellContent> = new Map();

  constructor(baseUrl: string = 'http://localhost:3001/api/v1') {
    this.baseUrl = baseUrl;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // 콘텐츠 생성 요청
    eventBus.on('content.request', async (event) => {
      const { type, input } = event.payload;
      await this.generateContent(type, input);
    });

    // 콘텐츠 생성 완료 알림
    eventBus.on('freeshell.content.created', async (event) => {
      const content = event.payload;
      this.contents.set(content.id, content);
      
      // GRIP에 콘텐츠 사용 가능 알림
      await eventBus.emit('content.available', content, 'freeshell-bridge');
    });
  }

  // 콘텐츠 생성
  async generateContent(type: FreeshellTask['type'], input: any): Promise<FreeshellContent> {
    // 실제로는 FREESHELL API 호출
    // 여기서는 시뮬레이션
    
    const task: FreeshellTask = {
      id: `freeshell-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      input,
      status: 'processing',
    };

    try {
      // 시뮬레이션: 비동기 처리
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const content: FreeshellContent = {
        id: task.id,
        type: type.replace('generate-', '') as FreeshellContent['type'],
        title: input.title || `${type} 콘텐츠`,
        content: input,
        url: `https://example.com/content/${task.id}`,
        createdAt: Date.now(),
      };

      task.status = 'completed';
      task.result = content;
      this.contents.set(content.id, content);

      // 이벤트 발생
      await eventBus.emit('freeshell.content.created', content, 'freeshell-bridge');

      return content;
    } catch (error) {
      task.status = 'failed';
      throw error;
    }
  }

  // 비디오 생성
  async generateVideo(prompt: string, options?: any): Promise<FreeshellContent> {
    return await this.generateContent('generate-video', { prompt, ...options });
  }

  // 이미지 생성
  async generateImage(prompt: string, options?: any): Promise<FreeshellContent> {
    return await this.generateContent('generate-image', { prompt, ...options });
  }

  // 텍스트 생성
  async generateText(prompt: string, options?: any): Promise<FreeshellContent> {
    return await this.generateContent('generate-text', { prompt, ...options });
  }

  // 음악 생성
  async generateMusic(prompt: string, options?: any): Promise<FreeshellContent> {
    return await this.generateContent('generate-music', { prompt, ...options });
  }

  // 전자책 생성
  async generateEbook(title: string, content: string, options?: any): Promise<FreeshellContent> {
    return await this.generateContent('generate-ebook', { title, content, ...options });
  }

  // 콘텐츠 조회
  getContent(id: string): FreeshellContent | undefined {
    return this.contents.get(id);
  }

  // 모든 콘텐츠 조회
  getAllContents(): FreeshellContent[] {
    return Array.from(this.contents.values()).sort((a, b) => b.createdAt - a.createdAt);
  }
}

export const freeshellBridge = new FreeshellBridge();

