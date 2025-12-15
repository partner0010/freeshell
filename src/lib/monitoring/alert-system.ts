/**
 * 실시간 모니터링 및 알림 시스템
 */

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  source: string;
  timestamp: number;
  resolved: boolean;
  metadata?: Record<string, any>;
}

export interface MonitoringMetric {
  name: string;
  value: number;
  unit: string;
  threshold?: {
    warning: number;
    critical: number;
  };
  trend?: 'up' | 'down' | 'stable';
}

// 알림 시스템
class AlertSystem {
  private alerts: Map<string, Alert> = new Map();
  private listeners: Set<(alert: Alert) => void> = new Set();

  createAlert(alert: Omit<Alert, 'id' | 'timestamp' | 'resolved'>): Alert {
    const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullAlert: Alert = {
      ...alert,
      id,
      timestamp: Date.now(),
      resolved: false,
    };

    this.alerts.set(id, fullAlert);
    this.notifyListeners(fullAlert);
    return fullAlert;
  }

  resolveAlert(id: string): void {
    const alert = this.alerts.get(id);
    if (alert) {
      alert.resolved = true;
      this.notifyListeners(alert);
    }
  }

  getAlerts(filter?: {
    type?: Alert['type'];
    severity?: Alert['severity'];
    resolved?: boolean;
  }): Alert[] {
    let alerts = Array.from(this.alerts.values());

    if (filter?.type) {
      alerts = alerts.filter((a) => a.type === filter.type);
    }
    if (filter?.severity) {
      alerts = alerts.filter((a) => a.severity === filter.severity);
    }
    if (filter?.resolved !== undefined) {
      alerts = alerts.filter((a) => a.resolved === filter.resolved);
    }

    return alerts.sort((a, b) => b.timestamp - a.timestamp);
  }

  subscribe(listener: (alert: Alert) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(alert: Alert): void {
    this.listeners.forEach((listener) => listener(alert));
  }
}

export const alertSystem = new AlertSystem();

// 모니터링 메트릭 수집
export function collectMetrics(): MonitoringMetric[] {
  // 실제로는 성능 API, 서버 메트릭 등에서 수집
  return [
    {
      name: 'Response Time',
      value: 150,
      unit: 'ms',
      threshold: { warning: 200, critical: 500 },
      trend: 'stable',
    },
    {
      name: 'Error Rate',
      value: 0.5,
      unit: '%',
      threshold: { warning: 1, critical: 5 },
      trend: 'down',
    },
    {
      name: 'Memory Usage',
      value: 65,
      unit: '%',
      threshold: { warning: 80, critical: 90 },
      trend: 'up',
    },
    {
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      threshold: { warning: 70, critical: 90 },
      trend: 'stable',
    },
  ];
}

// 임계값 체크 및 알림 생성
export function checkThresholds(metrics: MonitoringMetric[]): void {
  metrics.forEach((metric) => {
    if (!metric.threshold) return;

    if (metric.value >= metric.threshold.critical) {
      alertSystem.createAlert({
        type: 'error',
        severity: 'critical',
        title: `${metric.name} 임계값 초과`,
        message: `${metric.name}이(가) ${metric.value}${metric.unit}로 위험 수준에 도달했습니다`,
        source: 'monitoring',
        metadata: { metric },
      });
    } else if (metric.value >= metric.threshold.warning) {
      alertSystem.createAlert({
        type: 'warning',
        severity: 'high',
        title: `${metric.name} 경고`,
        message: `${metric.name}이(가) ${metric.value}${metric.unit}로 경고 수준입니다`,
        source: 'monitoring',
        metadata: { metric },
      });
    }
  });
}

