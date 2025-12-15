/**
 * 메뉴 조직화 시스템
 * Menu Organization System
 */

export interface MenuItem {
  id: string;
  label: string;
  icon?: any;
  category: string;
  keywords: string[];
  priority: number; // 1-10, 높을수록 먼저 표시
  context?: string[]; // 어떤 상황에서 표시될지
}

export interface MenuCategory {
  id: string;
  label: string;
  icon?: any;
  items: MenuItem[];
  collapsed?: boolean;
}

export interface ContextualMenu {
  context: string;
  items: MenuItem[];
}

// 메뉴 조직화 시스템
export class MenuOrganizer {
  private categories: Map<string, MenuCategory> = new Map();
  private contextualMenus: Map<string, ContextualMenu> = new Map();

  constructor() {
    this.initializeCategories();
    this.initializeContextualMenus();
  }

  private initializeCategories(): void {
    // 주요 기능
    this.addCategory({
      id: 'main',
      label: '주요',
      items: [
        { id: 'blocks', label: '블록', category: 'main', keywords: ['블록', '컴포넌트'], priority: 10 },
        { id: 'styles', label: '스타일', category: 'main', keywords: ['스타일', '디자인'], priority: 9 },
        { id: 'copilot', label: 'AI', category: 'main', keywords: ['AI', '인공지능'], priority: 10 },
        { id: 'pages', label: '페이지', category: 'main', keywords: ['페이지', '화면'], priority: 8 },
      ],
    });

    // AI 기능
    this.addCategory({
      id: 'ai',
      label: 'AI 기능',
      items: [
        { id: 'ai-design', label: 'AI디자인', category: 'ai', keywords: ['AI', '디자인', '자동'], priority: 8 },
        { id: 'ai-improve', label: 'AI개선', category: 'ai', keywords: ['AI', '개선'], priority: 7 },
        { id: 'free-api', label: '무료AI통합', category: 'ai', keywords: ['무료', 'API'], priority: 9 },
        { id: 'advanced-ai', label: '고급AIAPI', category: 'ai', keywords: ['고급', 'API'], priority: 6 },
      ],
    });

    // 디자인
    this.addCategory({
      id: 'design',
      label: '디자인',
      items: [
        { id: 'theme', label: '테마', category: 'design', keywords: ['테마', '색상'], priority: 8 },
        { id: 'gradient', label: '그라디언트', category: 'design', keywords: ['그라디언트'], priority: 6 },
        { id: 'typography', label: '타이포', category: 'design', keywords: ['타이포', '폰트'], priority: 7 },
        { id: 'micro-interactions', label: '마이크로인터랙션', category: 'design', keywords: ['인터랙션'], priority: 5 },
      ],
    });

    // 개발
    this.addCategory({
      id: 'development',
      label: '개발',
      items: [
        { id: 'code-validator', label: '코드검증', category: 'development', keywords: ['코드', '검증'], priority: 8 },
        { id: 'debugging', label: '디버깅', category: 'development', keywords: ['디버깅', '오류'], priority: 9 },
        { id: 'cicd', label: 'CI/CD', category: 'development', keywords: ['CI', 'CD', '배포'], priority: 7 },
        { id: 'website-audit', label: '웹사이트감사', category: 'development', keywords: ['감사', '검증'], priority: 6 },
      ],
    });

    // 보안
    this.addCategory({
      id: 'security',
      label: '보안',
      items: [
        { id: 'security', label: '보안', category: 'security', keywords: ['보안', '보호'], priority: 9 },
        { id: 'code-audit', label: '코드감사', category: 'security', keywords: ['코드', '감사'], priority: 8 },
        { id: 'zero-trust', label: 'Zero Trust', category: 'security', keywords: ['제로트러스트'], priority: 7 },
        { id: 'biometric', label: '생체인증', category: 'security', keywords: ['생체', '인증'], priority: 8 },
        { id: 'security-csp', label: 'CSP보안', category: 'security', keywords: ['CSP'], priority: 6 },
      ],
    });

    // 성능
    this.addCategory({
      id: 'performance',
      label: '성능',
      items: [
        { id: 'performance', label: '성능최적화', category: 'performance', keywords: ['성능', '최적화'], priority: 8 },
        { id: 'performance-advanced', label: '성능최적화+', category: 'performance', keywords: ['고급', '성능'], priority: 6 },
        { id: 'efficiency', label: '효율성최적화', category: 'performance', keywords: ['효율성'], priority: 7 },
      ],
    });

    // 고급 기능
    this.addCategory({
      id: 'advanced',
      label: '고급 기능',
      items: [
        { id: 'advanced', label: '고급기능', category: 'advanced', keywords: ['고급'], priority: 5 },
        { id: 'system', label: '시스템최적화', category: 'advanced', keywords: ['시스템'], priority: 6 },
        { id: 'accessibility', label: '접근성강화', category: 'advanced', keywords: ['접근성'], priority: 7 },
      ],
    });

    // AI 도구
    this.addCategory({
      id: 'ai-tools',
      label: 'AI 도구',
      items: [
        { id: 'ai-writing', label: 'AI글쓰기', category: 'ai-tools', keywords: ['AI', '글쓰기', '교정'], priority: 9 },
        { id: 'recommendations', label: 'AI추천', category: 'ai-tools', keywords: ['AI', '추천'], priority: 8 },
      ],
    });

    // 사용자 경험
    this.addCategory({
      id: 'ux',
      label: '사용자 경험',
      items: [
        { id: 'dashboard', label: '대시보드', category: 'ux', keywords: ['대시보드', '위젯'], priority: 8 },
        { id: 'notifications', label: '알림센터', category: 'ux', keywords: ['알림'], priority: 7 },
        { id: 'high-contrast', label: '고대비모드', category: 'ux', keywords: ['고대비', '접근성'], priority: 6 },
      ],
    });
  }

