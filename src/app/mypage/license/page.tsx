'use client';

import React from 'react';
import { LicenseManager } from '@/components/subscription/LicenseManager';
import { GlobalHeader } from '@/components/layout/GlobalHeader';

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <GlobalHeader />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LicenseManager />
      </div>
    </div>
  );
}

