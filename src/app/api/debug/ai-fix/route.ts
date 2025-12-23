/**
 * AI 버그 수정 API
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { error, stack, context } = await request.json();

    if (!error || !stack) {
      return NextResponse.json(
        { error: '에러 메시지와 스택 트레이스가 필요합니다.' },
        { status: 400 }
      );
    }

    // 무료 AI API를 사용하여 버그 수정 제안
    let fixedCode = '';
    let explanation = '';
    let confidence = 0.8;

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
            inputs: `Error: ${error}\nStack: ${stack}\nFix this error:`,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.3,
            },
          }),
        }
      );

      if (hfResponse.ok) {
        const hfData = await hfResponse.json();
        if (hfData[0]?.generated_text) {
          fixedCode = hfData[0].generated_text;
          explanation = 'AI가 코드를 분석하여 버그를 수정했습니다.';
          confidence = 0.85;
        }
      }
    } catch (error) {
      console.error('Hugging Face API 오류:', error);
    }

    // 대체: OpenAI API (무료 티어가 있다면)
    if (!fixedCode) {
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
                content: 'You are a helpful code debugger. Analyze the error and provide a fixed version of the code with explanation.',
              },
              {
                role: 'user',
                content: `Error: ${error}\nStack Trace: ${stack}\nContext: ${JSON.stringify(context || {})}\n\nPlease provide a fixed version of the code and explain what was wrong.`,
              },
            ],
            max_tokens: 1000,
            temperature: 0.3,
          }),
        });

        if (openaiResponse.ok) {
          const openaiData = await openaiResponse.json();
          const response = openaiData.choices[0]?.message?.content || '';
          
          // 코드와 설명 분리
          const codeMatch = response.match(/```[\w]*\n([\s\S]*?)```/);
          if (codeMatch) {
            fixedCode = codeMatch[1];
            explanation = response.replace(/```[\w]*\n[\s\S]*?```/g, '').trim();
          } else {
            fixedCode = response;
            explanation = 'AI가 코드를 분석하여 버그를 수정했습니다.';
          }
          confidence = 0.9;
        }
      } catch (error) {
        console.error('OpenAI API 오류:', error);
      }
    }

    // 기본 응답 (AI API가 실패한 경우)
    if (!fixedCode) {
      fixedCode = `// ${error}\n// 스택: ${stack}\n// TODO: 버그 수정 필요\n// AI API 연동이 필요합니다.`;
      explanation = 'AI API 연동이 필요합니다. 에러를 분석하여 수동으로 수정해주세요.';
      confidence = 0.5;
    }

    return NextResponse.json({
      success: true,
      fixedCode,
      explanation,
      confidence,
    });
  } catch (error: any) {
    console.error('AI 버그 수정 오류:', error);
    return NextResponse.json(
      { error: `AI 버그 수정 중 오류가 발생했습니다: ${error.message}` },
      { status: 500 }
    );
  }
}

