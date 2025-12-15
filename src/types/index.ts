// 블록 타입 정의
export type BlockType = 
  | 'hero'
  | 'header'
  | 'text'
  | 'image'
  | 'gallery'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'contact'
  | 'footer'
  | 'cta'
  | 'stats'
  | 'team'
  | 'faq'
  | 'video'
  | 'divider'
  | 'spacer'
  | 'custom'
  // 고급 블록 타입
  | 'timeline'
  | 'social'
  | 'newsletter'
  | 'logos'
  | 'countdown'
  | 'process'
  | 'accordion'
  | 'banner'
  | 'comparison'
  | 'map'
  | 'tabs';

// 블록 스타일 설정
export interface BlockStyles {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  shadow?: string;
  alignment?: 'left' | 'center' | 'right';
  width?: 'full' | 'container' | 'narrow';
}

// 개별 블록 콘텐츠 타입
export interface HeroContent {
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
}

export interface HeaderContent {
  logo: string;
  menuItems: { label: string; link: string }[];
}

export interface TextContent {
  content: string;
  variant: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'quote';
}

export interface ImageContent {
  src: string;
  alt: string;
  caption?: string;
}

export interface FeaturesContent {
  title: string;
  items: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface TestimonialsContent {
  items: {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  }[];
}

export interface PricingContent {
  title: string;
  plans: {
    name: string;
    price: string;
    period: string;
    features: string[];
    highlighted?: boolean;
    buttonText: string;
  }[];
}

export interface ContactContent {
  title: string;
  description: string;
  fields: {
    type: 'text' | 'email' | 'textarea';
    label: string;
    placeholder: string;
    required: boolean;
  }[];
  submitText: string;
}

export interface FooterContent {
  logo: string;
  description: string;
  links: {
    title: string;
    items: { label: string; link: string }[];
  }[];
  copyright: string;
}

export interface CTAContent {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface StatsContent {
  items: {
    value: string;
    label: string;
  }[];
}

export interface DividerContent {
  style: 'line' | 'dots' | 'wave';
}

export interface SpacerContent {
  height: 'small' | 'medium' | 'large';
}

// 블록 콘텐츠 유니온 타입
export type BlockContent = 
  | HeroContent
  | HeaderContent
  | TextContent
  | ImageContent
  | FeaturesContent
  | TestimonialsContent
  | PricingContent
  | ContactContent
  | FooterContent
  | CTAContent
  | StatsContent
  | DividerContent
  | SpacerContent
  | Record<string, unknown>;

// 블록 정의
export interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
  styles: BlockStyles;
  locked?: boolean;
}

// 페이지 정의
export interface Page {
  id: string;
  name: string;
  slug: string;
  blocks: Block[];
  settings: PageSettings;
}

export interface PageSettings {
  title: string;
  description: string;
  favicon?: string;
  ogImage?: string;
}

// 프로젝트 정의
export interface Project {
  id: string;
  name: string;
  pages: Page[];
  globalStyles: GlobalStyles;
  createdAt: Date;
  updatedAt: Date;
}

export interface GlobalStyles {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: string;
}

// AI 관련 타입
export interface AIRequest {
  prompt: string;
  context?: {
    currentBlocks?: Block[];
    pageType?: string;
    industry?: string;
  };
}

export interface AIResponse {
  blocks?: Block[];
  suggestions?: string[];
  content?: string;
}

// 블록 템플릿
export interface BlockTemplate {
  type: BlockType;
  name: string;
  description: string;
  icon: string;
  defaultContent: BlockContent;
  defaultStyles: BlockStyles;
  category: 'layout' | 'content' | 'media' | 'commerce' | 'utility';
}

