/**
 * 보안 사고 대응 시스템 (SOAR)
 * Security Orchestration, Automation, and Response
 */

export interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  category: 'malware' | 'breach' | 'dos' | 'unauthorized' | 'data-leak' | 'other';
  description: string;
  affectedAssets: string[];
  detectedAt: number;
  resolvedAt?: number;
  playbook?: string;
  actions: IncidentAction[];
}

export interface IncidentAction {
  id: string;
  type: 'isolate' | 'block' | 'backup' | 'notify' | 'escalate' | 'recover';
  status: 'pending' | 'running' | 'completed' | 'failed';
  executedAt?: number;
  result?: string;
}

export interface Playbook {
  id: string;
  name: string;
  triggers: string[];
  steps: PlaybookStep[];
}

export interface PlaybookStep {
  id: string;
  name: string;
  action: string;
  condition?: string;
  timeout?: number;
}

// 사고 대응 시스템
export class IncidentResponseSystem {
  private incidents: Map<string, Incident> = new Map();
  private playbooks: Map<string, Playbook> = new Map();

  // 기본 플레이북 생성
  createDefaultPlaybooks(): void {
    // 랜섬웨어 대응 플레이북
    this.addPlaybook({
      id: 'ransomware-response',
      name: '랜섬웨어 대응',
      triggers: ['ransomware', 'encryption'],
      steps: [
        {
          id: 'step-1',
          name: '네트워크 격리',
          action: 'isolate_network',
          timeout: 30000,
        },
        {
          id: 'step-2',
          name: '백업 확인',
          action: 'verify_backup',
          timeout: 60000,
        },
        {
          id: 'step-3',
          name: '관계자 알림',
          action: 'notify_stakeholders',
        },
        {
          id: 'step-4',
          name: '데이터 복구',
          action: 'restore_from_backup',
          condition: 'backup_available',
        },
      ],
    });

    // 데이터 유출 대응 플레이북
    this.addPlaybook({
      id: 'data-breach-response',
      name: '데이터 유출 대응',
      triggers: ['data-leak', 'breach'],
      steps: [
        {
          id: 'step-1',
          name: '유출 차단',
          action: 'block_access',
        },
        {
          id: 'step-2',
          name: '영향 범위 분석',
          action: 'analyze_impact',
        },
        {
          id: 'step-3',
          name: '법적 요구사항 확인',
          action: 'check_compliance',
        },
        {
          id: 'step-4',
          name: '사용자 알림',
          action: 'notify_users',
        },
      ],
    });
  }

  addPlaybook(playbook: Playbook): void {
    this.playbooks.set(playbook.id, playbook);
  }

  // 사고 생성 및 자동 대응
  async createIncident(incident: Omit<Incident, 'id' | 'status' | 'detectedAt' | 'actions'>): Promise<Incident> {
    const fullIncident: Incident = {
      ...incident,
      id: `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'open',
      detectedAt: Date.now(),
      actions: [],
    };

    this.incidents.set(fullIncident.id, fullIncident);

    // 플레이북 자동 실행
    await this.executePlaybook(fullIncident);

    return fullIncident;
  }

  private async executePlaybook(incident: Incident): Promise<void> {
    // 트리거에 맞는 플레이북 찾기
    const playbook = Array.from(this.playbooks.values()).find((pb) =>
      pb.triggers.some((trigger) =>
        incident.title.toLowerCase().includes(trigger) ||
        incident.category.toLowerCase().includes(trigger)
      )
    );

    if (!playbook) {
      // 기본 대응
      incident.actions.push({
        id: 'action-1',
        type: 'escalate',
        status: 'pending',
      });
      return;
    }

    incident.playbook = playbook.id;
    incident.status = 'investigating';

    // 플레이북 단계 실행
    for (const step of playbook.steps) {
      const action: IncidentAction = {
        id: step.id,
        type: this.mapActionType(step.action),
        status: 'running',
      };

      incident.actions.push(action);

      try {
        await this.executeAction(step.action, incident);
        action.status = 'completed';
        action.executedAt = Date.now();
        action.result = 'Success';
      } catch (error) {
        action.status = 'failed';
        action.executedAt = Date.now();
        action.result = String(error);
      }

      // 타임아웃 체크
      if (step.timeout && action.executedAt && (action.executedAt - Date.now()) > step.timeout) {
        action.status = 'failed';
        action.result = 'Timeout';
        break;
      }
    }

    if (incident.actions.every((a) => a.status === 'completed')) {
      incident.status = 'contained';
    }
  }

  private async executeAction(action: string, incident: Incident): Promise<void> {
    // 실제로는 각 액션을 실행
    // 여기서는 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));

    switch (action) {
      case 'isolate_network':
        // 네트워크 격리
        break;
      case 'block_access':
        // 접근 차단
        break;
      case 'verify_backup':
        // 백업 확인
        break;
      case 'restore_from_backup':
        // 백업 복구
        break;
      case 'notify_stakeholders':
        // 관계자 알림
        break;
    }
  }

  private mapActionType(action: string): IncidentAction['type'] {
    if (action.includes('isolate')) return 'isolate';
    if (action.includes('block')) return 'block';
    if (action.includes('backup')) return 'backup';
    if (action.includes('notify')) return 'notify';
    if (action.includes('escalate')) return 'escalate';
    if (action.includes('restore') || action.includes('recover')) return 'recover';
    return 'escalate';
  }

  // 사고 해결
  resolveIncident(incidentId: string): void {
    const incident = this.incidents.get(incidentId);
    if (incident) {
      incident.status = 'resolved';
      incident.resolvedAt = Date.now();
    }
  }

  getIncidents(status?: Incident['status']): Incident[] {
    const incidents = Array.from(this.incidents.values());
    if (status) {
      return incidents.filter((i) => i.status === status);
    }
    return incidents.sort((a, b) => b.detectedAt - a.detectedAt);
  }

  getIncident(id: string): Incident | undefined {
    return this.incidents.get(id);
  }
}

export const incidentResponseSystem = new IncidentResponseSystem();
incidentResponseSystem.createDefaultPlaybooks();

