/**
 * 인터랙티브 문서화 시스템
 * Interactive Documentation System
 */

export interface Documentation {
  id: string;
  title: string;
  category: string;
  content: string;
  codeExamples: CodeExample[];
  related: string[];
  tags: string[];
  lastUpdated: number;
}

export interface CodeExample {
  language: string;
  code: string;
  description: string;
  runnable?: boolean;
}

export interface DocumentationSearch {
  query: string;
  results: Documentation[];
  suggestions: string[];
}

// 인터랙티브 문서화 시스템
export class InteractiveDocumentationSystem {
  private docs: Map<string, Documentation> = new Map();
  private searchIndex: Map<string, Set<string>> = new Map();

  // 문서 추가
  addDocumentation(doc: Documentation): void {
    this.docs.set(doc.id, doc);
    this.indexDocumentation(doc);
  }

  // 검색 인덱스 구축
  private indexDocumentation(doc: Documentation): void {
    const terms = this.tokenize(`${doc.title} ${doc.content}`);
    terms.forEach((term) => {
      if (!this.searchIndex.has(term)) {
        this.searchIndex.set(term, new Set());
      }
      this.searchIndex.get(term)!.add(doc.id);
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

  // 문서 검색
  search(query: string): DocumentationSearch {
    const queryTerms = this.tokenize(query);
    const docScores = new Map<string, number>();

    queryTerms.forEach((term) => {
      const docIds = this.searchIndex.get(term);
      if (docIds) {
        docIds.forEach((docId) => {
          docScores.set(docId, (docScores.get(docId) || 0) + 1);
        });
      }
    });

    const results = Array.from(docScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([docId]) => this.docs.get(docId)!)
      .filter(Boolean);

    // 자동완성 제안
    const suggestions: string[] = [];
    queryTerms.forEach((term) => {
      for (const [indexedTerm] of this.searchIndex.entries()) {
        if (indexedTerm.startsWith(term) && suggestions.length < 5) {
          suggestions.push(indexedTerm);
        }
      }
    });

    return {
      query,
      results,
      suggestions: Array.from(new Set(suggestions)).slice(0, 5),
    };
  }

  // 카테고리별 문서
  getByCategory(category: string): Documentation[] {
    return Array.from(this.docs.values()).filter((doc) => doc.category === category);
  }

  // 관련 문서
  getRelated(docId: string): Documentation[] {
    const doc = this.docs.get(docId);
    if (!doc) return [];

    return doc.related
      .map((id) => this.docs.get(id))
      .filter(Boolean) as Documentation[];
  }

  getDocumentation(docId: string): Documentation | undefined {
    return this.docs.get(docId);
  }

  getAllCategories(): string[] {
    const categories = new Set<string>();
    this.docs.forEach((doc) => categories.add(doc.category));
    return Array.from(categories);
  }
}

export const interactiveDocumentationSystem = new InteractiveDocumentationSystem();

// 기본 문서 추가
interactiveDocumentationSystem.addDocumentation({
  id: 'getting-started',
  title: '시작하기',
  category: '기본',
  content: '플랫폼 사용을 시작하는 방법을 안내합니다.',
  codeExamples: [
    {
      language: 'javascript',
      code: 'console.log("Hello, World!");',
      description: '기본 예제',
      runnable: true,
    },
  ],
  related: [],
  tags: ['시작', '기본'],
  lastUpdated: Date.now(),
});

