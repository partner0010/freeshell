/**
 * 가상 스크롤링 및 레이지 로딩
 * Virtual Scrolling and Lazy Loading Optimization
 */

export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // 보이는 항목 외 추가 렌더링
  buffer?: number; // 스크롤 버퍼
}

export interface LazyLoadConfig {
  threshold: number; // 픽셀 단위
  rootMargin?: string;
  fallback?: string;
}

export interface VirtualScrollState {
  startIndex: number;
  endIndex: number;
  visibleItems: number[];
  totalHeight: number;
  scrollTop: number;
}

// 가상 스크롤링 시스템
export class VirtualScrollingSystem {
  // 가상 스크롤 계산
  calculateVisibleRange(
    totalItems: number,
    scrollTop: number,
    config: VirtualScrollConfig
  ): VirtualScrollState {
    const { itemHeight, containerHeight, overscan = 3, buffer = 100 } = config;

    // 보이는 항목 범위 계산
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      totalItems - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems: number[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      visibleItems.push(i);
    }

    return {
      startIndex,
      endIndex,
      visibleItems,
      totalHeight: totalItems * itemHeight,
      scrollTop,
    };
  }

  // Intersection Observer 기반 레이지 로딩
  createLazyLoader(config: LazyLoadConfig): {
    observe: (element: HTMLElement, callback: () => void) => void;
    unobserve: (element: HTMLElement) => void;
  } {
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      return {
        observe: () => {},
        unobserve: () => {},
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const callback = (entry.target as any).__lazyCallback;
            if (callback) {
              callback();
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: config.rootMargin || '50px',
        threshold: config.threshold || 0.1,
      }
    );

    return {
      observe: (element: HTMLElement, callback: () => void) => {
        (element as any).__lazyCallback = callback;
        observer.observe(element);
      },
      unobserve: (element: HTMLElement) => {
        observer.unobserve(element);
      },
    };
  }

  // 이미지 레이지 로딩
  lazyLoadImage(img: HTMLImageElement, src: string, fallback?: string): void {
    const loader = this.createLazyLoader({ threshold: 0.1 });
    
    loader.observe(img, () => {
      img.src = src;
      img.onerror = () => {
        if (fallback) {
          img.src = fallback;
        }
      };
    });
  }

  // 컴포넌트 레이지 로딩 (React.lazy 유사)
  lazyLoadComponent(loadFn: () => Promise<any>): Promise<any> {
    return loadFn().catch((error) => {
      console.error('Lazy load failed:', error);
      throw error;
    });
  }

  // 동적 임포트 최적화
  optimizeDynamicImports(imports: Map<string, () => Promise<any>>): {
    preload: (name: string) => void;
    load: (name: string) => Promise<any>;
  } {
    const cache = new Map<string, Promise<any>>();

    return {
      preload: (name: string) => {
        if (!cache.has(name) && imports.has(name)) {
          cache.set(name, imports.get(name)!());
        }
      },
      load: async (name: string) => {
        if (cache.has(name)) {
          return cache.get(name);
        }
        if (imports.has(name)) {
          const promise = imports.get(name)!();
          cache.set(name, promise);
          return promise;
        }
        throw new Error(`Import ${name} not found`);
      },
    };
  }
}

export const virtualScrollingSystem = new VirtualScrollingSystem();

