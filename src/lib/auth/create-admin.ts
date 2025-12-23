/**
 * 기본 관리자 계정 생성
 * 초기 설정 시 실행
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function createDefaultAdmin() {
  try {
    // 기존 관리자 확인
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'admin',
      },
    });

    if (existingAdmin) {
      console.log('관리자 계정이 이미 존재합니다.');
      return existingAdmin;
    }

    // 기본 관리자 계정 생성
    const hashedPassword = await bcrypt.hash('admin123!@#', 10);

    const admin = await prisma.user.create({
      data: {
        email: 'admin@freeshell.co.kr',
        password: hashedPassword,
        name: '관리자',
        role: 'admin',
        emailVerified: new Date(),
      },
    });

    console.log('기본 관리자 계정이 생성되었습니다.');
    console.log('이메일: admin@freeshell.co.kr');
    console.log('비밀번호: admin123!@#');
    console.log('⚠️ 보안을 위해 로그인 후 비밀번호를 변경하세요!');

    return admin;
  } catch (error) {
    console.error('관리자 계정 생성 실패:', error);
    throw error;
  }
}

// 서버 시작 시 자동 실행 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  createDefaultAdmin().catch(console.error);
}

