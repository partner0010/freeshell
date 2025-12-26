'use client';

import { SessionProvider } from '@/components/providers/SessionProvider';
import { LanguageProvider } from '@/components/i18n/LanguageProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
}

