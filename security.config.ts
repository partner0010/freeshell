/**
 * GRIP Security Configuration
 * 보안 설정 통합 파일
 */

export const SecurityConfig = {
  // ============================================
  // 인증 설정
  // ============================================
  auth: {
    // 비밀번호 정책
    password: {
      minLength: 8,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    },
    
    // 계정 잠금
    lockout: {
      maxAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15분
      resetAfter: 60 * 60 * 1000, // 1시간
    },
    
    // 세션
    session: {
      maxAge: 24 * 60 * 60 * 1000, // 24시간
      maxInactivity: 30 * 60 * 1000, // 30분
      renewalThreshold: 5 * 60 * 1000, // 5분
    },
    
    // JWT
    jwt: {
      algorithm: 'HS256' as const,
      expiresIn: '24h',
      issuer: 'grip.app',
      audience: 'grip-users',
    },
    
    // 2단계 인증
    twoFactor: {
      enabled: true,
      methods: ['totp', 'email', 'sms'] as const,
      totpWindow: 1,
      codeExpiry: 5 * 60 * 1000, // 5분
    },
  },
  
  // ============================================
  // Rate Limiting
  // ============================================
  rateLimit: {
    // 일반 요청
    general: {
      windowMs: 60 * 1000, // 1분
      maxRequests: 100,
    },
    
    // API 요청
    api: {
      windowMs: 60 * 1000,
      maxRequests: 60,
    },
    
    // 로그인 시도
    login: {
      windowMs: 15 * 60 * 1000, // 15분
      maxRequests: 5,
    },
    
    // 비밀번호 재설정
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1시간
      maxRequests: 3,
    },
    
    // 회원가입
    signup: {
      windowMs: 60 * 60 * 1000, // 1시간
      maxRequests: 5,
    },
  },
  
  // ============================================
  // CORS 설정
  // ============================================
  cors: {
    allowedOrigins: [
      'http://localhost:3000',
      'https://grip.app',
      'https://*.grip.app',
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-CSRF-Token',
      'X-Request-ID',
    ],
    exposedHeaders: ['X-Request-ID', 'X-RateLimit-Remaining'],
    maxAge: 86400, // 24시간
    credentials: true,
  },
  
  // ============================================
  // CSP (Content Security Policy)
  // ============================================
  csp: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'img-src': ["'self'", 'data:', 'blob:', 'https:'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'connect-src': ["'self'", 'https:', 'wss:'],
      'media-src': ["'self'", 'blob:'],
      'object-src': ["'none'"],
      'frame-src': ["'self'", 'https://www.youtube.com', 'https://player.vimeo.com'],
      'frame-ancestors': ["'self'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'upgrade-insecure-requests': [],
    },
    reportUri: '/api/csp-report',
    reportOnly: false,
  },
  
  // ============================================
  // 파일 업로드
  // ============================================
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 10,
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'video/mp4',
      'video/webm',
    ],
    allowedExtensions: [
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
      '.pdf', '.mp4', '.webm',
    ],
    scanForMalware: true,
    generateThumbnails: true,
  },
  
  // ============================================
  // 입력 검증
  // ============================================
  validation: {
    // 최대 입력 길이
    maxInputLength: {
      text: 10000,
      title: 200,
      email: 254,
      url: 2048,
      password: 128,
    },
    
    // 금지된 패턴
    forbiddenPatterns: [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript\s*:/gi,
      /on\w+\s*=/gi,
      /data\s*:(?!image\/)/gi,
    ],
    
    // 허용된 HTML 태그
    allowedHtmlTags: [
      'p', 'br', 'strong', 'em', 'u', 's',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'blockquote', 'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
  },
  
  // ============================================
  // 암호화
  // ============================================
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 12,
    tagLength: 16,
    pbkdf2: {
      iterations: 100000,
      keyLength: 32,
      digest: 'sha256',
    },
  },
  
  // ============================================
  // 쿠키 설정
  // ============================================
  cookies: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    domain: process.env.COOKIE_DOMAIN || undefined,
  },
  
  // ============================================
  // 보안 헤더
  // ============================================
  headers: {
    'X-XSS-Protection': '1; mode=block',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-DNS-Prefetch-Control': 'off',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(self), geolocation=(self)',
  },
  
  // ============================================
  // 로깅
  // ============================================
  logging: {
    // 기록할 이벤트
    events: [
      'login_attempt',
      'login_success',
      'login_failure',
      'logout',
      'password_change',
      'password_reset',
      'account_lockout',
      'permission_denied',
      'rate_limit_exceeded',
      'suspicious_activity',
      'data_export',
      'admin_action',
    ],
    
    // 민감 정보 마스킹
    maskFields: [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'cookie',
    ],
    
    // 보관 기간
    retentionDays: 90,
  },
  
  // ============================================
  // IP 필터링
  // ============================================
  ip: {
    // 화이트리스트 (관리자 전용)
    whitelist: [],
    
    // 블랙리스트
    blacklist: [],
    
    // 차단된 국가 (ISO 코드)
    blockedCountries: [],
    
    // 프록시 신뢰
    trustProxy: true,
    trustHeaders: ['x-forwarded-for', 'x-real-ip'],
  },
  
  // ============================================
  // 봇 탐지
  // ============================================
  bot: {
    // 허용된 봇
    allowedBots: [
      'googlebot',
      'bingbot',
      'yandexbot',
      'duckduckbot',
      'slurp', // Yahoo
      'facebookexternalhit',
      'twitterbot',
      'linkedinbot',
    ],
    
    // 차단된 봇
    blockedBots: [
      'scrapy',
      'python-requests',
      'curl',
      'wget',
      'httpclient',
    ],
    
    // CAPTCHA 임계값
    captchaThreshold: 3,
  },
};

export default SecurityConfig;

