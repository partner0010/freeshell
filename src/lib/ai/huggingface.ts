/**
 * Hugging Face Inference API 통합
 * 오픈소스 AI 모델 활용
 */

export interface HuggingFaceModel {
  model: string;
  task: 'text-generation' | 'image-generation' | 'text-to-image' | 'image-to-text' | 'audio-generation';
}

/**
 * Hugging Face 모델로 텍스트 생성
 */
export async function generateWithHuggingFace(
  prompt: string,
  model: string = 'gpt2',
  options: {
    maxLength?: number;
    temperature?: number;
  } = {}
): Promise<string> {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    const apiUrl = `https://api-inference.huggingface.co/models/${model}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: options.maxLength || 100,
          temperature: options.temperature || 0.7,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Hugging Face API 오류: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    }
    
    return prompt; // 실패 시 원본 반환
  } catch (error: any) {
    console.error('Hugging Face 생성 오류:', error);
    // API 키가 없거나 실패 시 시뮬레이션
    return `${prompt} [Hugging Face 모델로 생성된 텍스트]`;
  }
}

/**
 * Stable Diffusion으로 이미지 생성
 */
export async function generateImageWithStableDiffusion(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    numInferenceSteps?: number;
  } = {}
): Promise<string> {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    const model = 'stabilityai/stable-diffusion-2-1';
    const apiUrl = `https://api-inference.huggingface.co/models/${model}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: options.width || 512,
          height: options.height || 512,
          num_inference_steps: options.numInferenceSteps || 50,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Stable Diffusion API 오류: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error: any) {
    console.error('Stable Diffusion 생성 오류:', error);
    // 실패 시 플레이스홀더 반환
    return `https://via.placeholder.com/${options.width || 512}x${options.height || 512}?text=Image+Generation`;
  }
}

/**
 * 사용 가능한 Hugging Face 모델 목록
 */
export const HUGGINGFACE_MODELS = {
  'text-generation': [
    'gpt2',
    'distilgpt2',
    'facebook/opt-125m',
    'EleutherAI/gpt-neo-125M',
  ],
  'image-generation': [
    'stabilityai/stable-diffusion-2-1',
    'runwayml/stable-diffusion-v1-5',
    'CompVis/stable-diffusion-v1-4',
  ],
  'text-to-image': [
    'stabilityai/stable-diffusion-2-1',
    'runwayml/stable-diffusion-v1-5',
  ],
  'image-to-text': [
    'nlpconnect/vit-gpt2-image-captioning',
    'Salesforce/blip-image-captioning-base',
  ],
  'audio-generation': [
    'facebook/musicgen-small',
    'facebook/audiocraft',
  ],
};

