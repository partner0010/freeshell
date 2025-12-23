/**
 * AI 코드 생성 API
 * 무료 AI API 활용 (Hugging Face, CodeLlama 등)
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: '프롬프트를 입력하세요.' },
        { status: 400 }
      );
    }

    // 무료 AI API 사용 (Hugging Face Inference API)
    // 실제로는 여러 AI 서비스를 시도
    let code = '';
    let language = 'javascript';
    let filename = 'code.js';

    try {
      // Hugging Face CodeLlama API 시도
      const hfResponse = await fetch(
        'https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-Instruct-hf',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY || ''}`,
          },
          body: JSON.stringify({
            inputs: `// ${prompt}\n`,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.7,
            },
          }),
        }
      );

      if (hfResponse.ok) {
        const hfData = await hfResponse.json();
        if (hfData[0]?.generated_text) {
          code = hfData[0].generated_text;
        }
      }
    } catch (error) {
      console.error('Hugging Face API 오류:', error);
    }

    // 대체: OpenAI API (무료 티어가 있다면)
    if (!code) {
      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful code generator. Generate clean, well-commented code based on user requests.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        });

        if (openaiResponse.ok) {
          const openaiData = await openaiResponse.json();
          code = openaiData.choices[0]?.message?.content || '';
        }
      } catch (error) {
        console.error('OpenAI API 오류:', error);
      }
    }

    // 언어 감지 및 파일명 생성
    if (code.includes('import React') || code.includes('from "react"')) {
      language = 'typescript';
      filename = 'component.tsx';
    } else if (code.includes('const express') || code.includes('require(')) {
      language = 'javascript';
      filename = 'server.js';
    } else if (code.includes('def ') || code.includes('import ')) {
      language = 'python';
      filename = 'script.py';
    }

    // 코드가 없으면 기본 응답
    if (!code) {
      code = `// ${prompt}\n// 코드 생성 중...\n\n// 실제 구현은 AI API 연동이 필요합니다.\n`;
    }

    const result = {
      success: true,
      code: [
        {
          language,
          code,
          filename,
        },
      ],
    };

    // 도메인별 학습 시스템에 상호작용 기록
    try {
      const { domainLearningSystem } = await import('@/lib/ai/domain-specific-learning');
      domainLearningSystem.recordInteraction('code', {
        action: 'generate-code',
        input: prompt,
        output: code,
        feedback: undefined,
      });
    } catch (error) {
      console.error('학습 기록 실패:', error);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('코드 생성 API 오류:', error);
    return NextResponse.json(
      { error: `코드 생성 중 오류가 발생했습니다: ${error.message}` },
      { status: 500 }
    );
  }
}

