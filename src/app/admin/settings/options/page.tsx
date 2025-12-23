/**
 * 관리자 옵션 설정 페이지
 * 다양한 옵션 및 설정 관리
 */

'use client';

import { useEffect, useState } from 'react';
import { Settings, Save, RefreshCw, Bell, Shield, Zap, Globe } from 'lucide-react';

interface AdminOption {
  id: string;
  category: string;
  name: string;
  description: string;
  type: 'boolean' | 'number' | 'string' | 'select';
  value: any;
  options?: string[];
  default: any;
}

export default function AdminOptionsPage() {
  const [options, setOptions] = useState<AdminOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings/options');
      if (response.ok) {
        const data = await response.json();
        setOptions(data.options || []);
      }
    } catch (error) {
      console.error('옵션 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings/options', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ options }),
      });

      if (response.ok) {
        alert('옵션이 저장되었습니다.');
      }
    } catch (error) {
      console.error('옵션 저장 실패:', error);
      alert('옵션 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleOptionChange = (id: string, value: any) => {
    setOptions(prev => prev.map(opt => 
      opt.id === id ? { ...opt, value } : opt
    ));
  };

  const handleReset = (id: string) => {
    setOptions(prev => prev.map(opt => 
      opt.id === id ? { ...opt, value: opt.default } : opt
    ));
  };

  const categories = [
    { id: 'general', label: '일반', icon: Settings },
    { id: 'security', label: '보안', icon: Shield },
    { id: 'performance', label: '성능', icon: Zap },
    { id: 'notifications', label: '알림', icon: Bell },
    { id: 'integration', label: '통합', icon: Globe },
  ];

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">옵션 설정</h1>
          <p className="text-gray-600 mt-1">다양한 옵션을 설정하고 관리하세요</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>

      {categories.map((category) => {
        const categoryOptions = options.filter(o => o.category === category.id);
        if (categoryOptions.length === 0) return null;

        return (
          <div key={category.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <category.icon className="text-white" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{category.label}</h2>
            </div>

            <div className="space-y-4">
              {categoryOptions.map((option) => (
                <div key={option.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{option.name}</h3>
                      <button
                        onClick={() => handleReset(option.id)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        기본값으로
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                    
                    {option.type === 'boolean' && (
                      <button
                        onClick={() => handleOptionChange(option.id, !option.value)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          option.value ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          option.value ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    )}

                    {option.type === 'number' && (
                      <input
                        type="number"
                        value={option.value}
                        onChange={(e) => handleOptionChange(option.id, parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}

                    {option.type === 'string' && (
                      <input
                        type="text"
                        value={option.value}
                        onChange={(e) => handleOptionChange(option.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}

                    {option.type === 'select' && option.options && (
                      <select
                        value={option.value}
                        onChange={(e) => handleOptionChange(option.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {option.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
