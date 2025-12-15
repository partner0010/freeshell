/**
 * 보고서 빌더
 * Report Builder
 */

export type ReportType = 'table' | 'chart' | 'summary' | 'custom';

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter';

export interface ReportColumn {
  field: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

export interface Report {
  id: string;
  name: string;
  description?: string;
  type: ReportType;
  columns: ReportColumn[];
  filters?: Record<string, any>;
  chartType?: ChartType;
  dataSource: string;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    recipients: string[];
  };
  createdAt: Date;
}

// 보고서 빌더
export class ReportBuilder {
  private reports: Map<string, Report> = new Map();

  // 보고서 생성
  createReport(
    name: string,
    type: ReportType,
    dataSource: string,
    description?: string
  ): Report {
    const report: Report = {
      id: `report-${Date.now()}`,
      name,
      description,
      type,
      columns: [],
      dataSource,
      createdAt: new Date(),
    };
    this.reports.set(report.id, report);
    return report;
  }

  // 컬럼 추가
  addColumn(reportId: string, column: ReportColumn): void {
    const report = this.reports.get(reportId);
    if (!report) throw new Error('Report not found');

    report.columns.push(column);
  }

  // 보고서 생성 (시뮬레이션)
  async generateReport(reportId: string): Promise<any> {
    const report = this.reports.get(reportId);
    if (!report) throw new Error('Report not found');

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 샘플 데이터 생성
    const sampleData = Array.from({ length: 10 }, (_, i) => {
      const row: Record<string, string | number | boolean | Date> = {};
      report.columns.forEach(col => {
        switch (col.type) {
          case 'number':
            row[col.field] = Math.floor(Math.random() * 1000);
            break;
          case 'date':
            row[col.field] = new Date(Date.now() - i * 86400000).toISOString();
            break;
          case 'boolean':
            row[col.field] = Math.random() > 0.5;
            break;
          default:
            row[col.field] = `Sample ${col.field} ${i + 1}`;
        }
      });
      return row;
    });

    return {
      report,
      data: sampleData,
      generatedAt: new Date(),
    };
  }

  // PDF 내보내기 (시뮬레이션)
  exportToPDF(reportId: string): string {
    return `report-${reportId}.pdf`;
  }

  // Excel 내보내기 (시뮬레이션)
  exportToExcel(reportId: string): string {
    return `report-${reportId}.xlsx`;
  }

  // 보고서 가져오기
  getReport(id: string): Report | undefined {
    return this.reports.get(id);
  }

  // 모든 보고서 가져오기
  getAllReports(): Report[] {
    return Array.from(this.reports.values());
  }
}

export const reportBuilder = new ReportBuilder();

