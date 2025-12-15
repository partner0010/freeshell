/**
 * 워크플로우 빌더
 * Workflow Builder & Automation
 */

export type NodeType = 'trigger' | 'action' | 'condition' | 'delay';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  connections?: string[]; // 연결된 노드 ID들
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  enabled: boolean;
}

// 워크플로우 빌더
export class WorkflowBuilder {
  private workflows: Map<string, Workflow> = new Map();

  // 워크플로우 생성
  createWorkflow(name: string, description?: string): Workflow {
    const workflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name,
      description,
      nodes: [],
      enabled: false,
    };
    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  // 노드 추가
  addNode(
    workflowId: string,
    type: NodeType,
    label: string,
    config: Record<string, any> = {},
    position: { x: number; y: number }
  ): WorkflowNode {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    const node: WorkflowNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      label,
      config,
      position,
      connections: [],
    };

    workflow.nodes.push(node);
    return node;
  }

  // 노드 연결
  connectNodes(workflowId: string, fromNodeId: string, toNodeId: string): void {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    const fromNode = workflow.nodes.find((n) => n.id === fromNodeId);
    if (fromNode) {
      if (!fromNode.connections) {
        fromNode.connections = [];
      }
      fromNode.connections.push(toNodeId);
    }
  }

  // 워크플로우 실행
  async executeWorkflow(workflowId: string, input?: Record<string, any>): Promise<any> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || !workflow.enabled) {
      throw new Error('Workflow not found or disabled');
    }

    // 트리거 노드 찾기
    const triggerNode = workflow.nodes.find((n) => n.type === 'trigger');
    if (!triggerNode) {
      throw new Error('No trigger node found');
    }

    // 워크플로우 실행 로직 (시뮬레이션)
    let currentNode = triggerNode;
    const result: any[] = [];

    while (currentNode) {
      const nodeResult = await this.executeNode(currentNode, input);
      result.push(nodeResult);

      // 다음 노드로 이동
      if (currentNode.connections && currentNode.connections.length > 0) {
        const nextNodeId = currentNode.connections[0];
        currentNode = workflow.nodes.find((n) => n.id === nextNodeId) || null as any;
      } else {
        break;
      }
    }

    return result;
  }

  // 노드 실행
  private async executeNode(node: WorkflowNode, input?: Record<string, any>): Promise<any> {
    switch (node.type) {
      case 'trigger':
        return { type: 'trigger', data: input || {} };
      case 'action':
        return { type: 'action', result: `Executed: ${node.label}` };
      case 'condition':
        return { type: 'condition', passed: true };
      case 'delay':
        await new Promise((resolve) => setTimeout(resolve, node.config.delay || 1000));
        return { type: 'delay', completed: true };
      default:
        return { type: 'unknown' };
    }
  }

  // 워크플로우 가져오기
  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  // 모든 워크플로우 가져오기
  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  // 워크플로우 삭제
  deleteWorkflow(id: string): boolean {
    return this.workflows.delete(id);
  }
}

export const workflowBuilder = new WorkflowBuilder();

