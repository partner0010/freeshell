/**
 * 자동 학습 및 트렌드 모니터링 시스템
 * 최신 기술 트렌드를 자동으로 학습하고 관리자에게 제안
 */

import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface TrendSuggestion {
  id: string;
  category: 'feature' | 'technology' | 'security' | 'performance' | 'uiux' | 'ai' | 'integration';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  sourceUrl: string;
  confidence: number; // 0-100
  estimatedImpact: 'low' | 'medium' | 'high';
  estimatedEffort: 'low' | 'medium' | 'high';
  relatedTechnologies: string[];
  implementationNotes?: string;
  createdAt: Date;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'implemented';
  adminNotes?: string;
}

export interface TrendSource {
  id: string;
  name: string;
  type: 'rss' | 'api' | 'scraper' | 'github' | 'npm' | 'blog';
  url: string;
  enabled: boolean;
  lastChecked?: Date;
  checkInterval: number; // minutes
}

export class AutoLearningSystem {
  private sources: TrendSource[] = [];
  private suggestions: Map<string, TrendSuggestion> = new Map();

  constructor() {
    this.initializeSources();
  }

  /**
   * 트렌드 소스 초기화
   */
  private initializeSources(): void {
    this.sources = [
      {
        id: 'github-trending',
        name: 'GitHub Trending',
        type: 'api',
        url: 'https://api.github.com/search/repositories?q=created:>2024-01-01&sort=stars&order=desc',
        enabled: true,
        checkInterval: 60, // 1시간마다
      },
      {
        id: 'npm-trending',
        name: 'npm Trending',
        type: 'api',
        url: 'https://api.npmjs.org/downloads/point/last-week',
        enabled: true,
        checkInterval: 120, // 2시간마다
      },
      {
        id: 'dev-to',
        name: 'Dev.to',
        type: 'rss',
        url: 'https://dev.to/feed',
        enabled: true,
        checkInterval: 30, // 30분마다
      },
      {
        id: 'hacker-news',
        name: 'Hacker News',
        type: 'api',
        url: 'https://hacker-news.firebaseio.com/v0/topstories.json',
        enabled: true,
        checkInterval: 60,
      },
      {
        id: 'product-hunt',
        name: 'Product Hunt',
        type: 'scraper',
        url: 'https://www.producthunt.com/',
        enabled: true,
        checkInterval: 180, // 3시간마다
      },
      {
        id: 'techcrunch',
        name: 'TechCrunch',
        type: 'rss',
        url: 'https://techcrunch.com/feed/',
        enabled: true,
        checkInterval: 60,
      },
      {
        id: 'medium-tech',
        name: 'Medium Technology',
        type: 'rss',
        url: 'https://medium.com/feed/tag/technology',
        enabled: true,
        checkInterval: 60,
      },
    ];
  }

  /**
   * 모든 소스에서 트렌드 수집
   */
  async collectTrends(): Promise<TrendSuggestion[]> {
    const allSuggestions: TrendSuggestion[] = [];

    for (const source of this.sources) {
      if (!source.enabled) continue;

      try {
        const suggestions = await this.collectFromSource(source);
        allSuggestions.push(...suggestions);
        
        // 마지막 체크 시간 업데이트
        source.lastChecked = new Date();
      } catch (error) {
        console.error(`Failed to collect from ${source.name}:`, error);
      }
    }

    // 중복 제거 및 우선순위 정렬
    const uniqueSuggestions = this.deduplicateSuggestions(allSuggestions);
    const prioritized = this.prioritizeSuggestions(uniqueSuggestions);

    // 제안 저장
    for (const suggestion of prioritized) {
      this.suggestions.set(suggestion.id, suggestion);
    }

    return prioritized;
  }

  /**
   * 특정 소스에서 트렌드 수집
   */
  private async collectFromSource(source: TrendSource): Promise<TrendSuggestion[]> {
    const suggestions: TrendSuggestion[] = [];

    switch (source.type) {
      case 'api':
        suggestions.push(...await this.collectFromAPI(source));
        break;
      case 'rss':
        suggestions.push(...await this.collectFromRSS(source));
        break;
      case 'scraper':
        suggestions.push(...await this.collectFromScraper(source));
        break;
      case 'github':
        suggestions.push(...await this.collectFromGitHub(source));
        break;
      case 'npm':
        suggestions.push(...await this.collectFromNPM(source));
        break;
    }

    return suggestions;
  }

