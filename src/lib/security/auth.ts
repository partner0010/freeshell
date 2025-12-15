/**
 * GRIP Authentication & Authorization System
 * 인증/인가 시스템
 */

import { generateCsrfToken, hashPassword, logSecurityEvent } from './index';

// ============================================
// Types
// ============================================

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: number;
  lastLogin?: number;
  failedLoginAttempts: number;
  lockedUntil?: number;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
}

export type UserRole = 'admin' | 'editor' | 'viewer' | 'guest';

export type Permission =
  | 'read'
  | 'write'
  | 'delete'
  | 'admin'
  | 'manage_users'
  | 'manage_projects'
  | 'manage_templates'
  | 'view_analytics'
  | 'manage_billing';

export interface Session {
  id: string;
  userId: string;
  token: string;
  csrfToken: string;
  createdAt: number;
  lastActivity: number;
  expiresAt: number;
  ip: string;
  userAgent: string;
}

export interface AuthResult {
  success: boolean;
  user?: Omit<User, 'passwordHash' | 'twoFactorSecret'>;
  session?: Session;
  error?: string;
  requiresTwoFactor?: boolean;
}

// ============================================
// Role-Based Access Control (RBAC)
// ============================================

const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    'read', 'write', 'delete', 'admin',
    'manage_users', 'manage_projects', 'manage_templates',
    'view_analytics', 'manage_billing',
  ],
  editor: ['read', 'write', 'manage_projects', 'manage_templates'],
  viewer: ['read'],
  guest: [],
};

/**
 * 역할에 따른 권한 확인
 */
export function hasPermission(user: Pick<User, 'role' | 'permissions'>, permission: Permission): boolean {
  // 사용자 개별 권한 확인
  if (user.permissions.includes(permission)) return true;
  
  // 역할 기반 권한 확인
  return rolePermissions[user.role]?.includes(permission) ?? false;
}

/**
 * 여러 권한 중 하나라도 있는지 확인
 */
export function hasAnyPermission(user: Pick<User, 'role' | 'permissions'>, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(user, p));
}

/**
 * 모든 권한이 있는지 확인
 */
export function hasAllPermissions(user: Pick<User, 'role' | 'permissions'>, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(user, p));
}

// ============================================
// Authentication
// ============================================

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15분
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24시간

// 메모리 저장소 (실제로는 DB 사용)
const users = new Map<string, User>();
const sessions = new Map<string, Session>();

/**
 * 사용자 등록
 */
export async function registerUser(
  email: string,
  password: string,
  role: UserRole = 'viewer'
): Promise<AuthResult> {
  // 이메일 중복 확인
  const existingUser = Array.from(users.values()).find((u) => u.email === email);
  if (existingUser) {
    return { success: false, error: '이미 등록된 이메일입니다.' };
  }
  
  // 비밀번호 해시
  const passwordHash = await hashPassword(password);
  
  const user: User = {
    id: generateCsrfToken().substring(0, 16),
    email,
    passwordHash,
    role,
    permissions: [],
    createdAt: Date.now(),
    failedLoginAttempts: 0,
    twoFactorEnabled: false,
  };
  
  users.set(user.id, user);
  
  logSecurityEvent({
    type: 'login_success', // 실제로는 'register' 타입 추가
    userId: user.id,
    details: { email },
  });
  
  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      createdAt: user.createdAt,
      failedLoginAttempts: 0,
      twoFactorEnabled: false,
    },
  };
}

/**
 * 로그인
 */
