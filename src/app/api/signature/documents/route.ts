/**
 * 전자서명 문서 목록 API
 */

import { NextRequest, NextResponse } from 'next/server';

interface Document {
  id: string;
  title: string;
  fileName: string;
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'rejected';
  signers: Array<{
    id: string;
    name: string;
    email: string;
    status: 'pending' | 'signed' | 'rejected';
    signedAt?: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'sent' | 'received' | 'completed'

    // 실제로는 데이터베이스에서 조회해야 함
    // 여기서는 시뮬레이션
    const documents: Document[] = [];

    return NextResponse.json({
      success: true,
      documents,
    });
  } catch (error: any) {
    console.error('문서 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '문서 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

