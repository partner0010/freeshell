'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Fingerprint,
  Shield,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Lock,
} from 'lucide-react';
import {
  biometricAuthSystem,
  type BiometricCredential,
} from '@/lib/security/biometric-auth';

export function BiometricAuthPanel() {
  const [credentials, setCredentials] = useState<BiometricCredential[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);

  useEffect(() => {
    checkSupport();
    loadCredentials();
  }, []);

  const checkSupport = async () => {
    const supported = await biometricAuthSystem.isWebAuthnSupported();
    setIsSupported(supported);
  };

  const loadCredentials = () => {
    setCredentials(biometricAuthSystem.getCredentials('user-123'));
  };

  const handleRegister = async (type: BiometricCredential['type']) => {
    setRegistering(true);
    try {
      const credential = await biometricAuthSystem.register('user-123', type);
      loadCredentials();
      alert(`${type} 인증이 등록되었습니다`);
    } catch (error) {
      alert(`등록 실패: ${error}`);
    } finally {
      setRegistering(false);
    }
  };

  const handleAuthenticate = async (credential: BiometricCredential) => {
    setAuthenticating(true);
    try {
      const response = await biometricAuthSystem.authenticate(
        credential.userId,
        credential.type,
        'challenge-123'
      );
      if (response.success) {
        alert('인증 성공!');
      } else {
        alert(`인증 실패: ${response.error}`);
      }
    } catch (error) {
      alert(`인증 실패: ${error}`);
    } finally {
      setAuthenticating(false);
    }
  };

  const handleDelete = (credentialId: string) => {
    if (confirm('인증 정보를 삭제하시겠습니까?')) {
      biometricAuthSystem.deleteCredential(credentialId);
      loadCredentials();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-xl flex items-center justify-center">
            <Fingerprint className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">생체 인증</h2>
            <p className="text-sm text-gray-500">WebAuthn, 지문, 얼굴 인식</p>
          </div>
        </div>

        {isSupported ? (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="text-green-600" size={20} />
            <span className="text-sm text-green-800">WebAuthn이 지원됩니다</span>
          </div>
        ) : (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
            <XCircle className="text-yellow-600" size={20} />
            <span className="text-sm text-yellow-800">WebAuthn이 지원되지 않습니다</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* 등록된 인증 */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">등록된 인증</h3>
          </div>
          {credentials.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              등록된 인증이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {credentials.map((credential) => (
                <div key={credential.id} className="p-4 bg-white border rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">{credential.type}</div>
                      <div className="text-sm text-gray-600">
                        등록일: {new Date(credential.createdAt).toLocaleString()}
                      </div>
                      {credential.lastUsed && (
                        <div className="text-sm text-gray-600">
                          마지막 사용: {new Date(credential.lastUsed).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAuthenticate(credential)}
                        disabled={authenticating}
                        className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                      >
                        <Lock size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(credential.id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 새 인증 등록 */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4">새 인증 등록</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleRegister('webauthn')}
              disabled={registering || !isSupported}
              className="p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 disabled:opacity-50"
            >
              <Fingerprint className="text-blue-600 mx-auto mb-2" size={32} />
              <div className="font-semibold text-blue-800">WebAuthn</div>
              <div className="text-xs text-blue-600">지문/얼굴</div>
            </button>
            <button
              onClick={() => handleRegister('fingerprint')}
              disabled={registering}
              className="p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 disabled:opacity-50"
            >
              <Fingerprint className="text-green-600 mx-auto mb-2" size={32} />
              <div className="font-semibold text-green-800">지문</div>
              <div className="text-xs text-green-600">Fingerprint</div>
            </button>
            <button
              onClick={() => handleRegister('face')}
              disabled={registering}
              className="p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 disabled:opacity-50"
            >
              <Fingerprint className="text-purple-600 mx-auto mb-2" size={32} />
              <div className="font-semibold text-purple-800">얼굴</div>
              <div className="text-xs text-purple-600">Face ID</div>
            </button>
            <button
              onClick={() => handleRegister('voice')}
              disabled={registering}
              className="p-4 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 disabled:opacity-50"
            >
              <Fingerprint className="text-orange-600 mx-auto mb-2" size={32} />
              <div className="font-semibold text-orange-800">음성</div>
              <div className="text-xs text-orange-600">Voice</div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

