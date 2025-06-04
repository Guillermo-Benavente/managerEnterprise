import { Database as SqliteDatabase } from 'sqlite3';
import ITable from './tables/ITable';
import SQLMethod from 'Types/database/SQLMethod';
import EmployeeData   from 'Types/database/EmployeeData';
import CompanyData    from 'Types/database/CompanyData';
import CourseData     from 'Types/database/CourseData';
import DocumentData   from 'Types/database/DocumentData';
import EmployeeByDocumentData from 'Types/database/EmployeeByDocumentData';
import TableName from 'Types/handler/TableName';

export default interface IDatabase {
  tables: {
    [TableName.EMPLOYEE]: ITable<EmployeeData, string>;
    [TableName.COURSE]:   ITable<CourseData, string>;
    [TableName.COMPANY]:  ITable<CompanyData, string>;
    [TableName.DOCUMENT]: ITable<DocumentData, string>;
    [TableName.EMPLOYEEBYDOCUMENT]: ITable<EmployeeByDocumentData, string>;
  };
  getDB(): Promise<SqliteDatabase>;
  close(): Promise<string>;
  InitializeDatabaseAsync(): Promise<void>;
  executeSQL<T = any>(
    db: SqliteDatabase,
    method: SQLMethod,
    sql: string,
    params?: any[],
    errorMsg?: string
  ): Promise<T>;
  createTable(db: SqliteDatabase, table: string, ddls: string[]): Promise<void>;
  CheckTablesExistAsync(): Promise<{ exists: boolean; rows: Array<{ name: string }> }>;
  CreateTablesAsync(rows: Array<{ name: string }>): Promise<void>;
}
