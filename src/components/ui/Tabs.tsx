'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  className = '',
}: TabsProps) {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    default: 'border-b-2 border-transparent hover:border-gray-300',
    pills: 'rounded-lg',
    underline: 'border-b-2 border-transparent hover:border-gray-300',
  };

  return (
    <div className={`flex gap-1 ${className}`} role="tablist">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={`
            relative flex items-center gap-2 font-medium
            transition-colors
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${activeTab === tab.id
              ? variant === 'pills'
                ? 'bg-primary-100 text-primary-700'
                : 'text-primary-600'
              : 'text-gray-600 hover:text-gray-800'
            }
          `}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
        >
          {tab.icon}
          <span>{tab.label}</span>
          {tab.badge && (
            <span className="px-1.5 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">
              {tab.badge}
            </span>
          )}
          {activeTab === tab.id && variant === 'underline' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
            />
          )}
        </button>
      ))}
    </div>
  );
}

interface TabPanelProps {
  id: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ id, activeTab, children, className = '' }: TabPanelProps) {
  if (id !== activeTab) return null;

  return (
    <div
      id={`panel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      className={className}
    >
      {children}
    </div>
  );
}

