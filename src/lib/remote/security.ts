/**
 * 원격 솔루션 보안 모듈
 * 종합 보안 시스템
 */

// Node.js crypto 모듈 사용 (서버 사이드)
// 브라우저에서는 Web Crypto API 사용

export interface SecurityConfig {
  encryption: {
    algorithm: string;
    keyLength: number;
  };
  authentication: {
    requireAuth: boolean;
    sessionTimeout: number;
  };
  accessControl: {
    ipWhitelist: string[];
    rateLimit: number;
  };
  audit: {
    logAllActions: boolean;
    retentionDays: number;
  };
}

export class RemoteSecurityManager {
  private config: SecurityConfig;
  private sessionKeys: Map<string, string> = new Map();
  private accessLogs: Array<{
    timestamp: Date;
    sessionId: string;
    action: string;
    ip: string;
    details: any;
  }> = [];

  constructor(config?: Partial<SecurityConfig>) {
    this.config = {
      encryption: {
        algorithm: 'aes-256-gcm',
        keyLength: 32,
      },
      authentication: {
        requireAuth: true,
        sessionTimeout: 3600000, // 1시간
      },
      accessControl: {
        ipWhitelist: [],
        rateLimit: 100, // 분당 100회
      },
      audit: {
        logAllActions: true,
        retentionDays: 30,
      },
      ...config,
    };
  }

  /**
   * 세션 키 생성 및 암호화
   */
  generateSessionKey(sessionId: string): string {
    // 브라우저 환경에서만 사용 (서버에서는 별도 처리)
    if (typeof window === 'undefined') {
      const nodeCrypto = require('crypto');
      const key = nodeCrypto.randomBytes(this.config.encryption.keyLength).toString('hex');
      this.sessionKeys.set(sessionId, key);
      return key;
    }
    
    // 브라우저 환경
    const array = new Uint8Array(this.config.encryption.keyLength);
    window.crypto.getRandomValues(array);
    const key = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    this.sessionKeys.set(sessionId, key);
    return key;
  }

  /**
   * 데이터 암호화
   */
  async encrypt(data: string, sessionId: string): Promise<string> {
    const key = this.sessionKeys.get(sessionId);
    if (!key) {
      throw new Error('세션 키를 찾을 수 없습니다.');
    }

    if (typeof window === 'undefined') {
      // Node.js 환경
      const nodeCrypto = require('crypto');
      const iv = nodeCrypto.randomBytes(16);
      const cipher = nodeCrypto.createCipheriv(
        this.config.encryption.algorithm,
        Buffer.from(key, 'hex'),
        iv
      );

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = (cipher as any).getAuthTag();

      return JSON.stringify({
        iv: iv.toString('hex'),
        encrypted,
        authTag: authTag.toString('hex'),
      });
    } else {
      // 브라우저 환경 - Web Crypto API 사용
      const keyData = await window.crypto.subtle.importKey(
        'raw',
        new Uint8Array(key.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16))),
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encodedData = new TextEncoder().encode(data);

      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        keyData,
        encodedData
      );

      return JSON.stringify({
        iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
        encrypted: Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join(''),
      });
    }
  }

  /**
   * 데이터 복호화
   */
  async decrypt(encryptedData: string, sessionId: string): Promise<string> {
    const key = this.sessionKeys.get(sessionId);
    if (!key) {
      throw new Error('세션 키를 찾을 수 없습니다.');
    }

    const data = JSON.parse(encryptedData);

    if (typeof window === 'undefined') {
      // Node.js 환경
      const nodeCrypto = require('crypto');
      const decipher = nodeCrypto.createDecipheriv(
        this.config.encryption.algorithm,
        Buffer.from(key, 'hex'),
        Buffer.from(data.iv, 'hex')
      );

      if (data.authTag) {
        (decipher as any).setAuthTag(Buffer.from(data.authTag, 'hex'));
      }

      let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } else {
      // 브라우저 환경 - Web Crypto API 사용
      const keyData = await window.crypto.subtle.importKey(
        'raw',
        new Uint8Array(key.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16))),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      const iv = new Uint8Array(data.iv.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
      const encrypted = new Uint8Array(data.encrypted.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));

      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        keyData,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    }
  }

  /**
   * IP 주소 검증
   */
  validateIP(ip: string): boolean {
    if (this.config.accessControl.ipWhitelist.length === 0) {
      return true; // 화이트리스트가 없으면 모든 IP 허용
    }
    return this.config.accessControl.ipWhitelist.includes(ip);
  }

  /**
   * 액세스 로그 기록
   */
  logAccess(sessionId: string, action: string, ip: string, details?: any): void {
    if (this.config.audit.logAllActions) {
      this.accessLogs.push({
        timestamp: new Date(),
        sessionId,
        action,
        ip,
        details,
      });

      // 오래된 로그 삭제
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.audit.retentionDays);
      this.accessLogs = this.accessLogs.filter(log => log.timestamp > cutoffDate);
    }
  }

  /**
   * 보안 이벤트 감지
   */
  detectSecurityEvent(sessionId: string, event: string, details: any): boolean {
    // 비정상적인 활동 감지
    const recentLogs = this.accessLogs.filter(
      log => log.sessionId === sessionId && 
      log.timestamp > new Date(Date.now() - 60000) // 최근 1분
    );

    if (recentLogs.length > this.config.accessControl.rateLimit) {
      this.logAccess(sessionId, 'SECURITY_ALERT', 'unknown', {
        event: 'rate_limit_exceeded',
        count: recentLogs.length,
      });
      return true; // 보안 이벤트 감지
    }

    return false;
  }

  /**
   * 세션 키 삭제
   */
  clearSession(sessionId: string): void {
    this.sessionKeys.delete(sessionId);
    this.logAccess(sessionId, 'SESSION_ENDED', 'unknown');
  }

  /**
   * 보안 로그 조회
   */
  getSecurityLogs(sessionId?: string): typeof this.accessLogs {
    if (sessionId) {
      return this.accessLogs.filter(log => log.sessionId === sessionId);
    }
    return [...this.accessLogs];
  }
}

export const remoteSecurityManager = new RemoteSecurityManager();

