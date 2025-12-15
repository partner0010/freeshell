/**
 * 환경 변수 관리자
 * Environment Variables Manager
 */

export type EnvironmentType = 'development' | 'staging' | 'production';

export interface EnvironmentVariable {
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'secret';
  description?: string;
  encrypted?: boolean;
}

export interface Environment {
  id: string;
  name: string;
  type: EnvironmentType;
  variables: EnvironmentVariable[];
  createdAt: Date;
}

// 환경 변수 관리자
export class EnvironmentManager {
  private environments: Map<string, Environment> = new Map();

  constructor() {
    this.initDefaultEnvironments();
  }

  private initDefaultEnvironments(): void {
    const dev: Environment = {
      id: 'env-dev',
      name: 'Development',
      type: 'development',
      variables: [
        { key: 'API_URL', value: 'http://localhost:3000', type: 'string' },
        { key: 'DEBUG', value: 'true', type: 'boolean' },
      ],
      createdAt: new Date(),
    };

    const prod: Environment = {
      id: 'env-prod',
      name: 'Production',
      type: 'production',
      variables: [
        { key: 'API_URL', value: 'https://api.example.com', type: 'string' },
        { key: 'DEBUG', value: 'false', type: 'boolean' },
      ],
      createdAt: new Date(),
    };

    this.environments.set(dev.id, dev);
    this.environments.set(prod.id, prod);
  }

  // 환경 생성
  createEnvironment(name: string, type: EnvironmentType): Environment {
    const env: Environment = {
      id: `env-${Date.now()}`,
      name,
      type,
      variables: [],
      createdAt: new Date(),
    };
    this.environments.set(env.id, env);
    return env;
  }

  // 변수 추가
  addVariable(envId: string, variable: EnvironmentVariable): void {
    const env = this.environments.get(envId);
    if (!env) throw new Error('Environment not found');

    // 키 중복 체크
    const exists = env.variables.some(v => v.key === variable.key);
    if (exists) {
      throw new Error(`Variable ${variable.key} already exists`);
    }

    env.variables.push(variable);
  }

  // 변수 업데이트
  updateVariable(envId: string, key: string, variable: Partial<EnvironmentVariable>): void {
    const env = this.environments.get(envId);
    if (!env) throw new Error('Environment not found');

    const index = env.variables.findIndex(v => v.key === key);
    if (index === -1) throw new Error('Variable not found');

    env.variables[index] = { ...env.variables[index], ...variable };
  }

  // 환경 가져오기
  getEnvironment(id: string): Environment | undefined {
    return this.environments.get(id);
  }

  // 모든 환경 가져오기
  getAllEnvironments(): Environment[] {
    return Array.from(this.environments.values());
  }

  // 환경 변수를 .env 형식으로 내보내기
  exportEnvFile(envId: string): string {
    const env = this.environments.get(envId);
    if (!env) throw new Error('Environment not found');

    return env.variables.map(v => `${v.key}=${v.value}`).join('\n');
  }

  // 환경 변수를 JSON으로 내보내기
  exportJSON(envId: string): string {
    const env = this.environments.get(envId);
    if (!env) throw new Error('Environment not found');

    const obj: Record<string, string> = {};
    env.variables.forEach(v => {
      obj[v.key] = v.value;
    });

    return JSON.stringify(obj, null, 2);
  }
}

export const environmentManager = new EnvironmentManager();

