/**
 * 이메일 빌더
 * Email Builder
 */

export interface EmailBlock {
  id: string;
  type: 'text' | 'image' | 'button' | 'divider' | 'spacer';
  content: string;
  styles?: Record<string, string>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preview: string;
  blocks: EmailBlock[];
  styles: {
    backgroundColor: string;
    fontFamily: string;
    fontSize: string;
  };
}

export interface EmailCampaign {
  id: string;
  name: string;
  template: EmailTemplate;
  recipients: string[];
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  sentCount: number;
  openCount: number;
  clickCount: number;
}

// 이메일 빌더
export class EmailBuilder {
  private templates: Map<string, EmailTemplate> = new Map();
  private campaigns: Map<string, EmailCampaign> = new Map();

  // 템플릿 생성
  createTemplate(name: string, subject: string): EmailTemplate {
    const template: EmailTemplate = {
      id: `template-${Date.now()}`,
      name,
      subject,
      preview: '',
      blocks: [],
      styles: {
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
      },
    };
    this.templates.set(template.id, template);
    return template;
  }

  // 블록 추가
  addBlock(templateId: string, block: Omit<EmailBlock, 'id'>): EmailBlock {
    const template = this.templates.get(templateId);
    if (!template) throw new Error('Template not found');

    const newBlock: EmailBlock = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    template.blocks.push(newBlock);
    return newBlock;
  }

  // HTML 생성
  generateHTML(template: EmailTemplate): string {
    const blocksHTML = template.blocks.map(block => {
      switch (block.type) {
        case 'text':
          return `<div style="${this.stylesToString(block.styles)}">${block.content}</div>`;
        case 'image':
          return `<img src="${block.content}" alt="" style="${this.stylesToString(block.styles)}" />`;
        case 'button':
          return `<a href="${block.content}" style="${this.stylesToString(block.styles)}">Click here</a>`;
        case 'divider':
          return `<hr style="${this.stylesToString(block.styles)}" />`;
        case 'spacer':
          return `<div style="height: ${block.content}px;"></div>`;
        default:
          return '';
      }
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="background-color: ${template.styles.backgroundColor}; font-family: ${template.styles.fontFamily}; font-size: ${template.styles.fontSize};">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          ${blocksHTML}
        </div>
      </body>
      </html>
    `;
  }

  private stylesToString(styles?: Record<string, string>): string {
    if (!styles) return '';
    return Object.entries(styles).map(([key, value]) => `${key}: ${value}`).join('; ');
  }

  // 캠페인 생성
  createCampaign(name: string, templateId: string, recipients: string[]): EmailCampaign {
    const template = this.templates.get(templateId);
    if (!template) throw new Error('Template not found');

    const campaign: EmailCampaign = {
      id: `campaign-${Date.now()}`,
      name,
      template,
      recipients,
      status: 'draft',
      sentCount: 0,
      openCount: 0,
      clickCount: 0,
    };
    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  // 템플릿 가져오기
  getTemplate(id: string): EmailTemplate | undefined {
    return this.templates.get(id);
  }

  // 모든 템플릿 가져오기
  getAllTemplates(): EmailTemplate[] {
    return Array.from(this.templates.values());
  }

  // 캠페인 가져오기
  getCampaign(id: string): EmailCampaign | undefined {
    return this.campaigns.get(id);
  }

  // 모든 캠페인 가져오기
  getAllCampaigns(): EmailCampaign[] {
    return Array.from(this.campaigns.values());
  }
}

export const emailBuilder = new EmailBuilder();

