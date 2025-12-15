/**
 * 다크모드 시스템
 * Dark Mode System
 */

export type ThemeMode = 'light' | 'dark' | 'system';

class DarkModeManager {
  private currentMode: ThemeMode = 'system';
  private listeners: Set<(mode: ThemeMode) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.currentMode = (localStorage.getItem('theme') as ThemeMode) || 'system';
      this.applyTheme();
      this.watchSystemPreference();
    }
  }

  // 시스템 설정 감지
  private watchSystemPreference(): void {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.currentMode === 'system') {
        this.applyTheme();
      }
    });
  }

  // 테마 적용
  private applyTheme(): void {
    if (typeof window === 'undefined') return;
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const isDark = this.getEffectiveMode() === 'dark';

    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }

    // CSS 변수 업데이트
    this.updateCSSVariables(isDark);
  }

  // 실제 적용될 모드 가져오기
  getEffectiveMode(): 'light' | 'dark' {
    if (this.currentMode === 'system') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light';
    }
    return this.currentMode;
  }

  // CSS 변수 업데이트
  private updateCSSVariables(isDark: boolean): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const colors = isDark
      ? {
          background: '#171717',
          'background-secondary': '#262626',
          'background-tertiary': '#404040',
          text: '#FAFAFA',
          'text-secondary': '#E5E5E5',
          'text-tertiary': '#A3A3A3',
        }
      : {
          background: '#FFFFFF',
          'background-secondary': '#F5F5F5',
          'background-tertiary': '#E5E5E5',
          text: '#171717',
          'text-secondary': '#404040',
          'text-tertiary': '#737373',
        };

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }

  // 테마 변경
  setMode(mode: ThemeMode): void {
    this.currentMode = mode;
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', mode);
    }
    this.applyTheme();
    this.notifyListeners();
  }

  // 현재 모드 가져오기
  getMode(): ThemeMode {
    return this.currentMode;
  }

  // 리스너 추가
  onChange(callback: (mode: ThemeMode) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  // 리스너 알림
  private notifyListeners(): void {
    this.listeners.forEach((callback) => callback(this.currentMode));
  }

  // 토글
  toggle(): void {
    const effectiveMode = this.getEffectiveMode();
    this.setMode(effectiveMode === 'dark' ? 'light' : 'dark');
  }
}

export const darkModeManager = new DarkModeManager();

