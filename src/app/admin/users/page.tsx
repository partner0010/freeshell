'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Mail,
  Shield,
  Ban,
  Edit,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Eye,
  UserPlus,
} from 'lucide-react';

// 더미 사용자 데이터
const usersData = [
  { id: 1, name: '김철수', email: 'kim@example.com', plan: 'Pro', projects: 12, status: 'active', joinDate: '2024-01-15', lastActive: '2분 전' },
  { id: 2, name: '이영희', email: 'lee@example.com', plan: 'Free', projects: 3, status: 'active', joinDate: '2024-02-20', lastActive: '1시간 전' },
  { id: 3, name: '박민수', email: 'park@example.com', plan: 'Enterprise', projects: 45, status: 'active', joinDate: '2023-11-10', lastActive: '30분 전' },
  { id: 4, name: '정지원', email: 'jung@example.com', plan: 'Pro', projects: 8, status: 'inactive', joinDate: '2024-03-01', lastActive: '3일 전' },
  { id: 5, name: '최현우', email: 'choi@example.com', plan: 'Free', projects: 1, status: 'active', joinDate: '2024-03-25', lastActive: '5분 전' },
  { id: 6, name: '강서연', email: 'kang@example.com', plan: 'Pro', projects: 15, status: 'active', joinDate: '2024-01-08', lastActive: '12분 전' },
  { id: 7, name: '윤도현', email: 'yoon@example.com', plan: 'Free', projects: 2, status: 'suspended', joinDate: '2024-02-14', lastActive: '7일 전' },
  { id: 8, name: '임수빈', email: 'lim@example.com', plan: 'Enterprise', projects: 32, status: 'active', joinDate: '2023-09-20', lastActive: '1시간 전' },
];

const planColors: Record<string, string> = {
  Free: 'bg-gray-100 text-gray-700',
  Pro: 'bg-primary-100 text-primary-700',
  Enterprise: 'bg-purple-100 text-purple-700',
};

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-700', label: '활성' },
  inactive: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '비활성' },
  suspended: { bg: 'bg-red-100', text: 'text-red-700', label: '정지' },
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = selectedPlan === 'all' || user.plan === selectedPlan;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">사용자 관리</h1>
          <p className="text-gray-500 mt-1">총 {usersData.length}명의 사용자</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-gray-600 hover:bg-gray-50">
            <Download size={18} />
            내보내기
          </button>
          <button
            onClick={() => setShowUserModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            <UserPlus size={18} />
            사용자 추가
          </button>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* 검색 */}
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름 또는 이메일로 검색..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          {/* 플랜 필터 */}
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <option value="all">모든 플랜</option>
            <option value="Free">Free</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
          </select>

          {/* 상태 필터 */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <option value="all">모든 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
            <option value="suspended">정지</option>
          </select>
        </div>

        {/* 선택된 항목 액션 */}
        {selectedUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t flex items-center gap-4"
          >
            <span className="text-sm text-gray-600">{selectedUsers.length}명 선택됨</span>
            <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              <Mail size={14} />
              이메일 발송
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              <Shield size={14} />
              권한 변경
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg">
              <Ban size={14} />
              정지
            </button>
          </motion.div>
        )}
      </div>

      {/* 사용자 테이블 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={toggleAllUsers}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">사용자</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">플랜</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">프로젝트</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">상태</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">가입일</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">최근 활동</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${planColors[user.plan]}`}>
                    {user.plan}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.projects}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[user.status].bg} ${statusColors[user.status].text}`}>
                    {statusColors[user.status].label}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{user.joinDate}</td>
                <td className="px-6 py-4 text-gray-600 text-sm">{user.lastActive}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredUsers.length}명 중 1-{Math.min(10, filteredUsers.length)}명 표시
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="px-4 py-2 bg-primary-500 text-white rounded-lg">1</button>
            <button className="px-4 py-2 hover:bg-gray-50 rounded-lg">2</button>
            <button className="px-4 py-2 hover:bg-gray-50 rounded-lg">3</button>
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 사용자 추가 모달 */}
      <AnimatePresence>
        {showUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">새 사용자 추가</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" placeholder="홍길동" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                  <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300" placeholder="user@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">플랜</label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                    <option value="Free">Free</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">역할</label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                    <option value="user">일반 사용자</option>
                    <option value="editor">편집자</option>
                    <option value="admin">관리자</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  추가하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

