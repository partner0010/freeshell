/**
 * 이벤트 버스
 * Event Bus - 모듈 간 통신
 */

export type EventType = 
  | 'content.created'
  | 'content.video.created'
  | 'content.image.created'
  | 'content.music.created'
  | 'dev.code.generated'
  | 'dev.website.deployed'
  | 'dev.security.audit'
  | 'agent.task.completed'
  | 'agent.task.failed'
  | 'storage.file.uploaded'
  | 'user.authenticated'
  | 'error.occurred';

export interface Event {
  type: EventType;
  payload: any;
  timestamp: number;
  source: string;
}

type EventHandler = (event: Event) => void | Promise<void>;

// 이벤트 버스
export class EventBus {
  private handlers: Map<EventType, Set<EventHandler>> = new Map();
  private eventHistory: Event[] = [];
  private maxHistorySize = 1000;

  // 이벤트 구독
  on(eventType: EventType, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    // 구독 해제 함수 반환
    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }

  // 이벤트 발생
  async emit(eventType: EventType, payload: any, source: string = 'system'): Promise<void> {
    const event: Event = {
      type: eventType,
      payload,
      timestamp: Date.now(),
      source,
    };

    // 이벤트 히스토리 저장
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // 핸들러 실행
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      const promises = Array.from(handlers).map((handler) => {
        try {
          return Promise.resolve(handler(event));
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
          return Promise.resolve();
        }
      });
      await Promise.all(promises);
    }
  }

  // 이벤트 히스토리 조회
  getHistory(eventType?: EventType, limit: number = 100): Event[] {
    let events = this.eventHistory;
    
    if (eventType) {
      events = events.filter((e) => e.type === eventType);
    }

    return events.slice(-limit).reverse();
  }

  // 모든 핸들러 제거
  clear(): void {
    this.handlers.clear();
    this.eventHistory = [];
  }
}

export const eventBus = new EventBus();

