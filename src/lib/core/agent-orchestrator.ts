/**
 * AI 에이전트 오케스트레이터
 * Agent Orchestrator - 두뇌 역할
 */

export type AgentType = 'content' | 'development' | 'data' | 'automation';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface AgentTask {
  id: string;
  type: AgentType;
  priority: TaskPriority;
  status: TaskStatus;
  description: string;
  input: any;
  output?: any;
  error?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  assignedAgent?: string;
  dependencies?: string[]; // 다른 작업에 의존
  children?: string[]; // 하위 작업들
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  capabilities: string[];
  isAvailable: boolean;
  currentTask?: string;
  stats: {
    completed: number;
    failed: number;
    avgTime: number;
  };
}

export interface OrchestrationResult {
  success: boolean;
  taskId: string;
  agentId: string;
  estimatedTime?: number;
  error?: string;
}

// AI 에이전트 오케스트레이터
export class AgentOrchestrator {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, AgentTask> = new Map();
  private taskQueue: AgentTask[] = [];
  private isRunning: boolean = false;

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents(): void {
    // 콘텐츠 생성 에이전트
    this.registerAgent({
      id: 'content-agent-1',
      name: '콘텐츠 생성 에이전트',
      type: 'content',
      capabilities: ['text-generation', 'image-generation', 'video-generation', 'music-generation'],
      isAvailable: true,
      stats: { completed: 0, failed: 0, avgTime: 0 },
    });

    // 웹 개발 에이전트
    this.registerAgent({
      id: 'dev-agent-1',
      name: '웹 개발 에이전트',
      type: 'development',
      capabilities: ['code-generation', 'debugging', 'security-audit', 'performance-optimization'],
      isAvailable: true,
      stats: { completed: 0, failed: 0, avgTime: 0 },
    });

    // 데이터 분석 에이전트
    this.registerAgent({
      id: 'data-agent-1',
      name: '데이터 분석 에이전트',
      type: 'data',
      capabilities: ['data-collection', 'pattern-analysis', 'prediction', 'optimization'],
      isAvailable: true,
      stats: { completed: 0, failed: 0, avgTime: 0 },
    });

    // 자동화 에이전트
    this.registerAgent({
      id: 'automation-agent-1',
      name: '자동화 에이전트',
      type: 'automation',
      capabilities: ['workflow-automation', 'scheduling', 'deployment', 'monitoring'],
      isAvailable: true,
      stats: { completed: 0, failed: 0, avgTime: 0 },
    });
  }

  registerAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);
  }

  // 자연어로 작업 요청
  async requestTask(naturalLanguage: string, priority: TaskPriority = 'medium'): Promise<OrchestrationResult> {
    // 자연어를 분석하여 작업 타입 결정
    const taskType = this.analyzeTaskType(naturalLanguage);
    
    // 작업 생성
    const task: AgentTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: taskType,
      priority,
      status: 'pending',
      description: naturalLanguage,
      input: { naturalLanguage },
      createdAt: Date.now(),
    };

    this.tasks.set(task.id, task);
    this.taskQueue.push(task);

    // 작업 큐 처리
    this.processQueue();

    // 적합한 에이전트 선택
    const agent = this.selectBestAgent(task);

    if (!agent) {
      return {
        success: false,
        taskId: task.id,
        agentId: '',
        error: 'No available agent found',
      };
    }

    return {
      success: true,
      taskId: task.id,
      agentId: agent.id,
      estimatedTime: this.estimateTime(task, agent),
    };
  }

  // 자연어 분석하여 작업 타입 결정
  private analyzeTaskType(naturalLanguage: string): AgentType {
    const lower = naturalLanguage.toLowerCase();

    // 콘텐츠 관련 키워드
    if (/\b(비디오|영상|동영상|콘텐츠|블로그|이미지|음악|음성|전자책)\b/.test(lower)) {
      return 'content';
    }

    // 개발 관련 키워드
    if (/\b(웹사이트|사이트|코드|프로그램|앱|개발|디버깅|보안|최적화)\b/.test(lower)) {
      return 'development';
    }

    // 데이터 분석 관련 키워드
    if (/\b(분석|데이터|통계|예측|최적화|성과)\b/.test(lower)) {
      return 'data';
    }

    // 자동화 관련 키워드
    if (/\b(자동|스케줄|배포|관리|모니터링)\b/.test(lower)) {
      return 'automation';
    }

    // 기본값: 콘텐츠
    return 'content';
  }

  // 최적 에이전트 선택
  private selectBestAgent(task: AgentTask): Agent | undefined {
    const availableAgents = Array.from(this.agents.values()).filter(
      (agent) => agent.type === task.type && agent.isAvailable
    );

    if (availableAgents.length === 0) return undefined;

    // 통계 기반으로 최고 성과 에이전트 선택
    return availableAgents.sort((a, b) => {
      const scoreA = a.stats.completed / (a.stats.completed + a.stats.failed + 1);
      const scoreB = b.stats.completed / (b.stats.completed + b.stats.failed + 1);
      return scoreB - scoreA;
    })[0];
  }

  // 예상 시간 계산
  private estimateTime(task: AgentTask, agent: Agent): number {
    // 기본 예상 시간 (밀리초)
    const baseTime: Record<AgentType, number> = {
      content: 60000,      // 1분
      development: 120000, // 2분
      data: 180000,        // 3분
      automation: 90000,   // 1.5분
    };

    const estimated = baseTime[task.type];
    const avgTime = agent.stats.avgTime || estimated;

    return Math.max(estimated, avgTime);
  }

  // 작업 큐 처리
  private async processQueue(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      if (!task) break;

      if (task.status === 'pending') {
        await this.executeTask(task);
      }
    }

    this.isRunning = false;
  }

  // 작업 실행
  private async executeTask(task: AgentTask): Promise<void> {
    const agent = this.selectBestAgent(task);
    if (!agent) {
      task.status = 'failed';
      task.error = 'No available agent';
      return;
    }

    task.status = 'running';
    task.assignedAgent = agent.id;
    task.startedAt = Date.now();
    agent.currentTask = task.id;
    agent.isAvailable = false;

    try {
      // 실제 작업 실행 (여기서는 시뮬레이션)
      await this.runTask(task, agent);

      task.status = 'completed';
      task.completedAt = Date.now();
      
      // 통계 업데이트
      const duration = (task.completedAt - task.startedAt!) / 1000; // 초
      agent.stats.completed++;
      agent.stats.avgTime = (agent.stats.avgTime + duration) / 2;
    } catch (error) {
      task.status = 'failed';
      task.error = String(error);
      agent.stats.failed++;
    } finally {
      agent.currentTask = undefined;
      agent.isAvailable = true;
    }
  }

  private async runTask(task: AgentTask, agent: Agent): Promise<void> {
    // 실제 작업 실행 로직
    // 여기서는 각 에이전트 타입에 따라 다른 작업 수행
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 작업 결과 저장
    task.output = {
      success: true,
      message: `작업 완료: ${task.description}`,
      agentId: agent.id,
    };
  }

  // 복합 작업 생성 (여러 에이전트 협업)
  async createComplexTask(description: string, subtasks: string[]): Promise<string> {
    const mainTask: AgentTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'automation',
      priority: 'high',
      status: 'pending',
      description,
      input: { description, subtasks },
      createdAt: Date.now(),
      children: [],
    };

    // 하위 작업 생성
    const childTasks: AgentTask[] = subtasks.map((subtask, index) => {
      const childTask: AgentTask = {
        id: `task-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        type: this.analyzeTaskType(subtask),
        priority: 'medium',
        status: 'pending',
        description: subtask,
        input: { naturalLanguage: subtask },
        createdAt: Date.now(),
        dependencies: index > 0 ? [mainTask.children![index - 1]] : undefined,
      };

      mainTask.children!.push(childTask.id);
      this.tasks.set(childTask.id, childTask);
      this.taskQueue.push(childTask);

      return childTask;
    });

    this.tasks.set(mainTask.id, mainTask);
    this.taskQueue.push(mainTask);

    this.processQueue();

    return mainTask.id;
  }

  // 작업 상태 조회
  getTask(taskId: string): AgentTask | undefined {
    return this.tasks.get(taskId);
  }

  // 모든 작업 조회
  getAllTasks(): AgentTask[] {
    return Array.from(this.tasks.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  // 에이전트 상태 조회
  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  // 모든 에이전트 조회
  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }
}

export const agentOrchestrator = new AgentOrchestrator();

