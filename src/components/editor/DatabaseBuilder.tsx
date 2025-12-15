'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Table,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  Eye,
  Link,
  Type,
  Hash,
  Calendar,
  CheckSquare,
  Image,
  Mail,
  Phone,
  Globe,
  MoreVertical,
  Settings,
} from 'lucide-react';

interface Field {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'email' | 'url' | 'phone' | 'image' | 'relation';
  required: boolean;
  options?: string[];
  relationTable?: string;
}

interface TableSchema {
  id: string;
  name: string;
  fields: Field[];
  recordCount: number;
}

interface Record {
  id: string;
  [key: string]: unknown;
}

export function DatabaseBuilder() {
  const [activeTab, setActiveTab] = useState<'tables' | 'data' | 'settings'>('tables');
  const [selectedTable, setSelectedTable] = useState<string | null>('1');
  const [showAddField, setShowAddField] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);
  
  const [tables, setTables] = useState<TableSchema[]>([
    {
      id: '1',
      name: 'users',
      fields: [
        { id: 'f1', name: 'name', type: 'text', required: true },
        { id: 'f2', name: 'email', type: 'email', required: true },
        { id: 'f3', name: 'role', type: 'select', required: false, options: ['admin', 'user', 'guest'] },
        { id: 'f4', name: 'active', type: 'boolean', required: false },
        { id: 'f5', name: 'created_at', type: 'date', required: false },
      ],
      recordCount: 156,
    },
    {
      id: '2',
      name: 'products',
      fields: [
        { id: 'f6', name: 'title', type: 'text', required: true },
        { id: 'f7', name: 'price', type: 'number', required: true },
        { id: 'f8', name: 'image', type: 'image', required: false },
        { id: 'f9', name: 'url', type: 'url', required: false },
      ],
      recordCount: 48,
    },
  ]);
  
  const [records, setRecords] = useState<Record[]>([
    { id: '1', name: '김철수', email: 'kim@example.com', role: 'admin', active: true, created_at: '2024-01-15' },
    { id: '2', name: '이영희', email: 'lee@example.com', role: 'user', active: true, created_at: '2024-02-20' },
    { id: '3', name: '박민수', email: 'park@example.com', role: 'user', active: false, created_at: '2024-03-10' },
  ]);
  
  const [newField, setNewField] = useState({
    name: '',
    type: 'text' as Field['type'],
    required: false,
    options: '',
  });

  const currentTable = tables.find((t) => t.id === selectedTable);

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'text': return Type;
      case 'number': return Hash;
      case 'date': return Calendar;
      case 'boolean': return CheckSquare;
      case 'email': return Mail;
      case 'phone': return Phone;
      case 'url': return Globe;
      case 'image': return Image;
      case 'relation': return Link;
      default: return Type;
    }
  };

  const handleAddField = () => {
    if (!newField.name || !selectedTable) return;
    
    const field: Field = {
      id: `f-${Date.now()}`,
      name: newField.name.toLowerCase().replace(/\s+/g, '_'),
      type: newField.type,
      required: newField.required,
      options: newField.type === 'select' ? newField.options.split(',').map((o) => o.trim()) : undefined,
    };
    
    setTables(tables.map((t) =>
      t.id === selectedTable ? { ...t, fields: [...t.fields, field] } : t
    ));
    
    setNewField({ name: '', type: 'text', required: false, options: '' });
    setShowAddField(false);
  };

  const handleAddTable = () => {
    const newTable: TableSchema = {
      id: `table-${Date.now()}`,
      name: `table_${tables.length + 1}`,
      fields: [
        { id: `f-${Date.now()}`, name: 'id', type: 'text', required: true },
      ],
      recordCount: 0,
    };
    setTables([...tables, newTable]);
    setSelectedTable(newTable.id);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-primary-500" />
          데이터베이스
        </h3>
        <button
          onClick={handleAddTable}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm"
        >
          <Plus className="w-4 h-4" />
          테이블
        </button>
      </div>
      
      {/* 테이블 선택 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => setSelectedTable(table.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              selectedTable === table.id
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 border border-primary-300'
                : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-primary-300'
            }`}
          >
            <Table className="w-4 h-4" />
            {table.name}
            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-xs">
              {table.recordCount}
            </span>
          </button>
        ))}
      </div>
      
      {/* 탭 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {[
          { id: 'tables', label: '스키마' },
          { id: 'data', label: '데이터' },
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
      
      {/* 스키마 뷰 */}
      {activeTab === 'tables' && currentTable && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">필드</h4>
            <button
              onClick={() => setShowAddField(true)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
            >
              <Plus className="w-3 h-3" />
              필드 추가
            </button>
          </div>
          
          <div className="space-y-2">
            {currentTable.fields.map((field) => {
              const Icon = getFieldIcon(field.type);
              return (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white text-sm">{field.name}</p>
                      <p className="text-xs text-gray-500">
                        {field.type}
                        {field.required && ' • 필수'}
                        {field.options && ` • ${field.options.join(', ')}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                      <Edit2 className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    {field.name !== 'id' && (
                      <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* 데이터 뷰 */}
      {activeTab === 'data' && currentTable && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="검색..."
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <button className="p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
              <Filter className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => setShowAddRecord(true)}
              className="flex items-center gap-1 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm"
            >
              <Plus className="w-4 h-4" />
              추가
            </button>
          </div>
          
          {/* 데이터 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  {currentTable.fields.map((field) => (
                    <th key={field.id} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      {field.name}
                    </th>
                  ))}
                  <th className="px-3 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    {currentTable.fields.map((field) => (
                      <td key={field.id} className="px-3 py-2 text-gray-700 dark:text-gray-300">
                        {field.type === 'boolean' ? (
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            record[field.name] ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {record[field.name] ? 'Yes' : 'No'}
                          </span>
                        ) : (
                          String(record[field.name] || '-')
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 내보내기/가져오기 */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 text-sm">
              <Download className="w-4 h-4" />
              CSV 내보내기
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 text-sm">
              <Upload className="w-4 h-4" />
              CSV 가져오기
            </button>
          </div>
        </div>
      )}
      
      {/* 설정 */}
      {activeTab === 'settings' && currentTable && (
        <div className="space-y-4">
          <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">테이블 설정</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">테이블 이름</label>
                <input
                  type="text"
                  defaultValue={currentTable.name}
                  className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-500 mb-1 block">설명</label>
                <textarea
                  className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                  rows={2}
                  placeholder="테이블 설명..."
                />
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="text-sm font-medium text-red-600 mb-2">위험 구역</h4>
            <p className="text-xs text-red-500 mb-3">이 작업은 되돌릴 수 없습니다.</p>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
              테이블 삭제
            </button>
          </div>
        </div>
      )}
      
      {/* 필드 추가 모달 */}
      <AnimatePresence>
        {showAddField && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddField(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">새 필드 추가</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">필드명 *</label>
                  <input
                    type="text"
                    value={newField.name}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="예: username"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">타입 *</label>
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField({ ...newField, type: e.target.value as Field['type'] })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="text">텍스트</option>
                    <option value="number">숫자</option>
                    <option value="date">날짜</option>
                    <option value="boolean">예/아니오</option>
                    <option value="select">선택</option>
                    <option value="email">이메일</option>
                    <option value="url">URL</option>
                    <option value="phone">전화번호</option>
                    <option value="image">이미지</option>
                  </select>
                </div>
                
                {newField.type === 'select' && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">옵션 (쉼표로 구분)</label>
                    <input
                      type="text"
                      value={newField.options}
                      onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      placeholder="옵션1, 옵션2, 옵션3"
                    />
                  </div>
                )}
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newField.required}
                    onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                    className="w-4 h-4 accent-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">필수 항목</span>
                </label>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddField(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleAddField}
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

export default DatabaseBuilder;

