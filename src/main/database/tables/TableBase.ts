import ITable from './ITable';
import Database from '../Database';
import SQLMethod from 'Types/main/database/SQLMethod';
import { Database as SqliteDatabase } from 'sqlite3';
import { UUIDv4 } from 'main/utils/uuidCreate';

export default abstract class TableBase<T extends Record<string, any>, K> implements ITable<T, K> {
    protected primaryKey: string = "id";
    constructor(
        protected db: Database,
        protected tableName: string
    ) { }
    abstract createTable(): Promise<void>;

    async getAll(): Promise<T[]> { return this.runSQL(SQLMethod.ALL, `SELECT * FROM ${this.tableName}`); }
    async getOne(id: K): Promise<T | null> { return this.runSQL(SQLMethod.GET, `SELECT * FROM ${this.tableName} WHERE ${String(this.primaryKey)} = ?`, [id]); }
    async insert(entity: T): Promise<string> {
        const id = UUIDv4();
        const cols = ["id", ...Object.keys(entity)];
        const values = [id, ...Object.values(entity)];
        const sql = `INSERT INTO ${this.tableName} (${cols.join(", ")})
                     VALUES (${cols.map(() => "?").join(", ")})`;

        await this.runSQL(SQLMethod.RUN, sql, values, `Error al insertar en ${this.tableName}`);
        return id;
    }
    async insertAll(entities: T[]): Promise<string[]> {
        const results: string[] = [];
        for (const entity of entities) {
            results.push(await this.insert(entity));
        }
        return results;
    }
    async update(entity: T): Promise<void> {
        const id = entity[this.primaryKey];
        const cols = Object.keys(entity).filter(k => k !== String(this.primaryKey));
        const setClause = cols.map(c => `${c} = ?`).join(", ");
        const params = cols.map(c => (entity as any)[c]).concat(id);

        const sql = `UPDATE ${this.tableName}
                 SET ${setClause}
                 WHERE ${String(this.primaryKey)} = ?`;

        await this.runSQL(SQLMethod.RUN, sql, params, `Error al actualizar en ${this.tableName}`);
    }
    async delete(id: K): Promise<void> {
        await this.runSQL(
            SQLMethod.RUN,
            `DELETE FROM ${this.tableName} WHERE ${String(this.primaryKey)} = ?`,
            [id],
            `Error al eliminar de ${this.tableName}`
        );
    }
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