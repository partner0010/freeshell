/**
 * 블록 콘텐츠 타입 정의
 * Block Content Type Definitions
 */

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  social?: Record<string, string>;
}

export interface TeamBlockContent {
  title: string;
  members?: TeamMember[];
}

export interface TimelineItem {
  date: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface TimelineBlockContent {
  title: string;
  items?: TimelineItem[];
  events?: Array<{
    year: string;
    title: string;
    description?: string;
  }>;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface SocialBlockContent {
  title: string;
  subtitle?: string;
  links?: (SocialLink & { followers?: string })[];
}

export interface NewsletterBlockContent {
  title: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
}

export interface LogoItem {
  name: string;
  url: string;
  logo?: string;
}

export interface LogosBlockContent {
  title: string;
  logos?: LogoItem[];
}

export interface CountdownBlockContent {
  title: string;
  targetDate: string;
  description?: string;
}

export interface ProcessStep {
  number: string | number;
  title: string;
  description?: string;
  icon?: string;
}

export interface ProcessBlockContent {
  title: string;
  steps?: ProcessStep[];
}

export interface AccordionItem {
  title: string;
  content: string;
}

export interface AccordionBlockContent {
  title: string;
  items?: Array<AccordionItem | {
    question: string;
    answer: string;
  }>;
}

export interface BannerBlockContent {
  title?: string;
  message?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  linkText?: string;
  linkUrl?: string;
  dismissible?: boolean;
  backgroundImage?: string;
}

export interface ComparisonItem {
  feature: string;
  option1: string | boolean;
  option2: string | boolean;
}

export interface ComparisonBlockContent {
  title: string;
  option1Name?: string;
  option2Name?: string;
  plans?: string[];
  features?: Array<{
    name: string;
    basic?: string;
    pro?: string;
    enterprise?: string;
  }>;
  items?: ComparisonItem[];
}

export interface MapBlockContent {
  title: string;
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  contactInfo?: {
    phone?: string;
    email?: string;
    hours?: string;
  };
}

export type BlockContent =
  | TeamBlockContent
  | TimelineBlockContent
  | SocialBlockContent
  | NewsletterBlockContent
  | LogosBlockContent
  | CountdownBlockContent
  | ProcessBlockContent
  | AccordionBlockContent
  | BannerBlockContent
  | ComparisonBlockContent
  | MapBlockContent;

