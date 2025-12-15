/**
 * 데이터베이스 쿼리 최적화 시스템
 * Database Query Optimization and Indexing
 */

export interface QueryAnalysis {
  query: string;
  executionTime: number;
  rowsExamined: number;
  rowsReturned: number;
  indexesUsed: string[];
  suggestions: QuerySuggestion[];
  score: number; // 0-100
}

export interface QuerySuggestion {
  type: 'index' | 'join' | 'where' | 'select' | 'limit';
  description: string;
  impact: 'high' | 'medium' | 'low';
  sql?: string;
}

export interface IndexRecommendation {
  table: string;
  columns: string[];
  type: 'primary' | 'unique' | 'index' | 'fulltext';
  reason: string;
  estimatedImprovement: number; // percentage
}

export interface DatabaseStats {
  totalQueries: number;
  slowQueries: number;
  avgExecutionTime: number;
  cacheHitRate: number;
  indexUsage: number;
}

// 데이터베이스 쿼리 최적화 시스템
export class DatabaseQueryOptimizer {
  private queryHistory: QueryAnalysis[] = [];
  private indexes: Map<string, IndexRecommendation[]> = new Map();

  // 쿼리 분석
  analyzeQuery(query: string, executionTime: number, rowsExamined: number, rowsReturned: number): QueryAnalysis {
    const suggestions: QuerySuggestion[] = [];
    let score = 100;

    // WHERE 절 최적화
    if (query.includes('WHERE') && !query.includes('INDEX')) {
      suggestions.push({
        type: 'index',
        description: 'WHERE 절에 인덱스가 없습니다. 인덱스 추가를 고려하세요.',
        impact: 'high',
      });
      score -= 20;
    }

    // SELECT * 최적화
    if (query.includes('SELECT *')) {
      suggestions.push({
        type: 'select',
        description: 'SELECT * 대신 필요한 컬럼만 선택하세요.',
        impact: 'medium',
        sql: query.replace('SELECT *', 'SELECT column1, column2'),
      });
      score -= 15;
    }

    // LIMIT 누락
    if (!query.includes('LIMIT') && query.includes('SELECT')) {
      suggestions.push({
        type: 'limit',
        description: '대량 데이터 조회 시 LIMIT을 사용하세요.',
        impact: 'medium',
        sql: query + ' LIMIT 100',
      });
      score -= 10;
    }

    // JOIN 최적화
    if (query.match(/JOIN/g)?.length && query.match(/JOIN/g)!.length > 3) {
      suggestions.push({
        type: 'join',
        description: 'JOIN이 많습니다. 쿼리를 분리하거나 인덱스를 확인하세요.',
        impact: 'high',
      });
      score -= 25;
    }

    // 느린 쿼리 감지
    if (executionTime > 1000) {
      suggestions.push({
        type: 'where',
        description: '쿼리 실행 시간이 깁니다. 최적화가 필요합니다.',
        impact: 'high',
      });
      score -= 30;
    }

    const analysis: QueryAnalysis = {
      query,
      executionTime,
      rowsExamined,
      rowsReturned,
      indexesUsed: this.extractIndexes(query),
      suggestions,
      score: Math.max(0, score),
    };

    this.queryHistory.push(analysis);
    return analysis;
  }

  // 인덱스 추천
  recommendIndexes(table: string, queries: string[]): IndexRecommendation[] {
    const recommendations: IndexRecommendation[] = [];
    const columnUsage = new Map<string, number>();

    // 쿼리에서 컬럼 사용 빈도 분석
    queries.forEach((query) => {
      const whereMatch = query.match(/WHERE\s+(\w+)/i);
      if (whereMatch) {
        const column = whereMatch[1];
        columnUsage.set(column, (columnUsage.get(column) || 0) + 1);
      }
    });

    // 자주 사용되는 컬럼에 인덱스 추천
    columnUsage.forEach((count, column) => {
      if (count > 5) {
        recommendations.push({
          table,
          columns: [column],
          type: 'index',
          reason: `${count}번 사용됨`,
          estimatedImprovement: Math.min(count * 10, 80),
        });
      }
    });

    this.indexes.set(table, recommendations);
    return recommendations;
  }

  // 쿼리 통계
  getStats(): DatabaseStats {
    const totalQueries = this.queryHistory.length;
    const slowQueries = this.queryHistory.filter((q) => q.executionTime > 1000).length;
    const avgExecutionTime =
      totalQueries > 0
        ? this.queryHistory.reduce((sum, q) => sum + q.executionTime, 0) / totalQueries
        : 0;

    return {
      totalQueries,
      slowQueries,
      avgExecutionTime,
      cacheHitRate: 85, // 시뮬레이션
      indexUsage: 90, // 시뮬레이션
    };
  }

  // 느린 쿼리 목록
  getSlowQueries(threshold: number = 1000): QueryAnalysis[] {
    return this.queryHistory
      .filter((q) => q.executionTime > threshold)
      .sort((a, b) => b.executionTime - a.executionTime);
  }

  private extractIndexes(query: string): string[] {
    const indexes: string[] = [];
    const indexMatch = query.match(/USE INDEX\s*\((\w+)\)/i);
    if (indexMatch) {
      indexes.push(indexMatch[1]);
    }
    return indexes;
  }

  getRecommendations(table?: string): IndexRecommendation[] {
    if (table) {
      return this.indexes.get(table) || [];
    }
    return Array.from(this.indexes.values()).flat();
  }
}

export const databaseQueryOptimizer = new DatabaseQueryOptimizer();

