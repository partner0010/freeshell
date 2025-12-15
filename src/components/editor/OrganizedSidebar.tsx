'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Search,
  Star,
  Clock,
  X,
  Menu as MenuIcon,
} from 'lucide-react';
import { menuOrganizer, type MenuCategory, type MenuItem } from '@/lib/navigation/menu-organizer';
import { MenuSearch } from './MenuSearch';
import { renderSidebarPanel } from './SidebarPanelRenderer';
import type { SidebarTab } from './Sidebar';

interface OrganizedSidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  currentContext?: string;
}

export function OrganizedSidebar({
  activeTab,
  onTabChange,
  currentContext,
}: OrganizedSidebarProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('menu-favorites') || '[]');
    }
    return [];
  });
  const [recent, setRecent] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('menu-recent') || '[]');
    }
    return [];
  });

  useEffect(() => {
    const cats = menuOrganizer.getCategories();
    setCategories(cats);
    
    // 기본적으로 모든 카테고리 펼쳐짐
    const initialCollapsed = new Set<string>();
    setCollapsedCategories(initialCollapsed);
  }, []);

  const handleSelect = (id: string) => {
    onTabChange(id as SidebarTab);
    setShowSearch(false);
    
    // 최근 항목 업데이트
    const newRecent = [id, ...recent.filter((item) => item !== id)].slice(0, 10);
    setRecent(newRecent);
    localStorage.setItem('menu-recent', JSON.stringify(newRecent));
  };

  const handleToggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('menu-favorites', JSON.stringify(newFavorites));
  };

  const toggleCategory = (categoryId: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(categoryId)) {
      newCollapsed.delete(categoryId);
    } else {
      newCollapsed.add(categoryId);
    }
    setCollapsedCategories(newCollapsed);
  };

  // 컨텍스트별 메뉴
  const contextualItems = currentContext
    ? menuOrganizer.getContextualMenu(currentContext)
    : [];

  if (showSearch) {
    const allItems = menuOrganizer.getAllItems().map((item) => ({
      ...item,
      icon: undefined, // 실제로는 아이콘 매핑 필요
    }));

    return (
      <div className="w-80 h-full bg-white border-r flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">메뉴 검색</h2>
          <button
            onClick={() => setShowSearch(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>
        <MenuSearch
          items={allItems}
          onSelect={handleSelect}
          favorites={favorites}
          recent={recent}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-white border-r flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">메뉴</h2>
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="검색 (Ctrl+K)"
          >
            <Search size={18} />
          </button>
        </div>

        {/* 즐겨찾기 (있는 경우) */}
        {favorites.length > 0 && (
          <div className="flex gap-1 overflow-x-auto pb-2">
            {favorites.slice(0, 5).map((id) => {
              const item = menuOrganizer.getAllItems().find((i) => i.id === id);
              if (!item) return null;
              return (
                <button
                  key={id}
                  onClick={() => handleSelect(id)}
                  className={`px-2 py-1 text-xs rounded whitespace-nowrap transition-colors ${
                    activeTab === id
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Star size={12} className="inline mr-1 fill-current" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 컨텍스트별 메뉴 (있는 경우) */}
      {contextualItems.length > 0 && (
        <div className="p-4 border-b bg-primary-50">
          <div className="text-xs font-semibold text-primary-700 mb-2">
            추천 메뉴
          </div>
          <div className="space-y-1">
            {contextualItems.slice(0, 3).map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full text-left px-2 py-1 text-sm rounded transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-primary-600 hover:bg-primary-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 메뉴와 패널 분리 레이아웃 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 카테고리별 메뉴 */}
        <div className="w-64 border-r overflow-auto">
          <div className="p-2">
            {categories.map((category) => {
              const isCollapsed = collapsedCategories.has(category.id);
              const categoryItems = category.items.filter((item) => 
                !favorites.includes(item.id) // 즐겨찾기는 위에 표시됨
              );

              return (
                <div key={category.id} className="mb-2">
                  {/* 카테고리 헤더 */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {category.icon && <category.icon size={16} />}
                      <span>{category.label}</span>
                      <span className="text-xs text-gray-400">
                        ({categoryItems.length})
                      </span>
                    </div>
                    {isCollapsed ? (
                      <ChevronRight size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>

                  {/* 카테고리 항목 */}
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 space-y-1">
                          {categoryItems.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleSelect(item.id)}
                              className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-lg transition-colors group ${
                                activeTab === item.id
                                  ? 'bg-primary-100 text-primary-700'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <span>{item.label}</span>
                              <div className="flex items-center gap-1">
                                {favorites.includes(item.id) && (
                                  <Star size={12} className="text-yellow-500 fill-current" />
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavorite(item.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100"
                                >
                                  <Star
                                    size={12}
                                    className={`${
                                      favorites.includes(item.id)
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-gray-400'
                                    }`}
                                  />
                                </button>
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* 패널 영역 */}
        <div className="flex-1 overflow-auto">
          {renderSidebarPanel(activeTab)}
        </div>
      </div>

      {/* 최근 사용 */}
      {recent.length > 0 && (
        <div className="p-4 border-t bg-gray-50">
          <div className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
            <Clock size={12} />
            최근 사용
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {recent.slice(0, 5).map((id) => {
              const item = menuOrganizer.getAllItems().find((i) => i.id === id);
              if (!item) return null;
              return (
                <button
                  key={id}
                  onClick={() => handleSelect(id)}
                  className="px-2 py-1 text-xs bg-white border rounded whitespace-nowrap hover:bg-gray-50 transition-colors"
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

