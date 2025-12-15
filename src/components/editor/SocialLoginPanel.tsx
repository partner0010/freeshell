'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LogIn,
  Shield,
  Settings,
  Check,
  X,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Info,
  AlertTriangle,
} from 'lucide-react';

interface SocialProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  configured: boolean;
}

export function SocialLoginPanel() {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [providers, setProviders] = useState<SocialProvider[]>([
    {
      id: 'google',
      name: 'Google',
      icon: '🔵',
      color: 'bg-blue-500',
      enabled: true,
      clientId: '123456789.apps.googleusercontent.com',
      clientSecret: '****************************',
      configured: true,
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: '⚫',
      color: 'bg-gray-800',
      enabled: true,
      clientId: 'Iv1.abcdef123456',
      clientSecret: '****************************',
      configured: true,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '🔷',
      color: 'bg-blue-600',
      enabled: false,
      clientId: '',
      clientSecret: '',
      configured: false,
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: '🐦',
      color: 'bg-black',
      enabled: false,
      clientId: '',
      clientSecret: '',
      configured: false,
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: '🍎',
      color: 'bg-black',
      enabled: false,
      clientId: '',
      clientSecret: '',
      configured: false,
    },
    {
      id: 'kakao',
      name: 'Kakao',
      icon: '💬',
      color: 'bg-yellow-400',
      enabled: false,
      clientId: '',
      clientSecret: '',
      configured: false,
    },
    {
      id: 'naver',
      name: 'Naver',
      icon: '🟢',
      color: 'bg-green-500',
      enabled: false,
      clientId: '',
      clientSecret: '',
      configured: false,
    },
  ]);
  
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ clientId: '', clientSecret: '' });

  const toggleProvider = (id: string) => {
    setProviders(providers.map((p) =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const toggleSecret = (id: string) => {
    setShowSecrets({ ...showSecrets, [id]: !showSecrets[id] });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openSettings = (provider: SocialProvider) => {
    setSelectedProvider(provider.id);
    setEditForm({
      clientId: provider.clientId,
      clientSecret: provider.clientSecret === '****************************' ? '' : provider.clientSecret,
    });
  };

  const saveSettings = () => {
    if (!selectedProvider) return;
    
    setProviders(providers.map((p) =>
      p.id === selectedProvider
        ? {
            ...p,
            clientId: editForm.clientId,
            clientSecret: editForm.clientSecret || '****************************',
            configured: !!editForm.clientId,
          }
        : p
    ));
    setSelectedProvider(null);
  };

  const enabledCount = providers.filter((p) => p.enabled && p.configured).length;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <LogIn className="w-5 h-5 text-primary-500" />
          소셜 로그인
        </h3>
        <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
          {enabledCount}개 활성
        </span>
      </div>
      
      {/* 안내 */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-400">
            소셜 로그인을 통해 사용자가 쉽게 가입하고 로그인할 수 있습니다.
            각 서비스의 개발자 콘솔에서 OAuth 앱을 생성하세요.
          </div>
        </div>
      </div>
      
      {/* 콜백 URL */}
      <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <label className="text-xs text-gray-500 mb-1 block">리다이렉트 URI (모든 제공자에 사용)</label>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded truncate">
            https://your-domain.com/api/auth/callback
          </code>
          <button
            onClick={() => copyToClipboard('https://your-domain.com/api/auth/callback')}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
          >
            <Copy className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* 제공자 목록 */}
      <div className="space-y-2">
        {providers.map((provider) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-3 bg-white dark:bg-gray-700 rounded-lg border ${
              provider.enabled && provider.configured
                ? 'border-green-300 dark:border-green-700'
                : 'border-gray-200 dark:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${provider.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                  {provider.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {provider.name}
                    </span>
                    {provider.configured ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {provider.configured ? '설정 완료' : '설정 필요'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openSettings(provider)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                </button>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={provider.enabled}
                    onChange={() => toggleProvider(provider.id)}
                    className="sr-only peer"
                    disabled={!provider.configured}
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500 peer-disabled:opacity-50" />
                </label>
              </div>
            </div>
            
            {/* 상세 정보 */}
            {provider.configured && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Client ID:</span>
                  <div className="flex items-center gap-1">
                    <code className="text-gray-700 dark:text-gray-300">
                      {provider.clientId.substring(0, 10)}...
                    </code>
                    <button
                      onClick={() => copyToClipboard(provider.clientId)}
                      className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                    >
                      <Copy className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* 로그인 버튼 미리보기 */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-xs text-gray-500 mb-3">로그인 버튼 미리보기</p>
        <div className="space-y-2">
          {providers
            .filter((p) => p.enabled && p.configured)
            .map((provider) => (
              <button
                key={provider.id}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 ${provider.color} text-white rounded-lg hover:opacity-90 transition-opacity`}
              >
                <span className="text-lg">{provider.icon}</span>
                <span className="font-medium">{provider.name}로 계속하기</span>
              </button>
            ))}
        </div>
      </div>
      
      {/* 설정 모달 */}
      {selectedProvider && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProvider(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">
              {providers.find((p) => p.id === selectedProvider)?.name} 설정
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                  Client ID *
                </label>
                <input
                  type="text"
                  value={editForm.clientId}
                  onChange={(e) => setEditForm({ ...editForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="OAuth Client ID"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                  Client Secret *
                </label>
                <div className="relative">
                  <input
                    type={showSecrets[selectedProvider] ? 'text' : 'password'}
                    value={editForm.clientSecret}
                    onChange={(e) => setEditForm({ ...editForm, clientSecret: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="OAuth Client Secret"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecret(selectedProvider)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                  >
                    {showSecrets[selectedProvider] ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <div className="text-xs text-yellow-700 dark:text-yellow-400">
                    Client Secret은 안전하게 암호화되어 저장됩니다.
                    절대로 클라이언트 코드에 노출하지 마세요.
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  취소
                </button>
                <button
                  onClick={saveSettings}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  저장
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default SocialLoginPanel;

