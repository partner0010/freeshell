'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Type,
  Mail,
  Phone,
  AlignLeft,
  CheckSquare,
  Circle,
  ChevronDown,
  Calendar,
  Hash,
  Link,
  Upload,
  Star,
  Plus,
  Trash2,
  GripVertical,
  Settings,
  Eye,
  Copy,
  Save,
} from 'lucide-react';

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

const fieldTypes = [
  { type: 'text', label: '텍스트', icon: Type },
  { type: 'email', label: '이메일', icon: Mail },
  { type: 'phone', label: '전화번호', icon: Phone },
  { type: 'textarea', label: '장문 텍스트', icon: AlignLeft },
  { type: 'checkbox', label: '체크박스', icon: CheckSquare },
  { type: 'radio', label: '라디오', icon: Circle },
  { type: 'select', label: '드롭다운', icon: ChevronDown },
  { type: 'date', label: '날짜', icon: Calendar },
  { type: 'number', label: '숫자', icon: Hash },
  { type: 'url', label: 'URL', icon: Link },
  { type: 'file', label: '파일 업로드', icon: Upload },
  { type: 'rating', label: '평점', icon: Star },
];

export default function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([
    { id: '1', type: 'text', label: '이름', placeholder: '이름을 입력하세요', required: true },
    { id: '2', type: 'email', label: '이메일', placeholder: 'email@example.com', required: true },
    { id: '3', type: 'textarea', label: '메시지', placeholder: '문의 내용을 입력하세요', required: false },
  ]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const addField = (type: string) => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: fieldTypes.find(f => f.type === type)?.label || '새 필드',
      placeholder: '',
      required: false,
      options: ['checkbox', 'radio', 'select'].includes(type) ? ['옵션 1', '옵션 2'] : undefined,
    };
    setFields([...fields, newField]);
    setSelectedField(newField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    if (selectedField === id) setSelectedField(null);
  };

  const duplicateField = (id: string) => {
    const field = fields.find(f => f.id === id);
    if (field) {
      const newField = { ...field, id: Math.random().toString(36).substr(2, 9) };
      const index = fields.findIndex(f => f.id === id);
      const newFields = [...fields];
      newFields.splice(index + 1, 0, newField);
      setFields(newFields);
    }
  };

  const renderFieldPreview = (field: FormField) => {
    const baseInputClass = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300";

    switch (field.type) {
      case 'textarea':
        return <textarea className={`${baseInputClass} h-24 resize-none`} placeholder={field.placeholder} />;
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-primary-500" />
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name={field.id} className="text-primary-500" />
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'select':
        return (
          <select className={baseInputClass}>
            <option value="">{field.placeholder || '선택하세요'}</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'rating':
        return (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} className="text-gray-300 hover:text-yellow-400 transition-colors">
                <Star size={24} />
              </button>
            ))}
          </div>
        );
      case 'file':
        return (
          <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
            <Upload className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-sm text-gray-500">클릭하여 파일 업로드</p>
          </div>
        );
      default:
        return <input type={field.type} className={baseInputClass} placeholder={field.placeholder} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">폼 빌더</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
              previewMode ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Eye size={14} />
            {previewMode ? '편집' : '미리보기'}
          </button>
          <button className="px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm flex items-center gap-1">
            <Save size={14} />
            저장
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 필드 타입 팔레트 */}
        {!previewMode && (
          <div className="w-48 border-r p-4 overflow-y-auto">
            <p className="text-xs font-medium text-gray-500 mb-3">필드 추가</p>
            <div className="grid grid-cols-2 gap-2">
              {fieldTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => addField(type.type)}
                  className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
                >
                  <type.icon size={18} className="mx-auto text-gray-500 mb-1" />
                  <span className="text-xs text-gray-600">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 폼 캔버스 */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">문의하기</h2>
            <p className="text-sm text-gray-500 mb-6">아래 양식을 작성해주세요</p>

            <Reorder.Group
              axis="y"
              values={fields}
              onReorder={setFields}
              className="space-y-4"
            >
              {fields.map((field) => (
                <Reorder.Item
                  key={field.id}
                  value={field}
                  className={`
                    group relative p-4 rounded-xl transition-all
                    ${!previewMode ? 'hover:bg-gray-50 cursor-move' : ''}
                    ${selectedField === field.id && !previewMode ? 'ring-2 ring-primary-300 bg-primary-50' : ''}
                  `}
                  onClick={() => !previewMode && setSelectedField(field.id)}
                >
                  {!previewMode && (
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical size={16} className="text-gray-400" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderFieldPreview(field)}
                  </div>

                  {!previewMode && selectedField === field.id && (
                    <div className="absolute -right-2 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); duplicateField(field.id); }}
                        className="p-1.5 bg-white shadow rounded-lg hover:bg-gray-50"
                      >
                        <Copy size={14} className="text-gray-500" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                        className="p-1.5 bg-white shadow rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  )}
                </Reorder.Item>
              ))}
            </Reorder.Group>

            {!previewMode && (
              <button
                onClick={() => addField('text')}
                className="w-full mt-4 py-3 border-2 border-dashed rounded-xl text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                필드 추가
              </button>
            )}

            {previewMode && (
              <button className="w-full mt-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
                제출하기
              </button>
            )}
          </div>
        </div>

        {/* 필드 설정 패널 */}
        {!previewMode && selectedField && (
          <div className="w-64 border-l p-4 overflow-y-auto">
            <p className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1">
              <Settings size={12} />
              필드 설정
            </p>
            {(() => {
              const field = fields.find(f => f.id === selectedField);
              if (!field) return null;
              return (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">라벨</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">플레이스홀더</label>
                    <input
                      type="text"
                      value={field.placeholder || ''}
                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="required"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                      className="rounded text-primary-500"
                    />
                    <label htmlFor="required" className="text-sm text-gray-700">필수 입력</label>
                  </div>
                  {field.options && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">옵션</label>
                      {field.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...field.options!];
                              newOptions[i] = e.target.value;
                              updateField(field.id, { options: newOptions });
                            }}
                            className="flex-1 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                          />
                          <button
                            onClick={() => {
                              const newOptions = field.options!.filter((_, idx) => idx !== i);
                              updateField(field.id, { options: newOptions });
                            }}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => updateField(field.id, { options: [...field.options!, `옵션 ${field.options!.length + 1}`] })}
                        className="text-sm text-primary-500 hover:underline"
                      >
                        + 옵션 추가
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

