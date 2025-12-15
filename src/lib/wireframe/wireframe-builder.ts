/**
 * 와이어프레임 빌더
 * Wireframe Builder
 */

export interface WireframeElement {
  id: string;
  type: 'container' | 'text' | 'image' | 'button' | 'input' | 'list';
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  children?: WireframeElement[];
}

export interface Wireframe {
  id: string;
  name: string;
  width: number;
  height: number;
  elements: WireframeElement[];
  createdAt: Date;
}

// 와이어프레임 빌더
export class WireframeBuilder {
  private wireframes: Map<string, Wireframe> = new Map();

  // 와이어프레임 생성
  createWireframe(name: string, width: number = 1920, height: number = 1080): Wireframe {
    const wireframe: Wireframe = {
      id: `wireframe-${Date.now()}`,
      name,
      width,
      height,
      elements: [],
      createdAt: new Date(),
    };
    this.wireframes.set(wireframe.id, wireframe);
    return wireframe;
  }

  // 요소 추가
  addElement(
    wireframeId: string,
    element: Omit<WireframeElement, 'id'>
  ): WireframeElement {
    const wireframe = this.wireframes.get(wireframeId);
    if (!wireframe) throw new Error('Wireframe not found');

    const newElement: WireframeElement = {
      ...element,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    wireframe.elements.push(newElement);
    return newElement;
  }

  // 와이어프레임 가져오기
  getWireframe(id: string): Wireframe | undefined {
    return this.wireframes.get(id);
  }

  // 템플릿에서 생성
  fromTemplate(templateName: string): Wireframe {
    const wireframe = this.createWireframe(templateName);

    // 기본 레이아웃 요소 추가
    wireframe.elements.push(
      {
        id: 'header',
        type: 'container',
        x: 0,
        y: 0,
        width: wireframe.width,
        height: 80,
        label: 'Header',
      },
      {
        id: 'main',
        type: 'container',
        x: 0,
        y: 80,
        width: wireframe.width,
        height: wireframe.height - 160,
        label: 'Main Content',
      },
      {
        id: 'footer',
        type: 'container',
        x: 0,
        y: wireframe.height - 80,
        width: wireframe.width,
        height: 80,
        label: 'Footer',
      }
    );

    return wireframe;
  }

  // 와이어프레임 내보내기
  exportWireframe(wireframe: Wireframe, format: 'json' | 'png' | 'svg'): string {
    return `wireframe-${wireframe.id}.${format}`;
  }
}

export const wireframeBuilder = new WireframeBuilder();