export async function login(
  email: string,
  password: string,
  ip: string,
  userAgent: string
): Promise<AuthResult> {
  // 사용자 찾기
  const user = Array.from(users.values()).find((u) => u.email === email);
  
  if (!user) {
    logSecurityEvent({
      type: 'login_failure',
      ip,
      userAgent,
      details: { email, reason: 'user_not_found' },
    });
    return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
  }
  
  // 계정 잠금 확인
  if (user.lockedUntil && user.lockedUntil > Date.now()) {
    const remainingTime = Math.ceil((user.lockedUntil - Date.now()) / 1000 / 60);
    logSecurityEvent({
      type: 'login_failure',
      userId: user.id,
      ip,
      userAgent,
      details: { reason: 'account_locked' },
    });
    return { success: false, error: `계정이 잠겼습니다. ${remainingTime}분 후에 다시 시도하세요.` };
  }
  
  // 비밀번호 확인
  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) {
    user.failedLoginAttempts++;
    
    // 잠금 처리
    if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockedUntil = Date.now() + LOCKOUT_DURATION;
      logSecurityEvent({
        type: 'suspicious_activity',
        userId: user.id,
        ip,
        userAgent,
        details: { reason: 'too_many_failed_attempts', attempts: user.failedLoginAttempts },
      });
    }
    
    logSecurityEvent({
      type: 'login_failure',
      userId: user.id,
      ip,
      userAgent,
      details: { reason: 'wrong_password', attempts: user.failedLoginAttempts },
    });
    
    return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
  }
  
  // 2단계 인증 확인
  if (user.twoFactorEnabled) {
    return { success: false, requiresTwoFactor: true };
  }
  
  // 로그인 성공
  user.failedLoginAttempts = 0;
  user.lockedUntil = undefined;
  user.lastLogin = Date.now();
  
  // 세션 생성
  const session = createSession(user.id, ip, userAgent);
  
  logSecurityEvent({
    type: 'login_success',
    userId: user.id,
    ip,
    userAgent,
  });
  
  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      failedLoginAttempts: 0,
      twoFactorEnabled: user.twoFactorEnabled,
    },
    session,
  };
}

/**
 * 로그아웃
 */
export function logout(sessionId: string): boolean {
  const session = sessions.get(sessionId);
  if (session) {
    logSecurityEvent({
      type: 'logout',
      userId: session.userId,
    });
    sessions.delete(sessionId);
    return true;
  }
  return false;
}

/**
 * 세션 생성
 */
function createSession(userId: string, ip: string, userAgent: string): Session {
  const session: Session = {
    id: generateCsrfToken(),
    userId,
    token: generateCsrfToken(),
    csrfToken: generateCsrfToken(),
    createdAt: Date.now(),
    lastActivity: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION,
    ip,
    userAgent,
  };
  
  sessions.set(session.id, session);
  return session;
}

/**
 * 세션 검증
 */
export function validateSession(sessionId: string, token: string): Session | null {
  const session = sessions.get(sessionId);
  
  if (!session) return null;
  if (session.token !== token) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }
  
  // 활동 시간 갱신
  session.lastActivity = Date.now();
  
  return session;
}

/**
 * CSRF 토큰 검증
 */
export function validateSessionCsrf(sessionId: string, csrfToken: string): boolean {
  const session = sessions.get(sessionId);
  if (!session) return false;
  
  if (session.csrfToken !== csrfToken) {
    logSecurityEvent({
      type: 'csrf_violation',
      userId: session.userId,
      details: { sessionId },
    });
    return false;
  }
  
  return true;
}

/**
 * 비밀번호 변경
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const user = users.get(userId);
  if (!user) {
    return { success: false, error: '사용자를 찾을 수 없습니다.' };
  }
  
  // 현재 비밀번호 확인
  const currentHash = await hashPassword(currentPassword);
  if (currentHash !== user.passwordHash) {
    return { success: false, error: '현재 비밀번호가 올바르지 않습니다.' };
  }
  
  // 새 비밀번호 설정
  user.passwordHash = await hashPassword(newPassword);
  
  // 모든 세션 무효화
  for (const [id, session] of sessions) {
    if (session.userId === userId) {
      sessions.delete(id);
    }
  }
  
  logSecurityEvent({
    type: 'password_change',
    userId,
  });
  
  return { success: true };
}

// ============================================
// Export
// ============================================

export const Auth = {
  // RBAC
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  
  // Authentication
  registerUser,
  login,
  logout,
  validateSession,
  validateSessionCsrf,
  changePassword,
};

export default Auth;

