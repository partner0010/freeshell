/**
 * GRIP Encryption Module
 * 데이터 암호화 시스템
 */

// ============================================
// 1. AES-256 암호화
// ============================================

/**
 * 암호화 키 생성
 */
export async function generateEncryptionKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * 문자열에서 키 파생
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * 데이터 암호화
 */
export async function encryptData(
  data: string,
  key: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encoder.encode(data)
  );
  
  return {
    ciphertext: arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv),
  };
}

/**
 * 데이터 복호화
 */
export async function decryptData(
  ciphertext: string,
  iv: string,
  key: CryptoKey
): Promise<string> {
  const decoder = new TextDecoder();
  
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: base64ToArrayBuffer(iv),
    },
    key,
    base64ToArrayBuffer(ciphertext)
  );
  
  return decoder.decode(decrypted);
}

// ============================================
// 2. RSA 비대칭 암호화
// ============================================

/**
 * RSA 키 쌍 생성
 */
export async function generateRsaKeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * RSA 암호화 (공개키)
 */
export async function rsaEncrypt(data: string, publicKey: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    encoder.encode(data)
  );
  return arrayBufferToBase64(encrypted);
}

/**
 * RSA 복호화 (개인키)
 */
export async function rsaDecrypt(ciphertext: string, privateKey: CryptoKey): Promise<string> {
  const decoder = new TextDecoder();
  const decrypted = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    base64ToArrayBuffer(ciphertext)
  );
  return decoder.decode(decrypted);
}

// ============================================
// 3. 디지털 서명
// ============================================

/**
 * 서명 키 쌍 생성
 */
export async function generateSigningKeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-384',
    },
    true,
    ['sign', 'verify']
  );
}

/**
 * 데이터 서명
 */
export async function signData(data: string, privateKey: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: 'SHA-384',
    },
    privateKey,
    encoder.encode(data)
  );
  return arrayBufferToBase64(signature);
}

/**
 * 서명 검증
 */
export async function verifySignature(
  data: string,
  signature: string,
  publicKey: CryptoKey
): Promise<boolean> {
  const encoder = new TextEncoder();
  return await crypto.subtle.verify(
    {
      name: 'ECDSA',
      hash: 'SHA-384',
    },
    publicKey,
    base64ToArrayBuffer(signature),
    encoder.encode(data)
  );
}

// ============================================
// 4. 해시 함수
// ============================================

/**
 * SHA-256 해시
 */
export async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  return arrayBufferToHex(hashBuffer);
}

/**
 * SHA-512 해시
 */
export async function sha512(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-512', encoder.encode(data));
  return arrayBufferToHex(hashBuffer);
}

/**
 * HMAC 생성
 */
export async function createHmac(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return arrayBufferToHex(signature);
}

/**
 * HMAC 검증
 */
export async function verifyHmac(
  data: string,
  hmac: string,
  secret: string
): Promise<boolean> {
  const computedHmac = await createHmac(data, secret);
  
  // 타이밍 공격 방지를 위한 상수 시간 비교
  if (hmac.length !== computedHmac.length) return false;
  
  let result = 0;
  for (let i = 0; i < hmac.length; i++) {
    result |= hmac.charCodeAt(i) ^ computedHmac.charCodeAt(i);
  }
  return result === 0;
}

// ============================================
// 5. 안전한 난수 생성
// ============================================

/**
 * 안전한 난수 문자열 생성
 */
export function generateSecureRandom(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return arrayBufferToHex(array);
}

/**
 * UUID v4 생성
 */
export function generateUuid(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  
  // UUID v4 규격에 맞게 조정
  array[6] = (array[6] & 0x0f) | 0x40;
  array[8] = (array[8] & 0x3f) | 0x80;
  
  const hex = arrayBufferToHex(array);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

// ============================================
// 유틸리티 함수
// ============================================

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ============================================
// Export
// ============================================

export const Encryption = {
  // AES
  generateEncryptionKey,
  deriveKeyFromPassword,
  encryptData,
  decryptData,
  
  // RSA
  generateRsaKeyPair,
  rsaEncrypt,
  rsaDecrypt,
  
  // Digital Signature
  generateSigningKeyPair,
  signData,
  verifySignature,
  
  // Hash
  sha256,
  sha512,
  createHmac,
  verifyHmac,
  
  // Random
  generateSecureRandom,
  generateUuid,
};

export default Encryption;

