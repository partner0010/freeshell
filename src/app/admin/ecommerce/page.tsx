'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  Filter,
  Eye,
  Edit2,
  MoreVertical,
  Download,
  RefreshCw,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Star,
  Tag,
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customer: { name: string; email: string };
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'outOfStock';
  category: string;
  sales: number;
}

export default function EcommerceManagementPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'customers'>('overview');
  const [dateRange, setDateRange] = useState('7d');

  const stats = {
    totalRevenue: 12580000,
    revenueChange: 15.3,
    totalOrders: 456,
    ordersChange: 8.2,
    averageOrder: 27588,
    avgOrderChange: 5.1,
    conversionRate: 3.8,
    conversionChange: -0.5,
  };

  const [orders] = useState<Order[]>([
    { id: '1', orderNumber: 'ORD-2024-001234', customer: { name: '김철수', email: 'kim@example.com' }, items: 3, total: 89000, status: 'delivered', paymentStatus: 'paid', createdAt: '2024-12-05 14:30' },
    { id: '2', orderNumber: 'ORD-2024-001235', customer: { name: '이영희', email: 'lee@example.com' }, items: 1, total: 35000, status: 'shipped', paymentStatus: 'paid', createdAt: '2024-12-05 13:15' },
    { id: '3', orderNumber: 'ORD-2024-001236', customer: { name: '박민수', email: 'park@example.com' }, items: 5, total: 156000, status: 'processing', paymentStatus: 'paid', createdAt: '2024-12-05 11:45' },
    { id: '4', orderNumber: 'ORD-2024-001237', customer: { name: '정수진', email: 'jung@example.com' }, items: 2, total: 67000, status: 'pending', paymentStatus: 'pending', createdAt: '2024-12-05 10:20' },
    { id: '5', orderNumber: 'ORD-2024-001238', customer: { name: '최동현', email: 'choi@example.com' }, items: 1, total: 29000, status: 'cancelled', paymentStatus: 'refunded', createdAt: '2024-12-04 16:55' },
  ]);

  const [products] = useState<Product[]>([
    { id: '1', name: '프리미엄 티셔츠', sku: 'TS-001', price: 35000, stock: 150, status: 'active', category: '의류', sales: 234 },
    { id: '2', name: '클래식 후드', sku: 'HD-001', price: 55000, stock: 80, status: 'active', category: '의류', sales: 156 },
    { id: '3', name: '스니커즈', sku: 'SN-001', price: 89000, stock: 0, status: 'outOfStock', category: '신발', sales: 89 },
    { id: '4', name: '레더 지갑', sku: 'WL-001', price: 45000, stock: 200, status: 'active', category: '액세서리', sales: 312 },
    { id: '5', name: '신제품 모자', sku: 'CP-001', price: 29000, stock: 50, status: 'draft', category: '액세서리', sales: 0 },
  ]);

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'shipped': return 'bg-blue-100 text-blue-600';
      case 'processing': return 'bg-yellow-100 text-yellow-600';
      case 'pending': return 'bg-gray-100 text-gray-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      case 'refunded': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'processing': return RefreshCw;
      case 'pending': return Clock;
      case 'cancelled': return XCircle;
      case 'refunded': return RefreshCw;
      default: return Clock;
    }
  };

  const getProductStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-600';
      case 'draft': return 'bg-gray-100 text-gray-600';
      case 'outOfStock': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">이커머스 관리</h1>
          <p className="text-gray-500 mt-1">주문, 상품, 고객을 관리합니다</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg"
          >
            <option value="1d">오늘</option>
            <option value="7d">7일</option>
            <option value="30d">30일</option>
            <option value="90d">90일</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            리포트
          </button>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'overview', label: '개요', icon: TrendingUp },
          { id: 'orders', label: '주문', icon: ShoppingCart },
          { id: 'products', label: '상품', icon: Package },
          { id: 'customers', label: '고객', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 개요 탭 */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 통계 카드 */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: '총 매출', value: formatCurrency(stats.totalRevenue), change: stats.revenueChange, icon: DollarSign, positive: true },
              { label: '총 주문', value: stats.totalOrders + '건', change: stats.ordersChange, icon: ShoppingCart, positive: true },
              { label: '평균 주문액', value: formatCurrency(stats.averageOrder), change: stats.avgOrderChange, icon: CreditCard, positive: true },
              { label: '전환율', value: stats.conversionRate + '%', change: stats.conversionChange, icon: TrendingUp, positive: false },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className={`flex items-center gap-1 ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-sm font-medium">{Math.abs(stat.change)}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* 최근 주문 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">최근 주문</h3>
              <button className="text-sm text-primary-600 hover:underline">모두 보기</button>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">주문번호</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">고객</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">금액</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">일시</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.slice(0, 5).map((order) => {
                  const StatusIcon = getOrderStatusIcon(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{order.orderNumber}</td>
                      <td className="px-4 py-3">
                        <p className="text-gray-800">{order.customer.name}</p>
                        <p className="text-xs text-gray-500">{order.customer.email}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{formatCurrency(order.total)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getOrderStatusColor(order.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          {order.status === 'delivered' ? '배송완료' :
                           order.status === 'shipped' ? '배송중' :
                           order.status === 'processing' ? '처리중' :
                           order.status === 'pending' ? '대기' :
                           order.status === 'cancelled' ? '취소' : '환불'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{order.createdAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 베스트 상품 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">베스트 상품</h3>
              <button className="text-sm text-primary-600 hover:underline">모두 보기</button>
            </div>
            <div className="p-4 space-y-3">
              {products.slice(0, 5).sort((a, b) => b.sales - a.sales).map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{product.sales}개</p>
                    <p className="text-xs text-gray-500">판매</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 주문 탭 */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="주문 검색..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <select className="px-4 py-2 border border-gray-200 rounded-lg">
                <option>전체 상태</option>
                <option>대기</option>
                <option>처리중</option>
                <option>배송중</option>
                <option>완료</option>
              </select>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">주문번호</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">고객</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상품</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">금액</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">결제</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-primary-600">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="text-gray-800">{order.customer.name}</p>
                    <p className="text-xs text-gray-500">{order.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.items}개</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' :
                      order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      order.paymentStatus === 'failed' ? 'bg-red-100 text-red-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {order.paymentStatus === 'paid' ? '결제완료' :
                       order.paymentStatus === 'pending' ? '대기' :
                       order.paymentStatus === 'failed' ? '실패' : '환불'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getOrderStatusColor(order.status)}`}>
                      {order.status === 'delivered' ? '배송완료' :
                       order.status === 'shipped' ? '배송중' :
                       order.status === 'processing' ? '처리중' :
                       order.status === 'pending' ? '대기' :
                       order.status === 'cancelled' ? '취소' : '환불'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 상품 탭 */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="상품 검색..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
              <Package className="w-4 h-4" />
              상품 추가
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상품</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">SKU</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">가격</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">재고</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">판매</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-sm">{product.sku}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={product.stock === 0 ? 'text-red-500' : product.stock < 20 ? 'text-yellow-500' : 'text-gray-600'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.sales}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getProductStatusColor(product.status)}`}>
                      {product.status === 'active' ? '판매중' :
                       product.status === 'draft' ? '임시저장' : '품절'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 고객 탭 */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">고객 관리</h3>
          <p className="text-gray-500">고객 목록, 구매 내역, VIP 등급 관리 기능이 여기에 표시됩니다.</p>
        </div>
      )}
    </div>
  );
}

