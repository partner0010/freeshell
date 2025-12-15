/**
 * Secrets Management 시스템
 * Secrets Manager
 */

export type SecretType = 'api-key' | 'password' | 'certificate' | 'token' | 'ssh-key' | 'other';

export interface Secret {
  id: string;
  name: string;
  type: SecretType;
  value: string;
  description?: string;
  encrypted: boolean;
  environment?: 'development' | 'staging' | 'production';
  expiresAt?: Date;
  lastRotated?: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Secrets 관리자
export class SecretsManager {
  private secrets: Map<string, Secret> = new Map();

  // Secret 생성
  createSecret(
    name: string,
    type: SecretType,
    value: string,
    description?: string,
    environment?: Secret['environment']
  ): Secret {
    const secret: Secret = {
      id: `secret-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      value: this.encrypt(value), // 실제로는 더 강력한 암호화 사용
      description,
      encrypted: true,
      environment: environment || 'production',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.secrets.set(secret.id, secret);
    return secret;
  }

  // Secret 가져오기 (복호화)
  getSecret(id: string): Omit<Secret, 'value'> & { value?: string } | undefined {
    const secret = this.secrets.get(id);
    if (!secret) return undefined;

    return {
      ...secret,
      value: secret.encrypted ? this.decrypt(secret.value) : secret.value,
    };
  }

  // Secret 로테이션
  rotateSecret(id: string, newValue: string): void {
    const secret = this.secrets.get(id);
    if (!secret) throw new Error('Secret not found');

    secret.value = this.encrypt(newValue);
    secret.lastRotated = new Date();
    secret.updatedAt = new Date();
  }

  // 만료 확인
  getExpiringSecrets(days: number = 30): Secret[] {
    const now = new Date();
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return Array.from(this.secrets.values()).filter(
      secret => secret.expiresAt && secret.expiresAt <= threshold
    );
  }

  // 암호화 (시뮬레이션 - 실제로는 더 강력한 암호화 사용)
  private encrypt(value: string): string {
    // Base64 인코딩 (실제로는 AES-256 등 사용)
    return btoa(value);
  }

  // 복호화
  private decrypt(encrypted: string): string {
    try {
      return atob(encrypted);
    } catch {
      return encrypted;
    }
  }

  // 모든 Secret 목록 가져오기 (값 제외)
  getAllSecrets(): Omit<Secret, 'value'>[] {
    return Array.from(this.secrets.values()).map(({ value, ...rest }) => rest);
  }
}

export const secretsManager = new SecretsManager();

