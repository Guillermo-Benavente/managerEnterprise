import { verbose, Database as SqliteDatabase } from 'sqlite3';
import { getDb } from '../utils/path';
import { TableProfile } from './tables/profile/TableProfile';
import { TableEmployee } from './tables/employee/TableEmployee';
import { TableCourse } from './tables/course/TableCourse';
import { TableCompany } from './tables/company/TableCompany';
import { TableDocument } from './tables/document/TableDocument';
import { TableEmployeeByDocument } from './tables/employeeByDocument/TableEmployeeByDocument';
import SQLMethod from 'Types/database/SQLMethod';
import IDatabase from './IDatabase';
import TableName from 'Types/handler/TableName';

const sqlite = verbose();

export default class Database implements IDatabase{
    readonly db: Promise<SqliteDatabase>;

    public tables: IDatabase["tables"];

    constructor() {
        const databasePath = getDb();

        this.db = new Promise<SqliteDatabase>((resolve, reject) => {
            const dbInstance = new sqlite.Database(
                databasePath, 
                sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, 
                (err) => { if (err) reject(new Error(err.message)); else resolve(dbInstance); }
            );
        });

        this.tables = {
            [TableName.PROFILE]: new TableProfile(this),
            [TableName.EMPLOYEE]: new TableEmployee(this),
            [TableName.COURSE]: new TableCourse(this),
            [TableName.COMPANY]: new TableCompany(this),
            [TableName.DOCUMENT]: new TableDocument(this),
            [TableName.EMPLOYEEBYDOCUMENT]: new TableEmployeeByDocument(this),
        }
    }

    async getDB(): Promise<SqliteDatabase> {
        return this.db;
    }

    async close(): Promise<string> {
        const db = await this.db;
        return new Promise<string>((resolve, reject) => {
            db.close((err) => {
                if (err) reject(new Error('Error al cerrar la base de datos: ' + err.message));
                else resolve('Base de datos cerrada correctamente.');
            });
        });
    }

    async InitializeDatabaseAsync(): Promise<void> {
        try {
            const db = await this.db;
            const checking = await this.CheckTablesExistAsync();
            if (!checking.exists) await this.CreateTablesAsync(checking.rows);
            await this.executeSQL(db, SQLMethod.RUN, 'PRAGMA foreign_keys = ON;', [], 'Error al habilitar claves foráneas');
        } catch (error) {
            console.error('Error durante la inicialización de la base de datos:', error);
        }
    }

    async executeSQL<T = any>(
        db: SqliteDatabase,
        method: SQLMethod,
        sql: string,
        params: any[] = [],
        errorMsg?: string
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            try {
                const stmt = db.prepare(sql);
                stmt[method](...params, function (err: Error | null, row: any) {
                if (err) {
                    console.error(`${errorMsg}:`, err);
                    reject(err);
                } else resolve(row as T);
                });
                stmt.finalize();
            } catch (err) {
                console.error(`${errorMsg} (excepción):`, err);
                if (err instanceof Error) reject(err);
                else reject(new Error(String(err)));
            }
        });
    }

    async createTable(db: SqliteDatabase, table: string, ddls: string[]): Promise<void> {
        await new Promise<void>((res, rej) =>
            db.run(table, (err) => (err ? rej(err instanceof Error ? err : new Error(String(err))) : res()))
        );

        if (ddls) {
            await Promise.all(
                ddls.map(
                (ddl) =>
                    new Promise<void>((res, rej) =>
                        db.run(ddl, (err) => (err ? rej(err instanceof Error ? err : new Error(String(err))) : res()))
                    )
                )
            );
        }
    }

    async CheckTablesExistAsync(): Promise<{ exists: boolean; rows: Array<{ name: string }> }> {
        const db = await this.db;
        const tables = Object.keys(this.tables);
        const rows = await this.executeSQL(db, SQLMethod.ALL,
            `SELECT name 
                FROM sqlite_master 
                WHERE type='table' AND name IN (${tables.map(() => '?').join(', ')})`,
            tables,
            'Error al verificar la existencia de las tablas'
        );
        return {exists: rows.length === tables.length, rows: rows};
    }

    async CreateTablesAsync(rows: Array<{name: string}>): Promise<void> {
        const existingTables = new Set(rows.map(row => row.name));
        type TableMap = Record<string, { createTable: () => Promise<void> }>;

        const tablesToCreate = Object.fromEntries(
            Object.keys(this.tables).map(
                key => [key, () => (this.tables as TableMap)[key].createTable()]
            )
        );

        for (const [tableName, createTable] of Object.entries(tablesToCreate)) 
            if (!existingTables.has(tableName)) await createTable();
    }
}