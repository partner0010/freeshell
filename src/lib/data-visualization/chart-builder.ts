/**
 * 데이터 시각화 및 차트 빌더
 * Data Visualization & Chart Builder
 */

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'radar';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface ChartConfig {
  type: ChartType;
  title: string;
  data: ChartData;
  options?: {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    plugins?: {
      legend?: { display: boolean };
      title?: { display: boolean; text: string };
    };
  };
}

// 차트 빌더
export class ChartBuilder {
  // 차트 생성
  createChart(config: ChartConfig): ChartConfig {
    return {
      ...config,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...config.options,
      },
    };
  }

  // 샘플 데이터 생성
  generateSampleData(type: ChartType): ChartData {
    const labels = ['월', '화', '수', '목', '금', '토', '일'];
    const colors = {
      line: '#3B82F6',
      bar: '#10B981',
      pie: '#8B5CF6',
      area: '#F59E0B',
      scatter: '#EF4444',
      radar: '#06B6D4',
    };

    return {
      labels,
      datasets: [
        {
          label: '데이터',
          data: labels.map(() => Math.floor(Math.random() * 100)),
          backgroundColor: colors[type] + '40',
          borderColor: colors[type],
        },
      ],
    };
  }

  // 데이터 변환 (CSV, JSON 등)
  parseCSV(csv: string): ChartData | null {
    try {
      const lines = csv.trim().split('\n');
      const headers = lines[0].split(',').map((h) => h.trim());
      const data: number[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => parseFloat(v.trim()));
        data.push(...values);
      }

      return {
        labels: headers,
        datasets: [
          {
            label: 'CSV 데이터',
            data,
          },
        ],
      };
    } catch {
      return null;
    }
  }

  // 차트 설정 내보내기
  exportChartConfig(config: ChartConfig): string {
    return JSON.stringify(config, null, 2);
  }
}

export const chartBuilder = new ChartBuilder();

