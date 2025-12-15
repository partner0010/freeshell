/**
 * Edge Computing 및 CDN 최적화
 * Edge Computing and CDN Optimization
 */

export interface EdgeNode {
  id: string;
  location: string;
  region: string;
  latency: number;
  capacity: number;
  load: number;
}

export interface EdgeCache {
  url: string;
  content: string;
  ttl: number;
  location: string;
  cachedAt: number;
}

export interface CDNStrategy {
  strategy: 'nearest' | 'lowest-latency' | 'least-loaded' | 'geographic';
  nodes: EdgeNode[];
}

// Edge Computing 시스템
export class EdgeComputingSystem {
  private nodes: Map<string, EdgeNode> = new Map();
  private cache: Map<string, EdgeCache> = new Map();

  // Edge 노드 등록
  registerNode(node: Omit<EdgeNode, 'id'>): EdgeNode {
    const id = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullNode: EdgeNode = { ...node, id };
    this.nodes.set(id, fullNode);
    return fullNode;
  }

  // 최적 노드 선택
  selectOptimalNode(strategy: CDNStrategy['strategy'], userLocation?: string): EdgeNode | null {
    const nodes = Array.from(this.nodes.values());

    if (nodes.length === 0) return null;

    switch (strategy) {
      case 'nearest':
        // 지리적으로 가장 가까운 노드
        return nodes.sort((a, b) => a.latency - b.latency)[0];

      case 'lowest-latency':
        return nodes.sort((a, b) => a.latency - b.latency)[0];

      case 'least-loaded':
        return nodes.sort((a, b) => a.load - b.load)[0];

      case 'geographic':
        // 사용자 위치 기반 선택
        return nodes.find((n) => n.region === userLocation) || nodes[0];

      default:
        return nodes[0];
    }
  }

  // Edge 캐싱
  cacheAtEdge(url: string, content: string, location: string, ttl: number = 3600): void {
    const cache: EdgeCache = {
      url,
      content,
      ttl,
      location,
      cachedAt: Date.now(),
    };

    this.cache.set(url, cache);
  }

  // Edge에서 가져오기
  getFromEdge(url: string): string | null {
    const cache = this.cache.get(url);
    if (!cache) return null;

    // TTL 체크
    if (Date.now() - cache.cachedAt > cache.ttl * 1000) {
      this.cache.delete(url);
      return null;
    }

    return cache.content;
  }

  // Service Worker 캐시 전략
  getServiceWorkerStrategy(): {
    cacheFirst: string[];
    networkFirst: string[];
    staleWhileRevalidate: string[];
  } {
    return {
      cacheFirst: [
        '/static/',
        '/assets/',
        '/images/',
      ],
      networkFirst: [
        '/api/',
        '/data/',
      ],
      staleWhileRevalidate: [
        '/',
        '/pages/',
      ],
    };
  }

  // 오프라인 지원
  enableOfflineSupport(): {
    precache: string[];
    runtimeCache: string[];
  } {
    return {
      precache: [
        '/',
        '/offline.html',
        '/manifest.json',
      ],
      runtimeCache: [
        '/api/',
        '/data/',
      ],
    };
  }

  getNodes(): EdgeNode[] {
    return Array.from(this.nodes.values());
  }

  getCacheStats(): {
    total: number;
    size: number;
    locations: string[];
  } {
    const locations = new Set<string>();
    let size = 0;

    this.cache.forEach((cache) => {
      locations.add(cache.location);
      size += cache.content.length;
    });

    return {
      total: this.cache.size,
      size,
      locations: Array.from(locations),
    };
  }
}

export const edgeComputingSystem = new EdgeComputingSystem();

// 기본 Edge 노드 등록
edgeComputingSystem.registerNode({
  location: 'Seoul',
  region: 'ap-northeast-2',
  latency: 10,
  capacity: 1000,
  load: 0.3,
});

edgeComputingSystem.registerNode({
  location: 'Tokyo',
  region: 'ap-northeast-1',
  latency: 50,
  capacity: 1000,
  load: 0.5,
});

edgeComputingSystem.registerNode({
  location: 'Singapore',
  region: 'ap-southeast-1',
  latency: 80,
  capacity: 1000,
  load: 0.4,
});

