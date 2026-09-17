import { Database as SqliteDatabase } from 'sqlite3';
import ITable from './tables/ITable';
import SQLMethod from 'Types/main/database/SQLMethod';
import ProfileData   from 'Types/main/database/ProfileData';
import EmployeeData   from 'Types/main/database/EmployeeData';
import CompanyData    from 'Types/main/database/CompanyData';
import DocumentData   from 'Types/main/database/DocumentData';
import DocumentEmployeeData from 'Types/main/database/DocumentEmployeeData';
import DocumentCompanyData from 'Types/main/database/DocumentCompanyData';
import DocumentProfileData from 'Types/main/database/DocumentProfileData';
import GroupDocumentData from 'Types/main/database/GroupDocumentData';
import TableName from 'Types/shared/handler/TableName';

export default interface IDatabase {
  tables: {
    [TableName.PROFILE]: ITable<ProfileData, string>,
    [TableName.EMPLOYEE]: ITable<EmployeeData, string>;
    [TableName.COMPANY]:  ITable<CompanyData, string>;
    [TableName.DOCUMENT]: ITable<DocumentData, string>;
    [TableName.DOCUMENTEMPLOYEE]: ITable<DocumentEmployeeData, string>;
    [TableName.DOCUMENTCOMPANY]: ITable<DocumentCompanyData, string>;
    [TableName.DOCUMENTPROFILE]: ITable<DocumentProfileData, string>;
    [TableName.GROUP]: ITable<GroupDocumentData, string>,
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
