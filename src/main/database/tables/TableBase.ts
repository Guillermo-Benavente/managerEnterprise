import ITable from './ITable';
import Database from '../Database';
import SQLMethod from 'Types/database/SQLMethod';
import { Database as SqliteDatabase } from 'sqlite3';

export default abstract class TableBase<T, K> implements ITable<T, K> {
    constructor(protected db: Database) {}
    abstract createTable(): Promise<void>;
    abstract getAll(filterKey?: K): Promise<T[]>;
    abstract getOne(id: K): Promise<T | null>;
    abstract insert(entity: T | T[]): Promise<string[]>;
    abstract update(entity: T): Promise<void>;
    abstract delete(id: K): Promise<void>;
    protected async dbInstance(): Promise<SqliteDatabase> {
        return await this.db.getDB();
    }
    protected async newTable(table: string, ddls: string[]): Promise<void> {
        const db = await this.dbInstance();
        await this.db.createTable(db, table, ddls);
    }
    protected async runSQL<T = any>(
        method: SQLMethod,
        sql: string,
        params: any[] = [],
        errorMsg?: string
    ): Promise<T> {
        const db = await this.dbInstance();
        return this.db.executeSQL<T>(db, method, sql, params, errorMsg);
    }
}