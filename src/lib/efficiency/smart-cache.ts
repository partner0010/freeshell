/**
 * 스마트 캐싱 시스템
 * Intelligent Caching with TTL, LRU, and Predictive Prefetching
 */

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number; // Time to Live in milliseconds
  accessCount: number;
  lastAccessed: number;
  size: number; // Estimated size in bytes
}

export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  hitRate: number;
}

// 스마트 캐싱 시스템
export class SmartCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private maxSize: number; // Maximum cache size in bytes
  private maxEntries: number; // Maximum number of entries
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    size: 0,
    hitRate: 0,
  };

  constructor(maxSize: number = 50 * 1024 * 1024, maxEntries: number = 1000) {
    this.maxSize = maxSize;
    this.maxEntries = maxEntries;
  }

  // 캐시에 저장
  set(key: string, value: T, ttl: number = 3600000): void {
    // 기존 항목이 있으면 제거
    if (this.cache.has(key)) {
      const old = this.cache.get(key)!;
      this.stats.size -= old.size;
    }

    const size = this.estimateSize(value);
    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: Date.now(),
      ttl,
      accessCount: this.cache.get(key)?.accessCount || 0,
      lastAccessed: Date.now(),
      size,
    };

    // 공간이 부족하면 LRU로 제거
    while (
      (this.stats.size + size > this.maxSize || this.cache.size >= this.maxEntries) &&
      this.cache.size > 0
    ) {
      this.evictLRU();
    }

    this.cache.set(key, entry);
    this.stats.size += size;
  }

  // 캐시에서 가져오기
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // TTL 체크
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // 접근 통계 업데이트
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.stats.hits++;
    this.updateHitRate();

    return entry.value;
  }

  // 캐시 삭제
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.stats.size -= entry.size;
      this.cache.delete(key);
      return true;
    }
    return false;
  }

  // LRU 항목 제거
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.delete(lruKey);
      this.stats.evictions++;
    }
  }

  // 만료된 항목 정리
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  // 예측적 프리페치
  prefetch(keys: string[], fetcher: (key: string) => Promise<T>, ttl?: number): void {
    keys.forEach((key) => {
      if (!this.cache.has(key)) {
        fetcher(key).then((value) => {
          this.set(key, value, ttl);
        });
      }
    });
  }

  // 캐시 통계
  getStats(): CacheStats {
    return { ...this.stats };
  }

  // 캐시 초기화
  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
    this.stats.hits = 0;
    this.stats.misses = 0;
    this.stats.evictions = 0;
    this.stats.hitRate = 0;
  }

  private estimateSize(value: T): number {
    // 간단한 크기 추정
    try {
      return JSON.stringify(value).length * 2; // UTF-16
    } catch {
      return 1024; // 기본값
    }
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }
}

// 전역 캐시 인스턴스
export const globalCache = new SmartCache<any>(100 * 1024 * 1024, 2000);

