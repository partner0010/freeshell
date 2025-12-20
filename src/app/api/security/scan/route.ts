import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { CodeSecurityScanner } from '@/lib/security/code-security';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 관리자 권한 확인
    // 실제로는 데이터베이스에서 확인
    if (token.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { code, file } = await request.json();

    if (!code || !file) {
      return NextResponse.json(
        { error: '코드와 파일명을 입력하세요.' },
        { status: 400 }
      );
    }

    const scanner = new CodeSecurityScanner();
    const issues = scanner.scanCode(code, file);
    const report = scanner.generateReport(issues);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('보안 스캔 오류:', error);
    return NextResponse.json(
      { error: '보안 스캔 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

