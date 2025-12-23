/**
 * 프로젝트 관리 페이지
 * 실제 데이터 기반
 */

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin/projects');
      return;
    }

    if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        router.push('/');
        return;
      }
    }

    setLoading(false);
  }, [session, status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">프로젝트 관리</h1>
          <p className="text-gray-500 mt-1">모든 사용자의 프로젝트를 관리하세요</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
        <div className="text-gray-500">
          <p className="text-lg font-medium mb-2">프로젝트 관리 기능은 추후 구현 예정입니다.</p>
          <p className="text-sm">실제 프로젝트 데이터가 수집되면 여기에 표시됩니다.</p>
        </div>
      </div>
    </div>
  );
}
