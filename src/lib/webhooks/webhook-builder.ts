/**
 * 웹훅 빌더
 * Webhook Builder
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface WebhookEvent {
  id: string;
  name: string;
  event: string; // form.submit, user.signup, payment.complete, etc.
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  secret?: string;
  active: boolean;
}

export interface Webhook {
  id: string;
  name: string;
  description?: string;
  events: WebhookEvent[];
  createdAt: Date;
}

// 웹훅 빌더
export class WebhookBuilder {
  private webhooks: Map<string, Webhook> = new Map();

  // 웹훅 생성
  createWebhook(name: string, description?: string): Webhook {
    const webhook: Webhook = {
      id: `webhook-${Date.now()}`,
      name,
      description,
      events: [],
      createdAt: new Date(),
    };
    this.webhooks.set(webhook.id, webhook);
    return webhook;
  }

  // 이벤트 추가
  addEvent(webhookId: string, event: Omit<WebhookEvent, 'id'>): WebhookEvent {
    const webhook = this.webhooks.get(webhookId);
    if (!webhook) throw new Error('Webhook not found');

    const newEvent: WebhookEvent = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    webhook.events.push(newEvent);
    return newEvent;
  }

  // 웹훅 가져오기
  getWebhook(id: string): Webhook | undefined {
    return this.webhooks.get(id);
  }

  // 모든 웹훅 가져오기
  getAllWebhooks(): Webhook[] {
    return Array.from(this.webhooks.values());
  }

  // 이벤트 트리거 (시뮬레이션)
  async triggerEvent(event: WebhookEvent, data: any): Promise<any> {
    if (!event.active) {
      return { success: false, message: 'Event is not active' };
    }

    // 실제로는 fetch 호출
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    return {
      success: true,
      status: 200,
      message: 'Webhook triggered successfully',
      data,
    };
  }
}

export const webhookBuilder = new WebhookBuilder();

