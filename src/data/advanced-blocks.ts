import { BlockTemplate } from '@/types';

// 추가 고급 블록들
export const advancedBlockTemplates: BlockTemplate[] = [
  // 팀 소개
  {
    type: 'team',
    name: '팀 소개',
    description: '팀원 프로필 카드',
    icon: 'Users',
    category: 'content',
    defaultContent: {
      title: '우리 팀을 소개합니다',
      members: [
        {
          name: '김철수',
          role: 'CEO & Founder',
          bio: '10년 이상의 경험을 가진 기술 리더',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
          social: {
            linkedin: '#',
            twitter: '#',
          },
        },
        {
          name: '이영희',
          role: 'CTO',
          bio: '풀스택 개발자, 시스템 아키텍트',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
          social: {
            linkedin: '#',
            github: '#',
          },
        },
        {
          name: '박민수',
          role: 'Design Lead',
          bio: 'UI/UX 전문가, 디자인 시스템 구축',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
          social: {
            dribbble: '#',
            behance: '#',
          },
        },
      ],
    },
    defaultStyles: {
      backgroundColor: '#FFFFFF',
      padding: 'py-16 px-6',
      alignment: 'center',
    },
  },

  // 타임라인
  {
    type: 'timeline',
    name: '타임라인',
    description: '연혁 및 이벤트 타임라인',
    icon: 'Clock',
    category: 'content',
    defaultContent: {
      title: '우리의 여정',
      events: [
        {
          year: '2024',
          title: '글로벌 확장',
          description: '아시아 태평양 지역 진출',
        },
        {
          year: '2023',
          title: '시리즈 A 투자 유치',
          description: '100억원 규모의 투자 유치 성공',
        },
        {
          year: '2022',
          title: '정식 서비스 런칭',
          description: '베타 테스트 완료 후 정식 서비스 시작',
        },
        {
          year: '2021',
          title: '회사 설립',
          description: '비전을 가진 창업자들이 모여 시작',
        },
      ],
    },
    defaultStyles: {
      backgroundColor: 'bg-pastel-cream',
      padding: 'py-16 px-6',
    },
  },

  // 소셜 미디어 링크
  {
    type: 'social',
    name: '소셜 미디어',
    description: 'SNS 링크 및 팔로우 버튼',
    icon: 'Share2',
    category: 'content',
    defaultContent: {
      title: '소셜 미디어에서 만나요',
      subtitle: '최신 소식을 받아보세요',
      links: [
        { platform: 'instagram', url: '#', followers: '12.5K' },
        { platform: 'twitter', url: '#', followers: '8.2K' },
        { platform: 'youtube', url: '#', followers: '25K' },
        { platform: 'facebook', url: '#', followers: '15.3K' },
        { platform: 'linkedin', url: '#', followers: '5.8K' },
      ],
    },
    defaultStyles: {
      backgroundColor: 'bg-gradient-to-r from-pastel-rose to-pastel-peach',
      padding: 'py-12 px-6',
      alignment: 'center',
    },
  },

  // 지도
  {
    type: 'map',
    name: '지도',
    description: '위치 및 연락처 정보',
    icon: 'MapPin',
    category: 'content',
    defaultContent: {
      title: '오시는 길',
      address: '서울특별시 강남구 테헤란로 123',
      coordinates: {
        lat: 37.5665,
        lng: 126.978,
      },
      contactInfo: {
        phone: '02-1234-5678',
        email: 'contact@example.com',
        hours: '평일 09:00 - 18:00',
      },
    },
    defaultStyles: {
      padding: 'py-16 px-6',
    },
  },

  // 뉴스레터
  {
    type: 'newsletter',
    name: '뉴스레터',
    description: '이메일 구독 폼',
    icon: 'Mail',
    category: 'commerce',
    defaultContent: {
      title: '뉴스레터 구독',
      subtitle: '최신 소식과 유용한 정보를 받아보세요',
      placeholder: '이메일 주소를 입력하세요',
      buttonText: '구독하기',
      privacyText: '구독 시 개인정보 처리방침에 동의합니다.',
    },
    defaultStyles: {
      backgroundColor: 'bg-gradient-to-r from-primary-500 to-primary-600',
      textColor: '#FFFFFF',
      padding: 'py-16 px-6',
      alignment: 'center',
    },
  },

  // 로고 클라우드
  {
    type: 'logos',
    name: '파트너/클라이언트',
    description: '로고 컬렉션',
    icon: 'Building2',
    category: 'content',
    defaultContent: {
      title: '신뢰받는 파트너',
      logos: [
        { name: 'Company 1', url: '#' },
        { name: 'Company 2', url: '#' },
        { name: 'Company 3', url: '#' },
        { name: 'Company 4', url: '#' },
        { name: 'Company 5', url: '#' },
        { name: 'Company 6', url: '#' },
      ],
    },
    defaultStyles: {
      backgroundColor: '#FFFFFF',
      padding: 'py-12 px-6',
    },
  },

  // 비교표
  {
    type: 'comparison',
    name: '비교표',
    description: '제품/서비스 비교',
    icon: 'GitCompare',
    category: 'commerce',
    defaultContent: {
      title: '플랜 비교',
      features: [
        { name: '사용자 수', basic: '5명', pro: '무제한', enterprise: '무제한' },
        { name: '저장 공간', basic: '10GB', pro: '100GB', enterprise: '무제한' },
        { name: 'API 접근', basic: '❌', pro: '✓', enterprise: '✓' },
        { name: '전담 지원', basic: '❌', pro: '❌', enterprise: '✓' },
        { name: '커스텀 도메인', basic: '❌', pro: '✓', enterprise: '✓' },
      ],
      plans: ['Basic', 'Pro', 'Enterprise'],
    },
    defaultStyles: {
      padding: 'py-16 px-6',
    },
  },

  // 카운트다운
  {
    type: 'countdown',
    name: '카운트다운',
    description: '이벤트 카운트다운 타이머',
    icon: 'Timer',
    category: 'utility',
    defaultContent: {
      title: '런칭까지',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      completedMessage: '이벤트가 시작되었습니다!',
    },
    defaultStyles: {
      backgroundColor: 'bg-gradient-to-r from-pastel-lavender to-pastel-sky',
      padding: 'py-16 px-6',
      alignment: 'center',
    },
  },

  // 탭 콘텐츠
  {
    type: 'tabs',
    name: '탭 콘텐츠',
    description: '탭으로 구분된 콘텐츠',
    icon: 'Layers',
    category: 'content',
    defaultContent: {
      tabs: [
        {
          id: 'tab1',
          title: '기능',
          content: '강력한 기능들로 업무 효율을 높이세요.',
        },
        {
          id: 'tab2',
          title: '보안',
          content: '엔터프라이즈급 보안으로 데이터를 보호합니다.',
        },
        {
          id: 'tab3',
          title: '지원',
          content: '24/7 전문 지원팀이 도와드립니다.',
        },
      ],
    },
    defaultStyles: {
      backgroundColor: '#FFFFFF',
      padding: 'py-12 px-6',
    },
  },

  // 아코디언
  {
    type: 'accordion',
    name: '아코디언',
    description: '접었다 펴는 콘텐츠',
    icon: 'ChevronDown',
    category: 'content',
    defaultContent: {
      title: '자주 묻는 질문',
      items: [
        {
          question: '무료 체험 기간은 얼마인가요?',
          answer: '14일간 모든 기능을 무료로 사용하실 수 있습니다. 신용카드 정보 없이 바로 시작할 수 있습니다.',
        },
        {
          question: '언제든지 취소할 수 있나요?',
          answer: '네, 언제든지 구독을 취소하실 수 있습니다. 취소 시에도 결제 기간 동안은 서비스를 계속 이용하실 수 있습니다.',
        },
        {
          question: '데이터는 안전한가요?',
          answer: 'AWS 인프라를 사용하며, 모든 데이터는 암호화되어 저장됩니다. SOC 2 Type II 인증을 받았습니다.',
        },
      ],
    },
    defaultStyles: {
      padding: 'py-16 px-6',
      width: 'container',
    },
  },

  // 배너/알림
  {
    type: 'banner',
    name: '알림 배너',
    description: '상단 공지 배너',
    icon: 'Bell',
    category: 'utility',
    defaultContent: {
      message: '🎉 새로운 기능이 출시되었습니다!',
      linkText: '자세히 보기',
      linkUrl: '#',
      dismissible: true,
    },
    defaultStyles: {
      backgroundColor: 'bg-primary-500',
      textColor: '#FFFFFF',
      padding: 'py-3 px-6',
    },
  },

  // 프로세스/단계
  {
    type: 'process',
    name: '프로세스',
    description: '단계별 설명',
    icon: 'GitBranch',
    category: 'content',
    defaultContent: {
      title: '시작하는 방법',
      steps: [
        {
          number: 1,
          title: '회원가입',
          description: '30초만에 무료로 시작하세요',
        },
        {
          number: 2,
          title: '프로젝트 생성',
          description: '템플릿을 선택하거나 처음부터 시작',
        },
        {
          number: 3,
          title: '디자인',
          description: '드래그 앤 드롭으로 쉽게 편집',
        },
        {
          number: 4,
          title: '게시',
          description: '원클릭으로 웹사이트 공개',
        },
      ],
    },
    defaultStyles: {
      backgroundColor: '#FFFFFF',
      padding: 'py-16 px-6',
    },
  },
];

// 기존 블록 템플릿과 합치기
import { blockTemplates } from './block-templates';

export const allBlockTemplates = [...blockTemplates, ...advancedBlockTemplates];

export const getBlockTemplate = (type: string) => {
  return allBlockTemplates.find(template => template.type === type);
};

