/**
 * AI 채팅 API
 * 무료 AI API 연동 (Hugging Face, Cohere 등)
 */

import { NextRequest, NextResponse } from 'next/server';

// 무료 AI API 목록 (우선순위 순)
const AI_PROVIDERS = [
  {
    name: 'Hugging Face',
    url: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
    apiKey: process.env.HUGGINGFACE_API_KEY,
  },
  {
    name: 'Cohere',
    url: 'https://api.cohere.ai/v1/generate',
    apiKey: process.env.COHERE_API_KEY,
  },
  {
    name: 'Together AI',
    url: 'https://api.together.xyz/v1/completions',
    apiKey: process.env.TOGETHER_API_KEY,
  },
];

export async function POST(request: NextRequest) {
  try {
    const { message, conversation } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: '메시지를 입력하세요.' },
        { status: 400 }
      );
    }

    // 무료 AI API로 응답 생성 시도
    let response = null;
    let lastError = null;

    for (const provider of AI_PROVIDERS) {
      if (!provider.apiKey) continue;

      try {
        if (provider.name === 'Hugging Face') {
          const hfResponse = await fetch(provider.url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${provider.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: {
                past_user_inputs: conversation
                  .filter((c: any) => c.role === 'user')
                  .slice(-5)
                  .map((c: any) => c.content),
                generated_responses: conversation
                  .filter((c: any) => c.role === 'assistant')
                  .slice(-5)
                  .map((c: any) => c.content),
                text: message,
              },
            }),
          });

          if (hfResponse.ok) {
            const data = await hfResponse.json();
            if (data.generated_text) {
              response = data.generated_text;
              break;
            }
          }
        } else if (provider.name === 'Cohere') {
          const cohereResponse = await fetch(provider.url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${provider.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: message,
              max_tokens: 200,
              temperature: 0.7,
            }),
          });

          if (cohereResponse.ok) {
            const data = await cohereResponse.json();
            if (data.generations && data.generations[0]) {
              response = data.generations[0].text;
              break;
            }
          }
        } else if (provider.name === 'Together AI') {
          const togetherResponse = await fetch(provider.url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${provider.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'togethercomputer/RedPajama-INCITE-7B-Instruct',
              prompt: message,
              max_tokens: 200,
              temperature: 0.7,
            }),
          });

          if (togetherResponse.ok) {
            const data = await togetherResponse.json();
            if (data.choices && data.choices[0]) {
              response = data.choices[0].text;
              break;
            }
          }
        }
      } catch (error: any) {
        lastError = error;
        continue;
      }
    }

    // API 응답이 없으면 기본 응답 생성
    if (!response) {
      response = generateDefaultResponse(message);
    }

    // 도메인별 학습 시스템에 상호작용 기록
    try {
      const { domainLearningSystem } = await import('@/lib/ai/domain-specific-learning');
      domainLearningSystem.recordInteraction('chat', {
        action: 'chat',
        input: message,
        output: response.trim(),
        feedback: undefined,
      });
    } catch (error) {
      console.error('학습 기록 실패:', error);
    }

    return NextResponse.json({
      success: true,
      response: response.trim(),
    });
  } catch (error: any) {
    console.error('AI Chat API error:', error);
    return NextResponse.json(
      { error: 'AI 응답 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 기본 응답 생성 (API가 없을 때)
function generateDefaultResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('안녕') || lowerMessage.includes('hello')) {
    return '안녕하세요! 무엇을 도와드릴까요?';
  }

  if (lowerMessage.includes('도움') || lowerMessage.includes('help')) {
    return 'Freeshell에서 다양한 AI 기능을 사용할 수 있습니다:\n- AI 검색\n- 이미지 생성\n- 영상 생성\n- 텍스트 생성\n- 코드 생성\n\n어떤 기능을 사용하고 싶으신가요?';
  }

  if (lowerMessage.includes('기능') || lowerMessage.includes('feature')) {
    return 'Freeshell의 주요 기능:\n1. AI 검색 - 질문에 답변\n2. 이미지 생성 - AI로 이미지 만들기\n3. 영상 생성 - 텍스트에서 영상 만들기\n4. 텍스트 생성 - 블로그, 글쓰기\n5. 코드 생성 - AI로 코드 작성\n\n더 자세한 정보가 필요하시면 말씀해주세요!';
  }

  // 개발 언어 관련 질문 감지 및 답변
  const codeResponse = generateCodeResponse(message);
  if (codeResponse) {
    return codeResponse;
  }

  return `"${message}"에 대한 답변을 준비 중입니다. 현재 무료 AI API를 설정하면 더 정확한 답변을 받을 수 있습니다. 환경 변수에 HUGGINGFACE_API_KEY, COHERE_API_KEY, 또는 TOGETHER_API_KEY를 추가하세요.`;
}

// 코드 관련 응답 생성
function generateCodeResponse(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  // JavaScript/TypeScript
  if (lowerMessage.includes('javascript') || lowerMessage.includes('js ') || lowerMessage.includes('typescript') || lowerMessage.includes('ts ')) {
    if (lowerMessage.includes('배열') || lowerMessage.includes('array')) {
      return `JavaScript 배열 사용법:\n\n\`\`\`javascript\n// 배열 생성\nconst arr = [1, 2, 3];\n\n// 배열 메서드\nconst doubled = arr.map(x => x * 2);\nconst filtered = arr.filter(x => x > 1);\nconst sum = arr.reduce((acc, x) => acc + x, 0);\n\n// ES6+ 스프레드 연산자\nconst newArr = [...arr, 4, 5];\n\`\`\``;
    }
    if (lowerMessage.includes('비동기') || lowerMessage.includes('async') || lowerMessage.includes('await')) {
      return `JavaScript 비동기 처리:\n\n\`\`\`javascript\n// async/await 사용\nasync function fetchData() {\n  try {\n    const response = await fetch('/api/data');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}\n\n// Promise 체이닝\nfetch('/api/data')\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));\n\`\`\``;
    }
  }

  // React
  if (lowerMessage.includes('react')) {
    if (lowerMessage.includes('컴포넌트') || lowerMessage.includes('component')) {
      return `React 컴포넌트 작성:\n\n\`\`\`tsx\n// 함수형 컴포넌트\nfunction MyComponent({ name }: { name: string }) {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <h1>Hello, {name}!</h1>\n      <button onClick={() => setCount(count + 1)}>\n        Count: {count}\n      </button>\n    </div>\n  );\n}\n\n// 커스텀 훅\nfunction useCounter(initialValue = 0) {\n  const [count, setCount] = useState(initialValue);\n  const increment = () => setCount(count + 1);\n  const decrement = () => setCount(count - 1);\n  return { count, increment, decrement };\n}\n\`\`\``;
    }
    if (lowerMessage.includes('훅') || lowerMessage.includes('hook')) {
      return `React Hooks 사용법:\n\n\`\`\`tsx\nimport { useState, useEffect, useCallback, useMemo } from 'react';\n\nfunction MyComponent() {\n  // useState\n  const [state, setState] = useState(0);\n  \n  // useEffect\n  useEffect(() => {\n    console.log('Component mounted');\n    return () => console.log('Component unmounted');\n  }, []);\n  \n  // useCallback\n  const handleClick = useCallback(() => {\n    setState(prev => prev + 1);\n  }, []);\n  \n  // useMemo\n  const expensiveValue = useMemo(() => {\n    return state * 2;\n  }, [state]);\n  \n  return <button onClick={handleClick}>{expensiveValue}</button>;\n}\n\`\`\``;
    }
  }

  // Next.js
  if (lowerMessage.includes('nextjs') || lowerMessage.includes('next.js')) {
    return `Next.js 14 App Router 사용법:\n\n\`\`\`tsx\n// app/page.tsx\n'use client';\n\nexport default function Page() {\n  return <h1>Hello Next.js!</h1>;\n}\n\n// app/api/route.ts\nimport { NextResponse } from 'next/server';\n\nexport async function GET() {\n  return NextResponse.json({ message: 'Hello API!' });\n}\n\n// Server Components\nasync function ServerComponent() {\n  const data = await fetch('...');\n  return <div>{data}</div>;\n}\n\`\`\``;
  }

  // Python
  if (lowerMessage.includes('python') || lowerMessage.includes('py ')) {
    if (lowerMessage.includes('리스트') || lowerMessage.includes('list')) {
      return `Python 리스트 사용법:\n\n\`\`\`python\n# 리스트 생성\nmy_list = [1, 2, 3, 4, 5]\n\n# 리스트 컴프리헨션\nsquared = [x**2 for x in my_list]\nfiltered = [x for x in my_list if x > 2]\n\n# 리스트 메서드\nmy_list.append(6)\nmy_list.extend([7, 8])\nmy_list.insert(0, 0)\n\`\`\``;
    }
  }

  // 일반적인 코드 질문
  if (lowerMessage.includes('코드') || lowerMessage.includes('code') || lowerMessage.includes('프로그래밍')) {
    return `코드 작성에 도움이 필요하시군요! 구체적으로 어떤 언어나 프레임워크를 사용하시나요?\n\n지원하는 언어:\n- JavaScript/TypeScript\n- React/Next.js\n- Python\n- Java\n- 기타 여러 언어\n\n예: "React로 Todo 앱 만들기", "Python으로 API 만들기" 등으로 질문해주세요!`;
  }

  return null;
}

