/**
 * GRIP 통합 브릿지
 * GRIP Integration Bridge
 */

import { eventBus } from '@/lib/core/event-bus';

export interface GripWebsite {
  id: string;
  name: string;
  url?: string;
  pages: GripPage[];
  createdAt: number;
  updatedAt: number;
}

export interface GripPage {
  id: string;
  title: string;
  blocks: any[];
  seo?: any;
}

export interface GripTask {
  id: string;
  type: 'create-website' | 'generate-code' | 'deploy' | 'optimize';
  input: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
}

// GRIP 통합 브릿지
export class GripBridge {
  private websites: Map<string, GripWebsite> = new Map();

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // 웹사이트 생성 요청
    eventBus.on('dev.request', async (event) => {
      const { type, input } = event.payload;
      if (type === 'create-website') {
        await this.createWebsite(input);
      }
    });

    // 콘텐츠 사용 가능 시 웹사이트에 임베드
    eventBus.on('content.available', async (event) => {
      const content = event.payload;
      await this.embedContentToWebsite(content);
    });
  }

  // 웹사이트 생성
  async createWebsite(input: { name: string; description?: string }): Promise<GripWebsite> {
    const website: GripWebsite = {
      id: `grip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: input.name,
      pages: [
        {
          id: 'page-1',
          title: '홈',
          blocks: [],
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.websites.set(website.id, website);

    // 이벤트 발생
    await eventBus.emit('dev.website.created', website, 'grip-bridge');

    return website;
  }

  // 콘텐츠를 웹사이트에 임베드
  async embedContentToWebsite(content: any, websiteId?: string): Promise<void> {
    let website: GripWebsite | undefined;

    if (websiteId) {
      website = this.websites.get(websiteId);
    } else {
      // 가장 최근 웹사이트에 임베드
      const websites = Array.from(this.websites.values());
      website = websites.sort((a, b) => b.updatedAt - a.updatedAt)[0];
    }

    if (!website) {
      // 새 웹사이트 생성
      website = await this.createWebsite({ name: '콘텐츠 웹사이트' });
    }

    // 콘텐츠 타입에 따라 블록 추가
    const block = this.contentToBlock(content);
    
    if (website.pages.length > 0) {
      website.pages[0].blocks.push(block);
      website.updatedAt = Date.now();
      
      // 이벤트 발생
      await eventBus.emit('dev.website.updated', website, 'grip-bridge');
    }
  }

  // 콘텐츠를 블록으로 변환
  private contentToBlock(content: Record<string, unknown>): Record<string, unknown> {
    switch (content.type) {
      case 'video':
        return {
          type: 'video',
          src: content.url,
          title: content.title,
        };
      case 'image':
        return {
          type: 'image',
          src: content.url,
          alt: content.title,
        };
      case 'text':
        return {
          type: 'text',
          content: content.content,
        };
      case 'music':
        return {
          type: 'audio',
          src: content.url,
          title: content.title,
        };
      default:
        return {
          type: 'embed',
          content: content,
        };
    }
  }

  // 웹사이트 조회
  getWebsite(id: string): GripWebsite | undefined {
    return this.websites.get(id);
  }

  // 모든 웹사이트 조회
  getAllWebsites(): GripWebsite[] {
    return Array.from(this.websites.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }
}

export const gripBridge = new GripBridge();

