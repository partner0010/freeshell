/**
 * 도메인별 AI 자동 학습 시스템
 * 각 메뉴의 AI가 자신의 기능에 맞게 실제 온라인 데이터를 통해 자동 학습
 */

import { onlineLearningSystem, OnlineTrend } from './online-learning';

export interface DomainLearningResult {
  domain: string;
  learnedPatterns: string[];
  improvements: string[];
  recommendations: string[];
  onlineTrends: OnlineTrend[];
  timestamp: Date;
}

export interface UserInteraction {
  domain: string;
  action: string;
  input: string;
  output: string;
  feedback?: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
}

/**
 * 도메인별 AI 학습 시스템
 */
export class DomainSpecificLearningSystem {
  private interactions: Map<string, UserInteraction[]> = new Map();
  private learnedPatterns: Map<string, any[]> = new Map();

  /**
   * 사용자 상호작용 기록
   */
  recordInteraction(domain: string, interaction: Omit<UserInteraction, 'domain' | 'timestamp'>): void {
    if (!this.interactions.has(domain)) {
      this.interactions.set(domain, []);
    }

    const interactions = this.interactions.get(domain)!;
    interactions.push({
      ...interaction,
      domain,
      timestamp: new Date(),
    });

    // 오래된 상호작용 제거 (최근 1000개만 유지)
    if (interactions.length > 1000) {
      interactions.shift();
    }
  }

  /**
   * 도메인별 학습 실행
   */
  async learnForDomain(domain: string): Promise<DomainLearningResult> {
    const interactions = this.interactions.get(domain) || [];
    const patterns: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];

