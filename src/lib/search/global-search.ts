/**
 * 글로벌 검색 시스템
 * Global Search System
 */

export type SearchResultType = 'command' | 'menu' | 'file' | 'content' | 'template';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description?: string;
  path?: string;
  keywords: string[];
  action?: () => void;
  icon?: string;
}

// 글로벌 검색 엔진
export class GlobalSearchEngine {
  private index: Map<string, SearchResult[]> = new Map();

  // 검색 인덱스에 추가
  indexItem(item: SearchResult): void {
    const keywords = item.keywords.join(' ').toLowerCase();
    const terms = keywords.split(' ');

    terms.forEach((term) => {
      if (!this.index.has(term)) {
        this.index.set(term, []);
      }
      const items = this.index.get(term)!;
      if (!items.find((i) => i.id === item.id)) {
        items.push(item);
      }
    });
  }

  // 여러 항목 인덱싱
  indexItems(items: SearchResult[]): void {
    items.forEach((item) => this.indexItem(item));
  }

  // 검색 실행
  search(query: string, limit: number = 20): SearchResult[] {
    if (!query.trim()) {
      return [];
    }

    const terms = query.toLowerCase().split(' ').filter((t) => t.length > 0);
    const results = new Map<string, { item: SearchResult; score: number }>();

    terms.forEach((term) => {
      // 정확한 매치
      if (this.index.has(term)) {
        this.index.get(term)!.forEach((item) => {
          const existing = results.get(item.id);
          const score = existing ? existing.score + 10 : 10;
          results.set(item.id, { item, score });
        });
      }

      // 부분 매치
      this.index.forEach((items, indexedTerm) => {
        if (indexedTerm.includes(term)) {
          items.forEach((item) => {
            const existing = results.get(item.id);
            const score = existing ? existing.score + 5 : 5;
            results.set(item.id, { item, score });
          });
        }
      });
    });

    return Array.from(results.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((r) => r.item);
  }

  // 타입별 검색
  searchByType(query: string, type: SearchResultType): SearchResult[] {
    return this.search(query).filter((result) => result.type === type);
  }

  // 인덱스 초기화
  clearIndex(): void {
    this.index.clear();
  }
}

export const globalSearchEngine = new GlobalSearchEngine();

