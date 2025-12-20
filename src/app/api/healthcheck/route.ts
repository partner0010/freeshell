import { NextResponse } from 'next/server';
import { runPassiveHealthcheck, validateDomain } from '../../../lib/monitoring/healthcheck';
import { prisma } from '../../../lib/db';
import type { HealthcheckResult } from '../../../types/healthcheck';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  const projectId = searchParams.get('projectId');

  if (!domain || !validateDomain(domain)) {
    return NextResponse.json(
      { error: '유효한 도메인을 querystring domain= 에 입력하세요.' },
      { status: 400 }
    );
  }

  try {
    const domainName = domain.toLowerCase();
    const result = await runPassiveHealthcheck(domainName);

    // DB 저장 (projectId가 주어지고, DATABASE_URL이 설정되어 있을 때만)
    persistResult(domainName, projectId, result).catch((err) => {
      console.error('Persist healthcheck failed:', err);
    });

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=43200', // 12시간 캐시
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: '헬스체크 중 오류가 발생했습니다.', detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}

async function persistResult(domainName: string, projectId: string | null, result: HealthcheckResult) {
  if (!process.env.DATABASE_URL) return; // DB 미설정 시 스킵
  if (!projectId) return; // 프로젝트 지정 없는 경우 스킵

  // 프로젝트 존재 확인
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });
  if (!project) return;

  // 기존 도메인이 다른 프로젝트에 묶여 있으면 스킵
  const existing = await prisma.domain.findUnique({
    where: { name: domainName },
    select: { id: true, projectId: true },
  });
  if (existing && existing.projectId !== projectId) return;

  const upserted = await prisma.domain.upsert({
    where: { name: domainName },
    create: {
      name: domainName,
      projectId,
      lastCheckedAt: new Date(result.checkedAt),
      expiresAt: result.certificate?.expiresAt ? new Date(result.certificate.expiresAt) : null,
      statusCache: result,
    },
    update: {
      lastCheckedAt: new Date(result.checkedAt),
      expiresAt: result.certificate?.expiresAt ? new Date(result.certificate.expiresAt) : null,
      statusCache: result,
      updatedAt: new Date(),
    },
  });

  await prisma.check.create({
    data: {
      domainId: upserted.id,
      summary: result,
    },
  });
}

