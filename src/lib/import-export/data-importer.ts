/**
 * 데이터 가져오기/내보내기
 * Data Import/Export
 */

export type ImportFormat = 'csv' | 'excel' | 'json' | 'xml';

export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: string[];
  data?: any[];
}

export interface ExportOptions {
  format: ImportFormat;
  fields?: string[];
  filters?: Record<string, any>;
}

// 데이터 가져오기/내보내기
export class DataImporter {
  // CSV 가져오기
  async importCSV(file: File): Promise<ImportResult> {
    // 파일 검증
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        imported: 0,
        failed: 1,
        errors: [`파일 크기가 너무 큽니다 (최대 ${maxSize / (1024 * 1024)}MB)`],
      };
    }

    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      return {
        success: false,
        imported: 0,
        failed: 1,
        errors: ['CSV 파일만 허용됩니다'],
      };
    }
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const data: any[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      try {
        const values = lines[i].split(',').map(v => v.trim());
        const row: Record<string, string | number | boolean> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        data.push(row);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Line ${i + 1}: ${errorMessage}`);
      }
    }

    return {
      success: errors.length === 0,
      imported: data.length,
      failed: errors.length,
      errors,
      data,
    };
  }

  // JSON 가져오기
  async importJSON(file: File): Promise<ImportResult> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const dataArray = Array.isArray(data) ? data : [data];

      return {
        success: true,
        imported: dataArray.length,
        failed: 0,
        errors: [],
        data: dataArray,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        imported: 0,
        failed: 1,
        errors: [errorMessage],
      };
    }
  }

  // 데이터 내보내기 (CSV)
  exportCSV(data: any[], fields?: string[]): string {
    if (!data || data.length === 0) {
      return '';
    }
    
    const headers = fields || Object.keys(data[0] || {});
    if (headers.length === 0) {
      return '';
    }
    
    const csvRows = [headers.join(',')];

    data.forEach(row => {
      if (row && typeof row === 'object') {
        const values = headers.map(header => {
          const value = row[header] || '';
          return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      }
    });

    return csvRows.join('\n');
  }

  // 데이터 내보내기 (JSON)
  exportJSON(data: any[]): string {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to export JSON: ${errorMessage}`);
    }
  }

  // 데이터 내보내기 (Excel - CSV 형식으로 시뮬레이션)
  exportExcel(data: any[], fields?: string[]): string {
    return this.exportCSV(data, fields);
  }
}

export const dataImporter = new DataImporter();

