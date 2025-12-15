'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  CreditCard,
  Package,
  Tag,
  Percent,
  Truck,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Settings,
  BarChart3,
  Users,
  TrendingUp,
  Check,
  X,
  Image,
  Copy,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  description: string;
  stock: number;
  category: string;
  sku: string;
  status: 'active' | 'draft' | 'archived';
}

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

export function EcommercePanel() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings' | 'analytics'>('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: '프리미엄 티셔츠',
      price: 35000,
      salePrice: 29000,
      image: 'https://via.placeholder.com/100',
      description: '고품질 면 100% 티셔츠',
      stock: 150,
      category: '의류',
      sku: 'TS-001',
      status: 'active',
    },
    {
      id: '2',
      name: '클래식 후드',
      price: 55000,
      image: 'https://via.placeholder.com/100',
      description: '따뜻한 플리스 후드',
      stock: 80,
      category: '의류',
      sku: 'HD-001',
      status: 'active',
    },
  ]);
  
  const [orders] = useState<Order[]>([
    { id: 'ORD-001', customer: '김철수', email: 'kim@example.com', total: 64000, status: 'delivered', date: '2024-12-04', items: 2 },
    { id: 'ORD-002', customer: '이영희', email: 'lee@example.com', total: 35000, status: 'processing', date: '2024-12-05', items: 1 },
    { id: 'ORD-003', customer: '박민수', email: 'park@example.com', total: 110000, status: 'pending', date: '2024-12-05', items: 3 },
  ]);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    salePrice: '',
    description: '',
    stock: '',
    category: '',
    sku: '',
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    stripePublicKey: 'pk_test_***',
    paypalEnabled: false,
    currency: 'KRW',
    taxRate: 10,
    freeShippingThreshold: 50000,
    shippingFee: 3000,
  });
  
  const stats = {
    totalRevenue: 1250000,
    totalOrders: 48,
    averageOrderValue: 26042,
    conversionRate: 3.2,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'delivered':
        return 'bg-green-100 text-green-600';
      case 'processing':
      case 'shipped':
        return 'bg-blue-100 text-blue-600';
      case 'pending':
      case 'draft':
        return 'bg-yellow-100 text-yellow-600';
      case 'cancelled':
      case 'archived':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    
    const product: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      price: parseInt(newProduct.price),
      salePrice: newProduct.salePrice ? parseInt(newProduct.salePrice) : undefined,
      image: 'https://via.placeholder.com/100',
      description: newProduct.description,
      stock: parseInt(newProduct.stock) || 0,
      category: newProduct.category,
      sku: newProduct.sku || `SKU-${Date.now()}`,
      status: 'draft',
    };
    
    setProducts([...products, product]);
    setNewProduct({ name: '', price: '', salePrice: '', description: '', stock: '', category: '', sku: '' });
    setShowAddProduct(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary-500" />
          이커머스
        </h3>
      </div>
      
      {/* 탭 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {[
          { id: 'products', label: '상품', icon: Package },
          { id: 'orders', label: '주문', icon: CreditCard },
          { id: 'analytics', label: '분석', icon: BarChart3 },
          { id: 'settings', label: '설정', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* 상품 관리 */}
      {activeTab === 'products' && (
        <div className="space-y-3">
          <button
            onClick={() => setShowAddProduct(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            상품 추가
          </button>
          
          {/* 상품 목록 */}
          <div className="space-y-2">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <Image className="w-6 h-6 text-gray-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white text-sm truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(product.status)}`}>
                        {product.status === 'active' ? '활성' : product.status === 'draft' ? '임시저장' : '보관'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        {product.salePrice ? (
                          <>
                            <span className="font-semibold text-red-500 text-sm">
                              {formatCurrency(product.salePrice)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              {formatCurrency(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold text-gray-800 dark:text-white text-sm">
                            {formatCurrency(product.price)}
                          </span>
                        )}
                      </div>
                      
                      <span className="text-xs text-gray-500">
                        재고: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                  <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                    <Edit2 className="w-3 h-3" />
                    편집
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                    <Eye className="w-3 h-3" />
                    미리보기
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                    <Trash2 className="w-3 h-3" />
                    삭제
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* 주문 관리 */}
      {activeTab === 'orders' && (
        <div className="space-y-2">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 dark:text-white text-sm">{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status === 'pending' ? '대기' : 
                       order.status === 'processing' ? '처리중' :
                       order.status === 'shipped' ? '배송중' :
                       order.status === 'delivered' ? '완료' : '취소'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.customer} • {order.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">
                    {formatCurrency(order.total)}
                  </p>
                  <p className="text-xs text-gray-500">{order.items}개 상품</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-600">
                <span className="text-xs text-gray-500">{order.date}</span>
                <button className="text-xs text-primary-500 hover:underline">상세보기</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* 분석 */}
      {activeTab === 'analytics' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '총 매출', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'text-green-500' },
              { label: '총 주문', value: stats.totalOrders + '건', icon: Package, color: 'text-blue-500' },
              { label: '평균 주문액', value: formatCurrency(stats.averageOrderValue), icon: TrendingUp, color: 'text-purple-500' },
              { label: '전환율', value: stats.conversionRate + '%', icon: Users, color: 'text-orange-500' },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center gap-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-gray-500">{stat.label}</span>
                </div>
                <p className="font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-gradient-to-br from-primary-50 to-pastel-lavender dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg">
            <h4 className="font-medium text-gray-800 dark:text-white text-sm mb-2">💡 인사이트</h4>
            <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li>• 이번 주 매출이 지난 주 대비 15% 증가했습니다.</li>
              <li>• 가장 인기 있는 카테고리는 '의류'입니다.</li>
              <li>• 장바구니 이탈률: 23%</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* 설정 */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          {/* 결제 설정 */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              결제 설정
            </h4>
            
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-xs">S</span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Stripe</span>
                </div>
                <input
                  type="checkbox"
                  checked={paymentSettings.stripeEnabled}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, stripeEnabled: e.target.checked })}
                  className="w-4 h-4 accent-primary-500"
                />
              </label>
              
              <label className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xs">P</span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">PayPal</span>
                </div>
                <input
                  type="checkbox"
                  checked={paymentSettings.paypalEnabled}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, paypalEnabled: e.target.checked })}
                  className="w-4 h-4 accent-primary-500"
                />
              </label>
            </div>
          </div>
          
          {/* 배송 설정 */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Truck className="w-4 h-4" />
              배송 설정
            </h4>
            
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">기본 배송비</label>
                <input
                  type="number"
                  value={paymentSettings.shippingFee}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, shippingFee: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-500 mb-1 block">무료배송 기준금액</label>
                <input
                  type="number"
                  value={paymentSettings.freeShippingThreshold}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, freeShippingThreshold: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
          
          {/* 세금 설정 */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Percent className="w-4 h-4" />
              세금 설정
            </h4>
            
            <div>
              <label className="text-xs text-gray-500 mb-1 block">부가세율 (%)</label>
              <input
                type="number"
                value={paymentSettings.taxRate}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, taxRate: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* 상품 추가 모달 */}
      <AnimatePresence>
        {showAddProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddProduct(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">새 상품 추가</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">상품명 *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="상품명을 입력하세요"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">정가 *</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">할인가</label>
                    <input
                      type="number"
                      value={newProduct.salePrice}
                      onChange={(e) => setNewProduct({ ...newProduct, salePrice: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">설명</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    rows={3}
                    placeholder="상품 설명을 입력하세요"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">재고</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">카테고리</label>
                    <input
                      type="text"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      placeholder="카테고리"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddProduct(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleAddProduct}
                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    추가
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

export default EcommercePanel;

