import { Block, BlockType } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { blockTemplates } from './block-templates';

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'portfolio' | 'ecommerce' | 'blog' | 'landing' | 'startup';
  thumbnail: string;
  blocks: BlockType[];
  featured?: boolean;
}

export const pageTemplates: PageTemplate[] = [
  // 비즈니스
  {
    id: 'business-corporate',
    name: '기업 소개',
    description: '전문적인 기업 소개 페이지',
    category: 'business',
    thumbnail: '/templates/business-corporate.png',
    blocks: ['header', 'hero', 'features', 'stats', 'testimonials', 'cta', 'footer'],
    featured: true,
  },
  {
    id: 'business-agency',
    name: '에이전시',
    description: '크리에이티브 에이전시 소개',
    category: 'business',
    thumbnail: '/templates/business-agency.png',
    blocks: ['header', 'hero', 'features', 'testimonials', 'pricing', 'contact', 'footer'],
  },
  {
    id: 'business-consulting',
    name: '컨설팅',
    description: '컨설팅 서비스 소개',
    category: 'business',
    thumbnail: '/templates/business-consulting.png',
    blocks: ['header', 'hero', 'text', 'features', 'stats', 'cta', 'footer'],
  },

  // 포트폴리오
  {
    id: 'portfolio-developer',
    name: '개발자 포트폴리오',
    description: '개발자를 위한 포트폴리오',
    category: 'portfolio',
    thumbnail: '/templates/portfolio-developer.png',
    blocks: ['header', 'hero', 'features', 'stats', 'contact', 'footer'],
    featured: true,
  },
  {
    id: 'portfolio-designer',
    name: '디자이너 포트폴리오',
    description: '디자이너를 위한 포트폴리오',
    category: 'portfolio',
    thumbnail: '/templates/portfolio-designer.png',
    blocks: ['header', 'hero', 'gallery', 'testimonials', 'contact', 'footer'],
  },
  {
    id: 'portfolio-photographer',
    name: '포토그래퍼',
    description: '사진 작가 포트폴리오',
    category: 'portfolio',
    thumbnail: '/templates/portfolio-photographer.png',
    blocks: ['header', 'hero', 'gallery', 'text', 'contact', 'footer'],
  },

  // 이커머스
  {
    id: 'ecommerce-product',
    name: '제품 소개',
    description: '단일 제품 랜딩 페이지',
    category: 'ecommerce',
    thumbnail: '/templates/ecommerce-product.png',
    blocks: ['header', 'hero', 'features', 'testimonials', 'pricing', 'cta', 'footer'],
    featured: true,
  },
  {
    id: 'ecommerce-store',
    name: '온라인 스토어',
    description: '온라인 쇼핑몰 메인',
    category: 'ecommerce',
    thumbnail: '/templates/ecommerce-store.png',
    blocks: ['header', 'hero', 'features', 'stats', 'cta', 'footer'],
  },

  // 블로그
  {
    id: 'blog-personal',
    name: '개인 블로그',
    description: '개인 블로그 메인',
    category: 'blog',
    thumbnail: '/templates/blog-personal.png',
    blocks: ['header', 'hero', 'text', 'cta', 'footer'],
  },
  {
    id: 'blog-magazine',
    name: '매거진',
    description: '온라인 매거진 스타일',
    category: 'blog',
    thumbnail: '/templates/blog-magazine.png',
    blocks: ['header', 'hero', 'features', 'text', 'footer'],
  },

  // 랜딩
  {
    id: 'landing-saas',
    name: 'SaaS 랜딩',
    description: 'SaaS 서비스 소개',
    category: 'landing',
    thumbnail: '/templates/landing-saas.png',
    blocks: ['header', 'hero', 'features', 'pricing', 'testimonials', 'cta', 'footer'],
    featured: true,
  },
  {
    id: 'landing-app',
    name: '앱 소개',
    description: '모바일 앱 소개 페이지',
    category: 'landing',
    thumbnail: '/templates/landing-app.png',
    blocks: ['header', 'hero', 'features', 'stats', 'testimonials', 'cta', 'footer'],
  },
  {
    id: 'landing-event',
    name: '이벤트',
    description: '이벤트/컨퍼런스 소개',
    category: 'landing',
    thumbnail: '/templates/landing-event.png',
    blocks: ['header', 'hero', 'text', 'features', 'pricing', 'contact', 'footer'],
  },

  // 스타트업
  {
    id: 'startup-pitch',
    name: '스타트업 피칭',
    description: '스타트업 소개 페이지',
    category: 'startup',
    thumbnail: '/templates/startup-pitch.png',
    blocks: ['header', 'hero', 'stats', 'features', 'testimonials', 'cta', 'footer'],
    featured: true,
  },
  {
    id: 'startup-waitlist',
    name: '대기자 명단',
    description: '런칭 전 대기자 수집',
    category: 'startup',
    thumbnail: '/templates/startup-waitlist.png',
    blocks: ['header', 'hero', 'features', 'contact', 'footer'],
  },
];

