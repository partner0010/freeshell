/**
 * Replicate API 통합
 * 다양한 AI 모델 활용
 */

export interface ReplicateModel {
  model: string;
  version: string;
}

/**
 * Replicate로 모델 실행
 */
export async function runReplicateModel(
  model: string,
  input: any,
  options: {
    version?: string;
    wait?: boolean;
  } = {}
): Promise<any> {
  try {
    const apiKey = process.env.REPLICATE_API_TOKEN;
    if (!apiKey) {
      throw new Error('Replicate API 토큰이 필요합니다');
    }
    
    const version = options.version || 'latest';
    const apiUrl = `https://api.replicate.com/v1/models/${model}/versions/${version}/predictions`;
    
    // 예측 생성
    const createResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${apiKey}`,
      },
      body: JSON.stringify({ input }),
    });
    
    if (!createResponse.ok) {
      throw new Error(`Replicate API 오류: ${createResponse.statusText}`);
    }
    
    const prediction = await createResponse.json();
    
    // 결과 대기
    if (options.wait !== false) {
      let result = prediction;
      while (result.status === 'starting' || result.status === 'processing') {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const statusResponse = await fetch(
          `https://api.replicate.com/v1/predictions/${result.id}`,
          {
            headers: {
              Authorization: `Token ${apiKey}`,
            },
          }
        );
        result = await statusResponse.json();
      }
      
      if (result.status === 'succeeded') {
        return result.output;
      } else {
        throw new Error(`예측 실패: ${result.error}`);
      }
    }
    
    return prediction;
  } catch (error: any) {
    console.error('Replicate 실행 오류:', error);
    throw error;
  }
}

/**
 * 이미지 생성 (Stable Diffusion)
 */
export async function generateImageWithReplicate(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    numOutputs?: number;
  } = {}
): Promise<string[]> {
  try {
    const output = await runReplicateModel(
      'stability-ai/stable-diffusion',
      {
        prompt,
        width: options.width || 512,
        height: options.height || 512,
        num_outputs: options.numOutputs || 1,
      }
    );
    
    return Array.isArray(output) ? output : [output];
  } catch (error: any) {
    console.error('Replicate 이미지 생성 오류:', error);
    return [`https://via.placeholder.com/${options.width || 512}x${options.height || 512}?text=Image+Generation`];
  }
}

/**
 * 비디오 생성
 */
export async function generateVideoWithReplicate(
  prompt: string,
  options: {
    duration?: number;
    fps?: number;
  } = {}
): Promise<string> {
  try {
    const output = await runReplicateModel(
      'anotherjesse/zeroscope-v2-xl',
      {
        prompt,
        duration: options.duration || 3,
        fps: options.fps || 24,
      }
    );
    
    return Array.isArray(output) ? output[0] : output;
  } catch (error: any) {
    console.error('Replicate 비디오 생성 오류:', error);
    return '';
  }
}

