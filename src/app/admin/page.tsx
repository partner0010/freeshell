/**
 * 관리자 대시보드
 * 실제 데이터 기반 대시보드
 */

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Users,
  FolderKanban,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  activeProjects: number;
  todayContent: number;
  systemStatus: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    todayContent: 0,
    systemStatus: '정상',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 인증 확인
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin');
      return;
    }

    if (status === 'authenticated') {
      // 관리자 권한 확인
      if (session?.user?.role !== 'admin') {
        router.push('/');
        return;
      }

      loadStats();
      
      // 자동 점검 스케줄러 시작
      fetch('/api/admin/start-scheduler', { method: 'POST' }).catch(console.error);
      
      // AI 자동 학습 트리거 (24시간마다 자동 실행)
      triggerAutoLearning();
      
      // 도메인별 AI 자동 학습 트리거 (24시간마다 자동 실행)
      triggerDomainLearning();
    }
  }, [session, status, router]);

  // AI 자동 학습 트리거
  const triggerAutoLearning = async () => {
    try {
      // 마지막 학습 시간 확인 (24시간마다 실행)
      const lastLearning = localStorage.getItem('lastAutoLearning');
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      
      if (!lastLearning || (now - parseInt(lastLearning)) > oneDay) {
        // 온라인에서 자동 학습 실행
        const response = await fetch('/api/admin/learning/trigger', { method: 'POST' });
        if (response.ok) {
          localStorage.setItem('lastAutoLearning', now.toString());
          console.log('✅ AI 자동 학습이 완료되었습니다.');
        }
      }
    } catch (error) {
      console.error('AI 자동 학습 트리거 실패:', error);
    }
  };

  // 도메인별 AI 자동 학습 트리거
  const triggerDomainLearning = async () => {
    try {
      // 마지막 학습 시간 확인 (24시간마다 실행)
      const lastLearning = localStorage.getItem('lastDomainLearning');
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      
      if (!lastLearning || (now - parseInt(lastLearning)) > oneDay) {
        // 도메인별 자동 학습 실행
        const response = await fetch('/api/admin/domain-learning/trigger', { method: 'POST' });
        if (response.ok) {
          localStorage.setItem('lastDomainLearning', now.toString());
          console.log('✅ 도메인별 AI 자동 학습이 완료되었습니다.');
        }
      }
    } catch (error) {
      console.error('도메인별 AI 자동 학습 트리거 실패:', error);
    }
  };

  const loadStats = async () => {
    try {
      // 실제 API에서 데이터 가져오기
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-600">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  const statsData = [
    {
      title: '총 사용자',
      value: stats.totalUsers.toString(),
      change: '0%',
      trend: 'up' as const,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: '활성 프로젝트',
      value: stats.activeProjects.toString(),
      change: '0%',
      trend: 'up' as const,
      icon: FolderKanban,
      color: 'from-green-500 to-green-600',
    },
    {
      title: '오늘 생성된 콘텐츠',
      value: stats.todayContent.toString(),
      change: '0%',
      trend: 'up' as const,
      icon: Activity,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: '시스템 상태',
      value: stats.systemStatus,
      change: '100%',
      trend: 'up' as const,
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">대시보드</h1>
          <p className="text-gray-500 mt-1">Freeshell 플랫폼 전체 현황을 확인하세요</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, i) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span>{stat.change}</span>
                  <span className="text-gray-400">vs 지난달</span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 데이터 없음 메시지 */}
      <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
        <div className="text-gray-500 mb-4">
          <p className="text-lg font-medium mb-2">실제 사용 데이터가 수집되면 여기에 표시됩니다.</p>
          <p className="text-sm">현재는 초기 설정 단계입니다.</p>
        </div>
      </div>
    </div>
  );
}
