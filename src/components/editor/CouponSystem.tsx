'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  Plus,
  Copy,
  Trash2,
  Edit2,
  Calendar,
  Percent,
  DollarSign,
  Users,
  Clock,
  Check,
  X,
  Settings,
  BarChart3,
  Tag,
  Gift,
} from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'freeShipping';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'expired' | 'disabled';
  applicableTo: 'all' | 'products' | 'categories';
  products?: string[];
  categories?: string[];
}

export function CouponSystem() {
  const [activeTab, setActiveTab] = useState<'coupons' | 'analytics' | 'settings'>('coupons');
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: '1',
      code: 'WELCOME20',
      type: 'percentage',
      value: 20,
      minPurchase: 30000,
      maxDiscount: 10000,
      usageLimit: 1000,
      usageCount: 456,
      perUserLimit: 1,
      endDate: '2024-12-31',
      status: 'active',
      applicableTo: 'all',
    },
    {
      id: '2',
      code: 'SAVE5000',
      type: 'fixed',
      value: 5000,
      minPurchase: 20000,
      usageCount: 234,
      endDate: '2024-12-15',
      status: 'active',
      applicableTo: 'all',
    },
    {
      id: '3',
      code: 'FREESHIP',
      type: 'freeShipping',
      value: 0,
      minPurchase: 50000,
      usageCount: 89,
      status: 'active',
      applicableTo: 'all',
    },
    {
      id: '4',
      code: 'BLACKFRIDAY',
      type: 'percentage',
      value: 50,
      usageLimit: 100,
      usageCount: 100,
      endDate: '2024-11-30',
      status: 'expired',
      applicableTo: 'all',
    },
  ]);
  
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage' as Coupon['type'],
    value: '',
    minPurchase: '',
    maxDiscount: '',
    usageLimit: '',
    perUserLimit: '',
    endDate: '',
  });

  const stats = {
    totalCoupons: 12,
    activeCoupons: 8,
    totalUsage: 1234,
    totalDiscount: 5680000,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-600';
      case 'expired':
        return 'bg-gray-100 text-gray-600';
      case 'disabled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return Percent;
      case 'fixed':
        return DollarSign;
      case 'freeShipping':
        return Gift;
      default:
        return Tag;
    }
  };

  const formatValue = (coupon: Coupon) => {
    switch (coupon.type) {
      case 'percentage':
        return `${coupon.value}% 할인`;
      case 'fixed':
        return `${coupon.value.toLocaleString()}원 할인`;
      case 'freeShipping':
        return '무료 배송';
      default:
        return '';
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAddCoupon = () => {
    if (!newCoupon.code || !newCoupon.value) return;
    
    const coupon: Coupon = {
      id: `coupon-${Date.now()}`,
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type,
      value: parseInt(newCoupon.value),
      minPurchase: newCoupon.minPurchase ? parseInt(newCoupon.minPurchase) : undefined,
      maxDiscount: newCoupon.maxDiscount ? parseInt(newCoupon.maxDiscount) : undefined,
      usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit) : undefined,
      usageCount: 0,
      perUserLimit: newCoupon.perUserLimit ? parseInt(newCoupon.perUserLimit) : undefined,
      endDate: newCoupon.endDate || undefined,
      status: 'active',
      applicableTo: 'all',
    };
    
    setCoupons([coupon, ...coupons]);
    setNewCoupon({
      code: '', type: 'percentage', value: '', minPurchase: '', maxDiscount: '', usageLimit: '', perUserLimit: '', endDate: '',
    });
    setShowAddCoupon(false);
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCoupon({ ...newCoupon, code });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Ticket className="w-5 h-5 text-primary-500" />
          쿠폰/할인
        </h3>
        <button
          onClick={() => setShowAddCoupon(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm"
        >
          <Plus className="w-4 h-4" />
          쿠폰
        </button>
      </div>
      
      {/* 통계 */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: '전체 쿠폰', value: stats.totalCoupons, icon: Ticket },
          { label: '활성 쿠폰', value: stats.activeCoupons, icon: Check },
          { label: '총 사용', value: stats.totalUsage.toLocaleString(), icon: Users },
          { label: '총 할인액', value: `${(stats.totalDiscount / 10000).toFixed(0)}만원`, icon: DollarSign },
        ].map((stat, index) => (
          <div
            key={index}
            className="p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center gap-1">
              <stat.icon className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
            <p className="font-bold text-gray-800 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>
      
      {/* 탭 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {[
          { id: 'coupons', label: '쿠폰' },
          { id: 'analytics', label: '분석' },
          { id: 'settings', label: '설정' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 px-3 py-1.5 rounded-md text-xs transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* 쿠폰 목록 */}
      {activeTab === 'coupons' && (
        <div className="space-y-2">
          {coupons.map((coupon) => {
            const TypeIcon = getTypeIcon(coupon.type);
            return (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-3 bg-white dark:bg-gray-700 rounded-lg border ${
                  coupon.status === 'active'
                    ? 'border-green-200 dark:border-green-800'
                    : 'border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      coupon.type === 'percentage' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      coupon.type === 'fixed' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      'bg-green-100 dark:bg-green-900/30'
                    }`}>
                      <TypeIcon className={`w-5 h-5 ${
                        coupon.type === 'percentage' ? 'text-purple-500' :
                        coupon.type === 'fixed' ? 'text-blue-500' :
                        'text-green-500'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <code className="font-bold text-gray-800 dark:text-white">{coupon.code}</code>
                        <button
                          onClick={() => copyCode(coupon.code)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                        >
                          {copiedCode === coupon.code ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-primary-600 font-medium">{formatValue(coupon)}</p>
                    </div>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(coupon.status)}`}>
                    {coupon.status === 'active' ? '활성' : coupon.status === 'expired' ? '만료' : '비활성'}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-500">
                  {coupon.minPurchase && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded">
                      최소 {coupon.minPurchase.toLocaleString()}원
                    </span>
                  )}
                  {coupon.maxDiscount && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded">
                      최대 {coupon.maxDiscount.toLocaleString()}원
                    </span>
                  )}
                  {coupon.usageLimit && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded">
                      {coupon.usageCount}/{coupon.usageLimit} 사용
                    </span>
                  )}
                  {coupon.endDate && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {coupon.endDate}까지
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                  <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-gray-600 dark:border-gray-500">
                    <Edit2 className="w-3 h-3" />
                    편집
                  </button>
                  {coupon.status === 'active' ? (
                    <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-yellow-600 border border-yellow-200 rounded hover:bg-yellow-50 dark:border-yellow-800 dark:hover:bg-yellow-900/20">
                      <X className="w-3 h-3" />
                      비활성화
                    </button>
                  ) : (
                    <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-green-600 border border-green-200 rounded hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20">
                      <Check className="w-3 h-3" />
                      활성화
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      
      {/* 분석 */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">인기 쿠폰</h4>
            <div className="space-y-2">
              {coupons.slice(0, 3).map((coupon, index) => (
                <div key={coupon.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded text-xs font-bold">
                      {index + 1}
                    </span>
                    <code className="text-sm text-gray-700 dark:text-gray-300">{coupon.code}</code>
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {coupon.usageCount}회
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">할인 유형별 사용</h4>
            <div className="space-y-2">
              {[
                { type: '퍼센트 할인', count: 678, color: 'bg-purple-500' },
                { type: '정액 할인', count: 456, color: 'bg-blue-500' },
                { type: '무료 배송', count: 100, color: 'bg-green-500' },
              ].map((item) => (
                <div key={item.type}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{item.type}</span>
                    <span className="text-gray-800 dark:text-white">{item.count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${(item.count / 678) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* 설정 */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">기본 설정</h4>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">중복 사용 허용</span>
                <input type="checkbox" className="w-4 h-4 accent-primary-500" />
              </label>
              
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">최초 구매자 전용</span>
                <input type="checkbox" className="w-4 h-4 accent-primary-500" />
              </label>
              
              <div>
                <label className="text-xs text-gray-500 mb-1 block">기본 만료 기간</label>
                <select className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-600 dark:border-gray-500">
                  <option>30일</option>
                  <option>60일</option>
                  <option>90일</option>
                  <option>무제한</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 쿠폰 추가 모달 */}
      <AnimatePresence>
        {showAddCoupon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddCoupon(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">새 쿠폰 만들기</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">쿠폰 코드 *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                      className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 uppercase"
                      placeholder="WELCOME20"
                    />
                    <button
                      onClick={generateCode}
                      className="px-3 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
                    >
                      생성
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">할인 유형 *</label>
                  <select
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as Coupon['type'] })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="percentage">퍼센트 할인</option>
                    <option value="fixed">정액 할인</option>
                    <option value="freeShipping">무료 배송</option>
                  </select>
                </div>
                
                {newCoupon.type !== 'freeShipping' && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                      할인 값 * ({newCoupon.type === 'percentage' ? '%' : '원'})
                    </label>
                    <input
                      type="number"
                      value={newCoupon.value}
                      onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      placeholder={newCoupon.type === 'percentage' ? '20' : '5000'}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">최소 구매액</label>
                    <input
                      type="number"
                      value={newCoupon.minPurchase}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: e.target.value })}
                      className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      placeholder="30000"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">최대 할인액</label>
                    <input
                      type="number"
                      value={newCoupon.maxDiscount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                      className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      placeholder="10000"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">사용 횟수 제한</label>
                    <input
                      type="number"
                      value={newCoupon.usageLimit}
                      onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                      className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">1인당 제한</label>
                    <input
                      type="number"
                      value={newCoupon.perUserLimit}
                      onChange={(e) => setNewCoupon({ ...newCoupon, perUserLimit: e.target.value })}
                      className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      placeholder="1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">만료일</label>
                  <input
                    type="date"
                    value={newCoupon.endDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, endDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddCoupon(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleAddCoupon}
                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    생성
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CouponSystem;

