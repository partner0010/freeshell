/**
 * 국제화 (i18n) 시스템
 * Internationalization System
 */

export type Locale = 'ko' | 'en' | 'ja' | 'zh' | 'es' | 'fr';

export interface Translations {
  [key: string]: string | Translations;
}

const translations: Record<Locale, Translations> = {
  ko: {
    common: {
      search: '검색',
      cancel: '취소',
      confirm: '확인',
      save: '저장',
      delete: '삭제',
      edit: '편집',
      close: '닫기',
    },
    menu: {
      blocks: '블록',
      styles: '스타일',
      ai: 'AI',
      pages: '페이지',
      theme: '테마',
    },
    ai: {
      copilot: 'AI 코파일럿',
      design: 'AI 디자인',
      improve: 'AI 개선',
    },
  },
  en: {
    common: {
      search: 'Search',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
    },
    menu: {
      blocks: 'Blocks',
      styles: 'Styles',
      ai: 'AI',
      pages: 'Pages',
      theme: 'Theme',
    },
    ai: {
      copilot: 'AI Copilot',
      design: 'AI Design',
      improve: 'AI Improve',
    },
  },
  ja: {
    common: {
      search: '検索',
      cancel: 'キャンセル',
      confirm: '確認',
      save: '保存',
      delete: '削除',
      edit: '編集',
      close: '閉じる',
    },
    menu: {
      blocks: 'ブロック',
      styles: 'スタイル',
      ai: 'AI',
      pages: 'ページ',
      theme: 'テーマ',
    },
    ai: {
      copilot: 'AIコパイロット',
      design: 'AIデザイン',
      improve: 'AI改善',
    },
  },
  zh: {
    common: {
      search: '搜索',
      cancel: '取消',
      confirm: '确认',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      close: '关闭',
    },
    menu: {
      blocks: '区块',
      styles: '样式',
      ai: 'AI',
      pages: '页面',
      theme: '主题',
    },
    ai: {
      copilot: 'AI副驾驶',
      design: 'AI设计',
      improve: 'AI改进',
    },
  },
  es: {
    common: {
      search: 'Buscar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      close: 'Cerrar',
    },
    menu: {
      blocks: 'Bloques',
      styles: 'Estilos',
      ai: 'AI',
      pages: 'Páginas',
      theme: 'Tema',
    },
    ai: {
      copilot: 'Copiloto AI',
      design: 'Diseño AI',
      improve: 'Mejorar AI',
    },
  },
  fr: {
    common: {
      search: 'Rechercher',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      close: 'Fermer',
    },
    menu: {
      blocks: 'Blocs',
      styles: 'Styles',
      ai: 'AI',
      pages: 'Pages',
      theme: 'Thème',
    },
    ai: {
      copilot: 'Copilote AI',
      design: 'Design AI',
      improve: 'Améliorer AI',
    },
  },
};

class I18nManager {
  private currentLocale: Locale = 'ko';

  constructor() {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale;
      if (savedLocale && Object.keys(translations).includes(savedLocale)) {
        this.currentLocale = savedLocale;
      } else {
        // 브라우저 언어 감지
        const browserLang = navigator.language.split('-')[0] as Locale;
        if (Object.keys(translations).includes(browserLang)) {
          this.currentLocale = browserLang;
        }
      }
    }
  }

  setLocale(locale: Locale): void {
    this.currentLocale = locale;
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', locale);
      document.documentElement.lang = locale;
    }
  }

  getLocale(): Locale {
    return this.currentLocale;
  }

  t(key: string, params?: Record<string, string>): string {
    const keys = key.split('.');
    let value: string | Record<string, unknown> = translations[this.currentLocale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to Korean
        value = translations.ko;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key;
          }
        }
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // 파라미터 치환
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }

    return value;
  }
}

export const i18n = new I18nManager();

