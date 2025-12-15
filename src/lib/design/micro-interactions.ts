/**
 * 마이크로 인터랙션 시스템
 * Micro-interactions for Enhanced UX
 */

export interface MicroInteraction {
  id: string;
  name: string;
  type: 'hover' | 'click' | 'focus' | 'scroll' | 'load' | 'custom';
  animation: string;
  duration: number;
  easing: string;
}

export interface InteractionConfig {
  enabled: boolean;
  interactions: MicroInteraction[];
  globalSettings: {
    reduceMotion: boolean;
    performanceMode: 'low' | 'medium' | 'high';
  };
}

// 마이크로 인터랙션 시스템
export class MicroInteractionSystem {
  private config: InteractionConfig = {
    enabled: true,
    interactions: [],
    globalSettings: {
      reduceMotion: false,
      performanceMode: 'high',
    },
  };

  // 초기화
  init(): void {
    this.detectPreferences();
    this.registerDefaultInteractions();
  }

  // 사용자 설정 감지 (접근성)
  private detectPreferences(): void {
    if (typeof window === 'undefined') return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.config.globalSettings.reduceMotion = prefersReducedMotion;
  }

  // 기본 인터랙션 등록
  private registerDefaultInteractions(): void {
    this.addInteraction({
      id: 'button-hover',
      name: '버튼 호버',
      type: 'hover',
      animation: 'scale(1.05)',
      duration: 200,
      easing: 'ease-out',
    });

    this.addInteraction({
      id: 'button-click',
      name: '버튼 클릭',
      type: 'click',
      animation: 'scale(0.95)',
      duration: 100,
      easing: 'ease-in-out',
    });

    this.addInteraction({
      id: 'card-hover',
      name: '카드 호버',
      type: 'hover',
      animation: 'translateY(-4px)',
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    });

    this.addInteraction({
      id: 'input-focus',
      name: '입력 포커스',
      type: 'focus',
      animation: 'scale(1.02)',
      duration: 200,
      easing: 'ease-out',
    });
  }

  // 인터랙션 추가
  addInteraction(interaction: MicroInteraction): void {
    this.config.interactions.push(interaction);
  }

  // 인터랙션 적용 (CSS 변수로)
  applyInteraction(element: HTMLElement, interactionId: string): void {
    if (!this.config.enabled || this.config.globalSettings.reduceMotion) return;

    const interaction = this.config.interactions.find((i) => i.id === interactionId);
    if (!interaction) return;

    element.style.setProperty('--interaction-animation', interaction.animation);
    element.style.setProperty('--interaction-duration', `${interaction.duration}ms`);
    element.style.setProperty('--interaction-easing', interaction.easing);
  }

  // 설정 업데이트
  updateConfig(config: Partial<InteractionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): InteractionConfig {
    return { ...this.config };
  }
}

export const microInteractionSystem = new MicroInteractionSystem();

