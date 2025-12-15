'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  LayoutGrid,
  Plus,
  MoreHorizontal,
  Calendar,
  User,
  Tag,
  MessageCircle,
  Paperclip,
  Clock,
  CheckSquare,
  Edit2,
  Trash2,
  X,
  GripVertical,
  Flag,
  AlertCircle,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  labels: string[];
  comments: number;
  attachments: number;
  checklist?: { total: number; completed: number };
}

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

export function KanbanBoard() {
  const [showAddTask, setShowAddTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<{ task: Task; columnId: string } | null>(null);
  
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: '📝 할 일',
      color: 'bg-gray-500',
      tasks: [
        {
          id: 't1',
          title: '로고 디자인 완성',
          description: '브랜드 가이드라인에 맞는 로고 3가지 시안 제작',
          assignee: '김디자인',
          dueDate: '2024-12-10',
          priority: 'high',
          labels: ['디자인', '브랜딩'],
          comments: 3,
          attachments: 2,
          checklist: { total: 5, completed: 2 },
        },
        {
          id: 't2',
          title: 'SEO 메타태그 설정',
          priority: 'medium',
          labels: ['SEO'],
          comments: 0,
          attachments: 0,
        },
      ],
    },
    {
      id: 'inprogress',
      title: '🔄 진행 중',
      color: 'bg-blue-500',
      tasks: [
        {
          id: 't3',
          title: '메인 페이지 레이아웃',
          description: '히어로 섹션, 특징, CTA 영역 구성',
          assignee: '박개발',
          dueDate: '2024-12-08',
          priority: 'urgent',
          labels: ['개발', '프론트엔드'],
          comments: 8,
          attachments: 4,
          checklist: { total: 8, completed: 5 },
        },
      ],
    },
    {
      id: 'review',
      title: '👀 검토 중',
      color: 'bg-yellow-500',
      tasks: [
        {
          id: 't4',
          title: '결제 시스템 연동',
          assignee: '이백엔드',
          priority: 'high',
          labels: ['개발', '결제'],
          comments: 5,
          attachments: 1,
        },
      ],
    },
    {
      id: 'done',
      title: '✅ 완료',
      color: 'bg-green-500',
      tasks: [
        {
          id: 't5',
          title: '회원가입 기능',
          assignee: '이백엔드',
          priority: 'medium',
          labels: ['개발'],
          comments: 2,
          attachments: 0,
        },
        {
          id: 't6',
          title: '반응형 디자인 적용',
          assignee: '박개발',
          priority: 'low',
          labels: ['디자인', '개발'],
          comments: 1,
          attachments: 0,
        },
      ],
    },
  ]);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    labels: '',
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '긴급';
      case 'high':
        return '높음';
      case 'medium':
        return '보통';
      case 'low':
        return '낮음';
      default:
        return '';
    }
  };

  const getLabelColor = (label: string) => {
    const colors: Record<string, string> = {
      '디자인': 'bg-purple-100 text-purple-600',
      '개발': 'bg-blue-100 text-blue-600',
      '브랜딩': 'bg-pink-100 text-pink-600',
      'SEO': 'bg-green-100 text-green-600',
      '프론트엔드': 'bg-cyan-100 text-cyan-600',
      '결제': 'bg-orange-100 text-orange-600',
    };
    return colors[label] || 'bg-gray-100 text-gray-600';
  };

  const handleAddTask = (columnId: string) => {
    if (!newTask.title.trim()) return;
    
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      labels: newTask.labels.split(',').map((l) => l.trim()).filter(Boolean),
      comments: 0,
      attachments: 0,
    };
    
    setColumns(columns.map((col) =>
      col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col
    ));
    
    setNewTask({ title: '', description: '', priority: 'medium', labels: '' });
    setShowAddTask(null);
  };

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, columnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnId: string) => {
    if (!draggedTask) return;
    
    if (draggedTask.columnId !== targetColumnId) {
      setColumns(columns.map((col) => {
        if (col.id === draggedTask.columnId) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== draggedTask.task.id) };
        }
        if (col.id === targetColumnId) {
          return { ...col, tasks: [...col.tasks, draggedTask.task] };
        }
        return col;
      }));
    }
    
    setDraggedTask(null);
  };

  const deleteTask = (columnId: string, taskId: string) => {
    setColumns(columns.map((col) =>
      col.id === columnId ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) } : col
    ));
  };

  const addColumn = () => {
    const newColumn: Column = {
      id: `col-${Date.now()}`,
      title: '새 컬럼',
      color: 'bg-gray-500',
      tasks: [],
    };
    setColumns([...columns, newColumn]);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-primary-500" />
          칸반 보드
        </h3>
        <button
          onClick={addColumn}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          컬럼 추가
        </button>
      </div>
      
      {/* 통계 */}
      <div className="flex gap-4 text-sm">
        {columns.map((col) => (
          <div key={col.id} className="flex items-center gap-2">
            <span className={`w-2 h-2 ${col.color} rounded-full`} />
            <span className="text-gray-600 dark:text-gray-400">
              {col.title.replace(/[📝🔄👀✅]/g, '').trim()}: {col.tasks.length}
            </span>
          </div>
        ))}
      </div>
      
      {/* 칸반 보드 */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-72 bg-gray-50 dark:bg-gray-800 rounded-xl p-3"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            {/* 컬럼 헤더 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 ${column.color} rounded`} />
                <h4 className="font-medium text-gray-800 dark:text-white text-sm">{column.title}</h4>
                <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                  {column.tasks.length}
                </span>
              </div>
              <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            {/* 태스크 목록 */}
            <div className="space-y-2 min-h-[100px]">
              {column.tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layoutId={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task, column.id)}
                  className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-600 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                >
                  {/* 우선순위 */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 ${getPriorityColor(task.priority)} text-white text-xs rounded`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                    <button
                      onClick={() => deleteTask(column.id, task.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                  
                  {/* 제목 */}
                  <h5 className="font-medium text-gray-800 dark:text-white text-sm mb-2">
                    {task.title}
                  </h5>
                  
                  {/* 설명 */}
                  {task.description && (
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{task.description}</p>
                  )}
                  
                  {/* 라벨 */}
                  {task.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {task.labels.map((label) => (
                        <span key={label} className={`px-1.5 py-0.5 ${getLabelColor(label)} text-xs rounded`}>
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* 체크리스트 */}
                  {task.checklist && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span className="flex items-center gap-1">
                          <CheckSquare className="w-3 h-3" />
                          체크리스트
                        </span>
                        <span>{task.checklist.completed}/{task.checklist.total}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(task.checklist.completed / task.checklist.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* 하단 정보 */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-600">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {task.dueDate.split('-').slice(1).join('/')}
                        </span>
                      )}
                      {task.comments > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {task.comments}
                        </span>
                      )}
                      {task.attachments > 0 && (
                        <span className="flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          {task.attachments}
                        </span>
                      )}
                    </div>
                    
                    {task.assignee && (
                      <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center" title={task.assignee}>
                        <span className="text-xs text-primary-600 font-medium">
                          {task.assignee.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* 태스크 추가 버튼 */}
              {showAddTask === column.id ? (
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm border border-primary-200 dark:border-primary-700">
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="작업 제목"
                    className="w-full px-2 py-1.5 text-sm border rounded dark:bg-gray-600 dark:border-gray-500 mb-2"
                    autoFocus
                  />
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="설명 (선택)"
                    className="w-full px-2 py-1.5 text-sm border rounded dark:bg-gray-600 dark:border-gray-500 mb-2"
                    rows={2}
                  />
                  <div className="flex gap-2 mb-2">
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                      className="flex-1 px-2 py-1.5 text-xs border rounded dark:bg-gray-600 dark:border-gray-500"
                    >
                      <option value="low">낮음</option>
                      <option value="medium">보통</option>
                      <option value="high">높음</option>
                      <option value="urgent">긴급</option>
                    </select>
                    <input
                      type="text"
                      value={newTask.labels}
                      onChange={(e) => setNewTask({ ...newTask, labels: e.target.value })}
                      placeholder="라벨 (쉼표)"
                      className="flex-1 px-2 py-1.5 text-xs border rounded dark:bg-gray-600 dark:border-gray-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddTask(column.id)}
                      className="flex-1 px-3 py-1.5 bg-primary-500 text-white text-sm rounded hover:bg-primary-600"
                    >
                      추가
                    </button>
                    <button
                      onClick={() => setShowAddTask(null)}
                      className="px-3 py-1.5 border rounded hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddTask(column.id)}
                  className="w-full flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  작업 추가
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* 도움말 */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          💡 <strong>팁:</strong> 카드를 드래그하여 다른 컬럼으로 이동할 수 있습니다.
        </p>
      </div>
    </div>
  );
}

export default KanbanBoard;

