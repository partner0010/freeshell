import { BlockTemplate, BlockType } from '@/types';

export const blockTemplates: BlockTemplate[] = [
  // 레이아웃 블록
  {
    type: 'header',
    name: '헤더',
    description: '로고와 네비게이션 메뉴',
    icon: 'Menu',
    category: 'layout',
    defaultContent: {
      logo: 'My Brand',
      menuItems: [
        { label: '홈', link: '#' },
        { label: '소개', link: '#about' },
        { label: '서비스', link: '#services' },
        { label: '문의', link: '#contact' },
      ],
    },
    defaultStyles: {
      backgroundColor: '#FFFFFF',
      padding: 'py-4 px-6',
      shadow: 'shadow-soft',
    },
  },
  {
    type: 'hero',
    name: '히어로 섹션',
    description: '메인 타이틀과 CTA 버튼',
    icon: 'Sparkles',
    category: 'layout',
    defaultContent: {
      title: '당신의 아이디어를 현실로',
      subtitle: 'AI와 함께 쉽고 빠르게 웹사이트를 만들어보세요',
      buttonText: '시작하기',
      buttonLink: '#',
    },
    defaultStyles: {
      backgroundColor: 'bg-gradient-to-br from-pastel-lavender via-pastel-sky to-pastel-mint',
      padding: 'py-24 px-6',
      alignment: 'center',
    },
  },
  {
    type: 'footer',
    name: '푸터',
    description: '사이트 하단 정보',
    icon: 'Footprints',
    category: 'layout',
    defaultContent: {
      logo: 'My Brand',
      description: '더 나은 디지털 경험을 제공합니다.',
      links: [
        {
          title: '서비스',
          items: [
            { label: '웹 개발', link: '#' },
            { label: '앱 개발', link: '#' },
            { label: '디자인', link: '#' },
          ],
        },
        {
          title: '회사',
          items: [
            { label: '소개', link: '#' },
            { label: '팀', link: '#' },
            { label: '채용', link: '#' },
          ],
        },
      ],
      copyright: '© 2024 My Brand. All rights reserved.',
    },
    defaultStyles: {
      backgroundColor: '#1F2937',
      textColor: '#FFFFFF',
      padding: 'py-12 px-6',
    },
  },

  // 콘텐츠 블록
  {
    type: 'text',
    name: '텍스트',
    description: '제목, 본문, 인용구',
    icon: 'Type',
    category: 'content',
    defaultContent: {
      content: '여기에 텍스트를 입력하세요. 마우스로 클릭하여 편집할 수 있습니다.',
      variant: 'paragraph',
    },
    defaultStyles: {
      padding: 'py-6 px-6',
      alignment: 'left',
      width: 'container',
    },
  },
  {
    type: 'features',
    name: '특징 섹션',
    description: '서비스나 제품의 특징',
    icon: 'Grid3X3',
    category: 'content',
    defaultContent: {
      title: '왜 우리를 선택해야 할까요?',
      items: [
        {
          icon: 'Zap',
          title: '빠른 속도',
          description: '최적화된 성능으로 빠른 로딩 속도를 제공합니다.',
        },
        {
          icon: 'Shield',
          title: '안전한 보안',
          description: '최신 보안 기술로 데이터를 안전하게 보호합니다.',
        },
        {
          icon: 'Heart',
          title: '사용자 중심',
          description: '직관적인 인터페이스로 누구나 쉽게 사용할 수 있습니다.',
        },
      ],
    },
    defaultStyles: {
      backgroundColor: '#FFFFFF',
      padding: 'py-16 px-6',
      alignment: 'center',
    },
  },
  {
    type: 'testimonials',
    name: '후기 섹션',
    description: '고객 후기 및 추천',
    icon: 'Quote',
    category: 'content',
    defaultContent: {
      items: [
        {
          quote: '정말 놀라운 서비스입니다. 덕분에 업무 효율이 200% 향상되었어요!',
          author: '김철수',
          role: 'CEO, 테크스타트업',
        },
        {
          quote: '사용하기 쉽고 결과물도 훌륭합니다. 강력 추천합니다.',
          author: '이영희',
          role: '마케팅 디렉터',
        },
      ],
    },
    defaultStyles: {
      backgroundColor: 'bg-pastel-cream',
      padding: 'py-16 px-6',
    },
  },
  {
    type: 'stats',
    name: '통계 섹션',
    description: '숫자로 보여주는 성과',
    icon: 'BarChart3',
    category: 'content',
    defaultContent: {
      items: [
        { value: '10K+', label: '활성 사용자' },
        { value: '99.9%', label: '가동률' },
        { value: '24/7', label: '고객 지원' },
        { value: '50+', label: '국가' },
      ],
    },
    defaultStyles: {
      backgroundColor: 'bg-gradient-to-r from-primary-500 to-primary-600',
      textColor: '#FFFFFF',
      padding: 'py-12 px-6',
    },
  },
  {
    type: 'faq',
    name: 'FAQ',
    description: '자주 묻는 질문',
    icon: 'HelpCircle',
    category: 'content',
    defaultContent: {
      title: '자주 묻는 질문',
      items: [
        {
          question: '서비스 이용 방법은?',
          answer: '회원가입 후 바로 이용하실 수 있습니다.',
        },
        {
          question: '환불 정책은 어떻게 되나요?',
          answer: '구매 후 7일 이내 전액 환불이 가능합니다.',
        },
      ],
    },
    defaultStyles: {
      padding: 'py-16 px-6',
      width: 'container',
    },
  },

  // 미디어 블록
  {
    type: 'image',
    name: '이미지',
    description: '단일 이미지',
    icon: 'Image',
    category: 'media',
    defaultContent: {
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      alt: '이미지 설명',
      caption: '',
    },
    defaultStyles: {
      padding: 'py-6 px-6',
      borderRadius: 'rounded-2xl',
      alignment: 'center',
    },
  },
  {
    type: 'gallery',
    name: '갤러리',
    description: '이미지 그리드',
    icon: 'LayoutGrid',
    category: 'media',
    defaultContent: {
      images: [
        { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', alt: '이미지 1' },
        { src: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400', alt: '이미지 2' },
        { src: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400', alt: '이미지 3' },
      ],
      columns: 3,
    },
    defaultStyles: {
      padding: 'py-8 px-6',
    },
  },
  {
    type: 'video',
    name: '비디오',
    description: 'YouTube 또는 비디오 임베드',
    icon: 'Play',
    category: 'media',
    defaultContent: {
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: '비디오 제목',
    },
    defaultStyles: {
      padding: 'py-8 px-6',
      alignment: 'center',
    },
  },

  // 상업용 블록
  {
    type: 'pricing',
    name: '가격표',
    description: '요금제 비교',
    icon: 'CreditCard',
    category: 'commerce',
    defaultContent: {
      title: '합리적인 가격',
      plans: [
        {
          name: 'Starter',
          price: '₩29,000',
          period: '/월',
          features: ['5개 프로젝트', '기본 분석', '이메일 지원'],
          buttonText: '시작하기',
        },
        {
          name: 'Pro',
          price: '₩79,000',
          period: '/월',
          features: ['무제한 프로젝트', '고급 분석', '우선 지원', 'API 접근'],
          highlighted: true,
          buttonText: '가장 인기',
        },
        {
          name: 'Enterprise',
          price: '문의',
          period: '',
          features: ['맞춤 솔루션', '전담 매니저', 'SLA 보장', '온프레미스'],
          buttonText: '문의하기',
        },
      ],
    },
    defaultStyles: {
      padding: 'py-16 px-6',
      alignment: 'center',
    },
  },
  {
    type: 'cta',
    name: 'CTA 배너',
    description: '행동 유도 배너',
    icon: 'MousePointer',
    category: 'commerce',
    defaultContent: {
      title: '지금 바로 시작하세요',
      description: '14일 무료 체험으로 모든 기능을 경험해보세요.',
      buttonText: '무료 체험 시작',
      buttonLink: '#',
    },
    defaultStyles: {
      backgroundColor: 'bg-gradient-to-r from-pastel-rose to-pastel-peach',
      padding: 'py-16 px-6',
      alignment: 'center',
    },
  },
  {
    type: 'contact',
    name: '문의 폼',
    description: '연락처 및 문의 양식',
    icon: 'Mail',
    category: 'commerce',
    defaultContent: {
      title: '문의하기',
      description: '궁금한 점이 있으시면 언제든 문의해주세요.',
      fields: [
        { type: 'text', label: '이름', placeholder: '홍길동', required: true },
        { type: 'email', label: '이메일', placeholder: 'example@email.com', required: true },
        { type: 'textarea', label: '메시지', placeholder: '문의 내용을 입력해주세요', required: true },
      ],
      submitText: '문의 보내기',
    },
    defaultStyles: {
      padding: 'py-16 px-6',
      width: 'narrow',
    },
  },

  // 유틸리티 블록
  {
    type: 'divider',
    name: '구분선',
    description: '섹션 구분선',
    icon: 'Minus',
    category: 'utility',
    defaultContent: {
      style: 'line',
    },
    defaultStyles: {
      padding: 'py-4 px-6',
    },
  },
  {
    type: 'spacer',
    name: '여백',
    description: '빈 공간 추가',
    icon: 'MoveVertical',
    category: 'utility',
    defaultContent: {
      height: 'medium',
    },
    defaultStyles: {},
  },
];

export const getBlockTemplate = (type: BlockType): BlockTemplate | undefined => {
  return blockTemplates.find(template => template.type === type);
};

export const getBlocksByCategory = (category: BlockTemplate['category']): BlockTemplate[] => {
  return blockTemplates.filter(template => template.category === category);
};

