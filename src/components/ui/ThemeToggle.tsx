'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { darkModeManager, type ThemeMode } from '@/lib/theme/dark-mode';
import { Button } from './Button';

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(darkModeManager.getMode());
  const [effectiveMode, setEffectiveMode] = useState<'light' | 'dark'>(
    darkModeManager.getEffectiveMode()
  );

  useEffect(() => {
    const unsubscribe = darkModeManager.onChange((newMode) => {
      setMode(newMode);
      setEffectiveMode(darkModeManager.getEffectiveMode());
    });

    return unsubscribe;
  }, []);

  const handleToggle = () => {
    const currentEffective = darkModeManager.getEffectiveMode();
    darkModeManager.setMode(currentEffective === 'dark' ? 'light' : 'dark');
  };

  const handleSystemMode = () => {
    darkModeManager.setMode('system');
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        title={`현재: ${effectiveMode === 'dark' ? '다크' : '라이트'} 모드`}
      >
        {effectiveMode === 'dark' ? (
          <Sun size={18} />
        ) : (
          <Moon size={18} />
        )}
      </Button>
      {mode === 'system' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSystemMode}
          title="시스템 설정 사용"
        >
          <Monitor size={18} />
        </Button>
      )}
    </div>
  );
}

