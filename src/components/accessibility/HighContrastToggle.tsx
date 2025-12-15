'use client';

import React, { useState, useEffect } from 'react';
import { Contrast } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HighContrastToggle() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // 저장된 설정 불러오기
    const saved = localStorage.getItem('high-contrast');
    if (saved === 'true') {
      setIsEnabled(true);
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const toggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    
    if (newValue) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    localStorage.setItem('high-contrast', String(newValue));
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      title="고대비 모드"
    >
      <Contrast size={18} className={isEnabled ? 'text-primary-600' : ''} />
    </Button>
  );
}