  /**
   * API에서 트렌드 수집
   */
  private async collectFromAPI(source: TrendSource): Promise<TrendSuggestion[]> {
    const suggestions: TrendSuggestion[] = [];

    try {
      if (source.id === 'github-trending') {
        const response = await axios.get(source.url, {
          params: { per_page: 10 },
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        const repos = response.data.items || [];
        for (const repo of repos.slice(0, 5)) {
          const suggestion = this.analyzeGitHubRepo(repo);
          if (suggestion) {
            suggestions.push(suggestion);
          }
        }
      } else if (source.id === 'hacker-news') {
        const response = await axios.get(source.url);
        const storyIds = response.data.slice(0, 10);
        
        for (const storyId of storyIds) {
          const storyResponse = await axios.get(
            `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
          );
          const story = storyResponse.data;
          const suggestion = this.analyzeHackerNewsStory(story);
          if (suggestion) {
            suggestions.push(suggestion);
          }
        }
      }
    } catch (error) {
      console.error(`API collection error for ${source.name}:`, error);
    }

    return suggestions;
  }

  /**
   * RSS 피드에서 트렌드 수집
   */
  private async collectFromRSS(source: TrendSource): Promise<TrendSuggestion[]> {
    const suggestions: TrendSuggestion[] = [];

    try {
      // RSS 파싱 (실제로는 rss-parser 라이브러리 사용 권장)
      // 여기서는 시뮬레이션
      const response = await axios.get(source.url);
      const items = this.parseRSS(response.data);

      for (const item of items.slice(0, 5)) {
        const suggestion = this.analyzeRSSItem(item, source);
        if (suggestion) {
          suggestions.push(suggestion);
        }
      }
    } catch (error) {
      console.error(`RSS collection error for ${source.name}:`, error);
    }

    return suggestions;
  }

  /**
   * 웹 스크래퍼로 트렌드 수집
   */
  private async collectFromScraper(source: TrendSource): Promise<TrendSuggestion[]> {
    // 실제로는 Puppeteer나 Cheerio 사용
    // 여기서는 시뮬레이션
    return [];
  }

  /**
   * GitHub에서 트렌드 수집
   */
  private async collectFromGitHub(source: TrendSource): Promise<TrendSuggestion[]> {
    return this.collectFromAPI(source);
  }

  /**
   * npm에서 트렌드 수집
   */
  private async collectFromNPM(source: TrendSource): Promise<TrendSuggestion[]> {
    const suggestions: TrendSuggestion[] = [];

    try {
      // npm 트렌딩 패키지 분석
      // 실제로는 npm API 사용
    } catch (error) {
      console.error(`NPM collection error:`, error);
    }

    return suggestions;
  }

  /**
   * GitHub 저장소 분석
   */
  private analyzeGitHubRepo(repo: any): TrendSuggestion | null {
    const keywords = this.extractKeywords(repo.description || repo.name);
    const category = this.categorizeContent(keywords);
    
    if (!category) return null;

    return {
      id: `github-${repo.id}`,
      category,
      title: `${repo.name}: ${repo.description?.substring(0, 50)}`,
      description: repo.description || '',
      priority: this.calculatePriority(repo.stargazers_count, repo.forks_count),
      source: 'GitHub Trending',
      sourceUrl: repo.html_url,
      confidence: Math.min(100, repo.stargazers_count / 10),
      estimatedImpact: repo.stargazers_count > 1000 ? 'high' : 'medium',
      estimatedEffort: 'medium',
      relatedTechnologies: this.extractTechnologies(repo),
      implementationNotes: this.generateImplementationNotes(repo, category),
      createdAt: new Date(),
      status: 'pending',
    };
  }

  /**
   * Hacker News 스토리 분석
   */
  private analyzeHackerNewsStory(story: any): TrendSuggestion | null {
    if (!story.title || !story.url) return null;

    const keywords = this.extractKeywords(story.title);
    const category = this.categorizeContent(keywords);
    
    if (!category) return null;

    return {
      id: `hn-${story.id}`,
      category,
      title: story.title,
      description: story.title,
      priority: story.score > 100 ? 'high' : 'medium',
      source: 'Hacker News',
      sourceUrl: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      confidence: Math.min(100, story.score / 5),
      estimatedImpact: story.score > 200 ? 'high' : 'medium',
      estimatedEffort: 'medium',
      relatedTechnologies: keywords,
      createdAt: new Date(),
      status: 'pending',
    };
  }

  /**
   * RSS 아이템 분석
   */
  private analyzeRSSItem(item: any, source: TrendSource): TrendSuggestion | null {
    const keywords = this.extractKeywords(item.title || item.description || '');
    const category = this.categorizeContent(keywords);
    
    if (!category) return null;

    return {
      id: `rss-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category,
      title: item.title || 'Untitled',
      description: item.description || item.title || '',
      priority: 'medium',
      source: source.name,
      sourceUrl: item.link || source.url,
      confidence: 50,
      estimatedImpact: 'medium',
      estimatedEffort: 'medium',
      relatedTechnologies: keywords,
      createdAt: new Date(),
      status: 'pending',
    };
  }

  /**
   * 키워드 추출
   */
  private extractKeywords(text: string): string[] {
    const techKeywords = [
      'AI', 'machine learning', 'deep learning', 'neural network',
      'React', 'Next.js', 'Vue', 'Angular', 'Svelte',
      'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust',
      'blockchain', 'crypto', 'NFT', 'Web3',
      'serverless', 'edge computing', 'microservices',
      'GraphQL', 'REST', 'API', 'gRPC',
      'Docker', 'Kubernetes', 'CI/CD',
      'security', 'encryption', 'authentication',
      'performance', 'optimization', 'caching',
      'PWA', 'mobile', 'responsive',
    ];

    const lowerText = text.toLowerCase();
    return techKeywords.filter(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
  }

  /**
   * 콘텐츠 카테고리 분류
   */
  private categorizeContent(keywords: string[]): TrendSuggestion['category'] | null {
    if (keywords.some(k => ['AI', 'machine learning', 'deep learning'].includes(k))) {
      return 'ai';
    }
    if (keywords.some(k => ['security', 'encryption', 'authentication'].includes(k))) {
      return 'security';
    }
    if (keywords.some(k => ['performance', 'optimization', 'caching'].includes(k))) {
      return 'performance';
    }
    if (keywords.some(k => ['React', 'Next.js', 'Vue', 'UI', 'UX'].includes(k))) {
      return 'uiux';
    }
    if (keywords.some(k => ['API', 'GraphQL', 'REST', 'integration'].includes(k))) {
      return 'integration';
    }
    if (keywords.length > 0) {
      return 'technology';
    }
    return null;
  }

  /**
   * 우선순위 계산
   */
  private calculatePriority(stars: number, forks: number): TrendSuggestion['priority'] {
    const score = stars + forks * 2;
    if (score > 10000) return 'critical';
    if (score > 5000) return 'high';
    if (score > 1000) return 'medium';
    return 'low';
  }

  /**
   * 기술 스택 추출
   */
  private extractTechnologies(repo: any): string[] {
    const topics = repo.topics || [];
    const language = repo.language;
    const technologies: string[] = [];

    if (language) technologies.push(language);
    technologies.push(...topics);

    return technologies.slice(0, 5);
  }

  /**
   * 구현 노트 생성
   */
  private generateImplementationNotes(repo: any, category: TrendSuggestion['category']): string {
    const notes: string[] = [];

    notes.push(`GitHub Stars: ${repo.stargazers_count}`);
    notes.push(`Forks: ${repo.forks_count}`);
    
    if (repo.homepage) {
      notes.push(`Homepage: ${repo.homepage}`);
    }

    if (category === 'ai') {
      notes.push('AI/ML 기능 통합 고려 필요');
    } else if (category === 'security') {
      notes.push('보안 강화 기능으로 활용 가능');
    } else if (category === 'performance') {
      notes.push('성능 최적화에 도움될 수 있음');
    }

    return notes.join('\n');
  }

  /**
   * RSS 파싱 (간단한 버전)
   */
  private parseRSS(xml: string): any[] {
    // 실제로는 rss-parser 라이브러리 사용
    // 여기서는 시뮬레이션
    return [];
  }

  /**
   * 중복 제안 제거
   */
  private deduplicateSuggestions(suggestions: TrendSuggestion[]): TrendSuggestion[] {
    const seen = new Set<string>();
    const unique: TrendSuggestion[] = [];

    for (const suggestion of suggestions) {
      const key = `${suggestion.title}-${suggestion.source}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(suggestion);
      }
    }

    return unique;
  }

  /**
   * 제안 우선순위 정렬
   */
  private prioritizeSuggestions(suggestions: TrendSuggestion[]): TrendSuggestion[] {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    
    return suggestions.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return b.confidence - a.confidence;
    });
  }

  /**
   * 제안 조회
   */
  getSuggestions(filters?: {
    category?: TrendSuggestion['category'];
    priority?: TrendSuggestion['priority'];
    status?: TrendSuggestion['status'];
    limit?: number;
  }): TrendSuggestion[] {
    let suggestions = Array.from(this.suggestions.values());

    if (filters?.category) {
      suggestions = suggestions.filter(s => s.category === filters.category);
    }

    if (filters?.priority) {
      suggestions = suggestions.filter(s => s.priority === filters.priority);
    }

    if (filters?.status) {
      suggestions = suggestions.filter(s => s.status === filters.status);
    }

    suggestions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (filters?.limit) {
      suggestions = suggestions.slice(0, filters.limit);
    }

    return suggestions;
  }

  /**
   * 제안 상태 업데이트
   */
  async updateSuggestionStatus(
    id: string,
    status: TrendSuggestion['status'],
    adminNotes?: string
  ): Promise<void> {
    const suggestion = this.suggestions.get(id);
    if (suggestion) {
      suggestion.status = status;
      if (adminNotes) {
        suggestion.adminNotes = adminNotes;
      }
    }
  }

  /**
   * 주기적 트렌드 수집 시작
   */
  startAutoCollection(intervalMinutes: number = 60): void {
    setInterval(async () => {
      console.log('자동 트렌드 수집 시작...');
      await this.collectTrends();
      console.log('트렌드 수집 완료');
    }, intervalMinutes * 60 * 1000);

    // 즉시 한 번 실행
    this.collectTrends();
  }
}

// 싱글톤 인스턴스
export const autoLearningSystem = new AutoLearningSystem();

