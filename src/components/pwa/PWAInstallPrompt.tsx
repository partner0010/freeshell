'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { installPWA, canInstallPWA, isPWAInstalled, setupPWAInstall } from '@/lib/pwa/pwa-installer';

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsInstalled(isPWAInstalled());
    setupPWAInstall();

    // 설치 가능 여부 확인
    const checkInstallable = () => {
      if (!isPWAInstalled() && canInstallPWA()) {
        // 사용자가 이미 거부했는지 확인
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
          setTimeout(() => setShowPrompt(true), 3000); // 3초 후 표시
        }
      }
    };

    checkInstallable();
    window.addEventListener('beforeinstallprompt', checkInstallable);

    return () => {
      window.removeEventListener('beforeinstallprompt', checkInstallable);
    };
  }, []);

  const handleInstall = async () => {
    const installed = await installPWA();
    if (installed) {
      setShowPrompt(false);
      setIsInstalled(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
      >
        <Card className="p-4 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Download className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">앱 설치</h3>
              <p className="text-sm text-gray-600 mb-3">
                홈 화면에 추가하여 더 빠르게 접근하세요
              </p>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={handleInstall}>
                  설치
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDismiss}>
                  나중에
                </Button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

