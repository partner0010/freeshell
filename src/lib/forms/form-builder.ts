/**
 * 폼 빌더
 * Form Builder
 */

export type FieldType = 'text' | 'email' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'file';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };
  options?: string[]; // for select, radio
}

export interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  settings: {
    submitButtonText: string;
    successMessage: string;
    redirectUrl?: string;
    emailNotifications?: boolean;
    emailRecipients?: string[];
  };
  createdAt: Date;
}

// 폼 빌더
export class FormBuilder {
  private forms: Map<string, Form> = new Map();

  // 폼 생성
  createForm(name: string, description?: string): Form {
    const form: Form = {
      id: `form-${Date.now()}`,
      name,
      description,
      fields: [],
      settings: {
        submitButtonText: '제출',
        successMessage: '제출이 완료되었습니다',
      },
      createdAt: new Date(),
    };
    this.forms.set(form.id, form);
    return form;
  }

  // 필드 추가
  addField(formId: string, field: Omit<FormField, 'id'>): FormField {
    const form = this.forms.get(formId);
    if (!form) throw new Error('Form not found');

    const newField: FormField = {
      ...field,
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    form.fields.push(newField);
    return newField;
  }

  // 폼 가져오기
  getForm(id: string): Form | undefined {
    return this.forms.get(id);
  }

  // 모든 폼 가져오기
  getAllForms(): Form[] {
    return Array.from(this.forms.values());
  }

  // 폼 HTML 생성
  generateHTML(form: Form): string {
    const fieldsHTML = form.fields.map((field) => {
      let inputHTML = '';
      switch (field.type) {
        case 'textarea':
          inputHTML = `<textarea name="${field.name}" ${field.required ? 'required' : ''} placeholder="${field.placeholder || ''}"></textarea>`;
          break;
        case 'select':
          const options = field.options?.map(opt => `<option value="${opt}">${opt}</option>`).join('');
          inputHTML = `<select name="${field.name}" ${field.required ? 'required' : ''}>${options}</select>`;
          break;
        case 'checkbox':
        case 'radio':
          inputHTML = field.options?.map(opt => 
            `<label><input type="${field.type}" name="${field.name}" value="${opt}" ${field.required ? 'required' : ''}> ${opt}</label>`
          ).join('<br>') || '';
          break;
        default:
          inputHTML = `<input type="${field.type}" name="${field.name}" ${field.required ? 'required' : ''} placeholder="${field.placeholder || ''}" />`;
      }
      return `<div class="form-field">
        <label>${field.label} ${field.required ? '<span>*</span>' : ''}</label>
        ${inputHTML}
      </div>`;
    }).join('');

    return `<form id="${form.id}">
      ${fieldsHTML}
      <button type="submit">${form.settings.submitButtonText}</button>
    </form>`;
  }
}

export const formBuilder = new FormBuilder();