  private initializeContextualMenus(): void {
    // 개발 모드일 때
    this.addContextualMenu({
      context: 'development',
      items: [
        { id: 'debugging', label: '디버깅', category: 'development', keywords: [], priority: 10, context: ['development'] },
        { id: 'code-validator', label: '코드검증', category: 'development', keywords: [], priority: 9, context: ['development'] },
        { id: 'performance', label: '성능최적화', category: 'performance', keywords: [], priority: 8, context: ['development'] },
      ],
    });

    // 디자인 작업 중일 때
    this.addContextualMenu({
      context: 'designing',
      items: [
        { id: 'styles', label: '스타일', category: 'main', keywords: [], priority: 10, context: ['designing'] },
        { id: 'theme', label: '테마', category: 'design', keywords: [], priority: 9, context: ['designing'] },
        { id: 'ai-design', label: 'AI디자인', category: 'ai', keywords: [], priority: 8, context: ['designing'] },
      ],
    });

    // 보안 검토 중일 때
    this.addContextualMenu({
      context: 'security-review',
      items: [
        { id: 'security', label: '보안', category: 'security', keywords: [], priority: 10, context: ['security-review'] },
        { id: 'code-audit', label: '코드감사', category: 'security', keywords: [], priority: 9, context: ['security-review'] },
        { id: 'website-audit', label: '웹사이트감사', category: 'development', keywords: [], priority: 8, context: ['security-review'] },
      ],
    });
  }

  addCategory(category: MenuCategory): void {
    this.categories.set(category.id, category);
  }

  addContextualMenu(menu: ContextualMenu): void {
    this.contextualMenus.set(menu.context, menu);
  }

  // 카테고리별 메뉴 가져오기
  getCategories(): MenuCategory[] {
    return Array.from(this.categories.values()).map((category) => ({
      ...category,
      items: category.items.sort((a, b) => b.priority - a.priority),
    }));
  }

  // 컨텍스트별 메뉴 가져오기
  getContextualMenu(context: string): MenuItem[] {
    const menu = this.contextualMenus.get(context);
    return menu ? menu.items.sort((a, b) => b.priority - a.priority) : [];
  }

  // 모든 메뉴 항목 가져오기
  getAllItems(): MenuItem[] {
    const items: MenuItem[] = [];
    this.categories.forEach((category) => {
      items.push(...category.items);
    });
    return items.sort((a, b) => b.priority - a.priority);
  }

  // 검색
  searchItems(query: string): MenuItem[] {
    const lowerQuery = query.toLowerCase();
    const allItems = this.getAllItems();

    return allItems.filter((item) => {
      const matchesLabel = item.label.toLowerCase().includes(lowerQuery);
      const matchesKeywords = item.keywords.some((kw) => kw.toLowerCase().includes(lowerQuery));
      return matchesLabel || matchesKeywords;
    });
  }
}

export const menuOrganizer = new MenuOrganizer();

