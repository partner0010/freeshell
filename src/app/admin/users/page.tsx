/**
 * 사용자 관리 페이지
 * 실제 데이터 기반
 */

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  subscriptionTier: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin/users');
      return;
    }

    if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        router.push('/');
        return;
      }

      loadUsers();
    }
  }, [session, status, router]);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredUsers = users.filter((user) => {
    const name = user.name?.toLowerCase() || '';
    const email = user.email?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">사용자 관리</h1>
          <p className="text-gray-500 mt-1">총 {users.length}명의 사용자</p>
        </div>
      </div>

      {/* 검색 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="이름 또는 이메일로 검색..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </div>

      {/* 사용자 테이블 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">사용자</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">역할</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">구독</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">가입일</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  {users.length === 0 ? '등록된 사용자가 없습니다.' : '검색 결과가 없습니다.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name?.[0] || user.email?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.name || '이름 없음'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'admin' ? '관리자' : '사용자'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.subscriptionTier || 'free'}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