export const templateCategories = [
  { id: 'all', name: '전체', icon: 'LayoutGrid' },
  { id: 'business', name: '비즈니스', icon: 'Briefcase' },
  { id: 'portfolio', name: '포트폴리오', icon: 'User' },
  { id: 'ecommerce', name: '이커머스', icon: 'ShoppingBag' },
  { id: 'blog', name: '블로그', icon: 'FileText' },
  { id: 'landing', name: '랜딩페이지', icon: 'Rocket' },
  { id: 'startup', name: '스타트업', icon: 'Zap' },
];

// 템플릿에서 블록 생성
export function generateBlocksFromTemplate(template: PageTemplate): Block[] {
  return template.blocks.map(blockType => {
    const blockTemplate = blockTemplates.find(t => t.type === blockType);
    if (!blockTemplate) return null;
    
    return {
      id: uuidv4(),
      type: blockTemplate.type,
      content: JSON.parse(JSON.stringify(blockTemplate.defaultContent)),
      styles: JSON.parse(JSON.stringify(blockTemplate.defaultStyles)),
    };
  }).filter(Boolean) as Block[];
}

// 산업별 커스텀 콘텐츠
export const industryContent = {
  technology: {
    hero: {
      title: '혁신적인 기술로 미래를 만들다',
      subtitle: '최첨단 솔루션으로 비즈니스를 혁신하세요',
    },
    features: {
      title: '왜 우리의 기술인가요?',
      items: [
        { icon: 'Cpu', title: 'AI 기반', description: '인공지능으로 자동화된 프로세스' },
        { icon: 'Cloud', title: '클라우드 네이티브', description: '어디서든 접근 가능한 서비스' },
        { icon: 'Shield', title: '엔터프라이즈 보안', description: '기업급 보안 인증' },
      ],
    },
  },
  healthcare: {
    hero: {
      title: '건강한 삶을 위한 파트너',
      subtitle: '전문적인 의료 서비스로 건강을 지켜드립니다',
    },
    features: {
      title: '우리의 의료 서비스',
      items: [
        { icon: 'Heart', title: '전문 의료진', description: '숙련된 의료 전문가 팀' },
        { icon: 'Clock', title: '24시간 케어', description: '언제든 필요할 때 함께합니다' },
        { icon: 'Users', title: '맞춤형 치료', description: '개인별 최적화된 치료 계획' },
      ],
    },
  },
  education: {
    hero: {
      title: '배움의 새로운 시작',
      subtitle: '당신의 성장을 위한 최고의 교육 플랫폼',
    },
    features: {
      title: '학습의 특별함',
      items: [
        { icon: 'BookOpen', title: '전문 커리큘럼', description: '체계적으로 설계된 교육 과정' },
        { icon: 'Video', title: '온라인 강의', description: '언제 어디서나 학습 가능' },
        { icon: 'Award', title: '인증서 발급', description: '공인된 수료 인증서 제공' },
      ],
    },
  },
  restaurant: {
    hero: {
      title: '특별한 맛의 경험',
      subtitle: '정성을 담은 요리로 행복한 순간을 선사합니다',
    },
    features: {
      title: '우리만의 특별함',
      items: [
        { icon: 'ChefHat', title: '셰프의 손맛', description: '검증된 셰프의 특별한 요리' },
        { icon: 'Leaf', title: '신선한 재료', description: '매일 아침 공수되는 신선함' },
        { icon: 'Star', title: '프리미엄 경험', description: '품격 있는 다이닝 경험' },
      ],
    },
  },
  fitness: {
    hero: {
      title: '더 강한 나를 만나다',
      subtitle: '전문 트레이너와 함께하는 맞춤형 피트니스',
    },
    features: {
      title: '피트니스 프로그램',
      items: [
        { icon: 'Dumbbell', title: '퍼스널 트레이닝', description: '1:1 맞춤형 운동 프로그램' },
        { icon: 'Activity', title: '체계적 관리', description: '데이터 기반 건강 관리' },
        { icon: 'Trophy', title: '목표 달성', description: '확실한 결과를 보장합니다' },
      ],
    },
  },
};

