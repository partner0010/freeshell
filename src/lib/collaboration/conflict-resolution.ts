/**
 * 협업 충돌 해결 시스템
 * Conflict Resolution for Real-time Collaboration
 */

export interface Conflict {
  id: string;
  type: 'edit' | 'delete' | 'move';
  userId: string;
  timestamp: number;
  path: string;
  content: string;
  version: number;
}

export interface Operation {
  id: string;
  userId: string;
  timestamp: number;
  type: 'insert' | 'delete' | 'update';
  path: string;
  content?: string;
  position?: number;
  length?: number;
}

export interface Resolution {
  conflictId: string;
  strategy: 'mine' | 'theirs' | 'merge' | 'custom';
  resolvedContent: string;
  resolvedBy: string;
  resolvedAt: number;
}

// 충돌 해결 시스템
export class ConflictResolutionSystem {
  private conflicts: Map<string, Conflict> = new Map();
  private operations: Map<string, Operation> = new Map();
  private resolutions: Map<string, Resolution> = new Map();

  // 충돌 감지
  detectConflict(operation1: Operation, operation2: Operation): Conflict | null {
    // 같은 경로에서 동시에 편집된 경우
    if (
      operation1.path === operation2.path &&
      operation1.userId !== operation2.userId &&
      Math.abs(operation1.timestamp - operation2.timestamp) < 1000
    ) {
      const conflict: Conflict = {
        id: `conflict-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'edit',
        userId: operation1.userId,
        timestamp: Date.now(),
        path: operation1.path,
        content: operation1.content || '',
        version: 1,
      };

      this.conflicts.set(conflict.id, conflict);
      return conflict;
    }

    return null;
  }

  // 자동 충돌 해결
  autoResolve(conflictId: string, strategy: 'mine' | 'theirs' | 'merge' = 'merge'): Resolution {
    const conflict = this.conflicts.get(conflictId);
    if (!conflict) {
      throw new Error('Conflict not found');
    }

    let resolvedContent = '';

    switch (strategy) {
      case 'mine':
        resolvedContent = conflict.content;
        break;
      case 'theirs':
        // 상대방 내용 사용 (실제로는 상대방 내용 가져와야 함)
        resolvedContent = conflict.content;
        break;
      case 'merge':
        resolvedContent = this.mergeContent(conflict);
        break;
    }

    const resolution: Resolution = {
      conflictId,
      strategy,
      resolvedContent,
      resolvedBy: 'system',
      resolvedAt: Date.now(),
    };

    this.resolutions.set(conflictId, resolution);
    return resolution;
  }

  // 3-way merge
  private mergeContent(conflict: Conflict): string {
    // 간단한 3-way merge 시뮬레이션
    // 실제로는 Operational Transform 또는 CRDT 사용
    return conflict.content + '\n<!-- Merged -->\n';
  }

  // 운영 변환 (Operational Transform)
  transformOperation(op1: Operation, op2: Operation): Operation {
    // 같은 위치의 연산 변환
    if (op1.path !== op2.path) return op1;

    if (op1.type === 'insert' && op2.type === 'insert') {
      if (op1.position! < op2.position!) {
        return op1;
      } else {
        return {
          ...op1,
          position: op1.position! + op2.length!,
        };
      }
    }

    return op1;
  }

  // 버전 관리
  getVersion(path: string): number {
    const conflicts = Array.from(this.conflicts.values()).filter((c) => c.path === path);
    return conflicts.length > 0 ? Math.max(...conflicts.map((c) => c.version)) : 0;
  }

  // 충돌 목록
  getConflicts(path?: string): Conflict[] {
    const conflicts = Array.from(this.conflicts.values());
    if (path) {
      return conflicts.filter((c) => c.path === path);
    }
    return conflicts.sort((a, b) => b.timestamp - a.timestamp);
  }

  // 해결된 충돌 목록
  getResolutions(): Resolution[] {
    return Array.from(this.resolutions.values()).sort((a, b) => b.resolvedAt - a.resolvedAt);
  }
}

export const conflictResolutionSystem = new ConflictResolutionSystem();