    switch (domain) {
      case 'chat':
        return await this.learnChatPatterns(interactions);
      case 'code':
        return await this.learnCodePatterns(interactions);
      case 'content':
        return await this.learnContentPatterns(interactions);
      case 'image':
        return await this.learnImagePatterns(interactions);
      case 'video':
        return await this.learnVideoPatterns(interactions);
      case 'security':
        return await this.learnSecurityPatterns(interactions);
      case 'signature':
        return await this.learnSignaturePatterns(interactions);
      case 'debug':
        return await this.learnDebugPatterns(interactions);
      case 'validate':
        return await this.learnValidatePatterns(interactions);
      default:
        return {
          domain,
          learnedPatterns: [],
          improvements: [],
          recommendations: [],
          onlineTrends: [],
          timestamp: new Date(),
        };
    }
  }

  /**
   * 채팅 AI 학습 (SHELL) - 실제 온라인 데이터 활용
   */
  private async learnChatPatterns(interactions: UserInteraction[]): Promise<DomainLearningResult> {
    const patterns: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];
    const onlineTrends: OnlineTrend[] = [];

    // 실제 온라인에서 최신 AI 트렌드 수집
    try {
      const aiTrends = await onlineLearningSystem.fetchAITrends();
      onlineTrends.push(...aiTrends);
      
      // 최신 AI 모델 정보 학습
      aiTrends.forEach(trend => {
        if (trend.relevance === 'high') {
          patterns.push(`최신 AI 모델: ${trend.title} - ${trend.description}`);
          recommendations.push(`${trend.title} 기능을 채팅 AI에 통합 검토`);
        }
      });
    } catch (error) {
      console.error('온라인 AI 트렌드 수집 실패:', error);
    }

    // 자주 묻는 질문 패턴 분석
    const commonQuestions = this.extractCommonPatterns(interactions, 'input');
    patterns.push(...commonQuestions.map(p => `자주 묻는 질문: ${p}`));

    // 긍정적 피드백이 많은 답변 패턴
    const positivePatterns = interactions
      .filter(i => i.feedback === 'positive')
      .map(i => i.output);
    if (positivePatterns.length > 0) {
      patterns.push('긍정적 피드백을 받은 답변 패턴 발견');
      improvements.push('긍정적 피드백 패턴을 더 자주 사용');
    }

    // 부정적 피드백이 많은 답변 패턴
    const negativePatterns = interactions
      .filter(i => i.feedback === 'negative')
      .map(i => i.output);
    if (negativePatterns.length > 0) {
      improvements.push('부정적 피드백 패턴을 피하도록 개선');
    }

    // 언어별 사용 빈도
    const languagePatterns = this.analyzeLanguageUsage(interactions);
    patterns.push(...languagePatterns);

    // 코드 관련 질문 빈도
    const codeQuestions = interactions.filter(i => 
      i.input.toLowerCase().includes('코드') || 
      i.input.toLowerCase().includes('code')
    );
    if (codeQuestions.length > interactions.length * 0.3) {
      recommendations.push('코드 생성 기능 강화 필요');
    }

    return {
      domain: 'chat',
      learnedPatterns: patterns,
      improvements,
      recommendations,
      onlineTrends,
      timestamp: new Date(),
    };
  }

  /**
   * 코드 생성 AI 학습 - 실제 온라인 데이터 활용
   */
  private async learnCodePatterns(interactions: UserInteraction[]): Promise<DomainLearningResult> {
    const patterns: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];
    const onlineTrends: OnlineTrend[] = [];

    // 실제 온라인에서 최신 프로그래밍 트렌드 수집
    try {
      const [githubTrends, npmTrends] = await Promise.all([
        onlineLearningSystem.fetchGitHubTrending(),
        onlineLearningSystem.fetchNpmTrending(),
      ]);
      
      onlineTrends.push(...githubTrends, ...npmTrends);

      // GitHub 트렌딩 저장소 학습
      githubTrends.slice(0, 10).forEach(trend => {
        patterns.push(`인기 저장소: ${trend.title} (${trend.tags.join(', ')})`);
        if (trend.relevance === 'high') {
          recommendations.push(`${trend.title} 기능을 코드 생성에 반영 검토`);
        }
      });

      // npm 트렌딩 패키지 학습
      npmTrends.forEach(trend => {
        patterns.push(`인기 패키지: ${trend.title}`);
        recommendations.push(`${trend.title} 패키지 사용법 학습 필요`);
      });
    } catch (error) {
      console.error('온라인 코드 트렌드 수집 실패:', error);
    }

    // 자주 요청되는 언어/프레임워크
    const languages = this.extractLanguages(interactions);
    patterns.push(...languages.map(l => `인기 언어: ${l}`));

    // 자주 생성되는 코드 패턴
    const codePatterns = this.extractCodePatterns(interactions);
    patterns.push(...codePatterns);

    // 에러 발생 패턴
    const errorPatterns = interactions
      .filter(i => i.output.includes('error') || i.output.includes('오류'))
      .map(i => i.input);
    if (errorPatterns.length > 0) {
      improvements.push('에러 발생 패턴 개선 필요');
    }

    // 성공적인 코드 생성 패턴
    const successPatterns = interactions
      .filter(i => i.feedback === 'positive')
      .map(i => i.input);
    if (successPatterns.length > 0) {
      patterns.push('성공적인 코드 생성 패턴 발견');
    }

    return {
      domain: 'code',
      learnedPatterns: patterns,
      improvements,
      recommendations,
      onlineTrends,
      timestamp: new Date(),
    };
  }

  /**
   * 콘텐츠 생성 AI 학습 - 실제 온라인 데이터 활용
   */
  private async learnContentPatterns(interactions: UserInteraction[]): Promise<DomainLearningResult> {
    const patterns: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];
    const onlineTrends: OnlineTrend[] = [];

    // 실제 온라인에서 최신 콘텐츠 트렌드 수집
    try {
      // GitHub에서 콘텐츠 관련 저장소 수집
      const githubTrends = await onlineLearningSystem.fetchGitHubTrending();
      const contentRelatedTrends = githubTrends.filter(trend => 
        trend.tags.some(tag => 
          ['content', 'blog', 'writing', 'markdown', 'cms'].includes(tag.toLowerCase())
        )
      );
      
      onlineTrends.push(...contentRelatedTrends);
      
      contentRelatedTrends.forEach(trend => {
        patterns.push(`콘텐츠 도구 트렌드: ${trend.title}`);
        recommendations.push(`${trend.title} 기능을 콘텐츠 생성에 통합 검토`);
      });
    } catch (error) {
      console.error('온라인 콘텐츠 트렌드 수집 실패:', error);
    }

    // 인기 콘텐츠 주제
    const topics = this.extractTopics(interactions);
    patterns.push(...topics.map(t => `인기 주제: ${t}`));

    // 콘텐츠 길이 패턴
    const lengthPatterns = this.analyzeContentLength(interactions);
    patterns.push(...lengthPatterns);

    // 스타일 선호도
    const stylePatterns = this.analyzeStylePreferences(interactions);
    patterns.push(...stylePatterns);

    return {
      domain: 'content',
      learnedPatterns: patterns,
      improvements,
      recommendations,
      onlineTrends,
      timestamp: new Date(),
    };
  }

  /**
   * 이미지 생성 AI 학습 - 실제 온라인 데이터 활용
   */
  private async learnImagePatterns(interactions: UserInteraction[]): Promise<DomainLearningResult> {
    const patterns: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];
    const onlineTrends: OnlineTrend[] = [];

    // 실제 온라인에서 최신 이미지 생성 기술 수집
    try {
      const githubTrends = await onlineLearningSystem.fetchGitHubTrending();
      const imageRelatedTrends = githubTrends.filter(trend => 
        trend.tags.some(tag => 
          ['image', 'ai', 'stable-diffusion', 'dall-e', 'midjourney', 'generation'].includes(tag.toLowerCase())
        )
      );
      
      onlineTrends.push(...imageRelatedTrends);
      
      imageRelatedTrends.forEach(trend => {
        patterns.push(`최신 이미지 생성 기술: ${trend.title}`);
        recommendations.push(`${trend.title} 기능을 이미지 생성에 통합 검토`);
      });
    } catch (error) {
      console.error('온라인 이미지 트렌드 수집 실패:', error);
    }

    // 인기 이미지 스타일
    const styles = this.extractImageStyles(interactions);
    patterns.push(...styles.map(s => `인기 스타일: ${s}`));

    // 이미지 크기 선호도
    const sizePatterns = this.analyzeImageSizes(interactions);
    patterns.push(...sizePatterns);

    // 색상 선호도
    const colorPatterns = this.analyzeColorPreferences(interactions);
    patterns.push(...colorPatterns);

    return {
      domain: 'image',
      learnedPatterns: patterns,
      improvements,
      recommendations,
      onlineTrends,
      timestamp: new Date(),
    };
  }

  /**
   * 영상 생성 AI 학습 - 실제 온라인 데이터 활용
   */
  private async learnVideoPatterns(interactions: UserInteraction[]): Promise<DomainLearningResult> {
    const patterns: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];
    const onlineTrends: OnlineTrend[] = [];

    // 실제 온라인에서 최신 영상 생성 기술 수집
    try {
      const githubTrends = await onlineLearningSystem.fetchGitHubTrending();
      const videoRelatedTrends = githubTrends.filter(trend => 
        trend.tags.some(tag => 
          ['video', 'ai', 'generation', 'animation', 'ffmpeg'].includes(tag.toLowerCase())
        )
      );
      
      onlineTrends.push(...videoRelatedTrends);
      
      videoRelatedTrends.forEach(trend => {
        patterns.push(`최신 영상 생성 기술: ${trend.title}`);
        recommendations.push(`${trend.title} 기능을 영상 생성에 통합 검토`);
      });
    } catch (error) {
      console.error('온라인 영상 트렌드 수집 실패:', error);
    }

    // 인기 영상 길이
    const durationPatterns = this.analyzeVideoDuration(interactions);
    patterns.push(...durationPatterns);

    // 영상 스타일 선호도
    const stylePatterns = this.analyzeVideoStyles(interactions);
    patterns.push(...stylePatterns);

    return {
      domain: 'video',
      learnedPatterns: patterns,
      improvements,
      recommendations,
      onlineTrends,
      timestamp: new Date(),
    };
  }

  /**
   * 보안 AI 학습 - 실제 온라인 데이터 활용
   */
  private async learnSecurityPatterns(interactions: UserInteraction[]): Promise<DomainLearningResult> {
    const patterns: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];
    const onlineTrends: OnlineTrend[] = [];

    // 실제 온라인에서 최신 보안 트렌드 수집
    try {
      const securityTrends = await onlineLearningSystem.fetchSecurityTrends();
      onlineTrends.push(...securityTrends);
      
      securityTrends.forEach(trend => {
        patterns.push(`최신 보안 이슈: ${trend.title} - ${trend.description}`);
        if (trend.relevance === 'high') {
          recommendations.push(`긴급: ${trend.title} 보안 패치 적용 필요`);
          improvements.push(`${trend.title}에 대한 방어 메커니즘 강화`);
        }
      });
    } catch (error) {
      console.error('온라인 보안 트렌드 수집 실패:', error);
    }

    // 자주 감지되는 위협 패턴
    const threatPatterns = this.extractThreatPatterns(interactions);
    patterns.push(...threatPatterns);

    // 차단 성공 패턴
    const blockPatterns = interactions.filter(i => 
      i.output.includes('차단') || i.output.includes('blocked')
    );
    if (blockPatterns.length > 0) {
      patterns.push('성공적인 위협 차단 패턴 발견');
    }

    return {
      domain: 'security',
      learnedPatterns: patterns,
      improvements,
      recommendations,
      onlineTrends,
      timestamp: new Date(),
    };
  }

  /**
   * 전자서명 AI 학습 - 실제 온라인 데이터 활용
   */
  private async learnSignaturePatterns(interactions: UserInteraction[]): Promise<DomainLearningResult> {
    const patterns: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];
    const onlineTrends: OnlineTrend[] = [];

    // 실제 온라인에서 최신 전자서명 기술 수집
    try {
      const githubTrends = await onlineLearningSystem.fetchGitHubTrending();
      const signatureRelatedTrends = githubTrends.filter(trend => 
        trend.tags.some(tag => 
          ['signature', 'pdf', 'document', 'e-signature', 'digital'].includes(tag.toLowerCase())
        )
      );
      
      onlineTrends.push(...signatureRelatedTrends);
      
      signatureRelatedTrends.forEach(trend => {
        patterns.push(`최신 전자서명 기술: ${trend.title}`);
        recommendations.push(`${trend.title} 기능을 전자서명에 통합 검토`);
      });
    } catch (error) {
      console.error('온라인 전자서명 트렌드 수집 실패:', error);
    }

    // 자주 사용되는 문서 유형
    const documentTypes = this.extractDocumentTypes(interactions);
    patterns.push(...documentTypes);

    // 서명자 수 패턴
    const signerPatterns = this.analyzeSignerCounts(interactions);
    patterns.push(...signerPatterns);

    return {
      domain: 'signature',
      learnedPatterns: patterns,
      improvements,
      recommendations,
      onlineTrends,
      timestamp: new Date(),
    };
  }

  /**
   * 디버깅 AI 학습 - 실제 온라인 데이터 활용
   */
  private async learnDebugPatterns(interactions: UserInteraction[]): Promise<DomainLearningResult> {
    const patterns: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];
    const onlineTrends: OnlineTrend[] = [];

    // 실제 온라인에서 최신 디버깅 도구 수집
    try {
      const [githubTrends, npmTrends] = await Promise.all([
        onlineLearningSystem.fetchGitHubTrending(),
        onlineLearningSystem.fetchNpmTrending(),
      ]);
      
      const debugRelatedTrends = [
        ...githubTrends.filter(trend => 
          trend.tags.some(tag => 
            ['debug', 'debugger', 'testing', 'error', 'logging'].includes(tag.toLowerCase())
          )
        ),
        ...npmTrends.filter(trend => 
          trend.tags.some(tag => 
            ['debug', 'debugger', 'testing'].includes(tag.toLowerCase())
          )
        ),
      ];
      
      onlineTrends.push(...debugRelatedTrends);
      
      debugRelatedTrends.forEach(trend => {
        patterns.push(`최신 디버깅 도구: ${trend.title}`);
        recommendations.push(`${trend.title} 기능을 디버깅에 통합 검토`);
      });
    } catch (error) {
      console.error('온라인 디버깅 트렌드 수집 실패:', error);
    }

    // 자주 발생하는 에러 유형
    const errorTypes = this.extractErrorTypes(interactions);
    patterns.push(...errorTypes);

    // 성공적인 디버깅 패턴
    const successPatterns = interactions.filter(i => 
      i.feedback === 'positive'
    );
    if (successPatterns.length > 0) {
      patterns.push('성공적인 디버깅 패턴 발견');
    }

    return {
      domain: 'debug',
      learnedPatterns: patterns,
      improvements,
      recommendations,
      onlineTrends,
      timestamp: new Date(),
    };
  }

  /**
   * 사이트 검증 AI 학습 - 실제 온라인 데이터 활용
   */
  private async learnValidatePatterns(interactions: UserInteraction[]): Promise<DomainLearningResult> {
    const patterns: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];
    const onlineTrends: OnlineTrend[] = [];

    // 실제 온라인에서 최신 검증 도구 및 표준 수집
    try {
      const [githubTrends, npmTrends] = await Promise.all([
        onlineLearningSystem.fetchGitHubTrending(),
        onlineLearningSystem.fetchNpmTrending(),
      ]);
      
      const validateRelatedTrends = [
        ...githubTrends.filter(trend => 
          trend.tags.some(tag => 
            ['validation', 'testing', 'quality', 'lighthouse', 'performance'].includes(tag.toLowerCase())
          )
        ),
        ...npmTrends.filter(trend => 
          trend.tags.some(tag => 
            ['validation', 'testing', 'quality'].includes(tag.toLowerCase())
          )
        ),
      ];
      
      onlineTrends.push(...validateRelatedTrends);
      
      validateRelatedTrends.forEach(trend => {
        patterns.push(`최신 검증 도구: ${trend.title}`);
        recommendations.push(`${trend.title} 기능을 사이트 검증에 통합 검토`);
      });
    } catch (error) {
      console.error('온라인 검증 트렌드 수집 실패:', error);
    }

    // 자주 발견되는 문제 유형
    const issueTypes = this.extractIssueTypes(interactions);
    patterns.push(...issueTypes);

    // 자동 수정 성공 패턴
    const fixPatterns = interactions.filter(i => 
      i.output.includes('수정') || i.output.includes('fixed')
    );
    if (fixPatterns.length > 0) {
      patterns.push('자동 수정 성공 패턴 발견');
    }

    return {
      domain: 'validate',
      learnedPatterns: patterns,
      improvements,
      recommendations,
      onlineTrends,
      timestamp: new Date(),
    };
  }

  // 유틸리티 함수들
  private extractCommonPatterns(interactions: UserInteraction[], field: 'input' | 'output'): string[] {
    const patterns = new Map<string, number>();
    
    interactions.forEach(interaction => {
      const text = interaction[field].toLowerCase();
      const words = text.split(/\s+/).filter(w => w.length > 3);
      words.forEach(word => {
        patterns.set(word, (patterns.get(word) || 0) + 1);
      });
    });

    return Array.from(patterns.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  private analyzeLanguageUsage(interactions: UserInteraction[]): string[] {
    const languages = new Map<string, number>();
    
    interactions.forEach(interaction => {
      const text = interaction.input;
      // 한국어 감지
      if (/[가-힣]/.test(text)) {
        languages.set('한국어', (languages.get('한국어') || 0) + 1);
      }
      // 영어 감지
      if (/[a-zA-Z]/.test(text)) {
        languages.set('영어', (languages.get('영어') || 0) + 1);
      }
    });

    return Array.from(languages.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([lang, count]) => `${lang}: ${count}회`);
  }

  private extractLanguages(interactions: UserInteraction[]): string[] {
    const languages = new Set<string>();
    const languageKeywords: Record<string, string[]> = {
      'javascript': ['javascript', 'js', 'node'],
      'typescript': ['typescript', 'ts'],
      'python': ['python', 'py'],
      'react': ['react', 'jsx'],
      'nextjs': ['nextjs', 'next.js'],
    };

    interactions.forEach(interaction => {
      const text = interaction.input.toLowerCase();
      Object.entries(languageKeywords).forEach(([lang, keywords]) => {
        if (keywords.some(keyword => text.includes(keyword))) {
          languages.add(lang);
        }
      });
    });

    return Array.from(languages);
  }

  private extractCodePatterns(interactions: UserInteraction[]): string[] {
    const patterns: string[] = [];
    
    // 함수 생성 패턴
    const functionCount = interactions.filter(i => 
      i.input.includes('함수') || i.input.includes('function')
    ).length;
    if (functionCount > 0) {
      patterns.push(`함수 생성 요청: ${functionCount}회`);
    }

    // 컴포넌트 생성 패턴
    const componentCount = interactions.filter(i => 
      i.input.includes('컴포넌트') || i.input.includes('component')
    ).length;
    if (componentCount > 0) {
      patterns.push(`컴포넌트 생성 요청: ${componentCount}회`);
    }

    return patterns;
  }

  private extractTopics(interactions: UserInteraction[]): string[] {
    const topics = new Map<string, number>();
    
    interactions.forEach(interaction => {
      const words = interaction.input.split(/\s+/).filter(w => w.length > 2);
      words.forEach(word => {
        topics.set(word, (topics.get(word) || 0) + 1);
      });
    });

    return Array.from(topics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);
  }

  private analyzeContentLength(interactions: UserInteraction[]): string[] {
    const lengths = interactions.map(i => i.output.length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    
    return [
      `평균 콘텐츠 길이: ${Math.round(avgLength)}자`,
      `최소 길이: ${Math.min(...lengths)}자`,
      `최대 길이: ${Math.max(...lengths)}자`,
    ];
  }

  private analyzeStylePreferences(interactions: UserInteraction[]): string[] {
    const styles = new Map<string, number>();
    
    interactions.forEach(interaction => {
      const text = interaction.input.toLowerCase();
      if (text.includes('공식') || text.includes('formal')) {
        styles.set('공식', (styles.get('공식') || 0) + 1);
      }
      if (text.includes('캐주얼') || text.includes('casual')) {
        styles.set('캐주얼', (styles.get('캐주얼') || 0) + 1);
      }
      if (text.includes('유머') || text.includes('humor')) {
        styles.set('유머', (styles.get('유머') || 0) + 1);
      }
    });

    return Array.from(styles.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([style, count]) => `${style}: ${count}회`);
  }

  private extractImageStyles(interactions: UserInteraction[]): string[] {
    const styles = new Set<string>();
    const styleKeywords: Record<string, string[]> = {
      '리얼리스틱': ['리얼', 'realistic', '사진'],
      '애니메이션': ['애니', 'animation', '만화'],
      '3D': ['3d', 'three'],
      '미니멀': ['미니멀', 'minimal'],
    };

    interactions.forEach(interaction => {
      const text = interaction.input.toLowerCase();
      Object.entries(styleKeywords).forEach(([style, keywords]) => {
        if (keywords.some(keyword => text.includes(keyword))) {
          styles.add(style);
        }
      });
    });

    return Array.from(styles);
  }

  private analyzeImageSizes(interactions: UserInteraction[]): string[] {
    const sizes = new Map<string, number>();
    
    interactions.forEach(interaction => {
      const text = interaction.input.toLowerCase();
      if (text.includes('1920') || text.includes('1080')) {
        sizes.set('1920x1080', (sizes.get('1920x1080') || 0) + 1);
      }
      if (text.includes('512') || text.includes('1024')) {
        sizes.set('512x512', (sizes.get('512x512') || 0) + 1);
      }
    });

    return Array.from(sizes.entries())
      .map(([size, count]) => `${size}: ${count}회`);
  }

  private analyzeColorPreferences(interactions: UserInteraction[]): string[] {
    const colors = new Map<string, number>();
    const colorKeywords = ['빨강', '파랑', '초록', '노랑', '검정', '흰색'];
    
    interactions.forEach(interaction => {
      const text = interaction.input;
      colorKeywords.forEach(color => {
        if (text.includes(color)) {
          colors.set(color, (colors.get(color) || 0) + 1);
        }
      });
    });

    return Array.from(colors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([color, count]) => `${color}: ${count}회`);
  }

  private analyzeVideoDuration(interactions: UserInteraction[]): string[] {
    const durations = new Map<string, number>();
    
    interactions.forEach(interaction => {
      const text = interaction.input;
      if (text.includes('15초') || text.includes('15 second')) {
        durations.set('15초', (durations.get('15초') || 0) + 1);
      }
      if (text.includes('30초') || text.includes('30 second')) {
        durations.set('30초', (durations.get('30초') || 0) + 1);
      }
      if (text.includes('60초') || text.includes('1분')) {
        durations.set('60초', (durations.get('60초') || 0) + 1);
      }
    });

    return Array.from(durations.entries())
      .map(([duration, count]) => `${duration}: ${count}회`);
  }

  private analyzeVideoStyles(interactions: UserInteraction[]): string[] {
    return this.analyzeStylePreferences(interactions);
  }

  private extractThreatPatterns(interactions: UserInteraction[]): string[] {
    const threats = new Map<string, number>();
    
    interactions.forEach(interaction => {
      const text = interaction.input.toLowerCase();
      if (text.includes('sql') || text.includes('injection')) {
        threats.set('SQL Injection', (threats.get('SQL Injection') || 0) + 1);
      }
      if (text.includes('xss')) {
        threats.set('XSS', (threats.get('XSS') || 0) + 1);
      }
      if (text.includes('ddos')) {
        threats.set('DDoS', (threats.get('DDoS') || 0) + 1);
      }
    });

    return Array.from(threats.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([threat, count]) => `${threat}: ${count}회 감지`);
  }

  private extractDocumentTypes(interactions: UserInteraction[]): string[] {
    const types = new Map<string, number>();
    
    interactions.forEach(interaction => {
      const text = interaction.input.toLowerCase();
      if (text.includes('계약서') || text.includes('contract')) {
        types.set('계약서', (types.get('계약서') || 0) + 1);
      }
      if (text.includes('동의서') || text.includes('consent')) {
        types.set('동의서', (types.get('동의서') || 0) + 1);
      }
      if (text.includes('승인서') || text.includes('approval')) {
        types.set('승인서', (types.get('승인서') || 0) + 1);
      }
    });

    return Array.from(types.entries())
      .map(([type, count]) => `${type}: ${count}회`);
  }

  private analyzeSignerCounts(interactions: UserInteraction[]): string[] {
    const counts = new Map<number, number>();
    
    interactions.forEach(interaction => {
      const text = interaction.input;
      const match = text.match(/(\d+)\s*명|(\d+)\s*명의|(\d+)\s*서명자/);
      if (match) {
        const count = parseInt(match[1] || match[2] || match[3]);
        counts.set(count, (counts.get(count) || 0) + 1);
      }
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([count, freq]) => `${count}명: ${freq}회`);
  }

  private extractErrorTypes(interactions: UserInteraction[]): string[] {
    const errors = new Map<string, number>();
    
    interactions.forEach(interaction => {
      const text = interaction.output.toLowerCase();
      if (text.includes('type error')) {
        errors.set('Type Error', (errors.get('Type Error') || 0) + 1);
      }
      if (text.includes('syntax error')) {
        errors.set('Syntax Error', (errors.get('Syntax Error') || 0) + 1);
      }
      if (text.includes('runtime error')) {
        errors.set('Runtime Error', (errors.get('Runtime Error') || 0) + 1);
      }
    });

    return Array.from(errors.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([error, count]) => `${error}: ${count}회`);
  }

  private extractIssueTypes(interactions: UserInteraction[]): string[] {
    const issues = new Map<string, number>();
    
    interactions.forEach(interaction => {
      const text = interaction.output.toLowerCase();
      if (text.includes('performance') || text.includes('성능')) {
        issues.set('성능', (issues.get('성능') || 0) + 1);
      }
      if (text.includes('security') || text.includes('보안')) {
        issues.set('보안', (issues.get('보안') || 0) + 1);
      }
      if (text.includes('accessibility') || text.includes('접근성')) {
        issues.set('접근성', (issues.get('접근성') || 0) + 1);
      }
    });

    return Array.from(issues.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([issue, count]) => `${issue}: ${count}회 발견`);
  }

  /**
   * 모든 도메인 학습 실행
   */
  async learnAllDomains(): Promise<DomainLearningResult[]> {
    const domains = ['chat', 'code', 'content', 'image', 'video', 'security', 'signature', 'debug', 'validate'];
    const results: DomainLearningResult[] = [];

    for (const domain of domains) {
      const result = await this.learnForDomain(domain);
      results.push(result);
    }

    return results;
  }

  /**
   * 도메인별 상호작용 조회
   */
  getInteractions(domain: string): UserInteraction[] {
    return this.interactions.get(domain) || [];
  }

  /**
   * 학습된 패턴 조회
   */
  getLearnedPatterns(domain: string): any[] {
    return this.learnedPatterns.get(domain) || [];
  }
}

export const domainLearningSystem = new DomainSpecificLearningSystem();

