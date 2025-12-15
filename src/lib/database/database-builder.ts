/**
 * 데이터베이스 빌더
 * Database Builder
 */

export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'json' | 'relation';

export interface DatabaseField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  unique: boolean;
  defaultValue?: any;
  relation?: {
    table: string;
    field: string;
  };
}

export interface DatabaseTable {
  id: string;
  name: string;
  description?: string;
  fields: DatabaseField[];
  createdAt: Date;
}

export interface DatabaseSchema {
  id: string;
  name: string;
  tables: DatabaseTable[];
  createdAt: Date;
}

// 데이터베이스 빌더
export class DatabaseBuilder {
  private schemas: Map<string, DatabaseSchema> = new Map();

  // 스키마 생성
  createSchema(name: string): DatabaseSchema {
    const schema: DatabaseSchema = {
      id: `schema-${Date.now()}`,
      name,
      tables: [],
      createdAt: new Date(),
    };
    this.schemas.set(schema.id, schema);
    return schema;
  }

  // 테이블 추가
  addTable(schemaId: string, table: Omit<DatabaseTable, 'id' | 'createdAt'>): DatabaseTable {
    const schema = this.schemas.get(schemaId);
    if (!schema) throw new Error('Schema not found');

    const newTable: DatabaseTable = {
      ...table,
      id: `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    schema.tables.push(newTable);
    return newTable;
  }

  // 필드 추가
  addField(schemaId: string, tableId: string, field: Omit<DatabaseField, 'id'>): DatabaseField {
    const schema = this.schemas.get(schemaId);
    if (!schema) throw new Error('Schema not found');

    const table = schema.tables.find(t => t.id === tableId);
    if (!table) throw new Error('Table not found');

    const newField: DatabaseField = {
      ...field,
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    table.fields.push(newField);
    return newField;
  }

  // 스키마 가져오기
  getSchema(id: string): DatabaseSchema | undefined {
    return this.schemas.get(id);
  }

  // 모든 스키마 가져오기
  getAllSchemas(): DatabaseSchema[] {
    return Array.from(this.schemas.values());
  }

  // SQL 생성
  generateSQL(schema: DatabaseSchema): string {
    const sql: string[] = [];

    schema.tables.forEach(table => {
      sql.push(`CREATE TABLE ${table.name} (`);
      const fields: string[] = [];
      
      table.fields.forEach(field => {
        let fieldSQL = `  ${field.name} `;
        
        switch (field.type) {
          case 'string':
            fieldSQL += 'VARCHAR(255)';
            break;
          case 'number':
            fieldSQL += 'INTEGER';
            break;
          case 'boolean':
            fieldSQL += 'BOOLEAN';
            break;
          case 'date':
            fieldSQL += 'DATE';
            break;
          case 'email':
            fieldSQL += 'VARCHAR(255)';
            break;
          case 'url':
            fieldSQL += 'VARCHAR(500)';
            break;
          case 'json':
            fieldSQL += 'JSON';
            break;
        }

        if (field.required) fieldSQL += ' NOT NULL';
        if (field.unique) fieldSQL += ' UNIQUE';
        if (field.defaultValue !== undefined) {
          fieldSQL += ` DEFAULT '${field.defaultValue}'`;
        }

        fields.push(fieldSQL);
      });

      sql.push(fields.join(',\n'));
      sql.push(');\n');
    });

    return sql.join('\n');
  }
}

export const databaseBuilder = new DatabaseBuilder();

