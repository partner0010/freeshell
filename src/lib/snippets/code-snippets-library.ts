/**
 * 코드 스니펫 라이브러리
 * Code Snippets Library
 */

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
  author: string;
  downloads: number;
  rating: number;
  category: 'component' | 'utility' | 'hook' | 'api' | 'style' | 'animation';
}

export interface SnippetCategory {
  id: string;
  name: string;
  count: number;
}

// 코드 스니펫 라이브러리
export class CodeSnippetsLibrary {
  private snippets: Map<string, CodeSnippet> = new Map();

  constructor() {
    this.initSampleSnippets();
  }

  private initSampleSnippets(): void {
    const samples: CodeSnippet[] = [
      {
        id: 'snippet-1',
        title: 'React Custom Hook - useLocalStorage',
        description: '로컬 스토리지를 쉽게 사용하는 커스텀 훅',
        language: 'typescript',
        code: `export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}`,
        tags: ['react', 'hook', 'localStorage'],
        author: 'GRIP Team',
        downloads: 1234,
        rating: 4.8,
        category: 'hook',
      },
      {
        id: 'snippet-2',
        title: 'Debounce 함수',
        description: '함수 호출을 지연시키는 디바운스 유틸리티',
        language: 'typescript',
        code: `export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>): ReturnType<T> {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
        tags: ['utility', 'performance', 'debounce'],
        author: 'Community',
        downloads: 856,
        rating: 4.6,
        category: 'utility',
      },
    ];

    samples.forEach((snippet) => {
      this.snippets.set(snippet.id, snippet);
    });
  }

  // 스니펫 검색
  searchSnippets(query: string, category?: string, language?: string): CodeSnippet[] {
    let results = Array.from(this.snippets.values());

    if (category) {
      results = results.filter((s) => s.category === category);
    }

    if (language) {
      results = results.filter((s) => s.language === language);
    }

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          s.code.toLowerCase().includes(q)
      );
    }

    return results.sort((a, b) => b.downloads - a.downloads);
  }

  // 스니펫 가져오기
  getSnippet(id: string): CodeSnippet | undefined {
    return this.snippets.get(id);
  }

  // 스니펫 추가
  addSnippet(snippet: Omit<CodeSnippet, 'id' | 'downloads' | 'rating'>): CodeSnippet {
    const newSnippet: CodeSnippet = {
      ...snippet,
      id: `snippet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      downloads: 0,
      rating: 0,
    };
    this.snippets.set(newSnippet.id, newSnippet);
    return newSnippet;
  }

  // 스니펫 다운로드
  downloadSnippet(id: string): CodeSnippet | null {
    const snippet = this.snippets.get(id);
    if (snippet) {
      snippet.downloads++;
      return snippet;
    }
    return null;
  }
}

export const codeSnippetsLibrary = new CodeSnippetsLibrary();

