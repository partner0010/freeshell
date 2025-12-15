/**
 * 커스텀 필드 및 메타데이터 관리
 * Custom Fields & Metadata Management
 */

export type FieldType = 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multi-select' | 'url' | 'email';

export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  defaultValue?: any;
  options?: string[]; // for select, multi-select
  description?: string;
}

export interface MetadataTag {
  id: string;
  name: string;
  color?: string;
  category?: string;
}

export interface MetadataCategory {
  id: string;
  name: string;
  description?: string;
  tags: MetadataTag[];
}

// 커스텀 필드 및 메타데이터 관리
export class CustomFieldsManager {
  private fields: Map<string, CustomField> = new Map();
  private tags: Map<string, MetadataTag> = new Map();
  private categories: Map<string, MetadataCategory> = new Map();

  // 커스텀 필드 생성
  createField(
    name: string,
    label: string,
    type: FieldType,
    required: boolean = false
  ): CustomField {
    const field: CustomField = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      label,
      type,
      required,
    };
    this.fields.set(field.id, field);
    return field;
  }

  // 태그 생성
  createTag(name: string, category?: string, color?: string): MetadataTag {
    const tag: MetadataTag = {
      id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      category,
      color: color || this.generateColor(),
    };
    this.tags.set(tag.id, tag);
    return tag;
  }

  // 카테고리 생성
  createCategory(name: string, description?: string): MetadataCategory {
    const category: MetadataCategory = {
      id: `category-${Date.now()}`,
      name,
      description,
      tags: [],
    };
    this.categories.set(category.id, category);
    return category;
  }

  // 태그를 카테고리에 추가
  addTagToCategory(categoryId: string, tagId: string): void {
    const category = this.categories.get(categoryId);
    const tag = this.tags.get(tagId);
    if (!category || !tag) throw new Error('Category or Tag not found');

    if (!category.tags.find(t => t.id === tagId)) {
      category.tags.push(tag);
    }
  }

  // 색상 생성
  private generateColor(): string {
    const colors = [
      '#ef4444', '#f97316', '#f59e0b', '#eab308',
      '#84cc16', '#22c55e', '#10b981', '#14b8a6',
      '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
      '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // 필드 가져오기
  getField(id: string): CustomField | undefined {
    return this.fields.get(id);
  }

  // 모든 필드 가져오기
  getAllFields(): CustomField[] {
    return Array.from(this.fields.values());
  }

  // 태그 가져오기
  getTag(id: string): MetadataTag | undefined {
    return this.tags.get(id);
  }

  // 모든 태그 가져오기
  getAllTags(): MetadataTag[] {
    return Array.from(this.tags.values());
  }

  // 카테고리 가져오기
  getCategory(id: string): MetadataCategory | undefined {
    return this.categories.get(id);
  }

  // 모든 카테고리 가져오기
  getAllCategories(): MetadataCategory[] {
    return Array.from(this.categories.values());
  }
}

export const customFieldsManager = new CustomFieldsManager();

