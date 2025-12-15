/**
 * 위협 인텔리전스 시스템
 * Threat Intelligence
 */

export interface ThreatIndicator {
  id: string;
  type: 'ip' | 'domain' | 'hash' | 'url';
  value: string;
  threatType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  source: string;
  firstSeen: number;
  lastSeen: number;
  description: string;
}

export interface ThreatFeed {
  id: string;
  name: string;
  url?: string;
  enabled: boolean;
  lastUpdated?: number;
  indicators: ThreatIndicator[];
}

// 위협 인텔리전스 시스템
export class ThreatIntelligenceSystem {
  private indicators: Map<string, ThreatIndicator> = new Map();
  private feeds: Map<string, ThreatFeed> = new Map();

  constructor() {
    this.loadDefaultFeeds();
  }

  private loadDefaultFeeds(): void {
    // 기본 위협 지표 (실제로는 외부 피드에서 로드)
    this.addIndicator({
      id: 'ti-1',
      type: 'ip',
      value: '192.0.2.1',
      threatType: 'malware',
      severity: 'high',
      confidence: 85,
      source: 'internal',
      firstSeen: Date.now() - 7 * 24 * 60 * 60 * 1000,
      lastSeen: Date.now(),
      description: '알려진 악성 IP 주소',
    });
  }

  // 위협 지표 추가
  addIndicator(indicator: ThreatIndicator): void {
    const key = `${indicator.type}:${indicator.value}`;
    this.indicators.set(key, indicator);
  }

  // 위협 확인
  checkThreat(type: 'ip' | 'domain' | 'hash' | 'url', value: string): ThreatIndicator | null {
    const key = `${type}:${value}`;
    return this.indicators.get(key) || null;
  }

  // 위협 피드 로드
  async loadFeed(feed: Omit<ThreatFeed, 'indicators'>): Promise<ThreatFeed> {
    // 실제로는 외부 API에서 위협 정보 로드
    // 여기서는 시뮬레이션

    const fullFeed: ThreatFeed = {
      ...feed,
      indicators: [],
      lastUpdated: Date.now(),
    };

    this.feeds.set(feed.id, fullFeed);
    return fullFeed;
  }

  // IOCs (Indicators of Compromise) 검색
  searchIOCs(query: string): ThreatIndicator[] {
    const results: ThreatIndicator[] = [];

    for (const indicator of this.indicators.values()) {
      if (
        indicator.value.toLowerCase().includes(query.toLowerCase()) ||
        indicator.description.toLowerCase().includes(query.toLowerCase()) ||
        indicator.threatType.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push(indicator);
      }
    }

    return results;
  }

  // 위협 통계
  getThreatStats(): {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    recent: number; // 최근 24시간
  } {
    const indicators = Array.from(this.indicators.values());
    const now = Date.now();
    const dayAgo = now - 24 * 60 * 60 * 1000;

    return {
      total: indicators.length,
      byType: indicators.reduce((acc, ind) => {
        acc[ind.type] = (acc[ind.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      bySeverity: indicators.reduce((acc, ind) => {
        acc[ind.severity] = (acc[ind.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recent: indicators.filter((ind) => ind.lastSeen >= dayAgo).length,
    };
  }

  getAllIndicators(limit?: number): ThreatIndicator[] {
    const indicators = Array.from(this.indicators.values());
    indicators.sort((a, b) => b.lastSeen - a.lastSeen);
    return limit ? indicators.slice(0, limit) : indicators;
  }
}

export const threatIntelligenceSystem = new ThreatIntelligenceSystem();

