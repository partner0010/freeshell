/**
 * 스마트 검색 및 자동완성 시스템
 * Intelligent Search with Fuzzy Matching and Auto-completion
 */

export interface SearchResult<T> {
  item: T;
  score: number;
  highlights: string[];
}

export interface SearchIndex<T> {
  items: T[];
  index: Map<string, Set<number>>; // term -> item indices
  weights: Map<string, number>; // field -> weight
}

// 스마트 검색 시스템
export class SmartSearch<T extends Record<string, any>> {
  private index: SearchIndex<T>;

  constructor(items: T[], searchableFields: string[] = [], weights: Map<string, number> = new Map()) {
    this.index = {
      items,
      index: new Map(),
      weights,
    };

    this.buildIndex(items, searchableFields);
  }

  // 인덱스 구축
  private buildIndex(items: T[], fields: string[]): void {
    items.forEach((item, idx) => {
      fields.forEach((field) => {
        const value = item[field];
        if (value) {
          const terms = this.tokenize(String(value));
          terms.forEach((term) => {
            if (!this.index.index.has(term)) {
              this.index.index.set(term, new Set());
            }
            this.index.index.get(term)!.add(idx);
          });
        }
      });
    });
  }

  // 토큰화
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.replace(/[^\w가-힣]/g, ''))
      .filter((word) => word.length > 0);
  }

  // 검색
  search(query: string, limit: number = 10): SearchResult<T>[] {
    const queryTerms = this.tokenize(query);
    const scores = new Map<number, number>();
    const highlights = new Map<number, string[]>();

    queryTerms.forEach((term) => {
      // 정확한 매칭
      const exactMatches = this.index.index.get(term);
      if (exactMatches) {
        exactMatches.forEach((idx) => {
          scores.set(idx, (scores.get(idx) || 0) + 10);
        });
      }

      // 유사 매칭 (Fuzzy)
      for (const [indexedTerm, indices] of this.index.index.entries()) {
        const similarity = this.fuzzyMatch(term, indexedTerm);
        if (similarity > 0.7) {
          indices.forEach((idx) => {
            scores.set(idx, (scores.get(idx) || 0) + similarity * 5);
          });
        }
      }
    });

    // 결과 정렬
    const results: SearchResult<T>[] = Array.from(scores.entries())
      .map(([idx, score]) => ({
        item: this.index.items[idx],
        score,
        highlights: this.generateHighlights(this.index.items[idx], query),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return results;
  }

  // 자동완성
  autocomplete(query: string, limit: number = 5): string[] {
    const queryLower = query.toLowerCase();
    const suggestions = new Set<string>();

    for (const [term] of this.index.index.entries()) {
      if (term.startsWith(queryLower)) {
        suggestions.add(term);
        if (suggestions.size >= limit) break;
      }
    }

    return Array.from(suggestions).slice(0, limit);
  }

  // Fuzzy 매칭 (Levenshtein distance 기반)
  private fuzzyMatch(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  // 하이라이트 생성
  private generateHighlights(item: T, query: string): string[] {
    const highlights: string[] = [];
    const queryLower = query.toLowerCase();

    Object.values(item).forEach((value) => {
      const str = String(value).toLowerCase();
      if (str.includes(queryLower)) {
        highlights.push(String(value));
      }
    });

    return highlights;
  }
}

