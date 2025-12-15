/**
 * 버전 비교 및 시각화
 * Version Comparison & Visualization
 */

export interface VersionChange {
  type: 'added' | 'removed' | 'modified';
  path: string;
  oldValue?: string;
  newValue?: string;
  line?: number;
}

export interface VersionDiff {
  version1: string;
  version2: string;
  changes: VersionChange[];
  summary: {
    added: number;
    removed: number;
    modified: number;
  };
}

// 버전 비교 도구
export class VersionComparator {
  // 두 버전 비교
  compareVersions(
    version1: string,
    version2: string,
    content1: string,
    content2: string
  ): VersionDiff {
    const lines1 = content1.split('\n');
    const lines2 = content2.split('\n');

    const changes: VersionChange[] = [];
    const maxLines = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i];
      const line2 = lines2[i];

      if (line1 === undefined) {
        changes.push({
          type: 'added',
          path: 'content',
          newValue: line2,
          line: i + 1,
        });
      } else if (line2 === undefined) {
        changes.push({
          type: 'removed',
          path: 'content',
          oldValue: line1,
          line: i + 1,
        });
      } else if (line1 !== line2) {
        changes.push({
          type: 'modified',
          path: 'content',
          oldValue: line1,
          newValue: line2,
          line: i + 1,
        });
      }
    }

    const summary = {
      added: changes.filter((c) => c.type === 'added').length,
      removed: changes.filter((c) => c.type === 'removed').length,
      modified: changes.filter((c) => c.type === 'modified').length,
    };

    return {
      version1,
      version2,
      changes,
      summary,
    };
  }

  // 파일별 변경사항 추출
  extractFileChanges(diff: VersionDiff, filePath: string): VersionChange[] {
    return diff.changes.filter((change) => change.path === filePath);
  }

  // 통계 생성
  generateStatistics(diff: VersionDiff): {
    totalChanges: number;
    additionRate: number;
    removalRate: number;
    modificationRate: number;
  } {
    const total = diff.summary.added + diff.summary.removed + diff.summary.modified;
    
    return {
      totalChanges: total,
      additionRate: total > 0 ? (diff.summary.added / total) * 100 : 0,
      removalRate: total > 0 ? (diff.summary.removed / total) * 100 : 0,
      modificationRate: total > 0 ? (diff.summary.modified / total) * 100 : 0,
    };
  }
}

export const versionComparator = new VersionComparator();

