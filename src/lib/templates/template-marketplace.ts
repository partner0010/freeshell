/**
 * 템플릿 마켓플레이스
 * Template Marketplace System
 */

export interface Template {
  id: string;
  name: string;
  description: string;
  author: string;
  category: string;
  thumbnail: string;
  tags: string[];
  downloads: number;
  rating: number;
  price: 'free' | 'premium';
  createdAt: Date;
  updatedAt: Date;
  config: Record<string, any>;
}

export interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

// 템플릿 마켓플레이스
export class TemplateMarketplace {
  private templates: Map<string, Template> = new Map();
  private categories: Map<string, TemplateCategory> = new Map();

  constructor() {
    this.initCategories();
    this.initSampleTemplates();
  }

  private initCategories(): void {
    const categories: TemplateCategory[] = [
      { id: 'landing', name: '랜딩 페이지', icon: '🎯', count: 0 },
      { id: 'portfolio', name: '포트폴리오', icon: '💼', count: 0 },
      { id: 'blog', name: '블로그', icon: '📝', count: 0 },
      { id: 'ecommerce', name: '이커머스', icon: '🛒', count: 0 },
      { id: 'corporate', name: '기업', icon: '🏢', count: 0 },
      { id: 'portfolio', name: '포트폴리오', icon: '🎨', count: 0 },
    ];

    categories.forEach((cat) => {
      this.categories.set(cat.id, cat);
    });
  }

  private initSampleTemplates(): void {
    const templates: Template[] = [
      {
        id: 'template-1',
        name: '모던 랜딩 페이지',
        description: '깔끔하고 현대적인 디자인의 랜딩 페이지 템플릿',
        author: 'GRIP Team',
        category: 'landing',
        thumbnail: '/templates/landing-1.jpg',
        tags: ['모던', '미니멀', '반응형'],
        downloads: 1234,
        rating: 4.8,
        price: 'free',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-20'),
        config: {},
      },
      {
        id: 'template-2',
        name: '포트폴리오 웹사이트',
        description: '크리에이터를 위한 포트폴리오 템플릿',
        author: 'Community',
        category: 'portfolio',
        thumbnail: '/templates/portfolio-1.jpg',
        tags: ['포트폴리오', '크리에이터', '갤러리'],
        downloads: 856,
        rating: 4.6,
        price: 'free',
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-11-15'),
        config: {},
      },
    ];

    templates.forEach((template) => {
      this.templates.set(template.id, template);
    });
  }

  // 템플릿 검색
  searchTemplates(query: string, category?: string): Template[] {
    let results = Array.from(this.templates.values());

    if (category) {
      results = results.filter((t) => t.category === category);
    }

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return results.sort((a, b) => b.downloads - a.downloads);
  }

  // 템플릿 가져오기
  getTemplate(id: string): Template | undefined {
    return this.templates.get(id);
  }

  // 카테고리 가져오기
  getCategories(): TemplateCategory[] {
    return Array.from(this.categories.values());
  }

  // 템플릿 다운로드
  downloadTemplate(id: string): Template | null {
    const template = this.templates.get(id);
    if (template) {
      template.downloads++;
      return template;
    }
    return null;
  }

  // 템플릿 업로드 (커뮤니티)
  uploadTemplate(template: Omit<Template, 'id' | 'downloads' | 'rating' | 'createdAt' | 'updatedAt'>): Template {
    const newTemplate: Template = {
      ...template,
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      downloads: 0,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.templates.set(newTemplate.id, newTemplate);
    return newTemplate;
  }
}

export const templateMarketplace = new TemplateMarketplace();

