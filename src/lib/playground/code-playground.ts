/**
 * 코드 플레이그라운드
 * Code Playground
 */

export type Language = 'javascript' | 'typescript' | 'html' | 'css' | 'python' | 'react';

export interface CodeSnippet {
  id: string;
  title: string;
  language: Language;
  code: string;
}

export interface PlaygroundSession {
  id: string;
  name: string;
  language: Language;
  code: string;
  output?: string;
  errors?: string[];
  createdAt: Date;
}

// 코드 플레이그라운드
export class CodePlayground {
  private sessions: Map<string, PlaygroundSession> = new Map();

  // 세션 생성
  createSession(name: string, language: Language): PlaygroundSession {
    const session: PlaygroundSession = {
      id: `session-${Date.now()}`,
      name,
      language,
      code: this.getDefaultCode(language),
      createdAt: new Date(),
    };
    this.sessions.set(session.id, session);
    return session;
  }

  // 코드 실행 (시뮬레이션)
  async executeCode(session: PlaygroundSession): Promise<{ output?: string; errors?: string[] }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // 실제로는 코드를 실행하는 로직
      let output = '';
      
      if (session.language === 'javascript' || session.language === 'typescript') {
        // JavaScript/TypeScript 실행 시뮬레이션
        output = '코드가 성공적으로 실행되었습니다.\n출력: Hello, World!';
      } else if (session.language === 'html') {
        output = 'HTML이 렌더링되었습니다.';
      } else if (session.language === 'css') {
        output = 'CSS가 적용되었습니다.';
      }

      return { output };
    } catch (error: any) {
      return { errors: [error.message] };
    }
  }

  // 세션 가져오기
  getSession(id: string): PlaygroundSession | undefined {
    return this.sessions.get(id);
  }

  // 모든 세션 가져오기
  getAllSessions(): PlaygroundSession[] {
    return Array.from(this.sessions.values());
  }

  // 기본 코드
  private getDefaultCode(language: Language): string {
    switch (language) {
      case 'javascript':
        return `console.log('Hello, World!');`;
      case 'typescript':
        return `console.log('Hello, World!');`;
      case 'html':
        return `<!DOCTYPE html>
<html>
<head>
  <title>Hello</title>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
</html>`;
      case 'css':
        return `body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}`;
      case 'python':
        return `print('Hello, World!')`;
      case 'react':
        return `import React from 'react';

function App() {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
}

export default App;`;
      default:
        return '';
    }
  }
}

export const codePlayground = new CodePlayground();

