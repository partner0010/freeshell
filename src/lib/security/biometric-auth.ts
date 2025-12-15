/**
 * 생체 인증 시스템
 * Biometric Authentication (WebAuthn, Fingerprint, Face Recognition)
 */

export interface BiometricCredential {
  id: string;
  userId: string;
  type: 'fingerprint' | 'face' | 'voice' | 'webauthn';
  publicKey: string;
  createdAt: number;
  lastUsed?: number;
  enabled: boolean;
}

export interface BiometricAuthRequest {
  userId: string;
  type: BiometricCredential['type'];
  challenge: string;
}

export interface BiometricAuthResponse {
  success: boolean;
  credentialId?: string;
  signature?: string;
  error?: string;
}

// 생체 인증 시스템
export class BiometricAuthSystem {
  private credentials: Map<string, BiometricCredential> = new Map();

  // WebAuthn 지원 확인
  async isWebAuthnSupported(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    return (
      typeof window.PublicKeyCredential !== 'undefined' &&
      typeof navigator.credentials !== 'undefined'
    );
  }

  // 생체 인증 등록
  async register(userId: string, type: BiometricCredential['type']): Promise<BiometricCredential> {
    if (type === 'webauthn') {
      return await this.registerWebAuthn(userId);
    }

    // 다른 생체 인증 타입은 시뮬레이션
    const credential: BiometricCredential = {
      id: `credential-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      publicKey: this.generatePublicKey(),
      createdAt: Date.now(),
      enabled: true,
    };

    this.credentials.set(credential.id, credential);
    return credential;
  }

  // WebAuthn 등록
  private async registerWebAuthn(userId: string): Promise<BiometricCredential> {
    if (typeof window === 'undefined' || !this.isWebAuthnSupported()) {
      throw new Error('WebAuthn not supported');
    }

    // 실제로는 WebAuthn API 사용
    // 여기서는 시뮬레이션
    const credential: BiometricCredential = {
      id: `webauthn-${Date.now()}`,
      userId,
      type: 'webauthn',
      publicKey: this.generatePublicKey(),
      createdAt: Date.now(),
      enabled: true,
    };

    this.credentials.set(credential.id, credential);
    return credential;
  }

  // 생체 인증
  async authenticate(
    userId: string,
    type: BiometricCredential['type'],
    challenge: string
  ): Promise<BiometricAuthResponse> {
    const credentials = Array.from(this.credentials.values()).filter(
      (c) => c.userId === userId && c.type === type && c.enabled
    );

    if (credentials.length === 0) {
      return {
        success: false,
        error: 'No credential found',
      };
    }

    // 실제로는 생체 인증 수행
    // 여기서는 시뮬레이션
    const credential = credentials[0];
    credential.lastUsed = Date.now();

    return {
      success: true,
      credentialId: credential.id,
      signature: this.generateSignature(challenge),
    };
  }

  // WebAuthn 인증
  async authenticateWebAuthn(userId: string, challenge: string): Promise<BiometricAuthResponse> {
    if (typeof window === 'undefined' || !this.isWebAuthnSupported()) {
      return {
        success: false,
        error: 'WebAuthn not supported',
      };
    }

    // 실제로는 WebAuthn API 사용
    return await this.authenticate(userId, 'webauthn', challenge);
  }

  // 자동 로그인 (생체 인증)
  async autoLogin(userId: string): Promise<BiometricAuthResponse> {
    // 저장된 생체 인증 정보로 자동 로그인 시도
    const credentials = Array.from(this.credentials.values()).filter(
      (c) => c.userId === userId && c.enabled
    );

    if (credentials.length === 0) {
      return {
        success: false,
        error: 'No credential found',
      };
    }

    // 가장 최근에 사용한 인증 방식 사용
    const credential = credentials.sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0))[0];

    return await this.authenticate(userId, credential.type, this.generateChallenge());
  }

  private generatePublicKey(): string {
    return `pk-${Math.random().toString(36).substr(2, 32)}`;
  }

  private generateSignature(challenge: string): string {
    return `sig-${challenge}-${Math.random().toString(36).substr(2, 32)}`;
  }

  private generateChallenge(): string {
    return Math.random().toString(36).substr(2, 16);
  }

  getCredentials(userId: string): BiometricCredential[] {
    return Array.from(this.credentials.values()).filter((c) => c.userId === userId);
  }

  deleteCredential(credentialId: string): boolean {
    return this.credentials.delete(credentialId);
  }
}

export const biometricAuthSystem = new BiometricAuthSystem();

