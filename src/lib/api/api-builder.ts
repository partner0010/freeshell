/**
 * API 빌더
 * API Builder
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface APIEndpoint {
  id: string;
  name: string;
  method: HttpMethod;
  path: string;
  description?: string;
  headers?: Record<string, string>;
  params?: Array<{
    name: string;
    type: string;
    required: boolean;
    description?: string;
  }>;
  body?: any;
  response?: any;
}

export interface APICollection {
  id: string;
  name: string;
  baseUrl: string;
  endpoints: APIEndpoint[];
  auth?: {
    type: 'none' | 'bearer' | 'api-key' | 'basic';
    config?: Record<string, string>;
  };
}

// API 빌더
export class APIBuilder {
  private collections: Map<string, APICollection> = new Map();

  // 컬렉션 생성
  createCollection(name: string, baseUrl: string): APICollection {
    const collection: APICollection = {
      id: `collection-${Date.now()}`,
      name,
      baseUrl,
      endpoints: [],
    };
    this.collections.set(collection.id, collection);
    return collection;
  }

  // 엔드포인트 추가
  addEndpoint(
    collectionId: string,
    endpoint: Omit<APIEndpoint, 'id'>
  ): APIEndpoint {
    const collection = this.collections.get(collectionId);
    if (!collection) throw new Error('Collection not found');

    const newEndpoint: APIEndpoint = {
      ...endpoint,
      id: `endpoint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    collection.endpoints.push(newEndpoint);
    return newEndpoint;
  }

  // API 테스트
  async testEndpoint(endpoint: APIEndpoint, baseUrl: string, data?: any): Promise<any> {
    // 실제로는 fetch 호출
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      status: 200,
      data: { message: 'Success', ...data },
    };
  }

  // 컬렉션 내보내기 (OpenAPI, Postman 등)
  exportCollection(collectionId: string, format: 'openapi' | 'postman'): string {
    const collection = this.collections.get(collectionId);
    if (!collection) throw new Error('Collection not found');

    if (format === 'openapi') {
      return JSON.stringify({
        openapi: '3.0.0',
        info: {
          title: collection.name,
          version: '1.0.0',
        },
        servers: [{ url: collection.baseUrl }],
        paths: {},
      }, null, 2);
    }

    return JSON.stringify({
      info: { name: collection.name },
      item: collection.endpoints.map((ep) => ({
        name: ep.name,
        request: {
          method: ep.method,
          url: `${collection.baseUrl}${ep.path}`,
        },
      })),
    }, null, 2);
  }

  getCollection(id: string): APICollection | undefined {
    return this.collections.get(id);
  }

  getAllCollections(): APICollection[] {
    return Array.from(this.collections.values());
  }
}

export const apiBuilder = new APIBuilder();

