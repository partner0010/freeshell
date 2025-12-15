'use client';

import React, { useState, useMemo } from 'react';
import { Search, Star, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  id: string;
  label: string;
  icon?: any;
  category: string;
  keywords: string[];
}

interface MenuSearchProps {
  items: MenuItem[];
  onSelect: (id: string) => void;
  favorites?: string[];
  recent?: string[];
  onToggleFavorite?: (id: string) => void;
}

export function MenuSearch({ 
  items, 
  onSelect, 
  favorites = [], 
  recent = [],
  onToggleFavorite 
}: MenuSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  // 카테고리 목록
  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((item) => item.category)));
    return cats;
  }, [items]);

  // 필터링된 항목
  const filteredItems = useMemo(() => {
    let filtered = items;

    // 검색 쿼리 필터
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter((item) => {
        const matchesLabel = item.label.toLowerCase().includes(lowerQuery);
        const matchesKeywords = item.keywords.some((kw) => kw.toLowerCase().includes(lowerQuery));
        return matchesLabel || matchesKeywords;
      });
    }

    // 카테고리 필터
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // 즐겨찾기 필터
    if (showFavorites) {
      filtered = filtered.filter((item) => favorites.includes(item.id));
    }

    return filtered;
  }, [items, query, selectedCategory, showFavorites, favorites]);

  // 최근 항목
  const recentItems = useMemo(() => {
    return recent
      .map((id) => items.find((item) => item.id === id))
      .filter((item): item is MenuItem => item !== undefined);
  }, [recent, items]);

  return (
    <div className="flex flex-col h-full">
      {/* 검색 바 */}
      <div className="p-4 border-b bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="메뉴 검색..."
            className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* 필터 */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              showFavorites
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Star size={14} className="inline mr-1" />
            즐겨찾기
          </button>
          
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-colors ${
                !selectedCategory
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="flex-1 overflow-auto p-4">
        {/* 최근 항목 (검색 없을 때) */}
        {!query && !selectedCategory && !showFavorites && recentItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
              <Clock size={16} />
              최근 사용
            </div>
            <div className="space-y-2">
              {recentItems.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className="w-full flex items-center gap-3 p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  {item.icon && <item.icon size={20} className="text-gray-500" />}
                  <span className="flex-1">{item.label}</span>
                  <span className="text-xs text-gray-400">{item.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 검색 결과 */}
        <div>
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              검색 결과가 없습니다
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => onSelect(item.id)}
                  className="w-full flex items-center gap-3 p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors text-left group"
                >
                  {item.icon && <item.icon size={20} className="text-gray-500" />}
                  <span className="flex-1">{item.label}</span>
                  <span className="text-xs text-gray-400">{item.category}</span>
                  {onToggleFavorite && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                        favorites.includes(item.id) ? 'text-yellow-500 opacity-100' : 'text-gray-400'
                      }`}
                    >
                      <Star size={16} fill={favorites.includes(item.id) ? 'currentColor' : 'none'} />
                    </button>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

