'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

export type ViewportSize = 'desktop' | 'tablet' | 'mobile';

interface ViewportSelectorProps {
  currentViewport: ViewportSize;
  onViewportChange: (viewport: ViewportSize) => void;
}

const viewports = [
  { id: 'desktop', icon: Monitor, label: '데스크톱', width: '100%' },
  { id: 'tablet', icon: Tablet, label: '태블릿', width: '768px' },
  { id: 'mobile', icon: Smartphone, label: '모바일', width: '375px' },
] as const;

export function ViewportSelector({ currentViewport, onViewportChange }: ViewportSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {viewports.map((viewport) => {
        const isActive = currentViewport === viewport.id;
        return (
          <motion.button
            key={viewport.id}
            onClick={() => onViewportChange(viewport.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative p-2 rounded-md transition-colors
              ${isActive 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
            title={viewport.label}
          >
            <viewport.icon size={18} />
          </motion.button>
        );
      })}
    </div>
  );
}

export function getViewportWidth(viewport: ViewportSize): string {
  const vp = viewports.find(v => v.id === viewport);
  return vp?.width || '100%';
}

